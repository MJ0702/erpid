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
  other_supplier_list:[],    //供应商（其他）
  other_record:{
      erpid:null,
      planId:null,
      id:null,
      costTableId:null,
      costTableName:"Line_Plan_Cost_Qita",
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
      guideCheckout:1
  }   
}

const getters = {  
  erpId: state => state.erpId,
  planId: state => state.planId,
  status: state => state.status,
  editId: state => state.editId,
  other_supplier_list:other_supplier_list => state.other_supplier_list,
  other_record:other_record=>state.other_record
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
  change_other_supplier_list({commit}, other_supplier_list ){
    commit('change_other_supplier_list',{ other_supplier_list })
  },
  change_other_record({commit}, other_record ){
    commit('change_other_record',{ other_record })
  }, 
  //获取供应商（其他）
  otherSup_list({ commit, state, getters, rootGetters }) {
    Vue.http.post(
      "/guide/common/supCpy?skey="+state.skey,
      {
        erpId: state.erpId,
        supType:'pub',
        // skey:state.skey
      },
      {emulateJSON: true}
    ).then(res => {      
      if(!res.body) return;
      let other_supplier_list = res.body.data
      commit('change_other_supplier_list',{other_supplier_list})
    })
  },
   //新增确认付款(现收)
   addConfirm({ commit, state, getters, rootGetters }, callback) {   
    let other_record = state.other_record;
    if(!isVerify(other_record)){
      return;
    } 
    other_record.action = 'confirm';
    other_record.status = '0';
    if((other_record.theNum>0) && (other_record.thePrice>0)){
      other_record.theAmount = other_record.thePrice*other_record.theNum;
      other_record.amount = other_record.thePrice*other_record.theNum*other_record.theRate;
    }else{
      other_record.theAmount = other_record.cashAmount;
      other_record.amount = other_record.cashAmountCny;
    }
    Vue.http.post(
      "/guide/pay/submit",
      JSON.stringify(other_record),
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
   other_record({ commit, state, getters, rootGetters }, callback) {
    // console.log(Vue.http);
    Vue.http.post(
      "/guide/pay/findById",
      {
        type:'qita',
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
        let other_record = state.other_record;

        other_record.erpid = record.erpid,
        other_record.planId = record.planId,
        other_record.id = record.id,
        other_record.costTableId = record.costTableId,
        other_record.costTableName = record.costTableName,
        other_record.status = record.status,
        other_record.supCpyId = record.supCpyId,
        other_record.supCpyName = record.supCpyName,
        other_record.theAmount = record.theAmount,
        other_record.amount = record.amount,
        other_record.cashAmount = record.cashAmount,
        other_record.cashAmountCny = record.cashAmountCny,
        other_record.guideId = record.guideId,
        other_record.ordId = record.ordId,
        other_record.cashDate = record.cashDate?DateFmt(new Date(record.cashDate), 'yyyy-MM-dd'):DateFmt(new Date(), 'yyyy-MM-dd'),
        other_record.simDesc = record.simDesc,
        other_record.theCur = record.theCur,
        other_record.theRate = record.theRate.toFixed(4),
        other_record.theCurName = record.theCurName,
        other_record.theCurSign = record.theCurSign,
        other_record.theNum = record.theNum,
        other_record.thePrice = record.thePrice,
        other_record.title = record.title,
        other_record.guideCheckout = record.guideCheckout
        if(record.guideCheckout==2){//签单
          other_record.cashAmount = record.theAmount;
          other_record.cashAmountCny = record.amount;
        }
        commit('change_other_record',{other_record})
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
    let other_record = state.other_record;
    if(!isVerify(other_record)){
      return;
    } 
    other_record.action = 'confirm';
    other_record.status = state.status;
    if((other_record.theNum>0) && (other_record.thePrice>0)){
      other_record.theAmount = other_record.thePrice*other_record.theNum;
      other_record.amount = other_record.thePrice*other_record.theNum*other_record.theRate;
    }else{
      other_record.theAmount = other_record.cashAmount;
      other_record.amount = other_record.cashAmountCny;
    }
    Vue.http.post(
      "/guide/pay/submit",
      JSON.stringify(other_record),
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
    let other_record = state.other_record;
    other_record.action = 'delete';
    other_record.status = state.status;
    if((other_record.theNum>0) && (other_record.thePrice>0)){
      other_record.theAmount = other_record.thePrice*other_record.theNum;
      other_record.amount = other_record.thePrice*other_record.theNum*other_record.theRate;
    }else{
      other_record.theAmount = other_record.cashAmount;
      other_record.amount = other_record.cashAmountCny;
    }
    Vue.http.post(
      "/guide/pay/submit",
      JSON.stringify(other_record),
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
    var other_record = {
        action: 'confirm',
        erpid:null,
        planId:null,
        id:null,
        costTableId:null,
        costTableName:"Line_Plan_Cost_Qita",
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
        guideCheckout:1
    };
    commit('change_other_record',{other_record});
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
  change_other_supplier_list(state,{other_supplier_list}){
    state.other_supplier_list = other_supplier_list
  },
  change_other_record(state,{other_record}){
    state.other_record = other_record
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