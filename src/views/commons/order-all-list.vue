<template>
<div>
  <mt-header title="全部订单" fixed>
    <router-link :to="routerTo[type]" slot="left">
      <mt-button icon="back">返回</mt-button>
    </router-link>
    <mt-button slot="right" @click="$router.push({path: '/order-search-all'})">筛选</mt-button>
  </mt-header>
  <div style="height:40px"></div>

  <div
  v-infinite-scroll="loadMore"
  infinite-scroll-disabled="loading"
  infinite-scroll-distance="10" class="page-infinite-list"
  >

    <div class="my-preview" v-for="order in orders" @click="orderClick(order)">
      <my-block></my-block>
      <div class="my-preview_row1">
        <div class="my-preview_row1_left">
          <img src="~assets/order-list-sale.png" class="order-list-icon">
          {{order.ctName}}
        </div>
        <div class="my-preview_row1_middle">订单：{{order.ID}}</div>
        <div class="my-preview_row1_right">
          <span style="color: #0386CA" v-if="order.isOK==1&&order.suretyID<=0">已确认</span>
          <span style="color: #0386CA" v-else-if="order.isOK==1&&order.suretyID>0">已担保</span>
          <span style="color: green" v-else-if="order.isOK==0">预留中</span>
          <span style="color: gray" v-else-if="order.isOK==-4">已清位</span>
          <span style="color: gray" v-else-if="order.isOK==-2">已撤销</span>
          <span style="color: black" v-else-if="order.isOK==-3">已取消</span>
          <span v-else></span>
        </div>
      </div>

      <mt-cell-swipe :right="(PermitCheck('me-receipt')&&order.isOK>=0)?[
          {
            content: cellSwipeContent,
            style: {
              background: '#3399FF', color: '#fff' ,
              width: '60px', display: 'flex', 'align-items': 'center',
              'flex-direction': 'column',
              'justify-content': 'center'
            },
            handler: () => {
              $store.dispatch('money/receipt/receipt_order_select', order);
              $router.push({name: 'money-receipt-qrcode', query:{type:'order-refresh'}});
            }
          }
        ]:''">
      <div class="my-preview_row2">
        <div class="my-preview_row2_top">
          <div>{{order.linetTitle}}</div>
          <div><span style="font-size: 1.17em">{{order.perNum}}</span>人</div>
        </div>
        <div class="my-preview_row2_middle">
          <div>
            <span>出团：{{DateFmt(order.planDate, 'yyyy-MM-dd')}}</span>
            <span v-if="order.pub_fromcity_name">({{order.pub_fromcity_name}})</span>
            <span v-if="order.ordTypeName">({{order.ordTypeName}})</span>

            <!-- <img src="~assets/order-list-plandate.png" class="order-list-icon"> -->
          </div>
          <!-- <div>
            <img src="~assets/order-list-fromcity.png" class="order-list-icon">
            {{order.fromCityName}}
          </div> -->
          <div>{{['占位','不占位'][order.isTicket]}}</div>
        </div>
        <div class="my-preview_row2_bottom" v-if="order.endTime&&order.isOK==0">到期：{{DateFmt(order.endTime, 'yyyy-MM-dd hh:mm')}}
          <!-- <img src="~assets/order-list-endtime.png" class="order-list-icon"> -->
        </div>
      </div>
      <div class="my-preview_row3">
        <div class="my-preview_row3_left">{{DateFmt(order.addTime, 'yyyy-MM-dd hh:mm')}}
          <!-- <img src="~assets/order-list-addtime.png" class="order-list-icon"> -->
        </div>
        <div class="my-preview_row3_right" style="color: #FF7F50">合计 {{NumFmt(order.amount)}} 元<span v-if="order.pingAmount">(已收{{NumFmt(order.pingAmount, 2)}}元)</span></div>
      </div>

      </mt-cell-swipe>

    </div>
  </div>
  <p :class="'page-infinite-loading'+(loadEnd?'-no':'')">
    <mt-spinner type="fading-circle"></mt-spinner>
    加载中...
  </p>
  <div :class="'loadmore-end'+((showEnd&&loadEnd)?'':'-no')">我是有底线的</div>
  <!-- <my-button-panel @click.native="toSearch">
    <img src="~assets/search.png" height="32px" width="32px" style="padding-top:12px;">
  </my-button-panel> -->
  <my-pad></my-pad>
  <my-navigate-tab selected=""></my-navigate-tab>
</div>
</template>

<script>
import { Toast } from "mint-ui";
import qrclodeListImage from '../../assets/qrcode-list.png';

