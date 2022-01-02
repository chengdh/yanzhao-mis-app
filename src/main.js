// 兼容 IE
// https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelpolyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'

// 设置 js中可以访问 $cdn
import { $cdn, baseApi } from '@/config'
Vue.prototype.$cdn = $cdn

// 全局引入按需引入UI库 vant
import '@/plugins/vant'
// 引入全局样式
import '@/assets/css/index.scss'
// 移动端适配
import 'lib-flexible/flexible.js'

// filters
import './filters'
// create a provider
const apolloProvider = new VueApollo({
  defaultClient: new ApolloClient({
    uri: baseApi
  })
})
Vue.use(VueApollo, gql)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  // inject apolloProvider here like vue-router or vuex
  apolloProvider,
  render: h => h(App)
})
