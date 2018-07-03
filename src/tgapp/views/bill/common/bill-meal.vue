<template>
  <div id="restaurant_testclass">
    <!--金额输入-->
    <div class="restaurant_toolbar_box">
      <div class="restaurant_price_toolbar">
        <div class="left_box">
          <div class="restaurant_currency_box">
            <span class="restaurant_currency">{{ meal_record.theCurName }}</span><br>
            <span class="restaurant_currency_code">{{meal_record.theCur}}</span>
            <img class="restaurant_down_icon" src="assets/down.svg" @click="currency_box_show">
          </div>
        </div>
        <div class="middle_box">
            <input class="restaurant_price_in_input" type="number" placeholder="0.00" :disabled="isDisabled" v-model="meal_record.cashAmount" @input="countTotalMoney">
          <div class="restaurant_clear_price">
              <img src="assets/close.svg" @click="clear_amount">
          </div>
          <span class="restaurant_dashed_line"></span>
        </div>
        <div class="right_box">
          <div class="restaurant_add_time" @click="open('addtime_picker')" size="large" :startDate="startDate">{{meal_record.cashDate? DateFmt(meal_record.cashDate, 'yyyy-MM-dd'):''}}
              <img class="time_icon" src="assets/time.svg">
          </div>
            <mt-datetime-picker
            ref="addtime_picker"
            type="date"
            v-model="meal_record.cashDate"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            @confirm="handleChange_addTime">
            </mt-datetime-picker>
        </div>
      </div>
    </div>
    <!--显示汇率-->
    <div class="restaurant_price_rate">
      <div class="restaurant_total_money">
        <span>人民币：</span><span>{{meal_record.cashAmountCny}}</span>
      </div>
      <div class="restaurant_split_line"></div>
      <div class="restaurant_rate_box">
        <span>汇率</span>
        <b>{{meal_record.theRate}}</b>
      </div>
    </div>
    <!--选择餐厅、填写摘要-->
    <div class="restaurant_info_box">
      <div class="restaurant_info_content">
        <div class="restaurant_choose_box">
            <div class="restaurant_info_title">餐厅</div>
            <div class="restaurant_info_choose_input">
                <input type="text" placeholder="请选择餐厅" @focus="search_restaurant"  v-model="meal_record.supCpyName">
                <img src="assets/close.svg" style="width:14px;" v-show="isSupName" @click="clear_supName">
            </div>
            <div class="restaurant_info_tab">
                <div :class="isCashActive ? 'restaurant_info_tab_active' : '' " @click="cash_tab" style="margin-right: 8px;line-height: 22px;margin-left:2px;" v-bind="meal_record.guideCheckout">现付</div>
                <div :class="isFormActive ? 'restaurant_info_tab_active' : '' " @click="form_tab" style="line-height: 22px;margin-right:2px;" v-bind="meal_record.guideCheckout">签单</div>
            </div>
        </div>
        <div class="restaurant_remark">
            <div class="restaurant_remark_title">摘要</div>
            <div class="restaurant_remark_input">
              <input type="text" placeholder="请输入费用摘要" v-model="meal_record.title">
            </div>  
        </div>
      </div>
    </div>
    <!--点击下拉显示更多输入内容-->
    <div class="restaurant_down_list"  v-show="isHide">
        <div class="restaurant_down_list_icon"><img @click="isShow" src="assets/expand_more.svg"></div>
        <div class="restaurant_down_list_tip">填写更多可提升70%的通过率</div>
    </div>
    <!--下拉后显示用餐选择-->
    <div class="restaurant_meal_box" v-show="isShow_meal">
        <div class="restaurant_meal_content">
            <div class="restaurant_type">
                <div class="meal_type">
                    <div class="meal_type_title">用餐类别</div>
                    <div class="meal_choice" @click="restaurant_choose_cantype">{{meal_record.costCan.canType}}</div>
                </div>
                <div class="meal_standard">
                    <div class="meal_type_title">用餐标准</div>
                    <div class="meal_choice meal_standard_choice" @click="restaurant_choose_canStandard">{{meal_record.costCan.canStandard}}</div>
                </div>
                <div class="meal_price_type">
                    <div class="meal_type_title">价格类型</div>
                    <div class="meal_choice" @click="restaurant_choose_pricetype">{{meal_record.costCan.priceType}}</div>
                </div>
            </div>
        </div>
    </div>
    <!--单价数量-->
    <div class="form_info_box" v-show="isShow_price">
        <div class="form_info_content">
            <div class="form_info_big">
                <div class="form_info_price">
                    <div style="width:32%;">单价：</div>
                    <div>
                        <input type="number" placeholder="请输入单价" v-model="meal_record.thePrice" @input="unit_price_change">
                    </div>
                </div>
                <div class="cut_off_line"></div>
                <div class="form_info_num">
                    <div style="width:35%;margin-left:10px;">数量：</div>
                    <div>
                        <input type="number" placeholder="请输入数量" v-model="meal_record.theNum" @input="number_change"
                        onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}">
                    </div>
                </div>
            </div>   
        </div>
    </div>   
    <!-- 用餐类别选择 -->
    <div class="page-picker">
      <div class="page-picker-wrapper">
        <mt-popup  v-model="popupCanTypeVisible" position="bottom" pop-transition="popup-fade" :modal="true">
          <mt-picker :slots="canTypedSlot" @change="onCanTypeChange" :visible-item-count="5" style="width:100%;">
          </mt-picker>
        </mt-popup>
      </div>
    </div> 
    <!-- 餐标选择 -->
    <div class="page-picker">
      <div class="page-picker-wrapper">
        <mt-popup  v-model="popupCanStandardVisible" position="bottom" pop-transition="popup-fade" :modal="true">
          <mt-picker :slots="canStandardSlot" @change="onCanStandardChange" :visible-item-count="5" style="width:100%;">
          </mt-picker>
        </mt-popup>
      </div>
    </div>  
    <!-- 价格类型选择 -->
    <div class="page-picker">
      <div class="page-picker-wrapper">
        <mt-popup  v-model="popupPriceTypeVisible" position="bottom" pop-transition="popup-fade" :modal="true">
          <mt-picker :slots="priceTypeSlot" @change="onPriceTypeChange" :visible-item-count="5" style="width:100%;">
          </mt-picker>
        </mt-popup>
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
    <!--搜索框-->
    <transition name="fade">
        <div class="restaurant_mask" v-show="search_mask_box">
            <div class="search_top_box">
            <input type="text" :class=" isFocus ? 'restaurant_search_input' : 'focus_restaurant_search_input' " placeholder="搜索" @focus="search_focus" v-model.trim="skey" autofocus>
            <img class="search_icon" src="assets/search.svg"> 
            <!-- <img class="close_search_box" src="assets/close-c.svg" @click="close_search_box"> -->
            <span class="close_search_box" @click="close_search_box">取消</span>
            </div>  
            <div class="search_result_box">
                <ul class="searck_result_list">
                    <li v-for="item in mealSup_list" @click="search_li_list" v-bind:supCpyId=item.id>{{item.simName}}</li>
                    <div class="search_result_tips">—— 没有更多数据了 ——</div>
                </ul>    
            </div> 
        </div>
    </transition>
  </div>  
