<template>
  <div class="order-place-block">
    <mt-header title="下单" fixed>
      <router-link :to="plaNav('plan-info')" slot="left" replace>
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div style="height:40px"></div>
    <my-block></my-block>
    <my-cell title="线路名称" :value="plan.lineTitle"></my-cell>
    <mt-cell title="团号" :value="plan.planCode"></mt-cell>
    <mt-cell title="可售余位">
      <span style="color:#f36">{{plan.endNum}}</span>
    </mt-cell>
    <my-block bottom left>客户信息</my-block>
    <router-link to="/order-company-search" class="router-link">
      <my-cell title="客户公司" :value="customer.cpyName|| customer.simName || company.simName" is-link class="require-field"></my-cell>
    </router-link>
    <router-link to="/order-customer-search" class="router-link">
      <my-cell title="联系人" :value="customer.trueName" is-link class="require-field"></my-cell>
    </router-link>
    <mt-field label="联系手机" v-model="customer.mobile" type="tel" class="require-field input-right"></mt-field>
    <mt-cell title="总欠款" :value="debt.CpyPingAmountNos"></mt-cell>
    <mt-cell title="额度" :value="debt.CpyMaxMoney"></mt-cell>
    <mt-cell title="剩余额度" :value="(debt.CpyMaxMoney||0)-(debt.CpyPingAmountNos||0)"></mt-cell>
    <my-block></my-block>
    <router-link to="/order-type-select" class="router-link">
      <mt-cell title="订单类型" :value="type.cnName" is-link class="require-field"></mt-cell>
    </router-link>
    <router-link to="/city-select" class="router-link">
      <mt-cell title="出发城市" :value="city.fromCityName" is-link class="require-field"></mt-cell>
    </router-link>
    <router-link to="/price-select" class="router-link">
      <!--<mt-cell title="选择价格" :value="priceArr[price.type]+(price.price_title?'('+price.price_title+')':'')" is-link class="require-field"></mt-cell>-->
      <a class="mint-cell require-field">
        <span class="mint-cell-mask"> </span>
        <div class="mint-cell-left"></div>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <span class="mint-cell-text" >选择价格</span></div>
          <div class="mint-cell-value is-link"><span id="selectPrice">{{['市场价', '同行价', '成本价'][price.type]+(price.price_title?'('+price.price_title+')':'')}}</span></div>
        </div>
        <div class="mint-cell-right"></div><i class="mint-cell-allow-right"></i></a>
    </router-link>
    <mt-cell title="杂费" :value="NumFmt(plan.otherBillPrice)"></mt-cell>
    <my-block bottom left>报名人数</my-block>
    <mt-field label="成人" placeholder="请输入人数" type="number" v-model="order.aduNum" class="require-field" :attr="{
        min: 0
      }"></mt-field>
    <mt-field label="小童占床" placeholder="请输入人数" type="number" v-model="order.chdNum" :attr="{
        min: 0
      }"></mt-field>
    <mt-field :disabled="sys.con_adultPrice1_show==0" label="小年轻" placeholder="请输入人数" type="number" v-model="order.aduNum1" :attr="{
        min: 0
      }"></mt-field>
    <mt-field :disabled="sys.con_adultPrice2_show==0" label="老人" placeholder="请输入人数" type="number" v-model="order.aduNum2" :attr="{
        min: 0
      }"></mt-field>
    <mt-field :disabled="sys.con_childPrice1_show==0" label="小童不占床" placeholder="请输入人数" type="number" v-model="order.chdNum1"
      :attr="{
        min: 0
      }"></mt-field>
    <mt-cell title="占位">
      <mt-switch v-model="order.isTicket"></mt-switch>
    </mt-cell>
    <my-block bottom left>销售信息</my-block>
    <router-link to="/saler-info" class="router-link">
      <mt-cell title="销售" :value="mine.isSaleName ?　sale.userName || mine.trueName || mine.userName　: ''" is-link class="require-field"></mt-cell>
    </router-link>
    <router-link to="/saler-assistant-search" class="router-link">
      <mt-cell title="销售助理" :value="assistant.userName" is-link></mt-cell>
    </router-link>
    <mt-cell title="提成积分" v-show="PermitCheck('341VL25QAJIY')" :value="(order.saleSalary>0||order.saleScore>0)?'':'请设置'" is-link
      @click.native="showPopup(1)"></mt-cell>
    <my-block></my-block>
    <mt-cell class="background-image-no" @click.native="showPopup(2)" title="订单备注" value="" is-link></mt-cell>
    <mt-field class="background-image-no input-text-right" v-model="order.ordBak" rows="3" placeholder="请输入或选择订单备注" type="textarea"></mt-field>
    <my-block></my-block>
    <mt-field label="自我备注" placeholder="自我备注" type="textarea" v-model="order.iordBak"></mt-field>

    <my-block></my-block>
    <!--<mt-cell title="订单总价" :value="NumFmt(
      [
        ((price.sadultPrice||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum||0)+
        ((price.schildPrice||0)+city.sale_price+plan.otherBillPrice)*(order.chdNum||0)+
        ((price.sadultPrice1||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum1||0)+
        ((price.sadultPrice2||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum2||0)+
        ((price.schildPrice1||0)+city.sale_price+plan.otherBillPrice)*(order.chdNum1||0),
        ((price.adultPrice||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum||0)+
        ((price.childPrice||0)+city.sale_price+plan.otherBillPrice)*(order.chdNum||0)+
        ((price.adultPrice1||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum1||0)+
        ((price.adultPrice2||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum2||0)+
        ((price.childPrice1||0)+city.sale_price+plan.otherBillPrice)*(order.chdNum1||0),
        ((price.iadultPrice||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum||0)+
        ((price.ichildPrice||0)+city.sale_price+plan.otherBillPrice)*(order.chdNum||0)+
        ((price.iadultPrice1||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum1||0)+
        ((price.iadultPrice2||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum2||0)+
        ((price.ichildPrice1||0)+city.sale_price+plan.otherBillPrice)*(order.chdNum1||0)
      ][price.type])
    "></mt-cell>-->
    <a class="mint-cell require-field">
        <span class="mint-cell-mask"> </span>
        <div class="mint-cell-left"></div>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <span class="mint-cell-text" >订单总价</span></div>
          <div class="mint-cell-value is-link"><span id="totalPrice">
           {{ [
        ((price.sadultPrice||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum||0)+
        ((price.schildPrice||0)+city.sale_price+plan.otherBillPrice)*(order.chdNum||0)+
        ((price.sadultPrice1||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum1||0)+
        ((price.sadultPrice2||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum2||0)+
        ((price.schildPrice1||0)+city.sale_price+plan.otherBillPrice)*(order.chdNum1||0),
        ((price.adultPrice||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum||0)+
        ((price.childPrice||0)+city.sale_price+plan.otherBillPrice)*(order.chdNum||0)+
        ((price.adultPrice1||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum1||0)+
        ((price.adultPrice2||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum2||0)+
        ((price.childPrice1||0)+city.sale_price+plan.otherBillPrice)*(order.chdNum1||0),
        ((price.iadultPrice||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum||0)+
        ((price.ichildPrice||0)+city.sale_price+plan.otherBillPrice)*(order.chdNum||0)+
        ((price.iadultPrice1||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum1||0)+
        ((price.iadultPrice2||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum2||0)+
        ((price.ichildPrice1||0)+city.sale_price+plan.otherBillPrice)*(order.chdNum1||0)
      ][price.type]}}
            </span></div>
        </div>
        <div class="mint-cell-right"></div><i class="mint-cell-allow-right"></i></a>
    <my-block></my-block>
    <my-button-block v-show="PermitCheck('createOrd-reserve')">
      <mt-button type="default" size="large" @click.native="placeOrder('0')" style="background-color:#1AAD19;color:#FFFFFF;">添加预留单</mt-button>
    </my-button-block>
    <my-button-block v-show="PermitCheck('createOrd-affirm')">
      <mt-button type="default" size="large" @click.native="placeOrder('1')">添加确认单</mt-button>
    </my-button-block>

    <mt-header :title="['','提成积分','订单备注'][showWhich]" fixed v-if="popupStatus" style="z-index:2100">
      <router-link to="/order-place" slot="left">
        <mt-button icon="back" @click="popupStatus=!popupStatus">返回</mt-button>
      </router-link>
      <mt-button slot="right" @click="popupStatus=!popupStatus">取消</mt-button>
    </mt-header>
    <mt-popup v-model="popupStatus" popup-transition="popup-fade" position="right" class="my-popup-right">
      <div style="height:40px"></div>
      <!-- 销售提成右侧弹出 -->
      <my-block></my-block>
      <div v-if="showWhich==1"> 
        <mt-field label="人均积分" placeholder="请输入数字" type="number" v-model="order.saleScoreAvg" :attr="{
            min: 0
          }"></mt-field>
        <mt-field label="人数" placeholder="请输入数字" type="number" v-model="order.saleScoreNum" :attr="{
            max: (Number(order.aduNum||0)+Number(order.chdNum||0)+Number(order.aduNum1||0)+Number(order.aduNum2||0)+Number(order.chdNum1||0)),
            min: 1
          }"></mt-field>
        <mt-cell title="销售积分" :value="order.saleScore=(order.saleScoreAvg||0)*(order.saleScoreNum||1)"></mt-cell>
        <my-block></my-block>
        <mt-field label="人均提成" placeholder="请输入数字" type="number" v-model="order.saleSalaryAvg" :attr="{
            min: 0
          }"></mt-field>
        <mt-field label="数量" placeholder="请输入数字" type="number" v-model="order.saleSalaryNum" :attr="{
            max: (Number(order.aduNum||0)+Number(order.chdNum||0)+Number(order.aduNum1||0)+Number(order.aduNum2||0)+Number(order.chdNum1||0)),
            min: 0
          }"></mt-field>
        <mt-cell title="销售提成" :value="order.saleSalary=(order.saleSalaryAvg||0)*(order.saleSalaryNum||0)"></mt-cell>
      </div>
      <div v-if="showWhich==2" style="padding-bottom:60px;">
        <mt-checklist  v-model="ordBakSelect" :options="ordBak" @change="ordBakChange"></mt-checklist>
      </div>
    </mt-popup>
    <my-button-block fixed v-if="popupStatus" style="z-index:2100">
      <mt-button type="primary" size="large" @click.native="popupStatus = !popupStatus">确定</mt-button>
    </my-button-block>
  </div>
</template>

<script>
  import { MessageBox, Toast, Indicator } from 'mint-ui';

  export default {
    data() {
      return {
        popupStatus: false,
        showWhich:0,
        priceArr: ['市场价', '同行价', '成本价'],
        ordBakSelect:[],
      }
    },
    created() {
      
      
      //获取query参数
      let planid = this.$route.query.id;
      let preid = this.planId;
      let refresh = this.$route.params.refresh;
      if (!planid && !preid) {
        Toast("未选择有效团期");
        return;
      }
      if (planid && planid != preid) {//如果传过来的id与保存的id不同，进行初始化
        //会出现刷新情况，所以planid要作为url传过来，因此要判断query参数，
        //然后再请求mine, plan数据，再进行初始化
        this.$store.dispatch("plan/plan_select", { id: planid });
        this.$store.dispatch("mine/mine_request");
        this.$store.dispatch("plan/plan_request").then(_ => {
          this.planRefresh();
        })
      }
      if (refresh) {//从某些页面进来要进行初始化，从其他页面进来则不用，使用refresh参数判断
        this.planRefresh();
      }

    },
    mounted() {
      let st = this.$route.meta.scrollTo;
      if (st) {
        document.body.scrollTop = st.y;
      }
      let customerTome = this.$route.params.customer;
      let selectPrice=document.getElementById('selectPrice');  
      let totalPrice=document.getElementById('totalPrice');  
      if (customerTome && this.company.cpyID) {
        this.$store.dispatch("order/customer/request_custCpy").then(end => {
          let price = this.price;
          let city=this.city;
          let plan=this.plan;
          let order=this.order;
          price.type = end.isVip;
          this.$store.dispatch("order/price/price_select", price);
          let priceHtml=['市场价', '同行价', '成本价'][price.type]+(price.price_title?'('+price.price_title+')':'');
          selectPrice.innerHTML=priceHtml;      //解决默认选择价格数据无法同步dom操作
          let totalHtml= [
        ((price.sadultPrice||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum||0)+
        ((price.schildPrice||0)+city.sale_price+plan.otherBillPrice)*(order.chdNum||0)+
        ((price.sadultPrice1||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum1||0)+
        ((price.sadultPrice2||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum2||0)+
        ((price.schildPrice1||0)+city.sale_price+plan.otherBillPrice)*(order.chdNum1||0),
        ((price.adultPrice||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum||0)+
        ((price.childPrice||0)+city.sale_price+plan.otherBillPrice)*(order.chdNum||0)+
        ((price.adultPrice1||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum1||0)+
        ((price.adultPrice2||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum2||0)+
        ((price.childPrice1||0)+city.sale_price+plan.otherBillPrice)*(order.chdNum1||0),
        ((price.iadultPrice||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum||0)+
        ((price.ichildPrice||0)+city.sale_price+plan.otherBillPrice)*(order.chdNum||0)+
        ((price.iadultPrice1||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum1||0)+
        ((price.iadultPrice2||0)+city.sale_price+plan.otherBillPrice)*(order.aduNum2||0)+
        ((price.ichildPrice1||0)+city.sale_price+plan.otherBillPrice)*(order.chdNum1||0)
      ][price.type];
      totalPrice.innerHTML=totalHtml;
        });
      }
    },
    computed: {
      order() {
        return this.$store.getters["order/order_new"];
      },
      ordBak(){
        return this.$store.getters["order/pub_bast_text"];
      },
      planId() {
        return this.$store.getters["plan/plan_id"];
      },
      plan() {
        return this.$store.getters["plan/plan"];
      },
      customer() {
        return this.$store.getters["order/customer/customer"];
      },
      company() {
        return this.$store.getters["order/customer/company"];
      },
      debt() {
        return this.$store.getters["order/customer/customer_debt"];
      },
      type() {
        return this.$store.getters["order/order_type"];
      },
      city() {
        return this.$store.getters["order/city/city"];
      },
      price() {
        return this.$store.getters["order/price/price_select"];
      },
      sale() {
        return this.$store.getters["order/saler/sale"];
      },
      assistant() {
        return this.$store.getters["order/saler/assistant"];
      },
      mine() {
        let mine = this.$store.getters["mine/mine"];
        let jobs = new String(mine.jobs);
        if (jobs.indexOf('销售') >= 0) {
          mine.isSaleName = true;
        }
        return mine;
      },
      sys() {
        return this.$store.getters["sys/sys"];
      },
      priceSelect() {
        let price = this.price;
        return ['市场价', '同行价', '成本价'][price.type] + (price.price_title ? '(' + price.price_title + ')' : '');
      }
    },
    methods: {
      showPopup(i){
        this.popupStatus=!this.popupStatus;
        this.showWhich=i;
        if(i==2){
          this.$store.dispatch('order/pub_bast_text_request');
        }
      },
      ordBakChange(val) {
        let ordBak = "";
        ordBak = val.map(v => v);
        this.order.ordBak = ordBak.join();
      },
      planRefresh() {
        this.$store.dispatch("order/order_new_clear_listener");

        this.$store.dispatch("order/city/citys_request").then(_ => { //默认选择第一个城市
          let citys = this.$store.getters["order/city/citys"];
          if (citys.length) {
            this.$store.dispatch("order/city/city_select", citys[0]);
          }
        })

        this.$store.dispatch("order/price/prices_select_request").then(_ => { //默认选择第一个套餐的第一个价格
          let prices = this.$store.getters["order/price/prices_select"];
          if (prices.length) {
            let price = prices[0];
            if (price) {
              price.type = "0";
              this.$store.dispatch("order/price/price_select", price);
            }
          }
        })

        this.$store.dispatch("order/order_types_request").then(_ => { //默认选择第一个订单类型
          let types = this.$store.getters["order/order_types"];
          if (types.length) {
            this.$store.dispatch("order/order_type_select", types[0]);
          }
        })
      },
      placeOrder(t) {
        let order=this.order;
        let o = {
          planId: this.planId, //团期ID
          pub_fromcity_id: this.city.pub_fromcity_id, //联运城市对应的Id
          policyId: this.city.policy_id, //联运政策ID
          baseTransportCityId: this.city.transport_city_id, //联运城市ID
          fromCityId: this.city.fromCityID, //出发城市ID
          ordType: this.type.ID, //订单类型
          userType: this.price.type, //价格类型
          linePlanPriceId: this.price.ID, //价格套餐ID
          saleScore: this.order.saleScore, //销售积分
          saleSalary: this.order.saleSalary, //销售提成
          aduNum: this.order.aduNum, //成人
          chdNum: this.order.chdNum, //小童占床
          aduNum1: this.order.aduNum1, //小年轻
          aduNum2: this.order.aduNum2, //老人
          chdNum1: this.order.chdNum1, //小童不占床
          isTicket: this.order.isTicket ? 0 : 1, //是否占位
          cpyBaseId: this.customer.userID, //客户联系人id
          cpyId: this.customer.cpyID, //公司ID	313588
          ctName: this.customer.trueName, //客户联系人名称
          ctInfo: this.customer.mobile, //客户联系人手机号码
          saleId: this.sale.ID, //所属销售ID
          zhuliId: this.assistant.ID || 0, //所属助理ID
          ordBak: this.order.ordBak, //订单备注
          iordBak: this.order.iordBak, //自我备注
          // billBak: "", //账单备注
          // cpyTitle: null, //账单抬头
          // cpyTitleId	: null, //账单抬头id
          isTrueNum: t, //如果isTrueNum=1则是确认单，0为预留单
        };

        // console.log(o);

        //参数校验
        if (!o.planId) { Toast('团期不能为空'); return; }
        if (!o.cpyId) { Toast('请选择客户公司'); return; }
        if (!o.cpyBaseId) { Toast('请选择客户联系人'); return; }
        if (!o.ordType) { Toast('请选择订单类型'); return; }
        if (!o.userType || (o.linePlanPriceId == null)) { Toast('请选择价格类型'); return; }
        if (
          !o.pub_fromcity_id ||
          (o.policyId == null) ||
          (o.baseTransportCityId == null) ||
          !o.fromCityId
        ) {
          Toast('请选择出发城市'); return;
        }
        if (
          !o.aduNum &&
          !o.chdNum &&
          !o.aduNum1 &&
          !o.aduNum2 &&
          !o.chdNum1
        ) {
          // MessageBox.alert('请输入报名人数');return;
          Toast('请输入报名人数'); return;
        }
        if (!o.saleId) {
          o.saleId = this.mine.ID;
        }
        if (!o.saleId) {
          Toast('销售不能为空'); return;
        }
        let numReg=/[.]/g;

        if(numReg.test(order.aduNum) || numReg.test(order.chdNum) || numReg.test(order.aduNum1) || numReg.test(order.aduNum2) || numReg.test(order.chdNum1)){
          Toast('人数填写有误,人数不能为小数');
          return;
        }
        // let endNum=this.plan.endNum;
        // if(order.aduNum + order.chdNum + order.aduNum1 + order.aduNum2 +order.chdNum1>endNum ){
        //   Toast('人数填写有误,人数已超过余位');
        //   return;
        // }
        if(this.customer.mobile.length>12){
          Toast('联系手机有误');
          return;
        }
        Indicator.open({
          text: '正在下单...',
          spinnerType: 'fading-circle'
        });
        this.$store.dispatch("order/order_add", o).then((state) => {
          Indicator.close();
          if (state.success) {
            this.$store.dispatch("order/order_new_clear_listener", null, { root: true });
            this.$router.replace({ path: "/order-result", query: { isTrueNum: t } });
          } else {
            let errorCode = {
              "10001": "无效数据",
              "10002": "数据格式错误",
              "10003": "授权校验未通过",
              "10004": "参数错误",
              "10005": "文件类型不符",
              "10006": "上传文件失败",
              "11001": "余位不足",
              "11002": "无效的公司信息",
              "11003": "无效的开放方团期信息",
              "11004": "下单失败",
              "11005": "无效的订单人数",
              "11006": "客户欠款总额超过授信额度，订单状态将自动变更为预留单",
              "11007": "销售欠款总额超过授信额度，订单状态将自动变更为预留单",
              "11008": "订单信息异常",
              "11010": "订单类型不存在，已取消下单请求",
              "11011": "仅允许状态为正常的团才可以下单",
              "11012": "团期信息不存在",
              "11013": "对方版本太低，暂不支持下单!",
              "11014": "出发城市异常",
              "11015": "占位信息异常",
              "11016": "单位名称必须从系统中选择，否则不能添加!",
              "11017": "erpId信息无效",
              "11018": "当前下单人数过多，占位失败，请刷新重试!",
              "11019": "已存在的手机号码，请重试!",
              "11020": "团状态非正常",
              "11021": "非预留订单不允许修改人数",
              "11022": "对不起，共享计划的订单不能更改人数，请重新预订",
            }
            MessageBox.alert("下单失败,失败原因:" + (errorCode[state.code] || "网络错误")).then(() => {
              if (["11006", "11007"].indexOf(state.code + "") >= 0) {
                //下确认单时出现额度不足的情况，会自动下成预留单，转到预留单下单成功页面，即 isTrueNum = 0
                this.$store.dispatch("order/order_new_clear_listener", null, { root: true });
                this.$router.replace({ path: "/order-result", query: { isTrueNum: "0" } });
              }
            });
          }
        }).catch(err => {
          console.log(err);
          Indicator.close();
          Toast("下单失败");
        })
      },
      orderNumCheck(val, i) {
        let o = this.order;
        let k = ['aduNum', 'chdNum', 'aduNum1', 'aduNum2', 'chdNum1'][i];
        if (val < 0) {
          Toast({ message: "人数不能小于0" })
          o[k] = 0;
        }
        let num = Number(o.aduNum || 0) + Number(o.chdNum || 0) + Number(o.aduNum1 || 0) + Number(o.aduNum2 || 0) + Number(o.chdNum1 || 0)
        o.saleScoreNum = num;
        o.saleSalaryNum = num;
      },
      orderSaleNumCheck(val, i) {
        let o = this.order;
        let k = ['saleScoreNum', 'saleSalaryNum'][i];
        let num = Number(o.aduNum || 0) + Number(o.chdNum || 0) + Number(o.aduNum1 || 0) + Number(o.aduNum2 || 0) + Number(o.chdNum1 || 0)
        if (val < 0) {
          Toast("人数不能小于0")
          o[k] = 0;
        } else if (val > num) {
          Toast({ message: "人数不能大于总人数：" + num })
          o[k] = num;
        }
      },
      plaNav(v) {
        return { name: v, query: { id: this.planId } }
      }
    },
    watch: {
      "order.aduNum": function (val) {
        this.orderNumCheck(val, 0);
      },
      "order.chdNum": function (val) {
        this.orderNumCheck(val, 1);
      },
      "order.aduNum1": function (val) {
        this.orderNumCheck(val, 2);
      },
      "order.aduNum2": function (val) {
        this.orderNumCheck(val, 3);
      },
      "order.chdNum1": function (val) {
        this.orderNumCheck(val, 4);
      },
      "order.saleScoreNum": function (val) {
        this.orderSaleNumCheck(val, 0);
      },
      "order.saleSalaryNum": function (val) {
        this.orderSaleNumCheck(val, 1)
      },
    },
    beforeRouteLeave(to, from, next) {
      if (this.popupStatus) {
        this.popupStatus = !this.popupStatus;
        next(false);
      } else {
        next();
      }
    }
  }

</script>

<style>
  .order-place-block .my-button-block {
    text-align: center;
    padding-left: 40px;
    padding-right: 40px;
    padding-top: 0px;
  }
  
  .order-place-block .input-right .mint-cell-value input {
    text-align: right;
  }
</style>