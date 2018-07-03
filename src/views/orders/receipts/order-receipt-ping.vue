<template>
  <div>
    <mt-header title="平账信息" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div style="height:40px"></div>

    <div
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="loading"
    infinite-scroll-distance="10" class="page-infinite-list"
    >

    <div class="item" v-for="item in items">
      <my-block></my-block>
      <div class="content">
        <div class="title">
          <div>摘要说明: {{item.theTitle}}</div>
        </div>
        <div class="body">
          <div class="row1">
            <div>
              财务编号: {{item.finID}}
            </div>
            <div>
              金额: {{NumFmt(item.theAmount, 2)}}
            </div>
          </div>
          <div class="row2">
            <div>
              操作人:  {{item.pzName}}
            </div>
            <div>
              日期: {{DateFmt(item.updatetime)}}
            </div>
          </div>
        </div>
      </div>
    </div>

    </div>
    <p :class="'page-infinite-loading'+(loadEnd?'-no':'')">
      <mt-spinner type="fading-circle"></mt-spinner>
      加载中...
    </p>
    <div :class="'loadmore-end'+((showEnd&&loadEnd)?'':'-no')">我是有底线的</div>

    <div class="final">
      <label >总额 </label><span>{{NumFmt(items.reduce((sumSoFar, item)=>{
        return sumSoFar+item.theAmount;
      },0), 2)}}</span>
    </div>

  </div>
</template>

<script>
import {Toast} from "mint-ui"

export default {
  data () {
    return {
      popupVisible:false,
      showEnd: false,
      loadEnd: true,
    }
  },
  created() {
    let order_id = this.$store.getters["order/order_id"];
    if(!order_id) {
      let orderid = this.$route.query.id;
      if(orderid) {
        this.$store.dispatch("order/order_select", {id: orderid});
        this.$store.dispatch("order/order_request");
      } else {
        Toast("未选择有效订单");
        return;
      }
    }
    this.loadEnd = !this.loadEnd;
    this.$store.dispatch("order/receipt/receipt_pings_request").then(end => {
      this.loadEnd = !this.loadEnd;
    });
  },
  computed: {
    items() {
      return this.$store.getters["order/receipt/receipt_pings"]
    }
  },
  methods:{
    loadMore() {
      // if(this.loadEnd&&!this.showEnd) {
      //   this.loadEnd = !this.loadEnd;
      //   this.$store.dispatch("order/receipt/receipt_pings_request").then(end => {
      //     this.showEnd = end
      //     this.loadEnd = !this.loadEnd;
      //   });
      // }
    },
  },
  components: {

  }
}
</script>

<style scoped>
.content {
  background-color: #fff;
  padding: 5px 10px 10px 10px;
}
.content .title {
  border-bottom: solid 0.8px #eee;
  display: flex;
  flex-direction: row;
  height: 32px;
  font-size: 0.9em;
}
.content .title div:nth-child(1) {
  display: flex;
  flex: 1;
  justify-content: flex-start;
  align-items: center;
}
.content .body {
  display: flex;
  flex-direction: column;
  font-size: 0.86em;
  color: #888;
}
.content .body .row1 {
  display: flex;
  flex-direction: row;
  height: 28px;
}
.content .body .row1 div:nth-child(1) {
  display: flex;
  flex: 2;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.content .body .row1 div:nth-child(2) {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
}

.content .body .row2 {
  display: flex;
  flex-direction: row;
  height: 28px;
}

.content .body .row2 div {
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
}
.content .body .row2 div:nth-child(1) {
  justify-content: flex-start;
}
.content .body .row2 div:nth-child(2) {
  justify-content: flex-end;
}

.final {
  padding: 10px;
  text-align: right;
  font-size: 1em;
}
.final span {
  color: #FF6600;
}
</style>
