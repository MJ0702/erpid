<template>
<my-order-show :title="title"
  :operation="operation"
  :orderurl="orderUrl"
  :refuseurl="refuseUrl"
  :consenturl="consentUrl"
  :allow="allow"
  ref="ordershow"
  models="['group']"
  >
</my-order-show>
</template>

<script>
import OrderShow from '../../commons/order-show.vue'

export default {
  data() {
    return {
      title: "转团审批",
      orderUrl: "order/order-turn-group-list",
      refuseUrl: "order/order-turn-group-refused",
      consentUrl: "order/order-turn-group-confirm",
      allow(order) {
        if(order&&order.logId_isOK=="0") {
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
