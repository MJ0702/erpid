import Vue from 'vue'
import {
  Toast
} from "mint-ui";   

const state = {  
  erpId:null, 
  planId:null,
  editId:null,
  status:null,
  skey:'',
  canTypeList: [], //用餐类别
  canStandardList: [], //餐标
  priceTypeList: [], //价格类型
  meal_supplier_list:[],    //供应商（餐厅）
  meal_record: {
    action: 'confirm',
    erpid: null,
    planId: null,
    id: null,
    costTableId: null,
    costTableName: 'Line_Plan_Cost_Can',
    status: null,
    supCpyId: null,
    supCpyName: '',
    theAmount: 0,
    amount:0,
    cashAmount: '',
    cashAmountCny:(0).toFixed(2),
    guideId:null,
    // isOK:null,
    // okTime:null,
    ordId:null,
    cashDate: DateFmt(new Date, 'yyyy-MM-dd'),
    payman:"",
    pingAmount:0,
    simDesc:null,    
    theCur:"",
    theRate:1,
    theCurName: "",
    theCurSign: "",
    theNum:null,
    thePrice:0,
    title:"",
    guideCheckout: 1, //1.导游现付  2.导游签单
    costCan: {
      id: null,
      erpid: null,
      costId: null,
      canType: null,
      canStandard:null,
      priceType: null,
      theDate1: new Date()
    }
  }
}

