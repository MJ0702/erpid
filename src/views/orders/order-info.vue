<template>
  <div class="order-info-block">
    <mt-header title="订单详情" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
      <!--<mt-button icon="more" slot="right" @click.native="moreTypeClick"></mt-button>-->
    </mt-header>
    <div style="height:40px"></div>

    <my-block bottom left>订单信息</my-block>
    <mt-cell title="订单号">
      <span v-if="order.ID||order.ordID">{{order.ID||order.ordID}}</span> (
      <span style="color: #0386CA" v-if="order.isOK==1&&order.suretyID<=0">已确认</span>
      <span style="color: #0386CA" v-else-if="order.isOK==1&&order.suretyID>0">已担保</span>
      <span style="color: green" v-else-if="order.isOK==0">预留中</span>
      <span style="color: gray" v-else-if="order.isOK==-4">已清位</span>
      <span style="color: gray" v-else-if="order.isOK==-2">已撤销</span>
      <span style="color: black" v-else-if="order.isOK==-3">已取消</span> )
    </mt-cell>
    <mt-cell-swipe title="线路名称" :right="[
          {
            content: '浏览行程',
            style: {
              background: '#00CC00', color: '#fff' ,
              width: '80px', display: 'flex', 'align-items': 'center',
              'justify-content': 'center'
            },
            handler: () => {
              lineTitleClick(order.uniqLineUrl);
            }
          }
        ]" @click.native="lineTitleClick(order.uniqLineUrl)" is-link class="my-cell-swipe" v-if="order.lineID">
      <p>{{order.lineTitle}}</p>
    </mt-cell-swipe>
    <mt-cell-swipe title="线路名称" class="my-cell-swipe" v-else>
      <p>{{order.lineTitle}}</p>
    </mt-cell-swipe>
    <mt-cell title="产品团号" :value="order.planCode" v-if="PermitCheck('line-plan')" is-link @click.native="$router.push({name:'plan-info', query:{id: order.planID}})"></mt-cell>
    <mt-cell title="产品团号" :value="order.planCode" v-else></mt-cell>
    <mt-cell title="出团日期" :value="DateFmt(order.planDate, 'yyyy-MM-dd')"></mt-cell>
    <mt-cell title="出发城市" :value="order.pub_fromcity_name || order.fromCityName" v-if="PermitCheck('order/from-edit-city')&&canEdit"
      is-link @click.native="toEdit('fromCity')"></mt-cell>
    <mt-cell title="出发城市" :value="order.fromCityName" v-else></mt-cell>
    <mt-cell title="订单类型" :value="order.ordType" v-if="PermitCheck('order/order-edit-type')&&canEdit" is-link @click.native="toEdit('ordType')"></mt-cell>
    <mt-cell title="订单类型" :value="order.ordType" v-else></mt-cell>
    <mt-cell title="占位情况" :value="['占位','不占位'][order.isTicket]" v-if="PermitCheck('order/order-edit-placeholder')&&canEdit" is-link
      @click.native="toEdit('isTicket')"></mt-cell>
    <mt-cell title="占位情况" :value="['占位','不占位'][order.isTicket]" v-else></mt-cell>
    <mt-cell title="到期时间" :value="DateFmt(order.endTime, 'yyyy-MM-dd hh:mm')" v-if="order.isOK=='0'"></mt-cell>
    <mt-cell title="操作状态">
      <span v-if="order.OPisOK" style="color:#0386CA">已处理</span>
      <span v-else style="color:#FF6600">未处理</span>
    </mt-cell>
    <!-- <div class="blank-more">更多功能</div> -->
    <!--
    -->
    <!-- <my-grid>
        <my-grid-item per v-show="PermitCheck('order/order-bill-list')"  :to="toModule('bills')" class="router-link">
          <img src="~assets/bills.png"  slot="icon">
          账单
        </my-grid-item>
        <my-grid-item per v-show="PermitCheck('me-receipt')" @click="
          $store.dispatch('money/receipt/receipt_order_select', order);
          $router.push({name: 'money-receipt-qrcode', query:{type:'order-refresh'}});"
           class="router-link">
          <img src="~assets/order-receipt.png" slot="icon">
          扫码付
        </my-grid-item>
        <my-grid-item per v-show="PermitCheck('order/order-name-list')" :to="toModule('order-tours')"  class="router-link">
          <img src="~assets/tour.png"  slot="icon">
          名单
        </my-grid-item>
        <my-grid-item per :to="toModule('order-more')"  class="router-link" icon="more">
          更多
        </my-grid-item>
    </my-grid> -->
    <my-block bottom left>订单人数</my-block>
    <mt-cell title="总人数" :value="order.perNum" v-if="PermitCheck('order/order-edit-number')&&canEdit" is-link @click.native="toEdit('num')"></mt-cell>
    <mt-cell title="总人数" :value="order.perNum" v-else></mt-cell>
    <mt-cell title="成人" :value="order.aduNum"></mt-cell>
    <mt-cell title="小童占床" :value="order.chdNum"></mt-cell>
    <mt-cell title="小年轻" :value="order.aduNum1"></mt-cell>
    <mt-cell title="老人" :value="order.aduNum2"></mt-cell>
    <mt-cell title="小童不占床" :value="order.chdNum1"></mt-cell>
    <my-block bottom left>订单金额</my-block>
    <mt-cell title="账单总额" :value="NumFmt(order.amount, 2)" v-if="PermitCheck('order/order-bill-list')" is-link @click.native="tobills('bills')"></mt-cell>
    <mt-cell title="账单总额" :value="NumFmt(order.amount, 2)" v-else></mt-cell>
    <mt-cell title="已收款" :value="NumFmt(order.pingAmount, 2)" v-if="order.pingAmount>0" is-link @click.native="$router.push({name: 'order-receipt-ping', query:{id: order.ordID}})"></mt-cell>
    <mt-cell title="已收款" :value="NumFmt(order.pingAmount, 2)" v-else></mt-cell>
    <mt-cell title="未收款" :value="NumFmt(order.amount-order.pingAmount, 2)"></mt-cell>
    <mt-cell title="现收" :value="NumFmt(order.ordRecNow, 2)"></mt-cell>
    <mt-cell title="返利" :value="NumFmt(order.ordRecPay, 2)"></mt-cell>
    <mt-cell title="应退款总额" :value="NumFmt(order.refundAmount, 2)"></mt-cell>
    <mt-cell title="提成" :value="order.saleSalary"></mt-cell>
    <mt-cell title="积分" :value="order.saleScore"></mt-cell>
    <my-block bottom left>客户信息</my-block>
    <my-cell class="newline" title="公司名称" :value="order.userCpyName" v-if="PermitCheck('order/order-edit-cust-cpy')&&canEdit" is-link @click.native="toEdit('customer')"></my-cell>
    <my-cell class="newline" title="公司名称" :value="order.userCpyName" v-else></my-cell>
    <mt-cell class="newline" title="联系人" :value="order.ctName"></mt-cell>
    <mt-cell title="联系人手机" :value="order.ctInfo"></mt-cell>
    <my-block bottom left>备注信息</my-block>
    <my-cell title="订单备注" :value="order.ordBak" v-if="PermitCheck('order/order-edit-order')&&canEdit" is-link @click.native="toEdit('ordBak')"></my-cell>
    <my-cell title="订单备注" :value="order.ordBak" v-else></my-cell>
    <my-cell title="自我备注" :value="order.iOrdBak" v-if="PermitCheck('order/order-edit-iorder')&&canEdit" is-link @click.native="toEdit('iOrdBak')"></my-cell>
    <my-cell title="自我备注" :value="order.iOrdBak" v-else></my-cell>
    <my-block bottom left>人员信息</my-block>
    <mt-cell title="销售人员" :value="order.saleName" v-if="PermitCheck('order/order-edit-sale')&&canEdit" is-link @click.native="toEdit('sale')"></mt-cell>
    <mt-cell title="销售人员" :value="order.saleName" v-else></mt-cell>
    <mt-cell title="助理人员" :value="order.assistName" v-if="PermitCheck('order/order-edit-zhuli')&&canEdit" is-link @click.native="toEdit('assist')"></mt-cell>
    <mt-cell title="助理人员" :value="order.assistName" v-else></mt-cell>
    <mt-cell title="创建人员" v-show="order.admName" :value="order.admName"></mt-cell>
    <mt-cell title="下单时间" :value="DateFmt(order.addTime, 'yyyy-MM-dd hh:mm')"></mt-cell>
    <div style="height:10px"></div>

    <!-- 预留中可以执行下面三个操作 -->
    <!-- <my-button-block v-if="PermitCheck('order/order-affirm')&&order.isOK=='0'">
      <mt-button type="primary" size="large" @click.native="orderSwitch('order-affirm')">转为确认单</mt-button>
    </my-button-block>
    <my-button-block v-if="PermitCheck('order/order-cancel')&&order.isOK=='0'">
      <mt-button type="default" size="large" @click.native="orderSwitch('order-cancel')">取消预留单</mt-button>
    </my-button-block>
    <my-button-block v-if="PermitCheck('order/order-guarantee-submit')&&order.isOK=='0'">
      <mt-button type="default" size="large" @click.native="orderSwitch('order-guarantee-submit')">担保确认</mt-button>
    </my-button-block> -->

    <!-- 已确认可以执行下面两个操作 -->
    <!-- <my-button-block v-if="PermitCheck('order/order-confirm-reserved')&&order.isOK=='1'">
      <mt-button type="primary" size="large" @click.native="orderSwitch('order-confirm-reserved')">转为预留单</mt-button>
    </my-button-block>
    <my-button-block v-if="PermitCheck('order/order-confirm-submit')&&order.isOK=='1'">
      <mt-button type="default" size="large" @click.native="orderSwitch('order-confirm-submit')">取消确认单</mt-button>
    </my-button-block>


    <my-button-block v-if="PermitCheck('order/order-activate')&&order.isOK!='1'&&(order.isOK=='-4'||order.isOK=='-2'||order.isOK=='-3')">
      <mt-button type="default" size="large" @click.native="orderSwitch('order-activate')">重新激活订单</mt-button>
    </my-button-block> -->
    <!--<mt-popup
    v-model="popupVisible" position="top"
    popup-transition="popup-fade" modal="false" class="mint-popup-1">
      <a class="underline my-pop-a"

      @click="
        $store.dispatch('money/receipt/receipt_order_select', order);
        $router.push({name: 'money-receipt-qrcode', query:{type:'order-refresh'}});
      ">扫码付</a>
      <a class="my-pop-a" @click="$router.push({name:'order-more', query:{id:order_id}})">更多</a>
    </mt-popup>-->
    <mt-popup v-model="operPopupVisible" position="bottom" popup-transition="popup-fade" :modal="false" class="popup-oper">
      <!-- 预留中可以执行下面三个操作 -->
      <a class="my-pop-a" v-if="localPermitCheck('order/order-affirm', order.isOK=='0')" @click="orderSwitch('order-affirm', '')">转为确认单</a>
      <a class="my-pop-a" v-if="localPermitCheck('order/order-cancel', order.isOK=='0')" @click="orderSwitch('order-cancel', '')">取消预留单</a>
      <a class="my-pop-a" v-if="localPermitCheck('order/order-guarantee-submit', order.isOK=='0')" @click="orderSwitch('order-guarantee-submit', '操作成功')">担保确认</a>
      <!-- 已确认可以执行下面两个操作 -->
      <a class="my-pop-a" v-if="localPermitCheck('order/order-confirm-reserved', order.isOK=='1')" @click="orderSwitch('order-confirm-reserved', '已提交申请')">转为预留单</a>
      <a class="my-pop-a" v-if="localPermitCheck('order/order-confirm-submit', order.isOK=='1')" @click="orderSwitch('order-confirm-submit', '已提交申请')">取消确认单</a>
      <a class="my-pop-a" v-if="localPermitCheck('order/order-activate', order.isOK!='1'&&(order.isOK=='-4'||order.isOK=='-2'||order.isOK=='-3'))"
        @click="orderSwitch('order-activate', '')">重新激活订单</a>
    </mt-popup>
    <mt-popup v-model="morePopupVisible" position="bottom" popup-transition="popup-fade" class="popup-more">
      <div>
        <my-order-more></my-order-more>
      </div>
    </mt-popup>

    <my-pad></my-pad>
    <mt-tabbar v-model="selectedCur" class="order-bottom-tab">
      <mt-tab-item id="bills" v-show="PermitCheck('order/order-bill-list')" @click.native="toModule('bills')">
        账单
      </mt-tab-item>
      <!--<mt-tab-item id="tours" v-show="PermitCheck('order/order-name-list')" @click.native="toModule('order-tours')">
        名单
      </mt-tab-item>-->
      <mt-tab-item id="receipt" v-show="PermitCheck('me-receipt')&&order.isOK>=0" @click.native="
        $store.dispatch('money/receipt/receipt_order_select', order);
        $router.push({name: 'money-receipt-qrcode', query:{type:'order-refresh'}});
      ">
        扫码付
      </mt-tab-item>
      <mt-tab-item id="more" @click.native="moreTypeClick" class="more-button">
      </mt-tab-item>
      <mt-tab-item id="oper" class="order-oper" @click.native="operClick">
        订单操作
      </mt-tab-item>
    </mt-tabbar>

  </div>
