<template>
  <my-error :errorCode="errorCode" :errorMsg="errorMsg" :sysName="sysName" :domain="domain"></my-error>
</template>

<script>
  import MyError from './commons/error.vue'

  export default {
    data() {
      return {
        errorCode: "",
        errorMsg: "",
        sysName: "",
        domain: "",
        sign: false,
      }
    },
    created() {
      let { errorCode, errorMsg, sysName, domain, sign } = this.$route.params;
      this.errorCode = errorCode || "操作失败";
      this.errorMsg = errorMsg || "操作有误或与服务器失去连接，请重试，若重复出现，请与同天下客户团队联系。";
      this.sysName = sysName;
      this.domain = domain;
      this.sign = sign || false;
    },
    methods: {
    },
    beforeRouteLeave(to, from, next) {
      //错误页面，不让返回，只能退出后重进
      if (this.sign) {
        next();
      } else {
        next(false);
      }

    },
    components: {
      "my-error": MyError,
    }
  }

</script>

<style>

</style>