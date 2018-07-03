<template>
  <!-- 银行账户 -->
  <div>
    <mt-header title="账单详情" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="blank" style="height:40px"></div>
    <!--
    -->
    <my-cell title="账单摘要" :value="bills_detail.theTitle"></my-cell>
    <mt-cell title="单价" :value="bills_detail.thePrice"></mt-cell>
    <mt-cell title="数量" :value="bills_detail.theNum"></mt-cell>
    <mt-cell title="币种" :value="bills_detail.theCur"></mt-cell>
    <mt-cell title="汇率" :value="bills_detail.theRate"></mt-cell>
    <mt-cell title="原币金额" :value="bills_detail.theAmount"></mt-cell>
    <mt-cell title="本币金额" :value="bills_detail.amount"></mt-cell>
    <mt-cell style="margin-top:10px;" title="录入人" :value="bills_detail.admName"></mt-cell>
    <mt-cell title="录入时间" :value="DateFmt(bills_detail.addTime, 'yyyy-MM-dd hh:mm')"></mt-cell>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui';

  export default {
    data() {
      return {

      }
    },
    created() {
      let order_bill_select = this.$store.getters["order/order_select"];
      let bills_id = this.$route.query.bills_id;
      order_bill_select.bills_id = bills_id;
      if (order_bill_select.planID === undefined || order_bill_select.ordID === undefined) {
        Toast('无法获取订单ID和团期ID，可以尝试点击返回2次再次进入！');
        order_bill_select.planID = '';
        order_bill_select.ordID = '';
        return false;
      }
      this.$store.dispatch("order/bills/bills_detail_request",
        { order_bill_select: order_bill_select });
    },
    computed: {
      bills_detail() {
        return this.$store.getters["order/bills/bills_detail"];
      },
    },
    methods: {

    },
    components: {

    }
  }

</script>

<style>
  .my-cell .mint-cell-value>:first-child {
    line-height: 17px;
  }
</style>