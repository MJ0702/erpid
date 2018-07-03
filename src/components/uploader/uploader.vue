<template>
  <div class="weui-uploader" v-if="tmpl==1">
    <div class="weui-uploader_tmpl1__bd">
      <div class="weui-uploader_tmpl1__input-box" v-show="showInputBox">
        <input v-if="inputCtr" @change="inputChange" class="weui-uploader_tmpl1__input" type="file" accept="image/*" multiple=""
        />
        <a v-else @click="inputClick" class="weui-uploader_tmpl1__input"></a>
        <div class="weui-uploader_tmpl1__title">
          {{title}}
        </div>
      </div>
      <div class="weui-uploader__file weui-uploader_tmpl1__file" :class="item.show?'weui-uploader__file_status':''" :style="item.img?'background-image: url('+item.img+')':''"
        @click="fileClick(item)" v-show="!showInputBox" v-for="item in fileCtns" v-if="item">
        <div class="weui-uploader__file-content" v-if="item.show">
          <span v-if="item.status>0">{{item.status}}%</span>
          <i class="weui-loading" style="width: 30px;height: 30px;" v-if="item.status==0"></i>
          <i v-if="item.status<0" class="weui-icon-warn"></i>
        </div>
      </div>
    </div>
    <div class="weui-gallery" v-if="popupVisible">
      <span class="weui-gallery__img" @click="toggleGallery" :style="'background-image: url('+fileCtn.img+');'"></span>
      <div class="weui-gallery__opr" @click="fileDelete">
        <a href="javascript:" class="weui-gallery__del">
          <i class="weui-icon-delete weui-icon_gallery-delete"></i>
        </a>
      </div>
    </div>
  </div>
  <div class="weui-uploader" v-else-if="tmpl==0">
    <div class="weui-uploader__hd">
      <p class="weui-uploader__title">{{title}}</p>
      <div class="weui-uploader__info"><span>{{uploadCounted}}</span>/{{uploadCount}}</div>
    </div>
    <div class="weui-uploader__bd">
      <ul class="weui-uploader__files">
        <li class="weui-uploader__file" :class="item.show?'weui-uploader__file_status':''" :style="item.img?'background-image: url('+item.img+')':''"
          @click="fileClick(item)" v-for="item in fileCtns" v-if="item">
          <div class="weui-uploader__file-content" v-if="item.show">
            <span v-if="item.status>0">{{item.status}}%</span>
            <i class="weui-loading" style="width: 30px;height: 30px;" v-if="item.status==0"></i>
            <i v-if="item.status<0" class="weui-icon-warn"></i>
          </div>
        </li>
      </ul>
      <div class="weui-uploader__input-box">

        <input v-if="inputCtr" @change="inputChange" class="weui-uploader__input" type="file" accept="image/*" multiple="" />
        <a v-else @click="inputClick" class="weui-uploader__input"></a>

      </div>
    </div>
    <div class="weui-gallery" v-if="popupVisible">
      <span class="weui-gallery__img" @click="toggleGallery" :style="'background-image: url('+fileCtn.img+');'"></span>
      <div class="weui-gallery__opr" @click="fileDelete">
        <a href="javascript:" class="weui-gallery__del">
          <i class="weui-icon-delete weui-icon_gallery-delete"></i>
        </a>
      </div>
    </div>
  </div>
  <div class="weui-uploader" v-else>
    <input v-if="inputCtr" @change="inputChange" type="file" accept="image/*" multiple="" />
    <a v-else @click="inputClick"></a>
  </div>
</template>

