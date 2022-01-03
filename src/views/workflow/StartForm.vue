<template>
  <div class="wrapper">
    <van-nav-bar
      title="标题"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div ref="formRender"></div>
  </div>
</template>
<script>
export default {
    name: "StartForm",
    components: {},
    props: {
        form_info_id: {
            type: Number,
            required: true
        } 
    },
    data() {
        return {}
    },
    methods: {},

}
</script>
<style scoped></style>