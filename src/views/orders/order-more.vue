<template>
  <!-- 银行账户 -->
  <div class="order-more">
    <!-- <mt-header title="更多" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="blank" style="height:40px"></div>
    <div class="blank-more">更多功能</div> -->
    <!--
    -->
    <div class="show-none" v-show="showNone">
      没有可操作权限
    </div>
    <my-grid v-show="!showNone">
        <my-grid-item per v-show="localPermitCheck('order/order-bill-list')"  :to="toModule('bills')" class="router-link">
          <img src="~assets/bills.png" slot="icon">
          账单
        </my-grid-item>
        <my-grid-item per v-show="localPermitCheck('me-receipt', order.isOK>=0)" :to="toOrderReceipt()" class="router-link">
          <img src="~assets/qrcode-grid.png" slot="icon">
          扫码付
        </my-grid-item>
        <my-grid-item per v-show="localPermitCheck('receipt')" :to="{name: 'order-receipt-list',query:{id:order_id}}" class="router-link">
          <img src="~assets/order-receipt.png" slot="icon">
          收款
        </my-grid-item>
        <my-grid-item per v-show="PermitCheck('order/confirmation-interface')" @click.native="pushRefresh('confirm-book')" class="router-link">
          <img src="~assets/confirm-book.png" slot="icon">
          确认书
        </my-grid-item>
        <my-grid-item per v-show="PermitCheck('order/notices')" :to="toModule('plans-notice')" class="router-link">
          <img src="~assets/plan-notice.png" slot="icon">
          出团通知书
        </my-grid-item>
        <my-grid-item per v-show="PermitCheck('attachment')" :to="toModule('attachment')" class="router-link">
          <img src="~assets/attachment.png" slot="icon">
          附件
        </my-grid-item> 
        <my-grid-item per v-show="PermitCheck('order/order-name-list')" :to="{name: 'order-tours',query:{id:order_id}}" class="router-link">
          <img src="~assets/tour.png" slot="icon">
          名单
        </my-grid-item>
    </my-grid>
  </div>
</template>

<script>
  import { Toast } from "mint-ui";

  export default {
    data () {
      return {
        order_id: "",
        showNone: true,
      }
    },
    created() {
      let order_id = this.$store.getters["order/order_id"];
      if(order_id) {
        this.order_id = order_id;
      } else {
        this.order_id = this.$route.query.id;
      }
      console.log("this.order");
      console.log(this.order);
    },
    computed: {
      order() {
        return this.$store.getters["order/order_select"];
      },
    },
    methods:{
      toModule(v) {
        return {name: v, query:{id:this.order_id}};
      },
      pushRefresh(v){
            return this.$router.push(
                {name: v,
                 query:{id:this.$route.query.id},
                 params:{refresh:true}}
                );
      },
      toOrderReceipt() {
        this.$store.dispatch('money/receipt/receipt_order_select', this.order);
        return {name: 'money-receipt-qrcode', query:{type:'order-refresh'}};
      },
      localPermitCheck(key, other) {
        other = other === false ? false : true;
        let check = this.PermitCheck(key);
        if(check&&other) {
          this.showNone = false;
        }
        return check&&other;
      },
    },
    components: {

    }
  }
</script>

<style>
.icon {
  /* 通过设置 font-size 来改变图标大小 */
  width: 1em; height: 1em;
  /* 图标和文字相邻时，垂直对齐 */
  vertical-align: -0.15em;
  /* 通过设置 color 来改变 SVG 的颜色/fill */
  fill: currentColor;
  /* path 和 stroke 溢出 viewBox 部分在 IE 下会显示
    normalize.css 中也包含这行 */
  overflow: hidden;
}

.order-more {
  height: auto;
  background:#fff
}

.blank-more{
    color:#333;
    font-size:.8em;
    line-height:32px;
    padding-left:12px;
}
.show-none {
  padding: 10px;
  width: 100%;
  text-align: center;
  color: #999;
}
</style>
