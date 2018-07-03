<template>
  <div>
    <mt-header title="确认书" fixed>
      <!-- <router-link to="/saler-info" @click.native="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link> -->
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
      <!-- <mt-button slot="right" @click.native="$router.go(-1)">取消</mt-button> -->
    </mt-header>
    <div style="height:40px"></div>

    <my-block></my-block>
    <mt-cell v-if="fnTitle" title="常用数据" :value="fnTitle" placeholder="常用数据" :to="toModule('confirm-commonly')" is-link>

    </mt-cell>
    <mt-cell v-else title="常用数据" value="请选择" :to="toModule('confirm-commonly')" is-link>
    </mt-cell>
    <mt-field label="文档名称" class="input-text-right" v-model="fnConfig.filename"></mt-field>
    <my-cell title="选中模板" v-if="PermitCheck('order/confirmation-template')" :value="confirmTemp.fileName" placeholder="请选择模板"
      is-link :to="toModule('confirm-template')"></my-cell>
    <my-cell title="账单抬头" v-show="billShow" v-if="fnConfig.erpName" :value="fnConfig.erpName" :to="toModule('confirm-bill-title')" is-link>
    </my-cell>
    <my-cell title="账单抬头" v-show="billShow" v-else value="请选择账单抬头" :to="toModule('confirm-bill-title')" is-link>
    </my-cell>
    <my-cell title="收款账号" v-if="fnConfig.accBank" class="require-field" :to="toModule('confirm-base-account')" :value="fnConfig.accBank"
      is-link></my-cell>
    <my-cell title="收款账号" v-else class="require-field" :to="toModule('confirm-base-account')" value="请选择收款账号" is-link></my-cell>
    <my-cell title="交通信息" :to="toModule('confirm-jiaotong')" class="input-text-right" is-link>
      <input type="text" @click.stop.prevent class="mint-field-core" v-model="fnConfig.jiaotong" placeholder="请选择或输入">
    </my-cell>
    <my-block></my-block>
    <mt-cell title="扫码收款" :value="confirm_search_query.moneyTypes" @click.native="TypeClick" placeholder="请选择类型" is-link></mt-cell>
    <mt-field label="金额 ( CNY )" type="number" v-if="confirm_search_query.moneyTypes=='指定金额'" class="input-text-right" v-model="confirm_search_query.money"
      placeholder="请输入金额"></mt-field>
    <mt-cell title="金额 ( CNY )" v-else="confirm_search_query.moneyTypes=='不指定金额'" class="input-text-right" value="客户扫码设定"></mt-cell>
    <mt-cell title="收款摘要" :to="toModule('confirm-title-desc')" class="input-text-right" placeholder="请选择或输入" is-link>
      <mt-field @click.native.stop.prevent placeholder="请选择或输入" v-model="title_desc.title" class="input-right field-in-cell"></mt-field>
      <!--<input type="text" @click.stop.prevent v-model="title_desc.title" placeholder="请选择或输入" class="mint-field-core">-->
    </mt-cell>
    <my-block></my-block>
    <mt-cell class="background-image-no" :to="toModule('confirm-bill-desc')" title="账单备注" value="" is-link></mt-cell>
    <mt-field class="background-image-no input-text-right" v-model="fnConfig.billDesc" placeholder="请输入或选择账单备注" type="textarea"
      rows="4"></mt-field>
    <my-block></my-block>
    <mt-cell class="background-image-no" :to="toModule('confirm-book-desc')" title="确认书备注" value="" is-link></mt-cell>
    <mt-field class="background-image-no input-text-right" v-model="fnConfig.okremark" placeholder="请输入或选择确认书备注" type="textarea"
      rows="4"></mt-field>
    <my-block></my-block>
    <my-cell title="导出内容" :to="toModule('confirm-export-content')" :value="confirm_search_query.exportContent" is-link></my-cell>
    <my-bottom-box>
      <mt-button type="primary" size="large" @click.native="exportWord('/0')">生成PDF并浏览</mt-button>
      <div style="height:10px"></div>
      <mt-button type="default" size="large" @click.native="exportWord('/1')">生成PDF并下载</mt-button>
    </my-bottom-box>
    <!-- 扫描收款下方弹出 -->
    <mt-popup v-model="TypePopupStatus" position="bottom" class="my-popup">
      <mt-picker :slots="moneyTypes" @change="TypeSelect" showToolbar visibleItemCount="3">
        <span class="mint-datetime-action mint-datetime-cancel" @click="TypeClick">取消</span>
        <span class="mint-datetime-action mint-datetime-confirm" @click="TypeConfirm">确认</span>
      </mt-picker>
    </mt-popup>
  </div>
