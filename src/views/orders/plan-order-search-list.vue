<template>
  <my-order-list :type="1">
  </my-order-list>
</template>

<script>
  import OrderList from '../commons/plan-order-list.vue'

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