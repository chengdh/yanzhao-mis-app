<template>
  <div>
    <van-cell-group
      inset
      :key="operate.id"
      v-for="operate in myOperates"
      :title="operate.workflow_info_node_instance.workflow_info_instance.name"
      @click="onClick"
    >
      <van-cell
        :title="operate.workflow_info_node_instance.workflow_info_instance.starter.username"
        :value="moment(operate.workflow_info_node_instance.workflow_info_instance.start_datetime).format('YYYY/MM/DD HH:mm')"
        label="请假时长:3天"
        is-link
      />
    </van-cell-group>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import moment from 'moment'
export default {
  name: 'OperateList',
  components: {},
  apollo: {
    myOperates: {
      query: gql`
        query myOperates($user_id: bigint!) {
          myOperates: yws_workflow_info_node_instance_operates(where: { user_id: { _eq: $user_id } }) {
            audit_date
            audit_note
            created_at
            form_data_json
            id
            state
            user_id
            workflow_info_node_instance {
              name
              workflow_info_instance {
                name
                starter_id
                start_datetime
                starter {
                  username
                }
              }
            }
          }
        }
      `,
      variables() {
        return {
          //FIXME:
          user_id: 1
        }
      }
    }
  },
  data() {
    return {
      //待处理
      //已处理
      myOperates: []
    }
  },
  created() {},
  mounted() {},
  methods: {
    moment: function () {
      return moment()
    },
    onClick(){
      this.$router.push({name: "FormInfo"})
    }
  }
}
</script>
<style scoped></style>