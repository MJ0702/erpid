<template>
  <div>
    <div class="pay-btn-toolbar-1">   
      <div class="flex">
        <div :class="payBtnActive==0 ? 'pay-income-btn pay-income-btn-active' : 'pay-income-btn' " @click="payButtonActive(0)">    
          <div :class="payBtnActive==0 ? 'pay-income-btn-icon pay-income-btn-icon-active' : 'pay-income-btn-icon' ">
            <div class="pay-btn-img"><img :src="payBtnActive==0 ? 'assets/all_white.svg' : 'assets/all_black.svg'"/></div> 
            <div class="pay-btn-text">全部</div>  
          </div>
        </div>
      </div>
      <div class="flex">
        <div :class="payBtnActive==1 ? 'pay-income-btn pay-income-btn-active' : 'pay-income-btn' " @click="payButtonActive(1)">    
          <div :class="payBtnActive==1 ? 'pay-income-btn-icon pay-income-btn-icon-active' : 'pay-income-btn-icon' ">
            <div class="pay-btn-img"><img :src="payBtnActive==1 ? 'assets/hotel_white.svg' : 'assets/hotel_black.svg'"/></div> 
            <div class="pay-btn-text">酒店</div>  
          </div>
        </div>
      </div>
      <div class="flex">
        <div :class="payBtnActive==2 ? 'pay-income-btn pay-income-btn-active' : 'pay-income-btn' " @click="payButtonActive(2)"> 
          <div :class="payBtnActive==2 ? 'pay-income-btn-icon pay-income-btn-icon-active' : 'pay-income-btn-icon' ">
            <div class="pay-btn-img"><img :src="payBtnActive==2 ? 'assets/meal_white.svg' : 'assets/meal_black.svg'"/></div> 
            <div class="pay-btn-text">餐厅</div>  
          </div>          
        </div>
      </div>
      <div class="flex">
        <div :class="payBtnActive==3 ? 'pay-income-btn pay-income-btn-active' : 'pay-income-btn' " @click="payButtonActive(3)">   
          <div :class="payBtnActive==3 ? 'pay-income-btn-icon pay-income-btn-icon-active' : 'pay-income-btn-icon' ">
            <div class="pay-btn-img"><img :src="payBtnActive==3 ? 'assets/ticket_white.svg' : 'assets/ticket_black.svg'"/></div> 
            <div class="pay-btn-text">景点</div>  
          </div>          
        </div>
      </div>
    </div>  
    <div class="pay-btn-toolbar-2">
      <div class="flex">
        <div :class="payBtnActive==4 ? 'pay-income-btn pay-income-btn-active' : 'pay-income-btn' " @click="payButtonActive(4)">    
          <div :class="payBtnActive==4 ? 'pay-income-btn-icon pay-income-btn-icon-active' : 'pay-income-btn-icon' ">
            <div class="pay-btn-img"><img :src="payBtnActive==4 ? 'assets/car_white.svg' : 'assets/car_black.svg'"/></div> 
            <div class="pay-btn-text">用车</div>  
          </div>          
        </div>
      </div>
      <div class="flex">
        <div :class="payBtnActive==5 ? 'pay-income-btn pay-income-btn-active' : 'pay-income-btn' " @click="payButtonActive(5)">    
          <div :class="payBtnActive==5 ? 'pay-income-btn-icon pay-income-btn-icon-active' : 'pay-income-btn-icon' ">
            <div class="pay-btn-img"><img :src="payBtnActive==5 ? 'assets/other_white.svg' : 'assets/other_black.svg'"/></div> 
            <div class="pay-btn-text">其它</div>  
          </div>         
        </div>
      </div>
      <div class="flex"/><div class="flex"/>
    </div> 
    <div class="list-item"  v-for="item in pay_list" @click="editItem(item)">
      <div class="flex">
        <div class="payman">{{ item.supCpyName==null||item.supCpyName=='' ? '供应商(无)' : item.supCpyName }}</div>
        <div :class="item.disAmount>=0 ? 'amount plus' : 'amount reduce' ">{{ item.disAmount >=0 ? '-' : '+' }}￥{{Math.abs(item.disAmount).toFixed(2)}}</div>
        <!--<div class="amount">-￥{{ item.guideCheckout==1 ? item.cashAmount.toFixed(2) : item.amount.toFixed(2) }} </div>-->
      </div>
      <div class="flex">        
        <div class="detail">
          {{item.detailTag}}{{item.detailDesc_1}}<span :class="item.detailDesc_2=='' ? 'split-text-hide' : 'split-text' ">|</span> {{item.detailDesc_2}}
        </div>
        <div :class="item.guideCheckout==1 ? 'sign-text-hide' : 'sign-text' ">签单</div>
      </div>
      <div class="flex">
        <div class="detail">明细：单价  {{item.theCurSign}}{{item.thePrice?item.thePrice.toFixed(2):''}}  <span class="split-text">|</span> 数量 {{item.theNum}}
          <span :class="item.costType=='fang' ? 'split-text' : 'split-text-hide' ">|</span> {{item.moreDesc}}
        </div>
        <div class="pay-date">{{ item.cashDate==null||item.cashDate=='' ? '' : item.cashDate.substring(0,10) }}</div>
      </div>
      <hr class="split-hr">
      <div class="flex">
        <div class="remark single-over">摘要： {{item.title}}</div>
        <div :class="item.status=='0' ? 'confirm-btn' : 'confirm-text' "> {{ item.status=='0' ? '确认付款' : '已确认' }}</div>   
      </div>
    </div>
  
  </div>
