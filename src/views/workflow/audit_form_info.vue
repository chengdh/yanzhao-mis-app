<template>
  <div>
    <van-nav-bar :title="title" left-text="返回" left-arrow @click-left="() => this.$router.back(-1)" />
    <div v-if="workflowInfoNodeInstanceOperate">
      <Form :readonly="true" :workflowInfoInstanceId="workflowInfoInstance.id" />
    </div>
    <div v-else>
      <van-loading size="24px" vertical>加载中...</van-loading>
    </div>
    <van-cell-group inset title="审批">
      <van-field v-model="note" type="textarea" placeholder="输入审批意见"></van-field>
    </van-cell-group>

    <van-cell-group inset style="display: flex; justify-content: center">
      <div style="margin: 10px">
        <van-button type="danger" round size="small" :disabled="processing" @click="onReject">
          <van-icon name="cross" />
          拒绝
        </van-button>
      </div>

      <div style="margin: 10px">
        <van-button type="primary" round size="small" :disabled="processing" @click="onAudit">
          <van-icon name="success" />
          通过
        </van-button>
      </div>
    </van-cell-group>
  </div>
</template>
<script>
import { Toast, Notify } from 'vant'
import Form from '@/views/workflow/form'
import { QueryWorkflowInfoNodeInstanceOperateByPk } from '@/graphql/queries/query_workflow_info_node_instance_operates'
import {
  AuditWorkflowInfoNodeInstanceOperate,
  RejectWorkflowInfoNodeInstanceOperate
} from '@/graphql/mutation/audit_workflow_info_instance'

export default {
  name: 'AuditFormInfo',
  props: {
    workflowInfoNodeInstanceOperateId: {
      type: String | Number,
      required: true
    }
  },
  apollo: {
    workflowInfoNodeInstanceOperate: {
      query: QueryWorkflowInfoNodeInstanceOperateByPk,
      variables() {
        return {
          id: this.workflowInfoNodeInstanceOperateId
        }
      }
    }
  },
  components: {
    Form
  },
  data() {
    return {
      note: '',
      processing: false
    }
  },
  methods: {
    //审批通过
    onAudit() {
      this.processing = true
      this.$apollo
        .mutate({
          mutation: AuditWorkflowInfoNodeInstanceOperate,
          variables: { id: parseInt(this.workflowInfoNodeInstanceOperateId), note: this.note }
        })
        .then(data => {
          Notify({ type: 'success', message: `审批通过!` })
          this.$router.back()
        })
    },

    //审批拒绝
    onReject() {
      this.processing = true
      this.$apollo
        .mutate({
          mutation: RejectWorkflowInfoNodeInstanceOperate,
          variables: { id: parseInt(this.workflowInfoNodeInstanceOperateId), note: this.note }
        })
        .then(data => {
          Notify({ type: 'success', message: `已拒绝!` })
          this.$router.back()
        })
    }
  },
  watch: {},
  computed: {
    title: function () {
      return (this.workflowInfoInstance && this.workflowInfoInstance.name) || ''
    },
    workflowInfoInstance: function () {
      return (
        this.workflowInfoNodeInstanceOperate &&
        this.workflowInfoNodeInstanceOperate.workflow_info_node_instance.workflow_info_instance
      )
    }
  },
  created() {},
  mounted() {}
}
</script>
<style scoped>
</style>