import Vue from 'vue'

const state = {
  turn_plan: {},
  turn_plan_remark: "",
  turn_plans_search: [],
  turn_plans_search_keyword: null,
  turn_plans_search_page: 1,
  turn_plans_search_limit: 10,
}

const getters = {
  turn_plan: state => state.turn_plan,
  turn_plans_search: state => state.turn_plans_search,
}

const actions = {
  turn_plan_select({ commit, state }, turn_plan) {
    commit("change_turn_plan", { turn_plan })
  },
  turn_plans_search ({ commit, getters, state, rootGetters }, keyword) {
    let query = {
      query: keyword,
      page: 1,
      start: 0,
      limit: state.turn_plans_search_limit,
    };
    if(keyword==state.turn_plans_search_keyword) {
      query.page = state.turn_plans_search_page-1;
      query.start = state.turn_plans_search_limit*(state.turn_plans_search_page);
    } else {
      state.turn_plans_search_page = 1;
    }
    return Vue.http.post(
      "",
      query,
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let rows = res.body.rows;
      if(keyword==state.turn_plans_search_keyword) {
        if(rows.length > 0) {
          state.turn_plans_search_page++;
          commit("incrase_turn_plans_search", { rows });
          return false;
        } else {
          return true;
        }
      } else {
        state.turn_plans_search_keyword = keyword;
        commit("change_turn_plans_search", { turn_plans_search:rows });
        return false;
      }
    })
  },
}

const mutations = {
  change_turn_plan(state, { turn_plan }) {
    state.turn_plan = turn_plan;
  },
  change_turn_plans_search (state, { turn_plans_search }) {
    state.turn_plans_search = turn_plans_search;
  },
  incrase_turn_plans_search (state, { turn_plans_search }) {
    state.turn_plans_search = state.turn_plans_search.concat(turn_plans_search);
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
