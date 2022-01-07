<template>
  <div style="display: flex; flex-direction: column">
    <van-cell-group inset id="form_wrapper">
      <div id="fb_editor" ref="fb_editor"></div>
    </van-cell-group>
    <van-cell-group inset id="user_list">
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
    <van-cell-group inset id="footer">
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

export default {
  name: 'FormInfo',
  props: {
    formInfoId: {
      type: String,
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
      activeIds: []
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
      let o = this.getWorkflowInfoInstanceObject()
      this.$apollo
        .mutate({
          mutation: CreateWorkflowInfoInstance,
          variables: {
            object: o
          }
        })
        .then(data => {
          console.log(data)
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
        name: wfInfo.name,
        note: wfInfo.note,
        form_data_json: this.formInfo.form_info_design.form_json,
        workflow_info_instance_users: {
          data: wfiUsersData
        }
      }
      return object
    }
  },
  watch: {
    formInfo: function (val) {
      if (this.formInfo) {
        let formRenderOpts = {
          formData: this.formInfo.form_info_design.form_json,
          dataType: 'json'
        }
        $(this.$refs.fb_editor).formRender(formRenderOpts)
      }
    }
  },
  computed: {},
  created() {},
  mounted() {}
}
</script>
<style scoped>
</style>