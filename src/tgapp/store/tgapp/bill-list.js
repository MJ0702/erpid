import Vue from 'vue'
import {
  Toast
} from "mint-ui";  

const state = {
  receivables_list: [],             //团期导游代收列表  
  receivables_list_query:{          //团期导游代收查询条件
    skey:''
  },
  pay_list: [],             //团期导游代收列表  
  pay_list_query:{          //团期导游代收查询条件
    type:'',
    skey:''
  },
  erpId:null, 
  planId:null,
  tabActivity: 1
}

const getters = {  
  erpId: state => state.erpId,
  planId:state => state.planId,
  tabActivity: state => state.tabActivity,
  receivables_list: state => state.receivables_list,
  receivables_list_query:state => state.receivables_list_query,
  pay_list: state => state.pay_list,
  pay_list_query:state => state.pay_query

}

const actions = {  
  change_erpId({commit}, erpId ){    
    commit('change_erpId',{ erpId })
  },
  change_planId({commit}, planId ){
    commit('change_planId',{ planId })
  }, 
  change_tabActivity({commit}, tabActivity ){
    commit('change_tabActivity',{ tabActivity })
  }, 
  change_pay_list_query({commit}, pay_list_query ){
    commit('change_pay_list_query',{ pay_list_query })
  },  
  //团期代收
  receivables_list({ commit, state, getters, rootGetters }) {
    Vue.http.post(
      "/guide/proxyincome/list",
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
        let receivables_list = res.body.data
        commit('change_receivables_list',{receivables_list})
      }else{
        if(res.body.code){
          window.location.href = '/guide/error.jsp?code='+res.body.code+'&errorMsg='+res.body.errorMsg+'&errorDesc='+res.body.errorDesc+'&erpname='+res.body.erpname+'&domain='+res.body.domain;
        }else{
          Toast(res.body.msg);
        }   
      }
    })
  },  
  //导游付款
  pay_list({ commit, state, getters, rootGetters }) {
    let query = state.pay_list_query
    let type = query.type;
    Vue.http.post(
      "/guide/pay/list",
      {
        erpId:state.erpId,
        planId:state.planId,
        type: type
      },
      {
        emulateJSON: true,
        headers:{"access-token":accessToken}
      }
    ).then(res => {      
      if(!res.body) return;
      if(res.body.success){
        let pay_list = res.body.data      
        commit('change_pay_list',{pay_list})
      }else{
        if(res.body.code){
          window.location.href = '/guide/error.jsp?code='+res.body.code+'&errorMsg='+res.body.errorMsg+'&errorDesc='+res.body.errorDesc+'&erpname='+res.body.erpname+'&domain='+res.body.domain;
        }else{
          Toast(res.body.msg);
        }   
      }
    })
  } 
  
}

const mutations = { 
  change_erpId(state,{erpId}){
    state.erpId = erpId
  },
  change_planId(state,{planId}){
    state.planId = planId
  },
  change_tabActivity(state,{tabActivity}){
    state.tabActivity = tabActivity
  },
  change_receivables_list(state,{receivables_list}){    
    state.receivables_list = receivables_list;
  },
  change_pay_list(state,{pay_list}){  
    if(pay_list){
      pay_list.forEach(item => {
        var disAmount = 0;
        if(item.guideCheckout==1){
          disAmount = item.cashAmountCny;
        }else{
          disAmount = item.amount;
        }  
        item.disAmount = disAmount;       
        var detailTag = '', detailDesc_1 = '', detailDesc_2 = '', moreDesc = '';
        if(item.costType=='fang'){
          detailTag = '房型：';
          detailDesc_1 = item.theRoomType==null||item.theRoomType==''?'--':item.theRoomType;
          moreDesc = '晚数 ' +(item.theNightNum||'');
        }else if(item.costType=='can'){
          detailTag = '用餐：';
          var canType = item.canType==null||item.canType==''?'--':item.canType;
          var canStandard = item.canStandard==null||item.canStandard==''?'--':item.canStandard;
          var priceType = item.priceType==null||item.priceType==''?'--':item.priceType;
          detailDesc_1 = canType + ' - ' + canStandard;
          detailDesc_2 = priceType;
        }else if(item.costType=='che'){
          detailTag = '车型：';
          var theCarType = item.theCarType==null||item.theCarType==''?'--':item.theCarType;
          var priceType = item.priceType==null||item.priceType==''?'--':item.priceType;
          detailDesc_1 = theCarType;
          detailDesc_2 = priceType;
        }else if(item.costType=='piao'){
          detailTag = '价格类型：';
          detailDesc_1 = item.priceType==null||item.priceType==''?'--':item.priceType;
        }else if(item.costType=='qita'){
          detailTag = '';
        }
        item.detailTag = detailTag;
        item.detailDesc_1 = detailDesc_1;
        item.detailDesc_2 = detailDesc_2;
        item.moreDesc = moreDesc;
      });
    }
    state.pay_list = pay_list;
  },
  change_pay_list_query(state,{pay_list_query}){    
    state.pay_list_query = pay_list_query;
  }
  
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}