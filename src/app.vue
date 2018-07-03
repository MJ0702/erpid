<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Toast } from "mint-ui";
  import iconfont from './lib/iconfont.js'
  // import './lib/pinyin.js'

  export default {
    name: 'app',
    data() {
      return {
      }
    },
    created() {
      //在根组件注册对 http 请求的拦截，进行全局处理
      let loginCount = 0;
      let limitCount = 3;
      let requestMine = true;
      let vm = this;
      Vue.http.interceptors.push((req, next) => {
        if (Params.isObject(req.body) || isArray(req.body)) {
          if (req.emulateJSON) {
            req.body = Params(req.body);
            let pct = req.headers.get("Content-Type");
            let cct = 'application/x-www-form-urlencoded;charset=UTF-8';
            cct = pct ? pct + ';' + cct : cct;
            req.headers.set('Content-Type', cct);
          } else {
            req.body = JSON.stringify(req.body);
          }
        }

        if (['order/order-bill-list', 'receipt', 'order/detail', 'order/order-name-list', 'attachment'].includes(req.url)) {
          setTimeout(() => {
            _next();
          }, 800)
        } else {
          _next();
        }

        function _next() {
          next((res) => {
            let text = {};     //出错参数
            text.status = res.status;
            text.str = res.body || '';
            if (['/sys/service/util/ocrRecognize/recognizeSum'].includes(req.url)) {
              res.body.sign = true;
            }
            if (Params.isObject(res.body) && Object.keys(res.body).includes('private_test') && !res.body.private_test) {
              let obj = {};
              obj.errorMsg = res.body;
              vm.toBad("permission", obj);
              return res;
            }
            console.log("res.status: " + res.status);
            if ([0, 401].includes(res.status)) {
              //若发生失败 则先自动登录，若还有问题，则弹出提示
              if (loginCount < limitCount) {
                loginCount++;
                vm.$store.dispatch("mine/mine_login").then(status => {
                  if (status) {
                    //登录成功重新发出 route 导航
                    let r = vm.$route;
                    vm.$router.replace({ name: r.name, params: r.params, query: r.query });
                    setTimeout(() => {
                      //已经登录成功，三秒内若还出现401则是cookie或服务器问题，则三秒后才可以再重试
                      loginCount = 0;
                    }, 3000)
                  } else {
                    //登陆失败，转到404页面
                    if (loginCount >= limitCount) {
                      if (process.env.NODE_ENV === 'production') {
                        // window.location.replace('404.html');
                        vm.unknowFn(text);
                        vm.toBad("errored", res.body);
                        res.body = null;
                      }
                    }
                  }
                })
              } else {
                //超过尝试登陆次数限制，转到404页面
                if (process.env.NODE_ENV !== 'development') {
                  // window.location.replace('404.html');
                  vm.unknowFn(text);
                  vm.toBad("errored", res.body);
                  res.body = null;
                }
              }
            } else if (res.status == 200 && res.body.executeStatus == 1 && res.body.code == "10000") {
              //状态不为 401,200 有 code 为 10000 代表权限问题，跳转到权限页面
              vm.unknowFn(text);
              vm.toBad("permission", res.body);
              res.body = null;
            } else if (res.status == 200 && res.body.executeStatus == 1) {
              //登录失败 重新登录
              if (res.body.code == "10008") {
                setTimeout(() => {
                  Vue.http.get(
                    '/sys/api/pub_m/relogin-url',
                  ).then(res => {
                    // window.location.href = res.body;
                  })
                  //window.location.href = "http://v3.op110.com.cn/sys/m/checklogin";
                }, 3000)
              }
              vm.unknowFn(text);
              if(req.url != '/sys/service/util/ocrRecognize/recognizeSum'){
                vm.toBad("errored", res.body);
              }
              res.body = null;
            } else if (res.status != 200) {
              //状态不为 401,200 则有可能是服务器错误等情况，弹出提示
              if (res.status == 500) {
                Toast('操作失败');
                text.str = res.body.slice(0, 1000);
              }
              vm.unknowFn(text);
              vm.toBad("errored", res.body);
              res.body = null;
            }

            if (res.body && (typeof res.body == "string") && res.body.includes("<!DOCTYPE html>")) {
              //返回了页面，将内容置空
              text.str = res.body.slice(0, 1000);
              vm.unknowFn(text);
              vm.toBad("errored", res.body);
              res.body = null;
            }
            return res
          })
        }
      })

      //打开应用时，判断用户信息是否存在，若不存在则获取用户信息
      let mine = this.$store.getters["mine/mine"];
      if (!mine || !mine.ID) { this.$store.dispatch("mine/mine_request") }
    },
    methods: {
      toBad(view, body) {
        if (view && body) {
          if (!body.errorCode || !body.errorMsg) {
            Vue.http.get(
              '/sys/api/pub_m/error',
            ).then(res => {
            })
          }
          setTimeout(() => {
            this.$router.replace({
              name: view, params: {
                errorCode: body.errorCode,
                errorMsg: body.errorMsg,
                sysName: body.sysName,
                domain: body.domain,
                sign: body.sign || false,
              }
            })
          }, 0); //使请求流程走完，再进行页面跳转
        }
      },
      unknowFn(arg) {
        let text = {};
        let mine = this.$store.getters["mine/mine"];
        if (Params.isObject(mine) && mine.wx_user_openid) {
          text.wx_user_openid = mine.wx_user_openid;
        }
        if (Params.isObject(arg)) {
          text.status = arg.status;
          text.str = arg.str
        }
        text = JSON.stringify(text);
        Vue.http.post(
          '/sys/api/pub_m/monitoring',
          { text },
          { emulateJSON: true }
        ).then(res => {
          return;
        })
      },
    },
  }

