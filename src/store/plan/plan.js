import Vue from 'vue'

const state = {
  plans: [],
  plan: {},
  plan_id: null,
  plans_page: 1,
  plans_limit: 15,
  plans_search: [],
  plans_search_page: 1,
  plans_search_limit: 15,
  plans_search_query: { //用以保存团期搜索状态
    lineTypeID: "", //线路类别值字符串
    lineType: "", //线路类别字符串显示
    lineTypes: [], //v-model绑定线路类别选择的值数组
    fromCityID: "", //起止城市值字符串
    fromCity: "", //起止城市字符串显示
    fromCitys: [], //v-model绑定起止城市选择的值数组
    isLockID: "", //团期状态值字符串
    isLock: "", //团期状态字符串显示
    isLocks: [], //v-model绑定团期状态的值数组
    startDate: new Date(), //开始日期
    endDate: DateFmt(new Date(), "yyyy-MM-dd", "M+1"), //结束日期
    lineKey: "", //线路名称
    plancodeKey: "", //团号
    planType: "全部", //团期类型
    operate_type: '-1',  //经营类型
    isCancelPlan: false,
    isYuWei: false,
  },
  showPrice: {
    sadultPrice: false,
    adultPrice: true,
  },
  planSelected: 1,
}

const getters = {
  plans: state => state.plans,
  plan: state => state.plan,
  plan_id: state => state.plan_id,
  plans_search: state => state.plans_search,
  plans_search_query: (state, getters, rootState, rootGetters) => {
    let m = rootGetters["sys/get_plan_search_date_range"] || 1;
    state.plans_search_query.endDate = DateFmt(new Date(), "yyyy-MM-dd", "M+" + m);
    return state.plans_search_query;
  },
  planSelected: state => state.planSelected,
  showPrice: state => state.showPrice,
}

const actions = {
  plan_select({ commit }, { id }) {
    commit("change_plan_id", { plan_id: id })
  },
  planSelected({ state, commit }, selected) {
    state.planSelected = selected;
  },
  plan_request({ dispatch, state, commit }) {
    return Vue.http.post(
      "line-plan/detail",
      {
        planID: state.plan_id,
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let plan = res.body;
      if(plan.EndDay){
        plan.EndDay = DateFmt(plan.planDate,'yyyy-MM-dd','d-'+plan.EndDay);
      }
      //获取团期对应杂费
      Vue.http.post(
        "order/incidentals",
        { planID: state.plan_id },
        { emulateJSON: true }
      ).then((r) => {
        if (!r.body || !r.body.rows) return;
        plan.otherBillPrice = r.body.rows[0] ? (r.body.rows[0].otherBillPrice || 0) : 0; //杂费金额
        commit("change_plan", { plan });
      })
    }).then(() => {
      dispatch("price/prices_request"); //请求价格
    })
  },
  plans_request({ state, commit }) {
    let url = '';
    if (!state.planSelected) {
      url = 'line-plan'
    } else {
      url = 'line-plan-2'
    }
    return Vue.http.post(
      url,
      {
        page: state.plans_page,
        start: state.plans_limit * (state.plans_page - 1),
        limit: state.plans_limit,
        sort: '[{"property":"PlanDate","direction":"asc"},{"property":"PlanCode","direction":"asc"}]',
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let plans = res.body.rows;
      if (plans.length > 0) {
        state.plans_page++;
        commit("incrase_plans", { plans });
        return false;
      } else {
        return true;
      }
    })
  },
  plans_search_clear({ commit }) {
    commit("change_plans_search", { plans: [] });
    commit("change_plans_search_page", { page: 1 });
  },
  plans_search({ state, commit, getters }) {
    let q = state.plans_search_query;
    let searchs = [];
    let url = '';
    if (!state.planSelected) {
      url = 'line-plan'
    } else {
      url = 'line-plan-2'
    }
    if (q.lineKey) {
      searchs.push({
        searchType: "line",
        key: q.lineKey,
      })
    }
    if (q.plancodeKey) {
      searchs.push({
        searchType: "plancode",
        key: q.plancodeKey,
      })
    }
    let query = {
      page: state.plans_search_page,
      start: state.plans_search_limit * (state.plans_search_page - 1),
      limit: state.plans_search_limit,
      sort: '[{"property":"PlanDate","direction":"asc"},{"property":"PlanCode","direction":"asc"}]',
      lineTypeID: q.lineTypeID, //线路类型ID
      isLock: q.isLockID, //团期状态
      planType: (q.planType == "全部" ? "" : q.planType), //团期类型
      fromCityID: q.fromCityID, //起止城市ID
      startDate: DateFmt(q.startDate, "yyyy-MM-dd hh:mm:ss"), //开始日期
      endDate: DateFmt(q.endDate, "yyyy-MM-dd hh:mm:ss"), //结束日期
      searchs: searchs.length > 0 ? JSON.stringify(searchs) : "",
      operate_type: q.operate_type,
      isYuWei: q.isYuWei ? 1 : 0,
      isCancelPlan: q.isCancelPlan ? 1 : 0,
    }
    return Vue.http.post(
      url,
      query,
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let plans = res.body.rows;
      plans.forEach(x => {
        x.show = false;
      })
      if (plans.length > 0) {
        state.plans_search_page++;
        commit("incrase_plans_search", { plans });
        return false;
      } else {
        return true;
      }
    })
  },
}

const mutations = {
  change_plan(state, { plan }) {
    state.plan = plan;
  },
  change_plan_id(state, { plan_id }) {
    state.plan_id = plan_id;
  },
  incrase_plans(state, { plans }) {
    state.plans = state.plans.concat(plans);
  },
  incrase_plans_search(state, { plans }) {
    state.plans_search = state.plans_search.concat(plans);
  },
  change_plans_search(state, { plans }) {
    state.plans_search = plans;
  },
  change_plans_search_page(state, { page }) {
    state.plans_search_page = page;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
