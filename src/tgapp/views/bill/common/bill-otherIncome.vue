<template>
  <div id="otherPay_testclass">
    <!--金额输入-->
    <div class="otherPay_toolbar_box">
      <div class="otherPay_price_toolbar">
        <div class="left_box">
          <div class="otherPay_currency_box">
            <span class="otherPay_currency">{{ currencyType }}</span><br>
            <span class="otherPay_currency_code">USD</span>
            <img class="otherPay_down_icon" src="assets/down.svg" @click="currency_box_show">
          </div>
        </div>
        <div class="middle_box">
            <input class="otherPay_price_in_input" type="number" placeholder="0.00" :disabled="isDisabled" v-model="input_content" @input="countTotalMoney">
          <div class="otherPay_clear_price">
              <img src="assets/close.svg" @click="clear_input_content">
          </div>
          <span class="otherPay_dashed_line"></span>
        </div>
        <div class="right_box">
          <div class="otherPay_add_time" @click="open('addtime_picker')" size="large" :startDate="startDate">{{addTimeValue}}
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
    <div class="otherPay_price_rate">
      <div class="otherPay_total_money">
        <span>人民币：</span><span>{{total_money}}</span>
      </div>
      <div class="otherPay_split_line"></div>
      <div class="otherPay_rate_box">
        <span>汇率</span>
        <b>{{rate}}</b>
      </div>
    </div>
    <!--选择名称、填写摘要-->
    <div class="otherPay_info_box">
      <div class="otherPay_info_content">
        <div class="otherPay_remark">
            <div class="otherPay_remark_title">摘要</div>
            <div class="otherPay_remark_input">
              <input type="text" placeholder="请输入费用摘要">
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
            isShow_otherPay : false,
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
            currencyType:'人民币',
            currencyShow:false,
            currencySlot:[{
              flex:1,
              values:['人民币','美元','日元','韩元','英镑','沙币'],
              className:'slot2'
            }],
            rate:1.001,
            unit_price:'',
            number:'',
            input_content:'',
            number: ''
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
        //房型内容选择变化
        onotherPayChange(picker, values) {
            this.otherPayType = values[0];
        },
        //房型内容选择变化
        onCurrencyChange(picker, values) {
            this.currencyType = values[0];
        },
        onPriceChange(picker, values) {
            this.priceType = values[0];
        },
        //显示币种下拉
        currency_box_show(){
            this.currencyShow = true;
        },
        price_choose_box(){
            this.priceShow = true;
        }
    }
  }
</script>

<style lang="less" scoped>
#otherPay_testclass{
    width:100%;
    height:100%;
    color:000;
}
.otherPay_toolbar_box{
    width: 100%;
    height:66px;
    background-color:#fff;
    border-bottom:1px dashed #F3F7FC;
}
.otherPay_price_toolbar{
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
.otherPay_currency_box{
    width: 45px;
    height:35px;
    position:relative;
}
.otherPay_currency{
    font-size: 12px;
    color: #909399; 
}
.otherPay_currency_code{
    color: #606266;
    font-size:16px;
    font-weight: bold;
    letter-spacing: 1px; 
    margin-top: 5px;
}
.otherPay_down_icon{
  width:12px;
  height:12px;
  position: absolute;
  top:10px;
  left:45px;
}
.otherPay_clear_price{
    width: 25px;
    height: 35px;
    line-height: 35px;
    margin-left: 5px;
    position: absolute;
    top:0;
    right:0;
}
.otherPay_clear_price>img{
    width:12px;
    height:12px;
}
.otherPay_price_in_input{
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
.otherPay_dashed_line{
    display: inline-block;
    width: 2px;
    border-right:1px dashed #EDEDED;
    height: 35px;
    vertical-align: middle;
}
.otherPay_add_time{
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
.otherPay_price_rate{
    width:100%;
    height: 35px;
    background-color:#fff;
    display: flex;
    flex-flow: row;
    
}
.otherPay_total_money,.otherPay_rate_box{
    padding:10px 0;
    margin-left: 15px;
    line-height: 15px;
}
.otherPay_total_money>span,.otherPay_rate_box>span{
    font-size: 12px;
    color: #ccc;
}
.otherPay_split_line{
    width: 2px;
    height:10px;
    border-right:1px solid #ccc;
    margin-top: 12px;
    margin-left: 15px;
}
.otherPay_rate_box>b{
    display:inline;
    font-size: 12px;
    background: #F2F6FC;
    color: #FCAC36;
    padding:3px 15px;
    border-radius: 10px;
    transform: translateY(-2px);
    margin-left: 5px;
}
.otherPay_info_box{
    width: 100%;
    padding:10px 0;
}
.otherPay_info_content{
    height:45px;
    background: #FFF;
    margin: 0 10px; 
    line-height:45px;   
}
.otherPay_remark{
    margin: 0 15px;
    height: 45px;
    display: flex;
    flex-flow: row;
}
.otherPay_remark_title{
    font-size: 14px;
    margin-right: 20px;
    color: #606266;
}
.otherPay_remark_input{
    flex: 1;
    border: none;
}
.otherPay_remark_input>input{
    border: none;
    width:100%;
}
.otherPay_remark_input>input::-webkit-input-placeholder{ /*WebKit browsers*/
    color:#C0C4CC;
}
.otherPay_remark_input>input::-moz-input-placeholder{ /*Mozilla Firefox*/
    color:#C0C4CC;
}
.otherPay_remark_input>input::-ms-input-placeholder{ /*Internet Explorer*/ 
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