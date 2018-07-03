<template>
  <div class="order-receipt-treat">
    <mt-header :title="title"
               fixed>
      <a @click="$router.go(-1)"
         slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div style="height:40px"></div>
    <my-block></my-block>
    <mt-cell title="款项类型">
      <span style="color:#000">订单收款</span>
    </mt-cell>
    <my-cell title="付款方">
      <span style="color:#000">{{order.userCpyName}}</span>
    </my-cell>
    <mt-field label="付款人"
              :placeholder="receipt_show.payDesc"
              v-model="receipt_data.payDesc"
              class="input-right require-field ios-border"></mt-field>
    <mt-cell title="摘要说明"
             is-link
             @click.native="showTitle"
             class="require-field">
      <mt-field @click.native.stop
                :placeholder="receipt_show.title"
                v-model="receipt_data.title"
                class="input-right field-in-cell"></mt-field>
    </mt-cell>
    <my-block></my-block>
    <mt-field label="原币金额"
              :placeholder="receipt_show.theAmount"
              v-model="receipt_data.theAmount"
              class="input-right require-field"
              type="number"></mt-field>
    <mt-cell title="币种"
             is-link
             @click.native="showCur"
             class="require-field">
      <span style="color:#000">{{receipt_data.theCur}}</span>
    </mt-cell>
    <mt-cell title="汇率">
      <span style="color:#000">{{receipt_data.theRate | cny(4)}}</span>
    </mt-cell>
    <mt-cell title="款项金额">
      <span style="color:#000">{{amount}}</span>
    </mt-cell>
    <mt-cell title="到账日期"
             @click.native="showDate"
             is-link
             class="require-field ios-border">
      <span style="color:#000"
            v-if="receipt_data.theDate">{{DateFmt(receipt_data.theDate)}}</span>
      <span style="color:#a9a9a9"
            v-else>{{receipt_show.theDate}}</span>
    </mt-cell>
    <mt-cell title="收款方式"
             is-link
             @click.native="showPayType">
      <mt-field @click.native.stop
                :placeholder="receipt_show.payType"
                v-model="receipt_data.payType"
                class="input-right field-in-cell"></mt-field>
    </mt-cell>
    <my-cell title="收款账户"
             is-link
             @click.native="showAccInfo">
      <span style="color:#000"
            v-if="receipt_data.accInfo">{{receipt_data.accInfo}}</span>
      <span style="color:#a9a9a9"
            v-else>{{receipt_show.accInfo}}</span>
      <!-- <mt-field @click.native.stop :placeholder="receipt_show.accInfo" v-model="receipt_data.accInfo" class="input-right field-in-cell"></mt-field> -->
    </my-cell>
    <my-block bottom
              left>备注说明</my-block>
    <mt-field :placeholder="receipt_show.simDesc"
              type="textarea"
              rows="4"
              v-model="receipt_data.simDesc"
              @change="simDescChange"></mt-field>
    <my-block bottom
              left>凭证信息<span v-if="mode=='modify'" style="color:red">(移动版不支持修改凭证信息)</span></my-block>
    <div class="box-uploader"
         v-if="mode=='add'">
      <!--<div v-if="tour.img" class="weui-uploader__file weui-uploader_tmpl1__file"
                				         :style="'background-image: url('+tour.img+');height:200px'"></div>-->
      <my-uploader :fileImg="fileImg"
                   :title="uploadTitle"
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
  
    <mt-cell v-else
             style="padding: 3px 10px;word-wrap: break-word;"
             v-html="receipt_data.vouchers">
    </mt-cell>
    <my-block></my-block>
    <my-button-block v-show="PermitCheck('receipt/add')">
      <mt-button type="primary"
                 size="large"
                 @click.native="saved(SAVED)">保存</mt-button>
    </my-button-block>
    <my-button-block v-show="PermitCheck('receipt/submit-add-rec')">
      <mt-button type="default"
                 size="large"
                 @click.native="saved(SUBMIT)">保存并提交财务</mt-button>
    </my-button-block>
  
    <mt-header :title="['摘要说明','币种','收款方式','收款账户'][showWhich]"
               fixed
               v-if="popupStatus"
               style="z-index:2100">
      <a slot="left">
        <mt-button icon="back"
                   @click="popupStatus=!popupStatus">返回</mt-button>
      </a>
    </mt-header>
    <mt-popup v-model="popupStatus"
              popup-transition="popup-fade"
              position="right"
              class="my-popup-right">
      <div style="height:40px"></div>
      <!-- 摘要说明右侧弹出 -->
      <my-radio :title="item.title"
                name="title"
                @click.native="titleSelect(item),popupStatus=!popupStatus"
                :checked="item.title==receipt_data.title"
                v-for="item in titles"
                v-show="showWhich==0"></my-radio>
      <!-- 币种右侧弹出 -->
      <my-radio :title="item.code+'('+item.cnName+')'"
                name="cur"
                :value="item.rate"
                @click.native="curSelect(item),popupStatus=!popupStatus"
                :checked="item.code==receipt_data.theCur"
                v-for="item in curs"
                v-show="showWhich==1"></my-radio>
      <!-- 收款方式右侧弹出 -->
      <my-radio :title="item.title"
                name="payType"
                @click.native="paytypeselect(item),popupStatus=!popupStatus"
                :checked="item.title==receipt_data.payType"
                v-for="item in paytypes"
                v-show="showWhich==2"></my-radio>
      <!-- 收款账户右侧弹出 -->
      <my-radio name="accInfo"
                class="radio-newline"
                @click.native="accinfoselect(item),popupStatus=!popupStatus"
                :checked="item.accInfo==receipt_data.accInfo"
                v-for="item in accinfos"
                v-show="showWhich==3">
        <span class="mint-radio-label"
              style="padding:6px">
              <span style="line-height:1.8;">{{accInfoFmt(item.accInfo,0)}}</span>
        <br>
        <span style="font-size:14px;color:#888">{{accInfoFmt(item.accInfo,1)}}</span>
        </span>
      </my-radio>
  
      <p :class="'page-infinite-loading'+(loadEnd?'-no':'')">
        <mt-spinner type="fading-circle"></mt-spinner>
        加载中...
      </p>
    </mt-popup>
    <!-- 日期下方弹出 -->
    <mt-datetime-picker v-model="dateValue"
                        type="date"
                        year-format="{value} 年"
                        month-format="{value} 月"
                        date-format="{value} 日"
                        @confirm="dateSelect"
                        ref="picker">
    </mt-datetime-picker>
  </div>
