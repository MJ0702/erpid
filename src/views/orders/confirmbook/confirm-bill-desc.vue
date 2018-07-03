<template>
  <!-- 账单备注 -->
  <div>
    <mt-header title="账单备注" fixed>
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
    <mt-checklist v-model="confirm_search_query.billDiscs" :options="types" @change="billDiscsChange">

    </mt-checklist>
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
      let order_id = this.$store.getters["order/order_id"];
      this.$store.dispatch('order/confirmbook/bill_desc_request', order_id);
    },
    computed: {
      types() {
        return this.$store.getters["order/confirmbook/bill_desc"];
      },
      typeSlect() {
        return this.$store.getters["order/confirmbook/bill_desc_select"];
      },
      confirm_search_query() {
        return this.$store.getters["order/confirmbook/confirm_search_query"];
      }
    },
    methods: {
      typeClick(type) {
        this.$store.dispatch("order/confirmbook/bill_desc_select", type);
        this.$router.go(-1);
      },
      billDiscsChange(val) {
        let billDisc = "", billDiscID = "";
        billDisc = val.map(v => v.slice(v.indexOf(",") + 1, v.length)).toString();
        billDiscID = val.map(v => v.slice(0, v.indexOf(","))).toString();
        this.confirm_search_query.billDiscID = billDiscID;
        // this.typeSlect = billDisc;
        this.$store.dispatch("order/confirmbook/bill_desc_select", billDisc);
      },
    },
    components: {

    }
  }

</script>

<style>

</style>