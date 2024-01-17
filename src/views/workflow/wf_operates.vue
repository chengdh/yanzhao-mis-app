<template>
  <div>
    <van-overlay :show="processing">
      <div class="wrapper">
          <van-loading type="spinner" />
      </div>
    </van-overlay>
    <van-nav-bar
      :title="title"
      left-text="返回"
      left-arrow
      @click-left="() => this.$router.back(-1)"
    />
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
            :value="operate.start_datetime | moment('from')"
            @click="(evt) => onClick(operate)"
            is-link
          >
            <template #title>
              <span class="custom-title">{{ operateTitle(operate) }}</span>
              <van-tag type="primary" mark>{{ operateState(operate) }}</van-tag>
            </template>
            <template #label>
              <div
                class="van-ellipsis"
                :key="i"
                v-for="(f, i) in formatJson(operate, operate.form_data_json)"
              >
                {{ f.label }}:{{ f.val }}
              </div>
            </template>
          </van-cell>
          <van-cell title="审批" icon="certificate" v-if="queryType === 'myWaitting'">
            <!-- 使用 right-icon 插槽来自定义右侧图标 -->
            <template #right-icon>
              <van-button
                type="primary"
                round
                size="small"
                :disabled="processing"
                @click="onAudit(operate.id)"
              >
                <van-icon name="success" />
                通过
              </van-button>
              <van-button
                type="danger"
                round
                size="small"
                :disabled="processing"
                @click="onReject(operate.id)"
              >
                <van-icon name="cross" />
                拒绝
              </van-button>
            </template>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { Toast, Notify } from "vant";
