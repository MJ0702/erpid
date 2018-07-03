<template>
  <div>
    <mt-tabbar v-model="selectedCur" class="bottom-tab">
      <mt-tab-item id="home" @click.native="toPage('/')">
        <img slot="icon" src="~assets/home-tab.png" v-if="selected!='home'">
        <img slot="icon" src="~assets/home-tab-active.png" v-if="selected=='home'"> 首页
      </mt-tab-item>
      <mt-tab-item id="plan" v-show="PermitCheck('line-plan')" @click.native="toPage('/plan-search')">
        <img slot="icon" src="~assets/plan-tab.png" v-if="selected!='plan'">
        <img slot="icon" src="~assets/plan-tab-active.png" v-if="selected=='plan'"> 团期
      </mt-tab-item>
      <mt-tab-item id="order" v-show="PermitCheck('order')" @click.native="toPage('/order-list')">
        <img slot="icon" src="~assets/order-tab.png" v-if="selected!='order'">
        <img slot="icon" src="~assets/order-tab-active.png" v-if="selected=='order'"> 订单
      </mt-tab-item>
      <mt-tab-item style="position:relative;" id="mine" @click.native="toPage('/me')">
        <img slot="icon" src="~assets/mine-tab.png" v-if="selected!='mine'">
        <img slot="icon" src="~assets/mine-tab-active.png" v-if="selected=='mine'"> 我的
        <div class="red-dot-box">
          <div type="error" size="small" class="red-dot" v-if="mineDot>0 || pushDot >0"></div>
        </div>
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
  export default {
    name: 'my-navigate-tab',
    data() {
      return {
        selectedCur: "",
      }
    },
    created() {
      this.selectedCur = this.selected;
      console.log(this.mineDot);
      console.log(this.pushDot);
    },
    computed: {
      //红点  是否有新消息
      mineDot() {
        return this.$store.getters["mine/mineDot"];
      },
      //红点  是否有推送消息
      pushDot() {
        return this.$store.getters["mine/pushDot"];
      },
    },
    watch: {
      selected(val) {
        this.selectedCur = val;
      }
    },
    methods: {
      toPage(path) {
        if (path) {
          this.$router.push({ path })
        }
      }
    },
    props: {
      selected: {
        type: String,
        default: "home"
      }
    }
  }

</script>

<style>
  .bottom-tab {
    position: fixed;
    bottom: -1px;
    left: 0;
  }
  
  .mint-tabbar>.mint-tab-item {
    margin-top: 1px;
  }
  
  .mint-tabbar>.mint-tab-item.is-selected {
    background-color: #fafafa;
    color: #26a2ff;
    border-top: 12px;
  }
  
  .red-dot-box {
    position: absolute;
    top: 5px;
    right: 20%;
  }
</style>