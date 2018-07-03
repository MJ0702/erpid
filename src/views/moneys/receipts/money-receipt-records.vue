<template>
<div class="money-receipt-records">
  <mt-header title="收款记录" fixed>
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
    <div class="row" v-for="record in records" @click="showRecord(record)">
      <div class="left">
        <div class="title">{{record.remark}}</div>
        <div class="label">{{DateFmt(record.payTime, 'yyyy-MM-dd hh:mm:ss')}}</div>
      </div>
      <div class="right" style="color:green;" v-if="record.amount>=0">
        {{record.amount}}
      </div>
      <div class="right" v-else>
        -{{record.amount}}
      </div>
    </div>
  </div>
  <p :class="'page-infinite-loading'+(loadEnd?'-no':'')">
    <mt-spinner type="fading-circle"></mt-spinner>
    加载中...
  </p>
  <div :class="'loadmore-end'+((showEnd&&loadEnd)?'':'-no')">我是有底线的</div>

  <mt-header title="款项明细" fixed v-if="popupStatus" style="z-index:2100">
    <a slot="left">
      <mt-button icon="back" @click="popupStatus=!popupStatus">返回</mt-button>
    </a>
  </mt-header>
  <mt-popup v-model="popupStatus" popup-transition="popup-fade" position="right" class="my-popup-right">
    <div style="height:40px"></div>
    <!-- 款项明细弹出 -->
    <div class="order-info">
      <div class="order-title">
        <span>收款金额</span>
        <span style="color:green;" v-if="record.amount>=0">{{record.amount}}</span>
        <span v-else>-{{record.amount}}</span>
      </div>
      <div class="order-rows">
        <div><div>财务编号</div><div>{{record.finID}}</div></div>
        <div><div>摘要信息</div><div>{{record.remark}}</div></div>
        <div><div>到账时间</div><div>{{DateFmt(record.payTime, 'yyyy-MM-dd hh:mm:ss')}}</div></div>
        <div v-if="record.cpyName"><div>付款方</div><div>{{record.adm_name}}</div></div>
      </div>
    </div>
  </mt-popup>

</div>
</template>

<script>
import {Toast} from "mint-ui"

export default {
  data () {
    return {
      showEnd: false,
      loadEnd: true,
      popupStatus: false,
      record: {},
    }
  },
  created() {
    this.loadEnd = false;
    this.$store.dispatch("money/receipt/receipt_records_request").then(end=>{
      this.loadEnd = true;
      this.showEnd = end
    });
  },
  computed: {
    records() {
      return this.$store.getters["money/receipt/receipt_records"];
    }
  },
  methods: {
    loadMore() {
      if(this.loadEnd&&!this.showEnd) {
        this.loadEnd = !this.loadEnd;
        this.$store.dispatch("money/receipt/receipt_records_request").then(end => {
          this.showEnd = end
          this.loadEnd = !this.loadEnd;
        });
      }
    },
    showRecord(record) {
      this.record = record;
      this.popupStatus = !this.popupStatus;
    },
  },
  beforeRouteLeave (to, from, next) {
    if(this.popupStatus) {
      this.popupStatus = !this.popupStatus;
      next(false);
    } else {
      next();
    }
  },
  watch: {
  }
}
</script>

<style scoped>
.row {
  display: flex;
  height: 46px;
  padding: 18px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
}
.row .left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 80%;
}
.row .left .title {
  font-size: 1.2em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.row .left .label {
  font-size: 0.8em;
  color: #888;
  padding-top: 6px;
}
.row .right {
  flex: 1;
  text-align: right;
  line-height: 46px;
  font-size: 1.2em;
}

.order-info {
  background-color: #fff;
  padding: 12px;
}
.order-info .order-title {
  border-bottom: 1px solid #ddd;
  height: 46px;
  margin-bottom: 10px;
  line-height: 46px;
  display: flex;
}
.order-info .order-title span:nth-child(1) {
  color: #666;
  flex: 1;
}
.order-info .order-title span:nth-child(2) {
  font-size: 1.6em;
  flex: 1;
  text-align: end;
}
.order-info .order-rows {
  display: flex;
  flex-direction: column;
}
.order-info .order-rows div {
  display: flex;
}
.order-info .order-rows div div:nth-child(1) {
  color: #666;
  flex: 1
}
.order-info .order-rows div div:nth-child(2) {
  justify-content: flex-end;
  flex: 3.5
}

</style>
