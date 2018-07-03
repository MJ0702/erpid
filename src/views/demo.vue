<template>
  <div style="padding:10px">
    <my-uploader
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
      ref="uploader"
    ></my-uploader>
    <div style="height:100px;">
    </div>
    <my-button-block>
      <mt-button type="primary" size="large" @click.native="confirm">确定</mt-button>
    </my-button-block>
    <table>
      <tr v-for="ds in datas">
        <div v-for="as in ds.child">
          <td>{{as.sex}}</td>
        </div>
      </tr>
    </table>
  </div>
</template>

<script>
/*
title // 标题 必要，默认为 ''
tmpl // 模板，共两套模板 1,0 非必要，默认为 0
uploadCount // 总上传文件数，只做显示 非必要，默认为 1
uploadCounted // 已上传文件数，只做显示 非必要，默认为 0
url // 上传文件的url 必要，默认为 ''
auto // 是否自动上传，自动上传意为用户选中图片后就会进行文件上传 非必要 默认为 false
queue // 是否队列化上传，队列化上传是对文件一个一个进行上传，非队列化为一次上传全部，
      // 此配置适用自动上传和手动上传 非必要 默认为 false
fileVal // 文件上传域的name 非必要 默认为 file
type // 文件类型 非必要 默认为 file，上传图片时使用 image 以应用相应的图片尺寸压缩
compress // 是否压缩 非必要 默认为 true
compressWidth // 压缩图片最大宽度 非必要 默认为 1600
compressHeight // 压缩图片最大高度 非必要 默认为 1600
compressQuality // 压缩质量 非必要 默认为 0.8
onBeforeQueued // 单个或多个文件添加前的回调，return true 则不添加 非必要 默认不返回值
onQueued // 单个或多个文件添加成功的回调，return true 则不进行显示 非必要 默认不返回值
onBeforeSend // 每个文件上传前调用，return true 则不进行文件上传 非必要 默认不返回值
onProgress // 每个文件上传进度的回调，return true 则不使用默认的进度显示 非必要 默认不返回值
onSuccess // 每个文件上传成功的回调，return true 则不使用默认的成功显示不去掉上传状态遮罩 非必要 默认不返回值
onError // 每个文件上传失败的回调，return true 则不使用默认的错误显示不去掉红色错误感叹号遮罩 非必要 默认不返回值
onDelete // 每个文件删除前回调，调用回调函数传入 true 则将文件删除，false 则不删除，非必要 默认回调传入 true

ps：
文件上传时不允许进行删除操作，同时不会触发删除回调函数
手动上传使用 ref 方式调用组件的 uploadAll 方法，将所有图片进行上传
组件不会对重复文件进行判断，可以在 onBeforeQueued 回调中对文件名进行判断
其他情况请参照 demo
*/
  import Uploader from "../components/uploader"
  import { Toast, MessageBox } from "mint-ui"

  export default {
    data () {
      return {
        title: "图片上传",
        tmpl: 1,
        uploadCount: 5,
        url: 'http://localhost:8002/upload',
        auto: false,
        queue: true,
        type: 'file',
        fileVal: 'file',
        compress: true,
        compressWidth: 1600,
        compressHeight: 1600,
        compressQuality: 0.8,
        uploadCounted: 0,
        datas:[
          {
            name:'fs',
            child:[
              {
                name:'fsc',
                sex: 1,
              },
              {
                name:'fsb',
                sex: 0,
              }
            ]
          },
          {
            name:'fds',
            child:[
              {
                name:'fdsa',
                sex: 0,
              },
              {
                name:'fdsa',
                sex: 0,
              }
            ]
          }
        ],
      }
    },
    created() {
    },
    computed: {
    },
    methods: {
      confirm() {
        let up = this.$refs.uploader;
        up.uploadAll();
      },
      onBeforeQueued: function(file, files) {
        console.log("----------onBeforeQueued----------");
        console.log(file, files);

        // file 是轮询到的文件, files 是所有文件

        if(["image/jpg", "image/jpeg", "image/png", "image/gif"].indexOf(file.type) < 0){
            Toast('请上传图片');
            return false; // 阻止文件添加
        }
        if(file.size > 10 * 1024 * 1024){
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
      onQueued(file){
        console.log("----------onQueued----------");
        console.log(file);

        // console.log(file.status); // 文件的状态：'ready', 'progress', 'success', 'fail'
        // console.log(file.base64); // 如果是base64上传，file.base64可以获得文件的base64

        // file.upload(); // 如果是手动上传，这里可以通过调用upload来实现；也可以用它来实现重传。
        // file.stop(); // 中断上传

        // return true; // 阻止默认行为，不显示预览图的图像
      },
      onBeforeSend(file, data, headers){
        console.log("----------onBeforeSend----------");
        console.log(file, data, headers);
        // data.test= 1 // 可以扩展此对象来控制上传参数
        // headers['Origin'] = 'http://127.0.0.1' } // 可以扩展此对象来控制上传头部

        // return true; // 阻止文件上传
      },
      onProgress(file, procent){
        console.log("----------onProgress----------");
        console.log(file, procent);
        // return true; // 阻止默认行为，不使用默认的进度显示
      },
      onSuccess (file, ret) {
        console.log("----------onSuccess----------");
        console.log(file, ret);
        // return true; // 阻止默认行为，不使用默认的成功态
      },
      onError(file, err){
        console.log("----------onError----------");
        console.log(file, err);
        // return true; // 阻止默认行为，不使用默认的失败态
      },
      onDelete(file, cb){
        console.log("----------onDelete----------");
        console.log(file);
        MessageBox.confirm('确定移除此文件?').then(action => {
          this.uploadCounted--;
          cb(true); //移除文件
        }).catch(()=>{
          cb(false); //不移除文件，此处可以不调用
        })
      },
    },
    components: {
      "my-uploader": Uploader,
    }
  }
</script>

<style>
.weui-uploader .weui-uploader_tmpl1__bd {
  height: 200px;
}
</style>
