<template>
  <!-- 主页 -->
  <div class="home-block">
    <!-- 跳转到 我的 页面 -->
    <mt-header :title="mine.cpyName" fixed>
    </mt-header>
    <div style="height:40px"></div>

    <my-block></my-block>
    <router-link to="/me" class="router-link">
      <div class="home-mine-block">
        <div>
          <img :src="mine.avatar" v-if="mine.avatar">
          <img :src="mine.headimgurl" v-else-if="mine.headimgurl">
          <img src="~assets/logo.png" v-else>
        </div>
        <div>
          <div>{{mine.trueName}}</div>
          <div>登录账号：{{mine.userName}}</div>
        </div>
        <i class="arrow-right"></i>
      </div>
    </router-link>
    <div class="home-grid-block">
      <my-block bottom left>常用功能</my-block>
      <my-grid>
        <my-grid-item v-show="PermitCheck('line-plan')" to="/plan-search" class="router-link">
          <img src="~assets/plan-grid.png" slot="icon"> 团期计划
        </my-grid-item>
        <my-grid-item v-show="PermitCheck('order')" to="/order-list" class="router-link">
          <img src="~assets/order-grid.png" slot="icon"> 我的订单
        </my-grid-item>
        <my-grid-item v-show="PermitCheck('order-all')" to="/order-all-list" class="router-link">
          <img src="~assets/order-grid.png" slot="icon"> 全部订单
        </my-grid-item>
        <my-grid-item v-show="PermitCheck('profile/phone-book')" to="/contact-list" class="router-link">
          <img src="~assets/contact-grid.png" slot="icon"> 通讯录
        </my-grid-item>
        <my-grid-item v-show="PermitCheck('notice')" to="/notice" class="router-link">
          <img src="~assets/announce-grid.png" slot="icon"> 公告信息
        </my-grid-item>
        <my-grid-item v-show="PermitCheck('sale-list')" to="/saler-rank" class="router-link">
          <img src="~assets/rankings-grid.png" slot="icon"> 销售排行榜
        </my-grid-item>
        <my-grid-item v-show="PermitCheck('bank-account')" to="/bank-account" class="router-link">
          <svg class="icon" aria-hidden="true" slot="icon" style="height:100%;width:100%;fill:#26a2ff;">
            <use xlink:href="#icon-zhanghuzhongxinyinxingqia"></use>
          </svg>
          银行账户
        </my-grid-item>
        
        <my-grid-item v-show="PermitCheck('me-receipt')"  to="/money-receipt-qrcode" class="router-link">
          <img src="~assets/qrcode-grid.png" slot="icon"> 我要收款
        </my-grid-item>
        <!-- 自定义的我要交款按钮 -->
        <my-payment v-show="PermitCheck('me-payment')"></my-payment>

        <my-grid-item to="/customer-search" v-show="PermitCheck('cust-user/list')" class="router-link">
          <img src="~assets/customer-grid.png" slot="icon"> 客户管理
        </my-grid-item>

        <my-grid-item to="/company" v-show="PermitCheck('cust-cpy/list')" class="router-link">
          <img src="~assets/customer-company.png" slot="icon"> 客户公司
        </my-grid-item>
        <my-grid-item @click.native="fnGo()" v-show="PermitCheck('big-date/dsj-home')" class="router-link">
          <img src="~assets/big-data.png" slot="icon"> 大数据
        </my-grid-item>
        <!--<my-grid-item to="/demo-charts" class="router-link">
          <img src="~assets/customer-grid.png" slot="icon"> 图表
        </my-grid-item>-->
        <!-- <my-grid-item  to="/" class="router-link">
          <img src="~assets/ad-grid.png" slot="icon">
          同业广告
        </my-grid-item> -->
      </my-grid>
    </div>
    <my-pad></my-pad>
    <my-navigate-tab selected="home"></my-navigate-tab>
  </div>
</template>

<script>
  import MyPayment from "./commons/payment.vue"

  export default {
    data() {
      return {
      }
    },
    created() {
      this.$store.dispatch("mine/mine_request");
      this.$store.dispatch("mine/get_red_dot");
    },
    computed: {
      mine() {
        return this.$store.getters["mine/mine"];
      },
      
    },
    methods: {
      erpName() {
        return erp.name;
      },
      fnGo(){
        window.location.href="/sys/api/1.0.0/big-date/dsj-home";
      }
    },
    components: {
      "my-payment": MyPayment,
    }
  }

</script>

<style>
  /*.home-block {
    height: 100%;
    background-color: var(--background-color)
  }*/
  
  .home-mine-block {
    position: relative;
    display: flex;
    padding: 10px;
    background-color: #ffffff;
  }
  
  .home-mine-block:first-child img {
    height: 60px;
    width: 60px;
    margin-right: 10px;
    border-radius: 100%;
  }
  
  .home-mine-block>div:nth-child(2) {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 10px 0px;
  }
  
  .home-mine-block div:nth-child(2) div:first-child {
    flex: 1;
    font-size: 1.17em;
    font-weight: bold;
  }
  
  .home-mine-block div:nth-child(2) div:first-child:after {
    display: inline-block;
    width: 0;
    height: 100%;
    vertical-align: middle;
    content: "";
  }
</style>