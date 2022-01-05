<template>
  <div class="wrapper">
    <van-nav-bar title="标题" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div ref="formRender"></div>
  </div>
</template>
<script>
export default {
  name: 'StartForm',
  components: {},
  props: {
    formInfoId: {
      type: Number,
      required: true
    },
    title: {
      type: String
    }
  },
  apollo: {},
  data() {
    return {
      formInfo: null,
      readOnly: false,
    }
  },
  methods: {},
  created(){},
  mounted(){}
}
</script>
<style scoped></style>