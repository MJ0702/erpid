<template>
  <div>
    <header class="mint-header is-fixed">
      <div class="mint-header-button is-left" @click="backPage">
        <my-icon href="fanhui" size="22" style="fill:#fff"></my-icon>
      </div>
      <div class="center-button single-over">
        <span class="header-title single-over middle-span">现付-景</span>        
      </div>
    </header>    
    <div style="height:40px"></div>
    <div><ticketComponent></ticketComponent></div>    
     

    <div class="buttom-toolbar">
       <div class="back-btn" @click="backPage">返回</div>
       <!--<div class="again-add-btn">再记一笔</div>-->
       <!-- <div class="confirm-del-btn" @click="deleteRecode">删除</div>  -->
       <div class="confirm-del-btn"><mt-button @click.native="openConfirm" size="large">删除</mt-button></div> 
       <div class="confirm-save-btn" @click="confirm">确认付款</div> 
       
    </div>  
        
  </div>  
</template>



<script>
    import {
    Toast,MessageBox
  } from "mint-ui";
  import ticketComponent from './common/bill-ticket.vue';
  export default {
    name: "component_name",
    data() {
      return {
        isShow_ticket : true,
        isShow_price : true,
        isHide : false,
      };
    },
    components: {ticketComponent},  
    created() {       

    },
    computed: {

    },
    methods: {    
        confirm(){
          let router = this.$router; 
          let model = this;
          this.$store.dispatch('tgapp/ticket/confirm',  function(res){
                if(res.success){
                    Toast('保存成功！'); 
                    router.history.go(-1);
                    //清空导游现付输入的表单数据
                    model.$store.dispatch('tgapp/ticket/clearData');
                }else{
                    Toast('保存失败！');
                }              
          });
        },
        openConfirm() {
          MessageBox.confirm('',{
            message:'确定要删除吗？',
            title:'提示',
          }).then(action => {
            if(action == "confirm"){
              this.deleteRecode();
            }
          })
        },
        deleteRecode(){
          let router = this.$router; 
          let model = this;  
          this.$store.dispatch('tgapp/ticket/delete', function(res){
               if(res.success){
                    Toast('删除成功！');  
                    router.history.go(-1);
                    //清空导游现付输入的表单数据
                    model.$store.dispatch('tgapp/ticket/clearData');
                }else{
                    Toast('删除失败！');
                }    
          });
        },
        backPage(){
          this.$router.history.go(-1)
          //清空导游现付输入的表单数据
          this.$store.dispatch('tgapp/ticket/clearData');
        }
    }
  }
</script>
<style lang="less" scoped>
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
    border-right: 1px solid #EDEDED;
  }
  .confirm-save-btn{
    overflow:hidden;
    text-align: center;
    background-color: #409EFF;
    color:#fff;
  }
  .confirm-del-btn{
    float: left;
    width: 90px;
    text-align: center;
    color: #101010;    
  }
  .mint-button--large {
    display: block;
    width: 100%;
    height: 51px;
    background: #FFF;
    border: none;
    font-size: 14px;
    color: #909399;
}
.mint-button--default{
  box-shadow: none;
}


</style>