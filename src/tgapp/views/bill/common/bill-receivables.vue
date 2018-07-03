<template>
  <div id="receivables_testclass">
    <!--金额输入-->
    <div class="receivables_toolbar_box">
      <div class="receivables_price_toolbar">
        <div class="left_box">
          <div class="receivables_currency_box">
            <span class="receivables_currency">{{ currencyType }}</span><br>
            <span class="receivables_currency_code">USD</span>
            <img class="receivables_down_icon" src="assets/down.svg" @click="currency_box_show">
          </div>
        </div>
        <div class="middle_box">
            <input class="receivables_price_in_input" type="number" placeholder="0.00" :disabled="isDisabled" v-model="input_content" @input="countTotalMoney">
          <div class="receivables_clear_price">
              <img src="assets/close.svg" @click="clear_input_content">
          </div>
          <span class="receivables_dashed_line"></span>
        </div>
        <div class="right_box">
          <div class="receivables_add_time" @click="open('addtime_picker')" size="large" :startDate="startDate">{{addTimeValue}}
              <img class="time_icon" src="assets/time.svg">
          </div>
            <mt-datetime-picker
            ref="addtime_picker"
            type="date"
            v-model="query.startDate"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            @confirm="handleChange_addTime">
            </mt-datetime-picker>
        </div>
      </div>
    </div>
    <!--显示汇率-->
    <div class="receivables_price_rate">
      <div class="receivables_total_money">
        <span>人民币：</span><span>{{total_money}}</span>
      </div>
      <div class="receivables_split_line"></div>
      <div class="receivables_rate_box">
        <span>汇率</span>
        <b>{{rate}}</b>
      </div>
    </div>
    <!--选择付款人、填写摘要-->
    <div class="receivables_info_box">
      <div class="receivables_info_content">
        <div class="receivables_choose_box">
            <div class="receivables_info_title">付款人</div>
            <div class="receivables_info_choose_input">
                <input type="text" placeholder="请输入付款人">
            </div>
        </div>
        <div class="receivables_remark">
            <div class="receivables_remark_title">摘要</div>
            <div class="receivables_remark_input">
              <input type="text" placeholder="请输入费用摘要">
            </div>  
        </div>
      </div>
    </div>
    <!--点击下拉显示更多输入内容-->
    <div class="receivables_down_list"  v-show="isHide">
        <div class="receivables_down_list_icon"><img @click="isShow" src="assets/expand_more.svg"></div>
        <div class="receivables_down_list_tip">填写更多可提升70%的通过率</div>
    </div>
    <!--单价数量-->
    <div class="form_info_box" v-show="isShow_price">
        <div class="form_info_content">
            <div class="form_info_big">
                <div class="form_info_price">
                    <div style="width:32%">单价：</div>
                    <div>
                        <input type="number" placeholder="请输入单价" v-model="unit_price" @input="unit_price_change">
                    </div>
                </div>
                <div class="cut_off_line"></div>
                <div class="form_info_num">
                    <div style="width:35%;margin-left:10px;">数量：</div>
                    <div>
                        <input type="number" placeholder="请输入数量" v-model="number" @input="number_change"
                        onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}">
                    </div>
                </div>
            </div>   
        </div>
    </div>
    <!-- 币种选择 -->
    <div class="currency-picker">
      <div class="currency-picker-wrapper">
        <mt-popup  v-model="currencyShow" position="bottom" pop-transition="popup-fade" :modal="true">
          <mt-picker :slots="currencySlot" @change="onCurrencyChange" :visible-item-count="5" style="width:100%;">
          </mt-picker>
        </mt-popup>
      </div>
    </div>
  </div>  
</template>

