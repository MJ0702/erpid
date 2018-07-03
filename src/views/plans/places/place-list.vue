<template>
  <div class="place-list-block">
    <mt-header title="预留占位" fixed>
      <!-- <router-link to="/place-list" @click.native="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link> -->
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
      <mt-button slot="right" @click="$router.push('dashang')">
        <img width="20" height="20" style="vertical-align: middle;" src="~assets/meigui.png" alt="欢迎">
        打赏</mt-button>
    </mt-header>
    <div style="height:40px"></div>

    <div class="place-list-block_row" @click="$router.push('order-info?id='+place.ordID)" v-for="place in places">
      <div class="place-list-block_left">
        <span class="place-list-block_title">订单号: {{place.ordID}}</span>
        <span class="place-list-block_label">到期时间: {{DateFmt(place.endTime,'yyyy-MM-dd hh:mm')}}</span>
      </div>
      <div class="place-list-block_right">
        <span class="place-list-block_title">人数:{{place.perNum}}</span>
        <span class="place-list-block_label" style="text-align:right;">销售:{{place.saleName}}</span>
      </div>
      <div class="place-list-block-arrow"><i class="mint-cell-allow-right"></i></div>
    </div>
    <div class="place-list-block_none" v-if="places.length<=0">
      无列表数据
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  created() {
    this.$store.dispatch("plan/place/places_stay_request");
  },
  computed: {
    places() {
      return this.$store.getters["plan/place/places_stay"];
    },
  },
  methods: {
  }
}
</script>

<style>
.place-list-block_row {
  margin-top: 10px;
  display: flex;
  background-color: white;
  padding: 10px;
}
.place-list-block_row > div {
  display: flex;
  flex-direction: column;
}
.place-list-block_row .place-list-block_left {
  flex: 2;
}
.place-list-block_row .place-list-block_right {
  flex: 1;
  align-items: flex-end;
}
.place-list-block_row .place-list-block_title {
  font-size: 1.06em;
  font-weight: bold;
}
.place-list-block_row .place-list-block_label {
  color: #888;
  font-size: 0.9em;
  padding-top: 8px;
}
.place-list-block_none {
  text-align: center;
}
.place-list-block-arrow{
  position: relative;
  width: 50px;
}
</style>