</template>

<script type="text/babel">
 import {
    Toast
  } from "mint-ui";
  export default {
    data() {
        return {
            isShow_meal : false,
            isShow_price : false,
            isHide : true,
            isform : false,
            isCashActive : true,
            isSupName:false,
            // isDisabled:false,
            // clear_icon:true,
            addTimeValue:DateFmt(new Date(), 'yyyy-MM-dd'),
            startTimeValue:DateFmt(new Date(), 'yyyy-MM-dd'),
            endTimeValue:DateFmt(new Date(), 'yyyy-MM-dd','d+1'),
            startDate: DateFmt(new Date(), 'yyyy-MM-dd', 'y-10'),
            endDate: DateFmt(new Date(), 'yyyy-MM-dd', 'y+10'),
            // nights:1,
            // total_money:(0).toFixed(2),
            // rate:1.001,
            // unit_price:'',
            // number:'',
            cantype: '',
            canStandard: '',
            pricetype: '',
            currencyType:'人民币',
            curList:'',  //保存币种数组
            // input_content:'',
            // number: '',
            restaurant_name: '',
            skey: '',
            popupCanTypeVisible: false,
            popupCanStandardVisible: false,
            popupPriceTypeVisible: false,
            currencyShow:false,
            canTypedSlot: [{
              flex: 1,
              values: [],
              className: 'slot1'
            }],
            canStandardSlot: [{
              flex: 1,
              values: [],
              className: 'slot1'
            }],
            priceTypeSlot: [{
              flex: 1,
              values: [],
              className: 'slot1'
            }],
            currencySlot:[{
              flex:1,
              values:[],
              className:'slot2'
            }],
            search_mask_box:false,
            isFocus:true
        }
    },
    created() {       
      let erpId= Number(this.$route.query.erpId)
      let planId= Number(this.$route.query.planId);       
      this.$store.dispatch('tgapp/common/change_erpId', erpId)     
      this.$store.dispatch('tgapp/meal/change_erpId', erpId)
      this.$store.dispatch('tgapp/meal/change_planId', planId)
      let record = this.$store.getters['tgapp/meal/meal_record'];
      record.erpid = erpId;
      record.planId = planId;
      record.costCan.erpid = erpId;
      let model = this;
      this.$store.dispatch('tgapp/common/theCur_list', function(list){
          model.curList = list;
          var list_value = [];
          var list_rate = [];
          for(var i=0;i<list.length;i++){
              list_value.push(list[i].cnName);
              list_rate.push(list[i].rate);
          }         
            model.currencySlot = [{
              flex:1,
              values:list_value,
              className:'slot2'
            }];
      })
      this.$store.dispatch('tgapp/meal/canType_list', function(list){
          let record = model.$store.getters['tgapp/meal/meal_record'];
          let canType = record.costCan.canType;
          var values = [], defaultIndex = 0;
          for(var i=0;i<list.length;i++){
              values.push(list[i].title);
              if(list[i].title==canType){
                 defaultIndex = i;
              }
          }
          model.canTypedSlot = [{
                flex: 1,
                values: values,
                className: 'slot1',
                defaultIndex: defaultIndex
            }]
      });
      this.$store.dispatch('tgapp/meal/canStandard_list', function(list){
          let record = model.$store.getters['tgapp/meal/meal_record'];
          let canStandard = record.costCan.canStandard;
          var values = [], defaultIndex = 0;
          for(var i=0;i<list.length;i++){
              values.push(list[i].title);
              if(list[i].title==canStandard){
                 defaultIndex = i;
              }
          }    
          model.canStandardSlot = [{
                flex: 1,
                values: values,
                className: 'slot1',
                defaultIndex: defaultIndex
            }]                
      });
      this.$store.dispatch('tgapp/meal/priceTypeList_list', function(list){
          let record = model.$store.getters['tgapp/meal/meal_record'];
          let priceType = record.costCan.priceType;
          var values = [], defaultIndex = 0;
          for(var i=0;i<list.length;i++){
              values.push(list[i].title);
              if(list[i].title==priceType){
                 defaultIndex = i;
              }
          }
          model.priceTypeSlot = [{
                flex: 1,
                values: values,
                className: 'slot1',
                defaultIndex: defaultIndex
            }]
      });
      //获取餐厅供应商数据
      this.$store.dispatch('tgapp/meal/mealSup_list');

      if(this.$route.query.id){   
        let id= Number(this.$route.query.id)
        let status= Number(this.$route.query.status); 
        // console.log('status：'+status);   
        this.$store.dispatch('tgapp/meal/change_editId', id)
        this.$store.dispatch('tgapp/meal/change_status', status)
        let model = this;
        this.$store.dispatch('tgapp/meal/meal_record', function(record){
            var guideCheckout = record.guideCheckout;
            if(record.guideCheckout==2){//签单
                // model.form_tab();
                model.isShow_meal = true;
                model.isFormActive = true;
                model.isCashActive = false;
                model.isShow_price = true;
                model.isHide = false;
                // model.isDisabled = true;
                // model.clear_icon = false;
            }else{//现付
                // model.cash_tab();
                model.isShow_meal = true;  
                model.isCashActive = true;
                model.isFormActive = false;
                model.isHide = false;
                model.isShow_price = true;
                // model.isDisabled = false;
                // model.clear_icon = true;
            }
        });
      }
      
    },
    computed:{
        query () {
        let query ={};
        query.startDate = DateFmt(new Date(),'yyyy-MM-dd','M');
        // query.endDate = DateFmt(new Date(),'yyyy-MM-dd','d+1');
        return query
        },
        theCur_list() {            
            return this.$store.getters['tgapp/common/theCur_list']
        },
        mealSup_list() {
            return this.$store.getters['tgapp/meal/meal_supplier_list']
        },
        meal_record() {
            let record = this.$store.getters['tgapp/meal/meal_record'];
            if(record){            
                if(record.cashAmount&&typeof(record.cashAmount)=='number'){
                    record.cashAmount = record.cashAmount.toFixed(2);
                }
                if(record.cashAmountCny&&typeof(record.cashAmountCny)=='number'){
                    record.cashAmountCny = record.cashAmountCny.toFixed(2);
                }
                if(record.thePrice&&typeof(record.thePrice)=='number'){
                    record.thePrice = record.thePrice.toFixed(2);
                }
            }
            return record;
        }
    },
    //监听输入的关键字变化模糊搜索相应的酒店供应商
    watch: {
        skey() {
            let skey = this.skey;
            this.clearTimer();
            if (this.skey && this.skey.length > 0) {
                //获取当前延时函数的ID，便于后面clearTimeout清除该ID对应的延迟函数
                this.timer = setTimeout(() => {
                this.$store.dispatch('tgapp/meal/change_skey',skey);
                this.$store.dispatch('tgapp/meal/mealSup_list');
                }, 300);
            } else {
                this.$store.dispatch('tgapp/meal/change_skey',skey);
                this.$store.dispatch('tgapp/meal/mealSup_list');
            }
        },
        title(){
            this.title= this.title;
        },
    },
    methods: {
        //点击下拉显示
        isShow:function() {
            this.isShow_meal = true,
            this.isShow_price = true,
            this.isHide = false;
        },
        //添加时间
        open:function(picker) {
            this.$refs[picker].open();
        },
        //选择时间后赋值
        handleChange_addTime(addTimeValue) {
            // this.addTimeValue=DateFmt(addTimeValue, 'yyyy-MM-dd');
            // this.query.startDate=addTimeValue;
            let record = this.$store.getters['tgapp/meal/meal_record'];
            record.cashDate = addTimeValue;
        },
        //计算选择不同币种后的人民币总价
        countTotalMoney:function(){
            let record = this.$store.getters['tgapp/meal/meal_record'];
            record.cashAmountCny = (parseFloat(record.cashAmount)*parseFloat(record.theRate)).toFixed(2);
            if(record.cashAmount<0){
                Toast('填写金额必须大于0！');
                record.cashAmount = '';
                record.cashAmountCny=(0).toFixed(2);
            }
        },
        //清空金额
        clear_amount:function(){
            let record = this.$store.getters['tgapp/meal/meal_record'];
            record.cashAmount = '';
            record.cashAmountCny = (0).toFixed(2);
        },
        //签单
        form_tab:function(){
            let record = this.$store.getters['tgapp/meal/meal_record'];
            record.guideCheckout = 2;
            this.isShow_meal = true;
            this.isFormActive = true;
            this.isCashActive = false;
            this.isShow_price = true;
            this.isHide = false;
            // this.isDisabled = true;
            // this.clear_icon = false;
            // record.cashAmount = '';
            // record.cashAmountCny = (0).toFixed(2);
            record.guideCheckout = 2;
            // this.is_Cur = 2;
            if((record.thePrice!='')&&(record.theNum!='')){
                record.cashAmount=parseFloat(record.thePrice*record.theNum).toFixed(2);
                record.cashAmountCny=parseFloat(record.thePrice*record.theNum*record.theRate).toFixed(2);
            }
        },
        //单价验证
        unit_price_change:function(){
            let record = this.$store.getters['tgapp/meal/meal_record'];
            if(record.thePrice!=''){
                if(record.thePrice<=0){
                    Toast('单价必须大于0！');
                    record.thePrice='';
                }
            }
            if(record.guideCheckout==2){
                if((record.theNum>0) && (record.thePrice>0)){
                    record.cashAmountCny=((parseFloat(record.theNum)*parseFloat(record.thePrice))*parseFloat(record.theRate)).toFixed(2);
                    record.cashAmount=(parseFloat(record.theNum)*parseFloat(record.thePrice)).toFixed(2);
                }
            }
        },
        //验证数量和金额计算
        number_change:function(){
            let record = this.$store.getters['tgapp/meal/meal_record'];
            if(record.theNum==''){
                Toast('请输入数量！');
                // record.cashAmountCny=(0).toFixed(2);
                // record.cashAmount=(0).toFixed(2);
            }
            if(record.guideCheckout==2){
                if((record.theNum>0) && (record.thePrice>0)){
                    record.cashAmountCny=((parseFloat(record.theNum)*parseFloat(record.thePrice))*parseFloat(record.theRate)).toFixed(2);
                    record.cashAmount=(parseFloat(record.theNum)*parseFloat(record.thePrice)).toFixed(2);
                }
            }
        },
        //现付
        cash_tab:function()
        {
            let record = this.$store.getters['tgapp/meal/meal_record'];
            record.guideCheckout = 1;
             this.isShow_meal = true;  
             this.isCashActive = true;
             this.isFormActive = false;
             this.isHide = false;
             this.isShow_price = true;
             this.isDisabled = false;
             this.clear_icon = true;
        },        
        //用餐类别的选择变化
        onCanTypeChange(picker, values) {
            let record = this.$store.getters['tgapp/meal/meal_record'];
            record.costCan.canType = values[0];
            // this.cantype = values[0];
        },
        //餐标选择变化
        onCanStandardChange(picker, values) {
            let record = this.$store.getters['tgapp/meal/meal_record'];
            record.costCan.canStandard = values[0];            
            // this.canStandard = values[0];
        },
        //价格类型的选择变化
        onPriceTypeChange(picker, values) {
            let record = this.$store.getters['tgapp/meal/meal_record'];
            record.costCan.priceType = values[0];
            // this.pricetype = values[0];
        },
        //币种内容选择变化
        onCurrencyChange(picker, values) {
            let record = this.$store.getters['tgapp/meal/meal_record'];
            record.theCurName = values[0];
            //判断当前币种选中下拉项与数组遍历项相等，则给汇率和币种符号赋相对应的值
            for(var i=0;i<this.curList.length;i++){
                if(record.theCurName==this.curList[i].cnName){
                    record.theCur = this.curList[i].cur;
                    record.theRate = this.curList[i].rate;
                }
            }
            if(record.cashAmount>0){
                record.cashAmountCny = (parseFloat(record.cashAmount)*parseFloat(record.theRate)).toFixed(2);
            }
        },        
        //弹出用餐类别选择
        restaurant_choose_cantype(){
            this.popupCanTypeVisible = true;
        },
        //弹出餐标选择
        restaurant_choose_canStandard(){
            this.popupCanStandardVisible = true;
        },
        //弹出价格类型选择
        restaurant_choose_pricetype(){
            this.popupPriceTypeVisible = true;
        },
        //显示币种下拉
        currency_box_show(){
            this.currencyShow = true;
        },
        //显示餐厅名称搜索窗口
        search_restaurant:function(){
            this.search_mask_box = true;
            document.body.scrollTop = 0;
            this.skey = '';
            let skey = this.skey;
            this.$store.dispatch('tgapp/meal/change_skey',skey);
            this.$store.dispatch('tgapp/meal/mealSup_list');
        },
        //关闭餐厅名称搜索窗口
        close_search_box:function(){
            this.search_mask_box = false;
            this.skey = '';            
            document.body.scrollTop = 0;
        },
        //获得焦点改变输入框边框颜色
        search_focus:function(){
            this.isFocus = false;
        },
        //餐厅赋值
        search_li_list:function(event){
            let el = event.currentTarget;
            let title = el.innerText;
            let supCpyId = el.getAttribute('supCpyId');
            let record = this.$store.getters['tgapp/meal/meal_record'];
            record.supCpyId = supCpyId;
            record.supCpyName = title;
            this.search_mask_box = false;
            this.skey = '';
            document.body.scrollTop = 0;
            this.isSupName =true;
        },
        //根据输入的关键字搜索餐厅供应商
        search_sup(){
            let skey = this.skey;
            this.clearTimer();
            if (this.skey && this.skey.length > 0) {
                //获取当前延时函数的ID，便于后面clearTimeout清除该ID对应的延迟函数
                this.timer = setTimeout(() => {
                this.$store.dispatch('tgapp/meal/change_skey',skey);
                this.$store.dispatch('tgapp/meal/mealSup_list');
                }, 500);
            } else {
                this.$store.dispatch('tgapp/meal/change_skey',skey);
                this.$store.dispatch('tgapp/meal/mealSup_list');
            }
        },
        clearTimer() {
            if (this.timer) {
                clearTimeout(this.timer);
            }
        },
        //清空供应商
        clear_supName:function(){
            let record = this.$store.getters['tgapp/meal/meal_record'];
            record.supCpyName = '';
            this.isSupName = false;
        }

    }
  }
