<template>
  <!-- 收款摘要 -->
  <div>
    <mt-header title="收款摘要" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="blank" style="height:40px"></div>
    <!--
    -->
    <my-radio :title="type.description" v-for="type in types" @click.native="typeClick(type)" :checked="type.FIELD1 == typeSlect.FIELD1"></my-radio>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    created() {
      this.$store.dispatch('order/confirmbook/title_desc_request');
    },
    computed: {
      types() {
        return this.$store.getters["order/confirmbook/title_desc"];
      },
      typeSlect() {
        return this.$store.getters["order/confirmbook/title_desc_select"];
      },
    },
    methods: {
      typeClick(type) {
        this.$store.dispatch("order/confirmbook/title_desc_select", type);
        this.$router.go(-1);
      },
    },
    components: {

    }
  }

</script>

<style>

</style>