<template>
  <div class="my-navbar mint-navbar" :class="{ 'is-fixed': fixed }" ref="navbar">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'my-navbar',

  props: {
    fixed: Boolean,
    value: {}
  },
  watch: {
    value(val) {
      let n = this.$refs.navbar,
          el = n.$el||n,
          cs = n.$children||n.children,
          cEl = null;
      for (let e of cs) {
        //根据 navbar 的子元素 tab-item 的 val 属性判断哪个元素被选中
        //因此要使 navbar 有自动导航效果, 子元素需配置 val 属性, 其值与选中组件一致
        let tmpe = e.$el||e;
        if(tmpe.getAttribute("val")==val) {
          cEl = tmpe;
        }
      }
      if(!cEl)return;
      let lcEl = cs[cs.length-1].$el||cs[cs.length-1],
          cw = el.clientWidth,
          col = cEl.offsetLeft,
          ccw = cEl.clientWidth,
          lol =  lcEl.offsetLeft - cw + ccw,
          sf = col-ccw > 0 ? (col-ccw > lol ? lol : col-ccw) : 0;
      let si = setInterval(()=>{
        if(el.scrollLeft < sf) {
          el.scrollLeft+=5;
          if(el.scrollLeft<=0||el.scrollLeft>=sf) {
            clearInterval(si);
          }
        } else {
          el.scrollLeft-=5;
          if(el.scrollLeft<=0||el.scrollLeft<=sf) {
            clearInterval(si);
          }
        }
      }, 5);
    }
  }
};
</script>

<style>
/*mint-navbar
沿用部分 mint-ui 的css
*/
.my-navbar.mint-navbar {
  display: block;
  white-space: nowrap;
  overflow-x: auto;
}
.my-navbar.mint-navbar::-webkit-scrollbar{
  height: 0px;
}
.my-navbar.mint-navbar .mint-tab-item.is-selected{
  margin-bottom: 0;
}
.my-navbar.mint-navbar .mint-tab-item {
  display: inline-block;
  width: 128px;
  white-space: initial;
}
</style>
