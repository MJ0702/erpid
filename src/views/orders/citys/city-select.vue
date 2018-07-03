<template>
  <div>
    <mt-header title="出发城市" fixed>
      <a @click="$router.go(-1)" slot="left" >
        <mt-button icon="back">返回</mt-button>
      </a>
      <!-- <mt-button slot="right" @click="$router.go(-1)">取消</mt-button> -->
    </mt-header>
    <div style="height:40px"></div>

    <my-block></my-block>
    <my-radio :value="'+'+city.sale_price" :title="city.fromCityName" name="city"
      @click.native="cityClick(city)" v-for="city in citys" :checked="city.fromCityName == cityselect.fromCityName"></my-radio>

    <my-pad></my-pad>
    <my-button-block fixed>
      <mt-button type="primary" size="large" @click="$router.go(-1)">确定</mt-button>
    </my-button-block>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  created() {
    if(this.citys.length < 1) {
      this.$store.dispatch("order/city/citys_request");
    }
  },
  computed: {
    citys() {
      return this.$store.getters["order/city/citys"];
    },
    cityselect() {
      return this.$store.getters["order/city/city"];
    }
  },
  methods: {
    cityClick(city) {
      this.$store.dispatch("order/city/city_select", city);
    },
  }
}
</script>

<style>
</style>
