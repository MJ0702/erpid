import Vue from 'vue'


const state = {
    notice_search_query: { //用以出团通知书数据
        accountTypeID: "", //账户字符串
        accountType: "", //账户字符串显示
        accountTypes: [], //v-model绑定账户选择的值数组
        exportContentID: "theTips,theNotice", //导出内容字符串
        exportContent: "注意事项,温馨提示", //导出内容字符串显示
        exportContents: [
            "theTips," + "注意事项",
            "theNotice," + "温馨提示"
        ],
        exportContentOptions: [
            {
                label: "账单明细",
                value: "billDetail," + "账单明细",
            },
            {
                label: "付款信息",
                value: "payInfo," + "付款信息",
            },
            {
                label: "游客信息和联系方式",
                value: "userInfo," + "游客信息和联系方式",
            },
            {
                label: "注意事项",
                value: "theTips," + "注意事项",
            },
            {
                label: "温馨提示",
                value: "theNotice," + "温馨提示",
            },
            {
                label: "简要行程",
                value: "briefly," + "简要行程",
            },
        ], //v-model绑定起止城市选择的值数组
        isLockID: "", //团期状态值字符串
    },
    planTemplate: [],
    planTemplateSelect: {
        ID: 10291,
        fileName: '出团通知书',
        fileConfig: 'plan_order_notice.doc',
        fileHtml: 'plan_order_notice.html',
        value: 'plan_order_notice.html',
    },
    bill_title: [],                          //账单抬头
    bill_title_select: {
        title: '',
        ID: '',
    },
    baseAccount: []
}

const getters = {
    notice_search_query: state => state.notice_search_query,
    planTemplate: state => state.planTemplate,
    planTemplateSelect: state => state.planTemplateSelect,
    bill_title: state => state.bill_title,
    bill_title_select: state => state.bill_title_select,
    baseAccount: state => state.baseAccount,
}

const actions = {
    plan_template_request({ commit, state }) {
        let rows = [{
            ID: 10291,
            fileConfig: "plan_order_notice.doc",
            fileHtml: "plan_order_notice.html",
            fileName: "出团通知书"
        }];
        rows.forEach(x => {
            x.value = x.fileHtml;
        });
        let planTemplateSelect = rows[0];
        commit("plan_template_select", { planTemplateSelect });
        commit("change_plan_template", { rows });

    },
    notices_generate({ commit, state }, data) {
        return Vue.http.post(
            "order/notices-generate",
            data,
            { emulateJSON: true }
        ).then(res => {
            if (!res.body) return;
            // let rows = res.body.rows;
            //commit("change_plan_template", { rows });
            return res.body;
        })
    },
    generatePdf({ commit }, data) {
        return Vue.http.post(
            "/sys/api/pub_m/generate-pdf-set",
            data,
            { emulateJSON: true }
        ).then(res => {
            if (!res.body) return;
            let data = res.body;
            //commit("confirmConfig", { data });
            return res.body;
        })
    },
    plan_template_select({ commit }, planTemplateSelect) {
        commit("plan_template_select", { planTemplateSelect });
    },
    bill_title_request({ commit }) {
        Vue.http.post(
            "pub/bill-title",
            {
                page: 1,
                start: 0,
                limit: 2147483647,
            },
            { emulateJSON: true }
        ).then(res => {
            if (!res.body) return;
            let rows = res.body.rows;
            commit("change_bill_title", { rows });
        })
    },
    bill_title_select({ commit }, bill_title_select) {
        commit("bill_title_select", { bill_title_select });
    },
    baseAccount({ commit }, baseAccount) {
        commit("baseAccount", { baseAccount });
    },
}

const mutations = {
    change_plan_template(state, { rows }) {
        state.planTemplate = rows;
    },
    plan_template_select(state, { planTemplateSelect }) {
        state.planTemplateSelect = planTemplateSelect;
    },
    change_bill_title(state, { rows }) {
        state.bill_title = rows;
    },
    bill_title_select(state, { bill_title_select }) {    //账单抬头
        state.bill_title_select = bill_title_select;
    },
    baseAccount(state, { baseAccount }) {    //收款账号
        state.baseAccount = baseAccount;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
