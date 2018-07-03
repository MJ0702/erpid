<template>
  <div>
    <header class="mint-header is-fixed" style="height: 45px;">
      <div :class="isPayActive ? 'pay-income-tab-active' : 'pay-income-tab' " @click="payOrIncomeActive(1)">  
        支出
      </div>
      <div class="pay-income-split"></div>    
      <div :class="isIncomeActive ? 'pay-income-tab-active' : 'pay-income-tab' " @click="payOrIncomeActive(2)">
        收入
      </div>
    </header>    
    <div style="height:45px"></div>
    <div :class="isPayActive ? 'pay-income-toolbar' : 'pay-income-toolbar pay-income-toolbar-hide' ">    
      <div :class="payBtnActive==1 ? 'pay-income-btn pay-income-btn-active' : 'pay-income-btn' " @click="payButtonActive(1)">    
        <div :class="payBtnActive==1 ? 'pay-income-btn-icon pay-income-btn-icon-active' : 'pay-income-btn-icon' ">
          <img :src="payBtnActive==1 ? 'assets/hotel_white.svg' : 'assets/hotel_black.svg'"/>
        </div>
        住  
      </div>
      <div :class="payBtnActive==2 ? 'pay-income-btn pay-income-btn-active' : 'pay-income-btn' " @click="payButtonActive(2)"> 
        <div :class="payBtnActive==2 ? 'pay-income-btn-icon pay-income-btn-icon-active' : 'pay-income-btn-icon' ">
          <img :src="payBtnActive==2 ? 'assets/meal_white.svg' : 'assets/meal_black.svg'"/>
        </div>
        餐  
      </div>
      <div :class="payBtnActive==3 ? 'pay-income-btn pay-income-btn-active' : 'pay-income-btn' " @click="payButtonActive(3)">   
        <div :class="payBtnActive==3 ? 'pay-income-btn-icon pay-income-btn-icon-active' : 'pay-income-btn-icon' ">
          <img :src="payBtnActive==3 ? 'assets/ticket_white.svg' : 'assets/ticket_black.svg'"/>
        </div>
        景  
      </div>
      <div :class="payBtnActive==4 ? 'pay-income-btn pay-income-btn-active' : 'pay-income-btn' " @click="payButtonActive(4)">    
        <div :class="payBtnActive==4 ? 'pay-income-btn-icon pay-income-btn-icon-active' : 'pay-income-btn-icon' ">
          <img :src="payBtnActive==4 ? 'assets/car_white.svg' : 'assets/car_black.svg'"/>
        </div>
        车  
      </div>
      <div :class="payBtnActive==5 ? 'pay-income-btn pay-income-btn-active' : 'pay-income-btn' " @click="payButtonActive(5)">    
        <div :class="payBtnActive==5 ? 'pay-income-btn-icon pay-income-btn-icon-active' : 'pay-income-btn-icon' ">
          <img :src="payBtnActive==5 ? 'assets/other_white.svg' : 'assets/other_black.svg'"/>
        </div>
        其它  
      </div>
    </div>
    <div :class="isIncomeActive ? 'pay-income-toolbar' : 'pay-income-toolbar pay-income-toolbar-hide' ">   
      <div :class="incomeActive==1 ? 'pay-income-btn pay-income-btn-active' : 'pay-income-btn' " @click="incomeButtonActive(1)">   
        <div :class="incomeActive==1 ? 'pay-income-btn-icon pay-income-btn-icon-active' : 'pay-income-btn-icon' ">
          <img :src="incomeActive==1 ? 'assets/receivables_white.svg' : 'assets/receivables_black.svg'"/>
        </div>
        代收  
      </div>
      <div :class="incomeActive==2 ? 'pay-income-btn pay-income-btn-active' : 'pay-income-btn' " @click="incomeButtonActive(2)">   
        <div :class="incomeActive==2 ? 'pay-income-btn-icon pay-income-btn-icon-active' : 'pay-income-btn-icon' ">
          <img :src="incomeActive==2 ? 'assets/shopping_white.svg' : 'assets/shopping_black.svg'"/>
        </div>
        购物  
      </div>
      <div :class="incomeActive==3 ? 'pay-income-btn pay-income-btn-active' : 'pay-income-btn' " @click="incomeButtonActive(3)">    
        <div :class="incomeActive==3 ? 'pay-income-btn-icon pay-income-btn-icon-active' : 'pay-income-btn-icon' ">
          <img :src="incomeActive==3 ? 'assets/other_white.svg' : 'assets/other_black.svg'"/>
        </div>
        其它 
      </div>     
    </div>
    <div class="rounded-rect-fixed added-desc" @click="billList()" v-show="waitConfirmNum>0">
      <span>存在【{{waitConfirmNum}}】笔未确认款项，查看明细 ></span>
    </div>
    <div class="pay-income-add">
      <div id="hotelAdd" :class="isPayActive&&payBtnActive==1 ? 'pay-income-add-content-active' : 'pay-income-add-content' "><hotelComponent ref="hotel_data"></hotelComponent></div>
      <div id="mealAdd" :class="isPayActive&&payBtnActive==2 ? 'pay-income-add-content-active' : 'pay-income-add-content' "><mealComponent></mealComponent></div>
      <div id="ticketAdd" :class="isPayActive&&payBtnActive==3 ? 'pay-income-add-content-active' : 'pay-income-add-content' "><ticketComponent ref="ticket_data"></ticketComponent></div>
      <div id="carAdd" :class="isPayActive&&payBtnActive==4 ? 'pay-income-add-content-active' : 'pay-income-add-content' "><carComponent ref="car_data"></carComponent></div>
      <div id="otherPayAdd" :class="isPayActive&&payBtnActive==5 ? 'pay-income-add-content-active' : 'pay-income-add-content' "><otherPayComponent ref="other_data"></otherPayComponent></div>
      <div id="receivablesAdd" :class="isIncomeActive&&incomeActive==1 ? 'pay-income-add-content-active' : 'pay-income-add-content' "><receivablesComponent></receivablesComponent></div>
      <div id="shoppingAdd" :class="isIncomeActive&&incomeActive==2 ? 'pay-income-add-content-active' : 'pay-income-add-content' "><shoppingComponent></shoppingComponent></div>
      <div id="otherIncomeAdd" :class="isIncomeActive&&incomeActive==3 ? 'pay-income-add-content-active' : 'pay-income-add-content' "><otherIncomeComponent></otherIncomeComponent></div>      
    </div>  

    <div class="buttom-toolbar">
       <div class="back-btn" @click="backPage()">返回</div>
       <div class="again-add-btn" @click="refreshPage()">再记一笔</div>
       <div class="confirm-save-btn" @click="confirm()">{{ isPayActive ? '确认付款' : '确认收款' }}</div> 
    </div>  
        
  </div>  
