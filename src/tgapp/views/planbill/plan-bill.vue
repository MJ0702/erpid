<template>
  <div>
    <header class="mint-header is-fixed">
      <div class="mint-header-button is-left" @click="$router.history.go(-1)">
        <my-icon href="fanhui" size="22" style="fill:#fff"></my-icon>
      </div>
      <div class="center-button single-over">
        <span class="header-title single-over middle-span">报账详情</span>        
      </div>
    </header>
    <div style="height:40px"></div>
    <div class="rounded-rect-fixed">
      <div class="reject-text">点击这里查看拒绝原因</div>
      <div class="reject-text-click">></div>
    </div>    
    <div class="plan-con">
      <div class="line-title">{{data.lineTitle}}</div>
      <div style="height:155px;">
        <hr class="hr-split">
        <transition name="mybox">
        <div :class="touchActive == 1 ? 'touch-show' : 'touch-hide' " @touchstart='firstTouchStart($event)' @touchend='firstTouchEnd($event)'>
        <!--<div v-show="firstTouch" @touchstart='firstTouchStart($event)' @touchend='firstTouchEnd($event)'>-->
          <div class="bill-sum">
            <div class="bill-borrow">预支借款(元)<br><span>{{data.loanAmount?data.loanAmount.toFixed(2):'0.00'}}</span></div>
            <div class="bill-final">报账合计(元)<br><span :class="data.amount>=0 ? 'plus' : 'reduce' ">{{ data.amount >=0 ? '+' : '-' }}{{data.amount?Math.abs(data.amount).toFixed(2):'0.00'}}</span></div>
          </div>
          <hr class="hr-split">
          <div class="bill-sum sum-detail">
            <div class="sum-detail-col1">实收：￥{{data.recAmount?data.recAmount.toFixed(2):'0.00'}}<br>实付：￥{{data.payAmount?data.payAmount.toFixed(2):'0.00'}}</div>
            <div class="sum-detail-col2">签单：￥{{data.signAmount?data.signAmount.toFixed(2):'0.00'}}<br>购物： {{data.shopAmount?data.shopAmount.toFixed(2):'--'}}</div>
            <div class="sum-detail-col3"><div class="guide-fee"><span class="guide-fee-money">￥{{data.guideFeeAmount?data.guideFeeAmount.toFixed(2):0.00}}</span><br><span class="guide-fee-text">导服费</span></div></div>
          </div>
        </div>
        </transition>    
        <transition name="secondbox">  
        <div :class="touchActive == 2 ? 'touch-show' : 'touch-hide' " @touchstart='secondTouchStart($event)' @touchend='secondTouchEnd($event)'> 
        <!--<div v-show="secondTouch" @touchstart='secondTouchStart($event)' @touchend='secondTouchEnd($event)'>-->
          <div style="padding-top:8px;">
            <div class="line-plan-desc">团号：{{data.planCode}}</div>
            <div class="line-plan-desc">往返时间：{{data.planDate}}/{{data.backDate}}</div>
            <div class="line-plan-desc">公司名称：{{data.cpyName}}</div>
            <div class="line-plan-op">
              <div class="line-plan-desc op-name">线路OP：{{data.opName}}<span class="split-text">|</span></div>
              <div class="op-phone" @click="phoneCall()" v-show="data.mobile!=''">
                <div class="op-phone-text">
                  {{data.mobile}}
                </div> 
              <div class="op-phone-img"><img src="assets/phone-blue.svg"/></div></div>             
            </div>
          </div>
        </div>
        </transition>  
        
        <hr class="hr-split">
        <div class="nav-radius-con">
          <div :class="touchActive==1 ? 'nav-radius nav-radius-acitve' : 'nav-radius' "></div>
          <div :class="touchActive==2 ? 'nav-radius nav-radius-acitve' : 'nav-radius' "></div>
        </div>
      </div>
    </div> 
    <div class="bill-nav">
      <div class="bill-nav-item" @click="billList(1)">
        <div class="bill-nav-item-icon"><img src="assets/plan_bill_receivables.svg" /></div>
        <div class="bill-nav-item-title">团款代收</div>
        <div class="bill-nav-item-desc">还有<span style="color:#F56C6C">【{{data.recNum}}】</span>笔款项未确认</div>
        <div class="bill-nav-item-click">></div>
      </div>
      <div class="bill-nav-item" @click="billList(2)">
        <div class="bill-nav-item-icon"><img src="assets/plan_bill_pay.svg" /></div>
        <div class="bill-nav-item-title">导游付款</div>
        <div class="bill-nav-item-desc">还有<span style="color:#F56C6C">【{{data.payNum}}】</span>笔款项未确认</div>
        <div class="bill-nav-item-click">></div>
      </div>
      <div class="bill-nav-item" @click="billList(3)">
        <div class="bill-nav-item-icon"><img src="assets/plan_bill_shopping.svg" /></div>
        <div class="bill-nav-item-title">购物登记</div>
        <div class="bill-nav-item-desc"></div>
        <div class="bill-nav-item-click">></div>
      </div>
      <div class="bill-nav-item" @click="billList(4)">
        <div class="bill-nav-item-icon"><img src="assets/plan_bill_other.svg" /></div>
        <div class="bill-nav-item-title">其它收入</div>
        <div class="bill-nav-item-desc"></div>
        <div class="bill-nav-item-click">></div>
      </div>
    </div> 
    <div class="bottom-btn">
      <div class="bill-add-btn" @click="billAdd()">添加报账</div>
      <div class="bill-submit-btn" @click="submit()">提交报账</div>
    </div>


    <div  v-show="submitTipVisible" class="maskDiv"></div>
    <div  v-show="submitTipVisible" class="submit-tip">
      <div class="submit-tip-desc">您还有以下类型的报账没有确认<br>确认后即可提交</div>
      <div class="tip-list">
        <div class="tip-list-item">
          <div class="tip-item-icon"><img src="assets/hotel_black.svg" /></div>
          <div class="tip-item-text">
            <div class="tip-item-type">酒店</div>
            <div class="tip-item-desc">还有【3】笔未确认</div>
          </div>
          <div class="tip-item-btn" @click="billList(2)">去确认</div>
        </div>
        <div class="tip-list-item">
          <div class="tip-item-icon"><img src="assets/meal_black.svg" /></div>
          <div class="tip-item-text">
            <div class="tip-item-type">餐厅</div>
            <div class="tip-item-desc">还有【3】笔未确认</div>
          </div>
          <div class="tip-item-btn" @click="billList(2)">去确认</div>
        </div>
        <div class="tip-list-item">
          <div class="tip-item-icon"><img src="assets/ticket_black.svg" /></div>
          <div class="tip-item-text">
            <div class="tip-item-type">景点</div>
            <div class="tip-item-desc">还有【3】笔未确认</div>
          </div>
          <div class="tip-item-btn" @click="billList(2)">去确认</div>
        </div>
        <div class="tip-list-item">
          <div class="tip-item-icon"><img src="assets/car_black.svg" /></div>
          <div class="tip-item-text">
            <div class="tip-item-type">用车</div>
            <div class="tip-item-desc">还有【3】笔未确认</div>
          </div>
          <div class="tip-item-btn" @click="billList(2)">去确认</div>
        </div>
        <div class="tip-list-item">
          <div class="tip-item-icon"><img src="assets//other_black.svg" /></div>
          <div class="tip-item-text">
            <div class="tip-item-type">其它支出</div>
            <div class="tip-item-desc">还有【3】笔未确认</div>
          </div>
          <div class="tip-item-btn" @click="billList(2)">去确认</div>
        </div>
        <div class="tip-list-item">
          <div class="tip-item-icon"><img src="assets/receivables_black.svg" /></div>
          <div class="tip-item-text">
            <div class="tip-item-type">团款代收</div>
            <div class="tip-item-desc">还有【3】笔未确认</div>
          </div>
          <div class="tip-item-btn" @click="billList(1)">去确认</div>
        </div>        
      </div>
    </div>
    <div  v-show="submitTipVisible" class="submit-tip-cancel" @click="submitTipCancel()">
      <img src="assets/cancel.svg" />
    </div>
    <!--<mt-popup v-model="submitTipVisible" class="submit-tip" style="transform: none;" pop-transition="popup-fade" :modal="false">
      <div class=""></div>
    </mt-popup>-->
   

  </div>

  
