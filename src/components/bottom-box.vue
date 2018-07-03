<template>
  <div class="my-bottom-box">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'my-bottom-box',
  data () {
    return {
    }
  },
  created() {
  },
}
</script>

<style>
  .my-bottom-box {
    padding: 20px 20px 30px;
  }
</style>
