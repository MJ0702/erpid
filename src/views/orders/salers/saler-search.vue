<template>
<div class="saler-search">
  <mt-header title="选择销售" fixed>
    <!-- <router-link to="/saler-info" slot="left" replace>
      <mt-button icon="back">返回</mt-button>
    </router-link> -->
    <a @click="$router.go(-1)" slot="left">
      <mt-button icon="back">返回</mt-button>
    </a>
    <!-- <mt-button slot="right" @click="$router.replace({path: '/saler-info'})">取消</mt-button> -->
  </mt-header>
  <div style="height:40px"></div>

  <my-search placeholder="搜索" v-model="keyword" cancel-text="取消" @cancel="toCancel"  autofocus show>
    <a class="mint-searchbar-cancel" @click="toClean" slot="extra">清除</a>
    <mt-cell
      :title="sale.userName"
      @click.native="chooseSale(sale)"
      v-for="sale in sales">
    </mt-cell>
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
    }
  },
  mounted() {
  },
  computed: {
    sales() {
      return this.$store.getters["order/saler/sales"];
    },
  },
  methods: {
    chooseSale(sale) {
      this.$store.dispatch("order/saler/sale_select", sale);
      // this.$router.replace({ path: "/saler-info" });
      this.$router.go(-1);
    },
    toCancel() {
      // this.$router.replace({ path: "/saler-info" });
      this.$router.go(-1);
    },
    toClean() {
      this.$store.dispatch("order/saler/sale_clear");
      Toast("销售信息已清除");
    },
  },
  watch: {
    keyword(val) {
      if (val) {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          this.$store.dispatch("order/saler/sales_search", val);
        }, 280)
      }
    }
  }
}
</script>

<style>
.saler-search {
  height: auto;
}
/*.saler-search .mint-indexsection-index {
  background-color: var(--background-color)
}*/
.saler-search .with-mobile .mint-cell-title img {
  float: left;
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
.saler-search .mint-cell-title img {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
.saler-search .mint-cell-value img {
  width: 24px;
  height: 24px;
}
.saler-search .mint-searchbar-core {
  width: 100%;
}
</style>
