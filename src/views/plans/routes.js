export default [
  {
    name: 'line-plan',
    path: '/line-plan',
    component(resolve) {
        require.ensure(['./plan-list.vue'], () => {
          resolve(require('./plan-list.vue'))
        }, "plan-list");
    },
  },
  {
    name: 'plan-search',
    path: '/plan-search',
    component(resolve) {
        require.ensure(['./plan-search.vue'], () => {
          resolve(require('./plan-search.vue'))
        }, "plan-search");
    },
    meta: {
      onceIn: true,
    }
  },
  {
    name: 'plan-info',
    path: '/plan-info',
    component(resolve) {
        require.ensure(['./plan-info.vue'], () => {
          resolve(require('./plan-info.vue'))
        }, "plan-info");
    },
  },
  {
    name: 'place-info',
    path: '/place-info',
    component(resolve) {
        require.ensure(['./places/place-info.vue'], () => {
          resolve(require('./places/place-info.vue'))
        }, "place-info");
    },
  },
  {
    name: 'place-list',
    path: '/place-list',
    component(resolve) {
        require.ensure(['./places/place-list.vue'], () => {
          resolve(require('./places/place-list.vue'))
        }, "place-list");
    },
  },
  {
    name: 'city-info',
    path: '/city-info',
    component(resolve) {
        require.ensure(['./citys/city-info.vue'], () => {
          resolve(require('./citys/city-info.vue'))
        }, "city-info");
    },
  },
  {
    name: 'price-info',
    path: '/price-info',
    component(resolve) {
        require.ensure(['./prices/price-info.vue'], () => {
          resolve(require('./prices/price-info.vue'))
        }, "price-info");
    },
    meta:{
      scrollToTop: true, //一直滚动到顶部
    },
  },
]
