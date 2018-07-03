<template>
  <div>
    <header class="mint-header is-fixed">
      <div class="mint-header-button is-left" @click="$router.history.go(-1)">
        <my-icon href="fanhui" size="22" style="fill:#fff"></my-icon>
      </div>
      <div class="center-button single-over">
        <span class="header-title single-over middle-span">团款代收</span>        
      </div>
    </header>    
    <div style="height:40px"></div>
        
    <div class="content">
    <!--金额输入-->
    <div class="receivables_toolbar_box">
      <div class="receivables_price_toolbar">
        <div class="left_box">
          <div class="receivables_currency_box">
            <span class="receivables_currency">{{ receivables_sel.theCurName }}</span><br>
            <span class="receivables_currency_code">{{receivables_sel.theCur}}</span>
            <img class="receivables_down_icon" src="assets/down.svg" @click="currency_box_show">

          </div>
        </div>
        <div class="middle_box">
            <input class="receivables_price_in_input" type="text" placeholder="0.00" v-model="receivables_sel.theAmount"  v-bind:readonly="editDisable">
          <div class="receivables_clear_price" style="display:none;">
              <img src="assets/close.svg" @click="clear_theAmount">
          </div>
          <span class="receivables_dashed_line"></span>
        </div>
        <div class="right_box">
          <div class="receivables_add_time" @click="add_time"><div style="float:left;margin-top: 3px;margin-left:3px;"><img src="assets/alarm.svg"></div>{{receivables_sel.payDate? DateFmt(receivables_sel.payDate, 'yyyy-MM-dd'):''}}</div> 
                <mt-datetime-picker
                ref="addtTime"
                type="date"
                v-model="receivables_sel.payDate"
                year-format="{value} 年"
                month-format="{value} 月"
                date-format="{value} 日"
               >
                </mt-datetime-picker>
        </div>
      </div>
    </div>
    <!--显示汇率-->
    <div class="receivables_price_rate">
      <div class="receivables_total_money">
        <span>人民币：</span><span>￥{{receivables_sel.amount}}</span>
      </div>
      <div class="receivables_split_line"></div>
      <div class="receivables_rate_box">
        <span>汇率</span>
        <b>{{receivables_sel.theRate?receivables_sel.theRate.toFixed(4):'1.0000'}}</b>
      </div>
    </div>
    <!--填写付款人、摘要-->
    <div class="receivables_info_box">
      <div class="receivables_info_content">
        <div class="receivables_choose_box">
            <div class="receivables_info_title">付款人</div>
            <div class="receivables_info_choose_input">
                <input type="text" placeholder="请输入付款人" v-model="receivables_sel.payman" v-bind:readonly="editDisable">
            </div>            
        </div>
        <div class="receivables_remark">
            <div class="receivables_remark_title">摘要</div>
            <div class="receivables_remark_input">
              <input type="text" placeholder="请输入费用摘要" v-model="receivables_sel.title" v-bind:readonly="editDisable">
            </div>  
        </div>
      </div>
    </div>       
    <!--单价数量-->
    <div class="form_info_box">
        <div class="form_info_content">
            <div class="form_info_big">
                <div class="form_info_price">
                    <div>单价：</div>
                    <div>
                        <input type="text" placeholder="请输入单价" v-model="receivables_sel.thePrice"  v-bind:readonly="editDisable">
                    </div>
                </div>
                <div class="form_info_num">
                    <div>数量：</div>
                    <div>
                        <input type="text" placeholder="请输入数量" v-model="receivables_sel.theNum"  v-bind:readonly="editDisable">
                    </div>
                </div>
            </div>   
        </div>
    </div>  
    <!-- 币种选择 -->
    <div class="currency-picker">
      <div class="currency-picker-wrapper">
        <mt-popup  v-model="currencyShow" position="bottom" pop-transition="popup-fade" :modal="true">
          <mt-picker :slots="currencySlot" @change="onCurrencyChange" :visible-item-count="3" style="width:100%;">
          </mt-picker>
        </mt-popup>
      </div>
    </div> 
  </div>    

    <div class="buttom-toolbar">
       <div class="back-btn" @click="$router.history.go(-1)">返回</div>
       <!--<div class="again-add-btn">再记一笔</div>-->
       <div class="confirm-del-btn" @click="deleteRecode">删除</div> 
       <div class="confirm-save-btn" @click="confirm">确认收款</div> 
       
    </div>  
        
  </div>  
</template>



