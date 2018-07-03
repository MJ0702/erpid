<template>
  <!-- 添加账单 -->
  <div>
    <mt-header title="添加账单" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="blank" style="height:40px"></div>
    <!--
    -->
    <mt-cell title="账单摘要" is-link class="input-right" to="bills-type">
            <mt-field @click.native.stop.prevent
                placeholder="请输入或选择账单摘要信息"
                v-model="bills_type.title"
                class="input-right field-in-cell"></mt-field>
      <!--<input placeholder="请输入或选择账单摘要信息" class="mint-field-core" v-model="bills_type.title" @click.stop.prevent>-->
    </mt-cell>
    <mt-field label="单价" type="number" @keydown.native="inpCheck" placeholder="请输入单价" v-model="bills_add_select.thePrice" class="input-right col-f00"></mt-field>
    <mt-field label="数量" type="number" @keydown.native="inpChecknum" @keyup.native="fnkeyup" placeholder="请输入数量" v-model="bills_add_select.theNum"
      class="input-right col-f00"></mt-field>
    <mt-cell title="币种" class="input-right" is-link to="bills-cur">
      <span>{{bills_cur.code}}</span>
    </mt-cell>
    <mt-cell title="汇率" class="input-right">
      <span>{{bills_cur.rate}}</span>
    </mt-cell>
    <mt-cell title="原币金额" class="input-right">
      <span>{{bills_theAmount | cny}}</span>
    </mt-cell>
    <mt-cell title="本币金额" class="input-right">
      <span>{{bills_amount | cny}}</span>
    </mt-cell>
    <my-bottom-box>
      <mt-button type="primary" @click.native="fnBillAdd" size="large">确认</mt-button>
    </my-bottom-box>

  </div>
</template>

<script>
  import { Toast } from 'mint-ui';

  export default {
    data() {
      return {
        bills_data: {
          theTitle: '',
          thePrice: '',
          theNum: '',
          theCur: '',
          theRate: '',
          theAmount: '',
          amount: '',
          ordID: '',
          ID: '',
        },
        data_select: {}
      }
    },
    created() {
      let refresh = this.$route.params.refresh;
      if (refresh) {
        this.billsRefresh();
      }
    },
    computed: {
      bills_add_select() {
        return this.$store.getters["order/bills/bills_add_select"];
      },
      bills_type() {
        return this.$store.getters["order/bills/bills_type"];  //所选账单摘要
      },
      bills_cur() {
        return this.$store.getters["order/bills/bills_cur"];   //所选币种
      },
      bills_theAmount() {
        let bills_add_select = this.bills_add_select;
        return bills_add_select.thePrice * bills_add_select.theNum || 0;  //原币金额
      },
      bills_amount() {
        let bills_add_select = this.bills_add_select;
        let rate = this.$store.getters["order/bills/bills_cur"].rate;
        return bills_add_select.thePrice * bills_add_select.theNum * rate || 0;  //本币金额
      }
    },
    methods: {
      billsRefresh() {
        let bills_type = {
          title: '',
          ID: '',
        };
        let bills_add_select = {
          thePrice: '',
          theNum: '',
        };
        this.$store.dispatch("order/bills/bills_type", bills_type);
        this.$store.dispatch("order/bills/bills_add_select", bills_add_select);
        this.$store.dispatch("order/bills/bills_types_request");       //请求账单摘要列表
        //this.$store.dispatch("order/bills/bills_type_select",bills_select.theTitle);
        this.$store.dispatch("order/bills/bills_curs_request").then(bills_curs => {
          let find_code = bills_curs.find(function (val) {
            return val.code == 'CNY';
          });
          this.$store.dispatch("order/bills/bills_cur_select", find_code);
        }); //币种列表
      },
      fnBillAdd() {
        let bills_data = this.bills_data,
          bills_add_select = this.bills_add_select,
          ordID = this.$route.query.ordID,
          bills_select = {
            ordID: ordID,
            theNum: bills_add_select.theNum,
            theTitle: this.bills_type.title,
            thePrice: bills_add_select.thePrice,
            theAmount: this.bills_theAmount,
            theCur: this.bills_cur.code,
            theRate: this.bills_cur.rate,
            amount: this.bills_amount,
          };
        if (!bills_select.thePrice) {
          Toast('请输入单价');
          return;
        }
        if(bills_select.thePrice.length>16){
          Toast('输入单价不能超过16位');
          return;
        }
        if (!bills_select.theNum) {
          Toast('请输入数量');
          return;
        }
        this.$store.dispatch("order/bills/order_bill_add",
          { bills_select: bills_select }).then(state => {
            if (state.success) {
              Toast('添加成功');
              this.$router.go(-1);

            } else {
              Toast(state.msg);
            }
          });
      },
      inpCheck(val) {
        if (val.target._value.length > 9) {
          Toast("长度不允许超过10位");
          this.bills_add_select.thePrice = val.target._value.slice(0, 9);
          return;
        }
      },
      inpChecknum(val) {
        if (val.target._value.length > 9) {
          Toast("长度不允许超过10位");
          this.bills_add_select.theNum = val.target._value.slice(0, 9);
          return;
        }
      },
      fnkeyup(val) {
        // if(val.target._value<0){
        //     this.bills_add_select.theNum=Math.abs(this.bills_add_select.theNum);
        // }
        if (/[^0-9.]|^[.]/g.test(val.target._value)) {
          this.bills_add_select.theNum = val.target._value.replace(/[^0-9.]|^[.]/g, '');
        }
      },
    },
    components: {

    }
  }

</script>

<style>
  .input-right .mint-cell-value input {
    text-align: right;
  }
  
  .col-f00 .mint-cell-text {
    color: #f00;
  }
</style>