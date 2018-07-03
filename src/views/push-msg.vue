<template>
  <!-- 我的 -->
  <div>
    <mt-header title="推送消息"
               fixed>
      <a @click="fnBack"
         slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div style="height:40px"></div>
    <div class="loadmore-end">仅显示30天以内的消息</div> 
    <div class="fang-page__bd"
         v-for="msg in getPushMsgList">
      <div class="weui-form-preview">
        <div class="weui-form-preview__hd">
          <div class="weui-form-preview__item">
            <label class="weui-form-preview__label">{{msg.typeName}}</label>
            <span class="weui-form-preview__label"
                  v-show="!msg.isRead"
                  style="float:right"><mt-badge size="small"  style="float:right" type="error">新</mt-badge></span>
          </div>
        </div>
        <div class="weui-form-preview__bd">
          <div class="weui-form-preview__item">
            <label class="weui-form-preview__label"
                   style="text-align-last: inherit;"
                   v-html="msg.txt">时间</label>
  
          </div>
        </div>
        <div class="weui-form-preview__bd">
          <div class="weui-form-preview__item">
            <label class="weui-form-preview__label">{{DateFmt(msg.addTime, 'yyyy-MM-dd hh:mm:ss')}}</label>
          </div>
        </div>
        <div class="weui-form-preview__ft"
             v-if="msg.url">
          <a style="margin-left:15px;text-align:left"
             class="weui-form-preview__btn weui-form-preview__btn_primary"
             :href="msg.url">详情</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import Vue from 'vue'

export default {
  data() {
    return {
      popupStatus: false,   //页面显示标识  boolean
      showWhich: 0,
      loginTip: true,
      orderTip: true,
      messageTip: true,
      values: [],
      pushMsg: [],  //获取设置消息提醒值  array
      conten: '',
      info: '',
      versionInfo: [],
      detailIndex: -1,
      getPushMsgList: [],
      msgPage: 1,
      loadEnd: true, //false加载中  true 加载完毕
    }
  },
  created() {
    this.getPushMsg();
  },
  computed: {
  },
  methods: {
    fnBack() {
      return this.$router.push({ name: 'me' });
    },
    getPushMsg(ele) {
      Vue.http.post(
        "pub/get-push-msg",
        {},
        { emulateJSON: true }
      ).then(res => {
        if (!res.body) return;
        let data = res.body.rows;
        this.getPushMsgList = data.reverse();
        this.totalPage = res.body.total;  //获取总数量
        setTimeout(() => {
          let scrollH = document.body.scrollHeight;
          let clientH = document.body.clientHeight;
          let height = scrollH - clientH;
          if (height < 100) {
            return;
          }
          scroll(0, height);
        });

      })
    },
  },
}

</script>

<style>
.fang-page__bd {
  margin: 10px 15px;
}
.weui-form-preview {
  position: relative;
  background-color: #FFFFFF;
}

.weui-form-preview__hd:before {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e5e5e5;
  color: #e5e5e5;
  /*-webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);*/
}

.weui-form-preview:after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e5e5e5;
  color: #e5e5e5;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.weui-form-preview__hd {
  position: relative;
  padding: 10px 15px;
  text-align: right;
  line-height: 2.5em;
}

.weui-form-preview__bd {
  padding: 10px 15px;
  font-size: .9em;
  text-align: right;
  color: #999999;
  line-height: 2;
}

.weui-form-preview__item {
  overflow: hidden;
}

.weui-form-preview__label {
  float: left;
  margin-right: 1em;
  min-width: 4em;
  color: #999999;
  text-align: justify;
  text-align-last: justify;
  line-height: initial;
}

.weui-form-preview__value {
  display: block;
  overflow: hidden;
  word-break: normal;
  word-wrap: break-word;
}

.weui-form-preview__ft {
  position: relative;
  line-height: 50px;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}

.weui-form-preview__ft:before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1px solid #D5D5D6;
  color: #D5D5D6;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.weui-form-preview__btn {
  position: relative;
  display: block;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  color: #3CC51F;
  text-align: center;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.weui-form-preview:after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e5e5e5;
  color: #e5e5e5;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
</style>