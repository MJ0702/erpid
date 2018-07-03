import Vue from 'vue'

const city_reset = {
  city: null, //未知
  fromCityID: "", //起止城市ID
  fromCityName: null, //起止城市名称
  num_ord: null, //订单数量
  policy_id: "", //联运政策ID
  pub_fromcity_id: "", //城市ID
  sale_price: null, //联运价格
  transport_city_id: "", //联运城市ID
}

const state = {
  citys: [],
  city: Object.assign({}, city_reset),
}

const getters = {
  citys: state => state.citys,
  city: state => state.city,
}

const actions = {
  citys_request({ commit, getters, rootGetters }) {
    return Vue.http.post(
      "order/from-city",
      {
        planID: rootGetters["plan/plan_id"],
        page: 1,
        start: 0,
        limit: 123456,
      },
      {emulateJSON: true}
    ).then(res => {
      if(!res.body) return;
      let citys = res.body.rows;
      commit("change_citys", { citys });
    })
  },
  city_select({ commit }, city) {
    commit("change_city", { city })
  },
  order_new_clear_listener({ commit }) {
    commit("change_city", { city: Object.assign({}, city_reset) })
  },
}

const mutations = {
  change_citys(state, { citys }) {
    state.citys = citys;
  },
  change_city(state, { city }) {
    state.city = city;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
