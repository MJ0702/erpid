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
  tickePriceList: [],         //获取经典价格类型
  ticket_supplier_list:[],    //供应商（景点）
  ticket_record:{
      erpid:null,
      planId:null,
      id:null,
      costTableId:null,
      costTableName:"Line_Plan_Cost_Piao",
      status:null,
      supCpyId:null,
      supCpyName:"",
      theAmount:"",
      amount:"",
      cashAmount:"",
      cashAmountCny:(0).toFixed(2),
      guideId:null,
      ordId:null,
      // ordIds:null,
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
      costPiao:{
          id:null,
          erpid:null,
          costId:null,
          priceType:""
      }
  }   
}

const getters = {  
  erpId: state => state.erpId,
  planId: state => state.planId,
  status: state => state.status,
  editId: state => state.editId,
  tickePriceList: tickePriceList => state.tickePriceList,
  ticket_supplier_list:ticket_supplier_list => state.ticket_supplier_list,
  ticket_record:ticket_record=>state.ticket_record
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
  change_tickePriceList({commit}, tickePriceList ){
    commit('change_tickePriceList',{ tickePriceList })
  },
  change_ticket_supplier_list({commit}, ticket_supplier_list ){
    commit('change_ticket_supplier_list',{ ticket_supplier_list })
  },
  change_ticket_record({commit}, ticket_record ){
    commit('change_ticket_record',{ ticket_record })
  },
   //获取价格
   tickePrice_list({ commit, state, getters, rootGetters }, callback) {
    Vue.http.post(
      "/guide/common/baseText",
      {
        erpId: state.erpId,
        typeId: 223
      },
      {emulateJSON: true}
    ).then(res => {      
      if(!res.body) return;
      let tickePriceList = res.body.data
      commit('change_tickePriceList',{tickePriceList})
      callback(tickePriceList);
    })
  },  
  //获取供应商（景点）
  ticketSup_list({ commit, state, getters, rootGetters }) {
    Vue.http.post(
      "/guide/common/supCpy?skey="+state.skey,
      {
        erpId: state.erpId,
        supType:'piao',
        // skey:state.skey
      },
      {emulateJSON: true}
    ).then(res => {      
      if(!res.body) return;
      let ticket_supplier_list = res.body.data
      commit('change_ticket_supplier_list',{ticket_supplier_list})
    })
  },
  //新增确认付款
  addConfirm({ commit, state, getters, rootGetters }, callback) {   
    let ticket_record = state.ticket_record;
    if(!isVerify(ticket_record)){
      return;
    } 
    ticket_record.action = 'confirm';
    ticket_record.status = '0';
    if((ticket_record.theNum>0) && (ticket_record.thePrice>0)){
      ticket_record.theAmount = ticket_record.thePrice*ticket_record.theNum;
      ticket_record.amount = ticket_record.thePrice*ticket_record.theNum*ticket_record.theRate;
    }else{
      ticket_record.theAmount = ticket_record.cashAmount;
      ticket_record.amount = ticket_record.cashAmountCny;
    }
    Vue.http.post(
      "/guide/pay/submit",
      JSON.stringify(ticket_record),
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
   ticket_record({ commit, state, getters, rootGetters }, callback) {
    // console.log(Vue.http);
    Vue.http.post(
      "/guide/pay/findById",
      {
        type:'piao',
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
        let ticket_record = state.ticket_record;

        ticket_record.erpid = record.erpid,
        ticket_record.planId = record.planId,
        ticket_record.id = record.id,
        ticket_record.costTableId = record.costTableId,
        ticket_record.costTableName = record.costTableName,
        ticket_record.status = record.status,
        ticket_record.supCpyId = record.supCpyId,
        ticket_record.supCpyName = record.supCpyName,
        ticket_record.theAmount = record.theAmount,
        ticket_record.amount = record.amount,
        ticket_record.cashAmount = record.cashAmount,
        ticket_record.cashAmountCny = record.cashAmountCny,
        ticket_record.guideId = record.guideId,
        ticket_record.ordId = record.ordId,
        // ticket_record.ordIds =record.ordIds,
        ticket_record.cashDate = record.cashDate?DateFmt(new Date(record.cashDate), 'yyyy-MM-dd'):DateFmt(new Date(), 'yyyy-MM-dd'),
        ticket_record.simDesc = record.simDesc,
        ticket_record.theCur = record.theCur,
        ticket_record.theRate = record.theRate.toFixed(4),
        ticket_record.theCurName = record.theCurName,
        ticket_record.theCurSign = record.theCurSign,
        ticket_record.theNum = record.theNum,
        ticket_record.thePrice = record.thePrice,
        ticket_record.title = record.title,
        ticket_record.guideCheckout = record.guideCheckout,
        ticket_record.costPiao.id = record.costPiao.id,
        ticket_record.costPiao.erpid = record.costPiao.erpid,
        ticket_record.costPiao.costId = record.costPiao.costId,
        ticket_record.costPiao.priceType = record.costPiao.priceType
        if(record.guideCheckout==2){//签单
          ticket_record.cashAmount = record.theAmount;
          ticket_record.cashAmountCny = record.amount;
        }
        commit('change_ticket_record',{ticket_record})
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
    let ticket_record = state.ticket_record;
    if(!isVerify(ticket_record)){
      return;
    } 
    ticket_record.action = 'confirm';
    // ticket_record.status = 1;
    ticket_record.status = state.status;
    if((ticket_record.theNum>0) && (ticket_record.thePrice>0)){
      ticket_record.theAmount = ticket_record.thePrice*ticket_record.theNum;
      ticket_record.amount = ticket_record.thePrice*ticket_record.theNum*ticket_record.theRate;
    }else{
      ticket_record.theAmount = ticket_record.cashAmount;
      ticket_record.amount = ticket_record.cashAmountCny;
    }
    Vue.http.post(
      "/guide/pay/submit",
      JSON.stringify(ticket_record),
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
    let ticket_record = state.ticket_record;
    ticket_record.action = 'delete';
    // ticket_record.status = 1;
    ticket_record.status = state.status;
    if((ticket_record.theNum>0) && (ticket_record.thePrice>0)){
      ticket_record.theAmount = ticket_record.thePrice*ticket_record.theNum;
      ticket_record.amount = ticket_record.thePrice*ticket_record.theNum*ticket_record.theRate;
    }else{
      ticket_record.theAmount = ticket_record.cashAmount;
      ticket_record.amount = ticket_record.cashAmountCny;
    }
    Vue.http.post(
      "/guide/pay/submit",
      JSON.stringify(ticket_record),
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
    var ticket_record = {
        action: 'confirm',
        erpid:null,
        planId:null,
        id:null,
        costTableId:null,
        costTableName:"Line_Plan_Cost_Piao",
        status:"0",
        supCpyId:null,
        supCpyName:"",
        theAmount:"",
        amount:"",
        cashAmount:"",
        cashAmountCny:(0).toFixed(2),
        guideId:null,
        ordId:null,
        // ordIds:null,
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
        costPiao:{
            id:null,
            erpid:null,
            costId:null,
            priceType:""
        }
    };
    commit('change_ticket_record',{ticket_record});
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
  change_tickePriceList(state,{tickePriceList}){
    state.tickePriceList = tickePriceList
  },
  change_ticket_supplier_list(state,{ticket_supplier_list}){
    state.ticket_supplier_list = ticket_supplier_list
  },
  change_ticket_record(state,{ticket_record}){
    state.ticket_record = ticket_record
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