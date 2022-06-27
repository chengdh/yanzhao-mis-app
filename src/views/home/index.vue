<template>
  <div>
    <van-nav-bar title="工作台" :fixed="true" />
    <van-cell-group inset style="margin-top: 6em">
      <van-grid>
        <van-grid-item
          icon="underway-o"
          text="待处理"
          :to="{ name: 'GroupOperates', query: { queryType: 'myWaitting' } }"
          :badge="waittingOperatesBadge"
        />

        <van-grid-item icon="success" text="已处理" :to="{ name: 'GroupOperates', query: { queryType: 'myDone' } }" />

        <van-grid-item
          icon="records"
          text="已发起"
          :to="{ name: 'GroupOperates', query: { queryType: 'mySubmitted' } }"
        />

        <van-grid-item
          icon="envelop-o"
          text="我收到的"
          :to="{ name: 'GroupOperates', query: { queryType: 'myReceived' } }"
        />
      </van-grid>
    </van-cell-group>
    <van-cell-group inset :key="cat.id" v-for="cat in nonBlankFormCategories" :title="cat.name">
      <van-grid column-num="3">
        <van-grid-item
          v-for="formInfo in cat.form_infos"
          :key="formInfo.id"
          @click="startFormInfo(formInfo)"
          icon="photo-o"
          style="width: 100%; overflow: hidden"
        >
          <template #text>
            <span class="van-ellipsis">{{ formInfo.name }}</span>
          </template>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
  </div>
</template>
<script>
import gql from 'graphql-tag'
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
  computed: {
    nonBlankFormCategories: function () {
      return this.formCategories.filter(fc => fc.form_infos.length > 0)
    },
    waittingOperatesBadge: function () {
      let ret = this.$store.state.app.waittingOperates
      if (ret === 0) ret = ''
      return ret
    }
  },
  created() {},
  mounted() {},
  methods: {
    startFormInfo(formInfo) {
      this.$router.push({ name: 'StartFormInfo', query: { formInfoId: formInfo.id } })
    }
  }
}
</script>
<style scoped></style>