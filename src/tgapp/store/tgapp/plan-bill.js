import Vue from 'vue'
import {
  Toast
} from "mint-ui";   

const state = {  
  erpId:null, 
  planId:null,
  turnToList: false,
  data: {
    lineTitle: '',
    planCode: '',
    planDate: '',
    backDate: '',
    opName: '',
    mobile: '',
    cpyName: '',
    guideFeeAmount:0,
    recAmount:0,
    payAmount:0,
    signAmount:0,
    shopAmount:0,
    loanAmount:0,
    amount:0,
    recNum : 0,    
    payNum : 0
  }
}

const getters = {  
  erpId: state => state.erpId,
  planId:state => state.planId,
  turnToList: turnToList => state.turnToList,
  data: data => state.data
}

const actions = {  
  change_erpId({commit}, erpId ){    
    commit('change_erpId',{ erpId })
  },
  change_planId({commit}, planId ){
    commit('change_planId',{ planId })
  },
  change_turnToList({commit}, turnToList ){
    commit('change_turnToList',{ turnToList })
  },
  change_data({commit}, data ){
    commit('change_data',{ data })
  },
  findData({ commit, state, getters, rootGetters }) {
    Vue.http.post(
      "/guide/planbill/account",
      {
        erpId:state.erpId,
        planId:state.planId
      },
      {
        emulateJSON: true,
        headers:{"access-token":accessToken}
      }
    ).then(res => {      
      if(!res.body) return;      
      if(res.body.success){
        var record = res.body;
        let data = state.data;
        data.lineTitle =  record.lineTitle,
        data.planCode = record.planCode,
        data.planDate =  record.planDate,
        data.backDate = record.backDate,
        data.opName =  record.opName,
        data.mobile =  record.mobile,
        data.cpyName = record.cpyName,
        data.guideFeeAmount = record.guideFeeAmount||0,
        data.recAmount = record.recAmount||0,
        data.payAmount = record.payAmount||0,
        data.signAmount = record.signAmount||0,
        data.shopAmount = record.shopAmount||0,    
        data.loanAmount = record.loanAmount||0;
        data.amount = record.amount||0,
        data.recNum  = record.recNum ||0,
        data.payNum = record.payNum||0
      }else{
        if(res.body.code){
          window.location.href = '/guide/error.jsp?code='+res.body.code+'&errorMsg='+res.body.errorMsg+'&errorDesc='+res.body.errorDesc+'&erpname='+res.body.erpname+'&domain='+res.body.domain;
        }else{
          Toast(res.body.msg);
        }   
      }
    })
  },
  
}

const mutations = { 
  change_erpId(state,{erpId}){
    state.erpId = erpId
  },
  change_planId(state,{planId}){
    state.planId = planId
  },
  change_turnToList(state,{turnToList}){
    state.turnToList = turnToList
  },
  change_data(state,{data}){
    state.data = data
  }
  
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}