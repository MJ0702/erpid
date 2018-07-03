<template>
  <div class="price-select-block">
    <mt-header :title="'选择价格:'+priceSelect.price_title+'('+['市场价','同行价','成本价'][priceSelect.type]+')'" fixed>
      <!-- <router-link to="/price-select" @click.native="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link> -->
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
      <!-- <mt-button slot="right" @click.native="$router.go(-1)">取消</mt-button> -->
    </mt-header>
    <div style="height:40px"></div>

    <my-navbar v-model="selected">
      <mt-tab-item :id="price.price_title" :val="price.price_title" v-for="price in prices">{{price.price_title}}</mt-tab-item>
    </my-navbar>

    <mt-tab-container v-model="selected" swipeable>
      <mt-tab-container-item :id="price.price_title" v-for="price in prices">
        <my-block></my-block>
        <my-radio title="市场价" :name="price.price_title" :checked="priceSelect.type=='0'&&priceSelect.ID==price.ID" @click.native="priceClick(price, '0')"></my-radio>
        <mt-cell label="成人" :value="NumFmt(price.sadultPrice>0?price.sadultPrice+(city.sale_price||0):price.sadultPrice)"></mt-cell>
        <mt-cell label="小童占床" :value="NumFmt(price.schildPrice>0?price.schildPrice+(city.sale_price||0):price.schildPrice)"></mt-cell>
        <mt-cell label="小年轻" :value="NumFmt(price.sadultPrice1>0?price.sadultPrice1+(city.sale_price||0):price.sadultPrice1)"></mt-cell>
        <mt-cell label="老人" :value="NumFmt(price.sadultPrice2>0?price.sadultPrice2+(city.sale_price||0):price.sadultPrice2)"></mt-cell>
        <mt-cell label="小童不占床" :value="NumFmt(price.schildPrice1>0?price.schildPrice1+(city.sale_price||0):price.schildPrice1)"></mt-cell>
        <my-block></my-block>
        <my-radio title="同行价" :name="price.price_title" :checked="priceSelect.type=='1'&&priceSelect.ID==price.ID" @click.native="priceClick(price, '1')"></my-radio>
        <mt-cell label="成人" :value="NumFmt(price.adultPrice>0?price.adultPrice+(city.sale_price||0):price.adultPrice)"></mt-cell>
        <mt-cell label="小童占床" :value="NumFmt(price.childPrice>0?price.childPrice+(city.sale_price||0):price.childPrice)"></mt-cell>
        <mt-cell label="小年轻" :value="NumFmt(price.adultPrice1>0?price.adultPrice1+(city.sale_price||0):price.adultPrice1)"></mt-cell>
        <mt-cell label="老人" :value="NumFmt(price.adultPrice2>0?price.adultPrice2+(city.sale_price||0):price.adultPrice2)"></mt-cell>
        <mt-cell label="小童不占床" :value="NumFmt(price.childPrice1>0?price.childPrice1+(city.sale_price||0):price.childPrice1)"></mt-cell>
        <my-block></my-block>
        <my-radio title="成本价" :name="price.price_title" :checked="priceSelect.type=='2'&&priceSelect.ID==price.ID" @click.native="priceClick(price, '2')"></my-radio>
        <mt-cell label="成人" :value="NumFmt(price.iadultPrice>0?price.iadultPrice+(city.sale_price||0):price.iadultPrice)"></mt-cell>
        <mt-cell label="小童占床" :value="NumFmt(price.ichildPrice>0?price.ichildPrice+(city.sale_price||0):price.ichildPrice)"></mt-cell>
        <mt-cell label="小年轻" :value="NumFmt(price.iadultPrice1>0?price.iadultPrice1+(city.sale_price||0):price.iadultPrice1)"></mt-cell>
        <mt-cell label="老人" :value="NumFmt(price.iadultPrice2>0?price.iadultPrice2+(city.sale_price||0):price.iadultPrice2)"></mt-cell>
        <mt-cell label="小童不占床" :value="NumFmt(price.ichildPrice1>0?price.ichildPrice1+(city.sale_price||0):price.ichildPrice1)"></mt-cell>
        <my-block></my-block>
        <mt-cell title="定金" :value="NumFmt(price.DingPrice)"></mt-cell>
        <my-block></my-block>
      </mt-tab-container-item>
    </mt-tab-container>
    <my-pad></my-pad>
    <my-button-block fixed>
      <mt-button type="primary" size="large" @click.native="$router.go(-1)">确定</mt-button>
    </my-button-block>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selected: "2312313",
    }
  },
  created() {
    if(this.prices.length < 1) {
      this.$store.dispatch("order/price/prices_select_request");
    }
    this.selected = this.priceSelect.price_title;
  },
  computed: {
    prices() {
      return this.$store.getters["order/price/prices_select"];
    },
    priceSelect() {
      return this.$store.getters["order/price/price_select"];
    },
    city() {
      return this.$store.getters["order/city/city"];
    }
  },
  mounted() {
  },
  methods: {
    priceClick(price, type) {
      price.type = type;
      this.$store.dispatch("order/price/price_select", price);
    },
  },
}
</script>

<style>
.price-select-block .mint-radiolist-label {
  padding: 0px;
}
.price-select-block .mint-cell:not(.my-radio) .mint-cell-label {
  font-size: 16px;
}
</style>
