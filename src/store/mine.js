import Vue from 'vue'

const state = {
  mine: {},
  request_state: false,
  redDot: 0,
  mineDot:0,
  pushDot:0,
  redIDs: [],
  tips: [],
}

const getters = {
  mine: state => state.mine,
  redDot: state => state.redDot,
  redIDs: state => state.redIDs,
  mineDot: state => state.mineDot,
  pushDot: state => state.pushDot,
  tips: state => state.tips,

}

const actions = {
  mine_request({ state, commit, dispatch }) {
    if ((!state.mine || !state.mine.ID) && !state.request_state) {
      state.request_state = true;
      Vue.http.post(
        "profile/me",
      ).then(res => {
        if (!res.body) return;
        let mine = res.body.rows[0];
        commit("change_mine", { mine })
        state.request_state = false;
      });
      dispatch("sys/sys_request", null, { root: true }); //请求系统配置
      dispatch("sys/permit_request", null, { root: true }); //请求权限配置
    }
  },
  mine_login({ dispatch, commit }) {
    let sign = GetCookie("xqerp.wx");
    console.log(sign);
    let loginUrl = "/sys/service/wx/login"
    if (process.env.APP_HOST) {
      loginUrl = process.env.APP_HOST + loginUrl;
    }
    return Vue.http.post(
      loginUrl,
      {
        sign,
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      if (res.body.executeStatus == "0") {
        console.log("登录成功");
        dispatch("mine_request");
        return true;
      } else {
        console.log("登录失败");
        console.log(res.body);
        return false;
      }
    })
  },
  get_red_dot({ state, dispatch, commit }) {
    Vue.http.post(
      'pub/get-red-dot',
      {},
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let rows = res.body;
      let mineDot = 0;
      let pushDot = 0;
      if(rows.version_information==0){
        mineDot=1;
      }
      if(rows.get_push_msg==0){
        pushDot=1;
      }
      commit('change_mineDot', { mineDot });
      commit('change_pushDot', { pushDot });

    })
  },
  get_version_dot({ state, dispatch, commit }) {
    Vue.http.post(
      'pub/get-push-msg-red-dot',
      {},
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let rows = res.body;
      let redDot = 0;
      let redIDs = [];
      rows.forEach(x => {
        if (x.isRead==0) {
          redDot++;
          redIDs.push(x.ID);
        }
      });
      commit('change_redDot', { redDot });
      commit('change_redIDs', { redIDs });

    })
  },
  set_red_dot({ state, dispatch, commit }, ID) {
    Vue.http.post(
      'pub/set-red-dot',
      {
        ID
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let rows = res.body;
      if (rows.success) {
        Array.prototype.remove = function (val) {
          var index = this.indexOf(val);
          if (index > -1) {
            this.splice(index, 1);
          }
        };
        state.redDot--;
        state.redIDs.remove(ID);
      }
    })
  },
}

const mutations = {
  change_mine(state, { mine }) {
    state.mine = mine;
  },
  change_redDot(state, { redDot }) {
    state.redDot = redDot;
  },
  change_tips(state, { tips }) {
    state.tips = tips;
  },
  change_redIDs(state, { redIDs }) {
    state.redIDs = redIDs;
  },
  change_pushDot(state, { pushDot }) {
    state.pushDot = pushDot;
  },
  change_mineDot(state, { mineDot }) {
    state.mineDot = mineDot;
  },

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
