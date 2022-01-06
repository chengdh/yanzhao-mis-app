<template>
  <van-cell-group style="display: flex; flex-direction: column">
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
              <van-button
                v-if="node.audit_type == 'beginner_select' || node.node_type == 'copy_to'"
                size="small"
                icon="plus"
              />
            </template>
          </van-cell>
        </van-step>
      </van-steps>
    </van-cell-group>
    <van-cell-group inset id="footer">
      <van-button type="primary" size="small" block round>提交</van-button>
    </van-cell-group>
  </van-cell-group>
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

import gql from 'graphql-tag'
import QueryFormInfoByPk from '@/graphql/queries/query_form_info_by_pk'

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
    }
  },
  components: {},
  data() {
    return {
      //表单信息
      formInfo: null,
      //发起表单用户信息
      workflow_info_instance_users: {},
      readonly: false
    }
  },
  computed: {},
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
  computed: {
    title() {
      if (this.formInfo) {
        return this.formInfo.name
      } else {
        return ''
      }
    }
  },
  created() {},
  mounted() {}
}
</script>
<style scoped>
</style>