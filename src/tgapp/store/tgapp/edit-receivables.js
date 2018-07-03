import Vue from 'vue'
import {
  Toast
} from "mint-ui";   

const state = {  
  erpId:null, 
  planId:null,
  editId:null,
  status:null,
  receivables_sel: {
    action: 'confirm',
    erpid: null,
    planId: null,
    id: null,
    recRowId: null,
    status: null,
    theAmount: 0,
    amount:0,
    guideId:null,
    // isOK:null,
    // okTime:null,
    ordId:null,
    payDate: DateFmt(new Date, 'yyyy-MM-dd'),
    payman:"",
    pingAmount:0,
    simDesc:null,    
    theCur:"",
    theRate:1,
    theCurName: "",
    theCurSign: "",
    theNum:null,
    thePrice:0,
    title:""
  }
}

const getters = {  
  erpId: state => state.erpId,
  planId:state => state.planId,
  editId:state => state.editId,
  status:state => state.status,
  receivables_sel:receivables_sel => state.receivables_sel,
}

const actions = {  
  //查询代收记录值
  receivables_sel({ commit, state, getters, rootGetters }) {
    console.log(Vue.http);
    Vue.http.post(
      "/guide/proxyincome/findById",
      {
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
        let receivables_sel = state.receivables_sel;
        receivables_sel.erpid =  record.erpid,
        receivables_sel.planId = record.planId,
        receivables_sel.id =  record.id,
        receivables_sel.recRowId = record.recRowId,
        receivables_sel.status =  state.status,
        receivables_sel.theAmount =  record.theAmount,
        receivables_sel.amount = record.amount,
        receivables_sel.guideId = record.guideId,
        // receivables_sel.isOK = record.isOK,
        // receivables_sel.okTime = record.okTime,
        receivables_sel.ordId = record.ordId,
        receivables_sel.payDate = record.payDate?new Date(record.payDate):new Date(),
        receivables_sel.payman = record.payman,
        receivables_sel.pingAmount = record.pingAmount,
        receivables_sel.simDesc = record.simDesc,    
        receivables_sel.theCur = record.theCur,
        receivables_sel.theRate = record.theRate,
        receivables_sel.theCurName = record.theCurName;
        receivables_sel.theCurSign = record.theCurSign;
        receivables_sel.theNum = record.theNum,
        receivables_sel.thePrice = record.thePrice,
        receivables_sel.title = record.title;
        commit('change_receivables_sel',{receivables_sel})
      }else{
        if(res.body.code){
          window.location.href = '/guide/error.jsp?code='+res.body.code+'&errorMsg='+res.body.errorMsg+'&errorDesc='+res.body.errorDesc+'&erpname='+res.body.erpname+'&domain='+res.body.domain;
        }else{
          Toast(res.body.msg);
        }   
      }
    })
  },  
  confirm({ commit, state, getters, rootGetters }, callback) {   
    let receivables_sel = state.receivables_sel;
    receivables_sel.action = 'confirm';
    Vue.http.post(
      "/guide/proxyincome/confirm",
      JSON.stringify(receivables_sel),
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
  delete({ commit, state, getters, rootGetters }, callback) {
    let receivables_sel = state.receivables_sel;
    receivables_sel.action = 'delete';
    Vue.http.post(
      "/guide/proxyincome/delete",
      JSON.stringify(receivables_sel),
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
  change_receivables_sel({commit}, receivables_sel ){
    commit('change_receivables_sel',{ receivables_sel })
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
  change_receivables_sel(state,{receivables_sel}){
    state.receivables_sel = receivables_sel
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}