<template>
  <!-- 确认书模板 -->
  <div>
    <mt-header title="确认书模板" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="blank" style="height:40px"></div>
    <!--
    -->
    <my-radio :title="type.fileName" v-for="type in types" @click.native="typeClick(type)" :checked="type.value == typeSlect.value"></my-radio>
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
        this.$store.dispatch('order/confirmbook/confirmation_template_request');
      }

    },
    computed: {
      types() {
        return this.$store.getters["order/confirmbook/confirmTemps"];
      },
      typeSlect() {
        return this.$store.getters["order/confirmbook/confirmTemp"];
      },
    },
    methods: {
      typeClick(type) {
        this.$store.dispatch("order/confirmbook/confirm_template_select", type);
        this.$router.go(-1);
      },
    },
    components: {

    }
  }

</script>

<style>

</style>