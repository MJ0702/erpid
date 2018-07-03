<template>
<div class="contact-search">
  <mt-header title="通讯录搜索" fixed>
    <router-link to="/contact-list" slot="left">
      <mt-button icon="back">返回</mt-button>
    </router-link>
  </mt-header>
  <div style="height:40px"></div>

  <my-search placeholder="搜索" v-model="keyword" cancel-text="取消" @cancel="toCancel" autofocus show fixed>
    <mt-cell :title="item.trueName" :class="item.mobile ? 'with-mobile':''" :label="item.mobile" v-for="item in contacts" @click.native="showUser(item)">
      <img slot="icon" :src="item.avatar" v-if="item.avatar">
      <img slot="icon" :src="item.headimgurl" v-else-if="item.headimgurl">
      <img slot="icon" src="~assets/mine-tab.png" v-else>
      <a :href="'tel:'+item.mobile" v-on:click.stop v-if="item.mobile">
        <!-- 'tel:'+item.mobile+'#mp.weixin.qq.com' -->
        <img src="~assets/contact-call.png">
      </a>
    </mt-cell>
  </my-search>
</div>
</template>

<script>
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
    contacts() {
      return this.$store.getters["contact/contacts_search"];
    }
  },
  methods: {
    showUser(user) {
      this.$store.dispatch("contact/contact_select", user);
      this.$router.push({ path: "/contact" });
    },
    toCancel() {
      this.$router.replace({ path: "/contact-list" });
    }
  },
  watch: {
    keyword(val) {
      if (val) {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          this.$store.dispatch("contact/contacts_search", val);
        }, 280)
      }
    }
  }
}
</script>

<style>
.contact-search {
  height: auto;
}

/*.contact-search .mint-indexsection-index {
  background-color: var(--background-color)
}*/
.contact-search .with-mobile .mint-cell-title img {
  float: left;
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
.contact-search .mint-cell-title img {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
.contact-search .mint-cell-value img {
  width: 24px;
  height: 24px;
}
.contact-search .mint-searchbar-core {
  width: 100%;
}
</style>
