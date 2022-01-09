<template>
  <div>
    <van-cell-group inset id="form_wrapper" style="margin-top: 10px; padding: 10px">
      <div id="fb_editor" ref="fb_editor"></div>
    </van-cell-group>
    <van-cell-group inset title="流程" style="margin-top: 10px">
      <van-steps direction="vertical" v-if="workflowInfoInstance">
        <van-step>
          <van-cell
            center
            title="发起"
            :label="workflowInfoInstance.starter.username"
            :value="workflowInfoInstance.start_datetime | moment('from')"
          />
        </van-step>

        <van-step v-for="wfiNode in workflowInfoInstance.workflowInfoInstanceNodes" :key="wfiNode.id">
          <van-cell-group :title="wfiNode.name">
            <van-cell
              center
              v-for="op in wfiNode.workflow_info_node_instance_operates"
              :key="op.id"
              :title="op.user.username"
              :label="op.state"
              :value="op.audit_date | moment('from')"
            />
          </van-cell-group>
        </van-step>
      </van-steps>
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

export default {
  name: 'Form',
  props: {
    workflowInfoInstance: {
      type: Object,
      required: true
    }
  },
  components: {},
  data() {
    return {
      formRenderInstance: null,
      readony: true
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
  mounted() {
    let formRenderOpts = {
      formData: this.workflowInfoInstance.form_data_json,
      dataType: 'json'
    }
    this.formRenderInstance = $(this.$refs.fb_editor).formRender(formRenderOpts)
    $(this.$refs.fb_editor).find('input').attr('disabled', this.readonly)
    $(this.$refs.fb_editor).find('textarea').attr('disabled', this.readonly)
    $(this.$refs.fb_editor).find('select').attr('disabled', this.readonly)
  }
}
</script>
<style scoped>
</style>