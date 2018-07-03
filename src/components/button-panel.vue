<template>
<div class="mint-palette-button" :style="buttonClass">
  <div class="mint-main-button">
    <slot></slot>
  </div>
</div>
</template>

<script>
export default {
  name: 'my-button-panel',
  data () {
    return {
    }
  },
  created() {
  },
  computed: {
    buttonClass() {
      if (this.fixed) {
        return "position: fixed;"
      } else {
        return ""
      }
    }
  },
  props: {
    fixed: {
      type: Boolean,
      default: false,
    }
  }
}
</script>

<style>
.mint-palette-button{
  position: fixed;
  right: 20px;
  bottom: 80px;
}
.mint-main-button {
  color: #fff;
  /*background-color:#26a2ff;*/
  background-color: #888888;
  opacity: 0.4;
}
</style>