</template>
<script>
    import {
    Toast
  } from "mint-ui";
  export default {
    name: "component_name",
    data() {
      return {
       startX: -1,
       endX: -1,
       touchActive: 1,
       firstTouch: true,
       secondTouch: false,
       submitTipVisible: false
      };
    },
    created() {
      let erpId= Number(this.$route.query.erpId);
      let planId= Number(this.$route.query.planId);
      this.$store.dispatch('tgapp/planBill/change_erpId', erpId)
      this.$store.dispatch('tgapp/planBill/change_planId', planId)
      this.$store.dispatch('tgapp/planBill/findData');

      let turnToList=this.$store.getters['tgapp/planBill/turnToList']; 
      if(turnToList){
        this.$store.dispatch('tgapp/planBill/change_turnToList', false);
        this.billList(1);
      }
    },
    computed: {
      data() {
        return this.$store.getters['tgapp/planBill/data']; 
      }
    },
    methods: {
      help() {        
        this.$router.push({path:'tgapp-help',query:{erpId:erpId}})
      },
      phoneCall(){
        let data=this.$store.getters['tgapp/planBill/data']; 
        if(data.mobile){
            window.location.href = 'tel://'+data.mobile;
        }         
      },
      billList(type){
        if(this.clickFlag){
          this.clickFlag = false;
          return;
        }        
        let erpId=this.$store.getters['tgapp/planBill/erpId'];
        let planId=this.$store.getters['tgapp/planBill/planId'];  
        this.$router.push({path:'tgapp-bill-list',query:{erpId:erpId, planId:planId, type:type}})  
      },
      billAdd(){
        let erpId=this.$store.getters['tgapp/planBill/erpId'];
        let planId=this.$store.getters['tgapp/planBill/planId'];  
        this.$router.push({path:'tgapp-bill-add',query:{erpId:erpId, planId:planId}});
      },
      submit(){
        this.submitTipVisible = true;
      },
      submitTipCancel(){        
        this.submitTipVisible = false;
        let erpId=this.$store.getters['tgapp/planBill/erpId'];
        let planId=this.$store.getters['tgapp/planBill/planId'];  
        this.$router.push({path:'tgapp-bill-progress',query:{erpId:erpId, planId:planId}});
      },
      firstTouchStart(ev){     
        this.startX = -1;
        this.endX = -1;
        // ev.preventDefault();
        if(ev.touches.length == 1) {//tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
            this.startX = ev.touches[0].clientX;
        }
      },
      firstTouchEnd(ev){
        // ev.preventDefault();
        if(ev.changedTouches.length == 1) {
            this.endX = ev.changedTouches[0].clientX;
            if(this.startX-this.endX>50){
              this.touchActive = 2;
              this.firstTouch = false;
              this.secondTouch = true;
            }
        }
      },
      secondTouchStart(ev){     
        this.startX = -1;
        this.endX = -1;
        // ev.preventDefault();
        if(ev.touches.length == 1) {
            this.startX = ev.touches[0].clientX;
        }
      },
      secondTouchEnd(ev){
        // ev.preventDefault();
        if(ev.changedTouches.length == 1) {
            this.endX = ev.changedTouches[0].clientX;
            if(this.endX-this.startX>50){
              this.touchActive = 1;  
              this.firstTouch = true;
              this.secondTouch = false;          
            }
        }
      }

    }
  }
