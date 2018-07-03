
import plan from './views/plan/routes.js'
import bill from './views/bill/routes.js'
import planbill from './views/planbill/routes.js'
const routes = [
  {
    name: 'index',
    path: '/tgapp',
    component(resolve) {
      require.ensure(['./views/index.vue'], () => {
        resolve(require('./views/index.vue'))
      }, "index");
    },
  },
  ...plan,
  ...bill,
  ...planbill
  // {
  //   name: 'plan-list',
  //   path: '/tgapp-plan-list',
  //   component(resolve) {
  //     require.ensure(['./views/plan/plan-list.vue'], () => {
  //       resolve(require('./views/plan/plan-list.vue'))
  //     }, "tgapp/tgapp-plan-list");
  //   },
  // },
]

export default routes;