</template>


<script>
    import {
    Toast
  } from "mint-ui";
  import hotelComponent from './common/bill-hotel.vue';
  import mealComponent from './common/bill-meal.vue';
  import ticketComponent from './common/bill-ticket.vue';
  import carComponent from './common/bill-car.vue';
  import otherPayComponent from './common/bill-otherPay.vue';
  import receivablesComponent from './common/bill-receivables.vue';
  import shoppingComponent from './common/bill-shopping.vue';
  import otherIncomeComponent from './common/bill-otherIncome.vue';
  export default {
    name: "component_name",
    data() {
      return {
        isPayActive: true,
        isIncomeActive: false,
        payBtnActive: 1,
        incomeActive: 1,
        waitConfirmNum: 0
      };
    },
    components: {hotelComponent,mealComponent,ticketComponent,carComponent,otherPayComponent,receivablesComponent,shoppingComponent,otherIncomeComponent},  
    created() {       
      let erpId= Number(this.$route.query.erpId)
      let planId= Number(this.$route.query.planId);
      this.$store.dispatch('tgapp/common/change_erpId', erpId)
      this.$store.dispatch('tgapp/common/change_planId', planId)
      let model = this;
      this.$store.dispatch('tgapp/common/waitConfirm', function(data){
        model.waitConfirmNum = data.payNum;
      });
    },
    computed: {
      
    },
    methods: {
      payOrIncomeActive(type) {
        let waitConfirm = this.$store.getters['tgapp/common/waitConfirm'];
        if(type==1){
          this.isPayActive = true;
          this.isIncomeActive = false;                    
          this.waitConfirmNum = waitConfirm.payNum;
        }else if(type==2){
          this.isPayActive = false;
          this.isIncomeActive = true;
          this.waitConfirmNum = waitConfirm.recNum;
        }
      },
      payButtonActive(type){
        this.payBtnActive = type;
      },
      incomeButtonActive(type){
        this.incomeActive = type;
      },
      refreshPage(){
        window.location.reload();
      },
      confirm(){
        let router = this.$router; 
        let model = this;
        var callback = function(res){
            if(res.success){
                Toast('保存成功！');  
                router.history.go(-1);
                //清空导游现付输入的表单数据
                model.$store.dispatch('tgapp/meal/clearData');
            }else{
                Toast('保存失败！');
            }        
        };
        var callback_hotel = function(res){
            if(res.success){
                Toast('保存成功！');  
                router.history.go(-1);
                //清空导游现付输入的表单数据
                model.$store.dispatch('tgapp/hotel/clearData');
            }else{
                Toast('保存失败！');
            }        
        };
        var callback_ticket = function(res){
            if(res.success){
                Toast('保存成功！');  
                router.history.go(-1);
                //清空导游现付输入的表单数据
                model.$store.dispatch('tgapp/ticket/clearData');
            }else{
                Toast('保存失败！');
            }        
        };
        var callback_car = function(res){
            if(res.success){
                Toast('保存成功！');  
                router.history.go(-1);
                //清空导游现付输入的表单数据
                model.$store.dispatch('tgapp/car/clearData');
            }else{
                Toast('保存失败！');
            }        
        };
        var callback_other = function(res){
            if(res.success){
                Toast('保存成功！');  
                router.history.go(-1);
                //清空导游现付输入的表单数据
                model.$store.dispatch('tgapp/other/clearData');
            }else{
                Toast('保存失败！');
            }        
        };
        if(this.isPayActive){
          if(this.payBtnActive==1){
            this.$store.dispatch('tgapp/hotel/addConfirm', callback_hotel);
          }else if(this.payBtnActive==2){
            this.$store.dispatch('tgapp/meal/addConfirm',  callback);
          }else if(this.payBtnActive==3){
            this.$store.dispatch('tgapp/ticket/addConfirm', callback_ticket);
          }else if(this.payBtnActive==4){
            this.$store.dispatch('tgapp/car/addConfirm', callback_car);
          }else if(this.payBtnActive==5){
            this.$store.dispatch('tgapp/other/addConfirm', callback_other);
          }
        }        
      },
      billList(){
        let type;
        if(this.isPayActive){
          type = 2;
        }else{
          type = 1;
        }
        let erpId= Number(this.$route.query.erpId)
        let planId= Number(this.$route.query.planId);
        this.$router.push({path:'tgapp-bill-list',query:{erpId:erpId, planId:planId, type:type}})  
      },
      backPage(){
        this.$router.history.go(-1)
        //清空导游现付输入的表单数据
        this.$store.dispatch('tgapp/meal/clearData');
        this.$store.dispatch('tgapp/hotel/clearData');
        this.$store.dispatch('tgapp/car/clearData');
        this.$store.dispatch('tgapp/ticket/clearData');
        this.$store.dispatch('tgapp/other/clearData');
      }

    }
  }