</script>
<style lang="less" scoped>
  .header-title {
    height: 26px;
    line-height: 23px;
    color: rgba(255, 255, 255, 1);
    font-size: 16px;
    text-align: center;
    flex: 1;
    -webkit-box-flex: 1;
  }

  .center-button {
    width: 55%;
    display: flex;
  }

  .rounded-rect-fixed{
    position:fixed;
    top:40px;
    left:0;
    right:0;
    z-index:10;
    background-color: #F58889;    
    height: 30px;
    line-height: 30px;
    color: #fff;
    font-size: 1.2em;
    display: none;
  }
  .reject-text{
    float: left;
    margin-left: 8px;
  }
  .reject-text-click{
    float:right;
    font-size: 1.5em;
    margin-right: 8px;
  }
  .plan-con{
    width:100%;
    min-height: 200px;
    background-color: #fff;
  }
  .line-title{    
    min-height:23px;
    margin-left: 8px;
    margin-right: 8px;
    padding-top: 10px;
    padding-bottom: 5px;
    line-height: 20px;
    font-size: 1.4em;
    color: #606266;
    font-weight: 600;  
  }
  .hr-split{
    border: 0px;
    border-top: 1px solid #F5F5F5;
    margin: 0px;
  }
  .bill-sum{
    height: 60px;
  }
  .bill-borrow{
    float: left;
    font-size:  1.2em;
    color: #101010;
    margin-left: 8px;
    margin-top: 5px;
    min-width: 90px;
    text-align: center;
    line-height: 25px;
  }
  .bill-final{
    float: right;
    font-size: 1.2em;
    color: #101010;
    margin-right: 8px;
    margin-top: 5px;
    min-width: 90px;
    text-align: center;
    line-height: 25px;  
  }
  .bill-borrow span{
    font-size: 1.5em;
    color: #54626E;
    font-weight: 600;
  }
  .bill-final span{
    font-size: 1.5em;
    // color: #F56C6C;
    font-weight: 600;
  }
  .sum-detail{
    display: flex;   
  }
  .sum-detail-col1{
    flex: 1;
    margin-left: 10px;
    line-height: 20px;
    color: #909399; 
    margin-top: 10px;    
    font-size: 1.2em;
  }
  .sum-detail-col2{
    flex: 1;
    line-height: 20px;
    color: #909399; 
    margin-top: 10px;    
    font-size: 1.2em;
  }
  .sum-detail-col3{
    flex: 1;
    margin-top: 5px;
    margin-right: 8px;
  }
  .guide-fee{
    min-width: 100px;
    text-align:center;
    background-color: #F0F0F0;
    border-radius: 5455px;
    padding-top: 8px;
  }
  .guide-fee-text{
    font-size: 1.2em;
    line-height: 25px;
    color: #909399;
  }
  .guide-fee-money{
    font-size: 1.6em;
    line-height: 15px;
    color: #E6A23C;
    font-weight: 600;
  }
  .nav-radius-con{
    width: 50px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .nav-radius{
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 10px;
    background-color: #BEC2C9;
    margin-right: 3px;
    margin-left: 3px;
  }
  .nav-radius-acitve{
    background-color: #409EFF;    
  }
  .touch-show{
    display: block;
    height: 121px;
  }
  .touch-hide{
    display: none;
  }
  .line-plan-desc{
    margin-left: 10px;
    font-size: 1.2em;
    color: #909399;
    line-height: 26px;
  }
  .line-plan-op{
    display: flex;
  }
  .op-name{
    min-width: 160px;
  }
  .op-phone{
    min-width: 120px;
    height: 26px;
    line-height: 26px;
    background-color: #F6FBFF;
    border: 1px solid #B3D8FF;
    color: #B3D8FF;
    font-size: 1.2em;
    text-align: center;
    margin-right: 10px;
    border-radius: 20px;
  }
  .op-phone img{
    width: 18px;
    height: 18px;
  }
  .op-phone-text{
    float:left;
    margin-left: 13px;
  }
  .op-phone-img{
    float:left;
    padding-top: 4px;
    margin-left: 2px;
  }
  .split-text{
    margin-left:30px;
    margin-right:30px;
    color:#ccc;
    line-height: 26px;
    font-size: 18px;
  }
  
  


  .bill-nav{
    background-color: #fff;
    margin-top: 10px;
  }
  .bill-nav-item{
    display: flex;    
    height: 50px;
    line-height: 50px;
    border: 1px solid #F7FAFC;
  }
  .bill-nav-item-icon{
    width: 22px;
    height: 22px;
    margin-left: 8px;
    margin-right: 8px;
  }
  .bill-nav-item-icon img{
    width: 22px;
    height: 22px;
    margin-top: 14px;
  }
  .bill-nav-item-title{
    width: 150px;
    font-size: 1.4em;
    color: #606266;
    font-weight: 600;    
  }
  .bill-nav-item-desc{
    flex: 1;
    color: #C0C4CC;
    text-align: right;  
    font-size: 1.2em;
  }
  .bill-nav-item-click{
    width: 15px;
    font-size: 1.8em;
    margin-right: 8px;
    margin-left: 10px;
    color: #C0C4CC;
  }
  .bottom-btn{
    padding-top:15px;
  }
  .bill-add-btn{
    width: 240px;
    height: 47px;
    line-height: 47px;
    background-color: #5EB2FF;
    color: #fff;
    border-radius: 1000px;
    text-align: center;
    font-size: 1.4em;
    box-shadow: 0px 0px 20px 0px #5EB2FF;   
    margin-left:auto;
    margin-right:auto;
  }
  .bill-submit-btn{
    width: 240px;
    height: 47px;
    line-height: 47px;
    color: #409EFF;
    border-radius: 1000px;
    text-align: center;
    font-size: 1.4em;
    margin-left:auto;
    margin-right:auto;
  }

  .maskDiv{
    display:block;
    width: 100%;
    height:100%;
    background-color:#ccc;
    opacity:0.7;
    position:fixed; 
    background-color: rgba(16, 16, 16, 1); 
    position:fixed; 
    left:0%; 
    top:0% ;
    z-index: 99999997;
  }
  .submit-tip{
      text-align: center; 
      background-color: #fff;
      border-radius: 10px;
      width: 300px;
      height: 363px;
      margin: auto;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 99999998;
  }
  .submit-tip-cancel{
      border-radius: 20px;
      width: 26px;
      height: 26px;
      margin: auto;
      position: absolute;
      top: 450px;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 99999999;
  }
  .submit-tip-desc{
    color: #F56C6C;
    font-size: 1.4em;
    line-height: 20px;
    margin-top: 20px;
    margin-bottom: 15px;
  }
  .tip-list{
    height: 270px;
    margin-left: 16px;
    margin-right: 16px;
    overflow:scroll;
    padding: 2px;
  }
  .tip-list-item{
    width: 100%;
    height: 60px;
    font-size: 1.4em;
    box-shadow: 0px 0px 6px 0px rgba(173, 216, 255, 1);   
    text-align: left;    
    margin-bottom: 10px;
  }
  .tip-item-icon{
    float: left;
    width: 24px;
    margin-left: 12px;
    margin-top: 17px;
  }
  .tip-item-text{
    float: left;
    margin-left: 5px;
    margin-top: 10px;
  }
  .tip-item-btn{
    float: right;
    width: 54px;
    height: 21px;
    line-height: 21px;
    background-color: #409EFF;
    color: #fff;
    text-align: center;
    border-radius: 10px;
    font-size: 10px;
    margin-right: 15px;
    margin-top: 19px;
  }
  .tip-item-icon img{
    width: 24px;
    height: 24px;
  }
  .tip-item-type{
    font-size: 12px;
    font-weight: 600;
    color: #6F6F71;
    line-height: 20px;
  }
  .tip-item-desc{
    font-size: 10px;
    color: #B2B4B8;
  }
  .plus{
    color: #F56C6C;
  }
  .reduce{
    color: #67C23A;
  }

/**
  .mybox-leave-active,.mybox-enter-active{
      transition:  all 0.3s ease; 
  }
  .mybox-leave-active,.mybox-enter{
      position:absolute;
      left:-100%;
      top:130px;
  }
  .mybox-leave,.mybox-enter-active{
      position:absolute;
      left:0px;
      top:130px;
  }
  
  .secondbox-leave-active,.secondbox-enter-active{
      transition:  all 0.3s ease; 
  }
  .secondbox-leave-active,.secondbox-enter{
      //width:0px !important;
      position:absolute;
      left:100%;
      top:130px;
  }
  .secondbox-leave,.secondbox-enter-active{
      //width: 375px;
      position:absolute;      
      left:0px;
      top:130px;
  }

  .mybox-leave-active,.mybox-enter-active{
      transition:  all 1s ease; 
  }
  .mybox-leave-active,.mybox-enter{
      margin-left: -100%;
      margin-right: 100%;
  }
  .mybox-leave,.mybox-enter-active{
      margin-left:0px;
      margin-right:0px;
  }
  
  .secondbox-leave-active,.secondbox-enter-active{
      transition:  all 1s ease; 
  }
  .secondbox-leave-active,.secondbox-enter{
      margin-left: 100%;
      margin-right: -100%;
  }
  .secondbox-leave,.secondbox-enter-active{
      margin-left: 0px;
      margin-right: 0px;
  }**/
</style>