<template>
  <div style="display: flex; flex-direction: column">
    <van-nav-bar :title="title" left-text="返回" left-arrow @click-left="() => this.$router.back(-1)" />
    <van-cell-group inset id="form_wrapper" style="margin-top: 10px; padding: 10px" v-if="orgs">
      <div id="form_render" ref="fb_editor" :data-departments="JSON.stringify(orgs)"></div>
    </van-cell-group>
    <van-cell-group inset title="附件" style="margin-top: 10px; padding: 10px">
      <van-uploader multiple v-model="fileList" accept=".doc,.docx,.xls,.xlsx,.pdf,image/*" />
    </van-cell-group>
    <van-cell-group inset title="流程" id="user_list" style="margin-top: 10px">
      <van-steps direction="vertical" v-if="formInfo">
        <van-step v-for="node in execNodes" :key="node.id">
          <van-cell center :title="nodeTitle(node)" :label="nodeDescribe(node)" :value="nodeAuditUsersString(node)">
            <template #default>
              <van-icon v-for="(u, i) in nodeAuditUsers(node)" :key="`${u.id}_${i}`" size="small" name="manager-o">
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
    <van-cell-group inset id="footer" style="margin-top: 10px; padding: 10px">
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
require('@/form_builder/select.department.js')

import QueryFormInfoByPk from '@/graphql/queries/query_form_info_by_pk'
import { GetWfExecNodes, GetWfNodeByPk } from '@/graphql/queries/get_workflow_instance_exec_nodes'
import { QueryWorkflowInfoInstanceByPk } from '@/graphql/queries/query_workflow_info_instance_by_pk'
import QueryOrgs from '@/graphql/queries/query_orgs'
import QueryUsers from '@/graphql/queries/query_users'
import { getUserHeader } from '@/graphql/queries/query_orgs'
import CreateWorkflowInfoInstance from '@/graphql/mutation/create_workflow_info_instance'
import { uploadFiles } from '@/api/file_upload'
import gql from 'graphql-tag'
import { Toast, Notify } from 'vant'
import moment from 'moment'

