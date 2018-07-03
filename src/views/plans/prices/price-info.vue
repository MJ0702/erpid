<template>
  <div class="price-info-block">
    <mt-header title="价格信息" fixed>
      <!-- <router-link to="/price-info" @click.native="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link> -->
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div style="height:40px"></div>

    <my-navbar v-model="selected">
      <mt-tab-item :id="price.price_title" :val="price.price_title" v-for="price in prices">{{price.price_title}}</mt-tab-item>
    </my-navbar>

    <mt-tab-container v-model="selected" swipeable>
      <mt-tab-container-item :id="price.price_title" v-for="price in prices">
        <my-block></my-block>
        <mt-cell title="市场价" ></mt-cell>
        <mt-cell label="成人" :value="NumFmt(price.sadultPrice)"></mt-cell>
        <mt-cell label="小童占床" :value="NumFmt(price.schildPrice)"></mt-cell>
        <mt-cell label="小年轻" :value="NumFmt(price.sadultPrice1)"></mt-cell>
        <mt-cell label="老人" :value="NumFmt(price.sadultPrice2)"></mt-cell>
        <mt-cell label="小童不占床" :value="NumFmt(price.schildPrice1)"></mt-cell>
        <my-block></my-block>
        <mt-cell title="同行价" ></mt-cell>
        <mt-cell label="成人" :value="NumFmt(price.adultPrice)"></mt-cell>
        <mt-cell label="小童占床" :value="NumFmt(price.childPrice)"></mt-cell>
        <mt-cell label="小年轻" :value="NumFmt(price.adultPrice1)"></mt-cell>
        <mt-cell label="老人" :value="NumFmt(price.adultPrice2)"></mt-cell>
        <mt-cell label="小童不占床" :value="NumFmt(price.childPrice1)"></mt-cell>
        <my-block></my-block>
        <mt-cell title="成本价" ></mt-cell>
        <mt-cell label="成人" :value="NumFmt(price.iadultPrice)"></mt-cell>
        <mt-cell label="小童占床" :value="NumFmt(price.ichildPrice)"></mt-cell>
        <mt-cell label="小年轻" :value="NumFmt(price.iadultPrice1)"></mt-cell>
        <mt-cell label="老人" :value="NumFmt(price.iadultPrice2)"></mt-cell>
        <mt-cell label="小童不占床" :value="NumFmt(price.ichildPrice1)"></mt-cell>
        <my-block></my-block>
        <mt-cell title="定金" :value="NumFmt(price.DingPrice)"></mt-cell>
        <my-block></my-block>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selected: "",
    }
  },
  created() {
    this.selected = this.price.price_title;
  },
  computed: {
    prices() {
      return this.$store.getters["plan/price/prices"];
    },
    price() {
      return this.$store.getters["plan/price/price_show"];
    }
  },
  methods: {
  },
  watch: {
  }
}
</script>

<style>
.price-info-block .mint-cell-label {
  font-size: 16px;
}
</style>
