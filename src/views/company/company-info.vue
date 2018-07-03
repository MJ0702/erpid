<template>
  <div>
    <mt-header title="客户公司详情" fixed>
      <a @click="$router.push('company')" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
      <mt-button slot="right" v-show="PermitCheck('cust-cpy/edit')" @click="$router.push({name:'company-edit',query:{id:$route.query.id}})">编辑</mt-button>
    </mt-header>
    <div style="height:40px"></div>
    <my-cell title="公司名称" :value="company.simName" class="newline"></my-cell>
    <my-cell title="结算方式" v-model="company.payType"  class="newline"></my-cell>
    <mt-cell title="结算价格" :value="company.isVip == 0 ? '市场价': company.isVip == 1 ? '同行价' : '成本价'"></mt-cell>
    <mt-cell title="负责人" v-model="company.leader"></mt-cell>
    <mt-cell title="手机号" v-model="company.mobile"></mt-cell>
    <mt-cell title="所在地区" v-model="company.proveinceArea"></mt-cell>
    <mt-cell title="公司地址" v-model="company.addr"></mt-cell>
    <mt-cell title="备注" v-model="company.remark"></mt-cell>
  </div>
</template>

<script>
import { MessageBox , Toast, Indicator} from 'mint-ui';
import Vue from 'vue'

export default {
  data() {
    return {

    }
  },
  created() {
    if(!this.$route.params.refresh){
      this.fnInit();
    }
  },
  computed: {
    company() {
      return this.$store.getters["customer/company"];
    },
  },
  methods: {
    fnInit(){
      let keyword=this.$route.query.id;
      Vue.http.post(
          "cust-cpy/list",
        {
        skey: keyword,
        page: 1,
        start: 0,
        limit: 20,
        sort:'[{"property":"bySort","direction":"desc"},{"property":"isLock","direction":"asc"},{"property":"ID","direction":"desc"}]'
        },
          { emulateJSON: true }
        ).then(res => {
          if (!res.body) return;
          let data = res.body.rows;
          this.$store.dispatch("customer/company",data[0]);
        })
    }
  },
  watch: {
  },
}
</script>

<style>
.company-info-block .input-right .mint-cell-value input{
  text-align: right;
}
</style>

<style scoped>
  .detail-title {
    margin: 10px;
    font-size: 1.1em;
    color: #222;
    /*border-left: 5px solid blue;*/
  }
  .detail-title .little-border {
    font-size:0.8em;
    color: #33CCFF;
    position: relative;
    top: -2px;
  }
  .detail-content {
    margin: 10px;
  }
</style>
