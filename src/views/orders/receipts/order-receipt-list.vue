<template>
  <div class="order-receipt-list-block">
    <mt-header title="收款" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
      <mt-button v-show="PermitCheck('receipt/add')" slot="right" @click.native="toReceiptTreat(null, 'add')">添加</mt-button>
    </mt-header>
    <div style="height:40px"></div>

    <my-block bottom left>基础信息</my-block>
    <mt-cell title="订单号">
      <span>{{order.ordID}}</span>
    </mt-cell>
    <my-cell title="公司名称" :value="order.userCpyName"></my-cell>
    <my-block bottom left>收款信息</my-block>

    <div
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="loading"
    infinite-scroll-distance="10" class="page-infinite-list"
    >

    <div class="item" v-for="item,i in items" @click="toReceiptDetail(item)">
      <my-block v-if="i>0"></my-block>
      <div class="content">
        <div class="title">
          <div>{{item.title}}</div>
          <div>
            <span style="color: #FF9900" v-if="item.isOK==0">未提交</span>
            <span style="color: #0099ff" v-else-if="item.isOK==61">已确认</span>
            <span style="color: #00CC00" v-else-if="item.isOK==51">等待确认</span>
            <span style="color: red" v-else-if="item.isOK==39">已拒绝</span>
            <span v-else></span>
          </div>
        </div>
        <div class="body">
          <div class="row1">
            <div>
              财务编号 {{item.ID}}
            </div>
            <div>
              {{item.amount}} ({{item.theCur}})
            </div>
          </div>
          <!-- <div class="row2">
            <div>
              订单 {{item.ordID}}
            </div>
            <div>
              {{item.cpyName}}
            </div>
            <div>
              {{DateFmt(item.theDate)}}到账
            </div>
          </div> -->
        </div>
        <div class="footer">
          <div class="footer-left">
            {{DateFmt(item.theDate)}}到账
          </div>
          <div class="footer-handle">
            <!-- <mt-button type="default" class="balance" size="small">查看平账</mt-button> -->
            <mt-button @click.native.stop="toReceiptTreat(item, 'modify')"
              type="default" v-show="PermitCheck('receipt/edit')"
              :class="item.isOK==51||item.isOK==61?'handle-disabled':'edit'"
              :disabled="item.isOK==51||item.isOK==61" size="small">修改</mt-button>
            <mt-button @click.native.stop="receiptSubmit(item)"
              type="default" v-show="PermitCheck('receipt/submit-add-rec')"
              :class="item.isOK==51||item.isOK==61?'handle-disabled':'submit'"
              :disabled="item.isOK==51||item.isOK==61" size="small">提交</mt-button>
          </div>
        </div>
      </div>
    </div>

    </div>
    <p :class="'page-infinite-loading'+(loadEnd?'-no':'')">
      <mt-spinner type="fading-circle"></mt-spinner>
      加载中...
    </p>
    <div :class="'loadmore-end'+((showEnd&&loadEnd)?'':'-no')">我是有底线的</div>

    <div class="final" v-if="items.length&&loadEnd">
      <label >总额 </label><span>{{NumFmt(items.reduce((sumSoFar, item)=>{
        return sumSoFar+item.amount;
      },0), 2)}}</span>
    </div>
    <my-bottom-box v-if="PermitCheck('receipt/add')">
      <mt-button type="primary" size="large" @click.native="toReceiptTreat(null, 'add')">添加收款</mt-button>
    </my-bottom-box>

    <!-- <mt-popup
      v-model="popupVisible" position="top"
      popup-transition="popup-fade" modal="false" class="mint-popup-1">
        <a class="my-pop-a" @click="toReceiptTreat(null, 'add')">添加收款</a>
    </mt-popup> -->

  </div>
</template>

<script>
import {Toast, Indicator} from "mint-ui"

