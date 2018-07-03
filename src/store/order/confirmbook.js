import Vue from 'vue'

const state = {
    confirmConfig: {},                      //确认书配置
    fnConfig: {                             ////所选确认书列表
        filename: '确认书',
        erpName: '',
        accBank: '',
        jiaotong: '',
        billDesc: '',
        okremark: '',
        isMingDan: true,
        isMingDan1: true,
        isXianShou: true,
        isXingContent: false,
        isXingCheng: false
    },
    confirmTemp: {
        "ID": '',
        "fileName": "确认书(通用)",
        "value": 'confirm_order.html'
    },
    qrcodeUrl: '',
    confirmTemps: [],
    fnTitle: '',                             //确认书常用数据
    confirmRows: [],                         //确认书列表数据数组
    base_account: [],                        //收款账户
    base_account_select: '',
    bill_title: [],                          //账单抬头
    bill_title_select: {},
    pub_bast_text: [],                       //常用数据
    pub_bast_text_select: {},
    bill_desc: [],                           //账单备注
    bill_desc_select: '',                    //账单备注选中
    confirm_book_desc: [],                   //确认书备注
    confirm_book_desc_select: '',
    title_desc: [],                          //摘要说明 
    title_desc_select: {
        title: ''
    },
    jiaotong: [],                            //交通信息
    jiaotong_select: '',
    confirm_search_query: { //用以保存确认书数据
        baseAccountID: "", //收款帐号字符串
        baseAccount: "", //收款帐号字符串显示
        baseAccounts: [], //v-model绑定收款帐号选择的值数组
        jiaotongID: "", //交通字符串
        jiaotong: "", //交通字符串显示
        jiaotongs: [], //v-model绑定交通选择的值数组
        billDiscID: "", //账单备注字符串
        billDisc: "", //账单备注字符串显示
        billDiscs: [], //v-model绑定账单备注的值数组
        confirmBookDescID: "",  //确认书字符串
        confirmBookDesc: "",    //确认书字符串显示
        confirmBookDescs: [], //v-model绑定确认书的值数组
        exportContentID: "",  //导出内容字符串
        exportContent: "简要名单,详细名单,现收款",    //导出内容字符串显示
        exportContents: ["isJYMingDan,简要名单", "isMingDan1,详细名单", "isXianShou,现收款"],    //v-model绑定导出内容的值数组
        exportContentDatas: [
            {
                label: "简要名单",
                value: "isJYMingDan," + "简要名单",
            },
            {
                label: "详细名单",
                value: "isMingDan1," + "详细名单",
            },
            {
                label: "现收款",
                value: "isXianShou," + "现收款",
            },
            {
                label: "简要行程",
                value: "isXingContent," + "简要行程",
            },
            {
                label: "详细行程",
                value: "isXingCheng," + "详细行程",
            },
        ], //导出内容数据
        moneyTypes: "指定金额",
        money: ""
    }
}

const getters = {
    confirmConfig: state => state.confirmConfig,
    qrcodeUrl: state => state.qrcodeUrl,
    fnConfig: state => state.fnConfig,
    fnTitle: state => state.fnTitle,
    confirmRows: state => state.confirmRows,
    confirmTemps: state => state.confirmTemps,
    confirmTemp: state => state.confirmTemp,
    base_account: state => state.base_account,
    base_account_select: state => state.base_account_select,
    bill_title: state => state.bill_title,
    bill_title_select: state => state.bill_title_select,
    pub_bast_text: state => state.pub_bast_text,
    pub_bast_text_select: state => state.pub_bast_text_select,
    title_desc: state => state.title_desc,
    title_desc_select: state => state.title_desc_select,
    confirm_book_desc: state => state.confirm_book_desc,
    confirm_book_desc_select: state => state.confirm_book_desc_select,
    bill_desc: state => state.bill_desc,
    bill_desc_select: state => state.bill_desc_select,
    jiaotong: state => state.jiaotong,
    jiaotong_select: state => state.jiaotong_select,
    confirm_search_query: state => state.confirm_search_query,
}

