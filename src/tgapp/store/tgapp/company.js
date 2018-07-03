import Vue from 'vue'

const state = {
  sel_cpy_list: [],             //客户公司列表
  sel_cpy:{},                     //客户公司
  sel_cpy_plan:{},                //客户公司团期列表
  erpId:null,                       
  cpy_plan_query:{                //客户公司团期查询条件
    skey:'',
  },
  history_plan_query:{           //客户公司历史团期查询条件
    skey:'',
    startDate:DateFmt(new Date, 'yyyy-MM-dd','M-1'),
    endDate:DateFmt(new Date, 'yyyy-MM-dd'),
  },
  history_plan_list:[],         //客户公司历史团期列表
  owner_info:{},            //个人数据
  guideName:{},
  plan_end_count:0,        //团期行程已结束个数
  // roomTypeList: [],         //获取房型
  // hotel_supplier_list:[]    //供应商（酒店）
}

const getters = {
  sel_cpy_list: state => state.sel_cpy_list,
  erpId: state => state.erpId,
  sel_cpy:state => state.sel_cpy,
  sel_cpy_plan:state => state.sel_cpy_plan,
  cpy_plan_query:state => state.cpy_plan_query,
  history_plan_query:state => state.history_plan_query,
  history_plan_list:state => state.history_plan_list,
  owner_info:state => state.owner_info,
  guideName:state => state.guideName,
  plan_end_count:state => state.plan_end_count,
  // roomTypeList: roomTypeList => state.roomTypeList,
  // hotel_supplier_list:hotel_supplier_list => state.hotel_supplier_list,
}

const actions = {
  owner_info({commit,state}){
    let query={}
    if(location.href.indexOf('history-plan-list')>-1){
      query= state.history_plan_query
    }
    Vue.http.post(
      "user_core",
      {
        erpid:state.erpId,
        startDate:query.startDate || '',
        endDate:query.endDate || '',
      },
      {emulateJSON: true}
    ).then(res => {
      if(!res.body) return;
      let owner_info = res.body.rows[0]
      state.owner_info = owner_info
    })
  },
  guideName({commit,state}){
    Vue.http.post(
      "user_core/guideName",
      {
      },
      {emulateJSON: true}
    ).then(res => {
      if(!res.body) return;
      let guideName = res.body.rows[0]
      state.guideName = guideName
    })
  },

  sel_cpy_list({ commit, getters, rootGetters }) {
    return Vue.http.post(
      "sel_cpy_name",
      {

      },
      {emulateJSON: true}
    ).then(res => {
      if(!res.body) return;
      console.log('222')
      let sel_cpy_list = res.body.rows
      state.sel_cpy_list = sel_cpy_list
      // commit('change_sel_cpy_list',res.body.rows)
      return res.body.rows
    })
  },
  sel_cpy_plan({ commit, state, getters, rootGetters }) {
    let query = state.cpy_plan_query
    Vue.http.post(
      "sel_cpy_name/plan",
      {
        erpId:state.erpId,
        statrDate:'',
        endDate:'',
        skey:query.skey,
        if_reimbursement:0,
      },
      {emulateJSON: true}
    ).then(res => {
      if(!res.body) return;
      let sel_cpy_plan = res.body.rows
      let now = DateFmt(new Date(),'yyyy-MM-dd')
      let plan_end_count = 0
      sel_cpy_plan.forEach((x)=>{
        x.status = DateFmt(x.backDate,'yyyy-MM-dd') > now
        if(!x.status){
          plan_end_count++
        }
      })
      state.plan_end_count = plan_end_count
      commit('change_sel_cpy_plan',{sel_cpy_plan})
    })
  },
  /**
   * 历史团期获取
   * @param {*} param0 
   */
  history_cpy_plan({ commit, state, getters, rootGetters }) {
    let query = state.history_plan_query
    Vue.http.post(
      "sel_cpy_name/plan",
      {
        erpId:state.erpId,
        statrDate:query.startDate,
        endDate:query.endDate,
        skey:query.skey,
        if_reimbursement:2,
      },
      {emulateJSON: true}
    ).then(res => {
      if(!res.body) return;
      let history_plan_list = res.body.rows
      commit('change_history_plan_list',{history_plan_list})
    })
  },
  //获取币种
  roomType_list({ commit, state, getters, rootGetters }, callback) {
    Vue.http.post(
      "/guide/common/baseText",
      {
        erpId: state.erpId,
        typeId: 114
      },
      {emulateJSON: true}
    ).then(res => {      
      if(!res.body) return;
      let roomTypeList = res.body.data
      commit('change_roomTypeList',{roomTypeList})
      callback(roomTypeList);
    })
  },  
  //获取供应商（酒店）
  // hotelSup_list({ commit, state, getters, rootGetters }) {
  //   Vue.http.post(
  //     "/guide/common/supCpy",
  //     {
  //       erpId: state.erpId,
  //       supType:'fang',
  //       skey: state.skey
  //     },
  //     {emulateJSON: true}
  //   ).then(res => {      
  //     if(!res.body) return;
  //     let hotel_supplier_list = res.body.data
  //     commit('change_hotel_supplier_list',{hotel_supplier_list})
  //   })
  // },
  change_erpId({commit}, erpId ){
    commit('change_erpId',{ erpId })
  },
  change_sel_cpy({commit},sel_cpy){
    commit('change_sel_cpy',{ sel_cpy })
  },
  clear_cpy_plan_query({commit}){
    commit('clear_cpy_plan_query',{ cpy_plan_query : {skey:''} })
  },
  clear_history_plan_query({commit}){
    commit('clear_history_plan_query',{ history_plan_query : {         
      skey:'',
      startDate:DateFmt(new Date, 'yyyy-MM-dd','M-1'),
      endDate:DateFmt(new Date, 'yyyy-MM-dd'),
    }})
  },
  // change_roomTypeList({commit}, roomTypeList ){
  //   commit('change_roomTypeList',{ roomTypeList })
  // },
  // change_hotel_supplier_list({commit}, hotel_supplier_list ){
  //   commit('change_hotel_supplier_list',{ hotel_supplier_list })
  // },
}

const mutations = {
  change_sel_cpy_list(state,  sel_cpy_list ) {
    state.sel_cpy_list = sel_cpy_list;
  },
  change_erpId(state,{erpId}){
    state.erpId = erpId
  },
  change_sel_cpy(state,{sel_cpy}){
    state.sel_cpy = sel_cpy
  },
  change_sel_cpy_plan(state,{sel_cpy_plan}){
    state.sel_cpy_plan = sel_cpy_plan
  },
  change_history_plan_list(state,{history_plan_list}){
    state.history_plan_list = history_plan_list
  },
  clear_cpy_plan_query(state,{cpy_plan_query}){
    state.cpy_plan_query = cpy_plan_query
  },
  clear_history_plan_query(state,{history_plan_query}){
    state.history_plan_query = history_plan_query
  },
  // change_roomTypeList(state,{roomTypeList}){
  //   state.roomTypeList = roomTypeList
  // },
  // change_hotel_supplier_list(state,{hotel_supplier_list}){
  //   state.hotel_supplier_list = hotel_supplier_list
  // }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}