<script>
  //ref https://github.com/weui/weui.js

  import { compress } from './image.js'; //对图片进行压缩
  import upload from './upload.js';

  const newfile = {
    status: 0,
    show: true,
    img: '',
  }

  export default {
    name: "my-uploader",
    data() {
      return {
        fileCtns: [],
        popupVisible: false,
        fileCtn: {},
        queues: [],
        uploading: false,
        showInputBox: true,
        inputCtr: true,
      }
    },
    components: {
    },
    created() {
        let vm = this;
        let fileImgType = Object.prototype.toString.call(this.fileImg);
        if (fileImgType == '[object Array]' && this.fileImg.length) {
          let fileImg = this.fileImg;
          vm.fileCtns.push({
            img: fileImg[0].img,
            show: false,
            status: 0,
            file: {
              id: vm.fileCtns.length,
            }
          });
        }else{
          vm.fileCtns=[];
        }
      // if (isWeiXin()) {
      //   this.inputCtr = false;
      // }

    },
    methods: {
      toggleGallery() {
        this.popupVisible = !this.popupVisible;
      },
      fileClick(ctn) {
        this.toggleGallery();
        this.fileCtn = ctn;
      },
      // 添加一个 file-content，并设置其状态，-1 为出错，大于等于 0 为进度
      fileCtnChange(i, status) {
        this.fileCtns[i].status = status;
      },
      // 清除DOM里的上传状态
      fileShowChange(i, status) {
        this.fileCtns[i].show = status;
      },
      // 设置上传
      setUploadFile(file, files) {
        file.url = URL.createObjectURL(file);
        file.status = 'ready';
        let vm = this;
        file.upload = function () {
          vm.uploading = true;
          upload(file, {
            url: vm.url,
            auto: vm.auto,
            fileVal: vm.fileVal,
            type: vm.type,
            xhrFields: {},
            onBeforeSend: vm.beforeSend,
            onSuccess: vm.success,
            onProgress: vm.progress,
            onError: vm.error,
          });
        };
        file.stop = function () {
          file.xhr.abort();
        };

        this.queued(file);
        if (this.auto) {
          if (this.queue) {
            this.queues.push(file.upload);
            if (this.queues.length >= files.length) {
              this.queues.shift()();
            }
          } else {
            file.upload();
          }
        } else if (this.queue) {
          this.queues.push(file.upload);
        }
      },
      inputChange(evt) {
        const files = evt.target.files;
        if (files.length === 0) {
          return;
        }

        if (this.compress === false && this.type == 'file') {
          // 以原文件方式上传
          Array.prototype.forEach.call(files, (file) => {
            file.id = this.fileCtns.length;
            if (this.beforeQueued(file, files) === false) return;
            this.setUploadFile(file, files);
          });
        } else {
          // base64上传 和 压缩上传
          Array.prototype.forEach.call(files, (file) => {
            file.id = this.fileCtns.length;
            if (this.beforeQueued(file, files) === false) return;

            compress(file, {
              type: this.type,
              onError: this.error,
              compress: {
                width: this.compressWidth,
                height: this.compressHeight,
                quality: this.compressQuality,
              }
            }, (blob) => {
              if (blob) this.setUploadFile(blob, files);
            });
          });
        }

        evt.target.value = '';
      },
      beforeQueued(file, files) {
        const ret = this.onBeforeQueued(file, files);
        if (ret === false) {
          return false;
        }
        if (ret === true) {
          return;
        }

        this.fileCtns.push(Object.assign({ file }, newfile)); //添加一个文件项
      },
      queued(file) {
        if (!this.onQueued(file)) {
          this.fileCtns[file.id].img = file.base64 || file.url;
          if (!this.auto) {
            this.fileShowChange(file.id, false);
          }
        }
      },
      beforeSend(file, data, headers) {
        const ret = this.onBeforeSend(file, data, headers);
        if (ret === true) {
          return false;
        }
      },
      success(file, ret) {
        if (file.status === 'fail') {
          return;
        }
        file.status = 'success';
        this.uploading = false;

        if (!this.onSuccess(file, ret)) {
          this.fileShowChange(file.id, false);
        }
        if (this.queue) {
          //上传一次成功后，继续下个上传
          if (this.queues.length) {
            this.queues.shift()();
          }
        }
      },
      progress(file, percent) {
        if (file.status === 'fail' || file.status === 'success') {
          return;
        }
        if (!this.onProgress(file, percent)) {
          this.fileCtnChange(file.id, percent);
        }
      },
      error(file, err) {
        if (file.status === 'success') {
          return;
        }
        file.status = 'fail';
        this.uploading = false;

        if (!this.onError(file, err)) {
          this.fileCtnChange(file.id, -1);
        }
        if (this.queue) {
          //上传一次成功后，继续下个上传
          if (this.queues.length) {
            this.queues.shift()();
          }
        }
      },
      uploadAll() {
        if (!this.auto) {
          this.fileCtns.forEach((ctn, i) => {
            if (ctn) {
              this.fileCtnChange(ctn.file.id, 0);
              this.fileShowChange(ctn.file.id, true);
              if (ctn.file.upload) {
                if (this.queue) {
                  this.queues.push(ctn.file.upload);
                } else {
                  ctn.file.upload()
                }
              };
            }
          })
          if (this.queue) {
            this.queues.shift()();
          }
        }
      },
      fileDelete() {
        if (this.uploading) {
          return;
        }
        this.onDelete(this.fileCtn, (res) => {
          if (res) {
            //如果返回true，将文件从列表里删除
            this.toggleGallery();
            this.fileCtns[this.fileCtn.file.id] = null;
            this.fileCtn = null;

            this.changeShowInputBox();
          }
        });
      },
      toDeleteFile() {
        this.fileDelete();
      },
      changeShowInputBox() {
        for (let i = 0; i < this.fileCtns.length; i++) {
          if (this.fileCtns[i]) {
            this.showInputBox = false;
            return;
          }
        }
        this.showInputBox = true;
      },
      inputClick() {
        this.onInputClick(this);
      },
    },
    computed: {
      filesign() {
        console.log('fileImg');
        
        return false;
      },
    },
    watch: {
      fileCtns() {
        
        this.changeShowInputBox();
      },
      fileImg(val){
        let vm=this;
        let fileImgType = Object.prototype.toString.call(val);
        if(fileImgType&&val.length){
            // let fileImg = this.fileImg;
            vm.fileCtns.push({
              img: val[0].img,
              show: false,
              status: 0,
              file: {
                id: vm.fileCtns.length,
              }
            });
        }else{
          vm.fileCtns=[];
        }
        
      }
    },
    props: {
      title: { // 标题
        type: String,
        default: '',
      },
      tmpl: { // 模板
        type: Number,
        default: 0,
      },
      uploadCount: { //限制上传的总文件数，只显示，不做判断
        type: Number,
        default: 1,
      },
      uploadCounted: { //已上传的文件数，只显示，不做判断
        type: Number,
        default: 0,
      },
      url: { //上传的url，返回值需要使用json格式
        type: String,
        default: '',
      },
      auto: { //设置为`true`后，不需要手动调用上传，有文件选择即开始上传。用file.upload()来上传
        type: Boolean,
        default: false,
      },
      queue: { //是否已队列形式上传
        type: Boolean,
        default: false,
      },
      type: { //上传类型, `file`为文件上传; `base64`为以base64上传
        type: String,
        default: 'file',
      },
      fileVal: { //文件上传域的name
        type: String,
        default: 'file',
      },
      compress: { //压缩配置, `false`则不压缩
        type: Boolean,
        default: true,
      },
      compressWidth: { //图片的最大宽度
        type: Number,
        default: 1600,
      },
      compressHeight: { //图片的最大高度
        type: Number,
        default: 1600,
      },
      compressQuality: { //压缩质量, 取值范围 0 ~ 1
        type: Number,
        default: 0.8,
      },
      onBeforeQueued: { //文件添加前的回调，return false则不添加
        type: Function,
        default() {
        },
      },
      onQueued: { //文件添加成功的回调
        type: Function,
        default() {
        },
      },
      onBeforeSend: { //文件上传前调用，具体参数看example
        type: Function,
        default() {
        },
      },
      onSuccess: { //上传成功的回调
        type: Function,
        default() {
        },
      },
      onProgress: { //上传进度的回调
        type: Function,
        default() {
        },
      },
      onError: { //上传失败的回调
        type: Function,
        default() {
        },
      },
      onDelete: { //删除文件的回调
        type: Function,
        default(ctn, cb) {
          cb(true);
        },
      },
      fileImg: { //上传类型, `file`为文件上传; `base64`为以base64上传
        type: Array,
        default: [],
      },
      onInputClick: { //
        type: Function,
        default() {
        },
      },
      inputCtr: { //
        type: Boolean,
        default: true,
      },
    }
  }

