<template>
  <!-- 收款账号 -->
  <div>
    <mt-header title="收款账号" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="blank" style="height:40px"></div>
    <!--
    -->
    <!--<my-radio :title="type.ID"
      v-for="type in types"
      @click.native="typeClick(type)"
      :checked="type.ID == typeSlect.ID"
    ></my-radio>-->
    <my-checklist v-model="confirm_search_query.baseAccounts" :options="types" @change="baseAccountsChange">
    </my-checklist>
    <my-button-block fixed>
      <mt-button type="primary" size="large" @click.native="$router.go(-1)">确定</mt-button>
    </my-button-block>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    created() {

    },
    computed: {
      types() {
        return this.$store.getters["order/confirmbook/base_account"];
      },
      confirm_search_query() {
        return this.$store.getters["order/confirmbook/confirm_search_query"];
      }
    },
    methods: {
      baseAccountsChange(val) {
        let baseAccount = "", baseAccountID = "";
        baseAccount = val.map(v => v.slice(v.indexOf(",") + 1, v.length)).toString();
        baseAccountID = val.map(v => v.slice(0, v.indexOf(","))).toString();
        this.confirm_search_query.baseAccountID = baseAccountID;
        this.$store.dispatch("order/confirmbook/base_account_select", baseAccount);
      },
    },
    components: {

    }
  }

</script>

<style>

</style>