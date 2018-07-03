import Vue from 'vue'

const price_select_reset = {
  ID: "",
  price_title: "",
  adultPrice: 0,
  adultPrice1: 0,
  adultPrice2: 0,
  childPrice: 0,
  childPrice1: 0,
  sadultPrice: 0,
  sadultPrice1: 0,
  sadultPrice2: 0,
  schildPrice: 0,
  schildPrice1: 0,
  iadultPrice: 0,
  iadultPrice1: 0,
  iadultPrice2: 0,
  ichildPrice: 0,
  ichildPrice1: 0,
  DingPrice: 0,
  type: "0",
}

const state = {
  prices_select: [],
  price_select: Object.assign({}, price_select_reset),
}

const getters = {
  prices_select: state => state.prices_select,
  price_select: state => state.price_select,
}

const actions = {
  prices_select_request ({ commit, getters, rootGetters }) {
    let plan_id = rootGetters["plan/plan_id"];
    return Vue.http.post(
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
      commit("change_prices_select", { prices });
    })
  },
  price_select ({ commit }, price) {
    commit("change_price_select", { price });
  },
  order_new_clear_listener({ commit }) {
    commit("change_price_select", { price: Object.assign({}, price_select_reset) })
  },
}

const mutations = {
  change_prices_select (state, { prices }) {
    state.prices_select = prices;
  },
  change_price_select (state, { price }) {
    state.price_select = price;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
