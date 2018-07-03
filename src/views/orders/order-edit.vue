<template>
  <div class="order-info-block">
   <mt-header :title="'修改'+title" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div style="height:40px"></div>
    <my-block v-if="['isTicket','ordType','fromCity','customer','num','assist','sale'].indexOf(type)>=0"></my-block>

    <mt-cell title="占位" v-if="type=='isTicket'">
      <mt-switch v-model="isTicket"></mt-switch>
    </mt-cell>

    <router-link to="/order-type-select" class="router-link" v-if="type=='ordType'">
      <mt-cell title="订单类型" :value="ordType.cnName" is-link></mt-cell>
    </router-link>

    <div v-if="type=='fromCity'">
      <mt-cell title="原出发城市" :value="order.fromCityName"></mt-cell>
      <router-link to="/city-select" class="router-link">
        <mt-cell title="新出发城市" :value="city.fromCityName" is-link class="require-field"></mt-cell>
      </router-link>
    </div>
    <div v-if="type=='customer'">
      <router-link to="/order-company-search" class="router-link" >
        <my-cell title="客户公司" :value="customer.cpyName|| customer.simName || company.simName" is-link></my-cell>
      </router-link>
      <router-link to="/order-customer-search" class="router-link" >
        <my-cell title="联系人" :value="customer.trueName" is-link></my-cell>
      </router-link>
      <mt-field label="联系手机" v-model="customer.mobile" type="tel" class="input-right"></mt-field>
    </div>
    <div v-if="type=='num'">
      <mt-field label="成人" placeholder="请输入人数" type="number" v-model="num.aduNum"
      :attr="{
        min: 0
      }"
      ></mt-field>
      <mt-field label="小童占床" placeholder="请输入人数" type="number" v-model="num.chdNum"
      :attr="{
        min: 0
      }"
      ></mt-field>
      <mt-field :disabled="sys.con_adultPrice1_show==0" label="小年轻" placeholder="请输入人数" type="number" v-model="num.aduNum1"
      :attr="{
        min: 0
      }"
      ></mt-field>
      <mt-field :disabled="sys.con_adultPrice2_show==0" label="老人" placeholder="请输入人数" type="number" v-model="num.aduNum2"
      :attr="{
        min: 0
      }"
      ></mt-field>
      <mt-field :disabled="sys.con_childPrice1_show==0" label="小童不占床" placeholder="请输入人数" type="number" v-model="num.chdNum1"
      :attr="{
        min: 0
      }"
      ></mt-field>
    </div>

    <div v-if="type=='assist'">
      <mt-cell title="原销售助理" :value="order.assistName"></mt-cell>
      <router-link to="/saler-assistant-search" class="router-link" >
        <mt-cell title="选择销售助理" :value="assistant.userName" is-link class="require-field"></mt-cell>
      </router-link>
    </div>

    <div v-if="type=='sale'">
      <mt-cell title="原销售" :value="order.saleName"></mt-cell>
      <router-link to="/saler-search" class="router-link" >
        <mt-cell title="选择销售" :value="saler.userName" is-link class="require-field"></mt-cell>
      </router-link>
    </div>

    <div v-if="type=='iOrdBak'">
      <my-block bottom left>自我备注</my-block>
      <mt-field placeholder="请输入备注信息" type="textarea" rows="4" @change="lenLimit('iOrdBak')" v-model="iOrdBak"></mt-field>
    </div>
    <div v-if="type=='ordBak'">
      <my-block bottom left>订单备注</my-block>
      <mt-field placeholder="请输入备注信息" type="textarea" rows="4" @change="lenLimit('ordBak')" v-model="ordBak"></mt-field>
    </div>
    <div v-if="['isTicket','ordType','fromCity','customer','num','assist','sale'].indexOf(type)>=0">
      <my-block bottom left>变更说明</my-block>
      <mt-field placeholder="请输入变更说明" type="textarea" rows="4" @change="lenLimit('reason')" v-model="reason"></mt-field>
    </div>
    <div v-if="type=='fromCity'">
      <div class="define-tip-title">
        ※特别提示:
      </div>
      <div class="define-tip-content">
        修改出发城市后,账单金额不会发生变化,请前往手动修改！
      </div>
    </div>
    <my-button-block style="padding-top:40px;">
      <mt-button type="primary" size="large" @click.native="confirm">确定</mt-button>
    </my-button-block>
  </div>
</template>

