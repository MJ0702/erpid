<template>
  <div class="my-more">
     <span></span>
  </div>
</template>

<script>
export default {
  name: 'my-more',
  data () {
    return {
    }
  },
  created() {
  },
  props: {
  }
}
</script>

<style>
  .my-more {
    height:6px;
    float:right;
    margin-top:17px;
  }
  .my-more span{
      width:6px;
      height:6px;
      display:block;
      border-radius:100%;
      background:#fff;
      position:relative;
  }
  .my-more span:before,.my-more span:after{
      content:'';
      position:absolute;
      width:6px;
      height:6px;
      border-radius:100%;
      background:#fff;
      
  }
  .my-more span:before{
      top:0;
     right:8px;
  }
  .my-more span:after{
      top:0;
     right:16px;
  }
</style>
