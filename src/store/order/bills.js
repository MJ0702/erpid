import Vue from 'vue'

const billType={
    type:117,
    page:1,
    start:0,
    limit:123456
}

const state = {
    bills_list:[],  //账单列表
    bills_select:{},
    price_obj:{
      price_0:0,
      price_1:0,
      price_total:0
    },   //价格对象{未审核价格，审核价格，总价格}
    bills_detail:{}, //账单详情
    bills_types:[],  //账单摘要列表
    bills_type:{  
      title:'',
      ID:'',
    },    //账单摘要选择值
    bills_curs:[],  //账单币种列表
    bills_cur:{
      rate:0
    },  //账单币种选中值
    bills_add_select:{
      thePrice:'',
      theNum:'',
    }, //账单添加页面保存的价格和数量
}

const getters = {
    bills_list:state=>state.bills_list,
    bills_select:state=>state.bills_select,
    price_obj:state=>state.price_obj,
    bills_detail:state=>state.bills_detail,
    bills_types:state=>state.bills_types,
    bills_type:state=>state.bills_type,
    bills_curs:state=>state.bills_curs,
    bills_cur:state=>state.bills_cur,
    bills_add_select:state=>state.bills_add_select,
}

const actions = {
  bills_select({ commit },bills_select) {
      commit("bills_select",{bills_select});
  },
  bills_request({ commit },{planID,ordID}) {
    return Vue.http.post(
      "order/order-bill-list",
      {
        planID: planID,
        ordID: ordID,
      },
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let bills_list = res.body.rows,
      isOK_0=0,
      isOK_1=0,
      price_obj={};
      bills_list.forEach((val)=>{
          //val.theAmount=val.thePrice * val.theNum;  //计算原币金额
          if(val.isOK===0){  //计算未审核的总额
              isOK_0 +=val.amount;
          }else{      //计算审核的总额
              isOK_1 +=val.amount;
          }
      });
      price_obj.price_0=isOK_0;
      price_obj.price_1=isOK_1;
      price_obj.price_total=isOK_0+isOK_1;
      commit("change_bills_list",{bills_list});
      commit("change_price_obj",{price_obj});
    })
  },
  bills_detail_request({ commit },{order_bill_select}) {
    return Vue.http.post(
      "order/order-bill-detail",
      {
        planID: order_bill_select.planID,
        ordID: order_bill_select.ordID,
        ID:order_bill_select.bills_id
      },
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let bills_detail = res.body.rows[0];
      commit("change_bills_detail",{bills_detail});
    })
  },
  order_bill_edit({commit},{bills_select}){
    return Vue.http.post(
      "order/order-bill-edit",
      {
        ordID: bills_select.ordID,
        theNum: bills_select.theNum,
        theTitle:bills_select.theTitle,
        thePrice:bills_select.thePrice,
        theAmount:bills_select.theAmount,
        theCur:bills_select.theCur,
        theRate:bills_select.theRate,
        ID:bills_select.ID,
        amount:bills_select.amount,
      },
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      return res.body;
    })
  },
  order_bill_add({commit},{bills_select}){
    return Vue.http.post(
      "order/order-bill-add",
      {
        ordID: bills_select.ordID,
        theNum: bills_select.theNum,
        theTitle:bills_select.theTitle,
        thePrice:bills_select.thePrice,
        theAmount:bills_select.theAmount,
        theCur:bills_select.theCur,
        theRate:bills_select.theRate,
        amount:bills_select.amount,
      },
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      return res.body;
    })
  },
   bills_types_request({ commit , state}) {
    return Vue.http.post(
      "order/bill",
      {
        type:billType.type,
        page: billType.page,
        start: billType.start,
        limit:billType.limit
      },
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let bills_types = res.body.rows;
      commit("change_bills_types",{bills_types});
      return bills_types;
    })
  },
  bills_type_select({commit},bills_type){
      commit("bills_type_select",  {bills_type} );
  },
  bills_type({commit},bills_type){
      commit("bills_type",  {bills_type} );
  },
  bills_curs_request({ commit , state}) {
    return Vue.http.post(
      "pub-curRate",
      {
        page: 1,
        start: 0,
        limit:25,
        sort:'[{"property":"bySort","direction":"desc"},{"property":"isLock","direction":"asc"}]'
      },
      {emulateJSON: true}
    ).then(res => {
      if (!res.body) return;
      let bills_curs = res.body.rows;
      // let find_code=bills_curs.find(function(val){
      //     return state.bills_cur.code==val.code;
      // });
      //state.bills_select.theAmount=state.bills_select.amount/find_code.rate;
      
      //commit("bills_select",{state.bills_select});
      commit("change_curs_types",{bills_curs});
      return bills_curs;
    })
  },
  bills_cur_select({commit},bills_cur){
      commit("bills_cur_select",  {bills_cur} );
  },
  bills_add_select({commit},bills_add_select){
      commit("bills_add_select",  {bills_add_select} );
  },
}

const mutations = {
  change_bills_list(state, { bills_list }) {
    state.bills_list = bills_list;
  },
 change_price_obj(state, { price_obj }) {
    state.price_obj = price_obj;
  },
  change_bills_detail(state,{bills_detail}){
    state.bills_detail=bills_detail;
  },
  change_bills_types(state, { bills_types }){
    state.bills_types=bills_types;
  },
  bills_type(state, { bills_type }){
    state.bills_type=bills_type;
  },
  bills_type_select(state,{bills_type}){
    state.bills_type=bills_type;
  },
  change_curs_types(state, { bills_curs }){
    state.bills_curs=bills_curs;
  },
  bills_cur_select(state,{bills_cur}){
    state.bills_cur=bills_cur;
  },
  bills_select(state,{bills_select}){
    state.bills_select=bills_select;
  },
  bills_add_select(state,{bills_add_select}){
    state.bills_add_select=bills_add_select;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
