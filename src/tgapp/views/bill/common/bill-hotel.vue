<template>
  <div id="hotel_testclass">
    <!-- 金额输入 -->
    <div class="hotel_toolbar_box">
      <div class="hotel_price_toolbar">
        <div class="left_box">
          <div class="hotel_currency_box">
            <span class="hotel_currency">{{ hotel_record.theCurName }}</span><br>
            <span class="hotel_currency_code">{{hotel_record.theCur}}</span>
            <img class="hotel_down_icon" src="assets/down.svg" @click="currency_box_show">
          </div>
        </div>
        <div class="middle_box">
            <input class="hotel_price_in_input" type="number" placeholder="0.00"  v-model="hotel_record.cashAmount" @input="countTotalMoney" ref="type1"/>
          <div class="hotel_clear_price">
              <img src="assets/close.svg" @click="clear_input_content">
          </div>
          <span class="hotel_dashed_line"></span>
        </div>
        <div class="right_box">
          <div class="hotel_add_time" @click="open('addtime_picker')" size="large" :startDate="startDate">{{hotel_record.cashDate? DateFmt(hotel_record.cashDate, 'yyyy-MM-dd'):''}}
              <img class="time_icon" src="assets/time.svg">
          </div>
            <mt-datetime-picker
            ref="addtime_picker"
            type="date"
            v-model="hotel_record.cashDate"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            @confirm="handleChange_addTime">
            </mt-datetime-picker>
        </div>
      </div>
    </div>
    <!--显示汇率-->
    <div class="hotel_price_rate">
      <div class="hotel_total_money">
        <span>人民币：</span><span>{{hotel_record.cashAmountCny}}</span>
      </div>
      <div class="hotel_split_line"></div>
      <div class="hotel_rate_box">
        <span>汇率</span>
        <b>{{hotel_record.theRate || 1.0000}}</b>
      </div>
    </div>
    <!--选择酒店、填写摘要-->
    <div class="hotel_info_box">
      <div class="hotel_info_content">
        <div class="hotel_choose_box">
            <div class="hotel_info_title">酒店</div>
            <div class="hotel_info_choose_input">
                <input type="text" placeholder="请选择酒店" @focus="search_hotel" v-model="hotel_record.supCpyName">
                <img src="assets/close.svg" style="width:14px;" v-show="isSupName" @click="clear_supName">
            </div>
            <div class="hotel_info_tab">
                <div :class="isCashActive ? 'hotel_info_tab_active' : '' " @click="cash_tab" style="margin-right: 8px;line-height: 22px;margin-left:2px;" v-bind="hotel_record.guideCheckout">现付</div>
                <div :class="isFormActive ? 'hotel_info_tab_active' : '' " @click="form_tab" style="line-height: 22px;margin-right:2px;" v-bind="hotel_record.guideCheckout">签单</div>
            </div>
        </div>
        <div class="hotel_remark">
            <div class="hotel_remark_title">摘要</div>
            <div class="hotel_remark_input">
              <input type="text" placeholder="请输入费用摘要" v-model="hotel_record.title">
            </div>  
        </div>
      </div>
    </div>
    <!--点击下拉显示更多输入内容-->
    <div class="hotel_down_list"  v-show="isHide">
        <div class="hotel_down_list_icon"><img @click="isShow" src="assets/expand_more.svg"></div>
        <div class="hotel_down_list_tip">填写更多可提升70%的通过率</div>
    </div>
    <!--下拉后显示房型选择-->
    <div class="hotel_room_box" v-show="isShow_room">
        <div class="hoetel_room_content">
            <div class="hotel_room_time_box">
              <div class="hotel_room_type_left">
                <div class="hotel_room_type">入住日期：</div>
                <div class="hotel_room_type_choose">
                    <div @click="open('startTime_picker')" size="large" :startDate="startDate">{{DateFmt(hotel_record.costFang.theDate1, 'yyyy-MM-dd')}}</div> 
                          <mt-datetime-picker
                          ref="startTime_picker"
                          type="date"
                          v-model="hotel_record.costFang.theDate1"
                          year-format="{value} 年"
                          month-format="{value} 月"
                          date-format="{value} 日"
                          @confirm="handleChange_startTime">
                          </mt-datetime-picker>
                </div>
                <div>
                    <img src="assets/right.svg">
                </div> 
              </div>  
            </div>
            <div class="hotel_room_time_box">
              <div class="hotel_room_type_left">
                <div class="hotel_room_type">退房日期：</div>
                <div class="hotel_room_type_choose">
                    <div @click="open('endTime_picker')" size="large" :startDate="startDate">{{DateFmt(hotel_record.costFang.theDate2, 'yyyy-MM-dd')}}</div> 
                        <mt-datetime-picker
                        ref="endTime_picker"
                        type="date"
                        v-model="hotel_record.costFang.theDate2"
                        year-format="{value} 年"
                        month-format="{value} 月"
                        date-format="{value} 日"
                        @confirm="handleChange_endTime">
                        </mt-datetime-picker>
                </div>
                <div>
                    <img src="assets/right.svg">
                </div> 
              </div>
            </div>
            <div class="hotel_room_right">
                {{hotel_record.costFang.theNightNum}}晚
            </div>
            <div class="hotel_room_time_box box_3">
                <div class="hotel_room_type_left">
                    <div class="hotel_room_type">房间型号：</div>
                    <div class="hotel_room_type_choose">
                        <div @click="hotel_choose_box">{{ hotel_record.costFang.theRoomType }}</div>
                    </div>  
                    <div>
                        <img src="assets/right.svg">
                    </div>
                </div>  
            </div>
        </div>
    </div>
    <!--单价数量-->
    <div class="form_info_box" v-show="isShow_price">
        <div class="form_info_content">
            <div class="form_info_big">
                <div class="form_info_price">
                    <div style="width:32%">单价：</div>
                    <div>
                        <input type="number" placeholder="请输入单价" v-model="hotel_record.thePrice" @input="unit_price_change">
                    </div>
                </div>
                <div class="cut_off_line"></div>
                <div class="form_info_num">
                    <div style="width:35%;margin-left:10px;">数量：</div>
                    <div>
                        <input type="number" placeholder="请输入数量" v-model="hotel_record.theNum" @input="number_change" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')">
                    </div>
                </div>
            </div>   
        </div>
    </div>
    <!-- 房型选择 -->
    <div class="page-picker">
      <div class="page-picker-wrapper">
        <mt-popup  v-model="popupVisible" position="bottom" pop-transition="popup-fade" :modal="true">
          <mt-picker :slots="roomSlot" @change="onRoomChange" :visible-item-count="5" style="width:100%;">
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
        <div class="hotel_mask" v-show="search_mask_box">
            <div class="search_top_box">
            <input type="text" :class=" isFocus ? 'hotel_search_input' : 'focus_hotel_search_input' " placeholder="搜索" @focus="search_focus" v-model.trim="skey" autofocus>
            <img class="search_icon" src="assets/search.svg"> 
            <!-- <img class="close_search_box" src="assets/close-c.svg" @click="close_search_box"> -->
            <span class="close_search_box" @click="close_search_box">取消</span>
            </div>  
            <div class="search_result_box">
                <ul class="searck_result_list">
                    <li v-for="item in hotelSup_list" @click="search_li_list" v-bind:supCpyId=item.id>{{item.simName}}</li>
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
            isShow_room : false,
            isShow_price : false,
            isHide : true,
            isform : false,
            isCashActive : true,
            isSupName:false,
            // isDisabled:false,
            // clear_icon:true,
            addTimeValue:DateFmt(new Date(), 'yyyy-MM-dd'),
            // startTimeValue:DateFmt(new Date(), 'yyyy-MM-dd'),
            // endTimeValue:DateFmt(new Date(), 'yyyy-MM-dd','d+1'),
            startDate: DateFmt(new Date(), 'yyyy-MM-dd', 'y-10'),
            endDate: DateFmt(new Date(), 'yyyy-MM-dd', 'y+10'),
            nights:1,
            // total_money:(0).toFixed(2),
            // theRate:'',
            unit_price:'',
            number:'',
            // roomType: '',
            // currencyType:'',
            // cur:'',
            // input_content:'',
            cashAmount:'',
            title:'',
            number: '',
            list:'',  //保存币种数组
            theRoomType:'', //保存房间数组/
            // hotel_name:'',
            skey:'',
            theCurSign:'',
            popupVisible:false,
            currencyShow:false,
            roomSlot: [{
              flex: 1,
              values:[],
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
      let erpId = Number(this.$route.query.erpId);
      let planId = Number(this.$route.query.planId);
      this.$store.dispatch('tgapp/common/change_erpId', erpId);
      this.$store.dispatch('tgapp/hotel/change_erpId', erpId)
      this.$store.dispatch('tgapp/hotel/change_planId', planId);
      let record = this.$store.getters['tgapp/hotel/hotel_record'];
      record.erpid = erpId;
      record.planId = planId;
      record.costFang.erpid = erpId;
      var model = this;
      //获取币种数据
      this.$store.dispatch('tgapp/common/theCur_list', function(list){
          var list_value = [];
          var list_rate = [];
          for(var i=0;i<list.length;i++){
              list_value.push(list[i].cnName);
          }
            model.currencySlot = [{
              flex:1,
              values:list_value,
              className:'slot2'
            }];
            model.list = list;
      });
      //获取房型数据
    //   this.$store.dispatch('tgapp/hotel/change_erpId', erpId)
      this.$store.dispatch('tgapp/hotel/roomType_list', function(room){
          let record = model.$store.getters['tgapp/hotel/hotel_record']; 
          let roomType = record.costFang.theRoomType;
          var roomList = [],defaultIndex = 0;
          for(var m=0;m<room.length;m++){
              roomList.push(room[m].title);
              if(room[m].title == roomType){
                  defaultIndex =m
              }
          }
          model.roomSlot =[{
              flex: 1,
              values: roomList,
              className: 'slot1',
              defaultIndex:defaultIndex
            }];
      });
      //获取酒店供应商数据
      this.$store.dispatch('tgapp/hotel/hotelSup_list');
      if(this.$route.query.id){   
        let id= Number(this.$route.query.id)
        let status= Number(this.$route.query.status);  
        // console.log('status：'+status);
        this.$store.dispatch('tgapp/hotel/change_editId', id)
        this.$store.dispatch('tgapp/hotel/change_status', status)
        let model = this;
        this.$store.dispatch('tgapp/hotel/hotel_record', function(record){
            var guideCheckout = record.guideCheckout;
            if(record.guideCheckout==2){//签单
                // model.form_tab();
                model.isShow_room = true;
                model.isFormActive = true;
                model.isCashActive = false;
                model.isShow_price = true;
                model.isHide = false;
                // model.isDisabled = true;
                // model.clear_icon = false;
            }else{//现付
                // model.cash_tab();
                model.isShow_room = true;  
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
        return query
        },
        hotelSup_list() {
            return this.$store.getters['tgapp/hotel/hotel_supplier_list']
        },
        hotel_record() {
            let record = this.$store.getters['tgapp/hotel/hotel_record'];
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
                this.$store.dispatch('tgapp/hotel/change_skey',skey);
                this.$store.dispatch('tgapp/hotel/hotelSup_list');
                }, 300);
            } else {
                this.$store.dispatch('tgapp/hotel/change_skey',skey);
                this.$store.dispatch('tgapp/hotel/hotelSup_list');
            }
        },
        title(){
            this.title= this.title;
        },
    },
    methods: {
        //点击下拉显示
        isShow:function() {
            this.isShow_room = true,
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
            let record = this.$store.getters['tgapp/hotel/hotel_record'];
            record.cashDate = addTimeValue;
        },
        //选择入住时间后赋值
        handleChange_startTime() {
            let record = this.$store.getters['tgapp/hotel/hotel_record'];
            // record.costFang.theDate1=DateFmt(startTimeValue, 'yyyy-MM-dd');
            let theDate1=DateFmt(record.costFang.theDate1, 'yyyy-MM-dd');
            let theDate2=DateFmt(record.costFang.theDate2, 'yyyy-MM-dd');
            let eArr = (theDate2).split("-");
            let sArr = (theDate1).split("-");
            let eRDate = new Date(eArr[0], eArr[1]-1, eArr[2]);
            let sRDate = new Date(sArr[0], sArr[1]-1, sArr[2]);
            let days = (eRDate-sRDate)/(24*60*60*1000);
            if(eRDate-sRDate<0){
                Toast('退房日期不能早于开房日期');
                record.costFang.theDate1 = DateFmt(new Date(), 'yyyy-MM-dd');
                record.costFang.theNightNum = 1;
            }else{
                record.costFang.theNightNum = days;
            } 
            if((record.thePrice!='')&&(record.theNum!='')){
                record.cashAmount=parseFloat(record.thePrice*record.theNum*record.costFang.theNightNum).toFixed(2);
                record.cashAmountCny=parseFloat(record.thePrice*record.theNum*record.costFang.theNightNum*record.theRate).toFixed(2);
            }
        },
        //选择退房时间后赋值
        handleChange_endTime() {
            let record = this.$store.getters['tgapp/hotel/hotel_record'];
            let theDate1=DateFmt(record.costFang.theDate1, 'yyyy-MM-dd');
            let theDate2=DateFmt(record.costFang.theDate2, 'yyyy-MM-dd');
            let eArr = (theDate2).split("-");
            let sArr = (theDate1).split("-");
            let eRDate = new Date(eArr[0], eArr[1]-1, eArr[2]);
            let sRDate = new Date(sArr[0], sArr[1]-1, sArr[2]);
            let days = (eRDate-sRDate)/(24*60*60*1000);
            if(eRDate-sRDate<0){
                Toast('退房日期不能早于开房日期');
                record.costFang.theDate2 = DateFmt(new Date(), 'yyyy-MM-dd','d+1');
                record.costFang.theNightNum = 1;
            }else{
                record.costFang.theNightNum = days;
            }
            if((record.thePrice!='')&&(record.theNum!='')){
                record.cashAmount=parseFloat(record.thePrice*record.theNum*record.costFang.theNightNum).toFixed(2);
                record.cashAmountCny=parseFloat(record.thePrice*record.theNum*record.costFang.theNightNum*record.theRate).toFixed(2);
            } 
        },
        //输入支付金额
        countTotalMoney:function(){
            let record = this.$store.getters['tgapp/hotel/hotel_record'];
            record.cashAmountCny = (parseFloat(record.cashAmount)*parseFloat(record.theRate)).toFixed(2);
            if(record.cashAmount<0){
                Toast('填写金额必须大于0！');
                record.cashAmount = '';
                record.cashAmountCny=(0).toFixed(2);
            }
            if(record.cashAmount==''){
                record.cashAmountCny = (0).toFixed(2);
            }
        },
        //清空金额
        clear_input_content:function(){
            let record = this.$store.getters['tgapp/hotel/hotel_record'];
            record.cashAmount = '';
            record.cashAmountCny = (0).toFixed(2);
        },
        //签单
        form_tab:function(){
            let record = this.$store.getters['tgapp/hotel/hotel_record'];
            this.isShow_room = true;
            this.isFormActive = true;
            this.isCashActive = false;
            this.isShow_price = true;
            this.isHide = false;
            // this.isDisabled = true;
            // record.cashAmount = '';
            // record.cashAmountCny = (0).toFixed(2);
            // this.clear_icon = false;
            record.guideCheckout = 2;   
            if((record.thePrice!='')&&(record.theNum!='')){
                record.cashAmount=parseFloat(record.thePrice*record.theNum*record.costFang.theNightNum).toFixed(2);
                record.cashAmountCny=parseFloat(record.thePrice*record.theNum*record.costFang.theNightNum*record.theRate).toFixed(2);
            }
        },
        //单价验证
        unit_price_change:function(){
            let record = this.$store.getters['tgapp/hotel/hotel_record'];
            if(record.thePrice!=''){
                if(record.thePrice<0){
                    Toast('单价必须大于0！');
                    record.thePrice='';
                }
            }
            if(record.guideCheckout==2){
                if((record.theNum>0) && (record.thePrice>0)){
                    record.cashAmountCny=((parseFloat(record.theNum)*parseFloat(record.thePrice)*parseInt(record.costFang.theNightNum))*parseFloat(record.theRate)).toFixed(2);
                    record.cashAmount=(parseFloat(record.theNum)*parseFloat(record.thePrice)*parseInt(record.costFang.theNightNum)).toFixed(2);
                }
            }
            
        },
        //验证数量和金额计算
        number_change:function(){
            let record = this.$store.getters['tgapp/hotel/hotel_record'];
            if(record.thePrice==''){
                Toast('请输入单价！');
                // record.cashAmountCny=(0).toFixed(2);
            }
            if(record.guideCheckout==2){
                if((record.theNum>0) && (record.thePrice>0)){
                    record.cashAmountCny=((parseFloat(record.theNum)*parseFloat(record.thePrice)*parseInt(record.costFang.theNightNum))*parseFloat(record.theRate)).toFixed(2);
                    record.cashAmount=(parseFloat(record.theNum)*parseFloat(record.thePrice)*parseInt(record.costFang.theNightNum)).toFixed(2);
                }
            }
        },
        //现收
        cash_tab:function()
        {
             let record = this.$store.getters['tgapp/hotel/hotel_record'];
             this.isShow_room = true;  
             this.isCashActive = true;
             this.isFormActive = false;
             this.isHide = false;
             this.isShow_price = true;
             this.isDisabled = false;
             this.clear_icon = true;
             record.guideCheckout = 1;
            //  this.is_Cur = 1;
        },
        //房型内容选择变化
        onRoomChange(picker, values) {
            let record = this.$store.getters['tgapp/hotel/hotel_record'];
            record.costFang.theRoomType = values[0];
        },
        //币种类型选择变化
        onCurrencyChange(picker, values,list) {
            let record = this.$store.getters['tgapp/hotel/hotel_record'];
            record.theCurName = values[0];
            //判断当前币种选中下拉项与数组遍历项相等，则给汇率和币种符号赋相对应的值
            for(var i=0;i<this.list.length;i++){
                if(record.theCurName==this.list[i].cnName){
                    record.theRate = this.list[i].rate;
                    record.theCur = this.list[i].cur;
                    record.theCurSign =this.list[i].theCurSign;
                }
            }
            if(record.cashAmount>0){
                record.cashAmountCny = (parseFloat(record.cashAmount)*parseFloat(record.theRate)).toFixed(2);
            }
        },
        //弹出房型选择
        hotel_choose_box(){
            this.popupVisible = true;
        },
        //显示币种下拉
        currency_box_show(){
            this.currencyShow = true;
        },
        //显示酒店名称搜索窗口
        search_hotel:function(){
            this.search_mask_box = true;
            document.body.scrollTop = 0;
            this.skey = '';
            let skey = this.skey;
            this.$store.dispatch('tgapp/hotel/change_skey',skey);
            this.$store.dispatch('tgapp/hotel/hotelSup_list');
        },
        //关闭酒店名称搜索窗口
        close_search_box:function(){
            this.search_mask_box = false;
            document.body.scrollTop = 0;
            this.skey = '';
        },
        //获得焦点改变输入框边框颜色
        search_focus:function(){
            this.isFocus = false;
        },
        //酒店赋值
        search_li_list:function(event){
            let el = event.currentTarget;
            let title = el.innerText;
            let supCpyId = el.getAttribute('supCpyId');
            let record = this.$store.getters['tgapp/hotel/hotel_record'];
            record.supCpyId = supCpyId;
            record.supCpyName = title;
            this.search_mask_box = false;
            this.skey = '';
            let skey = this.skey;
            document.body.scrollTop = 0;
            this.$store.dispatch('tgapp/hotel/change_skey',skey);
            this.$store.dispatch('tgapp/hotel/hotelSup_list');
            this.isSupName =true;
        },
        clearTimer() {
            if (this.timer) {
                clearTimeout(this.timer);
            }
        }, 
        //清空供应商
        clear_supName:function(){
            let record = this.$store.getters['tgapp/hotel/hotel_record'];
            record.supCpyName = '';
            this.isSupName = false;
        }
    }
  }
