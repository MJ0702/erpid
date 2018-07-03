import orders_routes from './views/orders/routes.js'
import plans_routes from './views/plans/routes.js'
import contacts_routes from './views/contacts/routes.js'
import customers_routes from './views/customers/routes.js'
import moneys_routes from './views/moneys/routes.js'
import company from './views/company/routes.js'
import withdraw from './views/withdraw/routes.js'

const routes = [
  {
    name: 'home',
    path: '/',
    component(resolve) {
      require.ensure(['./views/home.vue'], () => {
        resolve(require('./views/home.vue'))
      }, "home");
    },
  },
  {
    name: 'me',
    path: '/me',
    component(resolve) {
        require.ensure(['./views/mine.vue'], () => {
          resolve(require('./views/mine.vue'))
        }, "mine");
    },
  },
  {
    name: 'push-msg',
    path: '/push-msg',
    component(resolve) {
        require.ensure(['./views/push-msg.vue'], () => {
          resolve(require('./views/push-msg.vue'))
        }, "push-msg");
    },
  },
  {
    name: 'saler-rank',
    path: '/saler-rank',
    component(resolve) {
        require.ensure(['./views/saler-rank.vue'], () => {
          resolve(require('./views/saler-rank.vue'))
        }, "saler-rank");
    },
  },
  {
    name: 'notice',
    path: '/notice',
    component(resolve) {
        require.ensure(['./views/notice.vue'], () => {
          resolve(require('./views/notice.vue'))
        }, "notice");
    },
  },
  {
    name: 'bank-account',
    path: '/bank-account',
    component(resolve) {
        require.ensure(['./views/bank-account.vue'], () => {
          resolve(require('./views/bank-account.vue'))
        }, "bank-account");
    },
  },
  {
    name: 'dashang',
    path: '/dashang',
    component(resolve) {
        require.ensure(['./views/dashang.vue'], () => {
          resolve(require('./views/dashang.vue'))
        }, "dashang");
    },
  },
  {
    name: 'revert',
    path: '/revert',
    component(resolve) {
        require.ensure(['./views/revert.vue'], () => {
          resolve(require('./views/revert.vue'))
        }, "revert");
    },
  },
  {
    name: 'permission',
    path: '/permission',
    component(resolve) {
        require.ensure(['./views/permission.vue'], () => {
          resolve(require('./views/permission.vue'))
        }, "permission");
    },
  },
  {
    name: 'errored',
    path: '/errored',
    component(resolve) {
        require.ensure(['./views/errored.vue'], () => {
          resolve(require('./views/errored.vue'))
        }, "errored");
    },
  },

  // {
  //   name: 'demo-charts',
  //   path: '/demo-charts',
  //   component(resolve) {
  //       require.ensure(['./views/demo-charts.vue'], () => {
  //         resolve(require('./views/demo-charts.vue'))
  //       }, "demo-charts");
  //   },
  // },
  ...orders_routes,
  ...plans_routes,
  ...contacts_routes,
  ...customers_routes,
  ...moneys_routes,
  ...company,
  ...withdraw,
]
console.log('withdraw:',withdraw);
console.log('routes:',routes);
if (process.env.NODE_ENV === 'development') {
  //开发环境显示demo页面
  routes.push({
    name: 'demo',
    path: '/demo',
    component(resolve) {
      require.ensure(['./views/demo.vue'], () => {
        resolve(require('./views/demo.vue'))
      }, "demo");
    },
  },
  {
    name: 'demo-charts',
    path: '/demo-charts',
    component(resolve) {
      require.ensure(['./views/demo-charts.vue'], () => {
        resolve(require('./views/demo-charts.vue'))
      }, "demo-charts");
    },
  },
  {
    name: 'demo-time',
    path: '/demo-time',
    component(resolve) {
      require.ensure(['./views/demo-time.vue'], () => {
        resolve(require('./views/demo-time.vue'))
      }, "demo");
    },
  })
}

export default routes;