<script>
    import {
    Toast
  } from "mint-ui";
  import receivablesComponent from './common/bill-receivables.vue';
  export default {
    name: "component_name",
    data() {
      return {
        isHide : true,              
        startDate: DateFmt(new Date(), 'yyyy-MM-dd', 'y-10'),
        endDate: DateFmt(new Date(), 'yyyy-MM-dd', 'y+10'),
        number: 0,
        editDisable: true,
        popupVisible:false,
        currencyShow:false,        
        currencySlot:[{
          flex:1,
          values:['人民币','美元','日元','韩元','英镑','沙币'],
          className:'slot2'
        }]
        // query:{
        //    startDate:DateFmt(new Date, 'yyyy-MM-dd','M-1'),
        //    endDate:DateFmt(new Date, 'yyyy-MM-dd')
        // }
      };
    },
    components: {receivablesComponent},  
    created() {       
      let erpId= Number(this.$route.query.erpId);
      let planId= Number(this.$route.query.planId);
      let id= Number(this.$route.query.id);
      let status= Number(this.$route.query.status);
      this.$store.dispatch('tgapp/editReceivables/change_erpId', erpId)
      this.$store.dispatch('tgapp/editReceivables/change_planId', planId)
      this.$store.dispatch('tgapp/editReceivables/change_editId', id)
      this.$store.dispatch('tgapp/editReceivables/change_status', status)
      this.$store.dispatch('tgapp/editReceivables/receivables_sel');
    },
    computed: {
    //   query () {
    //     query.startDate = DateFmt(query.startDate,'yyyy-MM-dd')
    //     return query
    //   },
      receivables_sel() {
        let record = this.$store.getters['tgapp/editReceivables/receivables_sel'];
        if(record){            
            if(record.theAmount&&typeof(record.theAmount)=='number'){
                record.theAmount = record.theAmount.toFixed(2);
            }
            if(record.amount&&typeof(record.amount)=='number'){
                record.amount = record.amount.toFixed(2);
            }
            if(record.thePrice&&typeof(record.thePrice)=='number'){
                record.thePrice = record.thePrice.toFixed(2);
            }
        }
        return record;
      },
      // theAmount: {
      //   get () {
      //     let receivables_sel=this.$store.getters['tgapp/editReceivables/receivables_sel'];  
      //     return receivables_sel.theAmount;
      //   },
      //   set (val) {
      //    let receivables_sel=this.$store.getters['tgapp/editReceivables/receivables_sel'];  
      //    receivables_sel.theAmount = val;
      //     this.$store.commit('change_receivables_sel', receivables_sel)
      //   }
      // }
     
    },
    methods: {    
        //收款日期
        add_time(){
            this.$refs.addtTime.open(); 
        },       
        handleConfirm(startTime,value){
            console.log(this.$refs.startTime.value);
        },
        currency_box_show(){
            if(!this.editDisable){
                this.currencyShow = true;
            }            
        },
        clear_theAmount(){
            if(!this.editDisable){
                let receivables_sel=this.$store.getters['tgapp/editReceivables/receivables_sel']; 
                receivables_sel.theAmount = '';
                this.$store.commit('change_receivables_sel', receivables_sel)
            }
        },
        onCurrencyChange(picker, values) {
            let receivables_sel=this.$store.getters['tgapp/editReceivables/receivables_sel']; 
            receivables_sel.theCurName = values[0];
        },
        confirm(){
          let router = this.$router; 
          this.$store.dispatch('tgapp/editReceivables/confirm',  function(res){
                if(res.success){
                    Toast('保存成功！');  
                    router.history.go(-1);
                }else{
                    Toast('保存失败！');
                }              
          });
        },
        deleteRecode(){
          let router = this.$router;   
          this.$store.dispatch('tgapp/editReceivables/delete', function(res){
               if(res.success){
                    Toast('删除成功！');  
                    router.history.go(-1);
                }else{
                    Toast('删除失败！');
                }    
          });
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


content{
    width:100%;
    height:100%;
    color:000;
}
.receivables_toolbar_box{
    width: 100%;
    height:66px;
    background-color:#fff;
    border-bottom:1px dashed #F3F7FC;
}
.receivables_price_toolbar{
    width:100%;
    height:35px;
    padding:15px 0;
    background-color:#fff;
    display: flex;
    flex-flow: row;
}
.left_box{
    width: 65px;
    margin-left:15px;
}
.middle_box{
    width: 100%;
    flex:1;
    display: flex;
    justify-content: space-between;
    position:relative;
}
.right_box{
    width: 100px;
    margin-right:15px;
}
.receivables_currency_box{
    width: 45px;
    height:35px;
    position:relative;
}
.receivables_currency{
    font-size: 12px;
    color: #909399; 
}
.receivables_currency_code{
    color: #606266;
    font-size:16px;
    font-weight: bold;
    letter-spacing: 1px; 
    margin-top: 5px;
}
.receivables_down_icon{
  width:12px;
  height:12px;
  position: absolute;
  top:10px;
  left:45px;
}
.receivables_clear_price{
    width: 25px;
    height: 35px;
    line-height: 35px;
    margin-left: 5px;
    position: absolute;
    top:0;
    right:0;
}
.receivables_clear_price>img{
    width:18px;
    height:18px;
    margin-top: 10px;
}
.receivables_price_in_input{
    height:35px;
    line-height: 35px;
    width: 75%;
    height: 35px;
    border: none;
    font-size: 20px;
    color:#95989D;
}
.receivables_dashed_line{
    display: inline-block;
    width: 2px;
    border-right:1px dashed #EDEDED;
    height: 35px;
    vertical-align: middle;
}
.receivables_add_time{
  width:93px;
  height:25px;
  margin-top: 5px;
  margin-left: 10px;
  background: #EDEDED;
  font-size:12px;
  border-radius: 12px;
  vertical-align: middle;
  line-height: 25px;
  text-align: center;
  color:#C0C4CC;
}
.receivables_price_rate{
    width:100%;
    height: 35px;
    background-color:#fff;
    display: flex;
    flex-flow: row;
    
}
.receivables_total_money,.receivables_rate_box{
    padding:10px 0;
    margin-left: 15px;
    line-height: 15px;
}
.receivables_total_money>span,.receivables_rate_box>span{
    font-size: 12px;
    color: #ccc;
}
.receivables_split_line{
    width: 2px;
    height:10px;
    border-right:1px solid #ccc;
    margin-top: 15px;
    margin-left: 15px;
}
.receivables_rate_box>b{
    display:inline-block;
    font-size: 12px;
    background: #F2F6FC;
    color: #FCAC36;
    padding:3px 15px;
    border-radius: 10px;
    transform: translateY(-2px);
    margin-left: 5px;
}
.receivables_info_box{
    width: 100%;
    padding:10px 0;
}
.receivables_info_content{
    height:104px;
    background: #FFF;
    margin: 0 10px;    
}
.hoetel_room_content{
    height: 150px;
    background: #FFF;
    margin: 0 10px;
}
.hoetel_room_content_top{
    display: flex;
    flex-flow: row;
    width:100%;
}
.receivables_choose_box,.receivables_remark{
    margin: 0 15px;
    height: 50px;
    display: flex;
    flex-flow: row;
}
.receivables_choose_box{
    border-bottom: 1px solid #F3F3F3;
}
.receivables_info_content{
    line-height: 50px;
}
.receivables_info_title,.receivables_remark_title{
    font-size: 14px;
    margin-right: 20px;
    color: #606266;
}
.receivables_info_choose_input{
    flex:1;
    display: flex;
    margin-right: 5px;
}
.receivables_info_choose_input>input{
    width: 60%;
    border: none;
}
.receivables_info_choose_input>input::-webkit-input-placeholder{ /*WebKit browsers*/
    color:#B0B4B3;
}
.receivables_info_choose_input>input::-moz-input-placeholder{ /*Mozilla Firefox*/
    color:#B0B4B3;
}
.receivables_info_choose_input>input::-ms-input-placeholder{ /*Internet Explorer*/ 
    color:#B0B4B3;
}
.receivables_remark_input{
    flex: 1;
    border: none;
}
.receivables_remark_input>input{
    border: none;
    width: 100%;
}
.receivables_remark_input>input::-webkit-input-placeholder{ /*WebKit browsers*/
    color:#C0C4CC;
}
.receivables_remark_input>input::-moz-input-placeholder{ /*Mozilla Firefox*/
    color:#C0C4CC;
}
.receivables_remark_input>input::-ms-input-placeholder{ /*Internet Explorer*/ 
    color:#C0C4CC;
}
.form_info_box{
    padding:10px 0;
    width: 100%;
    height: 50px;
}
.form_info_content{
    margin: 0 10px;
    background: #FFF;
    height: 50px;
    line-height: 50px;
}
.form_info_big{
    margin: 0 15px;
    display: flex;
}
.form_info_price,.form_info_num{
    width: 50%;
    font-size: 14px;
    display: flex;
    height: 50px;
}
.form_info_price>div:nth-child(2),.form_info_num>div:nth-child(2){
    margin-left: 10px;
    width: 60%;
}
.form_info_price>div:nth-child(2)>input,.form_info_num>div:nth-child(2)>input{
    width: 90%;
    border: none;
}
.form_info_price>div:nth-child(2)>input::-webkit-input-placeholder,.form_info_num>div:nth-child(2)>input::-webkit-input-placeholder{ /*WebKit browsers*/
    color:#C0C4CC;
}
.form_info_price>div:nth-child(2)>input::-moz-input-placeholder,.form_info_num>div:nth-child(2)>input::-webkit-input-placeholder{ /*Mozilla Firefox*/
    color:#C0C4CC;
}
.form_info_price>div:nth-child(2)>input::-ms-input-placeholder,.form_info_num>div:nth-child(2)>input::-webkit-input-placeholder{ /*Internet Explorer*/ 
    color:#C0C4CC;
} 
.mint-popup{
  width: 100%;
}
@component-namespace page {
    @component picker {
      padding: 0 10px 20px;
      @descendent wrapper {
        background-color: #fff;
        text-align: center;
      }
      @descendent desc {
        margin: 10px 0 50px;
      }
      .mint-button {
        margin-top: 15px;
      }
    }
  }

</style>