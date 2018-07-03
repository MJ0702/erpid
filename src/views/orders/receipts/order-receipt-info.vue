<template>
  <div>
    <mt-header title="收款详情"
               fixed>
      <a @click="$router.go(-1)"
         slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="blank"
         style="height:40px"></div>
    <my-block bottom
              left>基础信息</my-block>
    <mt-cell title="财务编号"
             :value="receipt.ID"></mt-cell>
    <mt-cell title="状态">
      <span style="color: #FF9900"
            v-if="receipt.isOK==0">未提交</span>
      <span style="color: #0099ff"
            v-else-if="receipt.isOK==61">已确认</span>
      <span style="color: #00CC00"
            v-else-if="receipt.isOK==51">等待确认</span>
      <span style="color: red"
            v-else-if="receipt.isOK==39">已拒绝</span>
      <span v-else></span>
    </mt-cell>
    <mt-cell title="订单号"
             :value="receipt.ordID"></mt-cell>
    <my-cell title="收款摘要"
             :value="receipt.title"
             class="newline"></my-cell>
    <my-block bottom
              left>付款信息</my-block>
    <mt-cell title="付款方式"
             :value="receipt.payType"></mt-cell>
    <my-cell title="付款方"
             :value="receipt.cpyName"></my-cell>
    <mt-cell title="付款人"
             :value="receipt.payDesc"></mt-cell>
    <my-block bottom
              left>金额信息</my-block>
    <mt-cell title="原币金额"
             :value="receipt.theAmount"></mt-cell>
    <mt-cell title="币种"
             :value="receipt.theCur"></mt-cell>
    <mt-cell title="汇率"
             :value="receipt.theRate"></mt-cell>
    <mt-cell title="款项金额"
             :value="receipt.amount"></mt-cell>
    <my-cell title="收款账户"
             :value="receipt.accInfo"
             class="newline"></my-cell>
    <mt-cell title="到账日期"
             :value="DateFmt(receipt.theDate)"></mt-cell>
    <my-block></my-block>
    <my-cell title="备注信息"
             :value="receipt.simDesc"></my-cell>
    <my-block bottom
              left>凭证信息</my-block>
    <mt-cell
             style="padding: 3px 10px;word-wrap: break-word;"
             v-html="receipt.vouchers">
    </mt-cell>
    <my-block></my-block>
    <mt-cell title="录入人"
             :value="receipt.admName"></mt-cell>
    <mt-cell title="录入时间"
             :value="DateFmt(receipt.addTime, 'yyyy-MM-dd hh:mm:ss')"></mt-cell>
    <my-block></my-block>
    <my-button-block v-show="PermitCheck('receipt/submit-add-rec')&&receipt.isOK<='0'">
      <mt-button type="primary"
                 size="large"
                 @click.native="saveAndSubmit">保存并提交财务</mt-button>
    </my-button-block>
  </div>
</template>

<script>
import { Toast, Indicator, MessageBox } from "mint-ui"

export default {
  data() {
    return {
    }
  },
  created() {
  },
  computed: {
    receipt() {
      let select = this.$store.getters["order/receipt/receipt_select"];
      return select;
    }
  },
  methods: {
    saveAndSubmit() {
      Indicator.open({
        text: '正在操作...',
        spinnerType: 'fading-circle'
      });
      this.receipt.isOK = 51;
      this.$store.dispatch("order/receipt/receipt_save", this.receipt).then(state => {
        Indicator.close();
        if (state && state.success) {
          Toast("操作成功");
          this.$router.go(-1);
        } else {
          Toast(state.msg || "操作失败");
        }
      }).catch(err => {
        console.log(err);
        Indicator.close();
        Toast("网络错误");
      })
    }
  },
  components: {

  }
}
</script>

<style>
.box-water-bill {
  height: 200px;
  overflow: hidden;
  border: 1px solid #d9d9d9;
  background-size: 100% 100%;
}
</style>
