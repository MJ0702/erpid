import Vue from 'vue'

const state = {
  sales_rank: {
    day:[],
    week:[],
    month:[],
  },
}

const getters = {
  sales_rank: state => state.sales_rank,
}

const actions = {
  sales_rank_request({ commit, state }, data) {
    let keys = Object.keys(state.sales_rank);
    let type=data.key;
    let rankType=data.rankType;
    if(keys.includes(type)) {
      let startDate = new Date();
      let endDate = new Date();
      if(keys.indexOf(type)==1) { //本周
        let day = startDate.getDay()
        if(day==0) {
          day = 7;
        }
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
          type:rankType,
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
