<template>
  <div class="login-container">
    <h2 class="title-wrapper">
      <span>预约系统</span>
      <span>登录</span>
    </h2>
    <van-form @submit="login">
      <van-field
        v-model="mobile"
        name="帐号"
        label="帐号"
        left-icon="user-o"
        placeholder="请输入手机号"
        :rules="[{ required: true, message: '请输入手机号' }]"
      />
      <van-cell>
        <van-radio-group v-model="role" direction="horizontal">
          <van-radio name="partner">合伙人</van-radio>
          <van-radio name="developer">创业者</van-radio>
        </van-radio-group>
      </van-cell>
      <div style="margin: 16px; margin-top: 40px">
        <van-button round block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { Toast } from 'vant'
import { login_partner, login_developer } from '@/graphql/queries/query_login'

export default {
  data() {
    return {
      mobile: '',
      role: 'partner'
    }
  },
  methods: {
    //登录
    login() {
      let query = null
      if (this.role === 'partner') {
        query = login_partner
      } else {
        query = login_developer
      }

      this.$apollo
        .query({
          query,
          variables: {
            mobile: this.mobile
          }
        })
        .then(({ data, loading, networkStatus, stale }) => {
          console.log(data)
          if (data.users.length === 0) {
            Toast.fail('登录失败')
            localStorage.removeItem('CURRENT_USER')
          } else {
            Toast.success('登录成功')
            const { id, name, mobile } = data.users[0]
            localStorage.setItem('CURRENT_USER', JSON.stringify({ role: this.role, id, name, mobile }))
            if (this.role === 'partner') {
              this.$router.push({ name: 'PartnerList' })
            } else {
              this.$router.push({ name: 'DeveloperList' })
            }
          }
        })
        .catch(error => {
          console.error(error)
          Toast.fail('登录失败')
          localStorage.removeItem('CURRENT_USER')
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.login-container {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.logo-wrapper {
  padding: 10px;
}
.title-wrapper {
  margin-bottom: 40px;
}
</style>