</script>

<style>
  @font-face {
    font-weight: normal;
    font-style: normal;
    font-family: "weui";
    src: url('data:application/octet-stream;base64,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') format('truetype');
  }
  
  .weui-uploader__hd {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding-bottom: 10px;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  
  .weui-uploader__title {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
  }
  
  .weui-uploader__info {
    color: #B2B2B2;
  }
  
  .weui-uploader__bd {
    margin-bottom: -4px;
    margin-right: -9px;
    overflow: hidden;
  }
  
  .weui-uploader__files {
    -webkit-padding-start: 0px;
    list-style: none;
  }
  
  .weui-uploader__file {
    float: left;
    margin-right: 9px;
    margin-bottom: 9px;
    width: 79px;
    height: 79px;
    background: no-repeat center center;
    background-size: cover;
  }
  
  .weui-uploader__file_status {
    position: relative;
  }
  
  .weui-uploader__file_status:before {
    content: " ";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .weui-uploader__file_status .weui-uploader__file-content {
    display: block;
  }
  
  .weui-uploader__file-content {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    color: #FFFFFF;
  }
  
  .weui-uploader__file-content .weui-icon-warn {
    display: inline-block;
  }
  
  .weui-uploader__input-box {
    float: left;
    position: relative;
    margin-right: 9px;
    margin-bottom: 9px;
    width: 77px;
    height: 77px;
    border: 1px solid #D9D9D9;
  }
  
  .weui-uploader__input-box:before,
  .weui-uploader__input-box:after {
    content: " ";
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background-color: #D9D9D9;
  }
  
  .weui-uploader__input-box:before {
    width: 2px;
    height: 39.5px;
  }
  
  .weui-uploader__input-box:after {
    width: 39.5px;
    height: 2px;
  }
  
  .weui-uploader__input-box:active {
    border-color: #999999;
  }
  
  .weui-uploader__input-box:active:before,
  .weui-uploader__input-box:active:after {
    background-color: #999999;
  }
  
  .weui-uploader__input {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  
  [class^="weui-icon-"],
  [class*=" weui-icon-"] {
    display: inline-block;
    vertical-align: middle;
    font: normal normal normal 14px/1 "weui";
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
  }
  
  [class^="weui-icon-"]:before,
  [class*=" weui-icon-"]:before {
    display: inline-block;
    margin-left: .2em;
    margin-right: .2em;
  }
  
  .weui-icon-warn:before {
    content: "\EA0B";
  }
  
  .weui-icon-warn {
    font-size: 23px;
    color: #F43530;
  }
  
  .weui-loading {
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: middle;
    -webkit-animation: weuiLoading 1s steps(12, end) infinite;
    animation: weuiLoading 1s steps(12, end) infinite;
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
    background-size: 100%;
  }
  
  @-webkit-keyframes weuiLoading {
    0% {
      -webkit-transform: rotate3d(0, 0, 1, 0deg);
      transform: rotate3d(0, 0, 1, 0deg);
    }
    100% {
      -webkit-transform: rotate3d(0, 0, 1, 360deg);
      transform: rotate3d(0, 0, 1, 360deg);
    }
  }
  
  @keyframes weuiLoading {
    0% {
      -webkit-transform: rotate3d(0, 0, 1, 0deg);
      transform: rotate3d(0, 0, 1, 0deg);
    }
    100% {
      -webkit-transform: rotate3d(0, 0, 1, 360deg);
      transform: rotate3d(0, 0, 1, 360deg);
    }
  }
  
  .weui-gallery {
    /*display: none;*/
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #000000;
    z-index: 1112;
    height: 100%;
    width: 100%;
  }
  
  .weui-gallery__img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 60px;
    left: 0;
    background: center center no-repeat;
    background-size: contain;
  }
  
  .weui-gallery__opr {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #0D0D0D;
    color: #FFFFFF;
    line-height: 60px;
    text-align: center;
  }
  
  .weui-gallery__del {
    display: block;
  }
  
  .weui-icon-delete:before {
    content: "\EA11";
  }
  
  .weui-icon-delete.weui-icon_gallery-delete {
    color: #FFFFFF;
    font-size: 22px;
  }
  
  .weui-uploader_tmpl1__bd {
    overflow: hidden;
    border: 1px solid #d9d9d9;
  }
  
  .weui-uploader_tmpl1__input-box {
    float: left;
    position: relative;
    margin-right: 9px;
    margin-bottom: 9px;
    width: 100%;
    height: 100%;
  }
  
  .weui-uploader_tmpl1__input-box:before,
  .weui-uploader_tmpl1__input-box:after {
    content: " ";
    position: absolute;
    top: 40%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background-color: #D9D9D9;
  }
  
  .weui-uploader_tmpl1__input-box:before {
    width: 2px;
    height: 39.5px;
  }
  
  .weui-uploader_tmpl1__input-box:after {
    width: 39.5px;
    height: 2px;
  }
  
  .weui-uploader_tmpl1__input-box:active {
    border-color: #999999;
  }
  
  .weui-uploader_tmpl1__input-box:active:before,
  .weui-uploader_tmpl1__input-box:active:after {
    background-color: #999999;
  }
  
  .weui-uploader_tmpl1__input {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  
  .weui-uploader_tmpl1__title {
    width: 100%;
    position: absolute;
    top: 55%;
    color: #999;
    text-align: center;
  }
  
  .weui-uploader_tmpl1__file {
    width: 100%;
    height: 100%;
    background-size: contain;
  }
</style>