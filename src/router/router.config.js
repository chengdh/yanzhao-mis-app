/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/partner/list',
    name: 'PartnerList',
    component: () => import('@/views/partner/list'),
    meta: {
      title: '合伙人日程',
      keepAlive: false
    }
  },
  {
    path: '/partner/new',
    name: 'PartnerNew',
    component: () => import('@/views/partner/new'),
    meta: {
      title: '新建日程',
      keepAlive: false
    }
  },

  {
    path: '/partner/edit',
    name: 'PartnerEdit',
    component: () => import('@/views/partner/edit'),
    props: true,
    meta: {
      title: '维护日程',
      keepAlive: false
    }
  },
  {
    path: '/developer/list',
    name: 'DeveloperList',
    component: () => import('@/views/developer/list'),
    meta: {
      title: '创业者人日程',
      keepAlive: false
    }
  },
  {
    path: '/developer/new',
    name: 'DeveloperNew',
    component: () => import('@/views/developer/new'),
    meta: {
      title: '新建日程',
      keepAlive: false
    }
  },

  {
    path: '/developer/edit',
    name: 'DeveloperEdit',
    component: () => import('@/views/developer/edit'),
    props: true,
    meta: {
      title: '维护日程',
      keepAlive: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/login_for_code_test'),
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
    props: route => ({ formInfoId: route.query.formInfoId, refWorkflowInfoInstanceId: route.query.refWorkflowInfoInstanceId }),
    meta: { title: '提交表单', keepAlive: false }
  },
  //查看工作流
  {
    path: '/workflow/show_form_info',
    name: 'ShowFormInfo',
    component: () => import('@/views/workflow/show_form_info'),
    props: route => ({ workflowInfoInstanceId: route.query.workflowInfoInstanceId }),
    meta: { title: '查看表单', keepAlive: false }
  },

  //审批工作流
  {
    path: '/workflow/audit_form_info',
    name: 'AuditFormInfo',
    component: () => import('@/views/workflow/audit_form_info'),
    props: route => ({ workflowInfoNodeInstanceOperateId: route.query.workflowInfoNodeInstanceOperateId }),
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
