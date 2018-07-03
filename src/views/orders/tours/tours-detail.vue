<template>
	<div>
		<mt-header title="名单详情" style="z-index: 1111" fixed>
			<a @click="$router.go(-1)" slot="left">
				<mt-button icon="back">返回</mt-button>
			</a>
		</mt-header>
		<div style="height:40px"></div>


		<mt-navbar>
			<a class="mint-tab-item" :class="selected==i?'is-selected':''" v-for="tit, i in titles">
				<div class="mint-tab-item-icon"></div>
				<div class="mint-tab-item-label">{{tit}}</div>
			</a>
			<!--<mt-tab-item @click.native.prevent='fnTab(i)' :class="selected==i?'is-selected':''" v-for="tit, i in titles">{{tit}}</mt-tab-item>-->
		</mt-navbar>
		<my-block></my-block>
		<div class="box-tour-detail-img" :style="'background-image: url('+tour.img+');background-size: contain;'">
			<!--<img :src="tour.img" alt="">-->
		</div>
		<div style="height:10px;">
		</div>
		<mt-cell title="状态">
			<span>{{ordID}}</span> (
			<span style="color: #0386CA" v-if="order.isOK==1&&order.suretyID<=0">已确认</span>
			<span style="color: #0386CA" v-else-if="order.isOK==1&&order.suretyID>0">已担保</span>
			<span style="color: green" v-else-if="order.isOK==0">预留中</span>
			<span style="color: gray" v-else-if="order.isOK==-4">已清位</span>
			<span style="color: gray" v-else-if="order.isOK==-2">已撤销</span>
			<span style="color: black" v-else-if="order.isOK==-3">已取消</span> )
		</mt-cell>
		<div v-show="selected==0">
			<mt-cell title="护照号码" :value="tour.passport" class="input-right require-field"></mt-cell>
			<mt-cell title="中文名" class="input-right require-field" :value="tour.cnName">
				<!--<input class="mint-field-core"   type="text">-->
			</mt-cell>
			<mt-cell title="英文姓" :value="tour.enName1" class="input-right"></mt-cell>
			<mt-cell title="英文名" placeholder="" :value="tour.enName2" class="input-right"></mt-cell>
			<mt-cell title="性别" :value='tour.sex'>
				<!--<input type="text" >-->
			</mt-cell>
			<mt-cell class="input-right" title="联系方式" :value="tour.ctInfo"></mt-cell>
			<mt-cell class="input-right" title="出身地址" :value="tour.POB"></mt-cell>
			<mt-cell title="出生日期" :value="tour.birth"></mt-cell>
			<mt-cell class="input-right" title="住址" :value="tour.POI">
				<input type="text" class="mint-field-core" :value="tour.POI">
			</mt-cell>
			<mt-cell title="签发日期" :value="tour.DOI"></mt-cell>
			<mt-cell title="有效期至" :value="tour.DOE"></mt-cell>
			<my-block></my-block>
		</div>
		<div v-show="selected==1">
			<mt-cell title="中文名" class="input-right require-field" :value="tour.cnName">
				<!--<input class="mint-field-core"  type="text">-->
			</mt-cell>
			<mt-cell title="英文姓" :value="tour.enName1" class="input-right"></mt-cell>
			<mt-cell title="英文名" placeholder="" :value="tour.enName2" class="input-right"></mt-cell>
			<mt-cell title="性别" :value='tour.sex'>
				<!--<input type="text" >-->
			</mt-cell>
			<mt-cell title="出生日期" :value="tour.birth"></mt-cell>
			<mt-cell class="input-right require-field" title="身份证号" :value="tour.IDCard"></mt-cell>
			<mt-cell class="input-right" title="联系方式" :value="tour.ctInfo"></mt-cell>
			<mt-cell class="input-right" title="住址" :value="tour.address"></mt-cell>
			<my-block></my-block>
		</div>
		<mt-cell title="游客类型" :value="tour.perType"></mt-cell>
		<my-bottom-box>
			<mt-button type="primary" size="large" @click.native="fnCelAudit(tour)">取消审核</mt-button>
			<!--<mt-button type="primary" size="large" style="margin-top:15px" @click.native="$router.go(-1)">保存并通过审核</mt-button>-->
		</my-bottom-box>
	</div>
</template>

<script>
	import { Toast } from "mint-ui"
	export default {
		data() {
			return {
				selected: 0,   //证件类型选择  0护照 1身份证
				titles: ['护照', '身份证'],
				toursTypePopStatus: false,
				sexTypePopStatus: false,
				toursTypeProxy: '',
				sexTypeProxy: '',
				showWhich: 0,
				dateValue: DateFmt(new Date(), 'yyyy-MM-dd'),
				initNum: 0,  //是否识别
				imgSrc: '',
				backgroundUrl: '',
				requestCount: 0,
			}
		},
		created() {
			// let uptoken=this.uptoken;
			// 

			let order_id = this.$store.getters["order/order_id"];
			if (!order_id) {

				let orderid = this.$route.query.id;
				if (orderid) {
					this.$store.dispatch("order/order_select", { id: orderid });
					this.$store.dispatch("order/order_request");
					return;
				} else {
					Toast("未选择有效订单");
					return;
				}
			}
		},
		mounted() {
		},
		computed: {
			order() {
				return this.$store.getters["order/order_select"];
			},
			fileType() {   //证件类型
				if (this.selected) {
					return 2;
				} else {
					return 13;
				}
			},
			isWeiXin() {
				return !isWeiXin();
			},

			ordID() {
				return this.$route.query.id;
			},
			tour() {
				let tour = this.$store.getters['order/tour/tour'];
				if (tour.file_type == 2) {   //文件类型为2时默认为身份证选项
					this.selected = 1;
				}
				return tour;
			},
		},
		methods: {
			fnCelAudit(tour) {
				let ids = [];
				if (tour.ID) {
					ids.push(tour.ID);
				}
				let tour_ids = ids.join();
				this.$store.dispatch("order/tour/check_cancel",
					{ tour_ids }).then(end => {
						if (end.success) {
							Toast('取消成功!');
							this.$router.go(-1);
						} else {
							Toast(end.msg);
						}
					});
			},
		},
	}

</script>

<style>
	.mint-cell-title-desc {
		color: #888;
		font-size: 14px;
	}
	
	.input-right .mint-cell-value input {
		text-align: right;
	}
	
	.mint-field-core {
		color: #888;
	}
	
	.box-tour-detail-img {
		margin: 10px 20px;
		overflow: hidden;
		border: 1px solid #d9d9d9;
		height: 200px;
		background-size: contain;
		background: no-repeat 50%;
	}
	/*.box-tour-detail-img img {
        height: 100%;
        margin: 0 auto;
        display: block;
    }*/
</style>