<script>
import { MessageBox , Toast, Indicator} from 'mint-ui';

export default {
  data() {
    return {
      title: "",
      titles: {
        isTicket: "占位",
        ordType: "订单类型",
        fromCity: "出发城市",
        customer: "客户信息",
        num: "人数",
        assist: "助理",
        sale: "销售",
        iOrdBak: "自我备注",
        ordBak: "订单备注",
      },

      isTicket: null,
      num: {
        aduNum: null,
        aduNum1: null,
        aduNum2: null,
        chdNum: null,
        chdNum1: null,
      },
      iOrdBak: "",
      ordBak: "",

      reason: "",
    }
  },
  created() {
    let refresh = this.$route.params.refresh;


    if(refresh) {//从某些页面进来要进行初始化，从其他页面进来则不用，使用refresh参数判断
      let type = this.$route.params.type; //修改类型
      this.$store.dispatch("order/order_edit_type", type);
      this.refresh();
    }
    this.title = this.titles[this.type]||"";
  },
  computed: {
    reason() { //修改说明
      return this.$store.getters["order/order_edit_reason"];
    },
    type() { //修改说明
      return this.$store.getters["order/order_edit_type"];
    },
    order() {
      return this.$store.getters["order/order_select"];
    },
    customer() {
      return this.$store.getters["order/customer/customer"];
    },
    company() {
      return this.$store.getters["order/customer/company"];
    },
    ordType() {
      return this.$store.getters["order/order_type"];
    },
    city() {
      return this.$store.getters["order/city/city"];
    },
    saler() {
      return this.$store.getters["order/saler/sale"];
    },
    assistant() {
      return this.$store.getters["order/saler/assistant"];
    },
    sys() {
      return this.$store.getters["sys/sys"];
    },
  },
  methods: {
    confirm() {
      if(this.titles[this.type]) {
        let urls = {
          isTicket: "order/order-edit-placeholder", //修改占位
          ordType: "order/order-edit-type", //修改订单类型
          fromCity: "order/from-edit-city", //修改出发城市
          customer: "order/order-edit-cust-cpy",
          num: "order/order-edit-number", //修改人数
          assist: "order/order-edit-zhuli",
          sale: "order/order-edit-sale",
          iOrdBak: "order/order-edit-iorder",
          ordBak: "order/order-edit-order",
        }
        let url = urls[this.type];

        let vm = this;
        let query = {
          ordID	: vm.order.ordID, //	是	订单号	109064
          planCode	: vm.order.planCode, //	是	团号	T-170412-QZ
        }
        if(vm.reason) {
          query.reason = vm.reason;
        }
        let continued = true;
        let querys = {
          isTicket(){ //修改占位
            Object.assign(query, {
              isTicket	: vm.isTicket?0:1, //	是	0占 1不占	0
            })
          },
          ordType() { //修改订单类型
            if(vm.ordType.ID) {
              Object.assign(query, {
                ordType	: vm.ordType.ID, //	是	订单类型id	10003
              })
            } else {
              Toast("请选择新的订单类型");
              continued = false;
            }
          },
          fromCity() { //修改出发城市
            console.log(vm.city.transport_city_id);
            console.log(vm.city.fromCityName);
            if(vm.city.transport_city_id&&vm.city.fromCityName) {
              Object.assign(query, {
                oldFromCityID	: vm.order.fromCityID, //	是	原出发城市id	10130
                oldFromCityName	: vm.order.fromCityName, //	是	原出发城市名称	台湾省
                newFromCityID	: vm.city.transport_city_id, //	是	新出发城市id	-1
                newFromCityName	: vm.city.fromCityName, //	是	新出发城市名称	台湾省
              })
            } else {
              Toast("请选择新的出发城市");
              continued = false;
            }
          },
          customer(){ //修改客户
            Object.assign(query, {
              cpyID	: vm.customer.cpyID ,//	是	公司id	1
              ctName	: vm.customer.trueName ,//	是	联系人姓名	哈哈哈
              ctInfo	: vm.customer.mobile ,//	是	联系人信息	13569286325
              userID	: vm.customer.userID ,//	是	用户id	105469
            })
          },
          num() { //修改人数
            Object.assign(query, {
              newAduNum	: vm.num.aduNum, //	是	成人数量	1
              newChdNum	: vm.num.chdNum, //	是	小童数	0
              newAduNum1	: vm.num.aduNum1, //	是	小年轻	0
              newAduNum2	: vm.num.aduNum2, //	是	老人	0
              newChdNum1	: vm.num.chdNum1, //	是	小童不占床	0
              oldAduNum	: vm.order.aduNum, //	是	成人数量	1
              oldChdNum	: vm.order.chdNum, //	是	小童数	0
              oldAduNum1	: vm.order.aduNum1, //	是	小年轻	0
              oldAduNum2	: vm.order.aduNum2, //	是	老人	0
              oldChdNum1	: vm.order.chdNum1, //	是	小童不占床	0
            })
          },
          assist() { //修改助理
            if(vm.assistant.ID) {
              Object.assign(query, {
                oldAsstID	: vm.order.zhuliID ,//	是	原销售id	1003
                oldAsstName	: vm.order.assistName ,//	是	原销售名称	刘佳俊_
                newAsstID	: vm.assistant.ID ,//	是	新销售id	1013
              });
            } else {
              Toast("请选择新的销售助理");
              continued = false;
            }
          },
          sale() { //修改销售
            if(vm.saler.ID) {
              Object.assign(query, {
                oldSaleID	: vm.order.saleID ,//	是	原销售id	1003
                oldSaleName	: vm.order.saleName ,//	是	原销售名称	刘佳俊_
                newSaleID	: vm.saler.ID ,//	是	新销售id	1013
              });
            } else {
              Toast("请选择新的销售");
              continued = false;
            }
          },
          iOrdBak() { //修改自我备注
            Object.assign(query, {
              iOrdBak	: vm.iOrdBak ,//	是		453453
            })
          },
          ordBak() { //修改订单备注
            Object.assign(query, {
              ordBak	: vm.ordBak ,//	否	备注信息
            })
          },
        }
        querys[this.type]();
        if(!continued) return;

        Indicator.open({
          text: '正在操作...',
          spinnerType: 'fading-circle'
        });
        this.$http.post(
          url,
          query,
          {emulateJSON: true}
        ).then(res => {
          if(!res.body) return;
          let state = res.body;
          return state;
        }).then(state=>{
          Indicator.close();
          if(state.success) {
            Toast("操作成功");
            this.$router.go(-1);
          } else {
            Toast(state.msg||"操作失败");
          }
        }).catch(err => {
          console.log(err);
          Indicator.close();
          Toast("网络错误");
        })
      } else {
        Toast("错误的订单修改方式");
      }
    },
    lenLimit(type) {
      let lentxt = this[type];
      if(lentxt&&lentxt.length>100) {
        this[type] = lentxt.slice(0, 100);
      }
    },
    refresh() {
      this.$store.dispatch("order/order_new_clear_listener"); //清空缓存
      this.$store.dispatch("plan/plan_select", {id: this.order.planID});

      this.$store.reason = "";
      this.isTicket = !this.order.isTicket;

      this.num.aduNum = this.order.aduNum;
      this.num.aduNum1 = this.order.aduNum1;
      this.num.aduNum2 = this.order.aduNum2;
      this.num.chdNum = this.order.chdNum;
      this.num.chdNum1 = this.order.chdNum1;

      this.iOrdBak = this.order.iOrdBak;
      this.ordBak = this.order.ordBak;

      this.customer.cpyName = this.order.userCpyName;
      this.customer.trueName = this.order.ctName;
      this.customer.mobile = this.order.ctInfo;

      this.ordType.cnName = this.order.ordType;
    },
    orderNumCheck(val, i) {
      let o = this.num;
      let k = ['aduNum','chdNum','aduNum1','aduNum2','chdNum1'][i];
      if(val < 0) {
        Toast({message: "人数不能小于0"})
        o[k] = 0;
      }
    },
  },
  watch: {
    "num.aduNum": function(val) {
      this.orderNumCheck(val, 0);
    },
    "num.chdNum": function(val) {
      this.orderNumCheck(val, 1);
    },
    "num.aduNum1": function(val) {
      this.orderNumCheck(val, 2);
    },
    "num.aduNum2": function(val) {
      this.orderNumCheck(val, 3);
    },
    "num.chdNum1": function(val) {
      this.orderNumCheck(val, 4);
    },
  }
}
</script>

<style>
.define-tip-title{
  color:#f00;
  text-align: center;
  line-height: 16px;
  font-size: 13px;
  margin-top: 40px;
}
.define-tip-content{
  color:orangered;
  text-align: center;
  line-height: 16px;
  font-size: 13px;
}
</style>
