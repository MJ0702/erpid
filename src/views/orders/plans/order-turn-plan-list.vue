<template>
  <div>
    <mt-header title="选择团号" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div style="height:40px"></div>

    <my-search placeholder="搜索" v-model="keyword" cancel-text="取消" @cancel="$router.go(-1)" autofocus show
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10" class="page-infinite-list"
    >
      <mt-cell
        @click.native="chooseItem(item)"
        v-for="item in items">
        {{item.planCode+' (余位 : '+item.endNum+') '}}
      </mt-cell>
      <div :class="'loadmore-end'+((showEnd&&loadEnd)?'':'-no')">我是有底线的</div>
    </my-search>
  </div>
</template>

<script>
import { MessageBox, Toast } from 'mint-ui';

export default {
  data () {
    return {
      keyword: "",
      perword: "",
      timeout: null,
      showEnd: false,
      loadEnd: true,
    }
  },
  created(){
    this.$store.dispatch("order/plan/turn_plans_search", "");
  },
  mounted() {
  },
  computed: {
    items() {
      return this.$store.getters["order/plan/turn_plans_search"];
    },
  },
  methods: {
    chooseItem(item) {
      //判断选择的团期余位是否正确
      if(item&&item.endNum>0) {
        this.$store.dispatch("order/plan/turn_plan_select", item);
        this.$router.go(-1);
      } else {
        Toast("请选择余位充足的团号");
      }
    },
    loadMore() {
      if(this.loadEnd&&!this.showEnd) {
        this.loadEnd = !this.loadEnd;
        this.$store.dispatch("order/plan/turn_plans_search", this.keyword).then(end => {
          this.showEnd = end
          this.loadEnd = !this.loadEnd;
        });
      }
    }
  },
  watch: {
    keyword(val) {
      if (val&&this.loadEnd) {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          this.loadEnd = !this.loadEnd;
          this.$store.dispatch("order/plan/turn_plans_search", val).then(end=>{
            this.showEnd = end
            this.loadEnd = !this.loadEnd;
          })
        }, 280)
      }
    }
  }
}
</script>

<style scoped>
.my-search .mint-search-list {
  position: fixed;
}
</style>
