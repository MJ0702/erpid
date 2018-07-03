<template>
<div class="saler-assistant-search">
  <mt-header title="选择助理" fixed>
    <!-- <router-link to="/saler-assistant-search" @click.native="$router.go(-1)" slot="left">
      <mt-button icon="back">返回</mt-button>
    </router-link> -->
    <a @click="$router.go(-1)" slot="left">
      <mt-button icon="back">返回</mt-button>
    </a>
    <!-- <mt-button slot="right" @click.native="$router.go(-1)">取消</mt-button> -->
  </mt-header>
  <div style="height:40px"></div>

  <my-search placeholder="搜索" v-model="keyword" cancel-text="取消" @cancel="$router.go(-1)" autofocus show>
    <a class="mint-searchbar-cancel" @click="toClean" slot="extra">清除</a>
    <mt-cell
      :title="assistant.userName"
      @click.native="chooseAssistant(assistant)"
      v-for="assistant in assistants">
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
      timeout: null,
    }
  },
  mounted() {
  },
  computed: {
    assistants() {
      return this.$store.getters["order/saler/assistants"];
    },
  },
  methods: {
    chooseAssistant(assistant) {
      this.$store.dispatch("order/saler/assistant_select", assistant);
      this.$router.go(-1);
    },
    toClean() {
      this.$store.dispatch("order/saler/assistant_clear");
      Toast("销售助理信息已清除");
    },
  },
  watch: {
    keyword(val) {
      if (val) {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          this.$store.dispatch("order/saler/assistants_search", val);
        }, 280)
      }
    }
  }
}
</script>

<style>
.saler-assistant-search {
  height: auto;
}
/*.saler-assistant-search .mint-indexsection-index {
  background-color: var(--background-color)
}*/
.saler-assistant-search .with-mobile .mint-cell-title img {
  float: left;
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
.saler-assistant-search .mint-cell-title img {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
.saler-assistant-search .mint-cell-value img {
  width: 24px;
  height: 24px;
}
.saler-assistant-search .mint-searchbar-core {
  width: 100%;
}
</style>