</template>

<script>
  import { MessageBox, Toast, Indicator } from 'mint-ui';
  import OrderMore from "./order-more.vue";

  export default {
    data() {
      return {
        operPopupVisible: false,
        morePopupVisible: false,
        canEdit: false,
        selectedCur: "home",
        operNone: true,
      }
    },
    computed: {
      order() {
        //判断是否能对订单进行修改
        let o = this.$store.getters["order/order_select"];
        if (o && (o.isOK == 1 || o.isOK == 0) && o.OPisOK == 0) { //确认，预留，未处理状态才可进行订单修改
          this.canEdit = true;
        }
        return o;
      },
      order_id() {
        return this.$store.getters["order/order_id"];
      },
      user() {
        let mine=this.$store.getters["mine/mine"];
        return mine;
      }
    },
    created() {
      //如果query存在订单id，则显示指定订单
      let orderid = this.$route.query.id;
      if (orderid) {
        this.$store.dispatch("order/order_select", { id: orderid });
        this.$store.dispatch("order/order_request");
      } else {
        Toast("未选择有效订单");
      }
    },
    methods: {
      moreTypeClick() {
        if (this.operPopupVisible) {
          this.operClick();
        }
        if (this.morePopupVisible) {
          this.$root.$el.style.overflowX = 'hidden';
        } else {
          this.$root.$el.style.overflowX = 'auto';
        }
        this.morePopupVisible = !this.morePopupVisible;
      },
      operClick() {
        if (this.morePopupVisible) {
          this.moreTypeClick();
        }
        if (this.operNone) {
          return;
        }
        this.operPopupVisible = !this.operPopupVisible;
      },
      localPermitCheck(key, other) {
        other = other === false ? false : true;
        let check = this.PermitCheck(key);
        if (check && other) {
          this.operNone = false;
        }
        return check && other;
      },
      orderSwitch(type, msg) {
        this.operPopupVisible = false;
        this.operNone = true;

        Indicator.open({
          text: '正在操作...',
          spinnerType: 'fading-circle'
        });
        this.$http.post(
          "order/" + type,
          {
            ordID: this.order.ID || this.order.ordID,
            planID: this.order.planID,
          },
          { emulateJSON: true }
        ).then(res => {
          if (!res.body) { return; }
          let result = res.body;
          Indicator.close();
          if (result.success) {
            this.$store.dispatch("order/order_request");
            Toast(msg || "操作成功");
          } else {
            MessageBox.alert(result.msg);
          }
        }).catch(err => {
          console.log(err);
          Indicator.close();
          Toast("网络错误");
        })
      },
      lineTitleClick(url) {
        if (url) {
          window.location.href = url;
        }
      },
      tobills(v) {
        this.$router.push({ name: v, query: { ordID: this.order.ordID, planID: this.order.planID, userCpyName: this.order.userCpyName } });
      },
      toEdit(t) {
        this.$router.push({ name: 'order-edit', params: { type: t, refresh: true } });
      },
      toModule(v) {
        this.$router.push({ name: v, query: { id: this.order_id } });
      },
    },
    components: {
      "my-order-more": OrderMore,
    }
  }

