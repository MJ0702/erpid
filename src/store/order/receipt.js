import Vue from 'vue'

const state = {
  receipts: [],
  receipt_select: {},
  receipts_page: 1,
  receipts_limit: 50,

  titles: [],
  curs: [],
  paytypes: [],
  accinfos: [],

  receipt_pings: [],
  receipt_pings_page: 1,
  receipt_pings_limit: 50,
}

const getters = {
  receipts: state => state.receipts,
  receipt_select: state => state.receipt_select,
  titles: state => state.titles,
  curs: state => state.curs,
  paytypes: state => state.paytypes,
  accinfos: state => state.accinfos,
  receipt_pings: state => state.receipt_pings,
}

const actions = {
  receipts_request ({ commit, state, getters, rootGetters }) {
    let order_id = rootGetters["order/order_id"];
    return Vue.http.post(
      "receipt",
      {
        ordID: order_id||null,
        page: state.receipts_page,
        start: state.receipts_limit*(state.receipts_page-1),
        limit: state.receipts_limit,
        sort: '[{"property":"ID","direction":"asc"}]'
      },
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let receipts = res.body.rows;
      if (receipts.length > 0) {
        state.receipts_page++;
        commit("incrase_receipts", { receipts });
        return false;
      } else {
        return true;
      }
    })
  },
  receipts_clear({ commit, state }) {
    state.receipts_page = 1;
    commit("change_receipts", { receipts:[] });
  },
  receipt_pings_request ({ commit, state, getters, rootGetters }) {
    let order_id = rootGetters["order/order_id"];
    return Vue.http.post(
      "receipt/ping-zhang-list",
      {
        ordID: order_id||null,
        page: state.receipt_pings_page,
        start: state.receipt_pings_limit*(state.receipt_pings_page-1),
        limit: state.receipt_pings_limit,
        sort: '[{"property":"ID","direction":"asc"}]'
      },
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let pings = res.body.rows;
      if (pings.length > 0) {
        state.receipt_pings_page++;
        commit("change_receipt_pings", { pings });
        return false;
      } else {
        return true;
      }
    })
  },
  receipt_select ({ commit }, receipt) {
    commit("change_receipt_select", { receipt });
  },
  thecurs_request ({commit}) { //获取币种
    return Vue.http.post(
      "pub-curRate",
      {
        skey: null,
        page: 1,
        start: 0,
        limit: 123456,
        sort: '[{"property":"bySort","direction":"desc"},{"property":"isLock","direction":"asc"}]'
      },
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let curs = res.body.rows;
      if (curs.length > 0) {
        commit("change_curs", { curs });
      }
    })
  },
  titles_request ({commit}) { //获取摘要说明
    return Vue.http.post(
      "bast-text",
      {
        type: 132,
        page: 1,
        start: 0,
        limit: 123456,
      },
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let titles = res.body.rows;
      if (titles.length > 0) {
        commit("change_titles", { titles });
      }
    })
  },
  paytypes_request ({commit}) { //获取收款方式
    return Vue.http.post(
      "bast-text",
      {
        type: 128,
        page: 1,
        start: 0,
        limit: 123456,
      },
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let paytypes = res.body.rows;
      if (paytypes.length > 0) {
        commit("change_paytypes", { paytypes });
      }
    })
  },
  accinfos_request ({commit}) { //获取收款账户
    return Vue.http.post(
      "base-account",
      {
        query: null,
        page: 1,
        start: 0,
        limit: 123456,
      },
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let accinfos = res.body.rows;
      if (accinfos.length > 0) {
        commit("change_accinfos", { accinfos });
      }
    })
  },
  receipt_save({commit}, body) {
    let url = "";
    if(body) {
      if(body.ID) { //有id，表示为修改
        url = "receipt/edit"
      } else { //表示为添加
        if(body.isOK==0) { //仅保存
          url = "receipt/add"
        } else if (body.isOK==51) { //保存并提交财务
          url = "receipt/submit-add-rec"
        } else {
          return;
        }
      }
      return Vue.http.post(
        url,
        body,
        {emulateJSON: true}
      ).then(res => {
        if (!res.body) return;
        return res.body;
      })
    }
  }
}

const mutations = {
  incrase_receipts (state, { receipts }) {
    state.receipts = state.receipts.concat(receipts);
  },
  change_receipts (state, { receipts }) {
    state.receipts = receipts;
  },
  change_receipt_pings (state, { pings }) {
    state.receipt_pings = pings;
  },
  change_receipt_select (state, { receipt }) {
    state.receipt_select = receipt;
  },
  change_curs (state, { curs }) {
    state.curs = curs;
  },
  change_titles (state, { titles }) {
    state.titles = titles;
  },
  change_paytypes (state, { paytypes }) {
    state.paytypes = paytypes;
  },
  change_accinfos (state, { accinfos }) {
    state.accinfos = accinfos;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
