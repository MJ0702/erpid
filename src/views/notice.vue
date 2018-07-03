<template>
  <div>
    <mt-header title="公告信息" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div style="height:40px"></div>

    <mt-navbar v-model="selected">
      <mt-tab-item :id="0" >未读</mt-tab-item>
      <mt-tab-item :id="1" >已读</mt-tab-item>
    </mt-navbar>

    <div class="row" v-for="notice in showNotices" @click="noticeClick(notice)">
      <!-- <div style="height: 10px;"></div> -->
      <!-- <div class="left">
        <div class="title title-top" v-if="notice.isTop==1">{{notice.title}} (置顶)</div>
        <div class="title" v-else>{{notice.title}}</div>
        <div class="label"><span>发布人:{{notice.admName}}</span></div>
      </div>
      <div class="right">
        <div class="title"><span></span></div>
        <div class="label"><span>{{DateFmt(notice.addTime)}}</span></div>
      </div> -->
      <div class="row1">
        <div class="title title-top" v-if="notice.isTop==1">{{notice.title}} (置顶)</div>
        <div class="title" v-else>{{notice.title}}</div>
      </div>
      <div class="row2">
        <div class="label"><span>发布人:{{notice.admName}}</span></div>
        <div class="label"><span>{{DateFmt(notice.addTime)}}</span></div>
      </div>
    </div>
    <div class="none" v-if="notices.length<=0">
      已经没有公告信息了
    </div>

    <mt-header title="公告详情" fixed v-if="popupStatus" style="z-index:2100">
      <a slot="left">
        <mt-button icon="back" @click="popupStatus=!popupStatus">返回</mt-button>
      </a>
    </mt-header>
    <mt-popup v-model="popupStatus" popup-transition="popup-fade" position="right" class="my-popup-right">
      <div style="height:40px"></div>
      <!-- 公告详情弹出 -->
      <div class="detail-title">{{notice.title}}</div>
      <div class="detail-time">
        {{DateFmt(notice.addTime)}}
        <span v-if="notice.admName">&nbsp;{{notice.admName}}</span>
      </div>
      <div class="detail-content" v-html="htmlEncode(notice.detail)">
        <!-- dom 元素注入 -->
      </div>
    </mt-popup>
    <!-- <my-button-block fixed v-if="popupStatus" style="z-index:2100">
      <mt-button type="primary" size="large" @click.native="popupStatus = !popupStatus">确定</mt-button>
    </my-button-block> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      selected: 0,
      popupStatus: false,
      showNotices: [],
    }
  },
  created() {
    this.$store.dispatch("notice/notices_request").then(notices => {
      this.sortNotice();
    });
  },
  computed: {
    notices() {
      return this.$store.getters["notice/notices"];
    },
    notice() {
      return this.$store.getters["notice/notice"];
    },
  },
  methods: {
    noticeClick(notice) {
      this.$store.dispatch("notice/notice_select", notice);
      this.popupStatus = !this.popupStatus;
    },
    dateShow(dateStr, whole) {
      let newdate = new Date();
      let date = new Date(dateStr);
      let dateFmt = DateFmt(date);

      let hour = date.getHours();
      let minute = date.getMinutes();
      let timeOne = hour<=12? "上午"+hour+":"+minute : "下午"+(hour-12)+":"+minute;
      let timeTwo = "昨天";
      if(DateFmt(newdate)==dateFmt) { //为同一天
        return whole? timeOne : timeOne;
      } else if(DateFmt(newdate,'yyyy-MM')==DateFmt(date,'yyyy-MM') &&
        newdate.getDate()-date.getDate()==1) { //为昨天

        return whole? timeTwo + " " + timeOne : timeTwo;
      } else {
        return whole? dateFmt + " " + timeOne : dateFmt;
      }
    },
    sortNotice() {
      let val = this.selected;
      let reads = [];
      let unreads = [];
      this.notices.forEach((notice) => { //按已读未读分类
        if(notice.readAdmin > 0) {
          reads.push(notice);
        } else {
          unreads.push(notice);
        }
      })
      // reads.sort((cur, nex) => { //按日期降序排序
      //   return new Date(nex.addTime) - new Date(cur.addTime);
      // });
      // unreads.sort((cur, nex) => { //按日期降序排序
      //   return new Date(nex.addTime) - new Date(cur.addTime);
      // });
      this.showNotices = [];
      if(val > 0) { //已读
        this.showNotices = reads;
      } else { //未读
        this.showNotices = unreads;
      }
    },
    htmlEncode(str) {
      if(str) {
        return HtmlEncode(str);
      }
    }
  },
  watch: {
    selected() {
      this.sortNotice();
    },
    popupStatus(val, pre) {
      if(!val&&pre&&this.selected==0) {//查看完详情(即 popup 关闭)，如果查看的通知是未读的，重新获取数据，其数据已变成了已读状态
        this.$store.dispatch("notice/notices_request").then(notices => {
          this.sortNotice();
        });
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if(this.popupStatus) {
      this.popupStatus = !this.popupStatus;
      next(false);
    } else {
      next();
    }
  }
}
</script>

<style scoped>
.row {
  margin-top: 10px;
  display: flex;
  background-color: white;
  padding: 10px;

  flex-direction: column;
}
.row > div {
  display: flex;
  flex-direction: row;
}
.row .left {
  flex: 3;
}
.row .right {
  flex: 1;
  align-items: flex-end;
}
.row .title {
  font-size: 1em;
  margin-bottom: 5px;
}
.row .title-top {
  color: red;
}
.row .label {
  margin-top: 5px;
  color: #888;
  height: 100%;
  width: 100%;
  position: relative;
  flex: 1;
  font-size: 0.8em;
}
.right .label {
  color: #888;
  flex: 1;
  padding-top: 5px;
  text-align: end;
}

.row2 div:first-child {
  flex: 3;
}
.row2 div:last-child {
  text-align: end;
}

.none {
  text-align: center;
  padding: 10px;
}

.detail-title {
  margin: 10px;
  font-size: 1.2em;
  font-weight: bold;
  color: #222;
}
.detail-time {
  margin: 0px 0px 0px 10px;
  color: #888;
  font-size: 0.9em;
}
.detail-content {
  margin: 10px;
}
</style>
