import Vue from 'vue'

const customer_reset = {
  trueName: "", //联系人姓名
  userID: "", //联系人id
  cpyID: "", //公司id
  SaleID: null, //所属销售id
  SaleName: null, //所属销售名称
  simName: null, //公司简称
  mobile: "", //联系电话
  cpyName: "", //公司全称
}
const company_reset = {
  cpyID: "", //公司id
  simName: "", //公司简称
  cpyName: "", //公司全称
}

const customer_debt_reset = {
  CpyPingAmountNos: null, //总欠款
  CpyMaxMoney: null, //额度
}

const customer_new_reset = {
  simName: "", //客户公司
  trueName: "", //姓名
  deptName: "", //所在部门
  job: "", //职位
  mobile: "", //手机号
  email: "", //邮箱
  qq: "", //QQ
  weixin: "", //微信
  tel: "", //电话
  fax: "", //传真
  website: "", //网址
  addr: "", //地址
  remark: "", //备注
}

const state = {
  companys_search: [],
  customers_search: [],
  company: Object.assign({}, company_reset),
  customer: Object.assign({}, customer_reset),
  customer_debt: Object.assign({}, customer_debt_reset),
  customer_new: Object.assign({}, customer_new_reset),
  company_id: null,
  customers_search_keyword: null,
  customers_search_page: 1,
  customers_search_limit: 12,
}

const getters = {
  companys_search: state => state.companys_search,
  customers_search: state => state.customers_search,
  company: state => state.company,
  customer: state => state.customer,
  customer_new: state => state.customer_new,
  customer_debt: state => state.customer_debt,
}

const actions = {
  customer_select({ commit, dispatch }, customer) {
    commit("change_customer", { customer });
    commit("change_company", { company: customer });
    dispatch("customer_debt_request");
  },
  company_select({ commit, dispatch }, company) {
    commit("change_company", { company });
    commit("change_customer", { customer: {} });
    dispatch("customer_debt_request");
  },
  companys_search({ commit, getters, state }, keyword) {
    Vue.http.post(
      "cust-cpy",
      {
        query: keyword,
        page: 1,
        start: 0,
        limit: 10,
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let companys_search = res.body.rows;
      companys_search.forEach((v) => {
        v.cpyID = v.ID; //将请求数据中公司id字段 ID 转为 cpyID
      })
      commit("change_companys_search", { companys_search });
    })
  },
  
  customers_search({ commit, getters, state, rootGetters }, keyword) {
    let plan_id = rootGetters["plan/plan_id"];
    let query = {
      query: keyword,
      cpyID: state.company.cpyID || "",
      page: 1,
      start: 0,
      limit: state.customers_search_limit,
    };
    if (keyword == state.customers_search_keyword && state.company.cpyID == state.company_id) {
      query.page = state.customers_search_page - 1;
      query.start = state.customers_search_limit * (state.customers_search_page);
    } else {
      state.customers_search_page = 1;
    }
    return Vue.http.post(
      "cust-user/search",
      query,
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let customers_search = res.body.rows;
      if (keyword == state.customers_search_keyword && state.company.cpyID == state.company_id) {
        if (customers_search.length > 0) {
          state.customers_search_page++;
          commit("incrase_customers_search", { customers_search });
          return false;
        } else {
          return true;
        }
      } else {
        state.customers_search_keyword = keyword;
        state.company_id = state.company.cpyID;
        commit("change_customers_search", { customers_search });
        return false;
      }
    })
  },
  customer_debt_request({ commit, state }) {
    Vue.http.post(
      "cust-user/debt-amount",
      {
        query: state.customer.userID || state.company.cpyID,
        page: 1,
        start: 0,
        limit: 10,
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let customer_debt = res.body;
      commit("change_customer_debt", { customer_debt });
    })
  },
  customer_add({ commit, state, getters, rootGetters }) {
    let new_customer = state.customer_new;
    new_customer.saleID = state.customer.userID || (rootGetters["mine/mine"].ID || "");
    new_customer.saleID_text = state.customer.trueName || (rootGetters["mine/mine"].trueName || "");
    new_customer.cpyID = state.customer.cpyID || (state.company.cpyID || "");
    new_customer.cpyID_text = "[" + new_customer.cpyID + "]" + state.customer.simName || (state.company.simName || "");
    return Vue.http.post(
      "cust-user/user-insert",
      new_customer,
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let customer = res.body;
      if (customer.success) {
        commit("change_customer", { customer });
        commit("change_company", { company: customer });
      }
      return customer;
    })
  },
  customer_clear({ commit, state }) {
    commit("change_customer", { customer: Object.assign({}, customer_reset) });
    commit("change_company", { company: Object.assign({}, company_reset) });
    commit("change_customer_debt", { customer_debt: Object.assign({}, customer_debt_reset) });
    commit("change_customer_new", { customer: Object.assign({}, customer_new_reset) });
  },
  order_new_clear_listener({ commit, state }) {
    commit("change_customer", { customer: Object.assign({}, customer_reset) });
    commit("change_company", { company: Object.assign({}, company_reset) });
    commit("change_customer_debt", { customer_debt: Object.assign({}, customer_debt_reset) });
    commit("change_customer_new", { customer: Object.assign({}, customer_new_reset) });
  },
  request_custCpy({ commit, state }) {
    let ID = state.company.cpyID;
    return Vue.http.post(
      "cust-cpy/isVip",
      {
        ID
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let datas = res.body;
      return datas;
    })
  }
}

const mutations = {
  change_customer(state, { customer }) {
    state.customer = customer;
  },
  change_company(state, { company }) {
    state.company = company;
  },
  change_customers_search(state, { customers_search }) {
    state.customers_search = customers_search;
  },
  incrase_customers_search(state, { customers_search }) {
    state.customers_search = state.customers_search.concat(customers_search);
  },
  change_companys_search(state, { companys_search }) {
    state.companys_search = companys_search;
  },
  change_customer_debt(state, { customer_debt }) {
    state.customer_debt = customer_debt;
  },
  change_customer_new(state, { customer }) {
    state.customer_new = customer;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
