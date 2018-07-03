<template>
<div class="customer-search">
  <mt-header title="客户联系人" fixed>
    <a @click="$router.go(-1)" slot="left">
      <mt-button icon="back">返回</mt-button>
    </a>
    <mt-button slot="right" v-show="PermitCheck('cust-user/user-insert')" @click.native="addCustomer">添加</mt-button>
  </mt-header>
  <div style="height:40px"></div>

  <my-search placeholder="搜索" v-model="keyword" cancel-text="取消" show
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="loading"
    infinite-scroll-distance="10" class="page-infinite-list"
  >
    <mt-cell
      @click.native="chooseCustomer(item)"
      v-for="item in customers">
      <div slot="title">
        <span class="mint-cell-text" >
          <span>{{item.trueName}}</span>
          <span>{{item.mobile}}</span>
        </span>
        <span class="mint-cell-label">{{item.cpyName}}</span>
      </div>
      <a :href="'tel:'+item.mobile" v-on:click.stop v-if="item.mobile">
        <img src="~assets/contact-call.png">
      </a>
    </mt-cell>
    <p :class="'page-infinite-loading'+(loadEnd?'-no':'')">
      <mt-spinner type="fading-circle"></mt-spinner>
      加载中...
    </p>
    <div :class="'loadmore-end'+((showEnd&&loadEnd)?'':'-no')">我是有底线的</div>
    <my-pad></my-pad>
  </my-search>
  <my-navigate-tab selected="customer"></my-navigate-tab>
</div>
</template>

<script>
import { MessageBox, Toast } from 'mint-ui';

export default {
  data () {
    return {
      keyword: "",
      perword: "",
      timeout: null,
      showEnd: false,
      loadEnd: true,
    }
  },
  created(){
    if (this.customers.length<=0) {
      this.loadMore();
    }
  },
  mounted() {
  },
  computed: {
    customers() {
      return this.$store.getters["customer/customers_search"];
    },
  },
  methods: {
    chooseCustomer(customer) {
      this.$store.dispatch("customer/customer_select", customer);
      this.$router.push({ name: "customer-info" });
    },
    addCustomer() {
      this.$router.push({ name: "customer-add" });
    },
    loadMore() {
      if(this.loadEnd&&!this.showEnd) {
        this.loadEnd = !this.loadEnd;
        this.$store.dispatch("customer/customers_search", this.keyword).then(end => {
          //由于加了底部导航条，会出现两层导航条，search的和body的，导致无限加载组件对scroll位置判断存在偏差
          //因此在每次获取完数据后，将body层滚动条滚动到顶部，使下次可以继续触发加载
          scroll(0,0);
          this.showEnd = end
          this.loadEnd = !this.loadEnd;
        });
      }
    }
  },
  watch: {
    keyword(val) {
      if (this.loadEnd) {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          this.loadEnd = !this.loadEnd;
          this.$store.dispatch("customer/customers_search", val||"").then(end=>{
            this.showEnd = end
            this.loadEnd = !this.loadEnd;
          })
          // if (this.$store.getters["order/customer/search_customers"].length < 1) {
          //   MessageBox.confirm('点击确定添加新销售').then(action => {
          //     this.$router.replace({ path: "/customer-add" });
          //   });
          // }
        }, 280)
      }
    }
  }
}
</script>

<style>
.customer-search {
  height: auto;
}

.customer-search .with-mobile .mint-cell-title img {
  float: left;
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
.customer-search .mint-cell-title img {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
.customer-search .mint-cell-title .mint-cell-text span:nth-child(2) {
  color: #888;
  font-size: 12px;
}
.customer-search .mint-cell-value img {
  width: 24px;
  height: 24px;
}
.customer-search .mint-searchbar-core {
  width: 100%;
}
.customer-search .my-search .mint-search-list {
  position: fixed;
}
</style>
