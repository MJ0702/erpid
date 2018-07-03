export default [
  {
    name: 'company',
    path: '/company',
    component(resolve) {
        require.ensure(['./company.vue'], () => {
          resolve(require('./company.vue'))
        }, "company");
    },
  },
  {
    name: 'company-add',
    path: '/company-add',
    component(resolve) {
        require.ensure(['./company-add.vue'], () => {
          resolve(require('./company-add.vue'))
        }, "company-add");
    },
  },
  {
    name: 'company-edit',
    path: '/company-edit',
    component(resolve) {
        require.ensure(['./company-edit.vue'], () => {
          resolve(require('./company-edit.vue'))
        }, "company-edit");
    },
  },
  {
    name: 'company-info',
    path: '/company-info',
    component(resolve) {
        require.ensure(['./company-info.vue'], () => {
          resolve(require('./company-info.vue'))
        }, "company-info");
    },
  },
]
