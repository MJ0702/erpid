export default [
  {
    name: 'customer-search',
    path: '/customer-search',
    component(resolve) {
        require.ensure(['./customer-search.vue'], () => {
          resolve(require('./customer-search.vue'))
        }, "customer-search");
    },
  },
  {
    name: 'company-search',
    path: '/company-search',
    component(resolve) {
        require.ensure(['./company-search.vue'], () => {
          resolve(require('./company-search.vue'))
        }, "company-search");
    },
  },
  {
    name: 'customer-info',
    path: '/customer-info',
    component(resolve) {
        require.ensure(['./customer-info.vue'], () => {
          resolve(require('./customer-info.vue'))
        }, "customer-info");
    },
  },
  {
    name: 'customer-add',
    path: '/customer-add',
    component(resolve) {
        require.ensure(['./customer-add.vue'], () => {
          resolve(require('./customer-add.vue'))
        }, "customer-add");
    },
  },
  {
    name: 'customer-edit',
    path: '/customer-edit',
    component(resolve) {
        require.ensure(['./customer-edit.vue'], () => {
          resolve(require('./customer-edit.vue'))
        }, "customer-edit");
    },
  },
  {
    name: 'follow-record',
    path: '/follow-record',
    component(resolve) {
      require.ensure(['./followRecords/follow-record.vue'], () => {
        resolve(require('./followRecords/follow-record.vue'))
      }, "follow-record");
    },
  },
  {
    name: 'follow-add',
    path: '/follow-add',
    component(resolve) {
      require.ensure(['./followRecords/follow-add.vue'], () => {
        resolve(require('./followRecords/follow-add.vue'))
      }, "follow-add");
    },
  },
  {
    name: 'follow-edit',
    path: '/follow-edit',
    component(resolve) {
      require.ensure(['./followRecords/follow-edit.vue'], () => {
        resolve(require('./followRecords/follow-edit.vue'))
      }, "follow-edit");
    },
  },
  {
    name: 'follow-detail',
    path: '/follow-detail',
    component(resolve) {
      require.ensure(['./followRecords/follow-detail.vue'], () => {
        resolve(require('./followRecords/follow-detail.vue'))
      }, "follow-detail");
    },
  },
]
