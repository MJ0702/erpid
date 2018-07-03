import Vue from 'vue';
import VueRouter from 'vue-router';
import { MessageBox, Toast } from 'mint-ui'

/**
 * tgapp tour-guide 导游报账项目
 */
import Tgapp from './app.vue';
import tgappRoutes from './routes.js';
import tgappStore from './store';
import tgappComponents from './components';

tgappComponents(Vue);

Vue.http.options.root = '/sys/api/guide_m';

if (process.env.APP_HOST) {
  Vue.http.options.root = process.env.APP_HOST + Vue.http.options.root
}

if (process.env.NODE_ENV === 'production') {
  //修改控制台输出
  let log = console.log;
  console.log = function () {
    let iforce = arguments;
    if (arguments && arguments[arguments.length - 1] === true) {
      let slicedArgs = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
      log.apply(null, slicedArgs);
    }
  };
}

const tgappRouter = new VueRouter({
  history: true,
  routes:tgappRoutes,
});


//使在数据绑定语法中可以直接使用全局方法,如 :value="DateFmt(...)" {{NumFmt(...)}}
Vue.prototype.NumFmt = NumFmt;
Vue.prototype.DateFmt = DateFmt;

new Vue({
  el: '#app',
  render: h => h(Tgapp),
  store:tgappStore,
  router:tgappRouter,
})




//http://xgfe.github.io/2016/12/22/zhouxiong/Vue2.0+Vue-router2.0+Vuex2.0/
