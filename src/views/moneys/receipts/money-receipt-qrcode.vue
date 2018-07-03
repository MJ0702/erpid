<template>
<div class="money-receipt-qrcode">
  <mt-header fixed>
    <a @click="$router.go(-1)" slot="left">
      <mt-button icon="back">返回</mt-button>
    </a>
  </mt-header>
  <div style="height:40px"></div>
  <div class="diagonal"></div>
  <div class="qrcode">
    <div class="qrcode-header">
      微信或支付宝扫码付款
    </div>
    <div class="qrcode-payto">
      <span>
        {{user.trueName}} 发起
      </span>
      <br>
      <span>
        向「{{user.merchant_name||user.merchant_full_name}}」转账
      </span>
    </div>
    <div class="qrcode-rows">
      <div class="qrcode-row row1" v-if="receipt.money">
        <sup>￥</sup><span>{{receipt.money | cny}}</span>
      </div>
      <div class="qrcode-row row2" v-if="receipt.remark">
        {{receipt.remark}}
      </div>
      <div class="qrcode-row row3" v-if="order.ID">
        订单号：{{order.ID}}
      </div>
      <!-- <div class="qrcode-row row3" v-if="!order.ID&&(customer.ID||customer.cpyID)">
        {{customer.cpyName||customer.simName||customer.trueName}}
      </div> -->
    </div>
    <div class="qrcode-body">
      <img :src="qrcodeUrl" v-if="qrcodeUrl">
      <mt-spinner color="rgb(100, 100, 100)" :size="60" type="fading-circle" class="loading" v-else></mt-spinner>
    </div>
    <div class="qrcode-cus" v-if="!order.ID&&(customer.ID||customer.cpyID)">
      付款单位: {{customer.cpyName||customer.simName||customer.trueName}}
    </div>
    <div class="qrcode-footer">
      <router-link :to="{name: 'money-receipt-input'}" class="blue-link" replace>设置金额</router-link>
      <span class="footer-split">&nbsp;|&nbsp;</span>
      <router-link :to="{name: 'money-receipt-records'}" class="blue-link">收款记录</router-link>
    </div>
  </div>
  <div class="footer">
    <p class="text">{{user.cpyName}}</p>
  </div>
</div>
</template>

<script>
import {Toast} from "mint-ui"

export default {
  data () {
    return {
      qrcodeUrl: "",
    }
  },
  created() {
    //支付类型分四种，
    //1. 直接收款，没有备注，客户，订单
    //2. 设置金额，备注收款，没有客户，订单
    //3. 设置金额，备注，客户收款，没有订单
    //4. 订单收款，设置备注，没有客户

    let query = this.$route.query;
    let type = "";
    if(query&&query.type) {
      type = query.type;
    }
    if(type=="money") { //设置金额，备注收款，没有客户，订单
      this.$store.dispatch("money/receipt/receipt_customer_select", {});
      this.$store.dispatch("money/receipt/receipt_order_select", {});
    } else if (type=="customer") { //设置金额，备注，客户收款，没有订单
      this.$store.dispatch("money/receipt/receipt_order_select", {});
    } else if (type=="order-refresh") { //订单收款，无备注，没有客户
      this.$store.dispatch("money/receipt/receipt_customer_select", {});
      this.$store.dispatch("money/receipt/receipt_remark_input", null);
      this.$store.dispatch("money/receipt/receipt_money_input", this.order.amount - this.order.pingAmount);
    } else if (type=="order-modify") { //订单收款，设置金额，设置备注，没有客户
      this.$store.dispatch("money/receipt/receipt_customer_select", {});
    } else { //直接收款，没有备注，客户，订单
      this.$store.dispatch("money/receipt/receipt_money_input", null);
      this.$store.dispatch("money/receipt/receipt_remark_input", null);
      this.$store.dispatch("money/receipt/receipt_order_select", {});
      this.$store.dispatch("money/receipt/receipt_customer_select", {});
    }

    //生成获取二维码链接
    this.$store.dispatch("money/receipt/receipt_qrcode_request").then((body)=>{
      if(body&&body.executeStatus==0&&body.qrcode) {
        this.qrcodeUrl = "http://pan.baidu.com/share/qrcode?w=150&h=150&url="+body.qrcode;
      } else {
        this.qrcodeUrl = "";
      }
    })
  },
  computed: {
    user() {
      return this.$store.getters["mine/mine"];
    },
    receipt() {
      return this.$store.getters["money/receipt/receipt"];
    },
    customer() {
      return this.$store.getters["money/receipt/receipt_customer"];
    },
    order() {
      return this.$store.getters["money/receipt/receipt_order"];
    },
  },
  methods: {

  },
  watch: {
  }
}
</script>

