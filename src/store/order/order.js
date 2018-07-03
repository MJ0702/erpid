import Vue from 'vue'

const order_reset = {
  planId: null, //团期ID
  pub_fromcity_id: null, //联运城市对应的Id
  policyId: null, //联运政策ID
  baseTransportCityId: null, //联运城市ID
  fromCityId: null, //出发城市ID
  ordType: null, //订单类型
  userType: null, //价格类型
  saleScore: 0, //销售积分
  saleScoreAvg: null, //人均积分
  saleScoreNum: 1, //积分人数
  saleSalary: 0, //销售提成
  saleSalaryAvg: null, //人均提成
  saleSalaryNum: 1, //提成人数
  aduNum: 1, //成人
  chdNum: null, //小童占床
  aduNum1: null, //小年轻
  aduNum2: null, //老人
  chdNum1: null, //小童不占床
  isTicket: true, //是否占位
  cpyBaseId: null, //客户联系人id
  cpyId: null, //公司ID	313588
  ctName: null, //客户联系人名称
  ctInfo: null, //客户联系人手机号码
  ordBak: "", //订单备注
  iordBak: "", //自我备注
  billBak: "", //账单备注
  cpyTitle: null, //账单抬头
  cpyTitleId: null, //账单抬头id
  saleId: null, //所属销售ID
  zhuliId: null, //所属助理ID
  isTrueNum: null, //如果isTrueNum=1则是确认单，0为预留单	0
  linePlanPriceId: null, //价格套餐ID
  total: 0,
};

const order_type_reset = {
  ID: "", //索引id
  cnName: null, //类型名称
}
const state = {
  order_new: Object.assign({}, order_reset),
  order_types: [],
  order_type: Object.assign({}, order_type_reset),
  order_type_page: 1,
  order_type_start: 0,
  order_type_limit: 123456,

  orders: [],
  orders_page: 1,
  orders_limit: 15,
  order_id: null,
  order_select: {},
  orders_search: [],
  orders_search_page: 1,
  orders_search_limit: 15,
  orders_search_query: { //用以保存订单搜索状态
    isOK: [], //订单状态
    isOKStr: "",
    isOKVal: "",
    isTicket: true, //是否占位
    dateType: { title: "订单日期", value: "orddate" }, //日期类型
    startdate: new Date(DateFmt(new Date(), "yyyy-MM-dd", "M-1")), //开始日期
    enddate: new Date(DateFmt(new Date(), "yyyy-MM-dd", "M+3")), //结束日期
    skey: null, //关键字
    sources: ''
  },
  orders_search_all_query: { //用以保存全部订单搜索状态
    isOK: [], //订单状态
    isOKStr: "",
    isOKVal: "",
    isTicket: true, //是否占位
    dateType: { title: "订单日期", value: "orddate" }, //日期类型
    startdate: new Date(DateFmt(new Date(), "yyyy-MM-dd", "M-1")), //开始日期
    enddate: new Date(DateFmt(new Date(), "yyyy-MM-dd", "M+3")), //结束日期
    skey: null, //关键字
  },
  plan_orders_search_query: { //用以保存团期订单搜索状态
    isOK: [], //订单状态
    isOKStr: "",
    isOKVal: "",
    isTicket: true, //是否占位
    dateType: { title: "订单日期", value: "orddate" }, //日期类型
    startdate: new Date(DateFmt(new Date(), "yyyy-MM-dd", "M-1")), //开始日期
    enddate: new Date(DateFmt(new Date(), "yyyy-MM-dd", "M+3")), //结束日期
    skey: null, //关键字
  },
  order_edit_reason: "",
  order_edit_type: "",
  orderSelected: 1,
  sources: [],
  pub_bast_text: [],
}

const getters = {
  order_new: state => state.order_new,
  order_type: state => state.order_type,
  order_types: state => state.order_types,
  orders: state => state.orders,
  orders_search: state => state.orders_search,
  orders_search_query: state => state.orders_search_query,
  plan_orders_search_query: state => state.plan_orders_search_query,
  orders_search_all_query: state => state.orders_search_all_query,
  order_id: state => state.order_id,
  order_select: state => state.order_select,
  orderSelected: state => state.orderSelected,

  order_edit_reason: state => state.order_edit_reason,
  order_edit_type: state => state.order_edit_type,
  sources: state => state.sources,
  pub_bast_text: state => state.pub_bast_text,
}

