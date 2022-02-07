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

  //发起工作流
  {
    path: '/workflow/start_form_info',
    name: 'StartFormInfo',
    component: () => import('@/views/workflow/start_form_info'),
    props: route => ({ formInfoId: route.query.formInfoId }),
    meta: { title: '提交表单', keepAlive: false }
  },
  //查看工作流
  {
    path: '/workflow/show_form_info',
    name: 'ShowFormInfo',
    component: () => import('@/views/workflow/show_form_info'),
    props: route => ({ workflowInfoInstanceId: route.query.workflowInfoInstanceId}),
    meta: { title: '查看表单', keepAlive: false }
  },

  //审批工作流
  {
    path: '/workflow/audit_form_info',
    name: 'AuditFormInfo',
    component: () => import('@/views/workflow/audit_form_info'),
    props: route => ({ workflowInfoNodeInstanceOperateId: route.query.workflowInfoNodeInstanceOperateId}),
    meta: { title: '审批表单', keepAlive: false }
  },


  //待处理/已处理/已发起/我收到的
  {
    path: '/workflow/group_operates',
    name: 'GroupOperates',
    component: () => import('@/views/workflow/wf_operates'),
    props: route => ({ queryType: route.query.queryType }),
    meta: { title: '与我有关', keepAlive: false }
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
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/profile/profile'),
        meta: { title: '我的', keepAlive: false }
      }
    ]
  }
]
