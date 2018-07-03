<template>
  <!-- 银行账户 -->
  <div>
    <mt-header title="币种" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="blank" style="height:40px"></div>
    <!--
    -->
    <my-radio :title="type.code+'('+type.cnName+')'" :value="type.rate | cny(4)" name="order-type" v-for="type in types" @click.native="typeClick(type)"
      :checked="type.ID == typeSlect.ID"></my-radio>
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
        return this.$store.getters["order/bills/bills_curs"];
      },
      typeSlect() {
        return this.$store.getters["order/bills/bills_cur"];
      }
    },
    methods: {
      typeClick(type) {
        this.$store.dispatch("order/bills/bills_cur_select", type);
        this.$router.go(-1);
      },
    },
    components: {

    }
  }

</script>

<style>

</style>