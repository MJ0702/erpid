import Vue from 'vue'

const bankUrls={"建":"#icon-jiansheyinhang","邮":"#icon-youzhengyinhang1",
    "浦发":"#icon-pufayinhang","中行":"#icon-zhongguoyinhang",
    "农":"#icon-nongyeyinhang","招":"#icon-zhaoshangyinhang","交":"#icon-jiaotongyinhang",
    "平安":"#icon-307584007998","工":"#icon-gongshangyinhang","支付宝":"#icon-zhifubao","yin":"#icon-yinlianqia1"
      };
function filterBank(bank_account){
  return bank_account.map(function(x){
            let bankUrl_names=Object.getOwnPropertyNames(bankUrls);
            let arr=bankUrl_names.find(function(y){
                let name;
                try {
                    name=x.accBank.indexOf(y)
                } catch (error) {
                    name="#icon-yinlianzhifu".indexOf(y);
                }
                return name>-1;
            });
            if(arr===undefined){
                    return "yin";
            }
            return arr;
      });
}

const state = {
  bank_account: [],
  bank_page:1,
  bank_start:0,
  bank_limit:50,
  bank_isLock:0,
  bank_type:false,
  bank_search:[],
}

const getters = {
  bank_account: state => state.bank_account,
  bank_type:state => state.bank_type,
  bank_search:state => state.bank_search,
}

const actions = {
  bank_request({ commit, state }) {
    return Vue.http.post(
      "bank-account",
      {
        isLock: state.bank_isLock,
        page: state.bank_page,
        start: state.bank_start,
        limit: state.bank_limit,
        sort: '[{"property":"isLock","direction":"asc"},{"property":"bySort","direction":"desc"},{"property":"type","direction":"desc"}]',
      },
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let bank_account = res.body.rows;
      let url_arrs=filterBank(bank_account);
      bank_account.forEach(function(x,index){
            return x['url']=this[url_arrs[index]];
      },bankUrls);
        commit("change_bank_account", { bank_account });
    })
  },
  bank_search_request({ commit, state },bank) {
    return Vue.http.post(
      "bank-account",
      {
        skey:bank,
        isLock: state.bank_isLock,
        page: state.bank_page,
        start: state.bank_start,
        limit: state.bank_limit,
        sort: '[{"property":"isLock","direction":"asc"},{"property":"bySort","direction":"desc"},{"property":"type","direction":"desc"}]',
      },
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let bank_account = res.body.rows;
      let url_arrs=filterBank(bank_account);
      bank_account.forEach(function(x,index){
            return x['url']=this[url_arrs[index]];
      },bankUrls);
        commit("change_bank_search", { bank_account });
    })
  },
  change_bank_type({ commit },bank_type){
    commit("change_bank_type", { bank_type });
  }
}

const mutations = {
  change_bank_account(state, { bank_account }) {
    state.bank_account = bank_account;
  },
  change_bank_type(state, { bank_type }) {
    state.bank_type = bank_type;
  },
  change_bank_search(state, { bank_account }) {
    state.bank_search = bank_account;
  },
  
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
