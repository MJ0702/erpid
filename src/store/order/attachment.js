import Vue from 'vue'


const state = {
    notice_search_query: { //用以出团通知书数据
        accountTypeID: "", //账户字符串
    },
    attachment:[],
    attachmentSelect:{
      ID:'',
      ordID:'',
      planID:'',
      files:'',
      title:'',
      simDesc:'',
    },
    attach_search:[],
}

const getters = {
  attachment: state => state.attachment,
  attach_search: state => state.attach_search,
  attachmentSelect: state => state.attachmentSelect,
}

const actions = {
  attachment_request ({ commit,getters},{planID,ordID,skey}) {
    return Vue.http.post(
      "attachment",
      { 
        skey: skey || '',
        planID: planID,
        ordID:ordID,
        page: 1,
        start: 0,
        limit: 123456,
        sort:'[{"property":"addTime","direction":"asc"}]',
      },
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let rows = res.body.rows;

        commit("change_attachment", { rows });
      
    })
  },
  attachment_select ({ commit,getters},data) {
      commit("attachment_select", { data });
  },
  attachment_edit ({ commit,getters,dispatch},data) {
    return Vue.http.post(
      "attachment/edit",
      data,
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let rows = res.body.rows;
      dispatch("attachment_request",{planID:data.planID,ordID:data.ordID});
    })
  },
  attachment_add ({ commit,dispatch },data) {
    return Vue.http.post(
      "attachment/add",
      data,
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      // let rows = res.body.rows;
      dispatch("attachment_request",{planID:data.planID,ordID:data.ordID});
    })
  },
  attachment_del ({ commit,getters,dispatch},data) {
    return Vue.http.post(
      "attachment/del",
      {
        ID:data.ID
      },
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      dispatch("attachment_request",{planID:data.planID,ordID:data.ordID});
    })
  },
//   price_select ({ commit }, price) {
//     commit("change_price_select", { price });
//   },
}

const mutations = {
  change_attachment (state, { rows }) {
    state.attachment = rows;
  },
  attachment_select (state, { data }) {
    state.attachmentSelect = data;
  },
  attach_search (state, { rows }) {
    state.attach_search = rows;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
