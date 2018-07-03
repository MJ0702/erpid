import Vue from 'vue'

const state = {
  notices: [],
  notice: {},
}

const getters = {
  notices: state => state.notices,
  notice: state => state.notice,
}

const actions = {
  notices_request ({ commit }) {
    return Vue.http.post(
      "notice",
      {},
      {emulateJSON: true},
    ).then(res => {
      if(!res.body) return;
      let notices = res.body.rows;
      commit("change_notices", { notices });
      return notices;
    })
  },
  notice_select ({ commit }, notice) {
    Vue.http.post(
      "notice/detail",
      {
        ID: notice.ID,
      },
      {emulateJSON: true},
    ).then(res => {
      if(!res.body) return;
      if(!res.body.rows||res.body.rows.length<1) return;
      let notice = res.body.rows[0];
      commit("change_notice", { notice })
    })
  },
}

const mutations = {
  change_notices (state, { notices }) {
    state.notices = notices;
  },
  change_notice (state, { notice }) {
    state.notice = notice;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