const actions = {
  sources_request({ state }) {
    return Vue.http.post(
      "order/sources",
      {
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let data = res.body.rows;
      let arr;
      if (data.length) {
        arr = data.map(x => {
          x.label = x.sources;
          x.value = x.sources;
          delete x.sources;
          return x;
        });
      }
      state.sources = arr;
      return data;
    })
  },
  order_types_request({ commit, state }) {
    return Vue.http.post(
      "order/order-type",
      {
        page: state.order_type_page,
        start: state.order_type_start,
        limit: state.order_type_limit,
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let order_types = res.body.rows;
      commit("change_order_types", { order_types });
    })
  },
  orderSelected({ state, commit }, selected) {
    state.orderSelected = selected;
  },
  order_new_clear_listener({ commit, state, dispatch }) {
    commit("change_order_new", { order_new: Object.assign({}, order_reset) });
    commit("change_order_type", { order_type: Object.assign({}, order_type_reset) });
    //执行所有同名 action
    dispatch("customer/order_new_clear_listener");
    dispatch("price/order_new_clear_listener");
    dispatch("city/order_new_clear_listener");
    dispatch("saler/order_new_clear_listener");
  },
  order_type_select({ commit }, order_type) {
    commit("change_order_type", { order_type })
  },
  order_add({ commit }, order) {
    let url = "";
    //如果isTrueNum=1则是确认单，0为预留单
    if (order.isTrueNum == 1) {
      url = "createOrd-affirm";
    } else if (order.isTrueNum == 0) {
      url = "createOrd-reserve";
    } else {
      return;
    }
    return Vue.http.post(
      url,
      order,
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let state = res.body;
      return state;
    })
  },
  orders_request({ commit, state }) {
    let url = '';
    if (!state.orderSelected) {
      url = 'order'
    } else {
      url = 'order-2'
    }
    return Vue.http.post(
      url,
      {
        page: state.orders_page,
        start: state.orders_limit * (state.orders_page - 1),
        limit: state.orders_limit,
        skeyType: "全部条件",
        sort: '[{"property":"ordID","direction":"desc"},{"property":"isOK","direction":"desc"}]',
        dateType: "orddate", //日期类型
        startdate: DateFmt(new Date(), "yyyy-MM-dd hh:mm:ss", "M-1"), //开始日期
        enddate: DateFmt(new Date(), "yyyy-MM-dd hh:mm:ss"), //结束日期
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let orders = res.body.rows;
      if (orders.length > 0) {
        state.orders_page++;
        commit("incrase_orders", { orders });
        return false;
      } else {
        return true;
      }
    })
  },
  pub_bast_text_request({ commit }) {
    Vue.http.post(
      "pub/bast-text",
      {
        type: 144,
        page: 1,
        start: 0,
        limit: 2147483647,
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let rows = [];
      res.body.rows.forEach((v) => {
        rows.push({
          label: v.title,
          value: v.title,
        });
      })
      console.log(rows);
      commit("change_pub_bast_text", { rows });
    })
  },
  orders_request_all({ commit, state }) {
    return Vue.http.post(
      "order-all",
      {
        page: state.orders_page,
        start: state.orders_limit * (state.orders_page - 1),
        limit: state.orders_limit,
        skeyType: "全部条件",
        sort: '[{"property":"ordID","direction":"desc"},{"property":"isOK","direction":"desc"}]',
        dateType: "orddate", //日期类型
        startdate: DateFmt(new Date(), "yyyy-MM-dd hh:mm:ss", "M-1"), //开始日期
        enddate: DateFmt(new Date(), "yyyy-MM-dd hh:mm:ss"), //结束日期
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let orders = res.body.rows;
      if (orders.length > 0) {
        state.orders_page++;
        commit("incrase_orders", { orders });
        return false;
      } else {
        return true;
      }
    })
  },
  plan_orders_request({ commit, getters, state, rootGetters }) {
    let planid = rootGetters['plan/plan_id'] || '';
    return Vue.http.post(
      "line-plan/order",
      {
        page: state.orders_page,
        start: state.orders_limit * (state.orders_page - 1),
        limit: state.orders_limit,
        skey: "",
        sort: '[{"property":"ordID","direction":"desc"},{"property":"isOK","direction":"desc"}]',
        planID: planid
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let orders = res.body.rows;
      if (orders.length > 0) {
        state.orders_page++;
        commit("incrase_orders", { orders });
        return false;
      } else {
        return true;
      }
    })
  },
  order_select({ commit }, { id }) {
    commit("change_order_id", { order_id: id });
  },
  order_request({ commit, state }) {
    return Vue.http.post(
      "order/detail",
      {
        ordID: state.order_id,
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let order = res.body.rows[0];
      commit("change_order_select", { order });
      console.log(order);
      return order;
    })
  },
  orders_clear({ commit, state }) {
    commit("change_orders", { orders: [] });
    commit("change_orders_page", { page: 1 });
  },
  orders_search({ commit, state }) {
    let q = state.orders_search_query;
    let query = {
      page: state.orders_search_page,
      start: state.orders_search_limit * (state.orders_search_page - 1),
      limit: state.orders_search_limit,
      isMine: 1,
      skeyType: "全部条件",
      sort: '[{"property":"ordID","direction":"desc"},{"property":"isOK","direction":"desc"}]',
      isOK: q.isOKVal || "", //订单状态
      isTicket: q.isTicket ? '0' : '1', //是否占位
      dateType: q.dateType.value, //日期类型
      startdate: DateFmt(q.startdate, 'yyyy-MM-dd hh:mm:ss'), //开始日期
      enddate: DateFmt(q.enddate, 'yyyy-MM-dd hh:mm:ss'), //结束日期
      skey: q.skey, //关键字
      sources: q.sources
    }
    let url = '';
    if (!state.orderSelected) {
      url = 'order'
    } else {
      url = 'order-2'
    }
    return Vue.http.post(
      url,
      query,
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let orders = res.body.rows;
      if (orders.length > 0) {
        state.orders_search_page++;
        commit("incrase_orders_search", { orders });
        return false;
      } else {
        return true;
      }
    })
  },
  orders_search_all({ commit, state }) {
    let q = state.orders_search_all_query;
    let query = {
      page: state.orders_search_page,
      start: state.orders_search_limit * (state.orders_search_page - 1),
      limit: state.orders_search_limit,
      skeyType: "全部条件",
      sort: '[{"property":"ordID","direction":"desc"},{"property":"isOK","direction":"desc"}]',
      isOK: q.isOKVal || "", //订单状态
      isTicket: q.isTicket ? '0' : '1', //是否占位
      dateType: q.dateType.value, //日期类型
      startdate: DateFmt(q.startdate, 'yyyy-MM-dd hh:mm:ss'), //开始日期
      enddate: DateFmt(q.enddate, 'yyyy-MM-dd hh:mm:ss'), //结束日期
      skey: q.skey, //关键字
    }
    return Vue.http.post(
      "order-all",
      query,
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let orders = res.body.rows;
      if (orders.length > 0) {
        state.orders_search_page++;
        commit("incrase_orders_search", { orders });
        return false;
      } else {
        return true;
      }
    })
  },
  plan_orders_search({ commit, getters, state, rootGetters }) {
    let q = state.plan_orders_search_query;
    let planid = rootGetters['plan/plan_id'] || '';
    let query = {
      page: state.orders_search_page,
      start: state.orders_search_limit * (state.orders_search_page - 1),
      limit: state.orders_search_limit,
      sort: '[{"property":"ordID","direction":"desc"},{"property":"isOK","direction":"desc"}]',
      isOK: q.isOKVal || "", //订单状态
      isTicket: q.isTicket ? '0' : '1', //是否占位
      skey: q.skey, //关键字
      planID: planid,
    }
    return Vue.http.post(
      "line-plan/order",
      query,
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let orders = res.body.rows;
      if (orders.length > 0) {
        state.orders_search_page++;
        commit("incrase_orders_search", { orders });
        return false;
      } else {
        return true;
      }
    })
  },
  orders_search_clear({ commit, state }) {
    commit("change_orders_search", { orders: [] });
    commit("change_orders_search_page", { page: 1 });
  },

  order_edit_type({ commit }, type) {
    commit("change_order_edit_type", { type });
  },
}

const mutations = {
  change_order_types(state, { order_types }) {
    state.order_types = order_types;
  },
  change_order_type(state, { order_type }) {
    state.order_type = order_type;
  },
  change_order_new(state, { order_new }) {
    state.order_new = order_new;
  },
  incrase_orders(state, { orders }) {
    state.orders = state.orders.concat(orders);
  },
  change_orders(state, { orders }) {
    state.orders = orders;
  },
  change_orders_page(state, { page }) {
    state.orders_page = page;
  },
  change_order_id(state, { order_id }) {
    state.order_id = order_id;
  },
  change_order_select(state, { order }) {
    state.order_select = order;
  },
  incrase_orders_search(state, { orders }) {
    state.orders_search = state.orders_search.concat(orders);
  },
  change_orders_search(state, { orders }) {
    state.orders_search = orders;
  },
  change_orders_search_page(state, { page }) {
    state.orders_search_page = page;
  },

  change_order_edit_type(state, { type }) {
    state.order_edit_type = type;
  },
  change_pub_bast_text(state, { rows }) {
    state.pub_bast_text = rows;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
