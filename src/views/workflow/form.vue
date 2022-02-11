<template>
  <div>
    <van-cell-group inset id="form_wrapper" style="margin-top: 10px; padding: 10px">
      <div id="fb_editor" ref="fb_editor"></div>
    </van-cell-group>
    <van-cell-group inset title="流程" style="margin-top: 10px">
      <van-steps direction="vertical" v-if="workflowInfoInstance">
        <van-step v-for="wfiNode in workflowInfoInstance.workflow_info_instance_nodes" :key="wfiNode.id">
            <van-cell
              center
              v-for="op in wfiNode.workflow_info_node_instance_operates"
              :key="op.id"
              :title="wfiNode.name"
              :label="op.user.username"
              :value="op.audit_date | moment('from')"
            />
        </van-step>
      </van-steps>
    </van-cell-group>
  </div>
</template>
<script>
import $ from 'jquery'
window.jQuery = $
window.$ = $

import { QueryWorkflowInfoInstanceByPk } from '@/graphql/queries/query_workflow_info_instance_by_pk'
require('jquery-ui-sortable')
require('formBuilder')
require('formBuilder/dist/form-render.min.js')
require('@/form_builder/num2rmb.js')
require('@/form_builder/file_uploader.js')

export default {
  name: 'Form',
  props: {
    workflowInfoInstanceId: {
      type: Number | String,
      required: true
    },
    readonly : {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {
      formRenderInstance: null,
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
  methods: {},
  watch: {
    workflowInfoInstance: function () {
      let formRenderOpts = {
        formData: this.workflowInfoInstance.form_data_json,
        dataType: 'json'
      }
      this.formRenderInstance = $(this.$refs.fb_editor).formRender(formRenderOpts)
      $(this.$refs.fb_editor).find('input').attr('disabled', this.readonly)
      $(this.$refs.fb_editor).find('textarea').attr('disabled', this.readonly)
      $(this.$refs.fb_editor).find('select').attr('disabled', this.readonly)
    }
  },
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