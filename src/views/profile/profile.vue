<template>
  <div id="mine">
    <van-nav-bar title="我的" :border="false" />
    <van-cell-group inset style="margin-top: 0.4rem">
      <van-cell style="" label-class="labelClass" is-link center>
        <template slot="title">
          <div class="personMsg" v-if="userInfo.token">
            <van-icon name="manager-o" />
            &nbsp;&nbsp;
            <span>{{ userInfo.username }}</span>
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group inset style="margin-top: 0.4rem">
      <van-cell title="退出登录" icon="comment-circle" is-link @click="onLogout" />
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        token: localStorage.getItem('JWT_TOKEN'),
        ...JSON.parse(localStorage.getItem('CURRENT_USER'))
      }
    }
  },
  mounted() {},
  computed: {},
  methods: {
    gotoPage(name) {
      this.$router.push({ name })
    },
    onLogout() {
      localStorage.removeItem("JWT_TOKEN")
      localStorage.removeItem("CURRENT_USER")
      this.$router.push({name: "Login"})
    }
  }
}
</script>

<style scoped>
</style>