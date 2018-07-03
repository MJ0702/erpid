
const routes = [
  {
    name: 'plan-list',
    path: '/tgapp-plan-list',
    component(resolve) {
      require.ensure(['./plan-list.vue'], () => {
        resolve(require('./plan-list.vue'))
      }, "tgapp-plan-list");
    },
  },
  {
    name: 'history-plan-list',
    path: '/tgapp-history-plan-list',
    component(resolve) {
      require.ensure(['./history-plan-list.vue'], () => {
        resolve(require('./history-plan-list.vue'))
      }, "history-plan-list");
    },
  }
  
]

export default routes;