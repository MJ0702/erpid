import Vue from 'vue'

const sale_reset = {
  ID: "", //所属销售id
  userName: null, //所属销售名称
  SalePingAmountNos: null, //总欠款
  SaleMaxMoney: null, //额度
}

const assistant_reset = {
  ID: "", //助理id
  userName: null, //助理名称
}

const state = {
  sales: [],
  sale: Object.assign({}, sale_reset),
  assistants: [],
  assistant: Object.assign({}, assistant_reset),
  sales_rank: {
    day:[],
    week:[],
    month:[],
  },
}

const getters = {
  sales: state => state.sales,
  sale: state => state.sale,
  assistant: state => state.assistant,
  assistants: state => state.assistants,
  sales_rank: state => state.sales_rank,
}

const actions = {
  sales_search({ commit, getters }, keyword) {
    Vue.http.post(
      "order/sales",
      {
        query: keyword,
      },
      {emulateJSON: true}
    ).then(res => {
      if(!res.body) return;
      let sales = res.body.rows;
      commit("change_sales", { sales });
    })
  },
  sale_debt_request({ commit, state }) {
    let sale_id = state.sale.ID;
    Vue.http.post(
      "order/debt-amount",
      {
        query: sale_id,
      },
      {emulateJSON: true}
    ).then(res => {
      if(!res.body) return;
      let debt = res.body;
      state.sale.SalePingAmountNos = debt.SalePingAmountNos;
      state.sale.SaleMaxMoney = debt.SaleMaxMoney;
    })
  },
  sale_select({ commit, dispatch }, sale) {
    let newSale = Object.assign({}, sale_reset);
    Object.assign(newSale, sale);
    commit("change_sale", { sale: newSale });
    dispatch("sale_debt_request");
  },
  assistants_search({ commit, getters }, keyword) {
    Vue.http.post(
      "order/assistant",
      {
        query: keyword,
      },
      {emulateJSON: true}
    ).then(res => {
      if(!res.body) return;
      let assistants = res.body.rows;
      assistants = assistants.slice(1, assistants.length);
      commit("change_assistants", { assistants });
    })
  },
  assistant_select({ commit, dispatch }, assistant) {
    commit("change_assistant", { assistant });
  },
  sale_clear({ commit }) {
    commit("change_sale", { sale: Object.assign({}, sale_reset) });
  },
  assistant_clear({ commit }) {
    commit("change_assistant", { assistant: Object.assign({}, assistant_reset) });
  },
  order_new_clear_listener({ commit }) {
    commit("change_sale", { sale: Object.assign({}, sale_reset) });
    commit("change_assistant", { assistant: Object.assign({}, assistant_reset) });
  },
  sales_rank_request({ commit, state }, type) {
    let keys = Object.keys(state.sales_rank);
    if(keys.includes(type)) {
      let startDate = new Date();
      let endDate = new Date();
      if(keys.indexOf(type)==1) { //本周
        let day = startDate.getDay()
        startDate.setDate(startDate.getDate()-day+1);
        endDate.setDate(endDate.getDate()+(7-day));
      } else if (keys.indexOf(type)==2) { //本月
        let newDate = new Date(startDate.getFullYear(), startDate.getMonth()+1, 0);
        startDate.setDate(1);
        endDate.setDate(newDate.getDate());
      }
      startDate.setHours(0);
      startDate.setMinutes(0);
      startDate.setSeconds(0);
      startDate.setMilliseconds(0);
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);
      endDate.setMilliseconds(0);
      return Vue.http.post(
        "sale-list",
        {
          startDate: DateFmt(startDate, 'yyyy-MM-dd hh:mm:ss.S'),
          endDate: DateFmt(endDate, 'yyyy-MM-dd hh:mm:ss.S'),
        },
        {emulateJSON: true}
      ).then(res => {
        if(!res.body) return;
        let ranks = res.body;
        if(ranks.length>0) {
          commit("change_sales_rank", {ranks, type});
        }
        return ranks;
      })
    }
  },
  sales_rank_clear({ commit, state }) {
    for (let type in state.sales_rank) {
      commit("change_sales_rank", {ranks:[], type});
    }
  }
}

const mutations = {
  change_sales(state, { sales }) {
    state.sales = sales;
  },
  change_sale(state, { sale }) {
    state.sale = sale;
  },
  change_assistants(state, { assistants }) {
    state.assistants = assistants;
  },
  change_assistant(state, { assistant }) {
    state.assistant = assistant;
  },
  change_sales_rank(state, { ranks, type }) {
    state.sales_rank[type] = ranks;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
