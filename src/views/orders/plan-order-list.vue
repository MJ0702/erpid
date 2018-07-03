<template>
  <my-order-list type="0">
  </my-order-list>
</template>

<script>
import OrderList from '../commons/plan-order-list.vue' 

export default {
  data() {
    return {
      title:'团期订单'
    }
  },
  computed: {
  },
  created() {

  },
  methods: {

  },
  components: {
    "my-order-list": OrderList,

  },
  props:{

  }
}
</script>

<style>

</style>
