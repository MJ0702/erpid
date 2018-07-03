<template>
  <div class="customer-info-block">
    <header class="mint-header is-fixed">
      <div class="mint-header-button is-left">
        <a @click="fnback">
          <button class="mint-button mint-button--default mint-button--normal"><span class="mint-button-icon"><i class="mintui mintui-back"></i></span>
            <label class="mint-button-text">返回</label>
          </button>
        </a>
      </div>
      <h1 class="mint-header-title"><span>跟进记录</span>　</h1>
      <div class="mint-header-button is-right" @click="goAdd">
        <button class="mint-button mint-button--default mint-button--normal fang-btn-padding">
          添加
        </button>
      </div>
    </header>
    <div style="height:40px"></div>
    <div class="fang-task-box fang-follow">
      <div class="fang-task-bd" v-for="fl in follow" @click="goDetail(fl)">
        <div class="fang-task-top"><label style="font-size:15px">{{fl.tags}}</label>
          <span>{{DateFmt(fl.addTime,'yyyy-MM-dd hh:mm')}}</span>
        </div>
        <div class="fang-task-bt fang-follow" style="border-bottom:1px dashed #ccc;">{{fl.noteBak}}</div>
        <div class="fang-task-bt fang-follow">
          <label style="font-size:14px">下次跟进时间</label>
          <span style="float:right;">{{DateFmt(fl.nextTime,'yyyy-MM-dd hh:mm')}}</span></div>
      </div>
      <div style="padding:10px" v-if="follow.length==0">
        <my-block></my-block>
        <my-block></my-block>
        <mt-button type="default" @click.native="$router.push({'name':'follow-add'})" size="large">添加跟进记录</mt-button>
      </div>
    </div>
    <my-block></my-block>
  </div>
</template>

<script>
  import { MessageBox, Toast, Indicator } from 'mint-ui';

  export default {
    data() {
      return {
        selected: -1,
        popupStatus: false,
        sexPopupStatus: false,
        sexTmp: "",
        sexTypes: ['男', '女'],
        titles: ['日期', '筛选'],
        followType: ['已过期', '今天', '本周', '本月'],
      }
    },  
    created() {
        this.$store.dispatch('follow/follow_request',this.customer.ID);
    },
    computed: {
      follow() {
        // if(this.$route.query.id){
        //   return this.$store.getters["follow/followSelect"];
        // }
        return this.$store.getters["follow/follow"];
      },
      customer() {
        return this.$store.getters['customer/customer'];
      },
    },
    methods: {
      fnback(){
        this.$router.go(-1);
      },
      goDetail(fl){
        this.$store.dispatch('follow/follow_select',fl);
        this.$router.push({name:'follow-detail',query:{id:fl.userID}});
      },
      goAdd(){
        this.$router.push({name:'follow-add'});
      }
    },
    watch: {
    },
    beforeRouteLeave(to, from, next) {
      if (this.popupStatus) {
        this.popupStatus = !this.popupStatus;
        next(false);
      } else {
        next();
      }
    }
  }

</script>

<style>
  .mint-header-title span,
  .mint-header-title img {
    vertical-align: middle;
  }
  
  .mint-button.fang-btn-padding {
    padding: 0 6px;
  }
  
  .fang-task-box.fang-follow .fang-task-bd {
    padding: 10px 10px 0 10px;
    background: #fff;
    margin-bottom: 5px;
  }
  
  .fang-navbar-sign .mint-tab-item {
    position: relative
  }
  
  .fang-navbar-sign .mint-tab-item::before {
    content: " ";
    position: absolute;
    right: 0;
    bottom: 4px;
    color: #d9d9d9;
    top: 4px;
    width: 1px;
    border-right: 1px solid #d9d9d9;
    /*-webkit-transform-origin: 100% 0;
  transform-origin: 100% 0;
  -webkit-transform: scaleX(.5);
  transform: scaleX(.5)*/
  }
  
  .fang-task-box {
    font-size: 17px;
  }
  
  .fang-task-box .fang-task-hd {
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    position: relative;
    /*padding: 0 10px;*/
  }
  
  .fang-task-box .fang-task-left {
    color: #55acee;
    width: 80%;
    float: left;
  }
  
  .fang-task-box .fang-task-right {
    float: right;
    width: 20%;
    color: #333;
  }
  
  .fang-task-box .fang-task-top span {
    font-size: 14px;
    color: #999;
    float: right
  }
  
  .fang-task-box .fang-task-bt {
    font-size: 14px;
    color: #666;
  }
  
  .fang-task-box .fang-task-bt.fang-follow {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    line-height: 30px;
  }
</style>