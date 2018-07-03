<template>
  <div style="background: #fff">
    <mt-header :title="myJson.title" fixed>
    </mt-header>
    <div class="blank" style="height:40px"></div>
    <my-block></my-block>
    <div class="fang-comment-box">
      <ul class="common-list">
        <li class="comment-list-item x-reply">
          <div class="mod-avatar">
            <i class="G-ico G-ico-usrface"></i>
            <div class="G-img-wrap">
              <img :src="myJson.photo" v-if="myJson.photo!='null'" />
              <img :src="defaultPhoto" v-else />
            </div>
          </div>
          <div class="content">
            <div class="content-info">
              <div class="content-info-text">
                <div class="name-box">
                  <span class="x-user name">{{ myJson.addName }}</span>
                  <span data-nodeid="iddedd06fd"></span>
                </div>
                <div class="name-desc">
                  <span class="desc">{{myJson.addTime}}</span>
                  <span class="desc">
                  </span>
                </div>
              </div>
              <div class="prise" style="padding:0 5px 0 15px" @click="fnRevert()">
                <span class="mint-button-icon">
                  <i class="mintui mintui-more"></i>
                </span>
              </div>
            </div>
            <div class="content-main">
              <p class="txt" v-html="myJson.neirong">
              </p>
            </div>
          </div>
        </li>
      </ul>
      <ul class="common-list" v-for="item in revertContentArr">
        <my-block style="background: #f4f4f4"></my-block>
        <li class="comment-list-item x-reply">
          <div class="mod-avatar">
            <i class="G-ico G-ico-usrface"></i>
            <div class="G-img-wrap">
              <img :src="myJson.bePhoto">
            </div>
          </div>
          <div class="content">
            <div class="content-info">
              <div class="content-info-text">
                <div class="name-box">
                  <span class="x-user name">{{ user.trueName }}</span>
                  <span data-nodeid="iddedd06fd"></span>
                </div>
                <div class="name-desc">
                  <span class="desc">
                  </span>
                </div>
              </div>
            </div>
            <div class="content-main">
              <p class="txt" v-html="item">
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 加审人下方弹出 -->
    <mt-popup v-model="revertPopupStatus" position="bottom" class="my-popup">
      <div class="banner-ctrl" data-reactid=".0.0.0.0">
        <a href="javascript:;" class="back padding-left-16" style="cursor:pointer;">取消</a>
        <a href="javascript:;" v-if="revertContent" @click="fnRevertContent" class="fr green " style="cursor:pointer;">发表</a>
        <a href="javascript:;" v-else class="fr disabled" style="cursor:pointer;">发表</a>
      </div>
      <mt-field class="fang-revert" label="" placeholder="我来说两句" type="textarea" v-model="revertContent" rows="4"></mt-field>
    </mt-popup>
  </div>
</template>

<script>
  import {
    Toast,
  } from 'mint-ui';
  import Vue from 'vue'
  export default {
    data() {
      return {
        title: '今天你去干嘛了今天你去干嘛了今天你去干嘛了！！！！！',
        revertPopupStatus: false,
        revertContent: '',
        myJson: {},
        param: '',
        revertContentArr: [], //回复内容数组
      }
    },
    created() {
      try {
        // let data = myjson.data.replace(/\./g, '%');
        // let data = myjson.data;
        // let datas = {
        //   xwl: '344XCOIE99YY'
        // }
        // let {
        //   param
        // } = this.$route.query;
        // let myJson = JSON.parse(param);
        // console.log(location.search)
        // return;
        // let str=location.search.split('?')[1];
        // Object.assign(data, myJson);
        // datas.content=myJson.content;
        // console.log('str:',str)
        let param = location.hash.split('?')[1];
        this.param = param;
        // console.log('param:',param);
        this.fnReq(param);
        // myjson.data = JSON.parse(decodeURI(data));
        // console.log('myjsondata:', myjson.data);
        // this.myJson = myjson.data;
      } catch (e) {
        Toast('消息通知有效性验证失败,格式有误');
      }
    },
    computed: {
      user() {
        return this.$store.getters["mine/mine"];
      },
      defaultPhoto() {
        let url = location.origin;
        return url + '/sys/web/imgs/header.png'
      },
    },
    methods: {
      fnRevert(arg) {
        this.revertPopupStatus = true;
      },
      fnRevertContent() {
        let param = this.param;
        let replyContent = this.revertContent;
        Vue.http.get('/sys/main?xwl=344XCOIE900N&' + param + '&replyContent=' + replyContent, {
          emulateJSON: true
        }).then(res => {
          // this.myJson = res.body; 
          this.revertPopupStatus = false;
          if (res.body.success) {
            this.revertContentArr.push(replyContent)
            Toast(res.body.msg)
          }
        })
      },
      fnReq(datas) {
        console.log('datas:', datas)
        Vue.http.get('/sys/main?xwl=344XCOIE99YY&' + datas, {
          emulateJSON: true
        }).then(res => {
          console.log('res.body:', res.body)
          this.myJson = res.body;
        })
      }
    },
    components: {}
  }
</script>

