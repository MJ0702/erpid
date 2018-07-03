<template>
  <div>
    <div class="list-item"  v-for="item in receivables_list" @click="editItem(item)">
      <div class="flex">
        <div class="payman">{{ item.payman==null||item.payman=='' ? '付款人(无)' : item.payman }}</div>
        <div :class="item.amount>=0 ? 'amount plus' : 'amount reduce' ">{{ item.amount >=0 ? '+' : '-' }}￥{{Math.abs(item.amount).toFixed(2)}}</div>
      </div>
      <div class="flex">
        <div class="detail">明细：单价  ￥{{item.thePrice?item.thePrice.toFixed(2):''}}  <span class="split-text">|</span> 数量 {{item.theNum}}人</div>
        <div class="pay-date">{{item.payDate?DateFmt(new Date(item.payDate), 'yyyy-MM-dd'):''}}</div>
      </div>
      <hr class="split-hr">
      <div class="flex">
        <div class="remark single-over">摘要： {{item.title}}</div>
        <div :class="item.status=='0' ? 'confirm-btn' : 'confirm-text' "> {{ item.status=='0' ? '确认收款' : '已确认' }}</div>   
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
        
      };
    },
    props:{
      receivables_list:{
        type: Array,
        requested:true
      }
    },  
    created() {       
      
    },
    computed: {
      
    },
    methods: {
      editItem(item){
        let erpId=this.$route.query.erpId;
        let planId=this.$route.query.planId;
        let id = item.id;
        let status = item.status;
        this.$router.push({path:'tgapp-bill-edit-receivables',query:{erpId:erpId, planId:planId, id:id, status:status }});
      }
    }
  }
</script>

<style lang="less" scoped>
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
  color: #F56C6C;
  font-weight: bold;
  font-size: 1.8em;
  line-height: 26px;
}
.list-item .plus{
  color: #F56C6C;
}
.list-item .reduce{
  color: #67C23A;
}
.list-item .detail{
  flex: 1;
  font-size: 1.2em;
  text-align:left;
  color: #909399;
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


</style>