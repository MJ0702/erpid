<template>
  <div>
    <mt-header :title="title"
               fixed>
      <a @click="$router.go(-1)"
         slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
      <!--<mt-button slot="right" @click="getRanks(true)">刷新</mt-button>-->
      <mt-button slot="right"
                 @click="moreTypeClick">更多</mt-button>
    </mt-header>
    <div style="height:40px"></div>
    <div class="box-rank-head">
      <mt-navbar v-model="selected"
                 class="fang-navbar-sign">
        <mt-tab-item :id="i"
                     v-for="title, i in titles">{{title}}</mt-tab-item>
      </mt-navbar>
      <div class="box-total">
        <p class="total-name">合计数</p>
        <p class="total-num">{{total}}<span>人</span></p>
        <p class="total-date">{{rankDate}}</p>
      </div>
    </div>
  
    <div style="height: 10px;"></div>
    <!-- <mt-tab-container v-model="selected" swipeable>
              <mt-tab-container-item :id="i" v-for="key,i in keys">
                <div v-for="sale,j in salesRank[key]" class="rank-list">
                  <div class="rank" :class="j<3?'rank-top':''">No.{{j+1}}</div>
                  <div class="name" :class="j<3?'rank-top':''">{{sale.saleName}}</div>
                  <div class="nums" :class="j<3?'rank-top':''">{{sale.perNums}}人</div>
                </div>
              </mt-tab-container-item>
            </mt-tab-container> -->
    <div>
      <div v-for="sale,j in salesRank[keys[selected]]"
           class="rank-list">
        <!--<div class="rank"
             :class="j<3?'rank-top':''">No.{{j+1}}</div>-->
        <div class="rank"
             :class="j<3?'rank-top':''">
               <img v-if="j<3" :src="'assets/no_'+ (j+1) +'.png'">
               <span v-else>No.{{j+1}}</span>
               </div>
        <div class="name"
             :class="j<3?'rank-top':''">{{sale.saleName}}</div>
        <div class="nums"
             :class="j<3?'rank-top':''">{{sale.perNums}}人</div>
      </div>
    </div>
    <mt-popup v-model="popupVisible"
              position="top"
              popup-transition="popup-fade"
              modal="false"
              class="mint-popup-1">
      <a class="my-pop-a underline"
         @click="popupClick(1)">下单统计</a>
      <a class="my-pop-a"
         @click="popupClick(2)">出团统计</a>
    </mt-popup>
  </div>
</template>

<script>
import { Toast } from "mint-ui"

export default {
  data() {
    return {
      selected: 0,
      keys: ['day', 'week', 'month'],
      titles: ['今天', '本周', '本月'],
      popupStatus: false,   //页面显示标识  boolean
      popupVisible: false,
      showWhich: 1,
    }
  },
  created() {
    this.getRanks();
  },
  computed: {
    salesRank() {
      return this.$store.getters["saler/sales_rank"];
    },
    title() {
      if (this.showWhich == 1) {
        return '下单统计';
      } else {
        return '出团统计';
      }
    },
    rankType() {   //排行榜类型
      if (this.showWhich == 1) {
        return 'order';
      } else {
        return 'plan';
      }
    },
    total() {
      let rank = this.salesRank[this.keys[this.selected]];
      let totalNum = 0;
      
      if(!rank.length){
        return 0;
      }
      for (var k=0;k<rank.length;k++) {
        totalNum += rank[k].perNums;
      }
      return totalNum || 0;
    },
    rankDate(){
      let val = this.selected;
      let key = this.keys[val];
      let keys=this.keys;
      let startDate = new Date();
      let endDate = new Date();
      if(keys.indexOf(key)==1) { //本周
        let day = startDate.getDay()
        if(day==0) {
          day = 7;
        }
        startDate.setDate(startDate.getDate()-day+1);
        endDate.setDate(endDate.getDate()+(7-day));
        startDate=DateFmt(startDate, 'yyyy-MM-dd');
        endDate=DateFmt(endDate, 'yyyy-MM-dd')
      } else if (keys.indexOf(key)==2) { //本月
        let newDate = new Date(startDate.getFullYear(), startDate.getMonth()+1, 0);
        startDate.setDate(1);
        endDate.setDate(newDate.getDate());
        startDate=DateFmt(startDate, 'yyyy-MM-dd');
        endDate=DateFmt(endDate, 'yyyy-MM-dd')
      }else{
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate=DateFmt(startDate, 'yyyy-MM-dd hh:mm');
        if(this.rankType=='plan'){
          endDate='23:59';
        }else{
          endDate=endDate.getHours()+':'+endDate.getMinutes();
        }
      }
      return startDate+'~'+endDate;
    }
  },
  methods: {
    getRanks(refresh) {
      let val = this.selected;
      let key = this.keys[val];
      if (key) {
        if (refresh) {
          this.$store.dispatch("saler/sales_rank_clear");
        }
        if (this.salesRank[key].length < 1) {
          let rankType = this.rankType;
          let data={
            key,
            rankType
          };
          this.$store.dispatch("saler/sales_rank_request", data).then(ranks => {
            if (!ranks || ranks.length < 1) {
              Toast(this.titles[val] + "无排行榜信息")
            }
          })
        }
      }
    },
    popupClick(i) {
      this.popupVisible = !this.popupVisible;
      if (i) {
        this.showWhich = i;
      }
      this.getRanks(true);
    },
    moreTypeClick() {
      this.popupVisible = !this.popupVisible;
    },
  },
  watch: {
    selected() {
      this.getRanks(true)
    }
  }
}
</script>

