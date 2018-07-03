<template>
  <div class="plan-info">
    <mt-header title="团期详情" fixed>
      <!-- <router-link :to="{name:'line-plan'}" slot="left" replace>
        <mt-button icon="back">返回</mt-button>
      </router-link> -->
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div style="height:40px"></div>

    <my-block bottom left>产品信息</my-block>
    <mt-cell title="线路类别" :value="plan.lineTypeName"></mt-cell>
    <mt-cell-swipe title="线路名称" :right="[
        {
          content: '浏览行程',
          style: {
            background: '#00CC00', color: '#fff' ,
            width: '80px', display: 'flex', 'align-items': 'center',
            'justify-content': 'center'
          },
          handler: () => {
            lineTitleClick(plan.uniqLineUrl);
          }
        }
      ]" @click.native="lineTitleClick(plan.uniqLineUrl)" is-link class="my-cell-swipe" v-if="plan.lineID">
      <p>{{plan.lineTitle}}</p>
    </mt-cell-swipe>
    <mt-cell-swipe title="线路名称" class="my-cell-swipe" v-else>
      <p>{{plan.lineTitle}}</p>
    </mt-cell-swipe>
    <mt-cell title="天数" :value="plan.days"></mt-cell>
    <mt-cell title="团号" :value="plan.planCode"></mt-cell>
    <mt-cell title="截止收客日" v-if="plan.EndDay" :value="DateFmt(plan.EndDay) + (plan.EndDay?('('+['周一','周二','周三','周四','周五','周六','周日'][(new Date(plan.EndDay).getDay()==0 ? 6:new Date(plan.EndDay).getDay()-1)]+')'):'')"></mt-cell>
    <mt-cell title="出团日期" :value="DateFmt(plan.planDate) + (plan.planDate?('('+['周一','周二','周三','周四','周五','周六','周日'][(new Date(plan.planDate).getDay()==0 ? 6:new Date(plan.planDate).getDay()-1)]+')'):'')"></mt-cell>
    <mt-cell title="回团日期" :value="DateFmt(plan.backDate) + (plan.backDate?('('+['周一','周二','周三','周四','周五','周六','周日'][(new Date(plan.backDate).getDay()==0 ? 6:new Date(plan.backDate).getDay()-1)]+')'):'')"></mt-cell>
    <mt-cell title="状态">
      <span style="color: green" v-if="plan.isLock=='0'&&plan.endNum>0">正常</span>
      <span style="color: red" v-else-if="plan.isLock=='0'&&plan.endNum<=0&&(plan.stayNum+plan.the_union_stay_num)>0">暂满</span>
      <span style="color: orange" v-else-if="plan.isLock=='0'&&plan.endNum<=0">满员</span>
      <span style="color: black" v-else-if="plan.isLock=='1'">停售</span>
      <span style="color: blue" v-else-if="plan.isLock=='2'">候补</span>
      <span style="color: red" v-else-if="plan.isLock=='3'">售罄</span>
      <span style="color: orange" v-else-if="plan.isLock=='4'">封团</span>
      <span style="color: orange" v-else-if="plan.isLock=='9'">审结</span>
      <span style="color: gray" v-else-if="plan.isLock=='-1'">取消</span>
      <span v-else></span>
    </mt-cell>
    <mt-cell title="团期类型" :value="plan.planType"></mt-cell>
    <my-block bottom left>位置信息</my-block>
    <mt-cell title="计划位">
      <span>{{plan.planNum}}</span>
    </mt-cell>
    <mt-cell title="可售余位">
      <span style="color:#f36">{{plan.endNum}}</span>
    </mt-cell>
    <mt-cell title="确认占位">
      <span style="color: blue">{{plan.trueNum||0}}</span>
    </mt-cell>
    <mt-cell title="预留占位" is-link @click.native="$router.push({ name: 'place-list' })" v-if="plan.stayNum>0">
      <!--<span style="color: green">{{plan.stayNum||0}}</span>-->
    </mt-cell>
    <mt-cell title="预留占位" v-else>
      <!--<span style="color: green">{{plan.stayNum||0}}</span>-->
    </mt-cell>
    <router-link to="/place-info" class="router-link">
      <mt-cell title="查看更多" is-link></mt-cell>
    </router-link>
    <my-block v-if="plan.planPrice"></my-block>
    <router-link to="/city-info" class="router-link" v-if="plan.planPrice">
      <my-cell title="起止城市" :value="plan.planPrice&&plan.planPrice.length>0?plan.planPrice[0].fromCityName:''" is-link></my-cell>
    </router-link>
    <my-block bottom left>价格信息</my-block>
    <router-link to="/price-info" class="router-link">
      <mt-cell :title="price.price_title" is-link></mt-cell>
    </router-link>
    <mt-cell title="同行价（成人）" :value="NumFmt(price.adultPrice||0)"></mt-cell>
    <mt-cell title="同行价（小童）" :value="NumFmt(price.childPrice||0)"></mt-cell>
    <mt-cell title="同行价（小年轻）" :value="NumFmt(price.adultPrice1||0)"></mt-cell>
    <mt-cell title="同行价（老人）" :value="NumFmt(price.adultPrice2||0)"></mt-cell>
    <mt-cell title="同行价（小童不占床）" :value="NumFmt(price.childPrice1||0)"></mt-cell>
    <mt-cell title="定金" :value="NumFmt(price.DingPrice||0)"></mt-cell>
    <mt-cell title="杂费" :value="NumFmt(plan.otherBillPrice||0)"></mt-cell>
    <router-link to="/price-info" class="router-link">
      <mt-cell title="其他价格套餐" is-link></mt-cell>
    </router-link>
    <my-block v-show="plan.iPlanInfo"></my-block>
    <my-media-box v-show="plan.iPlanInfo" title="对内说明" :descriptions="[plan.iPlanInfo]" type="text"></my-media-box>
    <my-block v-show="plan.planInfo"></my-block>
    <my-media-box v-show="plan.planInfo" title="对外说明" :descriptions="[plan.planInfo]" type="text"></my-media-box>
    <my-block v-show="plan.flight&&plan.flight.length>0"></my-block>
    <my-media-box v-show="plan.flight&&plan.flight.length>0" title="航班信息" :descriptions="flights" type="text"></my-media-box>
    <my-block v-show="plan.hotel&&plan.hotel.length>0"></my-block>
    <my-media-box v-show="plan.hotel&&plan.hotel.length>0" title="酒店信息" :descriptions="hotels" type="text"></my-media-box>
    <div v-if="JSON.stringify(plan.guide) !== '[]'">
      <my-block bottom left>领队信息</my-block>
    </div>
    <div v-if="plan.guide" v-for="g in plan.guide">
      <mt-cell :title="g.guideName" :value="g.CNphone"></mt-cell>
    </div>

    <my-block bottom left>人员信息</my-block>
    <mt-cell title="建团人" :value="plan.admName"></mt-cell>
    <mt-cell title="建团时间" :value="DateFmt(plan.addTime, 'yyyy-MM-dd hh:mm') + (plan.weekday?'('+plan.weekday+')':'')"></mt-cell>
    <mt-cell title="指定销售" :value="plan.saleName" v-if="plan.saleName"></mt-cell>
    <mt-cell title="线路OP" :value="plan.OPName" v-if="plan.OPName"></mt-cell>
    <mt-cell title="机票OP" :value="plan.JPName" v-if="plan.JPName"></mt-cell>
    <mt-cell title="签证OP" :value="plan.QZName" v-if="plan.QZName"></mt-cell>
    <mt-cell title="酒店OP" :value="plan.JDName" v-if="plan.JDName"></mt-cell>
    <my-pad v-if="PermitCheck('33Y2YDNGWOOJ')"></my-pad>
    <my-block v-else></my-block>
    <my-button-block fixed v-if="PermitCheck('33Y2YDNGWOOJ')&&plan.isLock=='0'&&plan.endNum>0">
      <router-link :to="plaNav('order-place')" class="router-link" replace>
        <mt-button type="primary" size="large">立即下单</mt-button>
      </router-link>
    </my-button-block>
  </div>
