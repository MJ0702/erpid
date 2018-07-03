<template>
  <div class="v-modal" :style="modal" @click="handleClick"></div>
</template>

<script>
  export default {
    name: "my-modal",
    data() {
      return {
        modal: "display: none"
      }
    },
    computed: {
    },
    methods: {
      handleClick(evt) {
        this.$emit("click", evt);
      }
    },
    watch: {
      value(val) {
        this.modal = val ? "display: block" : "display: none";
      }
    },
    props:["value"]
  }
</script>

<style>
</style>
