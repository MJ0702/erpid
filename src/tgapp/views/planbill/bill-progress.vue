<template>
  <div>
    <header class="mint-header is-fixed">
      <div class="mint-header-button is-left" @click="$router.history.go(-1)">
        <my-icon href="fanhui" size="22" style="fill:#fff"></my-icon>
      </div>
      <div class="center-button single-over">
        <span class="header-title single-over middle-span">报账进度</span>        
      </div>
    </header>
    <div style="height:40px"></div>
    <div class="success-content">
      <img src="assets/success.png"/><div class="success-msg">提交成功</div>
      <hr class="submit-split">
    </div>    
    <div class="plan-con">
      <div class="line-title">【跟团游】三亚5天4晚真正的纯玩！蜈支洲岛畅玩一整天 特别赠1晚世界品牌温德姆海景房</div>
      <hr class="hr-split">
      <div class="bill-sum">
        <div class="bill-borrow">借款<br><span>￥1245.00</span></div>
        <div class="amount-split"></div>
        <div class="bill-final">报账合计<br><span>-￥300.00</span></div>
      </div>
    </div>  
    <div class="see-detail">
      <div class="see-detail-btn" @click="billList()">查看报账详情</div>
    </div>  

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
       
      };
    },
    created() {
      

    },
    computed: {
     
    },
    methods: {
      billList(){              
        let erpId=this.$store.getters['tgapp/planBill/erpId'];
        let planId=this.$store.getters['tgapp/planBill/planId']; 
        this.$store.dispatch('tgapp/planBill/change_erpId', erpId)
        this.$store.dispatch('tgapp/planBill/change_planId', planId)
        this.$store.dispatch('tgapp/planBill/change_turnToList', true)
        this.$router.history.go(-1);
        // this.$router.push({path:'tgapp-plan-bill'})  
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

  .success-content{
    width: 100%;
    text-align: center;
    background-color: #fff;
    height: 140px;
  }
  .success-content img{
    width: 75px;
    height: 60px;
    margin-top: 20px;
    margin-left: 16px;
  }
  .success-msg{
    font-size: 1.4em;
    color: #409EFF;
    line-height: 22px;
  } 
  .submit-split{
    margin-top: 18px;
    border: 0px;
    border-top: 1px dashed #409EFF;
  }

  .plan-con{
    width:100%;
    height: 140px;
    background-color: #fff;
  }
  .line-title{    
    height:45px;
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
    display: flex;
  }
  .bill-borrow{
    flex: 1;
    font-size:  1.4em;
    color: #909399;
    margin-left: 8px;
    margin-top: 10px;
    min-width: 90px;
    text-align: center;
    line-height: 26px;
  }
  .bill-final{
    flex:1;
    font-size: 1.4em;
    color: #909399;
    margin-right: 8px;
    margin-top: 10px;
    min-width: 90px;
    text-align: center;
    line-height: 26px;
  }
  .bill-borrow span{
    font-size: 16px;
    color: #F56C6C;
    font-weight: 600;
  }
  .bill-final span{
    font-size: 16px;
    color: #67C23A;
    font-weight: 600;
  }
  .amount-split{
    border-right: 1px solid #F5F5F5;
    width:1px;
    height: 40px;
    margin-top: 10px;
  }
  .see-detail{
    width: 100%;
    background-color: #fff;  
    margin-top: 10px;  
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .see-detail-btn{
    margin-left: 20px;
    margin-right: 20px;
    height: 40px;
    line-height: 40px;
    background-color: #409EFF;
    border-radius: 21212px;
    text-align: center;
    font-size: 1.4em;
    color: #fff;
  }

</style>