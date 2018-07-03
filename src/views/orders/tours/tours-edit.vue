<template>
	<div>
		<mt-header title="编辑名单"
		           style="z-index: 1111"
		           fixed>
			<a @click="$router.go(-1)"
			   slot="left">
				<mt-button icon="back">返回</mt-button>
			</a>
		</mt-header>
		<div style="height:40px"></div>
	
		<mt-navbar>
			<a class="mint-tab-item"
			   @click='fnTab(i)'
			   :class="selected==i?'is-selected':''"
			   v-for="tit, i in titles">
				<div class="mint-tab-item-icon"></div>
				<div class="mint-tab-item-label">{{tit}}</div>
			</a>
			<!--<mt-tab-item @click.native.prevent='fnTab(i)' :class="selected==i?'is-selected':''" v-for="tit, i in titles">{{tit}}</mt-tab-item>-->
		</mt-navbar>
		<my-block></my-block>
		<my-block bottom
		          left
		          style="color:#d00;padding-top:10px;padding-bottom:10px;padding-right:15px;">2017年7月1日证件识别已关闭免费通道，识别次数购买请与同天下客服团队联系。(同时支持手动编辑名单)</my-block>
		<div class="weui-uploader__file weui-uploader_tmpl1__file weui-uploader__file_status"
		     style="display:none">
			<img :src="tour.img"
			     alt="">
		</div>
		<div class="box-uploader" v-if="isUploadShow">
			<!--<div v-if="tour.img" class="weui-uploader__file weui-uploader_tmpl1__file"
				         :style="'background-image: url('+tour.img+');height:200px'"></div>-->
			<my-uploader :fileImg="fileImg"
			             :title="title"
			             :tmpl="tmpl"
			             :uploadCount="uploadCount"
			             :uploadCounted="uploadCounted"
			             :url="url"
			             :auto="auto"
			             :queue="queue"
			             :fileVal="fileVal"
			             :type="type"
			             :compress="compress"
			             :compressWidth="compressWidth"
			             :compressHeight="compressHeight"
			             :compressQuality="compressQuality"
			             :onBeforeQueued="onBeforeQueued"
			             :onQueued="onQueued"
			             :onBeforeSend="onBeforeSend"
			             :onProgress="onProgress"
			             :onSuccess="onSuccess"
			             :onError="onError"
			             :onDelete="onDelete"
			             :inputCtr="isWeiXin"
			             :onInputClick="onInputClick"
			             ref="uploader"></my-uploader>
		</div>
		<div style="height:10px;">
		</div>
		<mt-cell title="状态">
			<span>{{ordID}}</span> (
			<span style="color: #0386CA"
			      v-if="order.isOK==1&&order.suretyID<=0">已确认</span>
			<span style="color: #0386CA"
			      v-else-if="order.isOK==1&&order.suretyID>0">已担保</span>
			<span style="color: green"
			      v-else-if="order.isOK==0">预留中</span>
			<span style="color: gray"
			      v-else-if="order.isOK==-4">已清位</span>
			<span style="color: gray"
			      v-else-if="order.isOK==-2">已撤销</span>
			<span style="color: black"
			      v-else-if="order.isOK==-3">已取消</span> )
		</mt-cell>
		<div v-show="selected==0">
			<mt-field label="护照号码"
			          v-model="tour.passport"
			          class="input-right require-field"></mt-field>
			<mt-field label="中文名"
			          class="input-right require-field"
			          @change.native="changeName"
			          v-model="tour.cnName">
				<!--<input class="mint-field-core"   type="text">-->
			</mt-field>
			<mt-field label="英文姓"
			          v-model="tour.enName1"
			          class="input-right"></mt-field>
			<mt-field label="英文名"
			          placeholder=""
			          v-model="tour.enName2"
			          class="input-right"></mt-field>
			<mt-cell title="性别"
			         is-link
			         v-model='tour.sex'
			         @click.native="sexTypeClick">
				<!--<input type="text" >-->
			</mt-cell>
			<mt-field class="input-right"
			          label="出身地址"
			          v-model="tour.POB"></mt-field>
			<mt-cell title="出生日期"
			         is-link
			         v-model="tour.birth"
			         @click.native="birthClick"></mt-cell>
			<mt-field class="input-right"
			label="联系方式"
			v-model="tour.ctInfo"></mt-field>
			<mt-cell class="input-right"
			         title="住址"
			         v-model="tour.POI">
				<input type="text"
				       class="mint-field-core"
				       v-model="tour.POI">
			</mt-cell>
			<mt-cell title="签发日期"
			         @click.native="doiClick"
			         is-link
			         v-model="tour.DOI"></mt-cell>
			<mt-cell title="有效期至"
			         @click.native="doeClick"
			         is-link
			         v-model="tour.DOE"></mt-cell>
			<my-block></my-block>
		</div>
		<div v-show="selected==1">
			<mt-field label="中文名"
			          class="input-right require-field"
			          @change.native="changeName"
			          v-model="tour.cnName">
				<!--<input class="mint-field-core"  type="text">-->
			</mt-field>
			<mt-field label="英文姓"
			          v-model="tour.enName1"
			          class="input-right"></mt-field>
			<mt-field label="英文名"
			          placeholder=""
			          v-model="tour.enName2"
			          class="input-right"></mt-field>
			<mt-cell title="性别"
			         is-link
			         v-model='tour.sex'
			         @click.native="sexTypeClick">
				<!--<input type="text" >-->
			</mt-cell>
			<mt-cell title="出生日期"
			         is-link
			         v-model="tour.birth"
			         @click.native="birthClick"></mt-cell>
			<mt-field class="input-right require-field"
			          label="身份证号"
			          is-link
			          v-model="tour.IDCard"></mt-field>
			<mt-field class="input-right"
			          label="联系方式"
			          v-model="tour.ctInfo"></mt-field>
			<mt-field class="input-right"
			          label="住址"
			          v-model="tour.address"></mt-field>
			<my-block></my-block>
		</div>
		<mt-cell title="游客类型"
		         v-model="defaultTour.perType"
		         is-link
		         @click.native="toursTypeClick"></mt-cell>
		<my-bottom-box>
			<mt-button type="primary"
			           size="large"
			           @click.native="tourSave">保存</mt-button>
			<mt-button type="default"
			           size="large"
			           style="margin-top:15px"
			           @click.native="tourAutdit">保存并审核</mt-button>
		</my-bottom-box>
		<!-- 游客类型 -->
		<mt-popup v-model="toursTypePopStatus"
		          position="bottom"
		          class="my-popup">
			<mt-picker :slots="toursTypes"
			           @change="toursTypeChange"
			           showToolbar
			           visibleItemCount="3">
				<span class="mint-datetime-action mint-datetime-cancel"
				      @click="toursTypeClick">取消</span>
				<span class="mint-datetime-action mint-datetime-confirm"
				      @click="toursTypeConfirm">确认</span>
			</mt-picker>
		</mt-popup>
		<!-- 性别 -->
		<mt-popup v-model="sexTypePopStatus"
		          position="bottom"
		          class="my-popup">
			<mt-picker :slots="sexTypes"
			           @change="sexTypeChange"
			           showToolbar
			           visibleItemCount="3">
				<span class="mint-datetime-action mint-datetime-cancel"
				      @click="sexTypeClick">取消</span>
				<span class="mint-datetime-action mint-datetime-confirm"
				      @click="sexTypeConfirm">确认</span>
			</mt-picker>
		</mt-popup>
		<!--日期选择-->
		<mt-datetime-picker v-model="dateValue"
		                    type="date"
		                    :startDate="startDate"
		                    year-format="{value} 年"
		                    month-format="{value} 月"
		                    date-format="{value} 日"
		                    @confirm="dateSelect"
		                    ref="pickers">
		</mt-datetime-picker>
	</div>
