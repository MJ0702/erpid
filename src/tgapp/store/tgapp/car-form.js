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
  carTypeList: [],          //获取用车价格类型
  carPriceTypeList:[],      //获取用车类别
  car_supplier_list:[],     //供应商（车）
  car_record:{
    erpid:null,
    planId:null,
    id:null,
    costTableId:null,
    costTableName:"Line_Plan_Cost_Che",
    status:null,
    supCpyId:null,
    supCpyName:"",
    theAmount:"",
    amount:"",
    cashAmount:"",
    cashAmountCny:(0).toFixed(2),
    guideId:null,
    ordId:null,
    cashDate:DateFmt(new Date, 'yyyy-MM-dd'),
    simDesc:null,
    theCur:"",
    theRate:"",
    theCurName:"",
    theCurSign:"",
    theNum:null,
    thePrice:"",
    title:"",
    guideCheckout:1,
    costChe:{
        id:null,
        erpid:null,
        costId:null,
        theCarType:"",
        priceType:""
    }
  }   
}

const getters = {  
  erpId: state => state.erpId,
  planId: state => state.planId,
  status: state => state.status,
  editId: state => state.editId,
  carTypeList: carTypeList => state.carTypeList,
  carPriceTypeList: carPriceTypeList => state.carPriceTypeList,
  car_supplier_list:car_supplier_list => state.car_supplier_list,
  car_record:car_record=>state.car_record
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
  change_carTypeList({commit}, carTypeList ){
    commit('change_carTypeList',{ carTypeList })
  },
  change_carPriceTypeList({commit}, carPriceTypeList ){
    commit('change_carPriceTypeList',{ carPriceTypeList })
  },
  change_car_supplier_list({commit}, car_supplier_list ){
    commit('change_car_supplier_list',{ car_supplier_list })
  },
  change_car_record({commit}, car_record ){
    commit('change_car_record',{ car_record })
  },
   //获取车型
   carType_list({ commit, state, getters, rootGetters }, callback) {
    Vue.http.post(
      "/guide/common/baseText",
      {
        erpId: state.erpId,
        typeId: 113
      },
      {emulateJSON: true}
    ).then(res => {      
      if(!res.body) return;
      let carTypeList = res.body.data
      commit('change_carTypeList',{carTypeList})
      callback(carTypeList);
    })
  },  
  //获取用车价格类型
  carPrice_list({ commit, state, getters, rootGetters }, callback) {
    Vue.http.post(
      "/guide/common/baseText",
      {
        erpId: state.erpId,
        typeId: 222
      },
      {emulateJSON: true}
    ).then(res => {      
      if(!res.body) return;
      let carPriceTypeList = res.body.data
      commit('change_carPriceTypeList',{carPriceTypeList})
      callback(carPriceTypeList);
    })
  },  
  //获取供应商（景点）
  carSup_list({ commit, state, getters, rootGetters }) {
    Vue.http.post(
      "/guide/common/supCpy?skey="+state.skey,
      {
        erpId: state.erpId,
        supType:'che',
        // skey:state.skey
      },
      {emulateJSON: true}
    ).then(res => {      
      if(!res.body) return;
      let car_supplier_list = res.body.data
      commit('change_car_supplier_list',{car_supplier_list})
    })
  },
  //新增确认付款
  addConfirm({ commit, state, getters, rootGetters }, callback) {   
    let car_record = state.car_record;
    if(!isVerify(car_record)){
      return;
    } 
    car_record.action = 'confirm';
    car_record.status = '0';
    if((car_record.theNum>0) && (car_record.thePrice>0)){
      car_record.theAmount = car_record.thePrice*car_record.theNum;
      car_record.amount = car_record.thePrice*car_record.theNum*car_record.theRate;
    }else{
      car_record.theAmount = car_record.cashAmount;
      car_record.amount = car_record.cashAmountCny;
    }
    Vue.http.post(
      "/guide/pay/submit",
      JSON.stringify(car_record),
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
   car_record({ commit, state, getters, rootGetters }, callback) {
    // console.log(Vue.http);
    Vue.http.post(
      "/guide/pay/findById",
      {
        type:'che',
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
        let car_record = state.car_record;

        car_record.erpid = record.erpid,
        car_record.planId = record.planId,
        car_record.id = record.id,
        car_record.costTableId = record.costTableId,
        car_record.costTableName = record.costTableName,
        car_record.status = record.status,
        car_record.supCpyId = record.supCpyId,
        car_record.supCpyName = record.supCpyName,
        car_record.theAmount = record.theAmount,
        car_record.amount = record.amount,
        car_record.cashAmount = record.cashAmount,
        car_record.cashAmountCny = record.cashAmountCny,
        car_record.guideId = record.guideId,
        car_record.ordId = record.ordId,
        car_record.cashDate = record.cashDate?DateFmt(new Date(record.cashDate), 'yyyy-MM-dd'):DateFmt(new Date(), 'yyyy-MM-dd'),
        car_record.simDesc = record.simDesc,
        car_record.theCur = record.theCur,
        car_record.theRate = record.theRate.toFixed(4),
        car_record.theCurName = record.theCurName,
        car_record.theCurSign = record.theCurSign,
        car_record.theNum = record.theNum,
        car_record.thePrice = record.thePrice,
        car_record.title = record.title,
        car_record.guideCheckout = record.guideCheckout,
        car_record.costChe.id = record.costChe.id,
        car_record.costChe.erpid = record.costChe.erpid,
        car_record.costChe.costId = record.costChe.costId,
        car_record.costChe.theCarType = record.costChe.theCarType,
        car_record.costChe.priceType = record.costChe.priceType
        if(record.guideCheckout==2){//签单
          car_record.cashAmount = record.theAmount;
          car_record.cashAmountCny = record.amount;
        }
        commit('change_car_record',{car_record})
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
    let car_record = state.car_record;
    if(!isVerify(car_record)){
      return;
    } 
    car_record.action = 'confirm';
    car_record.status = state.status;
    if((car_record.theNum>0) && (car_record.thePrice>0)){
      car_record.theAmount = car_record.thePrice*car_record.theNum;
      car_record.amount = car_record.thePrice*car_record.theNum*car_record.theRate;
    }else{
      car_record.theAmount = car_record.cashAmount;
      car_record.amount = car_record.cashAmountCny;
    }
    Vue.http.post(
      "/guide/pay/submit",
      JSON.stringify(car_record),
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
    let car_record = state.car_record;
    car_record.action = 'delete';
    car_record.status = state.status;
    if((car_record.theNum>0) && (car_record.thePrice>0)){
      car_record.theAmount = car_record.thePrice*car_record.theNum;
      car_record.amount = car_record.thePrice*car_record.theNum*car_record.theRate;
    }else{
      car_record.theAmount = car_record.cashAmount;
      car_record.amount = car_record.cashAmountCny;
    }
    Vue.http.post(
      "/guide/pay/submit",
      JSON.stringify(car_record),
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
    var car_record = {
        action: 'confirm',
        erpid:null,
        planId:null,
        id:null,
        costTableId:null,
        costTableName:"Line_Plan_Cost_Che",
        status:null,
        supCpyId:null,
        supCpyName:"",
        theAmount:"",
        amount:"",
        cashAmount:"",
        cashAmountCny:(0).toFixed(2),
        guideId:null,
        ordId:null,
        cashDate:DateFmt(new Date, 'yyyy-MM-dd'),
        simDesc:null,
        theCur:"",
        theRate:"",
        theCurName:"",
        theCurSign:"",
        theNum:null,
        thePrice:"",
        title:"",
        guideCheckout:1,
        costChe:{
            id:null,
            erpid:null,
            costId:null,
            theCarType:"",
            priceType:""
        }
    };
    commit('change_car_record',{car_record});
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
  change_carTypeList(state,{carTypeList}){
    state.carTypeList = carTypeList
  },
  change_carPriceTypeList(state,{carPriceTypeList}){
    state.carPriceTypeList = carPriceTypeList
  },
  change_car_supplier_list(state,{car_supplier_list}){
    state.car_supplier_list = car_supplier_list
  },
  change_car_record(state,{car_record}){
    state.car_record = car_record
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
      if(parseFloat((record.thePrice*record.theNum).toFixed(2))!=(parseFloat(record.cashAmount))){
        Toast('请核对金额！');
        return false;
      }
    }
  } 
  return true;
}