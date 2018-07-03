import Vue from 'vue'

const state = {
  prices: [],
  price_show: {},
}

const getters = {
  prices: state => state.prices,
  price_show: state => state.price_show,
}

const actions = {
  prices_request ({ commit, getters, rootGetters }) {
    let plan_id = rootGetters["plan/plan_id"];
    Vue.http.post(
      "order/price",
      {
        planID: plan_id,
        page: 1,
        start: 0,
        limit: 123456,
      },
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let prices = res.body.rows;
      commit("change_price_show", { price: prices[0] });
      commit("change_prices", { prices });
    })
  },
}

const mutations = {
  change_prices (state, { prices }) {
    state.prices = prices;
  },
  change_price_show (state, { price }) {
    state.price_show = price;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
