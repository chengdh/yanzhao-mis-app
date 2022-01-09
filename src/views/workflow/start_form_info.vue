<template>
  <div style="display: flex; flex-direction: column">
    <van-nav-bar :title="title" left-text="返回" left-arrow @click-left="() => this.$router.back(-1)" />
    <van-cell-group inset id="form_wrapper" style="margin-top: 10px; padding: 10px">
      <div id="fb_editor" ref="fb_editor"></div>
    </van-cell-group>
    <van-cell-group inset title="流程" id="user_list" style="margin-top: 10px">
      <van-steps direction="vertical" v-if="formInfo">
        <van-step v-for="node in formInfo.workflow_infos[0].workflow_info_nodes" :key="node.id">
          <van-cell center :title="nodeTitle(node)" :label="nodeDescribe(node)" :value="nodeAuditUsersString(node)">
            <template #default>
              <van-icon v-for="u in nodeAuditUsers(node)" :key="u.id" size="small" name="manager-o">
                {{ u.username }}
              </van-icon>
              <div v-if="node.audit_type == 'beginner_select' || node.node_type == 'copy_to'">
                <van-icon v-for="u in selectedUsers[node.id]" :key="u.id" size="small" name="manager-o">
                  {{ u.username }}
                </van-icon>
                <van-button @click="onPopupSelectUser(node)" size="small" icon="plus" />
              </div>
            </template>
          </van-cell>
        </van-step>
      </van-steps>
    </van-cell-group>
    <van-cell-group inset id="footer" style="margin-top: 10px">
      <van-button type="primary" @click="onCreate" size="small" block round>提交</van-button>
    </van-cell-group>
    <van-popup v-model="showSelectUser" @closed="onPopupClosed" closeable close-icon="close" position="bottom">
      <van-tree-select
        v-if="orgs"
        :items="orgs"
        :active-id.sync="activeIds"
        height="600"
        :main-active-index.sync="activeIndex"
      />
    </van-popup>
  </div>
</template>
<script>
import $ from 'jquery'
window.jQuery = $
window.$ = $

require('jquery-ui-sortable')
require('formBuilder')
require('formBuilder/dist/form-render.min.js')
require('@/form_builder/num2rmb.js')
// require('@/form_builder/van_file_uploader.js')

import QueryFormInfoByPk from '@/graphql/queries/query_form_info_by_pk'
import QueryOrgs from '@/graphql/queries/query_orgs'
import QueryUsers from '@/graphql/queries/query_users'
import CreateWorkflowInfoInstance from '@/graphql/mutation/create_workflow_info_instance'
import gql from 'graphql-tag'
import { Toast, Notify } from 'vant'
import moment from 'moment'

