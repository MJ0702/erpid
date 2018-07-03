<template>
  <!-- 交通信息 -->
  <div>
    <mt-header title="交通信息" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="blank" style="height:40px"></div>
    <!--
    -->
    <mt-checklist v-model="confirm_search_query.jiaotongs" :options="types" @change="jiaotongsChange">

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
      let planID=this.order.planID;
      this.$store.dispatch('order/confirmbook/jiaotong_request',planID);
    },
    computed: {
      confirm_search_query() {
        return this.$store.getters["order/confirmbook/confirm_search_query"];
      },
      types() {
        return this.$store.getters["order/confirmbook/jiaotong"];
      },
      order() {
        return this.$store.getters["order/order_select"]
      },
    },
    methods: {
      jiaotongsChange(val) {
        let jiaotong = "", jiaotongID = "";
        jiaotong = val.map(v => v.slice(v.indexOf(",") + 1, v.length)).toString();
        jiaotongID = val.map(v => v.slice(0, v.indexOf(","))).toString();
        this.confirm_search_query.jiaotongID = jiaotongID;
        this.$store.dispatch("order/confirmbook/jiaotong_select", jiaotong);
      },
    },
    components: {

    }
  }

</script>

<style>

</style>