<template>
  <!-- 银行账户 -->
  <div style="padding-bottom:50px">
    <mt-header title="请款审核" fixed>
    </mt-header>
    <div class="blank" style="height:40px"></div>
    <mt-cell title="财务编号" class="my-first-cell" :value="bill.finId"></mt-cell>
    <mt-cell title="请款类型" class="my-first-cell" :value="bill.tags"></mt-cell>
    <my-cell title="团号" :value="bill.planCodes"></my-cell>
    <my-block></my-block>
    <mt-cell title="可请金额" :value="bill.pingTheAmountNo"></mt-cell>
    <mt-cell title="请款金额" :value="bill.theAmount"></mt-cell>
    <my-cell class="newline" title="请款人" :value="bill.admName"></my-cell>
    <my-cell class="newline" title="收款方" :value="bill.cpyName"></my-cell>
    <my-block bottom left>审核状态</my-block>
    <yd-accordion class="demo-small-pitch">
      <yd-accordion-item :class="item.sign ? 'accordion-sign' : ''" :title="item.stepName" :value="item.steps.length == 0 ? '等待中': item.stepName +'中'"
        v-for="item in stepInfo" v-if="item.steps.length !=0 || item.sign">
        <div style="padding: .24rem;" v-if="!item.sign">
          <yd-timeline class="demo-small-pitch">
            <yd-timeline-item>
              <p>{{bill.addTime}}　初审通过</p>
            </yd-timeline-item>
            <yd-timeline-item v-for="step in steps">
              <p v-if="step.admName==''" style="color: #00CC33;">{{step.time}}　{{step.tags}}</p>
              <p v-else-if="step.nextAdmName==null" style="color: #6e6e6e;">{{step.time}}　【{{step.admName}}】 {{step.tags}}</p>
              <p v-else style="color: #6e6e6e;">{{step.time}}　【{{step.admName}}】核对加签,并转交 {{step.nextAdmName}}进行审核</p>
              <!-- <p style="margin-top: 10px;">2017-08-18 08:24:18</p> -->
            </yd-timeline-item>
          </yd-timeline>
        </div>
      </yd-accordion-item>
    </yd-accordion>
    <my-block></my-block>
    <mt-cell title="请款时间" :value="DateFmt(bill.addTime,'yyyy-MM-dd hh:mm')"></mt-cell>
    <my-block></my-block>
    <mt-cell title="付款信息" @click.native="goInfo" is-link></mt-cell>
    <my-button-block v-if="bill.isCan>0 && bill.isCan < 51 && !auditFalse" fixed style="padding: 0;z-index: 10">
      <mt-button class="half-button" type="primary" @click.native="btnAudit" size="large">审核</mt-button>
      <mt-button class="half-button" type="primary" @click.native="popupStatus=!popupStatus" size="large">拒绝</mt-button>
    </my-button-block>
    <mt-header title="拒绝" fixed v-if="popupStatus" style="z-index:2101">
      <a slot="left">
        <mt-button icon="back" @click="popupStatus=!popupStatus">返回</mt-button>
      </a>
    </mt-header>
    <mt-popup v-model="popupStatus" popup-transition="popup-fade" position="right" class="my-popup-right">
      <div style="height:40px"></div>
      <!--更多信息-->
      <my-block></my-block>
      <mt-cell title="拒绝方式" @click.native="rejectPopupStatus=!rejectPopupStatus" :value="rejectWay" is-link></mt-cell>
      <my-block bottom left>拒绝理由</my-block>
      <mt-field label="" placeholder="点击输入拒绝理由" type="textarea" v-model="reason" rows="4"></mt-field>
      <my-pad></my-pad>
      <div style="padding:15px">
        <mt-button v-if="rejectWay!='请选择拒绝的退回方式'" type="primary" @click.native="fnReject" size="large">提交</mt-button>
        <mt-button v-else type="primary" disabled size="large">提交</mt-button>
      </div>
    </mt-popup>
    <!-- 拒绝方式下方弹出 -->
    <mt-popup v-model="rejectPopupStatus" position="bottom" class="my-popup">
      <mt-picker :slots="reject" @change="rejectChange" showToolbar visibleItemCount="3">
        <span class="mint-datetime-action mint-datetime-cancel" @click="rejectPopupStatus=!rejectPopupStatus">取消</span>
        <span class="mint-datetime-action mint-datetime-confirm" @click="rejectConfirm">确认</span>
      </mt-picker>
    </mt-popup>
    <!-- 加审人下方弹出 -->
    <mt-popup v-model="nextPopupStatus" position="bottom" class="my-popup">
      <mt-picker :slots="nextUser" @change="nextChange" showToolbar visibleItemCount="7">
        <span class="mint-datetime-action mint-datetime-cancel" @click="nextPopupStatus=!nextPopupStatus">取消</span>
        <span class="mint-datetime-action mint-datetime-confirm" @click="nextConfirm">确认</span>
      </mt-picker>
    </mt-popup>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {
    Toast,
    MessageBox
  } from 'mint-ui';
  export default {
    data() {
      return {
        bill: {},
        // reject:[
        //   {
        //   label:-2,
        //   value:'退回录入人'
        //   },
        //   {
        //   label:-1,
        //   value:'退回上一级'
        //   },
        // ],
        rejectWay: '请选择拒绝的退回方式',
        rejectSelect: '',
        popupStatus: false,
        rejectPopupStatus: false,
        nextPopupStatus: false,
        reason: '',
        rejectType: {
          '退回录入人': -2,
          '退回上一级': -1,
        },
        stepInfo: [],
        steps: [],
        nextUser: [{
          flex: 1,
          values: ['1', '2', '3', '4', '5', '6'],
          className: 'slot',
          defaultIndex: [1, 2, 3, 4, 5, 6].indexOf(1)
        }],
        nextUserData: [],
        nextWay: '',
        nextSelect: '',
        myJson: {},
        auditFalse: false, //是否审核的状态  审核完后不能再审  false可审  true 不可审
        errored: false,
        errorCode: "",
        errorMsg: "",
        sysName: "",
        domain: "",
      }
    },
    created() {
      let {
        j
      } = this.$route.query;
      let myjson;
      try {
        myjson = JSON.parse(j);
        if (myjson.data) {
          let data = myjson.data.replace(/\./g, '%');
          myjson.data = JSON.parse(decodeURI(data));
          this.myJson = myjson;
        }
      } catch (e) {
        this.toErrored(true, {
          errorCode: "消息通知有效性验证失败",
          errorMsg: "消息格式有误",
        });
      }
      this.fnInit();
    },
    computed: {
      reject() {
        return [{ //团期类型选择项
          flex: 1,
          values: ['退回录入人', '退回上一级'],
          className: 'slot',
          defaultIndex: [-2, -1].indexOf(-2),
        }]
      },
    },
    methods: {
      fnInit() {
        // let data = {};
        // let finID = this.finID;
        // data.fin_data_id = finID;
        // data.finID = finID;
        let {
          id,
          key,
          data
        } = this.myJson;
        if (id && key && data) {
          Vue.http.post(
            "request-money/get-bill", {
              id,
              key,
              data: JSON.stringify(data),
            }, {
              emulateJSON: true
            }
          ).then(res => {
            if (!res.body) return;
            this.bill = res.body;
            if (this.bill.isCan >= 51) {
              Toast('审核流程已结束,只能查看');
            }
            if (this.bill.isCan <= 0) {
              Toast('您没有修改这条数据的权限，本次仅能查看');
            }

          })
          Vue.http.post(
            "request-money/get-step-info", {
              id,
              key,
              data: JSON.stringify(data),
            }, {
              emulateJSON: true
            }
          ).then(res => {
            if (!res.body) return;
            if(res.body.success===false){
              // Toast(res.body.msg);
              return;
            }
            if (typeof res.body == 'object') {
              let stepInfo = res.body;
              let sign;
              stepInfo.forEach(x => {
                if (x.steps.length > 0) {
                  sign = x.stepID;
                  x.steps.reverse();
                  this.steps = x.steps;
                }
                if (sign && x.stepID > sign) {
                  x.sign = true; //是否显示审核状态
                }
              })
              this.stepInfo = stepInfo;
            }
          })
        }


      },
      toErrored(status, body) {
        if (body) {
          this.errored = status;
          this.errorCode = body.errorCode || "网络错误";
          this.errorMsg = body.errorMsg || "请检查网络并退出后重试";
          this.sysName = body.sysName || "";
          this.domain = body.domain || "";
        }
      },
      goInfo() {
        let {
          id,
          key,
          data
        } = this.myJson;
        this.$router.push({
          name: 'funds-info',
          query: {
            finID: id
          }
        })
      },
      //拒绝按钮
      fnReject() {
        this.fnAudit(2);
      },
      //审核按钮
      btnAudit() {
        MessageBox.confirm('是否选择其他人员加审？', '提示', {
          confirmButtonText: '直接通过',
          cancelButtonText: '选择加审'
        }).then(action => { //confirm  //直接通过
          this.fnAudit(1);
        }, action => { //cancel  //加审
          Vue.http.post(
            "request-money/get-nextAdm", {
              emulateJSON: true
            }
          ).then(res => {
            if (!res.body) return;
            let result = res.body.rows;
            let values = [];
            let defaultIndex = [];
            let nextUserData = {}; //加审人对象  属性 加审人 值 加审人ID
            result.forEach(x => {
              values.push(x.nextAdmName);
              defaultIndex.push(x.nextAdmID);
              nextUserData[x.nextAdmName] = x.nextAdmID
            })
            this.nextUserData = nextUserData;
            this.nextUser[0].values = values;
            this.nextUser[0].defaultIndex = defaultIndex.indexOf(defaultIndex[3]);
            this.nextPopupStatus = true;   //加审人显示
          })
        })
      },
      //审核  result 1审核通过,-1拒绝审核(到上一级),-2拒绝审核(直接返回到提交人)
      //nextAdmID 加审人ID
      fnAudit(arg, nextAdmID) {
        let datas = {};
        let {
          id,
          key,
          data
        } = this.myJson;
        datas.ids = id;
        datas.key = key;
        datas.data = JSON.stringify(data);
        if (arg == 1) {
          datas.result = arg;
          datas.nextAdmID = nextAdmID || '';
          datas.reason = '';
        } else {
          datas.result = this.rejectType[this.rejectWay];
          datas.reason = this.reason;
        }
        Vue.http.post(
          "request-money/check-result",
          datas, {
            emulateJSON: true
          }
        ).then(res => {
          if (!res.body) return;
          let result = res.body;
          if (result.success) {
            this.auditFalse = true;
            this.popupStatus = false;
            this.fnInit();
            Toast('操作成功');
          } else {
            Toast('审核失败');
          }

        })
      },
      rejectChange(e, v) {
        // this.rejectWay = v[0];
        this.rejectSelect = v[0];
      },
      rejectConfirm() {
        this.rejectWay = this.rejectSelect;
        this.rejectPopupStatus = false;
      },
      nextChange(e, v) {
        // this.rejectWay = v[0];
        this.nextSelect = v[0];
      },
      nextConfirm() {
        this.nextWay = this.nextSelect;
        this.nextPopupStatus = false;  //加审人列表隐藏
        let nextAdmID = this.nextUserData[this.nextWay]; //获得加审人ID
        this.fnAudit(1, nextAdmID);   
      }
    },
    components: {

    },
    beforeRouteLeave(to, from, next) {
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
      next();
    }
  }
