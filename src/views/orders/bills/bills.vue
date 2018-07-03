<template>
	<!-- 银行账户 -->
	<div>
		<mt-header title="账单" fixed>
			<a @click="$router.go(-1)" slot="left">
				<mt-button icon="back">返回</mt-button>
			</a>
			<mt-button  v-if="!order.OPisOK" v-show="PermitCheck('order/order-bill-add')" slot="right" @click.native="addBill">
				添加
			</mt-button>
		</mt-header>
		<div class="blank" style="height:40px"></div>
		<!--
-->
		<my-block bottom left>基础信息</my-block>
		<mt-cell title="订单号" class="my-first-cell">
			<span>{{$route.query.id}}</span>
		</mt-cell>
		<my-cell title="公司名称" :value="$route.query.userCpyName || order.userCpyName"></my-cell>
		<my-block bottom left style="margin-bottom:-10px">账单信息</my-block>
		<div class="my-list-box" v-for="bill in bills_list" @click="toBillsDetail(bill.ID)">
			<mt-cell-swipe class="bills-list-row">
				<div class="col-3">
					<div class="top left-top">{{bill.theTitle}}</div>
					<!-- 账单标题 -->
				</div>
				<div class="col-2">
					<div v-if="bill.isOK==0" class="top right-top col-0c0">未审核</div>
					<div v-else-if="bill.isOK==1" class="top right-top col-09f">已审核</div>
				</div>
			</mt-cell-swipe>
			<mt-cell-swipe class="bills-list-row">
				<div class="col-2">
					<div class="bot left-bot">单价 {{bill.thePrice | cny 2}}({{bill.theCur}})</div>
				</div>
				<div class="col-1">
					<div class="middle bot">数量 {{bill.theNum}}</div>
				</div>
				<div class="col-2">
					<div class="bot right-bot">本币金额 {{bill.amount | cny }}</div>
				</div>
			</mt-cell-swipe>
			<div class="my-handle-box" v-if="bill.isOK==0">
				<mt-button type="default" class="audit-btn" v-show="PermitCheck('order/order-bill-check')" @click.native.stop="fnPassAudit(bill)"
				 size="small">通过审核</mt-button>
				<mt-button type="default" v-show="PermitCheck('order/order-bill-edit')" @click.native.stop="toBillsEdit(bill)" class="edit-btn"
				 size="small">编辑</mt-button>
				<mt-button type="default" class="del-btn" v-show="PermitCheck('order/order-bill-del')" @click.native.stop="fnDelBill(bill.ID)"
				 size="small">删除</mt-button>
			</div>
			<div class="my-handle-box" v-else>
				<mt-button type="default" class="audit-btn qx" v-show="PermitCheck('order/order-bill-check')" @click.native.stop="fnPassAudit(bill)"
				 size="small">取消审核</mt-button>
				<mt-button type="default" disabled v-show="PermitCheck('order/order-bill-edit')" class="edit-btn disabled" size="small">编辑</mt-button>
				<mt-button type="default" disabled v-show="PermitCheck('order/order-bill-del')" class="del-btn disabled" size="small">删除</mt-button>
			</div>
		</div>
		<div class="my-final-box">
			<label>已审</label><span class="col-09f">{{price_obj.price_1 | cny}}</span>
			<label>未审</label><span class="col-0c0">{{price_obj.price_0 | cny}}</span>
		</div>
		<div class="my-final-box" style="margin-top:5px">
			<label>总额</label><span class="col-f60">{{price_obj.price_total | cny }}</span>
		</div>
		<my-bottom-box>
			<mt-button  v-if="!order.OPisOK" type="primary" @click.native="addBill" v-show="PermitCheck('order/order-bill-add')" size="large">添加账单</mt-button>
			<mt-button  v-else type="primary" disabled v-show="PermitCheck('order/order-bill-add')" size="large">添加账单</mt-button>
		</my-bottom-box>
	</div>
</template>

<script>
	import Vue from 'vue';
	import { Toast } from 'mint-ui';
	export default {
		data() {
			return {
				popupVisible: false,
			}
		},
		created() {
			this.fnInit();
		},
		computed: {
			bills_list() {
				return this.$store.getters['order/bills/bills_list'];
			},
			price_obj() {
				return this.$store.getters['order/bills/price_obj'];
			},
			order() {
				return this.$store.getters["order/order_select"]
			},
		},
		methods: {
			fnInit() {
				let order_id = this.$store.getters["order/order_id"];
				if (!order_id) {
					let orderid = this.$route.query.id;
					if (orderid) {
						this.$store.dispatch("order/order_select", { id: orderid });
						this.$store.dispatch("order/order_request").then(order => {
							this.$store.dispatch("order/bills/bills_request",
								{ planID: order.planID, ordID: order.ordID });
							return;
						});
						return;
					} else {
						Toast("未选择有效订单");
						return;
					}
				}
				this.$store.dispatch("order/bills/bills_request",
					{ planID: this.order.planID, ordID: this.order.ordID });
			},
			addBill() {
				return this.$router.push(
					{
						name: 'bills-add',
						query: { ordID: this.$route.query.id },
						params: { refresh: true }
					}
				);
			},
			moreTypeClick() {
				this.popupVisible = !this.popupVisible;
			},
			toBillsEdit(bill) {
				this.$store.dispatch("order/bills/bills_select", bill);
				let billType = { title: bill.theTitle };
				let billCur = { code: bill.theCur };
				this.$store.dispatch("order/bills/bills_type_select", billType);  //选中账单摘要
				this.$store.dispatch("order/bills/bills_cur_select", billCur);   //选中币种
				return this.$router.push({
					name: 'bills-edit',
					query: { bills_id: bill.ID }, params: { refresh: true }
				});
			},
			toBillsDetail(bills_id) {
				return this.$router.push({
					name: 'bills-detail',
					query: { bills_id: bills_id }
				});
			},
			fnPassAudit(bill) {
				let planID = this.order.planID;
				if (bill.isOK === 0) {
					bill.isOK = 1;
				} else {
					bill.isOK = 0;
				}
				Vue.http.post( //审核、弃审
					"order/order-bill-check",
					{
						ID: bill.ID,
						planID: planID,
						isOK: bill.isOK,
					},
					{ emulateJSON: true }
				).then(res => {
					if (!res.body) return;
					let data = res.body;
					if (data.success) {
						this.fnInit();
						Toast("操作成功！");
					} else {
						Toast(data.msg);
					}
				});
			},
			fnDelBill(ID) {  //删除
				Vue.http.post( //获取线路类别选择列表
					"order/order-bill-del",
					{
						ID: ID
					},
					{ emulateJSON: true }
				).then(res => {
					if (!res.body) return;
					let data = res.body;
					if (data.success) {
						this.fnInit();
						Toast("删除成功！");
					} else {
						Toast(data.msg);
					}
				});
			},
		},
		components: {

		}
	}