const actions = {
    confirmation_interface_request({ commit }) {
        Vue.http.post(
            "order/confirmation-interface",
            {
                page: 1,
                start: 0,
                limit: 2147483647,
            },
            { emulateJSON: true }
        ).then(res => {
            if (!res.body) return;
            let rows = res.body.rows;
            commit("change_confirmRows", { rows });
        })
    },
    confirmation_template_request({ commit, state }) {
        let rows = [
            {
                ID: 10244,
                fileName: "确认书(通用)",
                fileConfig: "confirm_order.doc",
                fileHtml: "confirm_order.html"
            },
            // {
            //     ID: 10242,
            //     fileName: "日韩.澳新担保函和购物协议(地球之旅)",
            //     fileConfig: "1/confirm_order.doc",
            //     fileHtml: "1/confirm_order.html"
            // }
        ];
        rows.forEach(x => {
            x.value = x.fileHtml;
        });
        let confirmTemp = rows[0];
        commit("confirm_template_select", { confirmTemp });
        commit("change_confirm_template", { rows });
    },
    base_account_request({ commit }) {
        Vue.http.post(
            "pub/base-account",
            {
                page: 1,
                start: 0,
                limit: 2147483647,
            },
            { emulateJSON: true }
        ).then(res => {
            if (!res.body) return;
            let rows = [];
            res.body.rows.forEach((v) => {
                if (!v.accName) {
                    v.accName = v.accCard || v.SimName || v.accInfo || '';
                }
                rows.push({
                    label: v.accInfo,
                    value: v.ID + "," + v.accName,
                    ID: v.ID,
                    accName: v.accName
                });
            })
            commit("change_base_account", { rows });

        })
    },
    bill_title_request({ commit }) {
        return Vue.http.post(
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
            return rows;
        })
    },
    bill_title_select({ commit }, bill_title_select) {
        commit("bill_title_select", { bill_title_select });
    },
    pub_bast_text_request({ commit }) {
        Vue.http.post(
            "pub/bast-text",
            {
                page: 1,
                start: 0,
                limit: 2147483647,
            },
            { emulateJSON: true }
        ).then(res => {
            if (!res.body) return;
            let rows = res.body.rows;
            commit("change_pub_bast_text", { rows });
        })
    },
    pub_bast_text_select({ commit }, pub_bast_text_select) {
        commit("pub_bast_text_select", { pub_bast_text_select });
    },
    bill_desc_request({ commit }, ordIDs) {
        return Vue.http.post(
            "pub/order-bast-text",
            {
                type: 143,
                ordIDs: ordIDs,
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
                    label: v.description,
                    value: v.FIELD1 + "," + v.title,
                });
            })
            commit("change_bill_desc", { rows });
            return rows;
        })
    },
    bill_desc_select({ commit }, bill_desc_select) {
        commit("bill_desc_select", { bill_desc_select });
    },
    confirm_book_desc_request({ commit }, ordIDs) {
        return Vue.http.post(
            "pub/order-bast-text",
            {
                type: 138,
                ordIDs: ordIDs,
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
                    label: v.description,
                    value: v.FIELD1 + "," + v.title,
                });
            })
            commit("change_confirm_book_desc", { rows });
            return rows;
        })
    },
    confirm_book_desc_select({ commit }, confirm_book_desc_select) {
        commit("confirm_book_desc_select", { confirm_book_desc_select });
    },
    title_desc_request({ commit }) {
        Vue.http.post(
            "pub/order-bast-text",
            {
                type: 132,
                page: 1,
                start: 0,
                limit: 2147483647,
            },
            { emulateJSON: true }
        ).then(res => {
            if (!res.body) return;
            let rows = res.body.rows;

            commit("change_title_desc", { rows });
        })
    },
    title_desc_select({ commit }, title_desc_select) {
        commit("title_desc_select", { title_desc_select });
    },
    jiaotong_request({ commit },planID) {
        return Vue.http.post(
            "pub/traffic-information",
            {
                page: 1,
                start: 0,
                limit: 2147483647,
                planID:planID
            },
            { emulateJSON: true }
        ).then(res => {
            if (!res.body) return;
            let rows = [];
            res.body.rows.forEach((v) => {
                rows.push({
                    label: v.Title,
                    value: v.ID + "," + v.Title,
                });
            })
            commit("change_jiaotong", { rows });
            return rows;
        })
    },
    jiaotong_select({ commit }, jiaotong_select) {
        commit("jiaotong_select", { jiaotong_select });
    },
    fnTitle_select({ commit }, fnTitle) {
        commit("change_fnTitle", { fnTitle });
    },
    confirm_template_select({ commit }, confirmTemp) {
        commit("confirm_template_select", { confirmTemp });
    },
    fnConfig_select({ commit, state, dispatch, rootGetters }, fnConfig) {

        state.confirm_search_query.exportContent = '';
        state.confirm_search_query.baseAccounts = [];
        state.confirm_search_query.baseAccountID = fnConfig.accBank;
        state.confirm_search_query.billDiscs = [];
        state.confirm_search_query.confirmBookDescs = [];
        state.confirm_search_query.exportContents = [];
        //默认选中账单抬头
        if (fnConfig.erpName) {
            dispatch('bill_title_request').then(end => {
                let bill_title_select = end.find(x => {
                    return x.title == fnConfig.erpName;
                });
                if (bill_title_select) {
                    commit("bill_title_select", { bill_title_select });
                }

            })
        }

        //默认选中账单备注
        if (fnConfig.billDesc) {
            let order_id = rootGetters["order/order_id"];
            dispatch('bill_desc_request', order_id).then(end => {
                let data = end.find(x => {
                    return x.label == fnConfig.billDesc;
                });
                if (data) {
                    state.confirm_search_query.billDiscs.push(data.value);
                }

            })
        }

        //默认选中确认备注
        if (fnConfig.okremark) {
            let order_id = rootGetters["order/order_id"];
            dispatch('confirm_book_desc_request', order_id).then(end => {
                let data = end.find(x => {
                    return x.label == fnConfig.okremark;
                });

                if (data) {
                    state.confirm_search_query.confirmBookDescs.push(data.value);
                }

            })
        }

        //默认选中交通
        if (fnConfig.jiaotong) {
            let planID=rootGetters["order/order_select"].planID;
            dispatch('jiaotong_request',planID).then(end => {
                let jiaotongs = fnConfig.jiaotong.split(',');
                let jiaotong_select = jiaotongs.map(x => {
                    let findjiaotong = end.find(y => {

                        return y.label == x.trim();
                    });
                    return findjiaotong.value;
                });
                state.confirm_search_query.jiaotongs = jiaotong_select;

            });
        }

        //默认选中收款账户
        let accBank = fnConfig.accBank.split(',');
        let base_account = state.base_account;
        let accName = accBank.map(x => {
            let arr = base_account.find(y => {
                return y.ID == x;
            });
            return arr;
        });

        fnConfig.accBank = accName.map(x => {
            if (x) {
                state.confirm_search_query.baseAccounts.push(x.ID + ',' + x.accName);
                return x.accName;
            }
        }).join();

        //默认选中导出内容
        let sign = 0;
        if (fnConfig.isMingDan) {
            state.confirm_search_query.exportContent += '简要名单 ';
            state.confirm_search_query.exportContentID += 'isJYMingDan';
            state.confirm_search_query.exportContents.push("isJYMingDan,简要名单");
            sign++;
        }
        if (fnConfig.isMingDan1) {
            state.confirm_search_query.exportContent += '详细名单 ';
            state.confirm_search_query.exportContents.push("isMingDan1,详细名单");
            if (!sign) {
                state.confirm_search_query.exportContentID += 'isMingDan1';
            } else {
                state.confirm_search_query.exportContentID += ',isMingDan1';
            }
            sign++;
        }
        if (fnConfig.isXianShou) {
            state.confirm_search_query.exportContent += '现收款 ';
            state.confirm_search_query.exportContents.push("isXianShou,现收款");
            if (!sign) {
                state.confirm_search_query.exportContentID += 'isXianShou';
            } else {
                state.confirm_search_query.exportContentID += ',isXianShou';
            }
            sign++;
        }
        if (fnConfig.isXingContent) {
            state.confirm_search_query.exportContent += '简要行程';
            state.confirm_search_query.exportContents.push("isXingContent,简要行程");
            if (!sign) {
                state.confirm_search_query.exportContentID += 'isXingContent';
            } else {
                state.confirm_search_query.exportContentID += ',isXingContent';
            }
            sign++;
        }
        if (fnConfig.isXingCheng) {
            state.confirm_search_query.exportContent += '详细行程 ';
            state.confirm_search_query.exportContents.push("isXingCheng,详细行程");
            if (!sign) {
                state.confirm_search_query.exportContentID += 'isXingCheng';
            } else {
                state.confirm_search_query.exportContentID += ',isXingCheng';
            }
        }

        commit("change_fnConfig", { fnConfig });
    },
    base_account_select({ commit }, base_account_select) {
        commit("base_account_select", { base_account_select });
    },
    confirmConfig({ commit }, data) {
        return Vue.http.post(
            "order/confirmation-generate",
            data,
            { emulateJSON: true }
        ).then(res => {
            if (!res.body) return;
            let data = res.body;
            commit("confirmConfig", { data });
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
            commit("confirmConfig", { data });
            return res.body;
        })
    },
    qrcode_request({ commit }, data) {
        return Vue.http.post(
            "qrcode",
            data,
            { emulateJSON: true }
        ).then(res => {
            if (!res.body) return;
            let qrcodeUrl = res.body.qrcode;
            commit("change_qrcodeUrl", { qrcodeUrl });
            return res.body;
        })
    },
}

