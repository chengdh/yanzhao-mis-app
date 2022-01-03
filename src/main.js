// 兼容 IE
// https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelpolyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 设置 js中可以访问 $cdn
import { $cdn } from '@/config'
import VueApollo from 'vue-apollo'
import apolloClient from '@/apollo_client'

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
  defaultClient: apolloClient
})
Vue.use(VueApollo)
Vue.prototype.$cdn = $cdn
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  // inject apolloProvider here like vue-router or vuex
  apolloProvider,
  render: h => h(App)
})
