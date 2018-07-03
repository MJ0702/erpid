<template>
  <!-- 我的 -->
  <div>
    <mt-header :title="user.trueName+'详情'" fixed>
      <router-link to="/contact-list" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div style="height:40px"></div>

    <my-user-info :user="user"></my-user-info>
  </div>
</template>

<script>
  import UserInfo from "../commons/user-info.vue"

  export default {
    data () {
      return {
      }
    },
    computed: {
      user() {
        return this.$store.getters["contact/contact"];
      }
    },
    components: {
      "my-user-info": UserInfo,
    }
  }
</script>

<style>
</style>
