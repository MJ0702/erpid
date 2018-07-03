<template>
  <my-error v-if="errored" :errorCode="errorCode" :errorMsg="errorMsg" :sysName="sysName" :domain="domain"></my-error>
  <div v-else>
    <mt-header :title="title" fixed>
      <!-- <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a> -->
    </mt-header>
    <div style="height:40px"></div>

    <my-block bottom left>基本信息</my-block>
    <mt-cell title="订单号" :value="order.ID||order.ordID"></mt-cell>
    <mt-cell title="订单状态">
      <span style="color: #0386CA" v-if="order.isOK==1&&order.suretyID<=0">已确认</span>
      <span style="color: #0386CA" v-else-if="order.isOK==1&&order.suretyID>0">已担保</span>
      <span style="color: green" v-else-if="order.isOK==0">预留中</span>
      <span style="color: gray" v-else-if="order.isOK==-4">已清位</span>
      <span style="color: gray" v-else-if="order.isOK==-2">已撤销</span>
      <span style="color: black" v-else-if="order.isOK==-3">已取消</span>
    </mt-cell>
    <mt-cell title="产品团号" :value="order.planCode"></mt-cell>
    <mt-cell title="出团日期" :value="DateFmt(order.planDate, 'yyyy-MM-dd')"></mt-cell>
    <mt-cell title="占位情况" :value="['占位','不占位'][order.isTicket]"></mt-cell>
    <mt-cell title="订单人数" :value="order.perNum"></mt-cell>
    <mt-cell title="到期时间" :value="DateFmt(order.endTime, 'yyyy-MM-dd hh:mm')" v-if="order.isOK=='0'"></mt-cell>

    <div v-if="models.indexOf('group')>=0">
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
      <mt-cell title="新团号" :value="order.ordRecNow"></mt-cell>
      <my-cell title="申请说明" class="newline" :value="order.ordRecPay"></my-cell>
    </div>

    <my-block bottom left>订单金额</my-block>
    <mt-cell title="账单总额" :value="NumFmt(order.amount)"></mt-cell>
    <mt-cell title="已收款" :value="NumFmt(order.pingAmount)"></mt-cell>
    <mt-cell title="未收款" :value="NumFmt(order.pingAmountNo)"></mt-cell>

    <my-block bottom left>客户信息</my-block>
    <my-cell title="客户公司" :value="order.userCpyName"></my-cell>
    <mt-cell title="客户联系人" :value="order.ctName"></mt-cell>
    <mt-cell title="联系人手机" :value="order.ctInfo"></mt-cell>

    <my-block bottom left v-if="order.ordBak">备注信息</my-block>
    <my-cell title="订单备注" v-if="order.ordBak" :value="order.ordBak"></my-cell>

    <my-block bottom left v-if="order.saleName||order.assistName||order.admName">人员信息</my-block>
    <mt-cell title="销售人员" v-if="order.saleName" :value="order.saleName"></mt-cell>
    <mt-cell title="助理人员" v-if="order.assistName" :value="order.assistName"></mt-cell>
    <mt-cell title="创建人员" v-if="order.admName" :value="order.admName"></mt-cell>

    <my-block></my-block>
    <mt-cell title="下单时间" :value="DateFmt(order.addTime, 'yyyy-MM-dd hh:mm')"></mt-cell>

    <div style="height:100px" v-if="operation=='all'"></div>
    <div style="height:10px" v-else></div>

    <div class="operate" v-if="operation=='all'">
      <div class="row1" v-if="showamount">
        <span>剩余额度：</span><span style="color:red;">{{(order.SaleMaxMoney||0)-(order.SalePingAmountNos||0)}} 元</span>
      </div>
      <div class="row2">
        <!-- 默认不允许执行操作，由父组件控制可操作状态 -->
        <div class="refuse"  @click="popupStatus=!popupStatus">
          拒绝
        </div>
        <div class="consent" @click="orderSwitch(consenturl)">
          同意
        </div>
      </div>
    </div>
    <mt-header title="拒绝" fixed v-if="popupStatus" style="z-index:2100">
      <a slot="left">
        <mt-button icon="back" @click="popupStatus=!popupStatus">返回</mt-button>
      </a>
    </mt-header>
    <mt-popup v-model="popupStatus"  popup-transition="popup-fade" position="right" class="my-popup-right">
      <div style="height:40px"></div>
      <my-block bottom left>拒绝理由</my-block>
      <mt-field placeholder="请输入拒绝理由" type="textarea" rows="4" v-model="remark" class="refuse-remark"></mt-field>
      <my-button-block style="margin-top:20px;">
        <mt-button type="primary" size="large" @click.native="popupStatus=!popupStatus,orderSwitch(refuseurl)">确认拒绝</mt-button>
      </my-button-block>
    </mt-popup>

  </div>
