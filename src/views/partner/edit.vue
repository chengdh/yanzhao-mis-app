<template>
  <div>
    <van-nav-bar title="修改日程日程" left-text="返回" left-arrow @click-left="() => this.$router.back(-1)" />
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field disabled v-model="form_model.schedule_date" label="日期" />
        <van-field disabled v-model="form_model.from_time" label="开始时间" />
        <van-field disabled v-model="form_model.to_time" label="结束时间" />
        <van-field disabled v-model="form_model.developer" label="预约人" />
      </van-cell-group>

      <div style="margin: 16px">
        <van-button round block type="primary" v-if="form_model.developer"> 取消预约 </van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { query_schedule_line_by_pk } from '@/graphql/queries/query_schedule_line_by_pk'
export default {
  props: {
    id: Number
  },
  data() {
    return {
      form_model: {
        schedule_date: null,
        from_time: '',
        to_time: '',
        developer: null,
        note: ''
      }
    }
  },
  methods: {
    onSubmit() {}
  },
  created() {
    this.$apollo
      .query({
        query: query_schedule_line_by_pk,
        variables: {
          id: this.id
        }
      })
      .then(({ data, loading, networkStatus, stale }) => {
        this.form_model.schedule_date = data.schedule_line.for_test_code_schedule.schedule_date
        this.form_model.from_time = data.schedule_line.from_time
        this.form_model.to_time = data.schedule_line.to_time
        if (data.schedule_line.for_test_code_developer) {
          this.form_model.developer =
            data.schedule_line.for_test_code_developer.name +
            '[' +
            data.schedule_line.for_test_code_developer.mobile +
            ']'
        }
      })
  }
}
</script>