</template>

<script>
    import {
    Toast
  } from "mint-ui";   
  export default {
    name: "mytest",
    data() {
      return {
        payBtnActive: 0
      };
    },
    props:{
      pay_list:{
        type: Array,
        requested:true
      }
    },  
    created() {       
      
    },
    computed: {
      
    },
    methods: {
      payButtonActive(type){
        this.payBtnActive = type;
        var types = ['','fang','can','piao','che','qita'];
        this.$store.dispatch('tgapp/billList/change_pay_list_query', {type: types[type]});
        this.$store.dispatch('tgapp/billList/pay_list');
      },
      editItem(item){
        let erpId=item.erpId;
        let planId=item.planId;
        let id = item.id;
        let status = item.status;
        if('fang'==item.costType){
          this.$router.push({path:'tgapp-bill-edit-hotel',query:{erpId:erpId, planId:planId, id:id, status:status }});
        }else if('can'==item.costType){
          this.$router.push({path:'tgapp-bill-edit-meal',query:{erpId:erpId, planId:planId, id:id, status:status }});
        }else if('che'==item.costType){
          this.$router.push({path:'tgapp-bill-edit-car',query:{erpId:erpId, planId:planId, id:id, status:status }});
        }else if('piao'==item.costType){
          this.$router.push({path:'tgapp-bill-edit-ticket',query:{erpId:erpId, planId:planId, id:id, status:status }});
        }else if('qita'==item.costType){
          this.$router.push({path:'tgapp-bill-edit-otherPay',query:{erpId:erpId, planId:planId, id:id, status:status }});
        }
        
      }
    }
  }
</script>

<style lang="less" scoped>
.pay-btn-toolbar-1{
  display: flex;
  width: 100%;
  height: 40px;
  background-color: #fff;
}
.pay-btn-toolbar-2{
  display: flex;
  width: 100%;
  height: 50px;
  background-color: #fff;
}
.flex{
  flex:1;
}
.pay-income-btn{
  display: inline-block;
  width: 60px;
  height: 60px;
  line-height:30px;
  margin-top:10px;
  margin-left: 10px;
  margin-right:10px;    
  text-align:center;
  font-size: 1.4em;
  color:#909399;
}
.pay-income-btn-icon{
  width: 80px;
  height: 30px;
  border-radius:14px;
  background-color: #F2F6FC;
  text-align:center;
}
.pay-income-btn-icon img{
  width:20px;
  height:20px;
  margin-top:5px;
  margin-left: 5px;
}
.pay-btn-img{
  float: left;
}
.pay-btn-text{
  float: left;
  margin-left: 5px;
}
.pay-income-btn-active{
  color:#fff;
  width: 60px;
  height: 60px;    
}   
.pay-income-btn-icon-active{
  background-color: #67C23A;
}


.list-item{
    background-color:#fff;
    color:000;
    margin: 8px;
    margin-top: 10px;
    border-radius: 3px;
    line-height: 25px;
    padding: 8px;
}
.flex{
  display: flex;
}
.list-item .payman{
  flex: 1;
  -webkit-box-flex: 1;
  color: #409EFF;
  font-size: 1.6em;
  line-height: 26px;
}
.list-item .amount{
  min-width: 120px;
  text-align: right;
  color: #67C23A;
  font-weight: bold;
  font-size: 1.8em;
  line-height: 26px;
}
.list-item .plus{
  color: #67C23A;
}
.list-item .reduce{
  color: #F56C6C;
}
.list-item .detail{
  flex: 1;
  font-size: 12px;
  text-align:left;
  color: #909399;
}
.list-item .sign-text{
  width: 80px;
  font-size: 1.2em;
  color: #E6A23C;
  text-align:right;
}
.list-item .sign-text-hide{
  display: none;
}
.list-item .pay-date{
  width: 80px;
  font-size: 1.2em;
  color: #C0C4CC;
  text-align:right;
}
.list-item .remark{
  flex: 1;
  -webkit-box-flex: 1;
  color: #C0C4CC;
  font-size: 1.2em;
}
.list-item .confirm-btn{
  width: 60px;
  height: 25px;
  line-height: 25px;
  border-radius: 20px;
  border: 1px solid #409EFF;
  color: #409EFF;
  font-size: 1.2em;
  text-align: center;
  font-family: Arial;
  box-sizing: border-box;
}
.list-item .confirm-text{
  width: 60px;
  height: 25px;
  line-height: 25px;
  color: #A0CFFF;
  font-size: 1.2em;
  text-align: right;
}
.list-item .split-hr{
  border:1px;
  border-top: 1px solid #F5F5F5;
  margin-top:3px;
  margin-bottom:5px;
}
.list-item .split-text{
  margin-left:5px;
  margin-right:5px;
  color:#ccc;
}
.list-item .split-text-hide{
  display: none;
}


</style>