<style>
.rank-list {
  display: flex;
  flex-direction: row;
}

.rank.rank-top img{
  width: 25px;
  height: 25px;
  vertical-align: middle
}
.rank-list:nth-child(odd) {
  background-color: #FFFFFF;
}

.rank-list:nth-child(even) {
  background-color: #F2F2F2;
}

.rank-list>div {
  flex: 1;
  height: 49px;
  text-align: center;
  line-height: 49px;
}

.rank-list .name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.rank-list .rank.rank-top {
  color: #FF6666;
}

.rank-list .name.rank-top {
  color: #FF6666;
}

.rank-list .nums.rank-top {
  color: #33CCFF;
}

.rank-list div:not(.rank-top) {
  font-size: 0.98em;
  color: #999;
}

.box-rank-head {
  padding: 0 40px 10px;
  background: #26a2ff;
}

.box-total {
  background: #fff;
  text-align: center;
  padding: 15px 0 20px;
  margin-top: 10px;
  border-radius: 5px;
  font-size: 12px;
  color: #868686;
}

.box-total p {
  margin: 0;
}

.mint-navbar.fang-navbar-sign {
  border-radius: 5px;
  background: #26a2ff;
  height: 36px;
  border: 1px solid #fff;
}

.mint-navbar.fang-navbar-sign .mint-tab-item.is-selected {
  background: #fff;
  margin-bottom: 0;
  border-bottom:0;
}

.fang-navbar-sign .mint-tab-item {
  border-right: 1px solid #fff;
  color:#fff;
}
.fang-navbar-sign .mint-tab-item-label{
  line-height: 0.6;
}

.box-total .total-num {
  font-size: 50px;
  color: #26a2ff;
}

.box-total .total-num span {
  font-size: 12px;
}

.mint-popup-1 {
  width: 90px;
  padding: 10px;
  -webkit-transform: translate(-50%);
  transform: translate(-50%);
  top: 50px;
  background: rgba(0, 153, 255, 1);
  right: -50px;
  left: auto;
  text-align: center;
}

.mint-popup-1:before {
  display: inline-block;
  width: 0;
  height: 0;
  border: solid transparent;
  border-width: 10px;
  border-bottom-color: rgba(0, 153, 255, 1);
  content: '';
  position: absolute;
  top: -20px;
  right: 15px;
}

.mint-popup a.my-pop-a {
  display: block;
  color: #fff;
  text-align: center;
  line-height: 36px;
}

/*.mint-popup a.my-pop-a:first-child {
  margin-top: 0;
  border-bottom: 1px solid #fff;
}*/

.mint-popup a.my-pop-a.underline {
  margin-top: 0;
  display: inline-block;
  border-bottom: 1px solid #fff;
}





/*.rank-list:nth-child(1) {
  color: #FF6666;
}
.rank-list:nth-child(2) {
  color: #33CCFF;
}
.rank-list:nth-child(3) {
  color: #00CC99;
}*/
</style>
