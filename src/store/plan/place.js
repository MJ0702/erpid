import Vue from 'vue'

const state = {
  places_stay: []
}

const getters = {
  places_stay: state => state.places_stay,
}

const actions = {
  places_stay_request ({ commit, getters, rootGetters }) {
    Vue.http.post(
      "order/stay-perch-order",
      {
        planID: rootGetters["plan/plan_id"],
        isTicket: "0",
        isOK: "0",
      },
      {emulateJSON: true}
    ).then(res => {
      if(!res.body) return;
      let places = res.body.rows;
      commit("change_places_stay", { places })
    })
  },
}

const mutations = {
  change_places_stay(state, { places }) {
    state.places_stay = places;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