const mutations = {
    change_confirmRows(state, { rows }) {
        state.confirmRows = rows;
    },
    change_qrcodeUrl(state, { qrcodeUrl }) {
        state.qrcodeUrl = qrcodeUrl;
    },
    confirmConfig(state, { data }) {
        state.confirmConfig = data;
    },
    change_confirm_template(state, { rows }) {
        state.confirmTemps = rows;
    },
    confirm_template_select(state, { confirmTemp }) {
        state.confirmTemp = confirmTemp;
    },
    change_fnTitle(state, { fnTitle }) {
        state.fnTitle = fnTitle;
    },
    change_fnConfig(state, { fnConfig }) {
        state.fnConfig = fnConfig;
    },
    change_base_account(state, { rows }) {
        state.base_account = rows;
    },
    change_bill_title(state, { rows }) {
        state.bill_title = rows;
    },
    base_account_select(state, { base_account_select }) {       //收款帐号
        //state.fnConfig.accBank=base_account_select.accName;
        state.fnConfig.accBank = base_account_select;
        state.base_account_select = base_account_select;
    },
    bill_title_select(state, { bill_title_select }) {    //账单抬头
        state.fnConfig.erpName = bill_title_select.title;
        state.bill_title_select = bill_title_select;
    },
    change_pub_bast_text(state, { rows }) {
        state.pub_bast_text = rows;
    },
    pub_bast_text_select(state, { pub_bast_text_select }) {
        state.pub_bast_text_select = pub_bast_text_select;
    },
    change_bill_desc(state, { rows }) {
        state.bill_desc = rows;
    },
    bill_desc_select(state, { bill_desc_select }) {  //账单备注
        state.fnConfig.billDesc = bill_desc_select;
        state.bill_desc_select = bill_desc_select;
    },
    change_title_desc(state, { rows }) {
        state.title_desc = rows;
    },
    title_desc_select(state, { title_desc_select }) { //摘要说明
        state.title_desc_select = title_desc_select;
    },
    change_confirm_book_desc(state, { rows }) {

        state.confirm_book_desc = rows;
    },
    confirm_book_desc_select(state, { confirm_book_desc_select }) {//确认书备注
        state.fnConfig.okremark = confirm_book_desc_select;
        state.confirm_book_desc_select = confirm_book_desc_select;
    },
    change_jiaotong(state, { rows }) {
        state.jiaotong = rows;
    },
    jiaotong_select(state, { jiaotong_select }) {  //交通
        state.fnConfig.jiaotong = jiaotong_select;
        state.jiaotong_select = jiaotong_select;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
