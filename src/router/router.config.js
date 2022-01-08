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
    path: '/workflow/start_form_info',
    name: 'StartFormInfo',
    component: () => import('@/views/workflow/start_form_info'),
    props: route => ({ formInfoId: route.query.formInfoId }),
    meta: { title: '提交表单', keepAlive: false }
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
        path: '/my_operates',
        name: 'MyOperates',
        component: () => import('@/views/workflow/my_operates'),
        meta: { title: '我的待办', keepAlive: false }
      },
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: '工作台', keepAlive: false }
      },

      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/home/about'),
        meta: { title: '我', keepAlive: false }
      }
    ]
  }
]