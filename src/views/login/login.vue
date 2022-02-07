<template>
  <div class="login-container">
    <div class="logo-wrapper">
      <van-image width="2rem" height="1.2rem" :src="require('@/assets/images/logo_yanzhao.png')" />
    </div>
    <h2 class="title-wrapper">
      <span>综合办公平台</span>
      <span>登录</span>
    </h2>
    <van-form @submit="onSubmit">
      <van-field
        v-model="username"
        name="帐号"
        label="帐号"
        left-icon="user-o"
        placeholder="请输入帐号"
        :rules="[{ required: true, message: '请输入帐号' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="请输入密码"
        left-icon="eye-o"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px; margin-top: 40px">
        <van-button round block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import HasuraAuth from '@/graphql/queries/hasura_auth'
import { Toast } from 'vant'

export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    //登录
    onSubmit() {
      console.log('submit login')
      this.$apollo
        .query({
          query: HasuraAuth,
          variables: {
            username: this.username,
            cleartext_password: this.password
          }
        })
        .then(({ data, loading, networkStatus, stale }) => {
          console.log(data)
          if (data.hasura_auth.length == 0) {
            Toast.fail('登录失败')
            localStorage.removeItem('JWT_TOKEN')
            localStorage.removeItem('CURRENT_USER')
          } else {
            Toast.success('登录成功')
            let { id, username } = data.hasura_auth[0]
            localStorage.setItem('JWT_TOKEN', data.hasura_auth[0].jwt_token)
            localStorage.setItem('CURRENT_USER', JSON.stringify({ id, username }))
            this.$router.push({ name: 'Home' })
          }
        })
        .catch(error => {
          console.error(error)
          Toast.fail('登录失败')
          localStorage.removeItem('JWT_TOKEN')
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