</script>

<style lang="less" scoped>
#restaurant_testclass{
    width:100%;
    height:100%;
    color:000;
}
.restaurant_toolbar_box{
    width: 100%;
    height:66px;
    background-color:#fff;
    border-bottom:1px dashed #F3F7FC;
}
.restaurant_price_toolbar{
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
.restaurant_currency_box{
    width: 45px;
    height:35px;
    position:relative;
}
.restaurant_currency{
    font-size: 12px;
    color: #909399; 
}
.restaurant_currency_code{
    color: #606266;
    font-size:16px;
    font-weight: bold;
    letter-spacing: 1px; 
    margin-top: 5px;
}
.restaurant_down_icon{
  width:12px;
  height:12px;
  position: absolute;
  top:10px;
  left:45px;
}
.restaurant_clear_price{
    width: 25px;
    height: 35px;
    line-height: 35px;
    margin-left: 5px;
    position: absolute;
    top:0;
    right:0;
}
.restaurant_clear_price>img{
    width:14px;
    height:14px;
    margin-top: 10px;
}
.restaurant_price_in_input{
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
.restaurant_dashed_line{
    display: inline-block;
    width: 2px;
    border-right:1px dashed #EDEDED;
    height: 35px;
    vertical-align: middle;
}
.restaurant_add_time{
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
    padding-left: 14px;
    position: relative;
}
.time_icon{
    position: absolute;
    top:15%;
    left: 5%;
    width: 14px;
    height: 14px;
}
.restaurant_price_rate{
    width:100%;
    height: 35px;
    background-color:#fff;
    display: flex;
    flex-flow: row;
    
}
.restaurant_total_money,.restaurant_rate_box{
    padding:10px 0;
    margin-left: 15px;
    line-height: 15px;
}
.restaurant_total_money>span,.restaurant_rate_box>span{
    font-size: 12px;
    color: #ccc;
}
.restaurant_split_line{
    width: 2px;
    height:10px;
    border-right:1px solid #ccc;
    margin-top: 12px;
    margin-left: 15px;
}
.restaurant_rate_box>b{
    display:inline;
    font-size: 12px;
    background: #F2F6FC;
    color: #FCAC36;
    padding:3px 15px;
    border-radius: 10px;
    transform: translateY(-2px);
    margin-left: 5px;
}
.restaurant_info_box{
    width: 100%;
    padding:10px 0;
}
.restaurant_meal_box{
    width: 100%;
}
.restaurant_info_content{
    height:104px;
    background: #FFF;
    margin: 0 10px;    
}
.restaurant_meal_content{
    height: 70px;
    background: #FFF;
    margin: 0 10px;
    position: relative;
}
.restaurant_type{
    // width: 100%;
    height:70px;
    // background: #ddd;
    margin: 0 15px;
    border-bottom: 1px solid #f3f3f3;
    display: flex;
}
.meal_type,.meal_price_type{
    width: 33%;
    height: 55px;
    // background: #ccc;
    text-align: center;
    padding-top: 15px;
}
.meal_standard{
    width: 34%;
    height: 55px;
    // background: #ccc;
    text-align: center;
    padding-top: 15px;
}
.meal_type_title{
    margin-left: 5%;
    width:100%;
    font-size: 12px;
    -webkit-transform-origin-x: 0;
    -webkit-transform: scale(0.90);
    color: #A4A7AC;
}
.meal_choice{
    font-size: 14px;
    margin-top: 10px;
    width: 100%;
}
.meal_standard_choice{
    color: #C0C4CC;
}
.restaurant_choose_box,.restaurant_remark{
    margin: 0 15px;
    height: 50px;
    display: flex;
    flex-flow: row;
}
.restaurant_choose_box{
    border-bottom: 1px solid #F3F3F3;
}
.restaurant_info_content{
    line-height: 50px;
}
.restaurant_info_title,.restaurant_remark_title{
    font-size: 14px;
    margin-right: 20px;
    color: #606266;
}
.restaurant_info_choose_input{
    flex:1;
    display: flex;
    margin-right: 5px;
}
.restaurant_info_choose_input>input{
    width: 90%;
    border: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.restaurant_info_choose_input>input::-webkit-input-placeholder{ /*WebKit browsers*/
    color:#B0B4B3;
}
.restaurant_info_choose_input>input::-moz-input-placeholder{ /*Mozilla Firefox*/
    color:#B0B4B3;
}
.restaurant_info_choose_input>input::-ms-input-placeholder{ /*Internet Explorer*/ 
    color:#B0B4B3;
}
.restaurant_info_tab{
    display: flex;
    width: 72px;
    font-size: 12px;
    line-height: 19px;
    background: #f2f6fc;
    margin: 12px 0;
    padding: 3px 5px;
    border-radius: 15px;
}
.restaurant_info_tab_active{
    background: #409EFF;
    border-radius: 10px;
    padding: 0 6px;
    line-height: 20px;
    color: #FFF;
}
.restaurant_remark_input{
    flex: 1;
    border: none;
}
.restaurant_remark_input>input{
    width: 100%;
    border: none;
}
.restaurant_remark_input>input::-webkit-input-placeholder{ /*WebKit browsers*/
    color:#C0C4CC;
}
.restaurant_remark_input>input::-moz-input-placeholder{ /*Mozilla Firefox*/
    color:#C0C4CC;
}
.restaurant_remark_input>input::-ms-input-placeholder{ /*Internet Explorer*/ 
    color:#C0C4CC;
}
.restaurant_down_list{
    text-align: center;
    font-size: 12px;
}
.restaurant_down_list_icon{
    height: 20px;
}
.restaurant_down_list_icon>img{
    width: 18px;
    height: 18px;
}
.restaurant_down_list_tip{
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
.restaurant_mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    //margin-top: 45px;
    z-index: 1000;
}
.search_top_box{
    // margin-top: 20px;
    // width: 100%;
    // position: relative;
    padding-top: 20px;
    width: 100%;
    position: fixed;
    background: #F5F5F5;
    z-index: 999;
}
.restaurant_search_input{
    width: 75%;
    height: 27px;
    border-radius: 15px;
    margin-left: 10px;
    padding-left: 20px;
    background: #FFF;
    border: none;
}
.focus_restaurant_search_input{
    width: 75%;
    height: 27px;
    border-radius: 15px;
    border:none;
    margin-left: 10px;
    padding-left: 20px;
}
.search_icon{
    position: absolute;
    top:26px;
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
    // height: 100%;
    margin-top: 49px;
    background: #F5F5F5;
}
.searck_result_list{
    padding: 20px 0 40px 0;
    margin: 0;
    min-height:500px;
}
.searck_result_list>li{
    width: 85%;
    list-style: none;
    font-size: 14px;
    padding: 8px 10px;
    margin: 0 15px;
    color: #000;
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.search_result_tips{
    width: 100%;
    text-align: center;
    margin-top: 30px;
    // color: #BDBDBD;
    color:#999;
}
.fade-enter-active, .fade-leave-active {
    // transition: .5s;
    animation:mymove_in .5s; 
}
.fade-enter, .fade-leave-active {
    // opacity: 0;
    animation:mymove_out .5s;
}
@keyframes mymove_in
    {
        from {top:100%;}
        to {top:0;}
    }
@keyframes mymove_out
    {
        from {top:0;}
        to {top:100%;}
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