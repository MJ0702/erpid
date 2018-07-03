export default [
  {
    name: 'contact',
    path: '/contact',
    component(resolve) {
        require.ensure(['./contact.vue'], () => {
          resolve(require('./contact.vue'))
        }, "contact");
    },
  },
  {
    name: 'contact-list',
    path: '/contact-list',
    component(resolve) {
        require.ensure(['./contact-list.vue'], () => {
          resolve(require('./contact-list.vue'))
        }, "contact-list");
    },
  },
  {
    name: 'contact-search',
    path: '/contact-search',
    component(resolve) {
        require.ensure(['./contact-search.vue'], () => {
          resolve(require('./contact-search.vue'))
        }, "contact-search");
    },
  },
]