export default {
  data () {
    return {
      popupVisible:false,
      showEnd: false,
      loadEnd: true,
    }
  },
  created() {
    let order_id = this.$store.getters["order/order_id"];
    if(!order_id) {
      let orderid = this.$route.query.id;
      if(orderid) {
        this.$store.dispatch("order/order_select", {id: orderid});
        this.$store.dispatch("order/order_request");
      } else {
        Toast("未选择有效订单");
        return;
      }
    }
    //清空列表数据
    this.$store.dispatch("order/receipt/receipts_clear");

    this.loadEnd = !this.loadEnd;
    this.$store.dispatch("order/receipt/receipts_request").then(end => {
      this.loadEnd = !this.loadEnd;
    });
  },
  computed: {
    items() {
      return this.$store.getters["order/receipt/receipts"]
    },
    order() {
      return this.$store.getters["order/order_select"]
    },
  },
  methods:{
    toReceiptDetail (item){
      this.$store.dispatch("order/receipt/receipt_select", item);
      this.$router.push({name:'order-receipt-info'});
    },
    toReceiptTreat(item, mode) {
      this.$store.dispatch("order/receipt/receipt_select", item);
      let id=this.order.ordID;
      if(item){
        window.localStorage.setItem('receiptSelect',JSON.stringify(item));
        this.$router.push({name:'order-receipt-treat',query:{id:id,mode:mode,receiptId:item.id}, params:{mode}});
      }else{
        this.$router.push({name:'order-receipt-treat',query:{id:id,mode:mode}, params:{mode}});
      }
    },
    receiptSubmit(item) {
      let data = {
        ID	: item.ID, //	财务编号	102974
        cpyName	: item.cpyName, //	公司名称	313599/陪我到山里看海/陪我到山里看海/
        title	: item.title, //	摘要说明	全款
        payDesc	: item.payDesc, //	付款人	陪我到山里看海
        theAmount	: item.theAmount, //	原币金额	1024
        theRate	: item.theRate, //	汇率	6.4655
        amount	: item.amount, //	款项金额	6620.67
        theDate	: item.theDate, //	到账日期	2017-04-07 00:00:00.000
        payType	: item.payType, //	收款方式	银行转账
        accID	: item.accID, //	收款账户	583
        ordID	: item.ordID, //	订单号	108907
        planID	: item.planID, //	团期id	1005871
        simDesc	: item.simDesc, //	备注信息	2
        cpyID	: item.cpyID, //	公司id	313599
        vouchers	: item.vouchers, //	凭证信息	1<p></p>
        theCur	: item.theCur, //	币种	USD
        isOK	: 51, //	状态 保存isOK=0，提交财务确认isOK=51；财务下面录入，保存isOK=51，确认到账isOK=61
      }
      Indicator.open({
        text: '正在操作...',
        spinnerType: 'fading-circle'
      });
      this.$store.dispatch("order/receipt/receipt_save", data).then(state => {
        Indicator.close();
        if(state&&state.success) {
          Toast("操作成功");

          this.$store.dispatch("order/receipt/receipts_clear");
          this.loadEnd = !this.loadEnd;
          this.$store.dispatch("order/receipt/receipts_request").then(end => {
            this.loadEnd = !this.loadEnd;
          });
        } else {
          Toast(state.msg||"操作失败");
        }
      }).catch(err => {
        console.log(err);
        Indicator.close();
        Toast("网络错误");
      })
    },
    loadMore() {
      // if(this.loadEnd&&!this.showEnd) {
      //   this.loadEnd = !this.loadEnd;
      //   this.$store.dispatch("order/receipt/receipts_request").then(end => {
      //     this.showEnd = end
      //     this.loadEnd = !this.loadEnd;
      //   });
      // }
    },
  },
  components: {

  }
}
</script>

<style scoped>
.order-receipt-list-block {
  height: 100%;
}
.content {
  background-color: #fff;
  padding: 5px 10px 10px 10px;
}
.content .title {
  border-bottom: solid 0.8px #eee;
  display: flex;
  flex-direction: row;
  height: 32px;
  font-size: 0.9em;
}
.content .title div:nth-child(1) {
  display: flex;
  flex: 4;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.content .title div:nth-child(2) {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
}
.content .body {
  border-bottom: solid 0.8px #eee;
  display: flex;
  flex-direction: column;
  font-size: 0.86em;
  color: #888;
}
.content .body .row1 {
  display: flex;
  flex-direction: row;
  /*height: 28px;*/
  height: 48px;
}
.content .body .row1 div:nth-child(1) {
  display: flex;
  flex: 2;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.content .body .row1 div:nth-child(2) {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
}

.content .body .row2 {
  display: flex;
  flex-direction: row;
  height: 28px;
}

.content .body .row2 div {
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
}
.content .body .row2 div:nth-child(1) {
  justify-content: flex-start;
}
.content .body .row2 div:nth-child(2) {
  justify-content: center;
}
.content .body .row2 div:nth-child(3) {
  justify-content: flex-end;
}
.footer {
  display: flex;
  align-items: center;
}
.footer-left {
  flex: 1;
  padding-top: 10px;
  text-align: left;
}
.footer-handle {
  flex: 1;
  padding-top: 10px;
  text-align: right;
}
.footer-handle .mint-button {
  height: 28px;
  margin-left: 8px;
}
.footer-handle .handle-disabled {
  color: #888;
}
/*.handle .balance {

}*/
.footer-handle .edit {

}
.footer-handle .submit {
  color: #00CC00;
}
.final {
  padding: 10px;
  text-align: right;
  font-size: 1em;
}
.final span {
  color: #FF6600;
}

.mintui-more{
  font-size:24px
}
.mint-popup-1 {
    width: 90px;
    padding: 10px;
    -webkit-transform: translate(-50%);
    transform: translate(-50%);
    top:50px;
    background: rgba(0, 153, 255, 1);
    right:-50px;
    left:auto;
    text-align:center;
}
.mint-popup-1:before {
    display: inline-block;
    width: 0;
    height: 0;
    border: solid transparent;
    border-width: 10px;
    border-bottom-color: rgba(0, 153, 255, 1);
    content: '';
    position: absolute;
    top: -20px;
    right: 15px;
}
.mint-popup a.my-pop-a{
    display:block;
    color:#fff;
    text-align:center;
    line-height:28px;
}
.mint-popup a.my-pop-a:first-child{
    margin-top:0;
}
.mint-popup a.my-pop-a.underline{
    margin-top:0;
    display:inline-block;
    border-bottom:1px solid #fff;
}
</style>
