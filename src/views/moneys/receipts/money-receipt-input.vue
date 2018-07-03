<template>
  <div class="money-receipt-input">
    <mt-header title="设置金额" fixed>
      <a @click="goBack" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
      <mt-button slot="right" @click="clearAll">清除</mt-button>
    </mt-header>
    <div style="height:40px"></div>

    <my-block></my-block>
    <mt-field label="金额" v-model="money" placeholder="请输入收款金额" type="number" :attr="{maxlength:20, min:0}" class="input-right" @change.native="moneyCheck" ></mt-field>
    <mt-field label="摘要" v-model="remark" placeholder="请输入收款摘要" :attr="{maxlength:20}" class="input-right" @keyup.native="remarkCheck"></mt-field>
    <div v-if="order.ID">
      <my-block bottom left>订单信息</my-block>
      <div class="order-info">
        <div><span>订单号</span><span>{{order.ID}}</span></div>
        <div><span>账单总额</span><span>￥{{order.amount}}</span></div>
        <div><span>已收金额</span><span class="receipted">￥{{order.pingAmount}}</span></div>
        <div><span>未收款</span><span class="noreceipted">￥{{order.amount-order.pingAmount}}</span></div>
      </div>
    </div>
    <div v-else>
      <my-block></my-block>
      <router-link :to="{name:'money-receipt-customer', params:{money,remark,customer}}" class="router-link" replace>
        <mt-cell title="客户" :value="customer.cpyName||customer.simName||customer.trueName||'请选择'" is-link></mt-cell>
      </router-link>
    </div>
    <my-button-block>
      <mt-button type="primary" size="large" @click.native="confirm">确定</mt-button>
    </my-button-block>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'

export default {
  data() {
    return {
      money: null,
      remark: null,
      customer: {},
      order: {},
    }
  },
  created() {
    if(Object.keys(this.$route.params).length>0) {
      //先查看是否有从客户管理传来的数据
      this.money = this.$route.params.money;
      this.remark = this.$route.params.remark;
      this.customer =  this.$route.params.customer;
    } else {
      let receipt = this.$store.getters["money/receipt/receipt"];
      this.money = receipt.money;
      this.remark = receipt.remark;
      this.customer =  this.$store.getters["money/receipt/receipt_customer"];
      this.order = this.$store.getters["money/receipt/receipt_order"];
    }
  },
  computed: {
  },
  methods: {
    moneyCheck(val) {
      if(val < 0.01) {
        Toast("金额不能小于0.01")
        this.money = 0.01;
      }
      let payAmount = this.order.amount-this.order.pingAmount;
      if(payAmount && val > payAmount) {
        Toast("金额不能大于订单未收款金额")
        this.money = payAmount;
      }
    },
    remarkCheck(val) {
      if(val && val.length > 12) {
        Toast("摘要长度不允许超过12")
        this.remark = val.slice(0, 12);
      }
    },
    clearAll() {
      this.money = null;
      this.remark = null;
      this.customer =  {};
      this.order = {};
    },
    confirm() {
      let query = {};
      if(this.money.length>16){
        Toast('输入金额不能超过16位');
        return;
      }
      if(this.order.ID) {
        query.type = "order-modify"
      } else if (this.customer.ID||this.customer.cpyID) {
        query.type = "customer"
      } else { // if (this.money >= 0.01)
        query.type = "money"
      }
      this.$store.dispatch("money/receipt/receipt_money_input", this.money);
      this.$store.dispatch("money/receipt/receipt_remark_input", this.remark);
      this.$store.dispatch("money/receipt/receipt_order_select", this.order);
      this.$store.dispatch("money/receipt/receipt_customer_select", this.customer);
      this.$router.replace({name: 'money-receipt-qrcode', query})
    },
    goBack() {
      let type = null
      let query = {};
      let receipt = this.$store.getters["money/receipt/receipt"];
      let order = this.$store.getters["money/receipt/receipt_order"];
      let customer = this.$store.getters["money/receipt/receipt_customer"];
      if(order.ID) {
        query.type = "order-modify"
      } else if (customer.ID||customer.cpyID) {
        query.type = "customer"
      } else { // if (this.money >= 0.01)
        query.type = "money"
      }
      this.$router.replace({name: 'money-receipt-qrcode', query})
    }
  },
  watch: {

  },
  beforeRouteLeave (to, from, next) {
    if(to.name!="money-receipt-qrcode"&&to.name!="money-receipt-customer") {
      let type = null
      let query = {};
      let receipt = this.$store.getters["money/receipt/receipt"];
      let order = this.$store.getters["money/receipt/receipt_order"];
      let customer = this.$store.getters["money/receipt/receipt_customer"];
      if(order.ID) {
        query.type = "order-modify"
      } else if (customer.ID||customer.cpyID) {
        query.type = "customer"
      } else { // if (this.money >= 0.01)
        query.type = "money"
      }
      next({name: "money-receipt-qrcode", query});
    } else {
      next();
    }
  }
}
</script>

<style scoped>
  .order-info {
    background-color: #fff;
    padding: 12px;
  }
  .order-info div span:nth-child(1) {
    color: #666;
  }
  .order-info div span:nth-child(2) {
    float: right;
  }
  .order-info div span.receipted {
    color: green;
  }
  .order-info div span.noreceipted {
    color: red;
  }
</style>

<style>
.money-receipt-input .input-right .mint-cell-value input{
  text-align: right;
}
</style>
