<template>
  <div>
    <van-nav-bar :title="title" left-text="返回" left-arrow @click-left="() => this.$router.back(-1)" />
    <Form :workflowInfoInstanceId="workflowInfoInstanceId" />
    <van-cell-group inset title="审批">
      <van-field type="textarea" placeholder="输入审批意见"></van-field>
    </van-cell-group>

    <van-cell-group inset style="display: flex; justify-content: center">
      <div style="margin: 10px">
        <van-button type="danger" round>
          <van-icon name="cross" />
          拒绝
        </van-button>
      </div>

      <div style="margin: 10px">
        <van-button type="primary" round>
          <van-icon name="success" />
          通过
        </van-button>
      </div>
    </van-cell-group>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import Form from '@/views/workflow/form'
import { QueryWorkflowInfoInstanceByPk } from '@/graphql/queries/query_workflow_info_instance_by_pk'

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