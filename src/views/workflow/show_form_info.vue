<template>
  <div style="display: flex; flex-direction: column">
    <van-nav-bar :title="title" left-text="返回" left-arrow @click-left="() => this.$router.back(-1)" />
    <Form :workflowInfoInstanceId="workflowInfoInstanceId" />
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
      workflowInfoInstance: null,
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