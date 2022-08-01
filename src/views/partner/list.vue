<template>
  <div>
    <van-nav-bar :title="title" right-text="新建" @click-right="newSchedule" />
    <van-cell-group inset v-for="s in schedule_list" :key="s.id" :title="s.schedule_date">
      <van-cell
        v-for="l in s.for_test_code_schedulelines"
        :key="l.id"
        :title="format_schedule_line_title(l)"
        :value="format_schedule_line_val(l)"
        is-link
        :to="{ name: 'PartnerEdit', params: { id: l.id } }"
      ></van-cell>
    </van-cell-group>
  </div>
</template>
<script>
import { query_schedule_for_partner } from '@/graphql/queries/query_schedule_for_partner'
export default {
  data() {
    return {
      schedule_list: [],
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
      this.$router.push({ name: 'PartnerNew' })
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
        query: query_schedule_for_partner,
        variables: {
          partner_id: this.current_user.id
        }
      })
      .then(({ data, loading, networkStatus, stale }) => {
        this.schedule_list = data.for_test_code_schedule
      })
  }
}
</script>
