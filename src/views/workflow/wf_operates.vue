<template>
  <div>
    <van-nav-bar :title="title" left-text="返回" left-arrow @click-left="() => this.$router.back(-1)" />
    <van-cell-group inset style="display: flex; align-items: center">
      <van-search v-model="search_kw" shape="round" placeholder="请输入搜索关键词" />
      <van-button round size="small">
        <van-icon name="filter-o" />
        筛选
      </van-button>
    </van-cell-group>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :immediate-check="false"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell-group inset :key="operate.id" v-for="operate in operates">
          <van-cell
            :title="operateTitle(operate)"
            :value="operate.start_datetime | moment('from')"
            @click="evt => onClick(operate)"
            is-link
          >
            <template #label>
              <div class="van-ellipsis" :key="i" v-for="(f, i) in formatJson(operate.form_data_json)">
                {{ f.label }}:{{ f.val }}
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { formJsonFieldsFormat } from '@/utils/form_builder_util'
import {
  QuerMyOperates,
  QuerMySubmitted,
  QuerMyReceived
} from '@/graphql/queries/query_workflow_info_node_instance_operates'
export default {
  name: 'WorkflowInfoNodeInstanceOperates',
  components: {},
  props: {
    queryType: { type: String, require: true }
  },
  apollo: {},
  data() {
    return {
      //待处理
      //已处理
      operates: [],
      search_kw: '',
      finished: true,
      loading: false,
      refreshing: false,
      //分页
      page: 0,
      rows: 15
    }
  },
  computed: {
    title: function () {
      let ret = ''
      switch (this.queryType) {
        case 'myWaitting':
          ret = '待处理的'
          break
        case 'myDone':
          ret = '已处理的'
          break
        case 'mySubmitted':
          ret = '我发起的'
          break
        case 'myReceived':
          ret = '我收到的'
          break
        default:
          break
      }
      return ret
    },
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
    }
  },
  created() {
    this.doQuery()
  },
  mounted() {},
  methods: {
    onClick(wfi) {
      if (this.queryType == 'myWaitting') {
        this.$router.push({ name: 'AuditFormInfo', query: { workflowInfoInstanceId: wfi.id } })
      } else {
        this.$router.push({ name: 'ShowFormInfo', query: { workflowInfoInstanceId: wfi.id } })
      }
    },
    operateTitle(operate) {
      return `${operate.starter.username}提交的${operate.workflow_info && operate.workflow_info.name}`
    },
    formatJson(formJson) {
      let jsonArray = formJsonFieldsFormat(formJson)
      return jsonArray
    },
    setResult(isFetchMore = false, newResult = []) {
      if (newResult.length > 0) {
        this.loading = false
      } else {
        this.finished = true
        this.loading = false
      }
      if (isFetchMore) {
        this.operates = [...this.operates, ...newResult]
      } else {
        this.operates = newResult
      }
    },
    doQuery(isFetchMore = false) {
      let newResult = []
      switch (this.queryType) {
        case 'myWaitting':
          this.$apollo
            .query({
              query: QuerMyOperates,
              variables: {
                offset: this.offset,
                limit: this.limit,
                states: ['draft'],
                user_id: JSON.parse(localStorage.getItem('CURRENT_USER')).id
              }
            })
            .then(data => {
              newResult = data.data.myOperates.map(op => op.workflow_info_node_instance.workflow_info_instance)
              this.setResult(isFetchMore,newResult)
            })
          break
        case 'myDone':
          this.$apollo
            .query({
              query: QuerMyOperates,
              variables: {
                offset: this.offset,
                limit: this.limit,

                states: ['done', 'rejected', 'forwarded'],
                user_id: JSON.parse(localStorage.getItem('CURRENT_USER')).id
              }
            })
            .then(data => {
              newResult = data.data.myOperates.map(op => op.workflow_info_node_instance.workflow_info_instance)
              this.setResult(isFetchMore,newResult)
            })

          break
        case 'mySubmitted':
          this.$apollo
            .query({
              query: QuerMySubmitted,
              variables: {
                offset: this.offset,
                limit: this.limit,

                states: ['done', 'rejected', 'draft', 'processing'],
                starter_id: JSON.parse(localStorage.getItem('CURRENT_USER')).id
              }
            })
            .then(data => {
              newResult = data.data.mySubmitted
              this.setResult(isFetchMore,newResult)
            })

          break
        default:
          break
      }
    },
    onLoad() {
      this.page++
      this.doQuery(true)
    },
    onRefresh() {
      this.page = 0
      this.doQuery()
      this.refreshing = false
      this.finished = false
      this.loading = false
    }
  }
}
</script>
<style scoped></style>