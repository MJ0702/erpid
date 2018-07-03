<template>
  <my-order-list type="0">
  </my-order-list>
</template>

<script>
import OrderList from '../commons/order-list.vue' 

export default {
  data() {
    return {
      title:'我的订单'
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
