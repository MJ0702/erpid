<template>
  <!-- 我的 -->
  <div>
    <!--<mt-header title="我的"
               fixed>
      <router-link to="/"
                   slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button>打赏</mt-button>
    </mt-header>-->
    <mt-header title="我的" fixed>
      <a @click="$router.push('/')" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
      <mt-button slot="right" @click="$router.push('dashang')">
        <img width="20" height="20" style="vertical-align: middle;" src="~assets/meigui.png" alt="欢迎"> 打赏
      </mt-button>
    </mt-header>
    <div style="height:40px"></div>

    <my-user-info :user="user" :userBody="false"></my-user-info>
    <mt-cell is-link title="更多信息" @click.native="popupClick(1)"></mt-cell>
    <my-block></my-block>
    <mt-cell is-link title="推送消息" @click.native="toPushMsg()">
      <div size="small" class="red-dot" style="margin-top: -9px;" v-if="pushDot>0"></div>
    </mt-cell>
    <mt-cell is-link title="更新日志" @click.native="popupClick(3)">
      <div size="small" class="red-dot" style="margin-top: -9px;" v-if="mineDot>0"></div>
    </mt-cell>
    <mt-cell is-link title="意见反馈" @click.native="popupClick(2)"></mt-cell>
    <mt-cell is-link title="设置" @click.native="popupClick(4)">

    </mt-cell>
    <my-button-block v-if="showlogout" style="z-index:2100">
      <mt-button type="primary" size="large" @click.native="logout">退出</mt-button>
    </my-button-block>
    <my-pad></my-pad>
    <my-navigate-tab selected="mine"></my-navigate-tab>
    <mt-header :title="['','更多信息','意见反馈','更新日志','设置','更新内容'][showWhich]" fixed v-if="popupStatus" style="z-index:2101">
      <a slot="left">
        <mt-button icon="back" @click="showWhich != 5 ? popupStatus=!popupStatus : showWhich=3;$store.dispatch('mine/get_red_dot');">返回</mt-button>
      </a>
    </mt-header>
    <mt-popup v-model="popupStatus" popup-transition="popup-fade" position="right" class="my-popup-right">
      <div style="height:40px"></div>
      <!--更多信息-->
      <my-user-info v-if="showWhich==1" :user="user" :userHead="false"></my-user-info>
      <!-- 设置-->
      <div v-if="showWhich==4">
        <!-- 设置推送消息列表-->
        <my-block bottom left style="padding-top:12px">消息免打扰</my-block>
        <div v-for="msg,index in pushMsg">
          <my-block bottom left style="padding-top:12px" v-if="index==1">消息开关</my-block>
          <mt-cell :title="msg.title">
            <mt-switch @change="fnPushMsg(index)" v-model="msg.value"></mt-switch>
          </mt-cell>
        </div>
      </div>
      <!-- 意见反馈-->
      <div v-if="showWhich==2">
        <my-block bottom left>意见建议</my-block>
        <mt-field type="textarea" v-model="conten" placeholder="请输入您的建议或在使用中遇到的问题,以便我们为您提供更好的产品" rows="4"></mt-field>
        <my-block bottom left>联系方式</my-block>
        <mt-field v-model="info" placeholder="请输入您的联系方式"></mt-field>
        <my-block bottom left style="color:orangered;padding-top:10px;padding-right:15px;">已提交的“意见反馈”信息，可以在PC版“在线反馈”中进行查看。</my-block>
        <my-bottom-box>
          <mt-button type="primary" @click.native="opinionSubmit" size="large">提交</mt-button>
        </my-bottom-box>
      </div>
      <!--升级日志-->
      <div v-if="showWhich==3">
        <div class="weui-panel" v-for="info,index in versionInfo" @click="showDetail(index)">
          <div class="weui-panel__bd">
            <div class="weui-media-box weui-media-box_text">
              <div class="weui-media-box__title">{{info.title}}
                <div class="red-dot" v-if="redID(info.ID)" style="display: inline-block; float:right;vertical-align: top;margin-right: 15px;"></div>
              </div>
              <p class="weui-media-box__desc">{{info.simDesc}}</p>
              <ul class="weui-media-box__info">
                <li class="weui-media-box__info__meta">时间</li>
                <li class="weui-media-box__info__meta weui-media-box__info__meta_extra">{{info.updateTime | DateFmt}}</li>
              </ul>
              <i class="arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
      <!--版本详细信息-->
      <div class="box-content-bg" v-if="showWhich==5">
        <div class="weui-panel">
          <div class="weui-panel__bd">
            <div class="weui-media-box weui-media-box_text">
              <div class="weui-media-box__title" style="white-space: initial;">{{versionInfo[detailIndex].title}}

              </div>
              <p class="weui-media-box__desc" style="padding-right:0" v-html="versionInfo[detailIndex].detail"></p>
            </div>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import UserInfo from "./commons/user-info.vue"
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
        topStatus: '',
        dataLen: true,
        totalPage: 0,
      }
    },
    created() {
      this.$store.dispatch("mine/mine_request");
      this.$store.dispatch("mine/get_red_dot");
      this.$store.dispatch("mine/get_version_dot");
    },
    computed: {
      user() {
        return this.$store.getters["mine/mine"];
      },
      showlogout() {
        let ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) != 'micromessenger') {
          // 不在微信浏览器，显示退出按钮
          return true;
        }
        return false;
      },
      redIDs() {
        return this.$store.getters["mine/redIDs"];
      },
      pushDot(){
        return this.$store.getters["mine/pushDot"];
      },
      mineDot(){
        return this.$store.getters["mine/mineDot"];
      },
    },
    methods: {
      fnUpdate() {
        this.showWhich = 10;
      },
      redID(id) {
        let ids = this.redIDs;
        let y = ids.find(x => {
          return x == id;
        })
        if (y) {
          return y;
        }
        return false;
      },
      logout() {
        window.location.href = "/sys/m";
        this.$http.post(
          "m/logout",
          {
          },
          { emulateJSON: true }
        ).then(res => {

          console.log('已退出erp');
        }).catch(() => {
          window.close();
        })
      },
      opinionSubmit() {        //意见反馈
        let conten = this.conten;
        let info = this.info;
        if (!conten) {
          Toast('意见建议不能为空！');
          return;
        }
        Vue.http.post(
          "pub/feedback",
          {
            conten,
            info
          },
          { emulateJSON: true }
        ).then(res => {
          if (!res.body) return
          let data = res.body;
          if (data.success) {
            Toast('提交成功！');
            this.conten = '';
            this.info = '';
          } else {
            Toast(data.msg);
          }

        })
      },
      reqVersion() {           //获取升级日志
        Vue.http.post(
          "pub/version-information",
          {
            page: 1,
            start: 0,
            limit: 10,
            isOK: 1,
            isLock: 0,
            sort: '[{"property":"ID","direction":"desc"}]'
          },
          { emulateJSON: true }
        ).then(res => {
          if (!res.body) return
          let data = res.body;
          if (data.success) {
            this.versionInfo = data.rows;
            // Toast('提交成功！');
          } else {
            Toast(data.msg);
          }

        })
      },
      reqSet() {             //获取推送消息设置信息
        Vue.http.post(
          "pub/my-set",
          {
          },
          { emulateJSON: true }
        ).then(res => {
          if (!res.body) return;
          let data = res.body;
          let pushValue = data['push-msg'].values.split(',');
          let titles = data['push-msg'].titles.split(',');
          let pushMsg = [];
          for (var i in pushValue) {
            if (titles[i] == "0") {
              break;
            }
            pushMsg[i] = {};
            pushMsg[i].title = titles[i];
            pushMsg[i].value = pushValue[i] == 0 ? true : false;
          }
          // let pushMsg=pushValue.map(x=>{
          //   return x == 0 ? true : false;
          // })
          this.pushMsg = pushMsg;
          this.values = pushValue;
          //this.pushTitle=titles;
        })
      },
      toPushMsg() {
        return this.$router.push({ name: 'push-msg' });
      },
      popupClick(i) {
        if (i) {
          this.showWhich = i;
          if (i == 3) {
            this.reqVersion();  //获取升级日志
          }
          if (i == 4) {
            this.reqSet();  //获取推送消息设置信息
          }
        }
        this.popupStatus = !this.popupStatus;
      },
      showDetail(i) {
        this.showWhich = 5;
        this.detailIndex = i;
        let ID = this.versionInfo[i].ID;
        let redIDs = this.$store.getters["mine/redIDs"];
        for (var i in redIDs) {
          if (redIDs[i] == ID) {
            this.$store.dispatch("mine/set_red_dot", ID);
            break;
          }
        }

      },
      fnPushMsg(i) {
        // this.pushMsg[i].value=!this.pushMsg[i].value;
        let pushMsg = this.pushMsg;
        let values = this.values;
        // pushMsg.forEach(x=>{
        //    x.value==true ? 0 : 1;
        //    this.values=x.value;
        // });
        let len = pushMsg.length;
        for (let j = 0; j < len; j++) {
          values[j] = pushMsg[j].value == true ? 0 : 1;
        }
        values = values.join();
        Vue.http.post(
          "pub/save-my-settings",
          {
            values: values
          },
          { emulateJSON: true }
        ).then(res => {
          if (!res.body) return;
        })
      },
    },
    components: {
      "my-user-info": UserInfo,
    },
    beforeRouteLeave(to, from, next) {
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
      if (this.popupStatus) {
        if (this.showWhich != 5) {
          this.popupStatus = !this.popupStatus;
        } else {
          this.showWhich = 3;   //升级详情信息返回到升级日志列表
        }
        next(false);
      } else {
        next();
      }

    }
  }