</template>

<script>
  import {
    Toast
  } from "mint-ui";
  import Vue from 'vue';
  export default {
    data() {
      return {
        TypePopupStatus: false,
        TypeTmp: '',
        isPay: false,
        billShow: true,
      }
    },
    created() {
      let order_id = this.$store.getters["order/order_id"];
      let baseAccount = this.$store.getters['order/confirmbook/base_account'];
      if(this.sys.con_sysShow){
        let billShow = this.sys.con_sysShow.split(',')[1];
        if(billShow==0) this.billShow=false
      }
      if (!baseAccount.length) {
        this.$store.dispatch('order/confirmbook/base_account_request');

      }
      let _this = this;
      Vue.http.post( //是否有二维码权限
        "ispay", {}, {
          emulateJSON: true
        }
      ).then(res => {
        if (typeof res.body == 'object') {
          _this.isPay = res.body.success;
        }

      })
      if (!order_id) {
        let orderid = this.$route.query.id;
        if (orderid) {
          this.$store.dispatch("order/order_select", {
            id: orderid
          });
          this.$store.dispatch("order/order_request").then(y => {
            this.billTitleSelect(y);
            this.confirm_search_query.money = y.pingAmountNo;
          });
          return;
        } else {
          Toast("未选择有效订单");
          return;
        }
      }

      let bill_title = this.$store.getters['order/confirmbook/bill_title'];
      if (!bill_title.length) {
        this.billTitleSelect(this.order);
      }


    },
    computed: {
      fnConfig() {
        return this.$store.getters["order/confirmbook/fnConfig"];
      },
      fnTitle() {
        return this.$store.getters["order/confirmbook/fnTitle"];
      },
      confirmTemp() {
        return this.$store.getters["order/confirmbook/confirmTemp"];
      },
      title_desc() {
        return this.$store.getters["order/confirmbook/title_desc_select"];
      },
      confirm_search_query() {
        let query = this.$store.getters["order/confirmbook/confirm_search_query"];
        this.fnExportContent(query);
        let refresh = this.$route.params.refresh;
        if (refresh) {
          query.money = this.order.pingAmountNo;
        }
        return query;
      },
      moneyTypes() {
        return [{ //团期类型选择项
          flex: 1,
          values: ['指定金额', '不指定金额'],
          className: 'slot',
          defaultIndex: ['指定金额', '不指定金额'].indexOf('指定金额'),
        }]
      },
      order() {
        return this.$store.getters["order/order_select"]
      },
      sys() {
        return this.$store.getters['sys/sys']
      },
    },
    methods: {
      toModule(v) {
        return {
          name: v
        };
      },
      TypeClick() {
        this.TypePopupStatus = !this.TypePopupStatus
      },
      TypeSelect(e, v) {
        this.TypeTmp = v[0];
      },
      TypeConfirm() {
        this.TypePopupStatus = false;
        if (this.TypeTmp) {
          if (this.TypeTmp == "不指定金额") {
            this.confirm_search_query.money = "";
          } else {
            this.confirm_search_query.money = this.order.pingAmountNo;
          }
          this.confirm_search_query.moneyTypes = this.TypeTmp;
        } else {
          this.confirm_search_query.moneyTypes = "指定金额";
        }
      },
      billTitleSelect(y) {
        this.$store.dispatch('order/confirmbook/bill_title_request').then(end => {
          let bill_title_select = end.find(x => {
            return x.title == y.cpyTitle;
          });
          if (bill_title_select) {
            this.$store.dispatch('order/confirmbook/bill_title_select', bill_title_select);
          }

        });
      },
      fnExportContent(query) {
        let exp = query.exportContentID;
        exp.indexOf('isJYMingDan') > -1 ? this.fnConfig.isMingDan = 1 : this.fnConfig.isMingDan = 0;
        exp.indexOf('isMingDan1') > -1 ? this.fnConfig.isMingDan1 = 1 : this.fnConfig.isMingDan1 = 0;
        exp.indexOf('isXianShou') > -1 ? this.fnConfig.isXianShou = 1 : this.fnConfig.isXianShou = 0;
        exp.indexOf('isXingContent') > -1 ? this.fnConfig.isXingCheng = 2 : this.fnConfig.isXingCheng = 0;
        exp.indexOf('isXingCheng') > -1 ? this.fnConfig.isXingCheng = 1 : this.fnConfig.isXingCheng = this.fnConfig.isXingCheng ||
          0;
      },
      setConfirm(data, fileName, pdfType) { //生成确认书
        this.$store.dispatch("order/confirmbook/confirmConfig", data).then(end => {
          let jsonData = end;
          let tplFile = this.confirmTemp.value;
          let pdfData = {
            fileName: fileName,
            tplFile: tplFile,
            jsonData: JSON.stringify(jsonData),
          };
          this.$store.dispatch("order/confirmbook/generatePdf", pdfData).then(end => {
            let endType = Object.prototype.toString.call(end).slice(8, -1);
            if (endType == 'Object' && !end.success) {
              Toast(end.msg);
              return;
            }
            window.location.href = '/sys/api/pub_m/generate-pdf-get/' + end + pdfType;
          });
        });
      },
      exportWord(pdfType) {
        if (!this.confirm_search_query.baseAccountID) {
          Toast('请选择收款账号！');
          return;
        }
        if (this.confirm_search_query.money.length > 16) {
          Toast('输入金额不能超过16位');
          return;
        }
        let data = {}; //确认书配置参数
        data.planID = this.order.planID;
        data.ordIDs = this.order.ordID;
        data.cpyID = this.order.cpyID;
        data.accIDs = this.confirm_search_query.baseAccountID; //收款账号
        data.isMingDan = this.fnConfig.isMingDan1; //详细名单
        data.isJyMingDan = this.fnConfig.isMingDan; //简要名单
        data.isXingCheng = this.fnConfig.isXingCheng; //行程
        data.confirmDesc = this.fnConfig.okremark; //确认书备注
        data.jiaotong = this.fnConfig.jiaotong;
        data.billDesc = this.fnConfig.billDesc;
        data.isXianShou = this.fnConfig.isXianShou;
        // data.money=this.confirm_search_query.money;
        // data.exportContent=this.confirm_search_query.exportContent;
        data.erpName = this.fnConfig.erpName;
        data.title = this.fnConfig.filename;

        let qrcodeData = {}; //二维码参数
        qrcodeData.amount = (this.confirm_search_query.money || 0) * 100 || '';
        qrcodeData.orderid = this.order.ordID;
        qrcodeData.buyerid = this.order.cpyID;
        qrcodeData.remark = this.title_desc.title;

        let fileName = this.fnConfig.erpName + ' -' + this.order.ordID + '-' + this.order.planDate + '-' + this.order.userCpyName +
          '.doc';
        //let tplFile = this.confirmTemp.fileName;
        console.log(this.isPay + '  pay');
        if (this.isPay) {
          this.$store.dispatch("order/confirmbook/qrcode_request", qrcodeData).then(end => {
            data.qrCodeUrl = end.qrcode;
            this.setConfirm(data, fileName, pdfType); //生成确认书  data   确认书名称 生成还是预览
          });
        } else {
          data.qrCodeUrl = '';
          this.setConfirm(data, fileName, pdfType);
        }



      }
    }
  }
</script>

<style>
  .background-image-no .mint-cell-wrapper {
    background-image: none;
  }

  .mint-field-core {
    color: #888;
  }
</style>