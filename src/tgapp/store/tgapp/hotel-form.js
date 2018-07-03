import Vue from 'vue'
import {
  Toast
} from "mint-ui";
const state = {  
  erpId:null, 
  skey:'',
  planId:null,
  status:null,
  editId:null,
  roomTypeList: [],         //获取房型
  hotel_supplier_list:[],    //供应商（酒店）
  hotel_record:{                 
      erpid:null,
      planId:null, 
      id:null,
      costTableId:null,
      costTableName:"Line_Plan_Cost_Fang",  
      status:null,      
      supCpyId:null,    
      supCpyName:"",   
      theAmount:"",  
      amount:"",   
      cashAmount:"", 
      cashAmountCny:(0).toFixed(2), 
      guideId:null,    
      cashDate:DateFmt(new Date, 'yyyy-MM-dd'),
      theCur:"",
      theRate:"",
      theCurName:"",
      theCurSign:"",
      theNum:null,
      thePrice:"",
      title:"", 
      guideCheckout:1, 
      costFang:{ 
        id:null,
        erpid:null,
        costId:null,
        theRoomType:"", 
        theNightNum:1,  
        theDate1:new Date(), 
        theDate2:new Date((new Date()/1000+86400)*1000)
    }
  }   
}

const getters = {  
  erpId: state => state.erpId,
  planId: state => state.planId,
  status: state => state.status,
  editId: state => state.editId,
  roomTypeList: roomTypeList => state.roomTypeList,
  hotel_supplier_list:hotel_supplier_list => state.hotel_supplier_list,
  hotel_record:hotel_record=>state.hotel_record
}

