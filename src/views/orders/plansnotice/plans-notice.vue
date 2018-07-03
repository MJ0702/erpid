<template>
  <div>
    <mt-header title="出团通知书" fixed>
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
  
    <!--<mt-field label="文档名称" class="input-text-right" v-model="fnConfig.filename" placeholder="确认书"></mt-field>-->
    <my-cell title="选中模板" :value="planTemplateSelect.fileName" placeholder="请选择模板" is-link :to="toModule('plans-template')"></my-cell>
    <my-cell title="账单抬头" v-if="billTitleSelect.title" :value="billTitleSelect.title" :to="toModule('plans-bill-title')" is-link>
    </my-cell>
     <my-cell title="账单抬头" v-else :to="toModule('plans-bill-title')" value="请选择账单抬头" is-link>
    </my-cell>
    <my-cell title="收款账号" v-if="query.accountType" @click.native="accountTypeClick" :value="query.accountType" is-link></my-cell>
    <my-cell title="收款账号" v-else @click.native="accountTypeClick" value="请选择收款账号" is-link></my-cell>
    <my-block></my-block>
    <mt-cell title="导出内容" @click.native="exportContentClick" :value="query.exportContent" is-link></mt-cell>
    <my-bottom-box>
      <mt-button type="primary" size="large" @click.native="exportPdf('/0')">生成PDF并浏览</mt-button>
      <div style="height:10px"></div>
      <mt-button type="default" size="large" @click.native="exportPdf('/1')">生成PDF并下载</mt-button>
    </my-bottom-box>
    
    <mt-header :title="['','收款帐号','导出内容'][showWhich]" v-if="popupStatus" fixed style="z-index:2100">
      <router-link :to="{name:'plans-notice',query:{id:order.ordID}}" slot="left">
        <mt-button icon="back" @click="popupStatus=!popupStatus">返回</mt-button>
      </router-link>
      <!-- <mt-button slot="right" @click="popupStatus=!popupStatus">取消</mt-button> -->
    </mt-header>
    <mt-popup v-model="popupStatus" popup-transition="popup-fade" position="right" class="my-popup-right">
      <div style="height:40px"></div>

      <!-- 收款帐号右侧弹出 -->
      <mt-checklist v-model="query.accountTypes" :options="accountTypeOptions" @change="accountTypesChange" v-if="showWhich==1"></mt-checklist>
      <!-- 导出内容右侧弹出 -->
      <mt-checklist v-model="query.exportContents" :options="query.exportContentOptions" @change="exportContentChange" v-if="showWhich==2"></mt-checklist>
      <!-- 团期状态右侧弹出 -->
      <!--<mt-checklist v-model="isLocksAll" :options="['全选']" @change="isLocksAllChange" v-show="showWhich==3" class="checklist-beauty"></mt-checklist>-->
      <!--<mt-checklist v-model="query.isLocks" :options="isLockOptions" @change="isLocksChange" v-if="showWhich==3" class="checklist-beauty"></mt-checklist>-->
      <my-pad></my-pad>
    </mt-popup>
    <my-button-block fixed v-if="popupStatus" style="z-index:2100">
      <mt-button type="primary" size="large" @click.native="popupStatus=!popupStatus">确定</mt-button>
    </my-button-block>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { Toast } from "mint-ui"
  export default {
    data() {
      return {
          TypePopupStatus:false,
          TypeTmp:'',
          showWhich: 0,
          popupStatus: false,
          fnConfig:{},
      }
    },
    created(){
          let vm = this;
          let order_id = this.$store.getters["order/order_id"];
          if(!order_id) {
            let orderid = this.$route.query.id;
            if(orderid) {
              this.$store.dispatch("order/order_select", {id: orderid});
              this.$store.dispatch("order/order_request");
            } else {
              Toast("未选择有效订单");
              return;
            }
          }
          if(!this.accountTypeOptions.length){
            Vue.http.post( //获取【收款帐号】列表数据
              "pub/base-account",
              {
                page:1,
                start:0,
                limit:2147483647,
              },
              {emulateJSON: true}
            ).then(res => {
              if(!res.body) return;
              let rows = [];
              res.body.rows.forEach((v) => {
                if(!v.accName){
                  v.accName=v.accCard;
                }
                rows.push({
                label: v.accName,
                value: v.ID+","+v.accName,
                });
              })
             this.$store.dispatch("order/plansnotice/baseAccount",rows)
            // vm.accountTypeOptions = rows;
            });
          }
          
    },
    computed:{
        query() {
          let query=this.$store.getters["order/plansnotice/notice_search_query"];
          this.fnExportContent(query);
          return query;
        },
        planTemplateSelect(){
          return this.$store.getters['order/plansnotice/planTemplateSelect'];
        },
        billTitleSelect(){
          return this.$store.getters["order/plansnotice/bill_title_select"];
        },
        order() {
          return this.$store.getters["order/order_select"]
        },
        accountTypeOptions(){
          return this.$store.getters['order/plansnotice/baseAccount'];
        }
    },
    methods: {
      toModule(v) {
        return {name: v};
      },
      fnBack(){
        let ordID = this.order.ordID;
        return '/plans-notice?id='+ordID;
      },
      TypeClick() {
        this.TypePopupStatus = !this.TypePopupStatus
      },
      TypeSelect(e, v) {
        this.TypeTmp = v[0];
      },
      accountTypesChange(val) {
        let accountType = "", accountTypeID = "";
        accountType = val.map(v=>v.slice(v.indexOf(",")+1, v.length)).toString();
        accountTypeID = val.map(v=>v.slice(0, v.indexOf(","))).toString();
        if(accountType.length>16) {
          accountType = accountType.slice(0, 16)+'...'
        }
        this.query.accountTypeID = accountTypeID;
        this.query.accountType = accountType;
      },
      exportContentChange(val) {
        let exportContent = "", exportContentID = "";
        exportContent = val.map(v=>v.slice(v.indexOf(",")+1, v.length)).toString();
        exportContentID = val.map(v=>v.slice(0, v.indexOf(","))).toString();
        if(exportContent.length>16) {
          exportContent = exportContent.slice(0, 16)+'...'
        }
        this.query.exportContentID = exportContentID;
        this.query.exportContent = exportContent;
      },
      accountTypeClick() {
        this.showWhich = 1;
        this.popupStatus = !this.popupStatus;
      },
      exportContentClick() {
        this.showWhich = 2;
        this.popupStatus = !this.popupStatus;
      },
      fnExportContent(query){
        let exp=query.exportContentID;
        exp.indexOf('billDetail')>-1?this.fnConfig.billDetail=1:this.fnConfig.billDetail=0;
        exp.indexOf('payInfo')>-1?this.fnConfig.payInfo=1:this.fnConfig.payInfo=0;
        exp.indexOf('userInfo')>-1?this.fnConfig.userInfo=1:this.fnConfig.userInfo=0;
        exp.indexOf('theTips')>-1?this.fnConfig.theTips=1:this.fnConfig.theTips=0;
        exp.indexOf('theNotice')>-1?this.fnConfig.theNotice=1:this.fnConfig.theNotice=0;
        exp.indexOf('briefly')>-1?this.fnConfig.briefly=1:this.fnConfig.briefly=0;
      },
      exportPdf(pdfType){
        // let data=this.fnConfig;
        let data={};
        data.tplFile=this.planTemplateSelect.fileConfig;
        data.billDetail=this.fnConfig.billDetail;  //账单明细
        data.payInfo=this.fnConfig.payInfo;      //付款信息
        data.userInfo=this.fnConfig.userInfo;      //游客信息
        data.theTips=this.fnConfig.theTips;       //注意事项
        data.theNotice=this.fnConfig.theNotice;     //温馨提示
        data.briefly=this.fnConfig.briefly;       //简要行程
        data.planID=this.order.planID;
        data.ordID=this.order.ordID;
        data.cpyName=this.billTitleSelect.title;
        data.accIDs=this.query.accountTypeID;
        this.$store.dispatch("order/plansnotice/notices_generate",data).then(end=>{
          let jsonData=end;
          let fileName=data.cpyName+' -'+this.order.ordID+'-'+this.order.planDate+'-'+this.order.userCpyName+'.doc';
          
          let tplFile=this.planTemplateSelect.value;
          let pdfData={
                fileName:fileName,
                tplFile: tplFile,
                jsonData:JSON.stringify(jsonData),
              };
            this.$store.dispatch("order/plansnotice/generatePdf",pdfData).then(end=>{
                // return;//http://dev.1.tontisa.cn/sys/api/1.0.0/
                let endType=Object.prototype.toString.call(end).slice(8,-1);
                if(endType=='Object'&&!end.success){
                  Toast(end.msg);
                  return;
                }
                window.location.href='/sys/api/pub_m/generate-pdf-get/'+end+pdfType;
            });
             
        });

        
      }
    },
    beforeRouteLeave (to, from, next) {
      if(this&&this.popupStatus) {
          this.popupStatus = !this.popupStatus;
          next(to);
          // return;
        } else {
          next();
      }
    },
  }
</script>

<style>
  .background-image-no .mint-cell-wrapper{
    background-image: none;
  }
  .important-col .mint-cell-text{
    color: #f00;
  }
</style>