</script>
<style lang="less" scoped>
  .pay-income-tab{
      color:#94C9FF;
      width: 50%;
      height:100%;
      line-height: 45px;
      font-size: 1.2em;
      font-weight: bold;
      font-family: Arial;
  }
  .pay-income-tab-active{
      color:#fff;
      width: 50%;
      height:100%;
      line-height: 45px;
      font-size: 1.2em;
      font-weight: bold;
      font-family: Arial;
  }
  .pay-income-split{
    width:1px;
    height:30px;
    background-color: #69B3FF;
  }
  .pay-income-toolbar{
    height:76px;
    background-color:#fff;    
    border-bottom: 1px solid #F2F6FC;
  }
  .pay-income-toolbar-hide{
    display: none;
  }
  .pay-income-btn{
    display: inline-block;
    width: 40px;
    height: 60px;
    line-height:27px;
    margin-top:10px;
    margin-left: 10px;
    margin-right:10px;    
    text-align:center;
    font-size: 1.4em;
    color:#C0C4CC;
  }
  .pay-income-btn-icon{
    width: 40px;
    height: 40px;
    border-radius:25px;
    background-color: #EDEDED;
    text-align:center;
  }
  .pay-income-btn-icon img{
    width:25px;
    height:25px;
    margin-top:8px;
  }
  .pay-income-btn-active{
    color:#409EFF;
    width: 40px;
    height: 40px;    
  }   
  .pay-income-btn-icon-active{
    background-color: #409EFF;
  }
  .added-desc{
    width:100%;
    height:25px;
    line-height: 25px;
    background-color:#fff;
    border-bottom: 1px solid #F2F6FC;
    color: #DEBFA9;
    font-size:1.2em;
  }
  .added-desc span{
    margin-left: 8px;
  }
  .pay-income-add{
    width:100%;  
    margin-bottom: 50px;  
  }
  .pay-income-add-content{
    display:none;
  }
  .pay-income-add-content-active{
    display:block;
  }
  .buttom-toolbar {
    display: block;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    line-height:  50px;
    font-size: 1.4em;
    border-top: 1px solid #EDEDED;
    background-color: #fff;
  }
  .back-btn{
    float: left;
    width: 65px;
    text-align: center;
    border-right: 1px solid #EDEDED;
    color: #909399;
  }
  .again-add-btn{
    float: left;
    width: 90px;
    text-align: center;
    color: #101010;
  }
  .confirm-save-btn{
    overflow:hidden;
    text-align: center;
    background-color: #409EFF;
    color:#fff;
  }

</style>