<template>
  <div>
    <header class="mint-header is-fixed">
      <div class="mint-header-button is-left" @click="fnOwner">
        <my-icon href="mine" size="22" style="fill:#fff"></my-icon>
        <!-- <svg class="icon my-icon" aria-hidden="true" slot="icon" style="width:22px;height:22px;fill:#fff">
            <use xlink:href="#icon-mine"></use>
          </svg> -->
        <span class="middle-span">我的</span>
      </div>
      <div class="center-button">
        <!-- <input type="text" class="" placeholder="请输入公司名称"> -->
        首页
      </div>
      <div class="mint-header-button is-right">
        <my-icon href="bangzhu" size="22" style="fill:#fff"></my-icon>
        <span class="middle-span">帮助</span>
      </div>
    </header>
    <div style="height:44px;"></div>
    <div class="page-box">
      <div class="block-box">
        团期控台
      </div>
      <div class="box-plan-bill">
        <div class="left-item">
          <div class="cycle-item">
            <div class="item-text">
              12
            </div>
            <div class="item-text2">
              未完成报账
            </div>
          </div>
        </div>
        <div class="right-item">
          <div class="item">
            <div class="item-box">
              <div class="item-title">
                <my-icon size="20" style="fill:#C0C4CC" href="shizhong"></my-icon>
                <span class="middle-span">上次报账团期</span>
              </div>
              <div class="item-desc">
                <span>跟团游，我是跟团游....</span>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="item-box">
              <div class="item-title">
                <my-icon size="20" style="fill:#C0C4CC" href="muqian"></my-icon>
                <span class="middle-span">目前所带团期</span>
              </div>
              <div class="item-desc">
                <span>跟团游，我是跟团游....</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="box-bill">
        <div class="bill-item">
          <div class="item-title">
            <my-icon size="20" style="fill:#C0C4CC" href="shizhong1"></my-icon>
            <span class="item middle-span">行程结束待报账</span>
            <i class="mint-cell-allow-right my-define"></i>
          </div>
        </div>
        <div class="bill-item">
          <div class="item-title">
            <my-icon size="20" style="fill:#C0C4CC" href="shizhong2"></my-icon>
            <span class="item middle-span">报账提交待完结</span>
            <i class="mint-cell-allow-right my-define"></i>
          </div>
        </div>
      </div>
    </div>
    <my-block left bottom>公司列表</my-block>
    <div class="page-box">
      <div class="body-list">
        <div class="body-item" v-for="item in sel_cpy_list" @click="goDetail(item)">
          <div class="left-item">
            <div class="item-title">
              {{item.cpyName}}
            </div>
            <div class="item-desc">
              {{item.ctProvince}} | {{item.ctCity}}
            </div>
          </div>
          <div class="right-item">
            <div class="item-content">{{item.planNum}}个团期</div>
          </div>
        </div>
      </div>
    </div>
    <mt-popup position="left" style="top:50%;height:100%;width:70%;background: #fff;" v-model="ownerVisible">
      <div class="owner-banner">
        <div class="owner-banner-hd">
          {{guideName.guideName}}
        </div>
        <div class="owner-banner-bd">
          <div class="item">导游费（人民币）</div>
          <div class="item">带团数（个）</div>
        </div>
        <div class="owner-banner-bd">
          <div class="item count">{{owner_info.guideAmount}}</div>
          <div class="item count">{{owner_info.planNum}}</div>
        </div>
      </div>
      <div class=""></div>
      <div class="owner-item">
        <my-icon href="bangzhu" size="20" style="fill:#c0c4cc"></my-icon>
        <span class="owner-item-title middle-span">帮助中心</span>
      </div>
      <div class="owner-item">
        <my-icon href="erji" size="20" style="fill:#c0c4cc"></my-icon>
        <span class="owner-item-title middle-span">问题反馈</span>
      </div>
      <div class="owner-item">
        <my-icon href="dengchu" size="20" style="fill:#c0c4cc"></my-icon>
        <span class="owner-item-title middle-span" @click="logout">登出账号</span>
      </div>
    </mt-popup>
  </div>
</template>
<script>
    import {
    Toast
  } from "mint-ui";
  export default {
    name: "index",
    data() {
      return {
        ownerVisible: false,
      };
    },
    created() {
      console.log(1111)
      this.$store.dispatch('tgapp/sel_cpy_list').catch(err=>{
        Toast('未登录,1.5秒后跳转回登录页面')
        setTimeout(()=>{
          this.logout();
        },1500)
      })
      this.$store.dispatch('tgapp/owner_info')
      this.$store.dispatch('tgapp/guideName')
    },
    computed: {
      sel_cpy_list() {
        return this.$store.getters['tgapp/sel_cpy_list']
      },
      owner_info(){
        return this.$store.getters['tgapp/owner_info']
      },
      guideName(){
        return this.$store.getters['tgapp/guideName']
      },
    },
    methods: {
      goDetail(item) {
        this.$router.push({path:'tgapp-plan-list',query:{erpId:item.erpId}})
        this.$store.dispatch('tgapp/change_erpId', item.erpId)
        this.$store.dispatch('tgapp/change_sel_cpy', item)
      },
      fnOwner() {
        this.ownerVisible = !this.ownerVisible
      },
      logout(){
        let $origin=location.origin;
        if($origin.indexOf('192')>0||$origin.indexOf('127')>0){
          location.href=$origin+"/login.html";
          return false;
        }
        location.href=$origin+'/sys/weixin/tgapp/login.html'
      }
    }
  }
