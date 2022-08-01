<template>
  <div>
    <van-nav-bar :title="title" right-text="新建" @click-right="newSchedule" />
    <van-cell
      v-for="l in schedule_lines"
      :key="l.id"
      :value="l.for_test_code_schedule.for_test_code_partner.name"
      :title="l.for_test_code_schedule.schedule_date"
      :label="format_schedule_line_title(l)"
      is-link
      :to="{ name: 'DeveloperEdit', params: { id: l.id } }"
    ></van-cell>
  </div>
</template>
<script>
import { query_schedule_for_developer } from '@/graphql/queries/query_schedule_for_developer'
export default {
  data() {
    return {
      schedule_lines: [],
      current_user: JSON.parse(localStorage.getItem('CURRENT_USER'))
    }
  },
  methods: {
    format_schedule_line_title(l) {
      return `${l.from_time}~${l.to_time}`
    },
    format_schedule_line_val(l) {
      if (l.for_test_code_developer) {
        return l.for_test_code_developer.name
      } else {
        return '无预约'
      }
    },
    newSchedule() {
      this.$router.push({ name: 'DeveloperNew' })
    }
  },
  computed: {
    title() {
      return this.current_user.name + '-日程表'
    }
  },
  created() {
    this.$apollo
      .query({
        query: query_schedule_for_developer,
        variables: {
          developer_id: this.current_user.id
        }
      })
      .then(({ data, loading, networkStatus, stale }) => {
        this.schedule_lines = data.for_test_code_scheduleline
      })
  }
}
</script>
