import Vue from 'vue'

const followNews={
  userID:'',
  cpyID:'',  //客户公司
  noteBak:'',  //跟进内容	
  nextTime:'', //下次跟进时间	
  tags:'',     //跟进方式	
};

const state = {
  follow: [],
  followSelect:{},
  followNews:Object.assign({}, followNews),
}

const getters = {
  follow: state => state.follow,
  followSelect: state => state.followSelect,
  followNews: state => state.followNews,
}

const actions = {
  follow_request({ state, commit, dispatch }, userID) {
    if(!userID){
      userID='';
    }
    Vue.http.post(
      "cust-user/get-cpy-notes-info",
      {
        userID:userID
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let datas = res.body.rows;
      // let follow = res.body.rows;
      // if(userID){
      //   commit("change_followSelect", { datas })
      // }else{
        commit("change_follow", { datas })
      // }
    });
  },
  follow_select({ state, commit, dispatch },datas){
    commit('change_followSelect',{datas});
  },
  follow_add({ state, commit, dispatch }) {
    let query=state.followNews;
    return Vue.http.post(
      "cust-user/add-cpy-notes",
      query,
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let datas = res.body;
      return datas;
    });
  },
  follow_edit({ state, commit, dispatch },data) {
    // let query=state.followNews;
    return Vue.http.post(
      "cust-user/edit-cpy-notes",
      data,
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let datas = res.body;
      return datas;
    });
  },
}

const mutations = {
  change_follow(state, { datas }) {
    state.follow = datas;
  },
  change_followSelect(state, { datas }) {
    state.followSelect = datas;
  },

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
