<template>
	<div>
		<mt-header title="名单" fixed>
			<!-- <router-link to="/saler-info" @click.native="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link> -->
			<a @click="$router.go(-1)" slot="left">
				<mt-button icon="back">返回</mt-button>
			</a>
			<!-- <mt-button slot="right" @click.native="$router.go(-1)">取消</mt-button> -->
		</mt-header>
		<div style="height:40px"></div>

		<my-block></my-block>
		<mt-cell title="订单号">
			<span>{{order.ordID}}</span> (
			<span style="color: #0386CA" v-if="order.isOK==1&&order.suretyID<=0">已确认</span>
			<span style="color: #0386CA" v-else-if="order.isOK==1&&order.suretyID>0">已担保</span>
			<span style="color: green" v-else-if="order.isOK==0">预留中</span>
			<span style="color: gray" v-else-if="order.isOK==-4">已清位</span>
			<span style="color: gray" v-else-if="order.isOK==-2">已撤销</span>
			<span style="color: black" v-else-if="order.isOK==-3">已取消</span> )
		</mt-cell>
		<my-cell title="公司名称" :value="order.userCpyName"></my-cell>
		<mt-cell title="联系人" :value="order.ctName"></mt-cell>
		<my-block v-if="namelist.length>0" bottom left>
			编辑名单
			<!--<span class="cancel-tips-info"></span>-->
		</my-block>
		<div v-for="(tour,index) in namelist" v-show="PermitCheck('order/order-name-add')&&loadEnd">
			<mt-cell v-if="tour.isLock==0 && (order.isOK==0||order.isOK==1)" is-link @click.native="
            toEdit(tour,index)">
				<div slot="title">
					<span>{{tour.cnName || '游客'+ (index+1)}}</span>
					<span class="mint-cell-title-desc">< {{tour.perType}} ></span>
				</div>
				<span v-if="tour.isLock==0" style="color:#f00">未审核</span>
				<span v-else style="color:#0099FF">已审核</span>
			</mt-cell>
			<mt-cell v-if="tour.isLock==1 && (order.isOK==0||order.isOK==1)" @click.native="toEdit(tour,index)">
				<div slot="title">
					<span>{{tour.cnName || '游客'+ (index+1)}}</span>
					<span class="mint-cell-title-desc">< {{tour.perType}} ></span>
				</div>
				<span v-if="tour.isLock==0" style="color:#f00">未审核</span>
				<span v-else style="color:#0099FF">已审核</span>
			</mt-cell>
		</div>
		<p :class="'page-infinite-loading'+(loadEnd?'-no':'')">
			<mt-spinner type="fading-circle"></mt-spinner>
			加载中...
		</p>
		<div :class="'loadmore-end'+((showEnd&&loadEnd)?'':'-no')">我是有底线的</div>
		<my-bottom-box v-if="namelist.length>0">
			<mt-button type="primary" v-show="PermitCheck('order/order-name-check-pass')" v-if="isLock" size="large" @click.native="fnAudit">全部通过审核</mt-button>
			<mt-button type="primary" v-show="PermitCheck('order/order-name-check-cancel')" v-else size="large" @click.native="fnCelAudit">全部取消审核</mt-button>
		</my-bottom-box>
	</div>
</template>

<script>
	import { Toast, MessageBox } from "mint-ui"
	export default {
		data() {
			return {
				isLock: 0,
				loadEnd: false,  //false加载中  true 加载完毕
				showEnd:true,
			}
		},
		created() {
			let order_id = this.$store.getters["order/order_id"];
			if (!order_id) {
				let orderid = this.$route.query.id;
				if (orderid) {
					this.$store.dispatch("order/order_select", { id: orderid });
					this.$store.dispatch("order/order_request").then(order => {
						this.$store.dispatch("order/tour/name_list_request",
							{ planID: order.planID, ordID: order.ordID }).then(end => {
								this.fnInit();
								this.loadEnd = !this.loadEnd;
							});
						return;
					});
					return;
				} else {
					Toast("未选择有效订单");
					return;
				}
			}
			this.listReq();
			let Recognize = this.$store.getters['order/tour/Recognize'];
		},
		computed: {
			namelist() {
				return this.$store.getters['order/tour/namelist'];
			},
			order() {
				return this.$store.getters["order/order_select"];
			},
		},
		methods: {
			fnInit() {
				let isLock = this.namelist.find(y => {
					return y.isLock == 0;
				});
				if (!isLock) {
					isLock = false;
				}
				this.isLock = isLock;
			},
			listReq() {     //获取名单列表
				this.loadEnd = false;
				this.$store.dispatch('order/tour/name_list_request',
					{ planID: this.order.planID, ordID: this.order.ordID }).then(end => {
						this.fnInit();
						this.loadEnd = true;
						if(!end.length){
							this.showEnd=false;
						}
					});
			},
			toEdit(tour,index) {
				this.$store.dispatch('order/tour/tour_select', tour);
				let name = '';
				if (!tour.isLock) {
					name = "order-tours-edit";
				} else {
					name = "order-tours-detail";
				}
				this.$router.push({ name: name, query: { id: this.order.ordID,tourId: index} });
			},
			fnMessage(tour) {
				MessageBox.confirm('是否取消审核？').then(action => {
					this.fnCelAudit(tour);
				}).catch(end => {
					return;
				});
			},
			fnCelAudit(tour) {
				let ids = [];
				if (tour.ID) {
					ids.push(tour.ID);
				} else {
					this.namelist.forEach(ele => {
						ids.push(ele.ID);
					});
				}

				let tour_ids = ids.join();
				this.$store.dispatch("order/tour/check_cancel",
					{ tour_ids }).then(end => {
						if (end.success) {
							this.listReq();
							Toast('取消成功!');
						}
					});
			},
			fnAudit() {
				let namelist = [];
				this.namelist.forEach(ele => {
					if (ele.cnName && ele.isLock == 0) {  //只审核未审核的
						namelist.push(ele);
					}
				});
				let win_mingdan_grid = JSON.stringify(namelist);
				this.$store.dispatch("order/tour/check_pass",
					{ win_mingdan_grid }).then(end => {
						if (end.success) {
							this.listReq();
							Toast('审核通过!');
						} else {
							Toast(end.msg);
						}
					});
			},
		}
	}

</script>

<style>
	.mint-cell-title-desc {
		color: #888;
		font-size: 14px;
	}
	
	.cancel-tips-info {
		float: right;
		margin-right: 10px;
		color: orangered;
	}
</style>