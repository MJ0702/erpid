<template>
  <div>
    <mt-header title="销售信息" fixed>
      <!-- <router-link to="/saler-info" @click.native="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link> -->
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
      <!-- <mt-button slot="right" @click.native="$router.go(-1)">取消</mt-button> -->
    </mt-header>
    <div style="height:40px"></div>

    <my-block></my-block>
    <router-link to="/saler-search" class="router-link" >
      <mt-cell title="所属销售" :value="sale.userName" is-link></mt-cell>
    </router-link>
    <my-block></my-block>
    <mt-cell title="总欠款" :value="NumFmt(sale.SalePingAmountNos||0)"></mt-cell>
    <mt-cell title="额度" :value="NumFmt(sale.SaleMaxMoney||0)"></mt-cell>
    <mt-cell title="剩余额度" :value="NumFmt((sale.SaleMaxMoney||0)-(sale.SalePingAmountNos||0))"></mt-cell>
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
    created(){
      //如果未选择销售，默认选择 我(当前用户) 为销售
      if(!this.sale.userName) {
        let mine = this.mine;
        this.$store.dispatch("order/saler/sale_select", {
          ID: mine.ID,
          userName: mine.trueName,
        })
      }
    },
    computed:{
      sale() {
        return this.$store.getters["order/saler/sale"];
      },
      mine() {
        return this.$store.getters["mine/mine"];
      }
    },
    methods: {
    }
  }
</script>

<style>
</style>
