<template>
  <div>
    <van-cell-group
      inset
      id="form_wrapper"
      style="margin-top: 10px; padding: 10px"
      v-if="orgs"
    >
      <div
        id="form_render"
        ref="fb_editor"
        :data-departments="JSON.stringify(orgs)"
      ></div>
    </van-cell-group>
    <van-cell-group inset title="附件" style="margin-top: 10px; padding: 10px">
      <!-- <van-image v-for="(f, i) in fileListOrigin" :key="i" :src="f">
        <template v-slot:error>加载失败</template>
      </van-image> -->
      <van-uploader
        readonly
        :deletable="false"
        :show-upload="false"
        @click-preview="filePreview"
        v-model="fileListOrigin"
        multiple
      />
    </van-cell-group>

    <van-cell-group inset title="流程" style="margin-top: 10px">
      <van-steps direction="vertical" v-if="workflowInfoInstance" active="99">
        <van-step
          v-for="wfiNode in workflowInfoInstance.workflow_info_instance_nodes"
          :key="wfiNode.id"
        >
          <van-cell center :title="wfiNode.name" />

          <van-cell
            center
            v-for="op in wfiNode.workflow_info_node_instance_operates"
            :key="op.id"
            title=""
            :label="op.user.username"
            :value="op.audit_date | moment('from')"
          />
        </van-step>
      </van-steps>
    </van-cell-group>
  </div>
</template>
<script>
import $ from "jquery";
window.jQuery = $;
window.$ = $;

import { replaceJsonControlChar } from "@/utils/form_builder_util";
import { QueryWorkflowInfoInstanceByPk } from "@/graphql/queries/query_workflow_info_instance_by_pk";
import QueryOrgs from "@/graphql/queries/query_orgs";
import { getUploadFiles } from "@/api/file_upload";
import { baseURL } from "@/config";
require("jquery-ui-sortable");
require("formBuilder");
require("formBuilder/dist/form-render.min.js");
require("@/form_builder/num2rmb.js");
require("@/form_builder/select.department.js");

export default {
  name: "Form",
  props: {
    workflowInfoInstanceId: {
      type: Number | String,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  data() {
    return {
      formRenderInstance: null,
      fileListThumb: [],
      fileListOrigin: [],
    };
  },
  apollo: {
    workflowInfoInstance: {
      query: QueryWorkflowInfoInstanceByPk,
      variables() {
        return {
          id: this.workflowInfoInstanceId,
        };
      },
    },
    orgs: {
      query: QueryOrgs,
    },
  },
  methods: {
    filePreview(file) {
      console.log(file);
    },
  },
  watch: {
    workflowInfoInstance: function () {
      let jsonArray = replaceJsonControlChar(this.workflowInfoInstance.form_data_json);
      let formRenderOpts = {
        formData: jsonArray,
        dataType: "json",
      };
      if (this.workflowInfoInstance) {
        this.formRenderInstance = $(this.$refs.fb_editor).formRender(formRenderOpts);
      }
      $(this.$refs.fb_editor).find("input").attr("disabled", this.readonly);
      $(this.$refs.fb_editor).find("textarea").attr("disabled", this.readonly);
      $(this.$refs.fb_editor).find("select").attr("disabled", this.readonly);
      //获取附件
      const _this = this;
      getUploadFiles(this.workflowInfoInstanceId, "WorkflowInfoInstance").then((data) => {
        _this.fileListThumb = data.result.thumb.map((f) => {
          return { url: `${baseURL}/${f}` };
        });
        _this.fileListOrigin = data.result.origin.map((f) => {
          return { url: `${baseURL}/${f}` };
        });
      });
    },
  },
  computed: {
    title: function () {
      return (this.workflowInfoInstance && this.workflowInfoInstance.name) || "";
    },
    can_cancel: function () {
      if (!this.workflowInfoInstance) return false;
      const userId = JSON.parse(localStorage.getItem("CURRENT_USER")).id;
      const doneNodes = this.workflowInfoInstance.workflow_info_instance_nodes.filter(
        (ni) => ni.state === "done"
      );
      return (
        userId === this.workflowInfoInstance.starter_id &&
        this.workflowInfoInstance.state === "processing" &&
        doneNodes.length === 1
      );
    },
    can_re_submit: function () {
      if (!this.workflowInfoInstance) return false;
      const userId = JSON.parse(localStorage.getItem("CURRENT_USER")).id;
      return (
        userId === this.workflowInfoInstance.starter_id &&
        (this.workflowInfoInstance.state === "canceled" ||
          this.workflowInfoInstance.state === "rejected")
      );
    },
  },
  created() {},
  mounted() {},
};
</script>
<style scoped></style>