</script>

<style>
  .half-button {
    width: 50%;
    float: left;
    border-radius: 0;
  }

  .half-button:nth-of-type(2) {
    background: hsla(36, 100%, 50%, 0.776470588235294)
  }

  .yd-accordion-title {
    line-height: 40px;
    font-size: 14px;
  }

  .accordion-sign>.yd-accordion-title>i::after {
    display: none;
  }

  .yd-timeline:after {
    border-top: 0;
  }

  .yd-timeline-content {
    border: 0;
  }

  .yd-accordion-title>span {
    font-size: 14px;
  }

  .yd-timeline-content>li:first-child:after {
    content: "";
    width: 1px;
    height: 100%;
    background-color: #e4e5e9;
    position: absolute;
    left: -17px;
    top: 19px;
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
  }

  .yd-timeline-content>li:before {
    content: "";
    width: 1px;
    height: 100%;
    background-color: #e4e5e9;
    position: absolute;
    left: -17px;
    top: 19px;
  }

  .yd-timeline-content>li:before {
    background-color: #e4e5e9;
  }

  .yd-timeline-content>li:not(:last-child):after {
    border: 0;
  }

  .yd-timeline-content>li {
    list-style: none;
    padding: 6px 12px 6px 0;
    margin-left: 0;
  }

  .yd-timeline-content>li:first-child:before {
    background-color: #e4e5e9;
  }

  .yd-timeline-content>li:first-child>em {
    background-color: #e4e5e9;
    width: 6px;
    height: 6px;
  }

  .yd-accordion-title>i:after {
    -webkit-transform: rotate(-180deg)!important;
    transform: rotate(-180deg)!important;
  }

  .yd-accordion-title>i.accordion-rotated:after {
    -webkit-transform: rotate(0deg)!important;
    transform: rotate(0deg)!important;
  }
</style>