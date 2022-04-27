<template>
  <div>
    <van-cell-group inset id="form_wrapper" style="margin-top: 10px; padding: 10px">
      <div id="form_render" ref="fb_editor" data-departments='[{label: "test",value: "test"}]'></div>
    </van-cell-group>
    <van-cell-group inset title="附件" style="margin-top: 10px; padding: 10px">
      <van-image v-for="(f, i) in fileListOrigin" :key="i" :src="f">
        <template v-slot:error>加载失败</template>
      </van-image>
    </van-cell-group>

    <van-cell-group inset title="流程" style="margin-top: 10px">
      <van-steps direction="vertical" v-if="workflowInfoInstance" active="99">
        <van-step v-for="wfiNode in workflowInfoInstance.workflow_info_instance_nodes" :key="wfiNode.id">
          <van-cell center :title="wfiNode.name" />

          <van-cell
            center
            v-for="op in wfiNode.workflow_info_node_instance_operates"
            :key="op.id"
            title=""
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
import { getUploadFiles } from '@/api/file_upload'
import { baseURL } from '@/config'
require('jquery-ui-sortable')
require('formBuilder')
require('formBuilder/dist/form-render.min.js')
require('@/form_builder/num2rmb.js')
require('@/form_builder/select.department.js')

export default {
  name: 'Form',
  props: {
    workflowInfoInstanceId: {
      type: Number | String,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {
      formRenderInstance: null,
      fileListThumb: [],
      fileListOrigin: []
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
      //获取附件
      const _this = this
      getUploadFiles(this.workflowInfoInstanceId, 'WorkflowInfoInstance').then(data => {
        _this.fileListThumb = data.result.thumb.map(f => `${baseURL}/${f}`)
        _this.fileListOrigin = data.result.origin.map(f => `${baseURL}/${f}`)
      })
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