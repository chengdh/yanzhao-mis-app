<template>
  <div>
    <van-cell-group inset :key="cat.id" v-for="cat in formCategories" :title="cat.name">
      <van-grid>
        <van-grid-item v-for="formInfo in cat.form_infos" :key="formInfo.id" icon="photo-o" :text="formInfo.name" />
      </van-grid>
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
    formCategories: {
      query: gql`
        query formInfos {
          formCategories: yws_form_categories {
            name
            id
            form_infos {
              name
              id
              note
              form_info_designs {
                form_json
                id
              }
            }
          }
        }
      `
    }
  },
  data() {
    return {
      formCategories: []
    }
  },
  created() {},
  mounted() {},
  methods: {
    moment: function () {
      return moment()
    }
  }
}
</script>
<style scoped></style>