</script>

<style>
  .box-content-bg {
    height: calc(100% - 40px);
    background: #fff;
  }
  
  .box-block {
    padding: 0 12px;
    font-size: 13px;
  }
  
  .weui-panel {
    background-color: #FFFFFF;
    margin-top: 10px;
    position: relative;
    overflow: hidden;
  }
  
  .weui-panel:first-child {
    margin-top: 0;
  }
  
  .weui-panel:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #E5E5E5;
    color: #E5E5E5;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  
  .weui-panel:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #E5E5E5;
    color: #E5E5E5;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  
  .weui-media-box__info {
    margin: 0;
    padding: 0;
    margin-top: 6px;
    font-size: 13px;
    color: #CECECE;
    line-height: 1em;
    list-style: none;
    overflow: hidden;
  }
  
  .weui-media-box {
    padding: 10px 15px;
    position: relative;
  }
  
  .weui-media-box_text .weui-media-box__title {
    margin-bottom: 6px;
  }
  
  .weui-media-box__desc {
    margin: 0;
    font-size: 12px;
    color: #666;
    padding-right: 30px;
  }
  
  .weui-media-box__desc div:first-child {
    line-height: 40px!important;
    border-bottom: none!important;
  }
  
  .weui-media-box__desc div:nth-of-type(1) {
    padding-left: 10px!important;
  }
  
  .weui-media-box__desc ul,
  .weui-media-box__desc div,
  .weui-media-box__desc p {
    width: auto!important;
    list-style: none;
    padding: 0;
  }
  
  .weui-media-box__title {
    font-weight: 400;
    font-size: 17px;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    word-wrap: break-word;
    word-break: break-all;
  }
  
  .weui-media-box__info__meta {
    float: left;
    padding-right: 1em;
  }
  
  .weui-media-box__info__meta_extra {
    padding-left: 1em;
    border-left: 1px solid #CECECE;
  }
  
  .weui-media-box__info__meta {
    float: left;
    padding-right: 1em;
  }
  
  .dashang img {
    width: 100%;
  }
</style>