<style scoped>
.money-receipt-qrcode {
  height: 100%;
  background-color: #26a2ff;
}
.diagonal {
  /*height: 100px;
  background-color: #26a2ff;
  clip-path: padding-box polygon(0 0, 100% 0, 10% 90%, 0 100%);
  -webkit-clip-path: padding-box polygon(0 0, 100% 0, 10% 90%, 0 100%);*/
  /*width: 0;
  height: 0;
  border-right: 400px solid var(--background-color);
  border-top: 100px solid #26a2ff;*/
  /*background: linear-gradient(to right bottom, #26a2ff 50%, var(--background-color) 50%);*/
  /*transform: skewY(-1.5deg);*/
}

.qrcode {
  width: 86%;
  height: auto;
  margin-left:auto;
  margin-right:auto;
  box-shadow: 0px 0px 10px 0px rgba(128,128,128,0.8);
  border-radius: 10px;
  background-color: #fff;
}
.qrcode-header {
  height: 52px;
  line-height: 52px;
  text-align: center;
  background-color: #fff;
  margin-top: 15px;
  border-radius: 10px 10px 0px 0px;
  border-bottom: 1px solid #eee;
}
.qrcode-payto {
  font-size: 0.8em;
  color: #888;
  background-color: #fff;
  text-align: center;
  padding-top: 8px;
}
.qrcode-payto span:nth-child(1) {
  transform: scale(0.8);
  display: inline-block;
}
.qrcode-rows {
  background-color: #fff;
}
.qrcode-row {
  text-align: center;
}
.qrcode-row.row1{
  height: 40px;
  line-height: 40px;
  font-style: bold;
  padding-top: 10px;
}
.qrcode-row.row1 sup{
  position: relative;
  top: -8px;
}
.qrcode-row.row1 span{
  font-size: 2.1em;
}
.qrcode-row.row2{
  font-size: 0.8em;
  height: 26px;
  line-height: 26px;
}
.qrcode-row.row3{
  font-size: 0.8em;
  color: #888;
  height: 26px;
  line-height: 26px;
}
.qrcode-body {
  text-align: center;
  background-color: #fff;
}

.qrcode-cus {
  font-size: 0.8em;
  color: #888;
  background-color: #fff;
  text-align: center;
}

.qrcode-body img {
  /*padding-top: 10px;*/
  height: 180px;
  width: 180px;
}
.qrcode-body .loading {
  padding-top: 10px;
  height: 180px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qrcode-footer {
  height: 52px;
  line-height: 52px;
  text-align: center;
  background-color: #fff;
  border-radius: 0px 0px 10px 10px;
}

.footer-split {
  font-size: 0.8em;
  color: #aaa;
  line-height: 0.8em;
  position: relative;
  top: -2px;
}
.blue-link:link {
  color: #26a2ff
}
.blue-link {
  color: #26a2ff;
  text-decoration: none;
}

.footer {
  position: fixed;
  bottom: .52em;
  left: 0;
  right: 0;
  color: #fff;
  text-align: center;
  font-size: 16px;
}
.text {
  padding: 0 .34em;
  font-size: 12px;
}
</style>
