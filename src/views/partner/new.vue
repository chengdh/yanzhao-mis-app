<template>
  <div>
    <van-nav-bar title="新日程" left-text="返回" left-arrow @click-left="() => this.$router.back(-1)" />
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field v-model="form_model.schedule_date" label="选择日期" />
        <van-field v-model="form_model.from_time" label="选择开始时间" />
        <van-field v-model="form_model.to_time" label="选择结束时间" />
      </van-cell-group>

      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit"> 提交 </van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
export default {
  props: {
    schedule_id: Number,
    id: Number
  },
  data() {
    return {
      form_model: {
        schedule_date: null,
        from_time: 0,
        to_time: 0,
        note: ''
      }
    }
  },
  methods: {
    onSubmit() {}
  }
}
</script>
