import Vue from 'vue'
import {
  Toast
} from "mint-ui";  

const state = {  
  erpId:null, 
  planId:null, 
  theCurList: [],
  waitConfirm:{
    recNum:0,
    payNum:0
  }
}

const getters = {  
  erpId: state => state.erpId,
  planId: state => state.planId,
  theCurList: theCurList => state.theCurList,
  waitConfirm: waitConfirm => state.waitConfirm
}

const actions = {  
  change_erpId({commit}, erpId ){    
    commit('change_erpId',{ erpId })
  },
  change_planId({commit}, planId ){    
    commit('change_planId',{ planId })
  },
  change_theCurList({commit}, theCurList ){
    commit('change_theCurList',{ theCurList })
  },
  change_waitConfirm({commit}, waitConfirm ){
    commit('change_waitConfirm',{ waitConfirm })
  },
  //获取币种
  theCur_list({ commit, state, getters, rootGetters }, callback) {
    Vue.http.post(
      "/guide/common/currency",
      {
        erpId: state.erpId
      },
      {
        emulateJSON: true,
        headers:{"access-token":accessToken}
      }
    ).then(res => {      
      if(!res.body) return;
      if(res.body.success){
        let theCurList = res.body.data
        commit('change_theCurList',{theCurList})
        callback(theCurList);
      }else{
        Toast(res.body.msg);
      }   
    })
  },  
  //获取现收、现付未确认的记录数
  waitConfirm({ commit, state, getters, rootGetters }, callback) {
    Vue.http.post(
      "/guide/planbill/waitConfirm",
      {
        erpId: state.erpId,
        planId: state.planId
      },
      {
        emulateJSON: true,
        headers:{"access-token":accessToken}
      }
    ).then(res => {      
      if(!res.body) return;
      if(res.body.success){
        let data = res.body;
        let waitConfirm = state.waitConfirm;
        waitConfirm.recNum = data.recNum;
        waitConfirm.payNum = data.payNum;
        waitConfirm.canPayNum = data.canPayNum;
        waitConfirm.chePayNum = data.chePayNum;
        waitConfirm.dijiePayNum = data.dijiePayNum;
        waitConfirm.fangPayNum = data.fangPayNum;
        waitConfirm.kouanPayNum = data.kouanPayNum;
        waitConfirm.piaoPayNum = data.piaoPayNum;
        waitConfirm.qitaPayNum = data.qitaPayNum;
        commit('change_waitConfirm',{waitConfirm})
        callback(data);
      }else{
        Toast(res.body.msg);
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
  change_theCurList(state,{theCurList}){
    state.theCurList = theCurList
  },
  change_waitConfirm(state,{waitConfirm}){
    state.waitConfirm = waitConfirm
  }
  
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}