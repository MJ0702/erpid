<template>
  <div :class="buttonBlockClass">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'my-button-block',
  data () {
    return {
    }
  },
  created() {
  },
  computed: {
    buttonBlockClass() {
      if (this.fixed) {
        return "my-button-block-fixed"
      } else {
        return "my-button-block"
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
.my-button-block {
  padding: 10px 10px 10px 10px;
  /*background-color: white;*/
  /*background-color: var(--background-color);*/
}
@media (min-height: 400px) {
  .my-button-block-fixed {
    position: fixed;
    bottom: -1px;
    right: 0;
    left: 0;
    padding: 10px 10px 10px 10px;
    /*background-color: white;*/
    /*background-color: var(--background-color);*/
  }
}
@media (max-height: 400px) {
  .my-button-block-fixed {
    display: none;
  }
}
</style>