</script>
<style lang="less" scoped>
  .owner-item{
    padding-top:20px;
    padding-left:25px;
    .owner-item-title{
      margin-left:5px;
      display:inline-block;
      height: 23px;
      line-height: 23px;
      color: rgba(96, 98, 102, 1);
      font-size: 16px;
      font-family: Arial;

    }
  }
  .owner-banner {
    width: 100%;
    background: url('../assets/owner-info-banner.png') no-repeat;
    background-size:cover;
    height: 160px;
    border-box: box-sizing;
    .owner-banner-hd {
      padding: 30px 0 21px 21px;
      left: 130px;
      height: 32px;
      line-height: 32px;
      color: rgba(255, 255, 255, 1);
      font-size: 22px;
    }
    .owner-banner-bd {
      display: flex;
      .item {
        -webkit-box-flex: 1;
        flex: 1;
        padding-left: 21px;
        left: 130px;
        height: 32px;
        line-height: 17px;
        color: rgba(255, 255, 255, 1);
        font-size: 12px;
        text-align: left;
        font-family: Arial;
        &.count {
          height: 29px;
          line-height: 29px;
          color: rgba(255, 255, 255, 1);
          font-size: 20px;
          text-align: left;
          font-family: Arial;
        }
      }
    }
  }

  .mint-cell-allow-right.my-define:after {
    width: 8px;
    height: 8px;
  }

  .mint-header {
    height: 44px;
  }

  .center-button {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }

  .center-button input {
    width: 100%;
    height: 30px;
    line-height: 20px;
    border-radius: 100px;
    background-color: rgba(0, 123, 212, 1);
    color: #fff;
    font-size: 14px;
    text-align: left;
    padding-left: 15px;
    font-family: Microsoft Yahei;
    border: 0;
    outline: none;
  }

  .center-button input::-webkit-input-placeholder {
    color: #fff;
  }

  .center-button input::-moz-placeholder {
    color: #fff;
  }

  .block-box {
    line-height: 48px;
    padding-left: 10px;
    color: #909399;
    font-size: 14px;
  }

  .page-box {
    background: #fff;

  }

  .box-bill {
    position: relative;
    display: -webkit-box;
    display: box;
    padding: 10px 0;
    .bill-item {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      .item-title {
        padding: 0 10px;
        height: 23px;
        line-height: 20px;
        color: rgba(96, 98, 102, 1);
        font-size: 14px;
        font-family: Arial;
        position: relative;
      }
    }
    &::after {
      content: '';
      top: 4px;
      bottom: 4px;
      left: 50%;
      position: absolute;
      width: 1px;
      background: #d9d9d9;
      transform: scaleX(.5);
    }
  }

  .box-plan-bill {
    display: -webkit-box;
    display: box;
    /* border-top: 1px solid #EDF6FF; */
    border-top: 1px solid #EDF6FF;
    .left-item {
      width: 130px;
      padding: 15px;
      border-bottom: 1px solid #EDF6FF;
      .cycle-item {
        width: 100px;
        height: 100px;
        line-height: 14px;
        border-radius: 100px;
        background-color: rgba(64, 158, 255, 1);
        color: rgba(189, 223, 255, 1);
        font-size: 12px;
        text-align: center;
        box-shadow: 0px 0px 14px 0px rgba(117, 189, 255, 1);
        font-family: Arial;
        border: 1px solid rgba(255, 255, 255, 1);
        .item-text {
          margin-top: 25px;
          width: 28px;
          height: 38px;
          line-height: 35px;
          color: rgba(255, 255, 255, 1);
          font-size: 24px;
          text-align: center;
          left: 51px;
          font-family: Arial;
          margin-left: 35px;
        }
        .item-text2 {
          width: 100%;
          line-height: 14px;
          font-size: 12px;
        }
      }
    }
    .right-item {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      .item {
        border-bottom: 1px solid #EDF6FF;
        border-left: 1px solid #EDF6FF;
        padding: 10px;
        display:flex;
        .item-box{
          -webkit-box-flex:1;
          flex:1;
        }
        .item-title {
          height: 23px;
          line-height: 23px;
          color: rgba(96, 98, 102, 1);
          font-size: 16px;
          text-align: left;
        }
        .item-desc {
          height: 23px;
          line-height: 17px;
          color: rgba(144, 147, 153, 1);
          font-size: 12px;
          text-align: left;
        }
      }
    }
  }

  .body-list {
    .body-item {
      display: -webkit-box;
      display: box;
      .left-item {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        padding-top: 13px;
        padding-left: 11px;
        padding-bottom: 11px;
        border-bottom: 1px solid rgba(255, 255, 255, 1);
        .item-title {
          height: 23px;
          line-height: 23px;
          color: rgba(96, 98, 102, 1);
          font-size: 16px;
          text-align: left;

        }
        .item-desc {
          margin-right: 10px;
          height: 23px;
          line-height: 17px;
          color: rgba(144, 147, 153, 1);
          font-size: 12px;
          text-align: left;
          font-family: Arial;

        }
      }
      .right-item {
        padding: 24px 0;
        margin-right: 10px;
        .item-content {
          height: 23px;
          line-height: 17px;
          color: rgba(96, 98, 102, 1);
          font-size: 12px;
          text-align: center;
          font-family: Arial;
        }
      }

    }
  }
</style>