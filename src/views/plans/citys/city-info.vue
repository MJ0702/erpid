<template>
  <div>
    <mt-header title="起止城市" fixed>
      <!-- <router-link to="city-info" @click.native="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link> -->
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div style="height:40px"></div>

    <my-block></my-block>
    <my-cell title="起止城市" class="newline" :value="plan.planPrice&&plan.planPrice.length>0?plan.planPrice[0].fromCityName:''"></my-cell>
    <my-block left bottom v-if="plan.policy.length>0">{{plan.policy_name}}联运政策</my-block>
    <mt-cell :title="city.city" :value="'+'+city.sale_price" v-for="city in plan.policy"></mt-cell>
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
  },
  methods: {
  }
}
</script>

<style>
</style>
