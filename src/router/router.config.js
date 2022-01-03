/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/login'),
    meta: {
      title: '登录',
      keepAlive: false
    }
  },

  {
    path: '/',
    component: () => import('@/views/layouts/index'),
    redirect: '/home',
    meta: {
      title: '首页',
      keepAlive: false
    },
    children: [
      {
        path: '/workflow_operates',
        name: 'WorkflowOperates',
        component: () => import('@/views/workflow_operates/list'),
        meta: { title: '消息', keepAlive: false }
      },
      {
        path: '/form_info',
        name: 'FormInfo',
        component: () => import('@/components/FormInfo'),
        meta: { title: '表单', keepAlive: false }
      },

      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', keepAlive: false }
      },

      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/home/about'),
        meta: { title: '关于我', keepAlive: false }
      }
    ]
  }
]
