
const routes = [
  {
    name: 'plan-bill',
    path: '/tgapp-plan-bill',
    component(resolve) {
      require.ensure(['./plan-bill.vue'], () => {
        resolve(require('./plan-bill.vue'))
      }, "plan-bill");
    },
  },
  {
    name: 'bill-progress',
    path: '/tgapp-bill-progress',
    component(resolve) {
      require.ensure(['./bill-progress.vue'], () => {
        resolve(require('./bill-progress.vue'))
      }, "bill-progress");
    },
  },
]

export default routes;