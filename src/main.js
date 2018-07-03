import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app.vue';
import routes from './routes.js';
import store from './store';
import filter from './filter.js';
import vueComponents from './components'; //与业务无关的组件
import vueCommons from './views/commons'; //与业务有关，被多个页面使用的组件
// import { ConfigPlugin, DatetimePlugin } from 'vux'

import { MessageBox, Toast } from 'mint-ui'

/**
 * tgapp tour-guide 导游报账项目
 */
import Tgapp from './tgapp/app.vue';
import tgappRoutes from './tgapp/routes.js';
import tgappStore from './tgapp/store';
import tgappComponents from './tgapp/components';

// tgappComponents(Vue);
// Vue.use(DatetimePlugin)
// Vue.use(ConfigPlugin, {
//   $layout: 'VIEW_BOX' // global config for VUX, since v2.6.0
// })
vueComponents(Vue);
vueCommons(Vue);
filter(Vue);

Vue.http.options.root = '/sys/api/1.0.0';
console.log(process.env);
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

const router = new VueRouter({
  history: true,
  // mode: 'history',
  routes,
  // scrollBehavior(to, from, savedPosition) {//只有在history模式下才能使用
  //   if (savedPosition) {
  //     return savedPosition
  //   } else {
  //    const position = {}
  //    if (to.hash) {position.selector = to.hash}
  //    if (to.matched.some(m => m.meta.scrollToTop)) {position.x = 0;position.y = 0}
  //    return position
  //   }
  // }
});

// const tgappRouter = new VueRouter({
//   history: true,
//   routes:tgappRoutes,
// });


router.beforeEach((to, from, next) => {
  // console.log(to);
  // console.log(from);
  //从主页到团期搜索，第一次导航到团期搜索
  //若从团期搜索到了团期列表页，则以后再进入团期，直接进入团期列表
  if (["home", "me", "order-list", "line-plan"].includes(from.name) && to.name == "plan-search" && !to.meta.onceIn) {
    if (to.params.enforce) {
      next(); return;
    } else {
      next({ name: "line-plan", query: to.query, params: to.params });
      return;
    }
  } else if (from.name == "plan-search" && to.name == "line-plan") {
    from.meta.onceIn = false;
  }
  //进入下个页面前，先记录当前页面的滚动条，保存在 meta 中，下次再导航到此页面时，滚动条滚动到上次保存的位置
  let { scrollTop, scrollLeft } = document.body;
  from.meta.scrollTo = { x: scrollLeft, y: scrollTop };
  if (to.meta.scrollToTop && !to.meta.scrollTo) {
    if (toString.call(to.meta.scrollToTop) == "[object Boolean]") {
      to.meta.scrollTo = { x: 0, y: 0 }
      scroll(0, 0)
    } else if (toString.call(to.meta.scrollToTop) == "[object Array]") {
      if (to.meta.scrollToTop.includes(from.name)) {
        to.meta.scrollTo = { x: 0, y: 0 }
        scroll(0, 0)
      }
    } else {
      console.error("meta scrollToTop wrong config type");
    }
  } else if (to.meta.scrollTo) {
    //没有配置 scrollToTop，则导航到上次记录的位置
    let { x, y } = to.meta.scrollTo;
    setTimeout(() => {
      scroll(x || 0, y || 0);
    });
  }

  next();
})

//使在数据绑定语法中可以直接使用全局方法,如 :value="DateFmt(...)" {{NumFmt(...)}}
Vue.prototype.NumFmt = NumFmt;
Vue.prototype.DateFmt = DateFmt;

Vue.prototype.PermitCheck = function (key, showMsg) { //在所有组件中可以使用的权限校验方法
  if (key && this instanceof Vue) {
    let permit = store.getters["sys/permit"];
    if (permit && Object.keys(permit).length > 0) {
      let p = permit[key];
      if (p && p.permit) {
        return true
      } else {
        if (showMsg) {
          Toast("您没有此 " + p.text + " 功能的操作权限");
        }
      }
    }
    return false;
  }
};
// const routerIndexHash = window.location.hash
// if(routerIndexHash.indexOf('tgapp')>-1){
//   new Vue({
//     el: '#app',
//     render: h => h(Tgapp),
//     store:tgappStore,
//     router:tgappRouter,
//   })
// }else{
  new Vue({
    el: '#app',
    render: h => h(App),
    store,
    router,
  })
// }



//http://xgfe.github.io/2016/12/22/zhouxiong/Vue2.0+Vue-router2.0+Vuex2.0/
