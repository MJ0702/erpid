import Vue from 'vue'

const state = {
  sys: {},
  permit: {},

  request_state: false,
}

const getters = {
  sys: state => state.sys,
  permit: state => state.permit,
  get_plan_search_date_range: state => {
    if(state.sys.con_sysShow_20) {
      let m = state.sys.con_sysShow_20.split(",")[10];
      return Number(m);
    } else {
      return 1;
    }
  },
  get_if_has_permit_data: state => {
    if(state.permit&& Object.keys(state.permit).length > 0) {
      return true;
    }
    return false;
  },
}

const actions = {
  sys_request ({ commit }) {
    Vue.http.post(
      "system",
    ).then(res => {
      if(!res.body) return;
      let sys = res.body.rows[0];
      commit("change_sys", { sys })
    })
  },
  // force 强制请求，在一些需要同步的情况下使用，
  // 如订单列表刷新时要在请求完权限后再请求订单数据，否则出现页面渲染问题
  permit_request ({ state, commit }, force) {
    // commit("change_permit", { permit });
    // state.request_state = false;
    // return permit;
    if(force||((!state.permit||Object.keys(state.permit).length<1)&&!state.request_state)) {
      state.request_state = true;
      return Vue.http.post(
        "forbid",
      ).then(res => {
        if(!res.body) return;
        let permit = res.body;
        permit['me-receipt'].permit=false;  //扫码付收款功能不可赢
        commit("change_permit", { permit });
        state.request_state = false;
        return permit;
      }).catch(res=>{

      })
       
    }
  },
}

const mutations = {
  change_sys(state, { sys }) {
    state.sys = sys;
  },
  change_permit(state, { permit }) {
    state.permit = permit;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
