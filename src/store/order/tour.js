import Vue from 'vue'

const state = {
  uptoken: {},
  namelist: [],
  tour: {   //选中游客  会改变
    passport: '',
    cnName: '',
    enName1: '',
    enName2: '',
    sex: '男',
    POB: '',    //出生地
    birth: '',
    IDCard: '',
    POI: '',    //签发地点
    DOI: '',   //签发日期
    DOE: '',    //有效日期
    perType: '',
    img: '',
    file_type: 2,
    ctInfo: '',
    bySort: 0,
    isLock: 0,
    nation: '',
    address: '',
  },
  defaultTour: {},  //默认选中游客  不会改变
  Recognize: {},
  RecognizeList: [],
  fileWhich: 0,
}

const getters = {
  uptoken: state => state.uptoken,
  namelist: state => state.namelist,
  tour: state => state.tour,
  Recognize: state => state.Recognize,
  RecognizeList: state => state.RecognizeList,
  fileWhich: state => state.fileWhich,
  defaultTour: state => state.defaultTour,
}

const actions = {
  order_name_WxToQn({ commit, getters }, img) {
    return Vue.http.post(
      "order/order-name-WxToQn",
      {
        img: img
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      return res.body;
    })
  },
  uptoken_request({ commit, getters }) {
    return Vue.http.post(
      "order/order-name-token",
      {},
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let uptoken = res.body;
      commit("change_uptoken", { uptoken });
      return res.body;
    })
  },
  ocrRecognize_singleRecognize({ commit, state }, data) {
    let recongUrl = "/sys/service/util/ocrRecognize/singleRecognize";
    return Vue.http.post(
      recongUrl,
      data,
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let data = res.body;
      if (data.executeStatus=='1') { 
					return data;
			}
      if (data.values.message.status < 0) {
					return data;
			}
      let tour = state.tour;
      //  commit("change_Recognize", { data });
      data = data.values.cardsinfo[0].items;
      if (res.body.values.cardsinfo[0].type == 2) {  //身份证
        let cnName = data[1].content;
        let enName1 = toPinyin(cnName.slice(0, 1));
        let enName2 = toPinyin(cnName.slice(1));
        let datacard = {
          cnName: data[1].content,
          sex: data[2].content,
          nation: data[3].content,
          birth: data[4].content,
          address: data[5].content,
          IDCard: data[6].content,
          DOI: '',  //签发日期
          DOE: '',   //有效日期
          passport: '',
          POI: '',  //签发地点
          enName1: enName1,
          enName2: enName2,
          POB: ''
        };
        tour=Object.assign(tour, datacard);
        //tour = datacard;
      } else if (res.body.values.cardsinfo[0].type == 13) {  //护照
        let sex = data[4].content;
        if (sex != '男' && sex != '女') {
          if (sex == '<') {
            sex = '男'
          } else {
            sex = '女'
          }
        }
        let dataport = {
          cnName: data[2].content,
          sex: sex,
          birth: data[5].content,
          POB: data[14].content,  //出生地
          IDCard: data[21].content,
          DOI: data[16].content,  //签发日期
          DOE: data[6].content,   //有效日期
          passport: data[13].content,
          POI: data[15].content,  //签发地点
          enName1: data[8].content,
          enName2: data[9].content,
          nation: ''
        };
        tour=Object.assign(tour, dataport);
        // tour = dataport;
      }
      commit('tour_select', { tour });
      //  let datas=state.RecognizeList.concat(data);
      //  commit("change_RecognizeList", { datas });
      return res.body;
    })
  },
  name_list_request({ commit, state }, { planID, ordID }) {
    return Vue.http.post(
      "order/order-name-list",
      {
        planID: planID,
        ordID: ordID,
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      let data = res.body.rows;
      //  data.forEach(ele=>{
      //    if(ele.cnName){
      //       state.change_RecognizeList.concat(ele);
      //    }
      //  });
      commit("change_name_list", { data });
      return data;
    })
  },
  order_name_add({ commit, getters }, { win_mingdan_grid, planID }) {
    return Vue.http.post(
      "order/order-name-add",
      {
        planID: planID,
        win_mingdan_grid: win_mingdan_grid,
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      return res.body;
    })
  },
  recognizeSum({ commit, getters }) {
    return Vue.http.post(
      "/sys/service/util/ocrRecognize/recognizeSum",
      {
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      return res.body;
    })
  },
  tour_select({ commit, getters }, tour) {
    commit('defaultTour', { tour });   //不改变游客
    commit('tour_select', { tour });    //可改变游客
  },
  tour_clear({ commit, getters }, tour) {
    commit('tour_select', { tour });    //可改变游客
  },
  change_Recognize({ commit, getters }, data) {  //改变识别数据
    commit('change_Recognize', { data });
  },
  fileWhich({ commit, getters }, fileWhich) {
    commit('fileWhich', { fileWhich });
  },
  check_pass({ commit, getters }, { win_mingdan_grid }) {
    return Vue.http.post(
      "order/order-name-check-pass",
      {
        win_mingdan_grid: win_mingdan_grid,
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      return res.body;
    })
  },
  check_cancel({ commit, getters }, { tour_ids }) {
    return Vue.http.post(
      "order/order-name-check-cancel",
      {
        ids: tour_ids,
      },
      { emulateJSON: true }
    ).then(res => {
      if (!res.body) return;
      return res.body;
    })
  },

}

const mutations = {
  change_uptoken(state, { uptoken }) {
    state.uptoken = uptoken;
  },
  change_name_list(state, { data }) {
    state.namelist = data;
  },
  tour_select(state, { tour }) {
    state.tour = tour;
  },
  fileWhich(state, { fileWhich }) {
    state.fileWhich = fileWhich;
  },
  change_Recognize(state, { data }) {
    state.Recognize = data;
  },
  change_RecognizeList(state, { datas }) {
    state.RecognizeList = datas;
  },
  defaultTour(state, { tour }) {
    state.defaultTour = tour;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}