export default {
  data() {
    return {
      showEnd: false,
      loadEnd: true,
      cellSwipeContent: '<img style="height:50px;width:50px;" src="assets/qrcode-list.png"><span style="line-height:20px;">我要收款</span>',
      ordersGetters: ["order/orders", "order/orders_search"],
      orderClearAction: ["order/orders_clear","order/orders_search_clear"],
      orderQueryAction: ["order/orders_request_all", "order/orders_search_all"],
      routerTo: ["/", "/order-search-all"]
    }
  },
  computed: {
    orders() {
      return this.$store.getters[this.ordersGetters[this.type]];
    },
  },
  created() {
    this.$store.dispatch(this.orderClearAction[this.type]);

    this.loadEnd = !this.loadEnd;
    if(this.$store.getters['sys/get_if_has_permit_data']) {
      // 有权限数据，直接请求订单数据
      this.$store.dispatch(this.orderQueryAction[this.type]).then(end => {
        this.loadEnd = !this.loadEnd;
      });
    } else {
      // 强制请求一次权限数据后，再请求订单数据
      this.$store.dispatch("sys/permit_request", true).then(permit => {
        this.$store.dispatch(this.orderQueryAction[this.type]).then(end => {
          this.loadEnd = !this.loadEnd;
        });
      })
    }

  },
  methods: {
    orderClick(order) {
      this.$router.push({ name: "order-info", query:{id: order.ID}});
    },
    loadMore() {
      if(this.loadEnd&&!this.showEnd) {
        this.loadEnd = !this.loadEnd;
        this.$store.dispatch(this.orderQueryAction[this.type]).then(end => {
          this.permit; //每次获取完数据后判断一次权限
          this.showEnd = end
          this.loadEnd = !this.loadEnd;
          if(end) {
            // Toast("没有找到相应的信息");
          }
        });
      }
    },
  },
  props: {
    type: {
      default: 0,
      type: Number,
    },
  }
}
</script>

<style>
.my-preview {
  display: flex;
  flex-direction: column;
  font-size: smaller;
}
.my-preview .my-preview_row1 {
  background-color: #FFFFFF;
  display: flex;
  flex-direction: row;
  padding: 10px 10px 5px 10px
}
.my-preview .my-preview_row1 .my-preview_row1_left {
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.my-preview .my-preview_row1 .my-preview_row1_middle {
  flex: 1;
  text-align: center;
}
.my-preview .my-preview_row1 .my-preview_row1_right {
  flex: 1;
  text-align: right;
}

.my-preview .mint-cell .mint-cell-wrapper {
  font-size: smaller;
}

.my-preview .mint-cell .mint-cell-title {
  flex: 0;
}
.my-preview .mint-cell .mint-cell-value {
  flex-direction: column;
  width: 100%;
}

.my-preview .my-preview_row2 {
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
  padding: 5px 10px 5px 10px;
  width: 100%;
}
.my-preview .my-preview_row2 .my-preview_row2_top {
  display: flex;
  flex-direction: row;
  padding-top: 4px;
  padding-bottom: 2px;
}
.my-preview .my-preview_row2 .my-preview_row2_top>div:nth-child(1) {
  flex: 3;
}
.my-preview .my-preview_row2 .my-preview_row2_top>div:nth-child(2) {
  flex: 1;
  text-align: right;
}

.my-preview .my-preview_row2 .my-preview_row2_middle {
  display: flex;
  flex-direction: row;
  color: #888;
  padding-top: 2px;
  padding-bottom: 4px;
}
.my-preview .my-preview_row2 .my-preview_row2_middle>div:nth-child(1) {
  /*flex: 1;*/
  flex: 3;
}
.my-preview .my-preview_row2 .my-preview_row2_middle>div:nth-child(2) {
  flex: 1;
  /*text-align: center;*/
  text-align: right;
}
.my-preview .my-preview_row2 .my-preview_row2_middle>div:nth-child(3) {
  flex: 1;
  text-align: right;
}

.my-preview .my-preview_row2 .my-preview_row2_bottom {
  width: 100%;
  color: #888;
  padding-top: 0px;
  padding-bottom: 4px;
}

.my-preview .my-preview_row3 {
  background-color: #FFFFFF;
  display: flex;
  flex-direction: row;
  padding: 5px 10px 10px 10px;
  width: 100%;
}
.my-preview .my-preview_row3 .my-preview_row3_left {
  flex: 2;
}
.my-preview .my-preview_row3 .my-preview_row3_right {
  flex: 3;
  text-align: right;
}
.order-list-icon {
  height: 16px;
  width: 16px;
  vertical-align: sub;
}
</style>
