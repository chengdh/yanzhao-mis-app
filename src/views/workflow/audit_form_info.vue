<template>
  <div>
    <van-nav-bar :title="title" left-text="返回" left-arrow @click-left="() => this.$router.back(-1)" />
    <Form
      v-if="workflowInfoNodeInstanceOperate"
      :readonly="true"
      :workflowInfoInstanceId="workflowInfoNodeInstanceOperate.workflow_info_node_instance.id"
    />
    <van-loading v-else size="24px" vertical>加载中...</van-loading>
    <van-cell-group inset title="审批">
      <van-field type="textarea" placeholder="输入审批意见"></van-field>
    </van-cell-group>

    <van-cell-group inset style="display: flex; justify-content: center">
      <div style="margin: 10px">
        <van-button type="danger" round size="small">
          <van-icon name="cross" />
          拒绝
        </van-button>
      </div>

      <div style="margin: 10px">
        <van-button type="primary" round size="small">
          <van-icon name="success" />
          通过
        </van-button>
      </div>
    </van-cell-group>
  </div>
</template>
<script>
import Form from '@/views/workflow/form'
import { QueryWorkflowInfoNodeInstanceOperateByPk } from '@/graphql/queries/query_workflow_info_node_instance_operates'

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
      //表单信息
      workflowInfoInstance: null
    }
  },
  methods: {},
  watch: {},
  computed: {
    title: function () {
      return (this.workflowInfoInstance && this.workflowInfoInstance.name) || ''
    }
  },
  created() {},
  mounted() {}
}
</script>
<style scoped>
</style>