<template>
  <div>
    <van-cell-group inset>
      <van-search v-model="search_kw" placeholder="请输入搜索关键词" />
    </van-cell-group>

    <van-cell-group inset :key="operate.id" v-for="operate in operateList" @click="onClick">
      <van-cell
        :title="operate.workflow_info_node_instance.workflow_info_instance.starter.username"
        :value="operate.workflow_info_node_instance.workflow_info_instance.start_datetime | moment('from')"
        :label="formInfoName(operate)"
        center
        is-link
      />
    </van-cell-group>
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
        query queryOperates($user_id: bigint!,$state: String!) {
          operateList: yws_workflow_info_node_instance_operates(where: { state: {_eq: $state},user_id: { _eq: $user_id } }) {
            id
            audit_date
            audit_note
            created_at
            form_data_json
            state
            user_id
            workflow_info_node_instance {
              id
              name
              workflow_info_instance {
                id
                name
                start_datetime
                starter {
                  id
                  username
                }
              }
            }
          }
        }
      `,
      variables() {
        return {
          state: "draft",
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
      search_kw: ""
    }
  },
  created() {},
  mounted() {},
  methods: {
    onClick() {
      this.$router.push({ name: 'FormInfo' })
    },
    formInfoName(operate) {
      return `提交的${operate.workflow_info_node_instance.workflow_info_instance.name}待审批`
    }
  }
}
</script>
<style scoped></style>