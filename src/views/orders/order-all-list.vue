<template>
  <!--全部订单列表-->
  <my-order-list :title="title" type="0">
  </my-order-list>
</template>

<script>
  import OrderList from '../commons/order-all-list.vue'

  export default {
    data() {
      return {
        title: '全部订单',
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