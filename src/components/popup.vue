<template>
  <div>
    <mt-popup
      v-model="popupVisible" position="top"
      popup-transition="popup-fade" modal="false" class="mint-popup-1">
        <slot></slot>
    </mt-popup>
  </div>
</template>

<script>
export default {
  name: 'my-popup',
  data () {
    return {
    }
  },
  created() {
  },
  props:{
    
  },
}
</script>

<style>
.mintui-more{font-size:24px}
.mint-popup-1 {
    width: 90px;
    padding: 10px;
    -webkit-transform: translate(-50%);
    transform: translate(-50%);
    top:50px;
    background: rgba(0, 153, 255, 1);
    right:-50px;
    left:auto;
    text-align:center;
}
.mint-popup-1:before {
    display: inline-block;
    width: 0;
    height: 0;
    border: solid transparent;
    border-width: 10px;
    border-bottom-color: rgba(0, 153, 255, 1);
    content: '';
    position: absolute;
    top: -20px;
    right: 15px;
}
.mint-popup a{
    display:block;
    color:#fff;
    text-align:center;
    margin-top:6px;
    line-height:28px;
}
.mint-popup a.underline{
    margin-top:0;
    display:inline-block;
    border-bottom:1px solid #fff;
}
</style>
