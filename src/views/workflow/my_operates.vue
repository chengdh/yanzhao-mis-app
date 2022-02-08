<template>
  <div>
    <van-nav-bar title="消息中心" :fixed="true" />
    <van-cell-group inset style="margin-top: 6em">
      <van-search shape="round" v-model="search_kw" placeholder="搜索关键词" />
    </van-cell-group>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :immediate-check="false"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell-group inset :key="operate.workflow_info_node_instance_operate.id" v-for="operate in operateList" @click="evt => onClick(operate)">
          <van-cell
            :title="operate.workflow_info_instance.starter.username"
            :value="operate.workflow_info_instance.start_datetime | moment('from')"
            :label="formInfoName(operate)"
            center
            is-link
          />
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
  name: 'OperateList',
  components: {},
  apollo: {
    operateList: {
      query: gql`
        query queryViewWorkflowInfoInstanceOperateJoins(
          $user_id: bigint!
          $states: [String!]
          $offset: Int! = 0
          $limit: Int! = 15
        ) {
          operateList: yws_view_wokflow_info_instance_operate_joins(
            offset: $offset
            limit: $limit
            where: { state: { _in: $states }, user_id: { _eq: $user_id } }
          ) {
            workflow_info_instance {
              id
              name
              start_datetime
              state
              starter {
                id
                username
              }
            }
            workflow_info_node_instance_operate {
              id
              form_data_json
              state
              user {
                id
                username
              }
            }
          }
        }
      `,
      variables() {
        return {
          // offset: this.offset,
          // limit: this.limit,
          states: ['draft'],
          user_id: JSON.parse(localStorage.getItem('CURRENT_USER')).id
        }
      }
    }
  },
  data() {
    return {
      //待处理
      //已处理
      operateList: [],
      search_kw: '',
      finished: false,
      loading: false,
      refreshing: false,
      //分页
      page: 0,
      rows: 15
    }
  },
  computed: {
    offset: function () {
      if (this.page == 0) {
        return 0
      } else {
        let offset = this.page * this.rows
        return offset
      }
    },
    limit: function () {
      return this.rows || 15
    },
    groupedOperates: function () {
      //NOTE: 参考https://www.robinwieruch.de/javascript-groupby/
      const ret = this.operateList.reduce((acc, op) => {
        // Group initialization
        let wfi = op.workflow_info_node_instance.workflow_info_instance.starter
        let username = wfi.username
        if (!acc[username]) {
          acc[username] = []
        }
        // Grouping
        acc[username].push(op)

        return acc
      }, {})
      return ret
    }
  },
  created() {},
  mounted() {},
  methods: {
    onClick(operate) {
      // this.$router.push({ name: 'ShowFormInfo', query: { workflowInfoInstanceId: operate.workflow_info_instance.id } })
      this.$router.push({ name: 'AuditFormInfo', query: { workflowInfoNodeInstanceOperateId: operate.workflow_info_node_instance_operate.id } })
    },
    formInfoName(operate) {
      return `提交的${operate.workflow_info_instance.name}待审批`
    },
    onLoad() {
      this.page++
      console.log('page:' + this.page)

      this.$apollo.queries.operateList.fetchMore({
        variables: {
          offset: this.offset,
          limit: this.limit,
          states: ['draft'],
          user_id: JSON.parse(localStorage.getItem('CURRENT_USER')).id
        },
        // 用新数据转换之前的结果
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newList = fetchMoreResult.operateList
          if (newList.length > 0) {
            this.loading = false
            this.operateList = [...this.operateList, ...newList]
          } else {
            this.finished = true
            this.loading = false
          }
        }
      })
    },
    onRefresh() {
      this.page = 0
      this.$apollo.queries.operateList.refetch({ offset: 0, limit: this.rows })
      this.refreshing = false
      this.finished = false
      this.loading = false
    }
  }
}
</script>
<style scoped></style>