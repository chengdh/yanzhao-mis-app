<template>
  <div>
    <van-nav-bar :title="title" left-text="返回" left-arrow @click-left="() => this.$router.back(-1)" />
    <van-cell-group inset style="display: flex; align-items: center">
      <van-search v-model="search_kw" placeholder="请输入搜索关键词" />
      <van-button round size="small">
        <van-icon name="filter-o" />
        筛选
      </van-button>
    </van-cell-group>

    <van-cell-group inset :key="operate.id" v-for="operate in operates" @click="onClick">
      <van-cell
        :title="operateTitle(operate)"
        :value="operate.start_datetime | moment('from')"
        is-link
      >
        <template #label>
          <div class="van-ellipsis" :key="i" v-for="(f,i) in formatJson(operate.form_data_json)">{{f.label}}:{{f.val}}</div>
        </template>
      </van-cell>
    </van-cell-group>
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
      search_kw: ''
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
    }
  },
  created() {
    this.doQuery()
  },
  mounted() {},
  methods: {
    onClick() {
      this.$router.push({ name: 'FormInfo' })
    },
    operateTitle(operate) {
      return `${operate.starter.username}提交的${operate.workflow_info.name}`
    },
    formatJson(formJson) {
      let jsonArray = formJsonFieldsFormat(formJson)
      return jsonArray
    },
    doQuery() {
      switch (this.queryType) {
        case 'myWaitting':
          this.$apollo
            .query({
              query: QuerMyOperates,
              variables: {
                states: ['draft'],
                user_id: JSON.parse(localStorage.getItem('CURRENT_USER')).id
              }
            })
            .then(data => {
              this.operates = data.data.myOperates.map(op => op.workflow_info_node_instance.workflow_info_instance)
            })
          break
        case 'myDone':
          this.$apollo
            .query({
              query: QuerMyOperates,
              variables: {
                states: ['done', 'rejected', 'forwarded'],
                user_id: JSON.parse(localStorage.getItem('CURRENT_USER')).id
              }
            })
            .then(data => {
              this.operates = data.data.myOperates.map(op => op.workflow_info_node_instance.workflow_info_instance)
            })

          break
        case 'mySubmitted':
          this.$apollo
            .query({
              query: QuerMySubmitted,
              variables: {
                states: ['done', 'rejected', 'draft', 'processing'],
                starter_id: JSON.parse(localStorage.getItem('CURRENT_USER')).id
              }
            })
            .then(data => {
              this.operates = data.data.mySubmitted
            })

          break
        default:
          break
      }
    }
  }
}
</script>
<style scoped></style>