<template>
  <div class="place-info-block">
    <mt-header title="位置信息" fixed>
      <!-- <router-link to="/place-info" @click.native="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link> -->
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div style="height:40px"></div>

    <my-block></my-block>
    <mt-cell title="计划位">
      <span>{{plan.planNum||0}}</span>
    </mt-cell>
    <mt-cell title="领队数" :value="plan.guideNum||0"></mt-cell>
    <mt-cell title="确认占位">
      <span style="color: blue">{{plan.trueNum||0}}</span>
    </mt-cell>
    <mt-cell title="预留占位"  is-link @click.native="placeReserve" v-if="plan.stayNum>0">
      <!--<span style="color: green">{{plan.stayNum||0}}</span>-->
    </mt-cell>
    <mt-cell title="预留占位"  v-else>
      <!--<span style="color: green">{{plan.stayNum||0}}</span>-->
    </mt-cell>
    <mt-cell title="可售余位" :value="plan.endNum||0">
      <span style="color:#f36">{{plan.endNum||0}}</span>
    </mt-cell>
    <mt-cell title="确认不占位" :value="plan.trueNumBuZhan||0">
      <span style="color: blue">{{plan.trueNumBuZhan||0}}</span>
    </mt-cell>
    <mt-cell title="预留不占位" :value="plan.stayNumBuZhan||0">
      <span style="color: green">{{plan.stayNumBuZhan||0}}</span>
    </mt-cell>
    <mt-cell title="它团收客" :value="plan.receive||0"></mt-cell>
    <mt-cell title="预留时长" :value="plan.end_time||0"></mt-cell>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    plan() {
      return this.$store.getters["plan/plan"];
    },
    receive() {
      let record = this.plan;
      let value = 0;
      if ( record.theUnionPlanID > 0 ){  //库存团
        value = record.planNum*1 - record.endNum*1 - record.trueNum*1 - record.stayNum*1 - record.guideNum*1;
        if (value < 0) value = 0;
      }else{
        value = '-';
      }
      return value;
    }
  },
  methods: {
    placeReserve() {
      this.$router.push({ path: "place-list" })
    },
  }
}
</script>

<style>
</style>
