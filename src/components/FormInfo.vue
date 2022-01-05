<template>
  <van-cell-group inset>
      <div id="fb_editor" ref="fb_editor"></div>
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

import gql from 'graphql-tag'

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
      query: gql`
        query FormInfoByPkQuery($formInfoId: bigint!) {
          formInfo: yws_form_infos_by_pk(id: $formInfoId) {
            form_info_design {
              form_json
            }
            name
            note
          }
        }
      `,
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
      formInfo: null,
      readonly: false
    }
  },
  methods: {},
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
  created() {},
  mounted() {}
}
</script>
<style scoped></style>