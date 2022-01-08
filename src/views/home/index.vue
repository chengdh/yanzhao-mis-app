<template>
  <div>
    <van-cell-group inset :key="cat.id" v-for="cat in formCategories" :title="cat.name">
      <van-grid>
        <van-grid-item
          v-for="formInfo in cat.form_infos"
          :key="formInfo.id"
          @click="startFormInfo(formInfo)"
          icon="photo-o"
          :text="formInfo.name"
        />
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
              form_info_design {
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
    },
    startFormInfo(formInfo) {
      this.$router.push({ name: 'StartFormInfo', query: { formInfoId: formInfo.id } })
    }
  }
}
</script>
<style scoped></style>