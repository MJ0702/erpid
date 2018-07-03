<template>
  <div class="order-result">
    <div>
      <img src="~assets/order-success.png">
      <h3>下单成功</h3>
      <h5 v-if="result.endTime&&(result.isTrueNum=='0')">您的预留单将于<span style="color: red;">{{DateFmt(result.endTime, "yyyy-MM-dd hh:mm")}}到期</span></h5>
    </div>
    <my-button-block>
      <mt-button type="default" size="large" v-if="PermitCheck('order')" @click.native="$router.push({name: 'order-list'})" style="background-color:#1AAD19;color:#FFFFFF;">查看订单</mt-button>
      <mt-button type="default" size="large" v-else @click.native="$router.push({name: 'home'})" style="background-color:#1AAD19;color:#FFFFFF;">确认</mt-button>
    </my-button-block>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        result: {},
      }
    },
    created(){
      let itn = this.$route.query.isTrueNum;
      this.$http.post(
        "order/order-state",
      ).then(res => {
        if(!res.body) return;
        let r = res.body;
        r.isTrueNum = itn;
        this.result = r;
      })
    },
    computed: {
    },
    methods: {
    }
  }
</script>

<style>
.order-result {
}
.order-result>div:first-child {
  text-align: center;
  padding-top: 60px;
}
.order-result>div:first-child>img {
  height: 126px;
  width: 126px;
}
</style>
