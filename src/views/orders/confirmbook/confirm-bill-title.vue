<template>
  <!-- 账单抬头 -->
  <div>
    <mt-header title="账单抬头" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="blank" style="height:40px"></div>
    <!--
    -->
    <my-radio :title="type.title" v-for="type in types" @click.native="typeClick(type)" :checked="type.ID == typeSlect.ID"></my-radio>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    created() {
      if (!this.types.length) {
        this.$store.dispatch('order/confirmbook/bill_title_request');
      }
    },
    computed: {
      types() {
        return this.$store.getters["order/confirmbook/bill_title"];
      },
      typeSlect() {
        return this.$store.getters["order/confirmbook/bill_title_select"];
      },
    },
    methods: {
      typeClick(type) {
        this.$store.dispatch("order/confirmbook/bill_title_select", type);
        this.$router.go(-1);
      },
    },
    components: {

    }
  }

</script>

<style>

</style>