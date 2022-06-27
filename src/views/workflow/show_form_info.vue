<template>
  <div style="display: flex; flex-direction: column">
    <van-nav-bar :title="title" left-text="返回" left-arrow @click-left="() => this.$router.back(-1)" />
    <Form :readonly="true" :workflowInfoInstanceId="workflowInfoInstanceId" />
    <van-cell-group inset id="footer" style="margin-top: 10px; padding: 10px">
      <van-button type="danger" @click="onCancel" size="small" block round v-if="can_cancel">撤销</van-button>
      <van-button type="info" @click="onReSubmit" size="small" block round v-if="can_re_submit">重新发起</van-button>
    </van-cell-group>
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
// require('@/form_builder/van_file_uploader.js')

import Form from '@/views/workflow/form'
import { Notify } from 'vant'
import { QueryWorkflowInfoInstanceByPk } from '@/graphql/queries/query_workflow_info_instance_by_pk'
import { CancelWorkflowInfoInstance } from '@/graphql/mutation/audit_workflow_info_instance'

export default {
  name: 'ShowFormInfo',
  props: {
    workflowInfoInstanceId: {
      type: String | Number,
      required: true
    }
  },
  apollo: {
    workflowInfoInstance: {
      query: QueryWorkflowInfoInstanceByPk,
      variables() {
        return {
          id: this.workflowInfoInstanceId
        }
      }
    }
  },
  components: {
    Form
  },
  data() {
    return {
      //表单信息
      workflowInfoInstance: null
    }
  },
  methods: {
    onCancel() {
      this.$apollo
        .mutate({
          mutation: CancelWorkflowInfoInstance,
          variables: {
            id: this.workflowInfoInstanceId
          }
        })
        .then(resp => {
          console.log('cancel')
          console.log(resp)
          Notify({ type: 'success', message: `撤销表单成功!` })
          this.$router.push({ name: 'Home' })
        })
    },
    onReSubmit() {
      this.$router.push({
        name: 'StartFormInfo',
        query: {
          refWorkflowInfoInstanceId: this.workflowInfoInstanceId,
          formInfoId: this.workflowInfoInstance.workflow_info.form_info_id
        }
      })
    }
  },
  watch: {},
  computed: {
    title: function () {
      return (this.workflowInfoInstance && this.workflowInfoInstance.name) || ''
    },
    can_cancel: function () {
      if (!this.workflowInfoInstance) return false
      const userId = JSON.parse(localStorage.getItem('CURRENT_USER')).id
      const doneNodes = this.workflowInfoInstance.workflow_info_instance_nodes.filter(ni => ni.state === 'done')
      return (
        userId === this.workflowInfoInstance.starter_id &&
        this.workflowInfoInstance.state === 'processing' &&
        doneNodes.length === 1
      )
    },
    can_re_submit: function () {
      if (!this.workflowInfoInstance) return false
      const userId = JSON.parse(localStorage.getItem('CURRENT_USER')).id
      return (
        userId === this.workflowInfoInstance.starter_id &&
        (this.workflowInfoInstance.state === 'canceled' || this.workflowInfoInstance.state === 'rejected')
      )
    }
  },
  created() {},
  mounted() {}
}
</script>
<style scoped>
</style>