export default {
  name: 'FormInfo',
  props: {
    formInfoId: {
      type: String | Number,
      required: true
    }
  },
  apollo: {
    formInfo: {
      query: QueryFormInfoByPk,
      variables() {
        return {
          formInfoId: this.formInfoId
        }
      }
    },
    orgs: {
      query: QueryOrgs
    }
  },
  components: {},
  data() {
    return {
      //表单信息
      formInfo: null,
      orgs: null,

      //已选择的用户信息,nodeId => userId
      selectedUserIds: {},
      selectedUsers: {},
      readonly: false,
      showSelectUser: false,
      activeIndex: 1,
      activeNodeId: null,
      activeIds: [],
      formRenderInstance: null
    }
  },
  methods: {
    //节点类型描述
    nodeTypeDes(node) {
      let nodeTypeDes = null
      switch (node.node_type) {
        case 'audit':
          nodeTypeDes = '审批'
          break
        case 'operate':
          nodeTypeDes = '操作'
          break
        case 'copy_to':
          nodeTypeDes = '抄送'
          break
        default:
          break
      }
      return nodeTypeDes
    },

    auditModeDes(node) {
      let auditModeDes = null
      switch (node.audit_mode) {
        case 'audit_mode_and':
          auditModeDes = '会签'
          break
        case 'audit_mode_or':
          auditModeDes = '任意签'
          break
        default:
          break
      }
      return auditModeDes
    },

    //节点title
    nodeTitle(node) {
      let ret = node.name || this.nodeTypeDes(node)
      return ret
    },

    //节点描述
    nodeDescribe(node) {
      return `${this.nodeAuditUsers(node).length}人${this.auditModeDes(node)}`
    },

    //节点审批用户
    nodeAuditUsers(node) {
      let node_users = node.workflow_info_node_users
      let users = node_users.map(nu => nu.user)
      for (let node_role of node.workflow_info_node_roles) {
        let users_role = node_role.role_oa.role_oa_users.map(roa_u => roa_u.user)
        users = [...users, ...users_role]
      }
      return users
    },
    nodeAuditUsersString(node) {
      let users = this.nodeAuditUsers(node)
        .map(u => u.username)
        .join(',')
      return users
    },
    //弹出的用户选择窗口
    onPopupSelectUser(node) {
      this.showSelectUser = true
      let nodeId = node.id
      this.activeNodeId = nodeId
      if (this.activeNodeId) {
        let ids = this.selectedUserIds[this.activeNodeId]
        if (ids) this.activeIds = [...ids]
      }
    },
    onPopupClosed() {
      let _this = this
      if (this.activeNodeId) {
        this.$apollo
          .query({
            query: QueryUsers,
            variables: { ids: this.activeIds }
          })
          .then(data => {
            _this.selectedUsers[_this.activeNodeId] = data.data.users
            _this.selectedUserIds[_this.activeNodeId] = [...this.activeIds]
            _this.activeIds = []
          })
      }
    },
    onCreate() {
      if (!this.validateRequiredUser()) {
        Toast.fail('请设置用户')
        return
      }
      if (!this.validateForm()) {
        Toast.fail('请输入非空字段')
        return
      }

      let o = this.getWorkflowInfoInstanceObject()
      this.$apollo
        .mutate({
          mutation: CreateWorkflowInfoInstance,
          variables: {
            object: o
          }
        })
        .then(data => {
          this.$apollo
            .mutate({
              mutation: gql`
                mutation buildNextNodeInstance($id: Int!, $model: String!, $method: String!) {
                  call_kw(arg: { id: $id, model: $model, method: $method }) {
                    result
                  }
                }
              `,
              variables: {
                id: data.data.workflow_info_instance.id,
                model: 'workflow_info_instance',
                method: 'build_next_node_instance'
              }
            })
            .then(data => {
              console.log(data)
              Notify({ type: 'success', message: `提交${this.title}成功!` })
              this.$router.push({ name: 'Home' })
            })
        })
    },
    getWorkflowInfoInstanceObject: function () {
      let wfInfo = this.formInfo.workflow_infos[0]
      let wfiUsersData = []
      for (const [nId, uIds] of Object.entries(this.selectedUserIds)) {
        let linesData = uIds.map(uId => ({ user_id: uId }))
        wfiUsersData.push({
          workflow_info_node_id: nId,
          workflow_info_instance_user_lines: {
            data: linesData
          }
        })
      }
      let object = {
        workflow_info_id: wfInfo.id,
        name: this.formInfo.name,
        note: wfInfo.note,
        form_data_json: JSON.stringify(this.formRenderInstance.userData),
        starter_id: JSON.parse(localStorage.getItem('CURRENT_USER')).id,
        start_datetime: moment(),
        workflow_info_instance_users: {
          data: wfiUsersData
        }
      }
      return object
    },

    //表单提交时验证
    validateForm() {
      let validated = true
      let userData = this.formRenderInstance.userData
      for (let d of userData) {
        if (d.required && d.userData[0] == '') {
          return false
        }
      }
      return validated
    },

    //验证是否设置了审批用户
    validateRequiredUser() {
      let validated = true
      let ids = this.requireNodeIds
      //验证是否设置了自选用户
      for (let nId of ids) {
        let userIds = this.selectedUserIds[nId]
        if (!userIds) {
          return false
        }
      }
      return validated
    }
  },
  watch: {
    formInfo: function (val) {
      if (this.formInfo) {
        let formRenderOpts = {
          formData: this.formInfo.form_info_design.form_json,
          dataType: 'json'
        }
        this.formRenderInstance = $(this.$refs.fb_editor).formRender(formRenderOpts)
      }
    }
  },
  computed: {
    title: function () {
      return (this.formInfo && this.formInfo.name) || ''
    },
    //发起表单时必须手动选择审批人的节点
    requireNodes: function () {
      let ret = []
      if (this.formInfo) {
        ret = this.formInfo.workflow_infos[0].workflow_info_nodes.filter(
          n => n.audit_type == 'beginner_select' || n.audit_type == 'copy_to'
        )
      }
      return ret
    },

    requireNodeIds: function () {
      let ret = []
      let nodes = this.requireNodes
      ret = nodes.map(n => n.id)
      return ret
    }
  },
  created() {},
  mounted() {}
}
</script>
<style scoped>
</style>