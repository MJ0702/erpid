<template>
  <div>
    <mt-header title="我的订单" fixed>
      <router-link :to="routerTo[type]" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button slot="right" @click="$router.push({path: '/order-search'})">筛选</mt-button>
    </mt-header>
    <div style="height:40px"></div>
    <mt-navbar class="plan-list-sign" style="border-bottom:1px solid #d9d9d9">
      <mt-tab-item :id='i' :class="selected==i ? 'is-selected' : ''" v-for="title,i in titles" @click.native="fnTab(i)">{{title}}</mt-tab-item>
    </mt-navbar>
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10" class="page-infinite-list">
      <div v-if="selected==1">
        <my-block></my-block>
        <div class="box-details-list list-3" v-for="order in orders" @click="orderClick(order)">
          <div class="box-order-list-header header">
            <div class="left-item">
              <span class="title-name">订单:</span>
              <span class="title-value" style="margin-right:3px">{{order.ID}} </span>
              <span class="box-small-circle" style="color: #0386CA;border-color:#0386CA" v-if="order.isOK==1&&order.suretyID<=0">已确认</span>
              <span class="box-small-circle" style="color: #0386CA;border-color:#0386CA" v-else-if="order.isOK==1&&order.suretyID>0">已担保</span>
              <span class="box-small-circle" style="color: green;border-color:green" v-else-if="order.isOK==0">预留中</span>
              <span class="box-small-circle" style="color: gray;border-color:gray" v-else-if="order.isOK==-4">已清位</span>
              <span class="box-small-circle" style="color: gray;border-color:gray" v-else-if="order.isOK==-2">已撤销</span>
              <span class="box-small-circle" style="color: black;border-color:black" v-else-if="order.isOK==-3">已取消</span>
              <!--<span class="box-small-circle">新品</span>-->
              <span class="box-small-circle">{{order.sources}}</span>
            </div>
            <div class="right-item">{{DateFmt(order.addTime, 'yyyy-MM-dd hh:mm')}}</div>
          </div>
          <div class="details-list-title">
            {{order.linetTitle}}
          </div>

          <div class="details-list-row row-2">
            <div class="left-item">客户：{{order.ctName}}</div>
            <div class="right-item" v-if="order.isOK>-1">
              <span class="box-small-circle">{{order.pub_fromcity_name}}</span>
              <span class="box-small-circle" style="color:#f60;border-color:#f60" v-if="order.ordTypeName">{{order.ordTypeName}}</span>
              <span class="box-small-circle" style="color:#f30;border-color:#f30">{{['占位','不占位'][order.isTicket]}}</span>
            </div>
            <div class="right-item" v-else>
              <span class="box-small-circle no-normal">{{order.pub_fromcity_name}}</span>
              <span class="box-small-circle no-normal" v-if="order.ordTypeName">{{order.ordTypeName}}</span>
              <span class="box-small-circle no-normal">{{['占位','不占位'][order.isTicket]}}</span>
            </div>
          </div>
          <div class="details-list-row row-3">
            <div class="left-item">出团：{{DateFmt(order.planDate, 'yyyy-MM-dd')}}</div>
            <div class="right-item" v-if="order.isOK>-1">
              <span class="box-small-circle" style="border-color:#3BBA54; color: #3BBA54;">成人段{{order.aduNum + order.aduNum1}}</span>
              <span class="box-small-circle" style="border-color:rgb(0, 102, 204);color: rgb(0, 102, 204);">小童段{{order.chdNum + order.chdNum1 }}</span>
              <span class="box-small-circle" style="border-color:#09f; color: #09f">老人{{order.aduNum2}}</span>
            </div>
            <div class="right-item" v-else>
              <span class="box-small-circle no-normal">成人段{{order.aduNum + order.aduNum1}}</span>
              <span class="box-small-circle no-normal">小童段{{order.chdNum + order.chdNum1 }}</span>
              <span class="box-small-circle no-normal">老人{{order.aduNum2}}</span>
            </div>
          </div>
          <div class="details-list-row row-4">
            <div class="left-item" v-if="order.endTime&&order.isOK==0">到期时间：{{DateFmt(order.endTime, 'yyyy-MM-dd hh:mm')}}</div>
            <div class="right-item">查看更多>></div>
          </div>
          <div class="box-order-list-header footer">
            <div class="left-item">
              <span class="title-name">合计 : </span>
              <span class="title-value price-1">{{NumFmt(order.amount)}} </span>
              <span class="title-name" style="margin-left:10px;" v-if="order.pingAmount">已收 :</span>
              <span class="title-value price-2" v-if="order.pingAmount">{{NumFmt(order.pingAmount, 2)}}</span>
            </div>
            <!--<div class="right-item">2017-06-09 14:30</div>-->
            <div class="right-item">
              <mt-button v-if="(PermitCheck('me-receipt')&&order.isOK>=0)" type="primary" size="small" style="height:27px;background:#0099FE"
                @click.stop="qrcodeBtn(order)">二维码收款</mt-button>
              <mt-button v-else type="primary" size="small" style="height:27px;background:#ccc" @click.stop>二维码收款</mt-button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="selected==0">
        <div class="my-preview" v-for="order in orders" @click="orderClick(order)">
          <my-block></my-block>
          <div class="my-preview_row1">
            <div class="my-preview_row1_left">
              <img src="~assets/order-list-sale.png" class="order-list-icon"> {{order.ctName}}
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
    <my-navigate-tab selected="order"></my-navigate-tab>
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
        orderClearAction: ["order/orders_clear", "order/orders_search_clear"],
        orderQueryAction: ["order/orders_request", "order/orders_search"],
        routerTo: ["/", "/order-search"],
        titles: ['旧版', '新版']
      }
    },
    computed: {
      orders() {
        let data = this.$store.getters[this.ordersGetters[this.type]];
        data.forEach(end => {
          if (end.pub_fromcity_name && end.pub_fromcity_name.length > 6) {
            end.pub_fromcity_name = end.pub_fromcity_name.slice(0, 6) + '..';
          }
          if (end.sources && end.sources.length > 5) {
            end.sources = end.sources.slice(0, 5) + '..';
          }
        })
        return data;
      },
      selected() {
        return this.$store.getters["order/orderSelected"];
      }
    },
    created() {
      this.$store.dispatch(this.orderClearAction[this.type]);

      this.loadEnd = !this.loadEnd;
      if (this.$store.getters['sys/get_if_has_permit_data']) {
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
        this.$router.push({ name: "order-info", query: { id: order.ID } });
      },
      loadMore() {
        if (this.loadEnd && !this.showEnd) {
          this.loadEnd = !this.loadEnd;
          this.$store.dispatch(this.orderQueryAction[this.type]).then(end => {
            this.permit; //每次获取完数据后判断一次权限
            this.showEnd = end
            this.loadEnd = !this.loadEnd;
            if (end) {
              // Toast("没有找到相应的信息");
            }
          });
        }
      },
      qrcodeBtn(order) {
        this.$store.dispatch('money/receipt/receipt_order_select', order);
        this.$router.push({ name: 'money-receipt-qrcode', query: { type: 'order-refresh' } });
      },
      fnTab(index) {
        this.$store.dispatch("order/orderSelected", index);
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

  .mint-navbar.plan-list-sign .mint-tab-item.is-selected {
    margin-bottom: 0;
    border-bottom-width: 1px;
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


  .box-details-list {
    padding: 0 10px;
    position: relative;
    background: #fff;
  }

  .box-details-list.list-3 {
    padding-bottom: 6px;
    margin-bottom: 8px;
  }



  .box-details-list.list-3::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: #d9d9d9;
    /*transform: scaleY(.5);*/
  }

  .box-details-list.list-3 .details-list-title {
    padding: 8px 0 0px;
    font-size: 14px;
    line-height: 18px;
    font-weight: 700;
    background-image: -webkit-linear-gradient(top, #d9d9d9, #d9d9d9 50%, transparent 0);
    background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 0);
    background-size: 120% 1px;
    background-repeat: no-repeat;
    background-position: 0 0;
  }

  .box-details-list.list-3 .details-list-row {
    width: 100%;
    overflow: hidden;
  }

  .box-details-list.list-3 .details-list-row .left-item {
    color: rgb(107, 107, 107);
  }

  .box-details-list.list-3 .details-list-row .right-item {
    text-align: right;
  }

  .box-details-list.list-3 .details-list-row.row-1 .left-item {
    width: 70%;
    float: left;
    line-height: 24px;
    font-size: 14px;
    overflow: hidden;
  }

  .box-details-list.list-3 .details-list-row.row-1 .right-item {
    width: 30%;
    float: left;
    text-align: right;
    font-size: 18px;
    color: rgb(255, 102, 0);
  }

  .box-details-list.list-3 .details-list-row.row-2 {
    box-sizing: border-box;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding-top: 4px;
    overflow: initial;
  }

  .box-details-list.list-3 .details-list-row.row-2 .left-item {
    /*width: 50%;
    float: left;*/
    padding: 0px 0 2px;
    font-size: 13px;
    overflow: hidden;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    word-break: break-all;
  }

  .box-details-list.list-3 .details-list-row.row-2 .right-item {
    /*width: 50%;
    float: left;
    margin-top: 1px;*/
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    margin-top: -6px;
  }

  .box-details-list.list-3 .details-list-row.row-3 .left-item {
    width: 50%;
    float: left;
    padding: 0px 0 2px;
    font-size: 13px;
  }

  .box-details-list.list-3 .details-list-row.row-3 .right-item {
    width: 50%;
    float: left;
    margin-top: -1px;
  }

  .box-details-list.list-3 .details-list-row.row-4 .left-item {
    width: 60%;
    float: left;
    line-height: 24px;
    font-size: 14px;
    overflow: hidden;
  }

  .box-details-list.list-3 .details-list-row.row-4 {
    padding-bottom: 5px;
  }

  .box-details-list.list-3 .details-list-row.row-4 .right-item {
    width: 40%;
    float: right;
    margin-top: 4px;
    color: #A1A1A1;
    font-size: 12px;
  }

  .box-details-list.list-3 .box-small-circle {
    padding: 0 4px;
    border-radius: 3px;
    font-size: 10px;
    margin: 0 2px;
    display: inline-block;
    border: 1px solid rgb(0, 153, 255);
    color: rgb(0, 153, 255);
    line-height: initial;
    vertical-align: middle;
    box-sizing: border-box;
  }

  .box-details-list.list-3 .box-small-circle.no-normal {
    color: grey;
    border-color: grey;
  }

  .box-order-list-header {
    overflow: hidden;
    padding: 8px 0 3px;
    position: relative;
  }

  .box-order-list-header.footer {
    padding: 8px 0 3px;
  }

  .box-order-list-header .left-item {
    width: 65%;
    float: left;
    line-height: 24px;
    font-size: 14px;
    overflow: hidden;
    color: rgb(107, 107, 107);
  }

  .box-order-list-header.footer .left-item {
    line-height: 27px;
  }

  .box-order-list-header.header .left-item {
    color: #6B6B6B;
  }

  .box-order-list-header.header .left-item span {
    vertical-align: middle;
    margin-top: -1px;
  }

  .box-order-list-header .right-item {
    width: 35%;
    float: left;
    line-height: 24px;
    font-size: 14px;
    overflow: hidden;
    color: rgb(107, 107, 107);
    text-align: right;
  }

  .box-order-list-header.footer .left-item {
    color: #6B6B6B;
  }

  .box-order-list-header.footer::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 1px;
    background: #d4d4d4;
    transform: scaleY(.5);
  }

  .box-order-list-header.footer .left-item .price-1 {
    color: #FF6600
  }

  .box-order-list-header.footer .left-item .price-2 {
    color: #FF3300;
  }
</style>