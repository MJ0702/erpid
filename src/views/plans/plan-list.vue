<template>
  <!-- 团期 -->
  <div class="plan-list">
    <mt-header title="团期计划" fixed>
      <router-link to="/" slot="left" replace>
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button slot="right" @click="$router.push({name: 'plan-search', params:{enforce:true}})">筛选</mt-button>
    </mt-header>
    <div style="height:40px"></div>
    <mt-navbar class="plan-list-sign">
      <mt-tab-item :id='i' :class="selected==i ? 'is-selected' : ''" v-for="title,i in titles" @click.native="fnTab(i)">{{title}}</mt-tab-item>
    </mt-navbar>
    <!-- <div class="plan-list-title">
        <div class="column1">出团</div>
        <div class="column2">产品名称</div>
        <div class="column3">同行价</div>
        <div class="column4">余位</div>
      </div> -->
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="180" class="page-infinite-list">
      <div v-if="selected==1" class="box-details-list list-1" @click="planClick(plan)" v-for="plan,index in plans">
        <div class="details-list-title sign">
          <span class="box-small-circle" style="border-color:#3BBA54; color: #3BBA54;" v-if="plan.isLock=='0'&&plan.endNum>0">正常</span>
          <span class="box-small-circle no-normal" style="border-color:red; color: red" v-else-if="plan.isLock=='0'&&plan.endNum<=0&&(plan.stayNum+plan.the_union_stay_num)>0">暂满</span>
          <span class="box-small-circle no-normal" style="border-color:gray; color: gray" v-else-if="plan.isLock=='0'&&plan.endNum<=0">满员</span>
          <span class="box-small-circle no-normal" style="border-color:gray; color: gray" v-else-if="plan.isLock=='1'">停售</span>
          <span class="box-small-circle no-normal" style="border-color:gray; color: gray" v-else-if="plan.isLock=='2'">候补</span>
          <span class="box-small-circle no-normal" style="border-color:gray; color: gray" v-else-if="plan.isLock=='3'">售罄</span>
          <span class="box-small-circle no-normal" style="border-color:gray; color: gray" v-else-if="plan.isLock=='4'">封团</span>
          <span class="box-small-circle no-normal" style="border-color:gray; color: gray" v-else-if="plan.isLock=='9'">审结</span>
          <span class="box-small-circle no-normal" style="border-color:gray; color: gray" v-else-if="plan.isLock=='-1'">取消</span>
          <span v-else></span> {{ plan.lineTitle }} - {{ plan.lineTypeName }} 
        </div>
        <div class="details-list-row row-1">
          <div class="left-item">{{ DateFmt(plan.PlanDate, 'MM-dd') }}({{plan.weekday}})
          </div>
          <div class="right-item"  v-if="plan.isLock=='0'&&plan.endNum>0">
            <span class="box-small-circle sprice" v-if="showPrice.sadultPrice">市 {{ plan.sadultPrice }}</span>
            <span class="box-small-circle price" v-if="showPrice.adultPrice">同 {{ plan.adultPrice }}</span>
          </div>
          <div class="right-item"  v-else>
            <span class="box-small-circle sprice" style="color:grey;border-color:grey" v-if="showPrice.sadultPrice">市 {{ plan.sadultPrice }}</span>
            <span class="box-small-circle price" style="color:grey;border-color:grey" v-if="showPrice.adultPrice">同 {{ plan.adultPrice }}</span>
          </div>
        </div>
        <div class="details-list-row row-2">
          <div class="left-item">{{ plan.PlanCode }}
            <!--<img src="http://cdnfile.op110.com.cn/images/icon/16x16/x_cost_jipiao.png" v-if="plan.theUnionPlanID && plan.the_union_erp_id == mine.ID" >-->
            <img src="http://cdnfile.op110.com.cn/images/icon/16x16/x_link_gray.png" v-if="!plan.theUnionPlanID && plan.theOpenPlanID > 0">
          </div>
          <!--起止城市-->
          <div class="right-item">
            <span class="box-small-circle" v-if="plan.isTJ!='无'" :style="'color:'+plan.TJcolor">{{plan.isTJ}}</span>
            <!--<span class="box-small-circle">新品</span>-->
            <span class="box-small-circle" v-if="plan.isLock=='0'&&plan.endNum>0">{{plan.operate_type ? '他营':'自营'}}</span>
            <span class="box-small-circle no-normal" v-else>{{plan.operate_type ? '他营':'自营'}}</span>
          </div>
        </div>
        <div class="details-list-row row-3">
          <div class="left-item">{{ plan.fromCityName }}</div>
          <!--出团日期-->
          <div class="right-item" @click.stop="placeOrderShow(index)" v-if="plan.isLock=='0'&&plan.endNum>0">
            <span class="box-small-circle" style="border-color:red;color:red">余{{plan.endNum}}</span>
            <span class="box-small-circle" style="border-color:rgb(0, 102, 204);color: rgb(0, 102, 204);">确认{{plan.trueNum}}</span>
            <span class="box-small-circle" style="border-color:#3BBA54; color: #3BBA54;">预留{{plan.stayNum}}</span>
            <span class="arrow-none-up"></span>
          </div>
          <div class="right-item" @click.stop="placeOrderShow(index)" v-else>
            <span class="box-small-circle no-normal">余{{plan.endNum}}</span>
            <span class="box-small-circle no-normal">确认{{plan.trueNum}}</span>
            <span class="box-small-circle no-normal">预留{{plan.stayNum}}</span>
            <span class="arrow-none-up"></span>
          </div>
        </div>
        <div class="details-handle-box" v-show="plan.show==true">
          <div class="left-item-btn border-right" style="color:#26a2ff" @click.stop="goOrderList(plan)">
            <img src="~assets/order-tab-active.png" alt="团期"> 团期订单
          </div>
          <div v-if="plan.isLock=='0' && plan.stayNum>0" class="left-item-btn border-right sign-true" @click.stop="planStayNum(plan)">
            <img src="~assets/yuliu-select.png" alt="预留"> 预留信息
          </div>
          <div v-else class="left-item-btn border-right" @click.stop="planStayNum(plan)">
            <img src="~assets/yuliu.png" alt="预留"> 预留信息
          </div>
          <div v-if="plan.isLock=='0' && plan.endNum>0" class="left-item-btn sign-true" @click.stop="placeOrder(plan)">
            <img src="~assets/xiadan-select.png" alt="下单"> 下单
          </div>
          <div v-else class="left-item-btn" @click.stop="placeOrder(plan)">
            <img src="~assets/xiadan.png" alt="下单"> 下单
          </div>
        </div>
      </div>
      <div style="margin-top:1px" v-if="selected==0">
        <mt-cell-swipe :right="PermitCheck('33Y2YDNGWOOJ')?[
              {
                  content: '团期<br>订单',
                  style: {
                    background: 'rgb(32, 141, 224)', color: '#fff' ,
                    float:'left', display: 'flex', 'align-items': 'center',
                    'justify-content': 'center','line-height':'24px'
                  },
                  handler: () => {
                    goOrderList(plan);
                  }
                },
              {
                  content: '预留<br>占位',
                  style: {
                    background: plan.isLock=='0'&&plan.stayNum>0?'#55acee':'#ccc', color: '#fff' ,
                    float:'left', display: 'flex', 'align-items': 'center',
                    'justify-content': 'center','line-height':'24px'
                  },
                  handler: () => {
                    planStayNum(plan);
                  }
                },
                {
                  content: '下单',
                  style: {
                    background: plan.isLock=='0'&&plan.endNum>0?'#3399FF':'#888', color: '#fff' ,
                    width:'50px',display: 'flex', 'align-items': 'center',
                    'justify-content': 'center'
                  },
                  handler: () => {
                    placeOrder(plan);
                  }
                }
              ]:''" @click.native="planClick(plan)" class="plan-list-row" v-for="plan in plans">

          <div class="column1">
            <div>{{DateFmt(plan.PlanDate, 'MM/dd')}}</div>
            <!-- 出团日期 -->
            <div style="text-align:left">{{plan.weekday}}</div>
          </div>
          <div class="column2">
            <div>{{plan.lineTitle + plan.lineTypeName}}</div>
            <!-- 线路名称 -->
            <div>{{plan.fromCityName + '|' + plan.PlanCode}}</div>
            <!-- 起止城市，团号 -->
          </div>
          <div class="column3">
            <!-- 同行价 -->
            <span style="color: orange">{{plan.adultPrice}}</span>
          </div>
          <div class="column4">
            <!-- 余位 -->
            <span style="color: #3BBA54;font-size:1.17em;" v-if="plan.isLock=='0'&&plan.endNum>0">{{plan.endNum}}</span>
            <span style="color: red" v-else-if="plan.isLock=='0'&&plan.endNum<=0&&(plan.stayNum+plan.the_union_stay_num)>0">暂满</span>
            <span style="color: gray" v-else-if="plan.isLock=='0'&&plan.endNum<=0">满员</span>
            <span style="color: gray" v-else-if="plan.isLock=='1'">停售</span>
            <span style="color: gray" v-else-if="plan.isLock=='2'">候补</span>
            <span style="color: gray" v-else-if="plan.isLock=='3'">售罄</span>
            <span style="color: gray" v-else-if="plan.isLock=='4'">封团</span>
            <span style="color: gray" v-else-if="plan.isLock=='9'">审结</span>
            <span style="color: gray" v-else-if="plan.isLock=='-1'">取消</span>
            <span v-else></span>
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
    <my-navigate-tab selected="plan"></my-navigate-tab>
  </div>