<script type="text/babel">
 import {
    Toast
  } from "mint-ui";
  export default {
    data() {
        return {
            isShow_receivables : false,
            isShow_price : false,
            isHide : true,
            isform : false,
            isCashActive : true,
            isDisabled:false,
            addTimeValue:DateFmt(new Date(), 'yyyy-MM-dd'),
            startTimeValue:DateFmt(new Date(), 'yyyy-MM-dd'),
            endTimeValue:DateFmt(new Date(), 'yyyy-MM-dd','d+1'),
            startDate: DateFmt(new Date(), 'yyyy-MM-dd', 'y-10'),
            endDate: DateFmt(new Date(), 'yyyy-MM-dd', 'y+10'),
            nights:1,
            total_money:(0).toFixed(2),
            rate:1.001,
            currencyType:'人民币',
            currencyShow:false,
            currencySlot:[{
              flex:1,
              values:['人民币','美元','日元','韩元','英镑','沙币'],
              className:'slot2'
            }],
            unit_price:'',
            number:'',
            input_content:'',
            number: '',
        }
    },
    created() {       
      let erpId= Number(this.$route.query.erpId)
      let planId= Number(this.$route.query.planId);
    },
    computed:{
        query () {
        let query ={};
        query.startDate = DateFmt(new Date(),'yyyy-MM-dd','M');
        // query.endDate = DateFmt(new Date(),'yyyy-MM-dd','d+1');
        return query
        }
    },
    methods: {
        //点击下拉显示
        isShow:function() {
            this.isShow_receivables = true,
            this.isShow_price = true,
            this.isHide = false;
        },
        //添加时间
        open:function(picker) {
            this.$refs[picker].open();
        },
        //选择时间后赋值
        handleChange_addTime(addTimeValue) {
            this.addTimeValue=DateFmt(addTimeValue, 'yyyy-MM-dd');
            this.query.startDate=addTimeValue;
        },
        //计算选择不同币种后的人民币总价
        countTotalMoney:function(){
            this.total_money = (parseFloat(this.input_content)*parseFloat(this.rate)).toFixed(2);
            if(this.input_content<=0){
                Toast('填写金额必须大于0！');
                this.input_content = '';
                this.total_money=(0).toFixed(2);
            }
        },
        //清空金额
        clear_input_content:function(){
            this.input_content = '';
            this.total_money = (0).toFixed(2);
        },
        //签单
        form_tab:function(){
            this.isShow_receivables = true;
            this.isFormActive = true;
            this.isCashActive = false;
            this.isShow_price = true;
            this.isHide = false;
            this.isDisabled = true;
            this.input_content = '';
            this.total_money = (0).toFixed(2);
        },
        //单价验证
        unit_price_change:function(){
            if(this.unit_price!=''){
                if(this.unit_price<=0){
                    Toast('单价必须大于0！');
                    this.unit_price='';
                }
            }
            if((this.number>0) && (this.unit_price>0)){
                this.total_money=((parseFloat(this.number)*parseFloat(this.unit_price))*parseFloat(this.rate)).toFixed(2);
                this.input_content=(parseFloat(this.number)*parseFloat(this.unit_price)).toFixed(2);
            }else{
                this.total_money=(0).toFixed(2);
                this.input_content=(0).toFixed(2);
            }
        },
        //验证数量和金额计算
        number_change:function(){
            if(this.unit_price==''){
                Toast('请输入单价！');
                this.total_money=(0).toFixed(2);
                // this.input_content=(0).toFixed(2);
            }
            if((this.number>0) && (this.unit_price>0)){
                this.total_money=((parseFloat(this.number)*parseFloat(this.unit_price))*parseFloat(this.rate)).toFixed(2);
                this.input_content=(parseFloat(this.number)*parseFloat(this.unit_price)).toFixed(2);
            }else{
                this.total_money=(0).toFixed(2);
                this.input_content=(0).toFixed(2);
            }
        },
        //现收
        cash_tab:function()
        {
             this.isShow_receivables = true;  
             this.isCashActive = true;
             this.isFormActive = false;
             this.isHide = false;
             this.isShow_price = true;
             this.isDisabled = false;
        },
        //币种类型选择变化
        onCurrencyChange(picker, values) {
            this.currencyType = values[0];
        },
        //显示币种下拉
        currency_box_show(){
            this.currencyShow = true;
        }
    }
  }
</script>

<style lang="less" scoped>
#receivables_testclass{
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
    width:12px;
    height:12px;
}
.receivables_price_in_input{
    height:35px;
    line-height: 35px;
    width: 75%;
    height: 35px;
    border: none;
    font-size: 20px;
    // color:#95989D;
    color: #757575;
    background: #FFF;
}
.receivables_dashed_line{
    display: inline-block;
    width: 2px;
    border-right:1px dashed #EDEDED;
    height: 35px;
    vertical-align: middle;
}
.receivables_add_time{
    width:80px;
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
    padding-left: 10px;
    position: relative;
}
.time_icon{
    position: absolute;
    top:20%;
    left: 5%;
    width: 12px;
    height: 12px;
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
    margin-top: 12px;
    margin-left: 15px;
}
.receivables_rate_box>b{
    display:inline;
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
.receivables_receivables_box{
    width: 100%;
}
.receivables_info_content{
    height:104px;
    background: #FFF;
    margin: 0 10px;    
}
.receivables_receivables_content{
    height: 100px;
    background: #FFF;
    margin: 0 10px;
    position: relative;
}
.receivables_time_box{
    margin: 0 15px;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    border-bottom: 1px solid #f3f3f3;
}
.receivables_type{
    width: 70px;
    color: #999;
}
.receivables_type_1{
    text-align: right;
}
.receivables_type_left{
    width: 80%;
    display: flex;
}
.receivables_type_choose{
    margin-left: 10px;
    width: 52%;
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
    width:42px;
}
.receivables_info_choose_input{
    flex:1;
    display: flex;
    margin-right: 5px;
}
.receivables_info_choose_input>input{
    width: 70%;
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
.receivables_down_list{
    text-align: center;
    font-size: 12px;
}
.receivables_down_list_icon{
    height: 20px;
}
.receivables_down_list_icon>img{
    width: 18px;
    height: 18px;
}
.receivables_down_list_tip{
    color: #A4A8AE;
}
.form_info_box{
    padding:0 0 10px 0;
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
.cut_off_line{
    width: 1px;
    height: 30px;
    background: #F1F1F1;
    margin-right: 0px;
    margin-top: 10px;
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
.receivables_mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
}
.search_top_box{
    margin-top: 60px;
    width: 100%;
    position: relative;
}
.receivables_search_input{
    width: 75%;
    height: 27px;
    border-radius: 15px;
    border:1px solid #ddd;
    margin-left: 10px;
    padding-left: 20px;
}
.focus_receivables_search_input{
    width: 75%;
    height: 27px;
    border-radius: 15px;
    border:1px solid #BDBDBD;
    margin-left: 10px;
    padding-left: 20px;
}
.search_icon{
    position: absolute;
    top:5px;
    right: 18%;
    width: 20px;
    height: 20px;
}
.close_search_box{
    margin-left: 5px;
}
.search_result_box{
    width: 100%;
    opacity: 0.8;
    height: 100%;
}
.searck_result_list{
    padding: 0;
    margin: 0;
    height: 95%;
    padding-top:20px;
}
.searck_result_list>li{
    list-style: none;
    font-size: 14px;
    padding: 8px 25px;
}
.search_result_tips{
    width: 100%;
    text-align: center;
    margin-top: 20px;
    color: #BDBDBD;
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