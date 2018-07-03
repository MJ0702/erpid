<template>
<div class="order-customer-search">
  <mt-header title="选择客户联系人" fixed>
    <a @click="$router.go(-1)" slot="left">
      <mt-button icon="back">返回</mt-button>
    </a>
    <mt-button v-show="PermitCheck('341H7MG1QV9G')" slot="right" @click.native="addCustomer">添加</mt-button>
  </mt-header>
  <div style="height:40px"></div>

  <my-search placeholder="搜索" v-model="keyword" cancel-text="取消" @cancel="$router.go(-1)" autofocus show
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="loading"
    infinite-scroll-distance="10" class="page-infinite-list"
  >
    <a class="mint-searchbar-cancel" @click="toClean" slot="extra">清除</a>
    <mt-cell
      :title="item.trueName"
      @click.native="chooseCustomer(item)"
      :label="item.mobile"
      :value="item.simName||''"
      v-for="item in customers">
    </mt-cell>
    <div :class="'loadmore-end'+((showEnd&&loadEnd)?'':'-no')">我是有底线的</div>
  </my-search>
  <!-- <my-block></my-block>
  <my-button-block fixed>
    <mt-button type="primary" size="large" @click.native="addCustomer">添加客户联系人</mt-button>
  </my-button-block> -->
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
    if(this.company.cpyID) {
      this.$store.dispatch("order/customer/customers_search", "");
    }
  },
  mounted() {
  },
  computed: {
    planId() {
        return this.$store.getters["plan/plan_id"];
      },
    customers() {
      return this.$store.getters["order/customer/customers_search"];
    },
    company() {
      return this.$store.getters["order/customer/company"]
    }
  },
  methods: {
    toClean() {
      this.$store.dispatch("order/customer/customer_clear");
      Toast("客户信息已清除");
    },
    chooseCustomer(customer) {
      this.$store.dispatch("order/customer/customer_select", customer);
      // this.$router.go(-1);
      let planId=this.planId;
      this.$router.push({name: "order-place",query:{id:planId},params:{customer:true}});
    },
    addCustomer() {
      //如果未选择客户公司，则需要选择客户公司才能添加新客户联系人
      if (this.company.cpyID) {
        this.$router.replace({ path: "/order-customer-add" });
      } else {
        MessageBox.alert('请选择客户公司后添加客户联系人');
        // .then(action => {
        //   this.$router.push({ path: "/order-company-search" });
        // });
      }
    },
    loadMore() {
      if(this.loadEnd&&!this.showEnd) {
        this.loadEnd = !this.loadEnd;
        this.$store.dispatch("order/customer/customers_search", this.keyword).then(end => {
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
      if (val&&this.loadEnd) {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          this.loadEnd = !this.loadEnd;
          this.$store.dispatch("order/customer/customers_search", val).then(end=>{
            this.showEnd = end
            this.loadEnd = !this.loadEnd;
          })
          // if (this.$store.getters["order/customer/search_customers"].length < 1) {
          //   MessageBox.confirm('点击确定添加新销售').then(action => {
          //     this.$router.replace({ path: "/order-customer-add" });
          //   });
          // }
        }, 280)
      }
    }
  }
}
</script>

<style>
.order-customer-search {
  height: auto;
}
/*.order-customer-search .mint-indexsection-index {
  background-color: var(--background-color)
}*/
.order-customer-search .with-mobile .mint-cell-title img {
  float: left;
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
.order-customer-search .mint-cell-title img {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
.order-customer-search .mint-cell-value img {
  width: 24px;
  height: 24px;
}
.order-customer-search .mint-searchbar-core {
  width: 100%;
}
.order-customer-search .my-search .mint-search-list {
  position: fixed;
}
</style>
