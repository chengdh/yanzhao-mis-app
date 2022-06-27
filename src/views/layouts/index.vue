<template>
  <div class="app-container">
    <div class="layout-content">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-else></router-view>
    </div>
    <div class="layout-footer">
      <TabBar :data="tabbars" @change="handleChange" />
    </div>
  </div>
</template>

<script>
import TabBar from '@/components/TabBar'
export default {
  name: 'AppLayout',
  data() {
    return {
      tabbars: [
        {
          title: '消息',
          key: 'waittingOperates',
          to: {
            name: 'MyOperates'
          },
          icon: 'chat-o'
        },
        {
          title: '工作台',
          key: 'oaDesktop',
          to: {
            name: 'Home'
          },
          icon: 'home-o'
        },

        {
          title: '我的',
          key: 'profile',
          to: {
            name: 'Profile'
          },
          icon: 'user-o'
        }
      ]
    }
  },
  components: {
    TabBar
  },
  methods: {
    handleChange(v) {
      console.log('tab value:', v)
    }
  }
}
</script>