</template>

<script>
  import { Toast } from "mint-ui";

  export default {
    data() {
      return {
        showEnd: false,
        loadEnd: true,
        placeOrderSelected: -1,
        // plansign:[],
        titles: ['旧版', '新版']
      }
    },
    created() {
      this.$store.dispatch("plan/plans_search_clear");
      this.loadEnd = false;

      if (this.$store.getters['sys/get_if_has_permit_data']) {
        // 有权限数据，直接请求团期数据
        this.$store.dispatch("plan/plans_search").then(end => {
          this.loadEnd = true;
        });
      } else {
        // 强制请求一次权限数据后，再请求团期数据
        this.$store.dispatch("sys/permit_request", true).then(permit => {
          this.$store.dispatch("plan/plans_search").then(end => {
            this.loadEnd = true;
          });
        })
      }
    },
    computed: {
      plans() {
        return this.$store.getters["plan/plans_search"];
      },
      mine() {
        return this.$store.getters["mine/mine"];
      },
      plansign() {
        let arr = [];
        return arr;
      },
      selected() {
        return this.$store.getters["plan/planSelected"];
      },
      showPrice() {
        return this.$store.getters["plan/showPrice"];
      },
    },
    methods: {
      placeOrderShow(index) {
        console.log(this.plans[index].show);
        if (this.plans[index].show) {
          // this.placeOrderSelected=-1;
          this.plans[index].show = false;
        } else {
          // this.placeOrderSelected=index;
          this.plans[index].show = true;
        }
      },
      fnTab(index) {
        this.$store.dispatch("plan/planSelected", index);
      },
      planClick(plan) {
        this.$router.push({ name: "plan-info", query: { id: plan.ID } });
      },
      placeOrder(plan) {
        if (plan.isLock == '0' && plan.endNum > 0) {
          this.$router.push({ name: 'order-place', query: { id: plan.ID }, params: { refresh: true } });
        } else {
          Toast('此团期不允许下单');
        }
      },
      planStayNum(plan) {
        if (plan.isLock == '0' && plan.stayNum > 0) {
          this.$store.dispatch("plan/plan_select", { id: plan.ID });
          this.$router.push({ name: 'place-list' });
        } else {
          Toast('此团期没有预留占位');
        }
      },
      loadMore() {
        if (this.loadEnd && !this.showEnd) {
          this.loadEnd = !this.loadEnd;
          this.$store.dispatch("plan/plans_search").then(end => {
            this.permit; //每次获取完数据后判断一次权限
            this.showEnd = end
            this.loadEnd = !this.loadEnd;
            if (end) {
              // Toast("没有找到相应的信息");
            }
          });
        }
      },
      goOrderList(plan) {
        this.$store.dispatch("plan/plan_select", { id: plan.ID });
        this.$router.push({ name: 'plan-order-list' });
      },
    },
  }

