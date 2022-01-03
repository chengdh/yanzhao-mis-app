<template>
  <div>
    <h3>form builder</h3>
    <div id="fb_editor" ref="fb_editor"></div>
  </div>
</template>
<script>
import $ from 'jquery'
window.jQuery = $
window.$ = $

require('jquery-ui-sortable')
require('formBuilder')
require('formBuilder/dist/form-render.min.js')

export default {
  name: 'FormInfo',
  components: {},
  data() {
    return {
      formDataRender:
        '<form-template><fields><field class="form-control" label="Full Name" name="text-input-1459436848806" type="text" subtype="text"></field><field class="form-control" label="Select" name="select-1459436851691" type="select"><option value="option-1">Option 1</option><option value="option-2">Option 2</option></field><field class="form-control" label="Your Message" name="textarea-1459436854560" type="textarea"></field></fields></form-template>',
      formDataBuilder: [
        {
          type: 'header',
          subtype: 'h1',
          label: 'formBuilder in React'
        },
        {
          type: 'paragraph',
          label: 'This is a demonstration of formBuilder running in a React project.'
        }
      ]
    }
  },
  methods: {},
  created() {},
  mounted() {
    let formRenderOpts = {
      formData: this.formDataRender,
      dataType: 'xml'
    }
    $(this.$refs.fb_editor).formRender(formRenderOpts)
  }
}
</script>
<style scoped></style>