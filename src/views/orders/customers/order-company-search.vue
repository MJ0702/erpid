<template>
  <div class="order-company-search">
    <mt-header title="选择客户公司" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
      <!-- <mt-button slot="right" @click="$router.go(-1)">取消</mt-button> -->
    </mt-header>
    <div style="height:40px"></div>

    <my-search placeholder="搜索" v-model="keyword" cancel-text="取消" @cancel="$router.go(-1)" autofocus show>
      <a class="mint-searchbar-cancel" @click="toClean" slot="extra">清除</a>
      <mt-cell :title="item.simName" @click.native="chooseCompany(item)" v-for="item in companys">
      </mt-cell>
    </my-search>
  </div>
</template>

<script>
  import { Toast } from "mint-ui"

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
    mounted() {
    },
    computed: {
      companys() {
        return this.$store.getters["order/customer/companys_search"];
      },
    },
    methods: {
      chooseCompany(company) {
        this.$store.dispatch("order/customer/company_select", company);
        this.$router.replace({ path: "/order-customer-search" });
      },
      toClean() {
        this.$store.dispatch("order/customer/customer_clear");
        Toast("客户信息已清除");
      },
    },
    watch: {
      keyword(val) {
        if (val && (val != this.perword)) {
          this.perword = val;
          if (this.timeout) {
            clearTimeout(this.timeout)
          }
          this.timeout = setTimeout(() => {
            this.$store.dispatch("order/customer/companys_search", val);
          }, 280)
        }
      }
    }
  }

</script>

<style>
  .order-company-search {
    height: auto;
  }
  /*.order-company-search .mint-indexsection-index {
  background-color: var(--background-color)
}*/
  
  .order-company-search .with-mobile .mint-cell-title img {
    float: left;
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }
  
  .order-company-search .mint-cell-title img {
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }
  
  .order-company-search .mint-cell-value img {
    width: 24px;
    height: 24px;
  }
  
  .order-company-search .mint-searchbar-core {
    width: 100%;
  }
  
  .order-company-search .my-search .mint-search-list {
    position: fixed;
  }
</style>