const getters = {  
  erpId: state => state.erpId,
  planId:state => state.planId,
  editId:state => state.editId,
  status:state => state.status,
  skey: state => state.skey,
  canTypeList: canTypeList => state.canTypeList,
  canStandardList: canStandardList => state.canStandardList,
  priceTypeList: priceTypeList => state.priceTypeList,
  meal_supplier_list: meal_supplier_list => state.meal_supplier_list,
  meal_record: meal_supplier_list => state.meal_record
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
  change_canTypeList({commit}, canTypeList ){
    commit('change_canTypeList',{ canTypeList })
  },
  change_canStandardList({commit}, canStandardList ){
    commit('change_canStandardList',{ canStandardList })
  },
  change_priceTypeList({commit}, priceTypeList ){
    commit('change_priceTypeList',{ priceTypeList })
  },
  change_meal_supplier_list({commit}, meal_supplier_list ){
    commit('change_meal_supplier_list',{ meal_supplier_list })
  },
  change_meal_record({commit}, meal_record ){
    commit('change_meal_record',{ meal_record })
  },
  //获取用餐类别
  canType_list({ commit, state, getters, rootGetters }, callback) {
    Vue.http.post(
      "/guide/common/baseText",
      {
        erpId: state.erpId,
        typeId: 219
      },
      {
        emulateJSON: true,
        headers:{"access-token":accessToken}
      }
    ).then(res => {      
      if(!res.body) return;
      let canTypeList = res.body.data
      commit('change_canTypeList',{canTypeList})
      callback(canTypeList);
    })
  },  
  //餐标
  canStandard_list({ commit, state, getters, rootGetters }, callback) {
    Vue.http.post(
      "/guide/common/baseText",
      {
        erpId: state.erpId,
        typeId: 220
      },
      {
        emulateJSON: true,
        headers:{"access-token":accessToken}
      }
    ).then(res => {      
      if(!res.body) return;
      let canStandardList = res.body.data
      commit('change_canStandardList',{canStandardList})
      callback(canStandardList);
    })
  },  
  //价格类型
  priceTypeList_list({ commit, state, getters, rootGetters }, callback) {
    Vue.http.post(
      "/guide/common/baseText",
      {
        erpId: state.erpId,
        typeId: 221
      },
      {
        emulateJSON: true,
        headers:{"access-token":accessToken}
      }
    ).then(res => {      
      if(!res.body) return;
      let priceTypeList = res.body.data
      commit('change_priceTypeList',{priceTypeList})
      callback(priceTypeList);
    })
  },  
  //获取供应商（餐厅）
  mealSup_list({ commit, state, getters, rootGetters }) {
    Vue.http.post(
      "/guide/common/supCpy?skey="+state.skey,
      {
        erpId: state.erpId,
        supType:'can',
        // skey:state.skey //因为这里传值会出现中文乱码，所以带在地址上
      },
      {
        emulateJSON: true,
        headers:{"access-token":accessToken}
      }
    ).then(res => {      
      if(!res.body) return;
      let meal_supplier_list = res.body.data
      commit('change_meal_supplier_list',{meal_supplier_list})
    })
  }, 
  //新增确认付款
  addConfirm({ commit, state, getters, rootGetters }, callback) {   
    let meal_record = state.meal_record;
    if(!isVerify(meal_record)){
      return;
    }    
    meal_record.action = 'confirm';
    meal_record.status = "0";
    if((meal_record.theNum>0) && (meal_record.thePrice>0)){
      meal_record.theAmount = meal_record.thePrice*meal_record.theNum;
      meal_record.amount = meal_record.thePrice*meal_record.theNum*meal_record.theRate;
    }else{
      meal_record.theAmount = meal_record.cashAmount;
      meal_record.amount = meal_record.cashAmountCny;
    }
    Vue.http.post(
      "/guide/pay/submit",
      JSON.stringify(meal_record),
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
  //查询餐厅现付记录值
  meal_record({ commit, state, getters, rootGetters }, callback) {
    Vue.http.post(
      "/guide/pay/findById",
      {
        type:'can',
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
        let meal_record = state.meal_record;
        meal_record.erpid =  record.erpid,
        meal_record.planId = record.planId,
        meal_record.id =  record.id,
        meal_record.costTableId =  record.costTableId,
        meal_record.costTableName =  record.costTableName,
        meal_record.supCpyId =  record.supCpyId,
        meal_record.supCpyName =  record.supCpyName,
        meal_record.recRowId = record.recRowId,
        meal_record.status =  state.status,
        meal_record.theAmount =  record.theAmount,
        meal_record.amount = record.amount,
        meal_record.guideId = record.guideId,
        // meal_record.isOK = record.isOK,
        // meal_record.okTime = record.okTime,
        meal_record.ordId = record.ordId,
        meal_record.cashDate = record.cashDate?DateFmt(new Date(record.cashDate), 'yyyy-MM-dd'):DateFmt(new Date(), 'yyyy-MM-dd'),
        meal_record.cashAmount = record.cashAmount,
        meal_record.cashAmountCny = record.cashAmountCny,
        meal_record.pingAmount = record.pingAmount,
        meal_record.simDesc = record.simDesc,    
        meal_record.theCur = record.theCur,
        meal_record.theRate = record.theRate.toFixed(4),
        meal_record.theCurName = record.theCurName;
        meal_record.theCurSign = record.theCurSign;
        meal_record.theNum = record.theNum,
        meal_record.thePrice = record.thePrice,
        meal_record.title = record.title;
        meal_record.guideCheckout = record.guideCheckout;
        meal_record.costCan.id = record.costCan.id;
        meal_record.costCan.erpid = record.costCan.erpid;
        meal_record.costCan.costId = record.costCan.costId;
        meal_record.costCan.canType = record.costCan.canType;
        meal_record.costCan.canStandard = record.costCan.canStandard;
        meal_record.costCan.priceType = record.costCan.priceType;
        meal_record.costCan.theDate1 = record.costCan.theDate1; 
        if(record.guideCheckout==2){//签单
          meal_record.cashAmount = record.theAmount;
          meal_record.cashAmountCny = record.amount;
        }
        commit('change_meal_record',{meal_record})
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
    let meal_record = state.meal_record;
    // console.log("status--: "+state.status);
    if(!isVerify(meal_record)){
      return;
    } 
    meal_record.action = 'confirm';
    if((meal_record.theNum>0) && (meal_record.thePrice>0)){
      meal_record.theAmount = meal_record.thePrice*meal_record.theNum;
      meal_record.amount = meal_record.thePrice*meal_record.theNum*meal_record.theRate;
    }else{
      meal_record.theAmount = meal_record.cashAmount;
      meal_record.amount = meal_record.cashAmountCny;
    }
    Vue.http.post(
      "/guide/pay/submit",
      JSON.stringify(meal_record),
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
    let meal_record = state.meal_record;
    meal_record.action = 'delete';
    if((meal_record.theNum>0) && (meal_record.thePrice>0)){
      meal_record.theAmount = meal_record.thePrice*meal_record.theNum;
      meal_record.amount = meal_record.thePrice*meal_record.theNum*meal_record.theRate;
    }else{
      meal_record.theAmount = meal_record.cashAmount;
      meal_record.amount = meal_record.cashAmountCny;
    }
    Vue.http.post(
      "/guide/pay/submit",
      JSON.stringify(meal_record),
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
    var meal_record = {
          action: 'confirm',
          erpid: null,
          planId: null,
          id: null,
          costTableId: null,
          costTableName: 'Line_Plan_Cost_Can',
          status: null,
          supCpyId: null,
          supCpyName: '',
          theAmount: 0,
          amount:0,
          cashAmount: '',
          cashAmountCny: '',
          guideId:null,
          // isOK:null,
          // okTime:null,
          ordId:null,
          cashDate: DateFmt(new Date, 'yyyy-MM-dd'),
          payman:"",
          pingAmount:0,
          simDesc:null,    
          theCur:"",
          theRate:1,
          theCurName: "",
          theCurSign: "",
          theNum:null,
          thePrice:0,
          title:"",
          guideCheckout: 1, //1.导游现付  2.导游签单
          costCan: {
            id: null,
            erpid: null,
            costId: null,
            canType: null,
            canStandard:null,
            priceType: null,
            theDate1: new Date()
          }
    };
    commit('change_meal_record',{meal_record});
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
  change_canTypeList(state,{canTypeList}){
    state.canTypeList = canTypeList
  },
  change_canStandardList(state,{canStandardList}){
    state.canStandardList = canStandardList
  },
  change_priceTypeList(state,{priceTypeList}){
    state.priceTypeList = priceTypeList
  },
  change_meal_supplier_list(state,{meal_supplier_list}){
    state.meal_supplier_list = meal_supplier_list
  },
  change_meal_record(state,{meal_record}){
    state.meal_record = meal_record
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
      if(parseFloat((record.thePrice*record.theNum).toFixed(2))!=(parseFloat(record.cashAmount))){
        Toast('请核对金额！');
        return false;
      }
    }  
  } 
  return true;
}