const actions = {  
  change_erpId({commit}, erpId ){    
    commit('change_erpId',{ erpId })
  },
  change_planId({commit}, planId ){
    commit('change_planId',{ planId })
  },
  change_editId({commit}, editId ){
    commit('change_editId',{ editId })
  },
  change_status({commit}, status ){
    commit('change_status',{ status })
  },
  change_skey({commit}, skey ){    
    commit('change_skey',{ skey })
  },
  change_roomTypeList({commit}, roomTypeList ){
    commit('change_roomTypeList',{ roomTypeList })
  },
  change_hotel_supplier_list({commit}, hotel_supplier_list ){
    commit('change_hotel_supplier_list',{ hotel_supplier_list })
  },
  change_hotel_record({commit}, hotel_record ){
    commit('change_hotel_record',{ hotel_record })
  },
   //获取房型
   roomType_list({ commit, state, getters, rootGetters }, callback) {
    Vue.http.post(
      "/guide/common/baseText",
      {
        erpId: state.erpId,
        typeId: 114
      },
      {emulateJSON: true}
    ).then(res => {      
      if(!res.body) return;
      let roomTypeList = res.body.data
      commit('change_roomTypeList',{roomTypeList})
      callback(roomTypeList);
    })
  },  
  //获取供应商（酒店）
  hotelSup_list({ commit, state, getters, rootGetters }) {
    Vue.http.post(
      "/guide/common/supCpy?skey="+state.skey,
      {
        erpId: state.erpId,
        supType:'fang',
        // skey:state.skey
      },
      {emulateJSON: true}
    ).then(res => {      
      if(!res.body) return;
      let hotel_supplier_list = res.body.data
      commit('change_hotel_supplier_list',{hotel_supplier_list})
    })
  },
  //新增确认付款
  addConfirm({ commit, state, getters, rootGetters }, callback) {   
    let hotel_record = state.hotel_record;
    // console.log(state.hotel_record);
    if(!isVerify(hotel_record)){
      return;
    } 
    hotel_record.action = 'confirm';
    hotel_record.status = '0';
    if((hotel_record.theNum>0) && (hotel_record.thePrice>0)){
      hotel_record.theAmount = hotel_record.thePrice*hotel_record.theNum*hotel_record.costFang.theNightNum;
      hotel_record.amount = hotel_record.thePrice*hotel_record.theNum*hotel_record.costFang.theNightNum*hotel_record.theRate;
    }else{
      hotel_record.theAmount = hotel_record.cashAmount;
      hotel_record.amount = hotel_record.cashAmountCny;
    }
    Vue.http.post(
      "/guide/pay/submit",
      JSON.stringify(hotel_record),
      {
        emulateJSON: true,
        headers:{"access-token":accessToken}
      }
    ).then(res => {      
      if(!res.body) return;
      callback(res.body);       
    })
  },
   //查询酒店现付记录值
   hotel_record({ commit, state, getters, rootGetters }, callback) {
    Vue.http.post(
      "/guide/pay/findById",
      {
        type:'fang',
        erpId:state.erpId,
        planId:state.planId,
        id:state.editId,
        status:state.status
      },
      {
        emulateJSON: true,
        headers:{"access-token":accessToken}
      }
    ).then(res => {      
      if(!res.body) return;
      if(res.body.success){
        let record = res.body.data;
        let hotel_record = state.hotel_record;

        hotel_record.erpid = record.erpid,
        hotel_record.planId = record.planId, 
        hotel_record.id = record.id,
        hotel_record.costTableId = record.costTableId,
        hotel_record.costTableName = record.costTableName,  
        hotel_record.status = record.status,      
        hotel_record.supCpyId = record.supCpyId,    
        hotel_record.supCpyName = record.supCpyName,   
        hotel_record.theAmount = record.theAmount,  
        hotel_record.amount = record.amount,   
        hotel_record.cashAmount = record.cashAmount, 
        hotel_record.cashAmountCny = record.cashAmountCny, 
        hotel_record.guideId = record.guideId,    
        hotel_record.cashDate = record.cashDate?DateFmt(new Date(record.cashDate), 'yyyy-MM-dd'):DateFmt(new Date(), 'yyyy-MM-dd'),
        hotel_record.theCur = record.theCur,
        hotel_record.theRate = record.theRate.toFixed(4),
        hotel_record.theCurName = record.theCurName,
        hotel_record.theCurSign = record.theCurSign,
        hotel_record.theNum = record.theNum,
        hotel_record.thePrice = record.thePrice,
        hotel_record.title = record.title, 
        hotel_record.guideCheckout = record.guideCheckout, 
        hotel_record.costFang.id = record.costFang.id,
        hotel_record.costFang.erpid = record.costFang.erpid,
        hotel_record.costFang.costId = record.costFang.costId,
        hotel_record.costFang.theRoomType = record.costFang.theRoomType, 
        hotel_record.costFang.theNightNum = record.costFang.theNightNum,  
        hotel_record.costFang.theDate1 = record.costFang.theDate1?DateFmt(new Date(record.costFang.theDate1), 'yyyy-MM-dd'):DateFmt(new Date(), 'yyyy-MM-dd'), 
        hotel_record.costFang.theDate2 = record.costFang.theDate2?DateFmt(new Date(record.costFang.theDate2), 'yyyy-MM-dd'):DateFmt(new Date((new Date()/1000+86400)*1000))
        if(record.guideCheckout==2){//签单
          hotel_record.cashAmount = record.theAmount;
          hotel_record.cashAmountCny = record.amount;
        }
        commit('change_hotel_record',{hotel_record})
        callback(record);    
      }else{
        if(res.body.code){
          window.location.href = '/guide/error.jsp?code='+res.body.code+'&errorMsg='+res.body.errorMsg+'&errorDesc='+res.body.errorDesc+'&erpname='+res.body.erpname+'&domain='+res.body.domain;
        }else{
          Toast(res.body.msg);
        }   
      }
    })
  },  
   //编辑确认付款
  confirm({ commit, state, getters, rootGetters }, callback) {   
    let hotel_record = state.hotel_record;
    // console.log("status--: "+state.status);
    if(!isVerify(hotel_record)){
      return;
    } 
    hotel_record.action = 'confirm';
    hotel_record.status = state.status;
    // hotel_record.status = 1;
    if((hotel_record.theNum>0) && (hotel_record.thePrice>0)){
      hotel_record.theAmount = hotel_record.thePrice*hotel_record.theNum*hotel_record.costFang.theNightNum;
      hotel_record.amount = hotel_record.thePrice*hotel_record.theNum*hotel_record.costFang.theNightNum*hotel_record.theRate;
    }else{
      hotel_record.theAmount = hotel_record.cashAmount;
      hotel_record.amount = hotel_record.cashAmountCny;
    }
    Vue.http.post(
      "/guide/pay/submit",
      JSON.stringify(hotel_record),
      {
        emulateJSON: true,
        headers:{"access-token":accessToken}
      }
    ).then(res => {      
      if(!res.body) return;
      if(res.body.code){
        window.location.href = '/guide/error.jsp?code='+res.body.code+'&errorMsg='+res.body.errorMsg+'&errorDesc='+res.body.errorDesc+'&erpname='+res.body.erpname+'&domain='+res.body.domain;
      }else{
        Toast(res.body.msg);
      }  
      callback(res.body);       
    })
  }, 
  //删除
  delete({ commit, state, getters, rootGetters }, callback) {   
    let hotel_record = state.hotel_record;
    hotel_record.action = 'delete';
    // hotel_record.status = 1;
    hotel_record.status = state.status;
    if((hotel_record.theNum>0) && (hotel_record.thePrice>0)){
      hotel_record.theAmount = hotel_record.thePrice*hotel_record.theNum*hotel_record.costFang.theNightNum;
      hotel_record.amount = hotel_record.thePrice*hotel_record.theNum*hotel_record.costFang.theNightNum*hotel_record.theRate;
    }else{
      hotel_record.theAmount = hotel_record.cashAmount;
      hotel_record.amount = hotel_record.cashAmountCny;
    }
    Vue.http.post(
      "/guide/pay/submit",
      JSON.stringify(hotel_record),
      {
        emulateJSON: true,
        headers:{"access-token":accessToken}
      }
    ).then(res => {      
      if(!res.body) return;
      if(res.body.code){
        window.location.href = '/guide/error.jsp?code='+res.body.code+'&errorMsg='+res.body.errorMsg+'&errorDesc='+res.body.errorDesc+'&erpname='+res.body.erpname+'&domain='+res.body.domain;
      }else{
        Toast(res.body.msg);
      }  
      callback(res.body);       
    })
  }, 

  //清空输入的表单数据
  clearData({ commit, state, getters, rootGetters }) {
    var hotel_record = {
          action: 'confirm',
          erpid:null,
          planId:null, 
          id:null,
          costTableId:null,
          costTableName:"Line_Plan_Cost_Fang",  
          status:null,      
          supCpyId:null,    
          supCpyName:"",   
          theAmount:"",  
          amount:"",   
          cashAmount:"", 
          cashAmountCny:(0).toFixed(2), 
          guideId:null,    
          cashDate:DateFmt(new Date, 'yyyy-MM-dd'),
          theCur:"",
          theRate:"",
          theCurName:"",
          theCurSign:"",
          theNum:null,
          thePrice:"",
          title:"", 
          guideCheckout:1, 
          costFang:{ 
            id:null,
            erpid:null,
            costId:null,
            theRoomType:"", 
            theNightNum:1,  
            theDate1:new Date(), 
            theDate2:new Date((new Date()/1000+86400)*1000)
        }
    };
    commit('change_hotel_record',{hotel_record});
  },  
}