</template>

<script>
  import { Toast } from "mint-ui"

  export default {
    data() {
      return {
      }
    },
    created() {

      //如果query存在团期id，则显示指定团期
      let planid = this.$route.query.id;
      let preid = this.planId;
      if (!planid && !preid) {
        Toast("未选择有效团期");
        return;
      }
      if (planid && planid != preid) {
        //若从外链或刷新进入，重新设置planid
        this.$store.dispatch("plan/plan_select", { id: planid });
      }
      //存在数据不同步情况，每次进来都进行刷新
      this.$store.dispatch("plan/plan_request");
    },
    computed: {
      price() {
        return this.$store.getters["plan/price/price_show"];
      },
      plan() {
        return this.$store.getters["plan/plan"];
      },
      planId() {
        return this.$store.getters["plan/plan_id"];
      },
      flights() {
        let fs = this.plan.flight;
        if (!fs || fs.length < 1) {
          return [""];
        } else {
          let fstrs = [];
          fs.forEach(f => {
            fstrs.push(f.theFlightNo + " " + f.theFromCode + '/' + f.theToCode + " " + f.theDay + " " + f.theFromTime + "-" + f.theToTime)
          })
          return fstrs;
        }
      },
      hotels() {
        let hs = this.plan.hotel;
        if (!hs || hs.length < 1) {
          return [""];
        } else {
          let hstrs = [];
          hs.forEach(h => {
            hstrs.push(h.theTitle);
          })
          return hstrs;
        }
      }
    },
    methods: {
      lineTitleClick(url) {
        if (url) {
          window.location.href = url;
        }
      },
      plaNav(v) {
        let pid = this.planId;
        return { name: v, query: { id: pid }, params: { refresh: true } }
      },
    },
  }

</script>

<style>
  .plan-info .plan-info_limit-width .mint-cell-value {
    width: 80%;
  }
</style>