export default {
  name: 'StartFormInfo',
  props: {
    formInfoId: {
      type: [String, Number],
      required: true
    },
    refWorkflowInfoInstanceId: {
      type: [String, Number],
      default: null
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
    },
    userHeader: {
      query: getUserHeader,
      variables() {
        return {
          id: JSON.parse(localStorage.getItem('CURRENT_USER')).id
        }
      }
    }
  },
  components: {},
  data() {
    return {
      //表单信息
      formInfo: null,
      execNodes: [],
      result: null,
      orgs: null,
      userHeader: null,
      fileList: [],
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
    //获取工作流执行节点
    get_exec_nodes() {
      let self = this
      const userId = JSON.parse(localStorage.getItem('CURRENT_USER')).id
      this.$apollo
        .mutate({
          mutation: GetWfExecNodes,
          variables: {
            formInfoId: this.formInfoId + '',
            userId: userId + ''
          }
        })
        .then(resp => {
          const nodes = JSON.parse(resp.data.call_kw.result)
          return nodes
          // this.execNodes = JSON.parse(resp.data.call_kw.result)
        })
        .then(nodes => {
          for (const n of nodes) {
            self.$apollo
              .query({
                query: GetWfNodeByPk,
                variables: {
                  id: n.id
                }
              })
              .then(resp => {
                const node = resp.data.node
                self.execNodes.push(node)
              })
          }
        })
    },
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
      const ret = node.name || this.nodeTypeDes(node)
      return ret
    },

    //节点描述
    nodeDescribe(node) {
      return `${this.nodeAuditUsers(node).length}人${this.auditModeDes(node)}`
    },

    //节点审批用户
    nodeAuditUsers(node) {
      const node_users = node.workflow_info_node_users

      let users = node_users.map(nu => nu.user)
      for (const node_role of node.workflow_info_node_roles) {
        const users_role = node_role.role_oa.role_oa_users.map(roa_u => roa_u.user)
        users = [...users, ...users_role]
      }
      //TODO: 直接主管审批
      if (node.node_type === 'audit' && node.audit_type === 'department_leader_1_level') {
        //查找部门主管
        if (this.userHeader) {
          const header = this.userHeader.org.header
          if (header) users = [header]
        }
      }
      return users
    },
    nodeAuditUsersString(node) {
      const users = this.nodeAuditUsers(node)
      const ret = users.map(u => u.username).join(',')
      return ret
    },
    //弹出的用户选择窗口
    onPopupSelectUser(node) {
      this.showSelectUser = true
      const nodeId = node.id
      this.activeNodeId = nodeId
      if (this.activeNodeId) {
        const ids = this.selectedUserIds[this.activeNodeId]
        if (ids) this.activeIds = [...ids]
      }
    },
    onPopupClosed() {
      const _this = this
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

      const o = this.getWorkflowInfoInstanceObject()
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
              //上传附件
              const retData = JSON.parse(data.data.call_kw.result)
              const files = this.fileList.map(f => f.file)
              if (files.length > 0) {
                uploadFiles(retData.workflow_info_instance_id, 'WorkflowInfoInstance', files).then(data => {})
              }
              return data
            })
            .then(data => {
              Notify({ type: 'success', message: `提交${this.title}成功!` })
              this.$router.push({ name: 'Home' })
            })
        })
    },
    getWorkflowInfoInstanceObject() {
      const wfInfo = this.formInfo.workflow_infos[0]
      const wfiUsersData = []
      for (const [nId, uIds] of Object.entries(this.selectedUserIds)) {
        const linesData = uIds.map(uId => ({ user_id: uId }))
        wfiUsersData.push({
          workflow_info_node_id: nId,
          workflow_info_instance_user_lines: {
            data: linesData
          }
        })
      }

      //处理直接主管审批
      const headerAuditNodes = this.formInfo.workflow_infos[0].workflow_info_nodes.filter(
        node => node.node_type === 'audit' && node.audit_type === 'department_leader_1_level'
      )

      for (const n of headerAuditNodes) {
        if (this.userHeader) {
          const header = this.userHeader.org.header
          wfiUsersData.push({
            workflow_info_node_id: n.id,
            workflow_info_instance_user_lines: {
              data: [{ user_id: header.id }]
            }
          })
        }
      }
      const object = {
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
      const userData = this.formRenderInstance.userData
      for (const d of userData) {
        if (d.required && d.userData[0] === '') {
          return false
        }
      }
      return true
    },

    //验证是否设置了审批用户
    validateRequiredUser() {
      const ids = this.requireNodeIds
      //验证是否设置了自选用户
      for (const nId of ids) {
        const userIds = this.selectedUserIds[nId]
        if (!userIds) {
          return false
        }
      }
      return true
    }
  },
  watch: {
    formInfo: function (val) {
      if (this.formInfo) {
        const formRenderOpts = {
          formData: this.formInfo.form_info_design.form_json,
          dataType: 'json'
        }

        this.formRenderInstance = $(this.$refs.fb_editor).formRender(formRenderOpts)
        if (this.refWorkflowInfoInstanceId) {
          this.$apollo
            .query({
              query: QueryWorkflowInfoInstanceByPk,
              variables: {
                id: this.refWorkflowInfoInstanceId
              }
            })
            .then(resp => {
              console.log(resp.data)
              formRenderOpts.formData = resp.data.workflowInfoInstance.form_data_json
              this.formRenderInstance = $(this.$refs.fb_editor).formRender(formRenderOpts)
            })
        }
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
          n => n.audit_type === 'beginner_select' || n.audit_type === 'copy_to'
        )
      }
      return ret
    },

    requireNodeIds: function () {
      let ret = []
      const nodes = this.requireNodes
      ret = nodes.map(n => n.id)
      return ret
    }
  },
  created() {
    this.get_exec_nodes()
  },
  mounted() {}
}
</script>
<style scoped>
</style>