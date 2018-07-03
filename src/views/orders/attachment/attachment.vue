<template>
	<!-- 附件 -->
	<div>
		<mt-header title="附件" fixed>
			<a @click="$router.go(-1)" slot="left">
				<mt-button icon="back">返回</mt-button>
			</a>
			<!--<mt-button v-show="PermitCheck('attachment/add')" slot="right" @click.native="addattachment">
          添加
      </mt-button>-->
		</mt-header>
		<div class="blank" style="height:40px"></div>
		<!--
    -->
		<my-search placeholder="搜索" v-model="keyword" cancel-text="取消" show class="contact-list-search"></my-search>
		<div class="blank" style="height:52px"></div>
		<div v-show="!attachments.length" class="box-no-data">暂无附件</div>
		<div class="my-list-box" v-for="attachment in attachments">
			<mt-cell-swipe class="attachments-list-row">
				<div class="col-4">
					<div class="top left-top">{{attachment.title}}</div>
					<!-- 账单标题 -->
				</div>
				<div class="col-1">
					<div v-if="attachment.isLock==0" class="top right-top col-0c0">正常</div>
					<div v-else-if="attachment.isLock==1" class="top right-top col-09f">锁定</div>
				</div>
			</mt-cell-swipe>
			<mt-cell-swipe class="attachments-list-row">
				<div class="col-1">
					<div class="bot left-bot">订单 {{ attachment.ordID }}</div>
				</div>
				<div class="col-2-5">
					<div class="bot right-bot">{{attachment.admName}} / {{attachment.addTime | DateFmt}}</div>
				</div>
			</mt-cell-swipe>
			<div class="my-handle-box" v-if="attachment.isLock==0 && attachment.files">
				<mt-button type="default" v-if="" class="audit-btn" @click.native.stop="fnDownload(attachment)" size="small">下载</mt-button>
				<!--<mt-button type="default" v-show="PermitCheck('attachment/edit')" @click.native.stop="attachmentsEdit(attachment)" class="edit-btn" size="small">修改</mt-button>
                <mt-button type="default" class="del-btn" v-show="PermitCheck('attachment/del')" @click.native.stop="fnDelattachment(attachment)"
                    size="small">删除</mt-button>-->
			</div>
			<div class="my-handle-box" v-else>
				<mt-button type="default" class="audit-btn disabled" disabled @click.native.stop="fnDownload(attachment)" size="small">下载</mt-button>
				<!--<mt-button type="default" disabled v-show="PermitCheck('attachment/edit')" class="edit-btn disabled" size="small">修改</mt-button>
                <mt-button type="default" disabled v-show="PermitCheck('attachment/del')" class="del-btn disabled" size="small">删除</mt-button>-->
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
	import { Toast } from 'mint-ui';
	export default {
		data() {
			return {
				popupVisible: false,
				searchPopupStatus: false,
				keyword: "",
				autofocus: true,
			}
		},
		created() {
			this.fnInit();
		},
		computed: {
			attachments() {
				return this.$store.getters['order/attachment/attachment'];
			},
			order() {
				return this.$store.getters["order/order_select"]
			},
			attachSearch() {
				let attach = this.$store.getters["order/attachment/attach_search"];
				return attach;
			}
		},
		watch: {
			keyword(val) {
				if (this.timeout) {
					clearTimeout(this.timeout)
				}
				this.timeout = setTimeout(() => {
					this.$store.dispatch("order/attachment/attachment_request",
						{ planID: this.order.planID, ordID: this.order.ordID, skey: val });
				}, 100)
			}
		},
		methods: {
			fnInit() {
				let order_id = this.$store.getters["order/order_id"];
				if (!order_id) {
					let orderid = this.$route.query.id;
					if (orderid) {
						this.$store.dispatch("order/order_select", { id: orderid });
						this.$store.dispatch("order/order_request").then(order => {
							this.$store.dispatch("order/attachment/attachment_request",
								{ planID: order.planID, ordID: order.ordID });
							return;
						});
						return;
					} else {
						Toast("未选择有效订单");
						return;
					}
				}
				this.$store.dispatch("order/attachment/attachment_request",
					{ planID: this.order.planID, ordID: this.order.ordID });
			},
			addattachment() {
				return this.$router.push(
					{
						name: 'attachment-add',
						query: { ordID: this.$route.query.id },
						params: { refresh: true }
					}
				);
			},
			moreTypeClick() {
				this.popupVisible = !this.popupVisible;
			},
			attachmentsEdit(data) {
				this.$store.dispatch("order/attachment/attachment_select", data);
				this.$router.push({ name: 'attachment-edit' });
			},
			fnDownload(attachment) {
				window.location.href = attachment.files;
			},
			fnDelattachment(data) {  //删除
				this.$store.dispatch("order/attachment/attachment_del", data);
			},
			searchClick() {
				this.searchPopupStatus = !this.searchPopupStatus;
			},
		},
		beforeRouteLeave(to, from, next) {
			if (this.searchPopupStatus) {
				this.searchPopupStatus = !this.searchPopupStatus;
				next(false);
			} else {
				next();
			}
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
	
	.my-search.mint-search {
		height: 100%;
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
	
	.my-list-box .attachments-list-row {
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
	
	.col-09f {
		color: #0099ff!important;
	}
	
	.col-0c0 {
		color: #00CC00!important;
	}
	
	.col-f60 {
		color: #FF6600!important;
	}
	
	.attachments-list-row {
		display: flex;
	}
	
	.attachments-list-row .mint-cell-wrapper {
		background-image: none;
	}
	
	.attachments-list-row .mint-cell-wrapper:before {
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
	
	.attachments-list-row .mint-cell-value {
		width: 100%;
	}
	
	.attachments-list-row .col-4 {
		flex: 4;
		overflow: hidden;
	}
	
	.attachments-list-row .col-3 {
		flex: 3;
		overflow: hidden;
	}
	
	.attachments-list-row .col-2-5 {
		flex: 2.5;
		overflow: hidden;
	}
	
	.attachments-list-row .col-2 {
		flex: 2;
		overflow: hidden;
	}
	
	.attachments-list-row .col-1 {
		flex: 1;
		overflow: hidden;
	}
	
	.attachments-list-row .top {
		font-size: 15px;
		color: #333;
		padding: 12px 0;
	}
	
	.attachments-list-row .col-3 .top {
		line-height: 18px;
	}
	
	.attachments-list-row:first-of-type .mint-cell-wrapper:before {
		border-top: 0;
	}
	
	.attachments-list-row .bot {
		color: #6B6B6B;
		padding: 5px 0 12px;
		font-size: 14px;
	}
	
	.attachments-list-row .middle {
		text-align: center;
	}
	
	.attachments-list-row .right-top,
	.attachments-list-row .right-bot {
		text-align: right;
	}
	
	.mintui-more {
		font-size: 24px
	}
</style>