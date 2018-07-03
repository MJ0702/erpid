<template>
<my-order-show :title="title"
  :operation="operation"
  :orderurl="orderUrl"
  :refuseurl="refuseUrl"
  :consenturl="consentUrl"
  :allow="allow"
  ref="ordershow"
  >
</my-order-show>
</template>

<script>
import OrderShow from '../../commons/order-show.vue'

export default {
  data() {
    return {
      title: "担保确认审批",
      // orderUrl: "/sys/api/pub_m/order-guarantee-confirm-detail",
      orderUrl: "order/order-guarantee-confirm-detail",
      refuseUrl: "order/order-guarantee-refused",
      consentUrl: "order/order-guarantee-confirm",
      allow(order) {
        if(order&&order.logId_isOK=="0"&&order.isOK=="0") {
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
