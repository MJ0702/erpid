<template>
  <!--搜索全部订单列表-->
  <my-order-list :type="1">
  </my-order-list>
</template>

<script>
  import OrderList from '../commons/order-all-list.vue'

  export default {
    data() {
      return {
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
  }

</script>

<style>

</style>