const mutations = { 
  change_erpId(state,{erpId}){
    state.erpId = erpId
  },
  change_planId(state,{planId}){
    state.planId = planId
  },
  change_editId(state,{editId}){
    state.editId = editId
  },
  change_status(state,{status}){
    state.status = status
  },
  change_skey(state,{skey}){
    state.skey = skey
  },
  change_roomTypeList(state,{roomTypeList}){
    state.roomTypeList = roomTypeList
  },
  change_hotel_supplier_list(state,{hotel_supplier_list}){
    state.hotel_supplier_list = hotel_supplier_list
  },
  change_hotel_record(state,{hotel_record}){
    state.hotel_record = hotel_record
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
//验证表单的输入合法性
function isVerify(record){
  if(record.guideCheckout==1){
    if(record.cashAmount==''){
      Toast('请输入金额');
      return false;
    }
    if(record.cashAmount==0){
      Toast('输入金额必须大于0！');
      return false;
    }
  } 
  //签单判断数量和单价
  if(record.guideCheckout==2){
    // if(record.thePrice==''){
    //   Toast('请输入单价');
    //   return false;
    // }
    // if(record.theNum==''){
    //   Toast('请输入数量');
    //   return false;
    // }
    if(record.cashAmount==''){
      Toast('请输入金额');
      return false;
    }
    if(record.cashAmount==''){
      Toast('输入金额必须大于0！');
      return false;
    }
    if((record.thePrice!='')&&(record.theNum!='')){
      if(parseFloat((record.thePrice*record.theNum*record.costFang.theNightNum).toFixed(2))!=(parseFloat(record.cashAmount))){
        Toast('请核对金额！');
        return false;
      }
    }
  } 
  return true;
}