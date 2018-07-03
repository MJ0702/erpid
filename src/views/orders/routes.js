export default [
  {
    name: 'order-place',
    path: '/order-place',
    component(resolve) {
      require.ensure(['./order-place.vue'], () => {
        resolve(require('./order-place.vue'))
      }, "order-place");
    },
    meta: { scrollToTop: ['plan-info'] } //若从plan-info进入则滚动到顶部
  },
  {
    name: 'order-info',
    path: '/order-info',
    component(resolve) {
      require.ensure(['./order-info.vue'], () => {
        resolve(require('./order-info.vue'))
      }, "order-info");
    },
    meta: {
      scrollToTop: true, //一直滚动到顶部
    },
  },
  {
    name: 'order-edit',
    path: '/order-edit',
    component(resolve) {
      require.ensure(['./order-edit.vue'], () => {
        resolve(require('./order-edit.vue'))
      }, "order-edit");
    },
  },
  {
    name: 'order-result',
    path: '/order-result',
    component(resolve) {
      require.ensure(['./order-result.vue'], () => {
        resolve(require('./order-result.vue'))
      }, "order-result");
    },
  },
  {
    name: 'order-list',
    path: '/order-list',
    component(resolve) {
      require.ensure(['./order-list.vue'], () => {
        resolve(require('./order-list.vue'))
      }, "order-list");
    },
  },
  {
    name: 'plan-order-list',
    path: '/plan-order-list',
    component(resolve) {
      require.ensure(['./plan-order-list.vue'], () => {
        resolve(require('./plan-order-list.vue'))
      }, "plan-order-list");
    },
  },
  {
    name: 'order-all-list',
    path: '/order-all-list',
    component(resolve) {
      require.ensure(['./order-all-list.vue'], () => {
        resolve(require('./order-all-list.vue'))
      }, "order-all-list");
    },
  },
  {
    name: 'order-search',
    path: '/order-search',
    component(resolve) {
      require.ensure(['./order-search.vue'], () => {
        resolve(require('./order-search.vue'))
      }, "order-search");
    },
  },
  {
    name: 'plan-order-search',
    path: '/plan-order-search',
    component(resolve) {
      require.ensure(['./plan-order-search.vue'], () => {
        resolve(require('./plan-order-search.vue'))
      }, "plan-order-search");
    },
  },
  {
    name: 'order-search-all',
    path: '/order-search-all',
    component(resolve) {
      require.ensure(['./order-search-all.vue'], () => {
        resolve(require('./order-search-all.vue'))
      }, "order-search-all");
    },
  },
  {
    name: 'order-search-list',
    path: '/order-search-list',
    component(resolve) {
      require.ensure(['./order-search-list.vue'], () => {
        resolve(require('./order-search-list.vue'))
      }, "order-search-list");
    },
  },
  {
    name: 'plan-order-search-list',
    path: '/plan-order-search-list',
    component(resolve) {
      require.ensure(['./plan-order-search-list.vue'], () => {
        resolve(require('./plan-order-search-list.vue'))
      }, "plan-order-search-list");
    },
  },
  {
    name: 'order-search-all-list',
    path: '/order-search-all-list',
    component(resolve) {
      require.ensure(['./order-search-all-list.vue'], () => {
        resolve(require('./order-search-all-list.vue'))
      }, "order-search-all-list");
    },
  },
  {
    name: 'order-customer-add',
    path: '/order-customer-add',
    component(resolve) {
      require.ensure(['./customers/order-customer-add.vue'], () => {
        resolve(require('./customers/order-customer-add.vue'))
      }, "order-customer-add");
    },
  },
  {
    name: 'order-customer-search',
    path: '/order-customer-search',
    component(resolve) {
      require.ensure(['./customers/order-customer-search.vue'], () => {
        resolve(require('./customers/order-customer-search.vue'))
      }, "order-customer-search");
    },
  },
  {
    name: 'order-company-search',
    path: '/order-company-search',
    component(resolve) {
      require.ensure(['./customers/order-company-search.vue'], () => {
        resolve(require('./customers/order-company-search.vue'))
      }, "order-company-search");
    },
  },
  {
    name: 'city-select',
    path: '/city-select',
    component(resolve) {
      require.ensure(['./citys/city-select.vue'], () => {
        resolve(require('./citys/city-select.vue'))
      }, "city-select");
    },
  },
  {
    name: 'price-select',
    path: '/price-select',
    component(resolve) {
      require.ensure(['./prices/price-select.vue'], () => {
        resolve(require('./prices/price-select.vue'))
      }, "price-select");
    },
    meta: {
      scrollToTop: true, //一直滚动到顶部
    },
  },
  {
    name: 'saler-info',
    path: '/saler-info',
    component(resolve) {
      require.ensure(['./salers/saler-info.vue'], () => {
        resolve(require('./salers/saler-info.vue'))
      }, "saler-info");
    },
  },
  {
    name: 'saler-search',
    path: '/saler-search',
    component(resolve) {
      require.ensure(['./salers/saler-search.vue'], () => {
        resolve(require('./salers/saler-search.vue'))
      }, "saler-search");
    },
  },
  {
    name: 'saler-assistant-search',
    path: '/saler-assistant-search',
    component(resolve) {
      require.ensure(['./salers/saler-assistant-search.vue'], () => {
        resolve(require('./salers/saler-assistant-search.vue'))
      }, "saler-assistant-search");
    },
    meta: {
      scrollToTop: true, //一直滚动到顶部
    },
  },
  {
    name: 'order-type-select',
    path: '/order-type-select',
    component(resolve) {
      require.ensure(['./order-type-select.vue'], () => {
        resolve(require('./order-type-select.vue'))
      }, "order-type-select");
    },
  },
  {
    name: 'order-approve-confirm-cancel',
    path: '/order-approve-confirm-cancel',
    component(resolve) {
      require.ensure(['./approves/order-approve-confirm-cancel.vue'], () => {
        resolve(require('./approves/order-approve-confirm-cancel.vue'))
      }, "order-approve-confirm-cancel");
    },
  },
  {
    name: 'order-approve-confirm-reserved',
    path: '/order-approve-confirm-reserved',
    component(resolve) {
      require.ensure(['./approves/order-approve-confirm-reserved.vue'], () => {
        resolve(require('./approves/order-approve-confirm-reserved.vue'))
      }, "order-approve-confirm-reserved");
    },
  },
  {
    name: 'order-approve-guarantee',
    path: '/order-approve-guarantee',
    component(resolve) {
      require.ensure(['./approves/order-approve-guarantee.vue'], () => {
        resolve(require('./approves/order-approve-guarantee.vue'))
      }, "order-approve-guarantee");
    },
  },
  {
    name: 'order-approve-turn-group',
    path: '/order-approve-turn-group',
    component(resolve) {
      require.ensure(['./approves/order-approve-turn-group.vue'], () => {
        resolve(require('./approves/order-approve-turn-group.vue'))
      }, "order-approve-turn-group");
    },
  },
  {
    name: 'order-turn-plan',
    path: '/order-turn-plan',
    component(resolve) {
      require.ensure(['./plans/order-turn-plan.vue'], () => {
        resolve(require('./plans/order-turn-plan.vue'))
      }, "order-turn-plan");
    },
  },
  {
    name: 'order-turn-plan-list',
    path: '/order-turn-plan-list',
    component(resolve) {
      require.ensure(['./plans/order-turn-plan-list.vue'], () => {
        resolve(require('./plans/order-turn-plan-list.vue'))
      }, "order-turn-plan-list");
    },
  },
  {
    name: 'order-more',
    path: '/order-more',
    component(resolve) {
      require.ensure(['./order-more.vue'], () => {
        resolve(require('./order-more.vue'))
      }, "order-more");
    },
  },
  {
    name: 'bills',
    path: '/bills',
    component(resolve) {
      require.ensure(['./bills/bills.vue'], () => {
        resolve(require('./bills/bills.vue'))
      }, "bills");
    },
  },
  {
    name: 'bills-add',
    path: '/bills-add',
    component(resolve) {
      require.ensure(['./bills/bills-add.vue'], () => {
        resolve(require('./bills/bills-add.vue'))
      }, "bills-add");
    },
  },
  {
    name: 'bills-edit',
    path: '/bills-edit',
    component(resolve) {
      require.ensure(['./bills/bills-edit.vue'], () => {
        resolve(require('./bills/bills-edit.vue'))
      }, "bills-edit");
    },
  },
  {
    name: 'bills-type',
    path: '/bills-type',
    component(resolve) {
      require.ensure(['./bills/bills-type.vue'], () => {
        resolve(require('./bills/bills-type.vue'))
      }, "bills-type");
    },
  },
  {
    name: 'bills-cur',
    path: '/bills-cur',
    component(resolve) {
      require.ensure(['./bills/bills-cur.vue'], () => {
        resolve(require('./bills/bills-cur.vue'))
      }, "bills-cur");
    },
  },
  {
    name: 'bills-detail',
    path: '/bills-detail',
    component(resolve) {
      require.ensure(['./bills/bills-detail.vue'], () => {
        resolve(require('./bills/bills-detail.vue'))
      }, "bills-detail");
    },
  },
  {
    name: 'order-receipt-list',
    path: '/order-receipt-list',
    component(resolve) {
      require.ensure(['./receipts/order-receipt-list.vue'], () => {
        resolve(require('./receipts/order-receipt-list.vue'))
      }, "order-receipt-list");
    },
  },
  {
    name: 'order-receipt-treat',
    path: '/order-receipt-treat',
    component(resolve) {
      require.ensure(['./receipts/order-receipt-treat.vue'], () => {
        resolve(require('./receipts/order-receipt-treat.vue'))
      }, "order-receipt-treat");
    },
  },
  {
    name: 'order-receipt-info',
    path: '/order-receipt-info',
    component(resolve) {
      require.ensure(['./receipts/order-receipt-info.vue'], () => {
        resolve(require('./receipts/order-receipt-info.vue'))
      }, "order-receipt-info");
    },
  },
  {
    name: 'order-receipt-ping',
    path: '/order-receipt-ping',
    component(resolve) {
      require.ensure(['./receipts/order-receipt-ping.vue'], () => {
        resolve(require('./receipts/order-receipt-ping.vue'))
      }, "order-receipt-ping");
    },
  },
  {
    name: 'order-tours',
    path: '/order-tours',
    component(resolve) {
      require.ensure(['./tours/tours.vue'], () => {
        resolve(require('./tours/tours.vue'))
      }, "order-tours");
    },
  },
  {
    name: 'order-tours-edit',
    path: '/order-tours-edit',
    component(resolve) {
      require.ensure(['./tours/tours-edit.vue'], () => {
        resolve(require('./tours/tours-edit.vue'))
      }, "order-tours-edit");
    },
  },
  {
    name: 'order-tours-detail',
    path: '/order-tours-detail',
    component(resolve) {
      require.ensure(['./tours/tours-detail.vue'], () => {
        resolve(require('./tours/tours-detail.vue'))
      }, "order-tours-detail");
    },
  },
  {
    name: 'confirm-book',
    path: '/confirm-book',
    component(resolve) {
      require.ensure(['./confirmbook/confirm-book.vue'], () => {
        resolve(require('./confirmbook/confirm-book.vue'))
      }, "confirm-book");
    },
  },
  {
    name: 'confirm-commonly',
    path: '/confirm-commonly',
    component(resolve) {
      require.ensure(['./confirmbook/confirm-commonly.vue'], () => {
        resolve(require('./confirmbook/confirm-commonly.vue'))
      }, "confirm-commonly");
    },
  },
  {
    name: 'confirm-jiaotong',
    path: '/confirm-jiaotong',
    component(resolve) {
      require.ensure(['./confirmbook/confirm-jiaotong.vue'], () => {
        resolve(require('./confirmbook/confirm-jiaotong.vue'))
      }, "confirm-jiaotong");
    },
  },
  {
    name: 'confirm-template',
    path: '/confirm-template',
    component(resolve) {
      require.ensure(['./confirmbook/confirm-template.vue'], () => {
        resolve(require('./confirmbook/confirm-template.vue'))
      }, "confirm-template");
    },
  },
  {
    name: 'confirm-title-desc',
    path: '/confirm-title-desc',
    component(resolve) {
      require.ensure(['./confirmbook/confirm-title-desc.vue'], () => {
        resolve(require('./confirmbook/confirm-title-desc.vue'))
      }, "confirm-title-desc");
    },
  },
  {
    name: 'confirm-bill-desc',
    path: '/confirm-bill-desc',
    component(resolve) {
      require.ensure(['./confirmbook/confirm-bill-desc.vue'], () => {
        resolve(require('./confirmbook/confirm-bill-desc.vue'))
      }, "confirm-bill-desc");
    },
  },
  {
    name: 'confirm-book-desc',
    path: '/confirm-book-desc',
    component(resolve) {
      require.ensure(['./confirmbook/confirm-book-desc.vue'], () => {
        resolve(require('./confirmbook/confirm-book-desc.vue'))
      }, "confirm-book-desc");
    }
  },
  {
    name: 'confirm-base-account',
    path: '/confirm-base-account',
    component(resolve) {
      require.ensure(['./confirmbook/confirm-base-account.vue'], () => {
        resolve(require('./confirmbook/confirm-base-account.vue'))
      }, "confirm-base-account");
    },
  },
  {
    name: 'confirm-bill-title',
    path: '/confirm-bill-title',
    component(resolve) {
      require.ensure(['./confirmbook/confirm-bill-title.vue'], () => {
        resolve(require('./confirmbook/confirm-bill-title.vue'))
      }, "confirm-bill-title");
    },
  },
  {
    name: 'confirm-export-content',
    path: '/confirm-export-content',
    component(resolve) {
      require.ensure(['./confirmbook/confirm-export-content.vue'], () => {
        resolve(require('./confirmbook/confirm-export-content.vue'))
      }, "confirm-export-content");
    },
  },
  {
    name: 'plans-notice',
    path: '/plans-notice',
    component(resolve) {
      require.ensure(['./plansnotice/plans-notice.vue'], () => {
        resolve(require('./plansnotice/plans-notice.vue'))
      }, "plans-notice");
    },
  },
  {
    name: 'plans-template',
    path: '/plans-template',
    component(resolve) {
      require.ensure(['./plansnotice/plans-template.vue'], () => {
        resolve(require('./plansnotice/plans-template.vue'))
      }, "plans-template");
    },
  },
  {
    name: 'plans-bill-title',
    path: '/plans-bill-title',
    component(resolve) {
      require.ensure(['./plansnotice/plans-bill-title.vue'], () => {
        resolve(require('./plansnotice/plans-bill-title.vue'))
      }, "plans-bill-title");
    },
  },
  {
    name: 'attachment',
    path: '/attachment',
    component(resolve) {
      require.ensure(['./attachment/attachment.vue'], () => {
        resolve(require('./attachment/attachment.vue'))
      }, "attachment");
    },
  },
  {
    name: 'attachment-add',
    path: '/attachment-add',
    component(resolve) {
      require.ensure(['./attachment/attachment-add.vue'], () => {
        resolve(require('./attachment/attachment-add.vue'))
      }, "attachment-add");
    },
  },
  {
    name: 'attachment-edit',
    path: '/attachment-edit',
    component(resolve) {
      require.ensure(['./attachment/attachment-edit.vue'], () => {
        resolve(require('./attachment/attachment-edit.vue'))
      }, "attachment-edit");
    },
  },
]