</template>

<script>
import Uploader from "../../../components/uploader"
import { Toast, MessageBox, Indicator } from "mint-ui"
import './../../../lib/pinyin.js'
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

			title: "图片上传",
			tmpl: 1,
			uploadCount: 5,
			url: 'http://upload.qiniu.com',
			auto: true,
			queue: true,
			type: 'file',
			fileVal: 'file',
			compress: true,
			compressWidth: 1600,
			compressHeight: 1600,
			compressQuality: 0.8,
			uploadCounted: 0,
			fileImg: [],
			isUploadShow:false,
			// clearImg: false,
		}
	},
	created() {
		// let uptoken=this.uptoken;
		// 

		this.$store.dispatch('order/tour/uptoken_request').then(uptoken => {
			wx.config({
				// debug: true,
				appId: uptoken.wx_appid,
				timestamp: uptoken.wx_timestamp,
				nonceStr: uptoken.wx_noncestr,
				signature: uptoken.wx_signature,
				jsApiList: ['chooseImage', 'previewImage', 'uploadImage', 'downloadImage'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2,
			});
		});
		this.$store.dispatch('order/tour/recognizeSum').then(end=>{  //获取证件识别次数
			try {
				if(!end.values.isDelete && end.values.totalNum > 0){
					this.isUploadShow=true;
				}
			} catch (error) {
				this.isUploadShow=false;
			}
			
		});
		let order_id = this.$store.getters["order/order_id"];
		if (!order_id) {

			let orderid = this.$route.query.id;
			let tourid=this.$route.query.tourId;
			if (orderid) {
				this.$store.dispatch("order/order_select", { id: orderid });
				this.$store.dispatch("order/order_request").then(end=>{
					this.$store.dispatch('order/tour/name_list_request',
					{ planID: this.order.planID, ordID: orderid }).then(end => {
						let tourList=end[tourid];
						this.$store.dispatch('order/tour/tour_select', tourList);
					});
				});
				return;
			} else {
				Toast("未选择有效订单");
				return;
			}
		}
		this.$store.dispatch('order/tour/change_Recognize', {});
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
		fileWhich() {
			return this.$store.getters['order/tour/fileWhich'];
		},
		startDate() {
			if (this.showWhich == 1) {
				return new Date(DateFmt(new Date(), 'yyyy-MM-dd', 'y-100'));
			}
			if (this.showWhich == 2) {
				return new Date(DateFmt(new Date(), 'yyyy-MM-dd', 'y-10'));
			}
			if (this.showWhich == 3) {
				return new Date(DateFmt(new Date(), 'yyyy-MM-dd', 'y-0'));
			}
		},
		ordID() {
			return this.$route.query.id;
		},
		uptoken() {
			return this.$store.getters['order/tour/uptoken'];
		},
		tour() {
			let tour = this.$store.getters['order/tour/tour'];
			if (tour.img) {      //如果存在图片，图片存放进上传组件里让其可以删除
				let fileImg = {};
				if (/[' ']/g.test(tour.img)) {
					fileImg.img = decodeURI(tour.img);
				} else {
					fileImg.img = tour.img
				}

				this.fileImg.push(Object.assign({}, fileImg));
			}
			if (tour.file_type == 2) {   //文件类型为2时默认为身份证选项
				this.selected = 1;
			}
			return tour;
		},
		defaultTour() {
			return this.$store.getters['order/tour/defaultTour'];
		},
		toursTypeSelect() {
			return '成人';
		},
		toursTypes() {
			return [{ //游客类型选择项
				flex: 1,
				values: ['成人', '小童', '小年轻', '老人'],
				className: 'slot',
				defaultIndex: ['成人', '小童', '小年轻', '老人'].indexOf(this.toursTypeSelect),
			}]
		},
		sexTypeSelect() {
			return '男';
		},
		sexTypes() {
			return [{ //男女性别选择项
				flex: 1,
				values: ['男', '女'],
				className: 'slot',
				defaultIndex: ['男', '女'].indexOf(this.sexTypeSelect),
			}]
		},
	},
	methods: {
		fnTab(i) {
			if (this.selected == i) {
				return;
			}
			let tour = this.tour;
			let tourSign = false;
			for (var j in tour) {
				if (j == 'perType' || j == 'cpyName' || j == 'addTime' || j == 'sex' || j == 'ordID' || j == 'theUnionID' || j == 'theUnionPlanID' || j == 'top_erp_id' || j == 'top_id' || j == 'isLock' || j == 'admID' || j == 'ID' || j == 'bySort') {
					continue;
				}
				if (tour[j]) {
					tourSign = true;
					break;
				}
			}

			if (tourSign) {
				MessageBox.confirm('确定要切换吗？之前的数据将会被清空！').then(action => {
					this.tour.POI = '';
					this.tour.cnName = '';
					let clear = {};
					this.fileImg = [];
					this.$store.dispatch('order/tour/tour_clear', clear);
					// this.clearImg = true;
					this.imgSrc = '';
					this.selected = i;
				}).catch(end => {

				});
			} else {
				this.selected = i;
			}

		},
		changeName(e) {
			// let name=e.target.value;
			let name = this.tour.cnName;
			let enName1 = toPinyin(name.slice(0, 1));
			let enName2 = toPinyin(name.slice(1));
			this.tour.enName1 = enName1;
			this.tour.enName2 = enName2;
		},
		recognizeImg(data) {
			this.$store.dispatch('order/tour/ocrRecognize_singleRecognize', data).then(data => {
				Indicator.close();
				if (this.requestCount > 0) {
					return;
				}
				this.requestCount++;
				if (data.executeStatus=='1') {
					Toast(data.errorMsg);
					return;
				}
				if (data.values.message.status < 0) {
					Toast(data.values.message.msg || data.values.message.value);
					return;
				} else if(data.values.message.status >= 0){
					// this.initNum=1;
					Toast(data.values.message.msg || data.values.message.value);
					return;
				}
				

			}).catch(err => {
				console.log(err);
				if (this.requestCount > 0) {
					return;
				}
				this.requestCount++;
				Indicator.close();
				Toast('识别失败！');
			});
		},
		birthClick() {
			this.showWhich = 1;
			this.dateValue = this.tour.birth;
			this.$refs.pickers.open();
		},
		doiClick() {
			this.showWhich = 2;
			this.dateValue = this.tour.DOI;
			this.$refs.pickers.open();
		},
		doeClick() {
			this.showWhich = 3;
			this.dateValue = this.tour.DOE;
			this.$refs.pickers.open();
		},
		changeInitNum() {
			this.initNum = 0;
		},
		tourSave(fn) {
			let data = {   //保存游客
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
				img: '',
				nation: '',
				address: '',
				ctInfo:'',
			};
			if (!this.tour.cnName) {
				Toast('请输入中文名！');
				return;
			}
			if (this.tour.cnName.length>14) {
				Toast('中文名长度不能超过15位！');
				return;
			}
			if (this.tour.enName1.length>20) {
				Toast('英文姓长度不能超过20位！');
				return;
			}
			if (this.tour.enName2.length>20) {
				Toast('英文名长度不能超过20位！');
				return;
			}
			let dateReg = /[A-z]/g;
			if (this.tour.birth && dateReg.test(this.tour.birth)) {
				Toast('出生日期错误！');
				return;
			}
			if (this.tour.DOI && dateReg.test(this.tour.DOI)) {
				Toast('签发日期错误！');
				return;
			}
			if (this.tour.DOE && dateReg.test(this.tour.DOE)) {
				Toast('有效日期错误！');
				return;
			}
			// data = this.tour;
			data=Object.assign(data, this.tour);
			if (this.imgSrc) {
				data.img = this.imgSrc;
			}
			let fileType = Object.prototype.toString.call(this.fileImg);
			if (fileType == '[object Array]' && !this.fileImg.length) { //默认没有图上传后又删除图片地址清空
				data.img = '';
				if (this.imgSrc) {
					data.img = this.imgSrc;
				}
			}

			if (this.selected) {  //选择名单类型  2 身份证 13 护照
				if (!this.tour.IDCard) {
					Toast('请输入身份证号码！');
					return;
				}
				data.file_type = 2;
				this.tour.file_type = 2;
				data.DOI = '';
				data.DOE = '';
			} else {
				if (!this.tour.passport) {
					Toast('请输入护照号码！');
					return;
				}
				data.file_type = 13;
				this.tour.file_type = 13;
			}


			data.ordID = this.ordID;
			data.perType = this.defaultTour.perType;
			data.ID = this.defaultTour.ID;
			let planID = this.order.planID;

			let win_mingdan_grid = [];
			win_mingdan_grid.push(data);
			win_mingdan_grid = JSON.stringify(win_mingdan_grid);

			this.$store.dispatch('order/tour/order_name_add', { win_mingdan_grid, planID }).then(res => {
				if (res.success) {
					if (typeof fn == 'function') {
						fn(win_mingdan_grid);
						return;
					}
					Toast('保存成功');
					this.$router.go(-1);
				} else {
					Toast(res.msg);
				}
			});
		},
		tourAutdit() {
			let _this = this;
			this.tourSave(function (win_mingdan_grid) {
				_this.$store.dispatch("order/tour/check_pass",
					{ win_mingdan_grid }).then(end => {
						if (end.success) {
							Toast('审核通过!');
							_this.$router.go(-1);
						} else {
							Toast(end.msg);
						}
					})
			});
		},
		dateSelect(v) {
			if (this.showWhich == 1) {
				this.tour.birth = DateFmt(v, 'yyyy-MM-dd');
			} else if (this.showWhich == 2) {
				this.tour.DOI = DateFmt(v, 'yyyy-MM-dd');
			} else {
				this.tour.DOE = DateFmt(v, 'yyyy-MM-dd');
			}

		},
		toursTypeClick() {
			this.toursTypePopStatus = !this.toursTypePopStatus;
		},
		toursTypeChange(e, v) {
			this.toursTypeProxy = v[0];
			// this.tour.sex=sex;
		},
		toursTypeConfirm() {
			this.toursTypePopStatus = false;
			if (this.toursTypeProxy) {
				this.defaultTour.perType = this.toursTypeProxy;
			} else {
				this.defaultTour.perType = "成人";
			}
		},
		sexTypeClick() {
			this.sexTypePopStatus = !this.sexTypePopStatus;
		},
		sexTypeChange(e, v) {
			this.sexTypeProxy = v[0];
		},
		sexTypeConfirm() {
			this.sexTypePopStatus = false;
			if (this.sexTypeProxy) {
				this.tour.sex = this.sexTypeProxy;
			} else {
				this.tour.sex = "男";
			}
		},
		confirm() {
			let up = this.$refs.uploader;
			up.uploadAll();
		},
		onBeforeQueued: function (file, files) {
			console.log("----------onBeforeQueued----------");
			console.log(file, files);
			// file 是轮询到的文件, files 是所有文件

			if (["image/jpg", "image/jpeg", "image/png", "image/gif"].indexOf(file.type) < 0) {
				Toast('请上传图片');
				return false; // 阻止文件添加
			}
			if (file.size > 10 * 1024 * 1024) {
				Toast('请上传不超过10M的图片');
				return false;
			}
			if (files.length > 5) { // 防止一下子选择过多文件
				Toast('最多只能上传5张图片，请重新选择');
				return false;
			}
			if (this.uploadCounted + 1 > this.uploadCount) {
				Toast('最多只能上传5张图片');
				return false;
			}

			++this.uploadCounted;

			// return true; // 阻止默认行为，不插入预览图的框架
		},
		onQueued(file) {
			console.log("----------onQueued----------");
			console.log(file);

			// console.log(file.status); // 文件的状态：'ready', 'progress', 'success', 'fail'
			// console.log(file.base64); // 如果是base64上传，file.base64可以获得文件的base64

			//file.upload(); // 如果是手动上传，这里可以通过调用upload来实现；也可以用它来实现重传。
			// file.stop(); // 中断上传

			// return true; // 阻止默认行为，不显示预览图的图像
		},
		onBeforeSend(file, data, headers) {
			console.log("----------onBeforeSend----------");
			console.log(file, data, headers);


			// data.test= 1 // 可以扩展此对象来控制上传参数
			// headers['Origin'] = 'http://127.0.0.1' } // 可以扩展此对象来控制上传头部

			if (!isWeiXin()) {
				data.token = this.uptoken.qn_upToken;
				let erp = this.$store.getters["sys/sys"];
				let me = this.$store.getters["mine/mine"];
				let fileType = file.name.split('.')[1];
				let fileName = file.name.split('.')[0];
				fileName = fileName.replace(/[' ']/g, '');
				data.key = 'files/' + erp.erpid + '/images/' + DateFmt(new Date(), 'yyyyMMdd') + '/' + me.ID + '/' + fileName + '_' + DateFmt(new Date(), 'hhmmssS') + '.' + fileType;
				this.imgSrc = "https://ohp96o3wl.qnssl.com/" + data.key;
				headers['Authorization'] = "UpToken  " + this.uptoken.qn_upToken;
			} else {
				return true;// 阻止文件上传
			}


			//return true; // 阻止文件上传
		},
		onProgress(file, procent) {
			console.log("----------onProgress----------");
			console.log(file, procent);
			// return true; // 阻止默认行为，不使用默认的进度显示
		},
		onSuccess(file, ret) {
			// console.log("----------onSuccess----------");
			// console.log(file, ret);
			console.log('success');
			// this.clearImg = false;
			Indicator.open('正在识别...');
			let uptoken = this.uptoken;
			let type = this.fileType;
			if (isWeiXin()) {
				let src = 'http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=' + uptoken.wx_accessToken + '&media_id=' + file;
				this.$store.dispatch('order/tour/order_name_WxToQn', src).then(end => {
					this.imgSrc = end;
					this.recognizeImg(end, type);
				});
			} else {
				let filePath = this.imgSrc;
				let data = {};
				data.type = this.fileType;
				data.filePath = filePath;
				data.ordId = this.ordID;
				data.ordUserId = this.defaultTour.ID;
				this.recognizeImg(data);
			}
			// return true; // 阻止默认行为，不使用默认的成功态
		},
		onError(file, err) {
			console.log("----------onError----------");
			console.log(file, err);
			// return true; // 阻止默认行为，不使用默认的失败态
		},
		onDelete(file, cb) {
			// console.log("----------onDelete----------");
			console.log("delete");
			MessageBox.confirm('确定移除此文件?').then(action => {
				this.uploadCounted--;
				this.imgSrc = '';
				this.tour.img = '';
				cb(true); //移除文件
			}).catch(() => {
				cb(false); //不移除文件，此处可以不调用
			})
		},
		onInputClick(vm) {
			let _this = this;
			//console.log(_this.ordID);
			if (isWeiXin() && wx) {
				wx.chooseImage({
					count: 1, // 最多选择一张图片
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function (res) { // 选择图片成功
						let localId = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
						vm.uploading = true; // 正在上传图片
						// 设置图片显示
						wx.uploadImage({
							localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
							isShowProgressTips: 1, // 默认为1，显示进度提示
							success: function (res) {
								let serverId = res.serverId; // 返回图片的服务器端ID
								// _this.onSuccess();
								let uptoken = _this.uptoken;
								let src = 'http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=' + uptoken.wx_accessToken + '&media_id=' + serverId;
								vm.fileCtns.push({
									img: src,
									show: false,
									status: 0,
									file: {
										id: vm.fileCtns.length,
									}
								});
								// Toast(src);

								_this.$store.dispatch('order/tour/order_name_WxToQn', src).then(end => {
									_this.imgSrc = end;
									let data = {};
									data.type = _this.fileType;
									data.filePath = end;
									data.ordId = _this.ordID;
									data.ordUserId = _this.defaultTour.ID;
									Indicator.open('正在识别...');
									_this.recognizeImg(data);
								});
								//vm.onSuccess(serverId); // 上传成功回调成功接口
								vm.uploading = false; // 上传图片完成
							},
							fail() {
								vm.onError(); // 上传失败回调接口
							}
						});
					}
				});
			} else {
				throw "不在微信浏览器,不应调用此方法";
			}
		}
	},
	components: {
		"my-uploader": Uploader,
	},
	// beforeRouteLeave(to, from, next) {
	//     Indicator.close();
	// }
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
</style>