</template>

<script>
import { MessageBox , Toast, Indicator} from 'mint-ui';
import MyError from './error.vue'

export default {
  data() {
    return {
      order:{},
      popupStatus: false,
      remark: "",
      errored: false,
      errorCode: "",
      errorMsg: "",
      sysName: "",
      domain: "",
      operation: "none",
      myJson: {},
    }
  },
  computed: {
  },
  created() {
    this.noticeQueryHandler();
  },
  methods: {
    orderSwitch(path) {
      //审批同意或拒绝，请求不同url
      console.log(this.remark);
      Indicator.open({
        text: '正在操作...',
        spinnerType: 'fading-circle'
      });
      let {id, key, data} = this.myJson;
      if(id&&key&&data) {
        let query = {
          id,
          key,
          data: JSON.stringify(data),
        }
        if(this.remark) {
          query.remark = this.remark;
        }
        this.$http.post(
          path,
          query,
          {emulateJSON: true}
        ).then(res => {
          if(!res.body) {return;}
          let result = res.body;
          Indicator.close();
          if(result.success) {
            this.noticeQueryHandler(); //重新请求下数据
            Toast("操作成功");
          } else {
            MessageBox.alert("操作失败，失败原因："+result.msg||"网络错误");
          }
        }).catch(err => {
          console.log(err);
          Indicator.close();
          Toast("网络错误");
        })
      }
    },
    noticeQueryHandler() {
      let {j} = this.$route.query;
      let myjson;
      try {
        myjson = JSON.parse(j);
        if (myjson.data) {
          let data = myjson.data.replace(/\./g,'%');
          myjson.data = JSON.parse(decodeURI(data));
        }
      } catch (e) {
        console.error(e);
        this.toErrored(true, {
          errorCode: "消息通知有效性验证失败",
          errorMsg: "消息格式有误",
        });
        return;
      }
      if (myjson) {
        this.myJson = myjson;
        let {id, key, data} = this.myJson;
        //获取请求参数，发送给服务器，进行参数(确保参数正确)验证
        let dataJSON = data;
        if(id&&key&&data) {
          this.$http.post(
            this.orderurl,
            {
              id,
              key,
              data: JSON.stringify(data),
            },
            {emulateJSON: true}
          ).then(res => {
            if(!res.body) {return;}
            let result = res.body;
            if(result&&result.success==false&&result.msg) {
              //验证失败，跳转到错误页面
              MessageBox.alert(result.msg).then(()=>{
                this.toErrored(true, {
                  errorCode: "消息通知有效性验证失败",
                  errorMsg: result.msg,
                });
              });
              return;
            }
            if(result.rows&&result.rows[0]) {
              this.order = result.rows[0];
              if(this.allow(this.order)) { //判断订单状态是否为可操作状态
                this.operation = "all"
                //查询销售欠款额度
                this.$http.post(
                  "order/debt-amount",
                  {
                    query: dataJSON.opID,
                  },
                  {emulateJSON: true}
                ).then(res => {
                  if(!res.body) return;
                  let debt = res.body;
                  this.$set(this.order, "SalePingAmountNos", debt.SalePingAmountNos);
                  this.$set(this.order, "SaleMaxMoney", debt.SaleMaxMoney);
                })
              } else {
                this.operation = "none"
              }
            } else {
              Toast("订单不存在");
            }
          }).catch(err => {
            console.log(err);
            Toast("网络错误");
          })
        }
      }

    },
    toErrored(status, body) {
      if(body) {
        this.errored = status;
        this.errorCode = body.errorCode||"网络错误";
        this.errorMsg = body.errorMsg||"请检查网络并退出后重试";
        this.sysName = body.sysName||"";
        this.domain = body.domain||"";
      }
    },
    prepareToExit() {
      this.popupStatus = !this.popupStatus;
      return !this.popupStatus;
    },
  },
  watch: {
  },
  components: {
    "my-error": MyError,
  },
  props:{
    title: {
      type: String,
      default: "",
    },
    orderurl: {
      type: String,
      default: "",
    },
    refuseurl: {
      type: String,
      default: "",
    },
    consenturl: {
      type: String,
      default: "",
    },
    allow: {
      type: Function
    },
    showamount: {
      type: Boolean,
      default: true,
    },
    models: {
      type: Array,
      default: [],
    }
  }
}
</script>

<style scoped>
.operate {
  height: auto;
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
  height: 20px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
