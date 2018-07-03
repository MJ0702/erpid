<template>
  <div>
    <mt-header title="转团" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div style="height:40px"></div>

    <my-block bottom left>基本信息</my-block>
    <mt-cell title="订单号">
      <span>{{order.ID||order.ordID}}</span>
      (
      <span style="color: #0386CA" v-if="order.isOK==1&&order.suretyID<=0">已确认</span>
      <span style="color: #0386CA" v-else-if="order.isOK==1&&order.suretyID>0">已担保</span>
      <span style="color: green" v-else-if="order.isOK==0">预留中</span>
      <span style="color: gray" v-else-if="order.isOK==-4">已清位</span>
      <span style="color: gray" v-else-if="order.isOK==-2">已撤销</span>
      <span style="color: black" v-else-if="order.isOK==-3">已取消</span>
      )
    </mt-cell>
    <mt-cell title="产品团号" :value="order.planCode"></mt-cell>
    <mt-cell title="出团日期" :value="DateFmt(order.planDate, 'yyyy-MM-dd')"></mt-cell>
    <mt-cell title="占位情况" :value="['占位','不占位'][order.isTicket]"></mt-cell>
    <mt-cell title="订单人数" :value="order.perNum"></mt-cell>
    <mt-cell title="到期时间" :value="DateFmt(order.endTime, 'yyyy-MM-dd hh:mm')" v-if="order.isOK=='0'"></mt-cell>

    <my-block bottom left>转团信息</my-block>
    <mt-cell title="当前团号" :value="order.planCode"></mt-cell>
    <mt-cell title="团期状态" >
      <span style="color: green" v-if="order.isLock=='0'&&order.endNum>0">正常</span>
      <span style="color: red" v-else-if="order.isLock=='0'&&order.endNum<=0&&(order.stayNum+order.the_union_stay_num)>0">暂满</span>
      <span style="color: orange" v-else-if="order.isLock=='0'&&order.endNum<=0">满员</span>
      <span style="color: black" v-else-if="order.isLock=='1'">停售</span>
      <span style="color: blue" v-else-if="order.isLock=='2'">候补</span>
      <span style="color: red" v-else-if="order.isLock=='3'">售罄</span>
      <span style="color: orange" v-else-if="order.isLock=='4'">封团</span>
      <span style="color: orange" v-else-if="order.isLock=='9'">审结</span>
      <span style="color: gray" v-else-if="order.isLock=='-1'">取消</span>
      <span v-else></span>
    </mt-cell>
    <router-link to="{name: 'order-turn-plan-list'}" replace>
      <mt-cell title="新团号" is-link>
        {{plan.planCode+' (余位 : '+plan.endNum+') '}}
      </mt-cell>
    </router-link>

    <my-block bottom left>申请说明</my-block>
    <mt-field placeholder="请输入转团申请说明" type="textarea" rows="4" v-model="remark"></mt-field>
    <my-button-block style="margin-top:20px;">
      <mt-button type="primary" size="large" @click.native="turnPlan">提交</mt-button>
    </my-button-block>
  </div>
</template>

<script>
import { MessageBox , Toast, Indicator} from 'mint-ui';

export default {
  data() {
    return {
    }
  },
  computed: {
    order() {
      return this.$store.getters["order/order_select"];
    },
    plan() {
      return this.$store.getters["order/plan/turn_plan"];
    },
    remark() {
      return this.$store.getters["order/plan/turn_plan_remark"];
    },
  },
  created() {

  },
  methods: {
    turnPlan() {
      Indicator.open({
        text: '正在操作...',
        spinnerType: 'fading-circle'
      });
      this.$http.post(
        "",
        {
        },
        {emulateJSON: true}
      ).then(res => {
        if(!res.body) {return;}
        let result = res.body;
        Indicator.close();
        if(result.success) {
          Toast("操作成功");
        } else {
          MessageBox.alert(result.msg);
        }
      }).catch(err => {
        console.log(err);
        Indicator.close();
        Toast("网络错误");
      })
    }
  }
}
</script>

<style scoped>
.operate {
  height: 100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: -1px;
  right: 0;
  left: 0;
}
.operate .row1 {
  background-color: rgba(228, 228, 228, 0.5);
  text-align: right;
  line-height: 20px;
  height: 20px;
  padding: 10px;
}
.operate .row2 {
  height: 60px;
  width: 100%;
  display: flex;
}
.operate .refuse {
  background-color: #E4E4E4;
  flex: 1;
  text-align: center;
  line-height: 60px;
}
.operate .consent {
  background-color: #26a2ff;
  color: #fff;
  flex: 1;
  text-align: center;
  line-height: 60px;
}

.refuse-remark {
  margin-left: 12px;
  margin-right: 12px;
}
</style>