</script>

<style>
  /*.plan-list-title {
    display: flex;
    background-color: #3E3E42;
    color: #fff;
    padding: 0px 10px 0px 10px;
  }*/

  .mint-navbar.plan-list-sign .mint-tab-item.is-selected {
    margin-bottom: 0;
    border-bottom-width: 1px;
  }

  .plan-list .mint-cell-wrapper {
    position: relative;
  }

  .plan-list .mint-cell-value {
    width: 100%;
    font-size: smaller;
  }

  .plan-list .mint-cell-title {
    flex: none;
  }

  .plan-list-row {
    display: flex;
    height: 68px;
  }

  .plan-list-row .column1 div:nth-child(1) {
    padding: 12px 0px 6px 0px;
    color: #000;
    /*font-size: 1.17em;*/
  }

  .plan-list-row .column1 div:nth-child(2) {
    padding: 6px 0px 12px 0px;
  }

  .plan-list-row .column2 div:nth-child(1) {
    padding: 12px 0px 6px 0px;
    color: #000;
    /*font-size: 1.17em;*/
    width: 14em;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .plan-list-row .column2 div:nth-child(2) {
    padding: 6px 0px 12px 0px;
    width: 16em;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .plan-list-row:nth-child(odd) {
    background-color: #FFFFFF;
  }

  .plan-list-row:nth-child(even) {
    background-color: #F2F2F2;
  }

  .plan-list .column1 {
    flex: 2;
    height: 58px;
  }

  .plan-list .column2 {
    flex: 8.5;
    height: 58px;
  }

  .plan-list .column3 {
    flex: 2;
    font-size: 1.17em;
  }

  .plan-list .column4 {
    flex: 1.5;
    text-align: center;
  }

  .box-details-list {
    padding: 0 10px;
    position: relative;
    background: #fff;
  }

  .box-details-list.list-1 {
    padding-bottom: 6px;
  }

  .box-details-list.list-1:first-child {
    background-image: -webkit-linear-gradient(top, #d9d9d9, #d9d9d9 50%, transparent 0);
    background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 0);
    background-size: 120% 1px;
    background-repeat: no-repeat;
    background-position: 0 0;
  }

  .box-details-list::before {
    content: '';
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 0;
    height: 1px;
    background: #d4d4d4;
    transform: scaleY(.5);
  }

  .details-list-title {
    padding: 8px 0 4px;
    font-size: 14px;
    line-height: 18px;
    font-weight: 700
  }

  .box-details-list.list-1 .details-list-row {
    width: 100%;
    overflow: hidden;
  }

  .box-details-list.list-1 .details-list-row .left-item {
    color: rgb(107, 107, 107);
  }

  .box-details-list.list-1 .details-list-row .right-item {
    text-align: right;
  }

  .box-details-list.list-1 .details-list-row.row-1 .left-item {
    width: 30%;
    float: left;
    line-height: 24px;
    font-size: 14px;
    overflow: hidden;
  }

  .box-details-list.list-1 .details-list-row.row-1 .right-item {
    width: 70%;
    float: left;
    text-align: right;
    font-size: 18px;
    color: rgb(255, 102, 0);
  }

  .box-details-list.list-1 .details-list-row.row-2 .left-item {
    width: 50%;
    float: left;
    padding: 4px 0 6px;
    font-size: 13px;
    overflow: hidden;
  }

  .box-details-list.list-1 .details-list-row.row-2 .right-item {
    width: 50%;
    float: left;
    margin-top: 2px;
  }

  .box-details-list.list-1 .details-list-row.row-3 .left-item {
    width: 50%;
    float: left;
    padding: 0px 0 6px;
    font-size: 14px;
  }

  .box-details-list.list-1 .details-list-row.row-3 .right-item {
    width: 50%;
    float: left;
    margin-top: 2px;
  }

  .details-list-title.sign .box-small-circle {
    margin-top: -2px;
  }

  .arrow-none-up {
    width: 16px;
    height: 16px;
    background-color: #fff;
    position: relative;
    border: 1px solid #0099FF;
    display: inline-block;
    vertical-align: middle;
  }
  /*小三角*/

  .arrow-none-up:after {
    border: solid transparent;
    border-top-color: #fff;
    border-width: 4px;
    content: " ";
    position: absolute;
    right: 4px;
    top: 5px;
  }
  /*大三角*/

  .arrow-none-up:before {
    border: solid transparent;
    border-top-color: #0099FF;
    border-width: 6px;
    content: " ";
    position: absolute;
    right: 2px;
    top: 5px;
  }

  .details-handle-box {
    background: #f0f0f0;
    overflow: hidden;
    color: #868686;
    text-align: center;
    position: relative;
    font-size: 13px;
    padding-bottom: 3px;
    display: -moz-box;
    display: -webkit-box;
    display: box;
  }

  .details-handle-box .left-item-btn {
    -moz-box-flex: 1;
    -webkit-box-flex: 1;
    box-flex: 1;
    width: 50%;
    float: left;
    position: relative;
  }

  .details-handle-box .left-item-btn.sign-true {
    color: #26a2ff;
  }

  .details-handle-box .right-item-btn {
    width: 50%;
    float: left;
  }

  .details-handle-box .left-item-btn.border-right::before {
    position: absolute;
    content: '';
    right: 0;
    top: 3px;
    width: 1px;
    bottom: 3px;
    background: #ddd;
  }

  .details-handle-box .left-item-btn img,
  .details-handle-box .right-item-btn img {
    width: 25px;
    height: 25px;
    display: block;
    margin: 3px auto;
  }
  .box-small-circle.sprice{
    margin:-2px 4px 0;
    color:#f60;
    border-color:#f60;
    font-size: 13px;
  }
  .box-small-circle.price{
    margin:-2px 4px 0;
    color:red;
    border-color:red;
    font-size: 13px;
  }
</style>