export default [
  {
    name: 'request-funds',
    path: '/request-funds',
    component(resolve) {
      require.ensure(['./request-funds.vue'], () => {
        resolve(require('./request-funds.vue'))
      }, "request-funds");
    },
  },
  {
    name: 'funds-info',
    path: '/funds-info',
    component(resolve) {
      require.ensure(['./funds-info.vue'], () => {
        resolve(require('./funds-info.vue'))
      }, "funds-info");
    },
  }
]