import {
  AuditWorkflowInfoNodeInstanceOperate,
  RejectWorkflowInfoNodeInstanceOperate,
} from "@/graphql/mutation/audit_workflow_info_instance";
import { formJsonFieldsFormat } from "@/utils/form_builder_util";
import {
  QuerMyOperates,
  QuerMySubmitted,
  QuerMyReceived,
} from "@/graphql/queries/query_workflow_info_node_instance_operates";
export default {
  name: "WorkflowInfoNodeInstanceOperates",
  components: {},
  props: {
    queryType: { type: String, require: true },
  },
  apollo: {},
  data() {
    return {
      processing: false,
      //待处理
      //已处理
      operates: [],
      search_kw: "",
      finished: false,
      loading: false,
      refreshing: false,
      //分页
      page: 0,
      rows: 15,
    };
  },
  computed: {
    title: function () {
      let ret = "";
      switch (this.queryType) {
        case "myWaitting":
          ret = "待处理的";
          break;
        case "myDone":
          ret = "已处理的";
          break;
        case "mySubmitted":
          ret = "我发起的";
          break;
        case "myReceived":
          ret = "我收到的";
          break;
        default:
          break;
      }
      return ret;
    },
    offset: function () {
      if (this.page == 0) {
        return 0;
      } else {
        let offset = this.page * this.rows;
        return offset;
      }
    },
    limit: function () {
      return this.rows || 15;
    },
  },
  created() {
    this.doQuery();
  },
  mounted() {},
  methods: {
    //审批通过
    onAudit(wfOperateId) {
      this.processing = true;
      this.$apollo
        .mutate({
          mutation: AuditWorkflowInfoNodeInstanceOperate,
          variables: { id: parseInt(wfOperateId), note: "直接审批通过!" },
        })
      Promise.resolve({}).then((data) => {
        this.processing = false
        this.onRefresh();
        Notify({ type: "success", message: `审批通过!` });
      });
    },

    //审批拒绝
    onReject(wfOperateId) {
      this.processing = true
      this.$apollo
        .mutate({
          mutation: RejectWorkflowInfoNodeInstanceOperate,
          variables: { id: parseInt(wfOperateId), note: "直接审批退回!" },
        })

      Promise.resolve({}).then((data) => {
        this.processing = false
        this.onRefresh();
        Notify({ type: "success", message: `已拒绝!` });
      });
    },
    onClick(wfi) {
      if (this.queryType == "myWaitting") {
        this.$router.push({
          name: "AuditFormInfo",
          query: { workflowInfoNodeInstanceOperateId: wfi.operateId },
        });
      } else {
        this.$router.push({
          name: "ShowFormInfo",
          query: { workflowInfoInstanceId: wfi.id },
        });
      }
    },
    operateTitle(operate) {
      return `${operate.starter.username}提交的${
        operate.workflow_info && operate.workflow_info.name
      }`;
    },
    operateState(op) {
      let stateDes = "";
      let state = op.state;
      if (state === "draft") stateDes = "待处理";
      if (state === "processing") stateDes = "处理中";
      if (state === "canceled") stateDes = "已撤销";
      if (state === "rejected") stateDes = "已拒绝";
      return stateDes;
    },
    formatJson(op, formJson) {
      try {
        let jsonArray = formJsonFieldsFormat(formJson);
        return jsonArray;
      } catch (err) {
        console.log(err);
        console.log(op.id);
        console.log(formJson);
      }
    },
    setResult(isFetchMore = false, newResult = []) {
      if (newResult.length > 0) {
        this.loading = false;
      } else {
        this.finished = true;
        this.loading = false;
      }
      if (isFetchMore) {
        this.operates = [...this.operates, ...newResult];
      } else {
        this.operates = newResult;
      }
    },
    doQuery(isFetchMore = false) {
      let newResult = [];
      switch (this.queryType) {
        case "myWaitting":
          this.$apollo
            .query({
              query: QuerMyOperates,
              variables: {
                offset: this.offset,
                limit: this.limit,
                states: ["draft"],
                user_id: JSON.parse(localStorage.getItem("CURRENT_USER")).id,
              },
              fetchPolicy: "network-only",
            })
            .then((data) => {
              newResult = data.data.myOperates.map((op) => {
                let wfi = op.workflow_info_node_instance.workflow_info_instance;
                //待处理的数据,需要附加上operateId
                wfi.operateId = op.id;
                return wfi;
              });
              this.setResult(isFetchMore, newResult);
            });
          break;
        case "myDone":
          this.$apollo
            .query({
              query: QuerMyOperates,
              variables: {
                offset: this.offset,
                limit: this.limit,

                states: ["done", "rejected", "forwarded"],
                user_id: JSON.parse(localStorage.getItem("CURRENT_USER")).id,
              },
              fetchPolicy: "network-only",
            })
            .then((data) => {
              newResult = data.data.myOperates.map(
                (op) => op.workflow_info_node_instance.workflow_info_instance
              );
              this.setResult(isFetchMore, newResult);
            });

          break;
        case "mySubmitted":
          this.$apollo
            .query({
              query: QuerMySubmitted,
              variables: {
                offset: this.offset,
                limit: this.limit,

                states: ["done", "rejected", "draft", "processing", "canceled"],
                starter_id: JSON.parse(localStorage.getItem("CURRENT_USER")).id,
              },
              fetchPolicy: "network-only",
            })
            .then((data) => {
              newResult = data.data.mySubmitted;
              this.setResult(isFetchMore, newResult);
            });

          break;

        case "myReceived":
          this.$apollo
            .query({
              query: QuerMyReceived,
              variables: {
                offset: this.offset,
                limit: this.limit,
                states: ["draft"],
                user_id: JSON.parse(localStorage.getItem("CURRENT_USER")).id,
              },
              fetchPolicy: "network-only",
            })
            .then((data) => {
              newResult = data.data.myReceived.map((op) => {
                let wfi = op.workflow_info_node_instance.workflow_info_instance;
                //待处理的数据,需要附加上operateId
                wfi.operateId = op.id;
                return wfi;
              });
              this.setResult(isFetchMore, newResult);
            });
          break;
        default:
          break;
      }
    },
    onLoad() {
      this.page++;
      this.doQuery(true);
    },
    onRefresh() {
      this.page = 0;
      this.doQuery();
      this.refreshing = false;
      this.finished = false;
      this.loading = false;
    },
  },
};
</script>
<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}
</style>
