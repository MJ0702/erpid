
const routes = [
  {
    name: 'bill-add',
    path: '/tgapp-bill-add',
    component(resolve) {
      require.ensure(['./bill-add.vue'], () => {
        resolve(require('./bill-add.vue'))
      }, "tgapp-bill-add");
    },
  },  
  {
    name: 'bill-list',
    path: '/tgapp-bill-list',
    component(resolve) {
      require.ensure(['./bill-list.vue'], () => {
        resolve(require('./bill-list.vue'))
      }, "tgapp-bill-list");
    },
  },
  {
    name: 'bill-edit-receivables',
    path: '/tgapp-bill-edit-receivables',
    component(resolve) {
      require.ensure(['./bill-edit-receivables.vue'], () => {
        resolve(require('./bill-edit-receivables.vue'))
      }, "tgapp-bill-edit-receivables");
    },
  },
  {
    name: 'bill-edit-hotel',
    path: '/tgapp-bill-edit-hotel',
    component(resolve) {
      require.ensure(['./bill-edit-hotel.vue'], () => {
        resolve(require('./bill-edit-hotel.vue'))
      }, "tgapp-bill-edit-hotel");
    },
  },
  {
    name: 'bill-edit-meal',
    path: '/tgapp-bill-edit-meal',
    component(resolve) {
      require.ensure(['./bill-edit-meal.vue'], () => {
        resolve(require('./bill-edit-meal.vue'))
      }, "tgapp-bill-edit-meal");
    },
  },
  {
    name: 'bill-edit-car',
    path: '/tgapp-bill-edit-car',
    component(resolve) {
      require.ensure(['./bill-edit-car.vue'], () => {
        resolve(require('./bill-edit-car.vue'))
      }, "tgapp-bill-edit-car");
    },
  },
  {
    name: 'bill-edit-ticket',
    path: '/tgapp-bill-edit-ticket',
    component(resolve) {
      require.ensure(['./bill-edit-ticket.vue'], () => {
        resolve(require('./bill-edit-ticket.vue'))
      }, "tgapp-bill-edit-ticket");
    },
  },
  {
    name: 'bill-edit-otherPay',
    path: '/tgapp-bill-edit-otherPay',
    component(resolve) {
      require.ensure(['./bill-edit-otherPay.vue'], () => {
        resolve(require('./bill-edit-otherPay.vue'))
      }, "tgapp-bill-edit-otherPay");
    },
  }
]

export default routes;