<template>
<my-order-show :title="title"
  :operation="operation"
  :orderurl="orderUrl"
  :refuseurl="refuseUrl"
  :consenturl="consentUrl"
  :allow="allow"
  :showamount="false"
  ref="ordershow"
  >
</my-order-show>
</template>

<script>
import OrderShow from '../../commons/order-show.vue'

export default {
  data() {
    return {
      title: "确认转预留审批",
      orderUrl: "order/order-confirm-reserved-detail",
      refuseUrl: "order/order-confirm-reserved-refused",
      consentUrl: "order/order-confirm-reserved-confirm",
      allow(order) {
        if(order&&order.logId_isOK=="0"&&order.isOK=="1") {
          return true;
        } else {
          return false;
        }
      },
    }
  },
  computed: {
  },
  created() {

  },
  methods: {

  },
  components: {
    "my-order-show": OrderShow,
  },
  beforeRouteLeave (to, from, next) {
    if(this.$refs.ordershow.prepareToExit()) {
      next(false);
    } else {
      next();
    }
  },
}
</script>

<style scoped>
</style>