</script>

<style>
  .blank-more {
    color: #333;
    font-size: .8em;
    line-height: 32px;
    padding-left: 12px;
  }
  
  .order-info-block .my-button-block {
    text-align: center;
    padding-left: 40px;
    padding-right: 40px;
    padding-top: 0px;
  }
  
  .mintui-more {
    font-size: 24px
  }
  
  .mint-popup-1 {
    width: 90px;
    padding: 10px;
    -webkit-transform: translate(-50%);
    transform: translate(-50%);
    top: 50px;
    background: rgba(0, 153, 255, 1);
    right: -50px;
    left: auto;
    text-align: center;
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
  
  .mint-popup a.my-pop-a {
    display: block;
    color: #fff;
    text-align: center;
    margin-top: 6px;
    line-height: 28px;
  }
  
  .mint-popup a.underline {
    margin-top: 0;
    display: inline-block;
    border-bottom: 1px solid #fff;
  }
  
  .order-bottom-tab {
    position: fixed;
    align-items: center;
  }
  
  .order-bottom-tab .mint-tab-item {
    height: 41px;
    border-right: 1px solid #eaeaea;
  }
  
  .order-bottom-tab .mint-tab-item .mint-tab-item-label {
    color: inherit;
    font-size: 16px;
    line-height: 41px;
  }
  
  .order-bottom-tab .mint-tab-item:last-child {
    border-right: 0px;
    flex: inherit;
  }
  
  .order-bottom-tab .mint-tab-item:last-child .mint-tab-item-label {
    width: 102px;
  }
  
  .order-bottom-tab .mint-tab-item.more-button .mint-tab-item-label:before {
    color: inherit;
    content: '\25CF \25CF \25CF';
    font-size: 8px;
  }
  
  .popup-more {
    width: 100%;
    height: 60%;
    -webkit-transform: translate(-50%);
    transform: translate(-50%);
    top: auto;
    bottom: 55px;
    overflow: scroll;
    border: 2px solid #eaeaea;
    background-color: #eaeaea;
  }
  
  .popup-more>div {
    background-color: #fff;
    margin: 0px 2px 0px 0px;
    height: 100%;
  }
  
  .popup-more::-webkit-scrollbar {
    height: 0px;
    width: 0px;
  }
  
  .popup-more::scrollbar {
    height: 0px;
    width: 0px;
  }
  
  .popup-oper {
    width: 100px;
    padding: 4px;
    -webkit-transform: translate(-50%);
    transform: translate(-50%);
    top: auto;
    bottom: 55px;
    background: rgba(0, 153, 255, 1);
    right: -60px;
    left: auto;
    text-align: center;
  }
  
  .mint-tab-item.order-oper {
    background-color: #26a2ff;
    color: #fff;
  }
  
  .mint-tab-item.order-oper.is-selected {
    background-color: #0D8AE8;
    color: #fff;
  }
  
  .order-info-block .v-modal {
    height: 90%;
  }
</style>