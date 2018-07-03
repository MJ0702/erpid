import Vue from 'vue'

const customer_new_reset = {
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
  simName: "", //公司名称，页面显示用
  cpyID: null, //所属公司ID
  cpyID_text: null, //所属公司名称，发送数据时用
  saleID: null, //所属销售id
  saleID_text: null, //所属销售名称
}

const state = {
  customers_search: [],
  customers_search_keyword: null,
  companys_search_keyword: null,
  customers_search_limit: 10,
  customers_search_page: 1,
  companys_search_page: 1,
  companys_search: [],
  customer: {},
  companys:[],
  company:{},
  customer_new: Object.assign({}, customer_new_reset),
}

const getters = {
  customer: state => state.customer,
  companys: state => state.companys,
  company: state => state.company,
  customers_search: state => state.customers_search,
  companys_search: state => state.companys_search,
  customer_new: state => state.customer_new,
  companys_search_page: state => state.companys_search_page,

}

const actions = {
  customer_select ({ commit }, customer) { //用于显示客户信息详情
    commit("change_customer", {customer});
  },
  change_companys_search_page ({ commit }, page) { //用于显示客户信息详情
    state.companys_search_page=page;
  },
  company_select ({ state }, company) { //添加客户时选择指定客户公司
    state.customer_new.cpyID = company.cpyID;
    state.customer_new.simName = company.simName;
    state.customer_new.cpyID_text = "["+company.cpyID+"]"+company.simName;
  },
  company ({ state }, company) { //指定公司
    state.company=company;
  },
  companys_search ({ commit, getters, state }, keyword) {
    Vue.http.post(
      "cust-cpy",
      {
        query: keyword,
        page: 1,
        start: 0,
        limit: 10,
      },
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let companys_search = res.body.rows;
      companys_search.forEach((v) => {
        v.cpyID = v.ID; //讲请求数据中公司id字段 ID 转为 cpyID
      })
      commit("change_companys_search", { companys_search });
    })
  },
  companys_request ({ commit, getters, state }, keyword) {
    let query={
        skey: keyword,
        page: 1,
        start: 0,
        limit: 50,
        sort:'[{"property":"bySort","direction":"desc"},{"property":"isLock","direction":"asc"},{"property":"ID","direction":"desc"}]'
      };
    if(keyword==state.companys_search_keyword) {
      query.page = state.companys_search_page;
      query.start = 50*(state.companys_search_page);
    } else {
      state.companys_search_page = 1;
    }
    Vue.http.post(
      "cust-cpy/list",
      query,
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let companys = res.body.rows;
      if(keyword==state.companys_search_keyword) {
        if(companys.length > 0) {
          state.companys_search_page++;
          commit("incrase_companys_search", { companys });
          return false;
        } else {
          return true;
        }
      } else {
        state.companys_search_keyword = keyword;
        commit("change_companys", { companys });
        return false;
      }
      
    })
  },
  companys_request_one ({ commit, getters, state }, keyword) {
    let query={
        skey: keyword,
        page: 1,
        start: 0,
        limit: 50,
        sort:'[{"property":"bySort","direction":"desc"},{"property":"isLock","direction":"asc"},{"property":"ID","direction":"desc"}]'
      };
    Vue.http.post(
      "cust-cpy/list",
      query,
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
        let companys = res.body.rows;
        state.companys_search_page++;
        commit("change_companys", { companys });
    })
  },
  customers_search ({ commit, getters, state, rootGetters }, keyword) {
    let query = {
      skey: keyword,
      page: 1,
      start: 0,
      limit: state.customers_search_limit,
      sort: '[{"property":"isLock","direction":"asc"},{"property":"notesNextTime","direction":"desc"},{"property":"updateTime","direction":"desc"}]',

    };
    if(keyword==state.customers_search_keyword) {
      query.page = state.customers_search_page-1;
      query.start = state.customers_search_limit*(state.customers_search_page);
    } else {
      state.customers_search_page = 1;
    }
    return Vue.http.post(
      "cust-user/list",
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
  customer_request ({ commit, getters, state, rootGetters }, id) {
    let query = {
      userID: id,
      page: 1,
      start: 0,
      limit: state.customers_search_limit,
      sort: '[{"property":"isLock","direction":"asc"},{"property":"ID","direction":"desc"}]',
    };
    return Vue.http.post(
      "cust-user/list",
      query,
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let customers = res.body.rows;
      if(customers&&customers.length) {
        commit("change_customer", {customer:customers[0]});
      }
    })
  },
  customers_search_select({ commit, getters, state, rootGetters }, ID) {
    return Vue.http.post(
      "cust-user/search",
      {
        userID:ID
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let customer = res.body.rows[0];
      commit("change_customer", { customer });
    })
  },
  customer_add({ commit, state, getters, rootGetters }) {
    let new_customer = state.customer_new;
    new_customer.saleID = rootGetters["mine/mine"].ID||""
    new_customer.saleID_text = rootGetters["mine/mine"].trueName||""
    return Vue.http.post(
      "cust-user/user-insert",
      new_customer,
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let customer = res.body;
      if(customer.success){
        commit("change_customer", { customer });
      }
      return customer;
    })
  },
}

const mutations = {
  change_customer (state, { customer }) {
    state.customer = customer;
  },
  change_companys (state, { companys }) {
    state.companys = companys;
  },
  change_customers_search (state, { customers_search }) {
    state.customers_search = customers_search;
  },
  incrase_customers_search (state, { customers_search }) {
    state.customers_search = state.customers_search.concat(customers_search);
  },
  incrase_companys_search (state, { companys }) {
    state.companys = state.companys.concat(companys);
  },
  change_companys_search (state, { companys_search }) {
    state.companys_search = companys_search;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