</script>

<style lang="less" scoped>
#hotel_testclass{
    width:100%;
    height:100%;
    color:000;
}
.hotel_toolbar_box{
    width: 100%;
    height:66px;
    background-color:#fff;
    border-bottom:1px dashed #F3F7FC;
}
.hotel_price_toolbar{
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
.hotel_currency_box{
    width: 45px;
    height:35px;
    position:relative;
}
.hotel_currency{
    font-size: 12px;
    color: #909399; 
}
.hotel_currency_code{
    color: #606266;
    font-size:16px;
    font-weight: bold;
    letter-spacing: 1px; 
    margin-top: 5px;
}
.hotel_down_icon{
  width:12px;
  height:12px;
  position: absolute;
  top:10px;
  left:45px;
}
.hotel_clear_price{
    width: 25px;
    height: 35px;
    line-height: 35px;
    margin-left: 5px;
    position: absolute;
    top:0;
    right:0;
}
.hotel_clear_price>img{
    width:14px;
    height:14px;
    margin-top: 10px;
}
.hotel_price_in_input{
    height:35px;
    line-height: 35px;
    width: 75%;
    height: 35px;
    border: none;
    font-size: 20px;
    color: #757575;
    background: #FFF;
}
.hotel_dashed_line{
    display: inline-block;
    width: 2px;
    border-right:1px dashed #EDEDED;
    height: 35px;
    vertical-align: middle;
}
.hotel_add_time{
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
.hotel_price_rate{
    width:100%;
    height: 35px;
    background-color:#fff;
    display: flex;
    flex-flow: row;
    
}
.hotel_total_money,.hotel_rate_box{
    padding:10px 0;
    margin-left: 15px;
    line-height: 15px;
}
.hotel_total_money>span,.hotel_rate_box>span{
    font-size: 12px;
    color: #ccc;
}
.hotel_split_line{
    width: 2px;
    height:10px;
    border-right:1px solid #ccc;
    margin-top: 12px;
    margin-left: 15px;
}
.hotel_rate_box>b{
    display:inline;
    font-size: 12px;
    background: #F2F6FC;
    color: #FCAC36;
    padding:3px 15px;
    border-radius: 10px;
    transform: translateY(-2px);
    margin-left: 5px;
}
.hotel_info_box{
    width: 100%;
    padding:10px 0;
}
.hotel_room_box{
    width: 100%;
}
.hotel_info_content{
    height:104px;
    background: #FFF;
    margin: 0 10px;    
}
.hoetel_room_content{
    height: 150px;
    background: #FFF;
    margin: 0 10px;
    position: relative;
}
.hoetel_room_content_top{
    display: flex;
    flex-flow: row;
    width:100%;
}
.hotel_choose_box,.hotel_remark{
    margin: 0 15px;
    height: 50px;
    display: flex;
    flex-flow: row;
}
.hotel_room_left{
    flex:1;
}
.hotel_room_time_box{
    margin: 0 15px;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    border-bottom: 1px solid #f3f3f3;
}
.box_3{
    border: none;
}
.hotel_room_right{ 
    line-height: 100px;
    font-size: 12px;
    width: 20%;
    text-align: center;
    color: #D5D8DE;
    position:absolute;
    top: 0;
    right: 0;
    background: #fff;
}
.hotel_room_type{
    color: #999;
}
.hotel_room_type_left{
    width: 80%;
    display: flex;
}
.hotel_room_type_choose{
    margin-left: 10px;
    width: 52%;
}
.hotel_choose_box{
    border-bottom: 1px solid #F3F3F3;
}
.hotel_info_content{
    line-height: 50px;
}
.hotel_info_title,.hotel_remark_title{
    font-size: 14px;
    margin-right: 20px;
    color: #606266;
}
.hotel_info_choose_input{
    flex:1;
    display: flex;
    margin-right: 5px;
}
.hotel_info_choose_input>input{
    width: 90%;
    border: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.hotel_info_choose_input>input::-webkit-input-placeholder{ /*WebKit browsers*/
    color:#B0B4B3;
}
.hotel_info_choose_input>input::-moz-input-placeholder{ /*Mozilla Firefox*/
    color:#B0B4B3;
}
.hotel_info_choose_input>input::-ms-input-placeholder{ /*Internet Explorer*/ 
    color:#B0B4B3;
}
.hotel_info_tab{
    display: flex;
    width: 72px;
    font-size: 12px;
    line-height: 19px;
    background: #f2f6fc;
    margin: 12px 0;
    padding: 3px 5px;
    border-radius: 15px;
}
.hotel_info_tab_active{
    background: #409EFF;
    border-radius: 10px;
    padding: 0 6px;
    line-height: 20px;
    color: #FFF;
}
.hotel_remark_input{
    flex: 1;
    border: none;
}
.hotel_remark_input>input{
    width: 100%;
    border: none;
}
.hotel_remark_input>input::-webkit-input-placeholder{ /*WebKit browsers*/
    color:#C0C4CC;
}
.hotel_remark_input>input::-moz-input-placeholder{ /*Mozilla Firefox*/
    color:#C0C4CC;
}
.hotel_remark_input>input::-ms-input-placeholder{ /*Internet Explorer*/ 
    color:#C0C4CC;
}
.hotel_down_list{
    text-align: center;
    font-size: 12px;
}
.hotel_down_list_icon{
    height: 20px;
}
.hotel_down_list_icon>img{
    width: 18px;
    height: 18px;
}
.hotel_down_list_tip{
    color: #A4A8AE;
}
.form_info_box{
    padding:10px 0 20px 0;
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
.hotel_mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    // margin-top: 45px;
    //     position: absolute;
    // top: 0;
    // left: 0;
    // width: 100%;
    // background: #fff;
    z-index: 999;
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
.hotel_search_input{
    width: 75%;
    height: 27px;
    border-radius: 15px;
    // border:1px solid #ddd;
    margin-left: 10px;
    padding-left: 20px;
    background: #FFF;
    border:none;
}
.focus_hotel_search_input{
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
@component-namespace 
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