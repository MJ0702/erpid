<template>
<div>
  <mt-header title="通讯录" fixed>
    <router-link to="/" slot="left">
      <mt-button icon="back">返回</mt-button>
    </router-link>
  </mt-header>
  <div style="height:40px"></div>

  <my-search placeholder="搜索" cancel-text="" @click.native="toSearch" class="contact-list-search"></my-search>
  <mt-index-list class="contact-list-index" v-if="contacts.length>0">
    <mt-index-section :index="contact.index" v-for="contact in contacts">
      <mt-cell :title="item.trueName" :class="item.mobile ? 'with-mobile':''" :label="item.mobile" v-for="item in contact.items" @click.native="showUser(item)">
        <img slot="icon" :src="item.avatar" v-if="item.avatar">
        <img slot="icon" :src="item.headimgurl" v-else-if="item.headimgurl">
        <img slot="icon" src="~assets/mine-tab.png" v-else>
        <a :href="'tel:'+item.mobile" v-on:click.stop v-if="item.mobile">
          <!-- 'tel:'+item.mobile+'#mp.weixin.qq.com' -->
          <img src="~assets/contact-call.png">
        </a>
      </mt-cell>
    </mt-index-section>
    <my-pad></my-pad>
  </mt-index-list>
  <my-navigate-tab selected="contact"></my-navigate-tab>
</div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    contacts() {
      return this.$store.getters["contact/contacts"];
    }
  },
  created(){
    this.$store.dispatch("contact/contacts_clear");
  },
  mounted() {
    this.$store.dispatch("contact/contacts_request");
  },
  methods: {
    toSearch() {
      this.$router.push({ path: "/contact-search" });
    },
    showUser(user) {
      this.$store.dispatch("contact/contact_select", user);
      this.$router.push({ path: "/contact" });
    }
  }
}
</script>

<style>
.contact-list-search {
  height: auto;
}
.contact-list-index {
  padding-top: 52px;
}
.contact-list-index .mint-indexsection-index{
  padding: 4px;
  padding-left: 8px;
}
.contact-list-index .with-mobile .mint-cell-title img {
  float: left;
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
.contact-list-index .mint-cell-title img {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
.contact-list-index .mint-cell-value img {
  width: 24px;
  height: 24px;
}
</style>