</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
  }

   :root {
    --background-color: #EFEFF4;
  }

  html,
  body {
    margin: 0;
    height: 100%;
    background-color: var(--background-color);
  }

  .router-link {
    text-decoration: none;
    color: inherit;
  }

  details summary::-webkit-details-marker {
    display: none;
  }

  .page-infinite-loading {
    text-align: center;
    display: block;
  }

  .page-infinite-loading>span>div {
    margin: 0 auto;
  }

  .page-infinite-loading-no {
    display: none;
  }

  .loadmore-end {
    color: #888;
    text-align: center;
    display: block;
    font-size: 0.8em;
    margin: 12px 0px;
  }

  .loadmore-end-no {
    display: none;
  }

  .mint-header-title {
    line-height: 16px;
  }

  .mint-cell {
    margin-top: -1px;
  }

  .mint-cell.require-field .mint-cell-title {
    color: red;
  }

  .mint-cell.input-right .mint-cell-value input {
    text-align: right;
  }

  .mint-toast {
    z-index: 2100;
  }

  .my-cell-swipe .mint-cell-value {
    width: 70%;
  }

  .my-cell-swipe .mint-cell-value>p {
    width: 100%;
    text-align: right;
  }

  .my-popup {
    width: 100%;
  }

  .my-popup-right {
    width: 100%;
    height: 100%;
    overflow: scroll;
    background-color: var(--background-color);
  }

  .checklist-beauty .mint-checklist-title {
    margin: -1px;
  }

  .input-text-right .mint-cell-value input.mint-field-core {
    text-align: right;
  }

  .weui-uploader .weui-uploader_tmpl1__bd {
    height: 200px;
  }

  .box-uploader {
    background: #fff;
    padding: 10px 20px;
    overflow: hidden;
  }

  .box-no-data {
    text-align: center;
    line-height: 40px;
    color: #888;
    font-size: 14px;
  }

  .arrow-right::after {
    border: solid 2px #c8c8cd;
    border-bottom-width: 0;
    border-left-width: 0;
    content: " ";
    top: 50%;
    right: 20px;
    position: absolute;
    width: 5px;
    height: 5px;
    -webkit-transform: translateY(-50%) rotate(45deg);
    transform: translateY(-50%) rotate(45deg);
  }

  .my-block+.mint-cell .mint-cell-wrapper {
    background-origin: border-box;
  }

  .red-dot {
    height: 8px;
    width: 8px;
    border-radius: 100%;
    background-color: #f44336;
  }

  .box-small-circle {
    padding: 0 4px;
    border-radius: 3px;
    font-size: 10px;
    margin: 0 2px;
    display: inline-block;
    border: 1px solid rgb(0, 153, 255);
    color: rgb(0, 153, 255);
    line-height: initial;
    vertical-align: middle;
  }
  .box-small-circle.no-normal {
    color:grey;
    border-color:grey;
  }
</style>