</script>

<style>
	.icon {
		/* 通过设置 font-size 来改变图标大小 */
		width: 1em;
		height: 1em;
		/* 图标和文字相邻时，垂直对齐 */
		vertical-align: -0.15em;
		/* 通过设置 color 来改变 SVG 的颜色/fill */
		fill: currentColor;
		/* path 和 stroke 溢出 viewBox 部分在 IE 下会显示
        normalize.css 中也包含这行 */
		overflow: hidden;
	}
	
	.my-first-cell .mint-cell-wrapper {
		background-origin: border-box;
	}
	
	.blank-more {
		color: #333;
		font-size: .8em;
		line-height: 32px;
		padding-left: 12px;
	}
	
	.my-list-box {
		background: #fff;
		margin-top: 10px;
	}
	
	.my-list-box .bills-list-row {
		min-height: auto;
	}
	
	.my-handle-box {
		padding: 10px 10px;
		text-align: right;
	}
	
	.my-handle-box button {
		margin-left: 8px;
	}
	
	.my-handle-box .audit-btn {
		color: #33CC66;
	}
	
	.my-handle-box .audit-btn.qx {
		color: #FF9900;
	}
	
	.my-handle-box .edit-btn {
		color: #444;
	}
	
	.my-handle-box .del-btn {
		color: #FF6600;
	}
	
	.my-handle-box .cancel-audit-btn {
		color: #FF9900;
	}
	
	.my-handle-box button.disabled {
		color: #949494;
		background: rgba(228, 228, 228, 1);
	}
	
	.my-final-box {
		padding: 0 10px;
		margin: 20px 0 10px 0;
		text-align: right;
	}
	
	.my-final-box label {
		margin: 0 6px 0 15px;
	}
	
	.col-09f {
		color: #0099ff!important;
	}
	
	.col-0c0 {
		color: #00CC00!important;
	}
	
	.col-f60 {
		color: #FF6600!important;
	}
	
	.bills-list-row {
		display: flex;
	}
	
	.bills-list-row .mint-cell-wrapper {
		background-image: none;
	}
	
	.bills-list-row .mint-cell-wrapper:before {
		content: " ";
		position: absolute;
		left: 0;
		bottom: -1px;
		color: #d9d9d9;
		right: 0;
		height: 1px;
		border-top: 1px solid #d9d9d9;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
	}
	
	.bills-list-row .mint-cell-value {
		width: 100%;
	}
	
	.bills-list-row .col-2 {
		flex: 2;
		overflow: hidden;
	}
	
	.bills-list-row .col-3 {
		flex: 3;
		overflow: hidden;
	}
	
	.bills-list-row .col-1 {
		flex: 1;
		overflow: hidden;
	}
	
	.bills-list-row .top {
		font-size: 15px;
		color: #333;
		padding: 12px 0;
	}
	
	.bills-list-row .col-3 .top {
		line-height: 18px;
	}
	
	.bills-list-row:first-of-type .mint-cell-wrapper:before {
		border-top: 0;
	}
	
	.bills-list-row .bot {
		color: #6B6B6B;
		padding: 5px 0 12px;
		font-size: 14px;
	}
	
	.bills-list-row .middle {
		text-align: center;
	}
	
	.bills-list-row .right-top,
	.bills-list-row .right-bot {
		text-align: right;
	}
	
	.mintui-more {
		font-size: 24px
	}
	
	.mint-popup-1 {
		width: 90px;
		padding: 10px;
		-webkit-transform: translate(-50%);
		transform: translate(-50%);
		top: 50px;
		background: rgba(0, 153, 255, 1);
		right: -50px;
		left: auto;
		text-align: center;
	}
	
	.mint-popup-1:before {
		display: inline-block;
		width: 0;
		height: 0;
		border: solid transparent;
		border-width: 10px;
		border-bottom-color: rgba(0, 153, 255, 1);
		content: '';
		position: absolute;
		top: -20px;
		right: 15px;
	}
	
	.mint-popup a.my-pop-a:first-child {
		margin-top: 0;
	}
	
	.mint-popup a.my-pop-a.underline {
		margin-top: 0;
		display: inline-block;
		border-bottom: 1px solid #fff;
	}
</style>