<template>
  <!-- 银行账户 -->
  <div>
    <mt-header title="付款信息" fixed>
      <mt-button icon="back" @click.native="$router.go(-1)" slot="left">返回</mt-button>
    </mt-header>
    <div class="blank" style="height:40px"></div>
    <mt-cell title="款项类型" class="my-first-cell" :value="bill.tags"></mt-cell>
    <mt-cell title="请款金额" class="my-first-cell" :value="bill.amount"></mt-cell>
    <my-cell class="newline" title="收款方" :value="bill.cpyName"></my-cell>
    <my-cell class="newline" title="收款银行" :value="bill.pay_accInfo"></my-cell>
    <my-block></my-block>
    <mt-cell title="实付金额" :value="bill.okTheAmount"></mt-cell>
    <my-cell class="newline" title="摘要说明" :value="bill.title"></my-cell>
    <mt-cell title="付款日期" :value="DateFmt(bill.theDate,'yyyy-MM-dd hh:mm:ss')"></mt-cell>
    <my-cell class="newline" title="付款方式" :value="bill.payType"></my-cell>
    <my-cell class="newline" title="付款银行" :value="bill.accName"></my-cell>
    <my-block></my-block>
    <mt-cell title="凭证信息" @click.native="popupStatus=!popupStatus" is-link></mt-cell>
    <my-block></my-block>
    <my-cell class="newline" title="备注说明" :value="simDesc"></my-cell>
    <my-button-block v-if="bill.isCan>=0 && bill.isCan < 51" fixed style="padding: 0;z-index: 10">
      <mt-button class="half-button" type="primary" @click.native="fnAudit(1)" size="large">审核</mt-button>
      <mt-button class="half-button" type="primary" @click.native="popupStatus=!popupStatus" size="large">拒绝</mt-button>
    </my-button-block>
    <mt-header title="凭证信息" fixed v-if="popupStatus" style="z-index:2101">
      <a slot="left">
        <mt-button icon="back" @click="popupStatus=!popupStatus">返回</mt-button>
      </a>
    </mt-header>
    <mt-popup v-model="popupStatus" popup-transition="popup-fade" position="right" class="my-popup-right">
      <div style="height:40px"></div>
      <!--更多信息-->
      <my-block></my-block>
      <div v-if="!bill.vouchers" style="padding:0 10px;text-align: center">无数据</div>
      <div v-else style="padding:0 10px;">
        <div v-html="bill.vouchers"></div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {
    Toast
  } from 'mint-ui';
  export default {
    data() {
      return {
        bill: {},
        popupStatus: false,

      }
    },
    created() {
      this.fnInit();
    },
    computed: {
      finID() {
        return this.$route.query.finID;
      }
    },
    methods: {
      fnInit() {
        let data = {};
        data.finID = this.finID;
        Vue.http.post(
          "request-money/get-pay-info",
          data, {
            emulateJSON: true
          }
        ).then(res => {
          if (!res.body) return;
          if (res.body.success === false) {
            Toast(res.body.msg);
            return;
          }
          this.bill = res.body.rows[0];

        })
      },
    },
    components: {

    },
    beforeRouteLeave(to, from, next) {
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
      next();
    }
  }
</script>

<style>
  .half-button {
    width: 50%;
    float: left;
    border-radius: 0;
  }

  .half-button:nth-of-type(2) {
    background: hsla(36, 100%, 50%, 0.776470588235294)
  }

  .yd-accordion-title {
    line-height: 40px;
    font-size: 14px;
  }
</style>