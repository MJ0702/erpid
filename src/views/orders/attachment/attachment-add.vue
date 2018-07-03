<template>
  <!-- 添加附件 -->
  <div>
    <mt-header title="添加水单"
               fixed>
      <a @click="$router.go(-1)"
         slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="blank"
         style="height:40px"></div>
    <my-block></my-block>
    <!--<mt-cell title="共享范围"
             :value="attachmentSelect.ordID"></mt-cell>-->
    <mt-field class="require-field input-right"
              label="文件名称"
              placeholder="请输入文件名称"
              v-model="attachmentSelect.title"></mt-field>
    <my-block></my-block>
    <mt-cell title="上传水单"></mt-cell>
    <div class="box-uploader">
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
    <mt-cell title="水单说明"></mt-cell>
    <mt-field type="textarea"
              rows="4"
              v-model="attachmentSelect.simDesc"></mt-field>
    <my-bottom-box>
      <mt-button type="primary"
                 @click.native="fnAdd"
                 v-show="PermitCheck('attachment/edit')"
                 size="large">确定</mt-button>
    </my-bottom-box>
  </div>
</template>

<script>
import Vue from 'vue';
import { Toast,MessageBox  } from 'mint-ui';
import Uploader from "../../../components/uploader"
export default {
  data() {
    return {
      attachmentSelect: {
        title:'',
        simDesc:'',
        files:'',
      },
      imgSrc: '',

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
    }
  },
  created() {
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
  computed: {
    order() {
      return this.$store.getters["order/order_select"]
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

    },
    fnAdd() {
      if(!this.attachmentSelect.title){
        Toast('请输入文件名称！');
        return;
      }
      let data = this.attachmentSelect;
      data.files=this.imgSrc;
      data.ordID=this.order.ordID;
      data.planID=this.order.planID;
      this.$store.dispatch("order/attachment/attachment_add", data);
      this.$router.go(-1);
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
}

</script>

<style>

</style>