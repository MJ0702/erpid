<template>
<div class="receipt-customer-search">
  <mt-header title="选择客户联系人" fixed>
    <a @click="goBack" slot="left">
      <mt-button icon="back">返回</mt-button>
    </a>
  </mt-header>
  <div style="height:40px"></div>

  <my-search placeholder="搜索" v-model="keyword" cancel-text="取消" @cancel="goBack" autofocus show
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="loading"
    infinite-scroll-distance="10" class="page-infinite-list"
  >
    <mt-cell
      :title="item.trueName"
      @click.native="chooseItem(item)"
      :label="item.mobile"
      :value="item.simName||''"
      v-for="item in customers">
    </mt-cell>
    <div :class="'loadmore-end'+((showEnd&&loadEnd)?'':'-no')">我是有底线的</div>
  </my-search>
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
    this.$store.dispatch("money/receipt/receipt_customers_search", "");
  },
  mounted() {
  },
  computed: {
    customers() {
      return this.$store.getters["money/receipt/receipt_customers_search"];
    },
  },
  methods: {
    goBack() {
      let params = this.$route.params;
      this.$router.replace({name: "money-receipt-input", params})
    },
    chooseItem(customer) {
      let params = this.$route.params;
      if(customer) {
        params.customer = customer;
      }
      this.$router.replace({name: "money-receipt-input", params})
    },
    loadMore() {
      if(this.loadEnd&&!this.showEnd) {
        this.loadEnd = !this.loadEnd;
        this.$store.dispatch("money/receipt/receipt_customers_search", this.keyword).then(end => {
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
          this.$store.dispatch("money/receipt/receipt_customers_search", val).then(end=>{
            this.showEnd = end
            this.loadEnd = !this.loadEnd;
          })
        }, 280)
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if(to.name!="money-receipt-input") {
      let params = this.$route.params;
      next({name: "money-receipt-input", params});
    } else {
      next();
    }
  }
}
</script>

<style>
.receipt-customer-search {
  height: auto;
}
/*.receipt-customer-search .mint-indexsection-index {
  background-color: var(--background-color)
}*/
.receipt-customer-search .with-mobile .mint-cell-title img {
  float: left;
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
.receipt-customer-search .mint-cell-title img {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
.receipt-customer-search .mint-cell-value img {
  width: 24px;
  height: 24px;
}
.receipt-customer-search .mint-searchbar-core {
  width: 100%;
}
.receipt-customer-search .my-search .mint-search-list {
  position: fixed;
}
</style>
