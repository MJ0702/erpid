<template>
  <div>
    <mt-header title="订单类型" fixed>
      <!-- <router-link to="/order-type-select" @click.native="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link> -->
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
      <!-- <mt-button slot="right" @click.native="$router.go(-1)">取消</mt-button> -->
    </mt-header>
    <div style="height:40px"></div>

    <my-radio :title="type.cnName"
      name="order-type"
      v-for="type in types"
      @click.native="typeClick(type)"
      :checked="type.cnName == typeSlect.cnName"
    ></my-radio>
    <my-pad></my-pad>
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
      if(this.types.length < 1) {
        this.$store.dispatch("order/order_types_request");
      }
    },
    computed:{
      types() {
        return this.$store.getters["order/order_types"];
      },
      typeSlect() {
        return this.$store.getters["order/order_type"];
      }
    },
    methods: {
      typeClick(type) {
        this.$store.dispatch("order/order_type_select", type);
      },
    }
  }
</script>

<style>
</style>