</template>

<script>
import { MessageBox, Toast, Indicator } from 'mint-ui';
import Uploader from "../../../components/uploader"

export default {
  data() {
    return {
      loadEnd: true,
      popupStatus: false,
      showWhich: 0,
      title: "",
      uploadTitle: "添加水单",
      SAVED: "SAVED",
      SUBMIT: "SUBMIT",
      MODIFY: "modify",
      ADD: "add",
      mode: "",
      dateValue: new Date(),
      receipt_show: {
        payDesc: "请输入付款人", //付款人
        title: "请选择摘要说明", //摘要说明
        theAmount: "请输入金额", //原币金额
        theDate: "请选择到账日期", //到账日期
        payType: "请选择收款方式", //收款方式
        accInfo: "请选择收款账户", //收款账户
        simDesc: "请输入备注说明", //备注说明
      },
      receipt_data: {
        ID: "", //ID
        payDesc: "", //付款人
        title: "", //摘要说明
        theAmount: "", //原币金额
        theCur: "CNY", //币种
        theRate: 1, //汇率
        theDate: "", //到账日期
        payType: "", //收款方式
        accInfo: "", //收款账户
        simDesc: "", //备注说明
        vouchers: "", //凭证信息
        amount: "",
      },
      accInfo: {
        ID: null,
        accInfo: null,
      },
      imgSrc: '',

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
    }
  },
  created() {
    let order_id = this.$store.getters["order/order_id"];
    if (!order_id) {
      let orderid = this.$route.query.id;
      if (orderid) {
        this.$store.dispatch("order/order_select", { id: orderid });
        this.$store.dispatch("order/order_request").then(end => {
          this.fnInit();
        });
      } else {
        Toast("未选择有效订单");
        return;
      }
    } else {
      this.fnInit();
    }

  },
  computed: {
    order() {
      return this.$store.getters["order/order_select"]
    },
    titles() {
      return this.$store.getters["order/receipt/titles"]
    },
    curs() {
      return this.$store.getters["order/receipt/curs"]
    },
    paytypes() {
      return this.$store.getters["order/receipt/paytypes"]
    },
    accinfos() {
      return this.$store.getters["order/receipt/accinfos"]
    },
    amount() {
      if (JSON.stringify(this.order != '{}')) {
        this.receipt_data.amount = Number(NumFmt(this.receipt_data.theRate * this.receipt_data.theAmount, 2, ''))
        return NumFmt(this.receipt_data.theRate * this.receipt_data.theAmount, 2);
      }
    },
    uptoken() {
      return this.$store.getters['order/tour/uptoken'];
    },
    isWeiXin() {
      return !isWeiXin();
    },
  },
  methods: {
    fnInit() {
      let mode = this.$route.query.mode;
      this.mode = mode;

      if (mode == this.MODIFY) {
        this.title = "修改收款"
        let receipt = this.$store.getters["order/receipt/receipt_select"];
        if (JSON.stringify(receipt) == '{}') {  //刷新之后取出localstorage数据
          receipt = JSON.parse(window.localStorage.getItem('receiptSelect'));
        }
        // this.receipt_show = receipt;
        this.receipt_data = receipt;
        this.accInfo.ID = receipt.accID;
        this.accInfo.accInfo = receipt.accInfo;
        this.dateValue = this.receipt_data.theDate;
      } else if (mode == this.ADD) {
        let i = this.order.userCpyName.indexOf("/");
        let li = this.order.userCpyName.lastIndexOf("/");
        this.receipt_data.payDesc = this.order.userCpyName.slice(i + 1, li);
        this.title = "添加收款"
      } else {
        this.title = "错误操作页面"; return;
      }
      this.$store.dispatch('order/tour/uptoken_request').then(uptoken => {
        if (isWeiXin()) {
          wx.config({
            // debug: true,
            appId: uptoken.wx_appid,
            timestamp: uptoken.wx_timestamp,
            nonceStr: uptoken.wx_noncestr,
            signature: uptoken.wx_signature,
            jsApiList: ['chooseImage', 'previewImage', 'uploadImage', 'downloadImage'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2,
          });
        }
      });

    },
    showDate() {
      this.dateValue = this.receipt_data.theDate || new Date();
      this.$refs.picker.open()
    },
    showTitle() {
      if (this.titles.length < 1) {
        this.loadEnd = false;
        this.$store.dispatch("order/receipt/titles_request").then(_ => {
          this.loadEnd = true;
        })
      }
      this.popupStatus = !this.popupStatus;
      this.showWhich = 0;
    },
    showCur() {
      if (this.curs.length < 1) {
        this.loadEnd = false;
        this.$store.dispatch("order/receipt/thecurs_request").then(_ => {
          this.loadEnd = true;
        })
      }
      this.popupStatus = !this.popupStatus;
      this.showWhich = 1;
    },
    showPayType() {
      if (this.paytypes.length < 1) {
        this.loadEnd = false;
        this.$store.dispatch("order/receipt/paytypes_request").then(_ => {
          this.loadEnd = true;
        })
      }
      this.popupStatus = !this.popupStatus;
      this.showWhich = 2;
    },
    showAccInfo() {
      if (this.accinfos.length < 1) {
        this.loadEnd = false;
        this.$store.dispatch("order/receipt/accinfos_request").then(_ => {
          this.loadEnd = true;
        })
      }
      this.popupStatus = !this.popupStatus;
      this.showWhich = 3;
    },
    dateSelect(v) {
      this.receipt_data.theDate = v;
    },
    titleSelect(v) {
      this.receipt_data.title = v.title;
    },
    curSelect(v) {
      this.receipt_data.theCur = v.code;
      this.receipt_data.theRate = v.rate;
    },
    paytypeselect(v) {
      this.receipt_data.payType = v.title;
    },
    accinfoselect(v) {
      this.accInfo = v;
      this.receipt_data.accInfo = v.accInfo;
    },
    simDescChange(val) {
      if (val && val.length > 100) {
        Toast("请精简字数至100字内")
        this.receipt_data.simDesc = val.slice(0, 100);
      }
    },
    accInfoFmt(val, type) {
      if (val) {
        if (type == 0) {
          return val.slice(0, val.indexOf("("));
        } else if (type == 1) {
          return val.slice(val.indexOf("(") + 1, val.lastIndexOf(")"));
        }
      }
      return val;
    },
    saved(type) {
      let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      //进行字段验证
      if (!this.receipt_data.payDesc) {
        Toast("付款人不能为空"); return;
      }
      if (!this.receipt_data.title) {
        Toast("摘要说明不能为空"); return;
      }
      if(this.receipt_data.title.length>'30'){
        Toast("摘要说明过长"); return;
      }
      if (!this.receipt_data.theAmount) {
        Toast("原币金额不能为空"); return;
      } 
      if(this.receipt_data.theAmount.length>16){
        Toast('原币金额不能超过16位');
        return;
      }
      if (!this.receipt_data.theDate) {
        Toast("请选择到账日期"); return;
      }
      let data = {
        // ID	: "", //	财务编号	102974
        cpyName: this.order.userCpyName, //	公司名称	313599/陪我到山里看海/陪我到山里看海/
        title: this.receipt_data.title, //	摘要说明	全款
        payDesc: this.receipt_data.payDesc, //	付款人	陪我到山里看海
        theAmount: this.receipt_data.theAmount, //	原币金额	1024
        theRate: this.receipt_data.theRate, //	汇率	6.4655
        amount: this.receipt_data.amount, //	款项金额	6620.67
        theDate: DateFmt(this.receipt_data.theDate, "yyyy-MM-dd hh:mm:ss.S"), //	到账日期	2017-04-07 00:00:00.000
        payType: this.receipt_data.payType, //	收款方式	银行转账
        accID: this.accInfo.ID, //	收款账户	583
        ordID: this.order.ordID, //	订单号	108907
        planID: this.order.planID, //	团期id	1005871
        simDesc: this.receipt_data.simDesc, //	备注信息	2
        cpyID: this.order.cpyID, //	公司id	313599
        vouchers: this.receipt_data.vouchers, //	凭证信息	1<p></p>
        theCur: this.receipt_data.theCur, //	币种	USD
        isOK: "", //	状态 保存isOK=0，提交财务确认isOK=51；财务下面录入，保存isOK=51，确认到账isOK=61
      } 
      if (this.imgSrc) {
        data.vouchers = this.imgSrc;  //上传图片等于凭证（水单）信息
      }
      if (this.mode == this.MODIFY) {
        if (this.receipt_data.ID) {
          data.ID = this.receipt_data.ID;
        } else {
          Toast("财务编号错误"); return;
        }
      }
      console.log("data", data);
      if (type == this.SAVED) {
        data.isOK = 0;
      } else if (type == this.SUBMIT) {
        data.isOK = 51;
      } else {
        Toast("保存方式出错"); return;
      }
      Indicator.open({
        text: '正在操作...',
        spinnerType: 'fading-circle'
      });
      this.$store.dispatch("order/receipt/receipt_save", data).then(state => {
        Indicator.close();
        if (state && state.success) {
          Toast("操作成功");
          this.$router.go(-1);
        } else {
          Toast(state.msg || "操作失败");
        }
      }).catch(err => {
        console.log(err);
        Indicator.close();
        Toast("网络错误");
      })
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
      let uptoken = this.uptoken;
      let type = this.fileType;
      if (isWeiXin()) {
        let src = 'http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=' + uptoken.wx_accessToken + '&media_id=' + file;
        this.$store.dispatch('order/tour/order_name_WxToQn', src).then(end => {
          this.imgSrc = end;
        });
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
        // this.tour.img = '';
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
                vm.onSuccess(serverId); // 上传成功回调成功接口
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
  beforeRouteLeave(to, from, next) {
    if (this.popupStatus) {
      this.popupStatus = !this.popupStatus;
      next(false);
    } else {
      next();
    }
  }
}
</script>

<style>
.order-receipt-treat .input-right .mint-cell-value input {
  text-align: right;
}

a.ios-border .mint-cell-wrapper {
  background-image: none;
}

a.ios-border .mint-cell-wrapper:before {
  content: '';
  position: absolute;
  height: 1px;
  bottom: 0;
  left: 12px;
  right: 0;
  background: #d9d9d9;
  z-index: 1;
}
</style>

<style scoped>
.my-button-block {
  text-align: center;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 0px;
}

.field-in-cell {
  background-image: none;
}
</style>
