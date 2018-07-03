export default [
  {
    name: 'money-receipt-qrcode',
    path: '/money-receipt-qrcode',
    component(resolve) {
        require.ensure(['./receipts/money-receipt-qrcode.vue'], () => {
          resolve(require('./receipts/money-receipt-qrcode.vue'))
        }, "money-receipt-qrcode");
    },
  },
  {
    name: 'money-receipt-input',
    path: '/money-receipt-input',
    component(resolve) {
        require.ensure(['./receipts/money-receipt-input.vue'], () => {
          resolve(require('./receipts/money-receipt-input.vue'))
        }, "money-receipt-input");
    },
  },
  {
    name: 'money-receipt-records',
    path: '/money-receipt-records',
    component(resolve) {
        require.ensure(['./receipts/money-receipt-records.vue'], () => {
          resolve(require('./receipts/money-receipt-records.vue'))
        }, "money-receipt-records");
    },
  },
  {
    name: 'money-receipt-customer',
    path: '/money-receipt-customer',
    component(resolve) {
        require.ensure(['./receipts/money-receipt-customer.vue'], () => {
          resolve(require('./receipts/money-receipt-customer.vue'))
        }, "money-receipt-customer");
    },
  },
]
