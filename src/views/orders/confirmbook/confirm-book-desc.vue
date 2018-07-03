<template>
  <!-- 确认书备注 -->
  <div>
    <mt-header title="确认书备注" fixed>
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
    <mt-checklist v-model="confirm_search_query.confirmBookDescs" :options="types" @change="confirmBookDescsChange">

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
      this.$store.dispatch('order/confirmbook/confirm_book_desc_request', order_id);
    },
    computed: {
      types() {
        return this.$store.getters["order/confirmbook/confirm_book_desc"];
      },
      typeSlect() {
        return this.$store.getters["order/confirmbook/confirm_book_desc_select"];
      },
      confirm_search_query() {
        return this.$store.getters["order/confirmbook/confirm_search_query"];
      }
    },
    methods: {
      typeClick(type) {
        this.$store.dispatch("order/confirmbook/confirm_book_desc_select", type);
        this.$router.go(-1);
      },
      confirmBookDescsChange(val) {
        let confirmBookDesc = "", confirmBookDescID = "";
        confirmBookDesc = val.map(v => v.slice(v.indexOf(",") + 1, v.length)).toString();
        confirmBookDescID = val.map(v => v.slice(0, v.indexOf(","))).toString();
        this.confirm_search_query.confirmBookDescID = confirmBookDescID;
        // this.typeSlect = confirmBookDesc;
        this.$store.dispatch("order/confirmbook/confirm_book_desc_select", confirmBookDesc);
      },
    },
    components: {

    }
  }

</script>

<style>

</style>