<template>
  <div>
    <header class="mint-header is-fixed" style="height:45px;">      
      <div :class="activeTab==1 ? 'list-tab list-tab-active' : 'list-tab' " @click="tabChange(1)">团款代收
        <br><center><div :class="activeTab==1 ? 'tab-active-line' : '' "></div></center>
      </div>
      <div :class="activeTab==2 ? 'list-tab list-tab-active' : 'list-tab' " @click="tabChange(2)">导游付款
        <br><center><div :class="activeTab==2 ? 'tab-active-line' : '' "></div></center>
      </div>
      <div :class="activeTab==3 ? 'list-tab list-tab-active' : 'list-tab' " @click="tabChange(3)">购物登记
        <br><center><div :class="activeTab==3 ? 'tab-active-line' : '' "></div></center>
      </div>
      <div :class="activeTab==4 ? 'list-tab list-tab-active' : 'list-tab' " @click="tabChange(4)">其它收入
        <br><center><div :class="activeTab==4 ? 'tab-active-line' : '' "></div></center>
      </div>
    </header> 
    <div style="height:45px"></div>

    <div class="tab-list">
   
      <div id="receivablesList" :class="activeTab==1 ? 'tab-list-content-active' : 'tab-list-content' ">
        <receivablesListComponent v-bind:receivables_list="receivables_list"></receivablesListComponent>
      </div>
      <div id="payList" :class="activeTab==2 ? 'tab-list-content-active' : 'tab-list-content' ">
        <payListComponent v-bind:pay_list="pay_list"></payListComponent>
      </div>
      <div id="shoppingList" :class="activeTab==3 ? 'tab-list-content-active' : 'tab-list-content' "><shoppingListComponent></shoppingListComponent></div>
      <div id="otherIncomeList" :class="activeTab==4 ? 'tab-list-content-active' : 'tab-list-content' "><otherIncomeListComponent></otherIncomeListComponent></div>      
    
    </div>        
    
    <div class="buttom-toolbar">
       <div class="back-btn" @click="$router.history.go(-1)">返回</div>
       <div class="bill-add-btn" @click="billAdd()">添加报账</div> 
    </div>  
        
  </div>  
</template>


<script>
    import {
    Toast
  } from "mint-ui";   
  import receivablesListComponent from './common/bill-list-receivables.vue';
  import payListComponent from './common/bill-list-pay.vue';
  import shoppingListComponent from './common/bill-list-shopping.vue';
  import otherIncomeListComponent from './common/bill-list-otherIncome.vue';
  export default {
    name: "component_name",
    data() {
      return {
        activeTab: 1
      };
    },
    components: {receivablesListComponent,payListComponent,shoppingListComponent,otherIncomeListComponent},  
    created() {        
      let erpId= Number(this.$route.query.erpId);
      let planId= Number(this.$route.query.planId);
      this.$store.dispatch('tgapp/billList/change_erpId', erpId)
      this.$store.dispatch('tgapp/billList/change_planId', planId)
      let tabActivity= Number(this.$route.query.type);
      if(tabActivity){
        // let tabActivity=this.$store.getters['tgapp/billList/tabActivity']; 
        this.$store.dispatch('tgapp/billList/change_tabActivity', tabActivity)
        this.activeTab = tabActivity;        
      }   
      this.$store.dispatch('tgapp/billList/change_pay_list_query', {type: ''});
      this.$store.dispatch('tgapp/billList/receivables_list');
      this.$store.dispatch('tgapp/billList/pay_list');      
    },
    computed: {
      receivables_list() {
        return this.$store.getters['tgapp/billList/receivables_list']
      },
      pay_list() {
        return this.$store.getters['tgapp/billList/pay_list']
      },
      erpId() {
        return this.$store.getters['tgapp/billList/erpId']
      },
      planId() {
        return this.$store.getters['tgapp/billList/planId']
      },
      tabActivity(){
        return this.$store.getters['tgapp/billList/tabActivity'];       
      }
    },
    methods: {
      tabChange(type){
        this.activeTab = type;
      },
      billAdd(){
        let erpId=this.$store.getters['tgapp/billList/erpId'];
        let planId=this.$store.getters['tgapp/billList/planId'];  
        this.$router.push({path:'tgapp-bill-add',query:{erpId:erpId,planId:planId}});
        this.clickFlag = true;
      }
    }
  }
</script>
<style lang="less" scoped>
  .list-tab{
    width: 25%;
    height: 100%;
    margin-top: 13px;
    line-height: 30px;
    font-size: 1em;
    color: #9FCEFF;
    font-weight: bold;
    text-align: center;
  }
  .list-tab-active{
    color: #fff;
  }
  .tab-active-line{
    width: 20px;
    height: 2px;
    background-color: #fff;
  }
  .tab-list{
    width:100%;
    margin-bottom: 50px;
  }
  .tab-list-content{
    display:none;
  }
  .tab-list-content-active{
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
    width: 100px;
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
  .bill-add-btn{
    overflow:hidden;
    text-align: center;
    color:#57B8FF;
  }

 

</style>