<style>
  ul,
  li,
  div,
  p {
    margin: 0;
    outline: 0;
    border: 0;
    padding: 0;
    vertical-align: baseline;
    font-size: 100%;
    -webkit-tap-highlight-color: transparent;
    list-style: none;
  }

  .banner-ctrl {
    /* position: absolute; */
    width: 100%;
    top: 0;
    left: 0;
    z-index: 10;
    box-sizing: border-box;
    display: -webkit-box;
    color: #242424;
    padding: 0;
    height: 46px;
    line-height: 46px;
    background: #fff;
  }

  .fang-revert .mint-cell-wrapper {
    background-image: none;
  }

  .banner-ctrl .back.padding-left-16 {
    padding-left: 16px;
  }

  .banner-ctrl a {
    color: #242424;
    font-size: 16px;
    display: block;
    min-width: 44px;
    height: 100%;
    position: relative;
    box-sizing: border-box;
    width: 30%;
    z-index: 2;
    line-height: 49px;
  }

  .banner-ctrl .fr {
    position: absolute;
    right: 0;
    top: 0;
    text-align: right;
    padding-right: 16px;
  }

  .banner-ctrl .fr {
    color: #242424;
  }

  .banner-ctrl .fr.disabled {
    color: #c9c9c9;
  }

  .comment-list,
  .comment-list-item {
    font-size: 10px;
    line-height: 11px;
  }

  .comment-list-item {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    position: relative;
    margin-bottom: 0;
  }

  .comment-list-item {
    padding: 16px;
  }

  .comment-list-item .mod-avatar {
    -webkit-box-flex: 0;
    -webkit-flex: none;
    -ms-flex: none;
    flex: none;
  }

  .comment-list-item .avatar,
  .comment-list-item .mod-avatar {
    display: block;
    position: relative;
    -webkit-box-flex: 0;
    -webkit-flex: none;
    -ms-flex: none;
    flex: none;
    border-radius: 100%;
  }

  .comment-list-item .avatar,
  .comment-list-item .mod-avatar {
    width: 32px;
    height: 32px;
    margin-right: 8px;
  }

  .comment-list-item .mod-avatar {
    font-size: 12px;
    line-height: 16px;
  }

  .mod-avatar {
    display: inline-block;
    height: 32px;
    width: 32px;
    border-radius: 50%;
  }

  .comment-list-item .avatar .G-img-wrap,
  .comment-list-item .avatar img,
  .comment-list-item .mod-avatar .G-img-wrap,
  .comment-list-item .mod-avatar img {
    position: absolute;
    border-radius: inherit;
    width: 100%;
    height: 100%;
  }

  .comment-list-item .avatar .G-img-wrap,
  .comment-list-item .avatar img,
  .comment-list-item .mod-avatar .G-img-wrap,
  .comment-list-item .mod-avatar img {
    position: absolute;
    border-radius: inherit;
    width: 100%;
    height: 100%;
  }

  .comment-list-item .avatar .G-img-wrap,
  .comment-list-item .avatar img,
  .comment-list-item .mod-avatar .G-img-wrap,
  .comment-list-item .mod-avatar img {
    position: absolute;
    border-radius: inherit;
    width: 100%;
    height: 100%;
    display: inline-block;
    z-index: 2;
  }

  .comment-list .comment-list-item .content {
    overflow: inherit!important;
  }

  .comment-list-item .content {
    position: relative;
    -webkit-box-flex: 1;
    -webkit-flex: auto;
    -ms-flex: auto;
    flex: auto;
    min-width: 0;
  }

  .comment-list-item .content {
    padding-top: 2px;
  }

  .comment-list-item .content .content-info {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }

  .comment-list-item .content .content-info-text {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1 1 0%;
    width: 1%;
  }

  .comment-list-item .content .content-info-text {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1 1 0%;
    width: 1%;
  }

  .comment-list-item .content .content-info .name-box {
    padding-bottom: 2px;
    margin-right: 10.67px;
  }

  .comment-list-item .content .content-info .name-box .name {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    max-width: 11em;
  }

  .article-comment .comment-list-item .content .content-info .content-info-text .name-box .name+span,
  .comment-list-item .content .content-info .content-info-text .name-box .name+span {
    display: inherit;
  }

  .comment-list-item .content .content-info .name-box::after,
  .comment-list-item .content .content-info .options ul::after {
    display: block;
    clear: both;
    visibility: hidden;
    height: 0;
    font-size: 0;
    content: ' ';
  }

  .comment-list-item .content .content-info .name-desc,
  .comment-list-item .content-main div.blockquote h1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .comment-list-item .content .content-info .name-desc .desc {
    display: inline-block;
    line-height: 16px;
    margin-right: 8px;
  }

  .comment-list-item .content-main {
    padding-top: 8px;
  }

  .comment-list-item .content-main,
  .comment-list-item .content-main div.blockquote h1 {
    color: #242424;
  }

  .comment-list-item .content-main .content-detail,
  .comment-list-item .content-main .txt {
    line-height: 1.5;
    word-break: break-all;
    word-wrap: break-word;
    font-size: 160%;
  }

  .comment-list-item::after {
    content: '';
    position: absolute;
    height: 1px;
    bottom: 0;
    -webkit-transform: scaleY(.5);
    -ms-transform: scaleY(.5);
    transform: scaleY(.5);
    -webkit-transform-origin: 0 100%;
    -ms-transform-origin: 0 100%;
    transform-origin: 0 100%;
    pointer-events: none;
  }

  .comment-list-item::after {
    left: 16px;
    right: 16px;
  }

  .mod-comment .comment-list-item .content .content-info .operation .G-ico-collection,
  .mod-comment .comment-list-item .content .content-info .operation .comment-operate,
  .mod-comment .comment-list-item .content .content-info .operation .ico-collection,
  .mod-comment .comment-list-item .content .content-info .prise .G-ico-collection,
  .mod-comment .comment-list-item .content .content-info .prise .comment-operate,
  .mod-comment .comment-list-item .content .content-info .prise .ico-collection {
    position: relative;
  }

  .mod-comment .comment-list-item .content .content-info .operation .G-ico,
  .mod-comment .comment-list-item .content .content-info .prise .G-ico {
    position: relative;
    vertical-align: top;
    font-size: 280%;
  }

  .G-ico-collection:before {
    content: "\00C5";
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
</style>