<template>
  <div class="company-search">
    <mt-header title="客户公司" fixed>
      <a @click="$router.push('/')" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
      <mt-button slot="right" v-show="PermitCheck('cust-cpy/cpy-insert')" @click.native="$router.push('company-add')">添加</mt-button>
    </mt-header>
    <div style="height:40px"></div>

    <my-search placeholder="搜索" v-model="keyword" cancel-text="取消" show v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
      infinite-scroll-distance="10" class="page-infinite-list">
      <mt-cell :title="item.simName" @click.native="chooseCompany(item)" v-for="item in companys">
      </mt-cell>
      <p :class="'page-infinite-loading'+(loadEnd?'-no':'')">
        <mt-spinner type="fading-circle"></mt-spinner>
        加载中...
      </p>
      <div :class="'loadmore-end'+((showEnd&&loadEnd)?'':'-no')">我是有底线的</div>
      <my-pad></my-pad>
      <my-navigate-tab selected="company"></my-navigate-tab>
    </my-search>
  </div>
</template>

<script>
  import { Toast } from "mint-ui"
  import Vue from 'vue'

  export default {
    data() {
      return {
        keyword: "",
        perword: "",
        timeout: null,
        showEnd: false,
        loadEnd: true,
      }
    },
    created() {
      // if (this.companys.length <= 0) {
        this.$store.dispatch("customer/change_companys_search_page", 1);
        this.$store.dispatch("customer/companys_request_one", '');
        
      // }
    },
    computed: {
      companys() {
        return this.$store.getters["customer/companys"];
      },
    },
    methods: {
      chooseCompany(company) {
        this.$store.dispatch("customer/company", company);
        this.$router.push({ name: 'company-info', query: { id: company.ID }, params: { refresh: true } });
      },
      loadMore() {
        if (this.loadEnd && !this.showEnd) {
          this.loadEnd = false;
          setTimeout(() => {
            this.$store.dispatch("customer/companys_request", this.keyword).then(end => {
              //由于加了底部导航条，会出现两层导航条，search的和body的，导致无限加载组件对scroll位置判断存在偏差
              //因此在每次获取完数据后，将body层滚动条滚动到顶部，使下次可以继续触发加载
              scroll(0, 0);
              this.showEnd = end
              this.loadEnd = !this.loadEnd;
            });
          }, 100)

        }
      },
    },
    watch: {
      keyword(val) {
          // this.perword = val;
          if (this.timeout) {
            clearTimeout(this.timeout)
          }
          this.timeout = setTimeout(() => {
            this.$store.dispatch("customer/companys_request", val);
          }, 280)
        
      }
    }
  }

</script>

<style>
  .company-search {
    height: auto;
  }
  /*.company-search .mint-indexsection-index {
  background-color: var(--background-color)
}*/

  .company-search .with-mobile .mint-cell-title img {
    float: left;
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }

  .company-search .mint-searchbar-core {
    width: 100%;
  }

  .company-search .my-search .mint-search-list {
    position: fixed;
  }
</style>