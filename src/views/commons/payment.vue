<template>
  <my-grid-item  @click.native="goPay" class="router-link">
    <img src="~assets/payment-grid.png" slot="icon">
    我要交款
  </my-grid-item>
</template>

<script>
import {Toast} from "mint-ui"

export default {
  data () {
    return {
    }
  },
  created() {
  },
  methods: {
    goPay() {
      Toast("正在前往付款页面");
      this.$store.dispatch("money/receipt/receipt_qrcode_request", true).then((body)=>{
        if(body&&body.executeStatus==0&&body.qrcode) {
          window.location.href = body.qrcode;
        } else {
          Toast("付款导航失败")
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
