import Vue from 'vue'

const state = {
  receipt: {
    money: null,
    remark: null,
  },
  receipt_order: {},
  receipt_customer: {},

  receipt_qrcode_pre_str: "",
  receipt_qrcode_pre_body: {},

  customers_search: [],
  customers_search_keyword: null,
  customers_search_page: 1,
  customers_search_limit: 12,

  records: [],
  records_page: 1,
  records_limit: 10,
}

const getters = {
  receipt: state => state.receipt,
  receipt_order: state => state.receipt_order,
  receipt_customer: state => state.receipt_customer,
  receipt_customers_search: state => state.customers_search,

  receipt_records: state => state.records,
}

const actions = {
  receipt_money_input({ commit }, money) {
    commit("change_receipt_money", { money })
  },
  receipt_remark_input({ commit }, remark) {
    commit("change_receipt_remark", { remark })
  },
  receipt_order_select({ commit }, theOrder) {
    let order = {
      ID: theOrder.ID||theOrder.ordID,
      amount: theOrder.amount||0,
      pingAmount: theOrder.pingAmount||0,
    }
    commit("change_receipt_order", { order })
  },
  receipt_customer_select({ commit }, theCustomer) {
    let customer = {
      ID: theCustomer.ID,
      cpyID: theCustomer.cpyID,
      cpyName: theCustomer.cpyName,
      trueName: theCustomer.trueName,
      simName: theCustomer.simName,
    }
    commit("change_receipt_customer", { customer })
  },
  receipt_customers_search ({ commit, getters, state, rootGetters }, keyword) {
    let query = {
      query: keyword,
      page: 1,
      start: 0,
      limit: state.customers_search_limit,
    };
    if(keyword==state.customers_search_keyword) {
      query.page = state.customers_search_page-1;
      query.start = state.customers_search_limit*(state.customers_search_page);
    } else {
      state.customers_search_page = 1;
    }
    return Vue.http.post(
      "cust-user/search",
      query,
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let customers_search = res.body.rows;
      if(keyword==state.customers_search_keyword) {
        if(customers_search.length > 0) {
          state.customers_search_page++;
          commit("incrase_customers_search", { customers_search });
          return false;
        } else {
          return true;
        }
      } else {
        state.customers_search_keyword = keyword;
        commit("change_customers_search", { customers_search });
        return false;
      }
    })
  },
  receipt_records_request ({ state, commit }) {
    return Vue.http.post(
      "order/order-rec-list",
      {
        page: state.records_page,
        start: state.records_limit*(state.records_page-1),
        limit: state.records_limit,
        sort: '[{"property":"addTime","direction":"desc"}]',
        // sort: '[{"property":"isTally","direction":"desc"},{"property":"ID","direction":"desc"}]',
      },
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let records = res.body.rows;
      if (records.length > 0) {
        state.records_page++;
        commit("incrase_receipt_records", { records });
        return false;
      } else {
        return true;
      }
    })
  },
  receipt_qrcode_request ({ state, commit }, bare) {
    let query = {}
    if(!bare) { //如果指明请求的是没参数的情况，代表是要进行付款
      if(state.receipt.money&&state.receipt.money>=0.01) {
        query.amount = state.receipt.money*100; //金额，单位：分
      }
      if(state.receipt_order.ID) {
        query.orderid = state.receipt_order.ID //订单号
      }
      // if(state.tradeid) {
      //   query.tradeid = state.tradeid //财务编号
      // }
      if(state.receipt_customer.cpyID) {
        query.buyerid = state.receipt_customer.cpyID //客户公司编号
      }
      if(state.receipt.remark) {
        query.remark = state.receipt.remark //摘要
      }
    }
    let queryStr = JSON.stringify(query);
    if(state.receipt_qrcode_pre_str!=queryStr) {
      state.receipt_qrcode_pre_str = queryStr;
      return Vue.http.post(
        "qrcode",
        query,
        {emulateJSON: true}
      ).then(res => {
        if (!res.body) return;
        state.receipt_qrcode_pre_body = res.body;
        return res.body;
      })
    } else {
      return new Promise((resolve)=>{
        resolve(state.receipt_qrcode_pre_body);
      })
    }
  },
}

const mutations = {
  change_receipt_money(state, { money }) {
    state.receipt.money = money;
  },
  change_receipt_remark(state, { remark }) {
    state.receipt.remark = remark;
  },
  change_receipt_order(state, { order }) {
    state.receipt_order = order;
  },
  change_receipt_customer(state, { customer }) {
    state.receipt_customer = customer;
  },
  change_customers_search (state, { customers_search }) {
    state.customers_search = customers_search;
  },
  incrase_customers_search (state, { customers_search }) {
    state.customers_search = state.customers_search.concat(customers_search);
  },
  incrase_receipt_records (state, { records }) {
    state.records = state.records.concat(records);
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
