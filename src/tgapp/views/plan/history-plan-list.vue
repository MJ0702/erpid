<template>
  <div>
    <header class="mint-header is-fixed">
      <div class="mint-header-button is-left" @click="$router.history.go(-1)">
        <my-icon href="fanhui" size="22" style="fill:#fff"></my-icon>
      </div>
      <div class="center-button single-over"  @click="changeCpyVisble">
        <span class="header-title single-over middle-span">{{sel_cpy.cpyName}}</span>
        <my-icon  v-if="sel_cpy_list.length>1" href="arrow-down" size="16" style="fill:#fff;margin-top:4px;"></my-icon>
      </div>
      <div class="mint-header-button is-right" @click="goBefore">
        当前报账
      </div>
    </header>
    <div style="height:40px;"></div>
    <div class="rounded-rect">
      <div class="label-box" @click="openPicker('startPicker')">
        <span class="middle-span">{{query.startDate}}</span>
      </div>
      -
      <div class="label-box" @click="openPicker('endPicker')">
        <span class="middle-span" v-text="query.endDate"></span>
      </div>
      <div class="rounded-right">
        <input class="" v-model="query.skey" placeholder="线路名称、团号">
        <span @click="fnCpyPlanQuery" class="search-btn">搜索</span>
      </div>
    </div>
    <div class="tour-count-box">
      <div class="left-item">
        <div class="logo-box">
          <my-icon href="daofu" size="22"></my-icon>
        </div>
        <div class="content-box">
          <div class="content-name">导服费(人民币)</div>
          <div class="content-price">{{owner_info.guideAmount}}</div>
        </div>
      </div>
      <div class="center-item">
      </div>
      <div class="right-item">
        <div class="logo-box">
          <my-icon href="daofu" size="22"></my-icon>
        </div>
        <div class="content-box">
          <div class="content-name">历史带团数(个)</div>
          <div class="content-price">{{owner_info.planNum}}</div>
        </div>
      </div>
    </div>
    <div style="height:10px"></div>
    <div class="box-list"  v-for="item in history_plan_list">
      <div class="box-order-list header">
        <div class="left-item">
          <span class="title-name">{{item.lineTitle}}</span>
        </div>
        <!-- 审核状态 -->
        <div class="head-right-item">￥{{item.guideAmount}}</div>
      </div>
      <div class="box-flex">
        <div class="box-flex-left">
          <div class="box-order-list header header-1" style="padding-bottom: 0">
            <div class="left-item">
              <span class="body-title-name">团号:{{item.planCode}}</span>
            </div>
            <div class="right-item">导游服务费</div>
          </div>
        </div>
      </div>
      <div class="box-order-list footer">
        <div class="left-item">
          <span class="body-title-name">出团时间 : </span>
          <span class="title-value price-1">{{ DateFmt(item.planDate,'yyyy-MM-dd')}}</span>
        </div>
        <div class="left-item" style="text-align: right">
          <span class="body-title-name">报账审结时间 : </span>
          <span class="title-value price-1">{{ DateFmt(item.backDate,'yyyy-MM-dd')}} </span>
        </div>
      </div>
    </div>
    <div class="david-border">-------已经见底了-------</div>
    <mt-popup v-model="cpyVisible" style="width:100%;top:40px;left:0;transform: none;" pop-transition="popup-fade" :modal="false">
        <div class="popup-cpy-list" :style="item.erpId === sel_cpy.erpId?'color:#409eff':''" @click="changeCpy(item)" v-for="item in sel_cpy_list">{{ item.cpyName }}</div>
      </mt-popup>
    <yd-datetime style="display:none" 
    type="date" ref="startPicker" 
    :startDate="startDate" 
    :endDate="endDate"
     v-model="query.startDate"
    slot="right"></yd-datetime>
    <yd-datetime style="display:none" 
    type="date" ref="endPicker" 
    :startDate="startDate" 
    :endDate="endDate"
     v-model="query.endDate"
    slot="right"></yd-datetime>
  </div>
</template>
<script>
  import {
    Toast
  } from "mint-ui";
  export default {
    name: "component_name",
    data() {
      return {
        cpyVisible: false,
        skey:'',
        startDate: DateFmt(new Date(), 'yyyy-MM-dd', 'y-1'),
        endDate: DateFmt(new Date(), 'yyyy-MM-dd'),
        reimbursement:{'0':'未报帐','1':'计调审核','2':'财务审核','-1':'计调拒绝','-2':'财务拒绝'}
      };
    },
    created() {
      let erpId=Number(this.$route.query.erpId)
      // let erpId=2
      this.$store.dispatch('tgapp/clear_history_plan_query')
      if(!this.erpId){
        this.$store.dispatch('tgapp/sel_cpy_list').then((end)=>{
          let sel_cpy=end.find((x)=>{
            return x.erpId===erpId
          })     
          console.log('selcpy:',sel_cpy)
          this.$store.dispatch('tgapp/change_sel_cpy', sel_cpy)
          this.$store.dispatch('tgapp/change_erpId', sel_cpy.erpId)
          this.$store.dispatch('tgapp/history_cpy_plan')
        })
        return;
      }
      this.$store.dispatch('tgapp/history_cpy_plan')
      this.$store.dispatch('tgapp/owner_info')
    },
    computed: {
      owner_info(){
        return this.$store.getters['tgapp/owner_info']
      },
      sel_cpy() {
        return this.$store.getters['tgapp/sel_cpy']
      },
      erpId() {
        return this.$store.getters['tgapp/erpId']
      },
      sel_cpy_list() {
        return this.$store.getters['tgapp/sel_cpy_list']
      },
      history_plan_list() {
        return this.$store.getters['tgapp/history_plan_list']
      },
      query(){
        let query = this.$store.getters['tgapp/history_plan_query']
        query.startDate = DateFmt(query.startDate,'yyyy-MM-dd','M-1')
        return query
      }
    },
    methods: {
      goBefore() {
        let erpId=this.$route.query.erpId
        this.$router.push({path:'tgapp-plan-list',query:{erpId:erpId}})
      },
      changeCpyVisble() {
        if(this.sel_cpy_list.length===1){
          return;
        }
        this.cpyVisible = !this.cpyVisible
      },
      changeCpy(item){
        this.$store.dispatch('tgapp/change_sel_cpy',item)
        this.$store.dispatch('tgapp/change_erpId',item.erpId)
        this.$store.dispatch('tgapp/history_cpy_plan')
        this.cpyVisible = false
        this.$router.replace({path:'tgapp-history-plan-list',query:{erpId:item.erpId}})
      },
      fnCpyPlanQuery(){
        this.$store.dispatch('tgapp/history_cpy_plan')
      },
      openPicker(picker){
        this.$refs[picker].open()
      },
      handleChange(val){
        console.log('startdate:',this.query.startDate)
      },
    }
  }
</script>
<style lang="less" scoped>
  .header-title {
    height: 26px;
    line-height: 23px;
    color: rgba(255, 255, 255, 1);
    font-size: 16px;
    text-align: center;
    flex: 1;
    -webkit-box-flex: 1;
  }

  .center-button {
    width: 55%;
    display: flex;
  }

  .rounded-rect {
    height: 44px;
    line-height: 44px;
    color: #909399;
    font-size: 14px;
    text-align: center;
    font-family: Arial;
    background: #fff;
    display: flex;
  }

  .label-box {
    flex: 1;
    -webkit-box-flex: 1;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    text-align: center;
    font-family: Arial;

  }

  .rounded-right {
    flex: 2;
    -webkit-box-flex: 2;
    text-align: ;
    input {
      width: 100px;
      height: 30px;
      line-height: 16px;
      border-radius: 100px;
      color: rgba(144, 147, 153, 1);
      font-size: 11px;
      text-align: left;
      font-family: Arial;
      border: 1px solid rgba(192, 196, 204, 1);
      padding-left: 20px;
      display: inline-block;
    }
    .search-btn {
      width: 40px;
      height: 34px;
      line-height: 34px;
      color: rgba(144, 147, 153, 1);
      font-size: 14px;
      text-align: center;
      font-family: Arial;
      display: inline-block
    }
  }

  .tour-count-box {
    display: flex;
    height: 67px;
    background: #fff;
    margin-top:1px;
    .center-item {
      width: 2px;
      height: 23px;
      background: #f0f0f0;
      margin: auto 0;
    }
    .left-item {
      flex: 1;
      -webkit-box-flex: 1;
      overflow: hidden;

    }
    .right-item {
      flex: 1;
      -webkit-box-flex: 1;
    }
    .logo-box {
      width: 48px;
      height: 67px;
      line-height: 67px;
      text-align: center;
      float: left;
    }
    .content-box {
      float: left;
      padding: 11px 0 10px 0;
      .content-name {
        height: 23px;
        line-height: 20px;
        color: rgba(144, 147, 153, 1);
        font-size: 14px;
      }
      .content-price {
        height: 23px;
        line-height: 23px;
        color: rgba(48, 49, 51, 1);
        font-size: 16px;
      }
    }
  }
</style>
<style>
  .box-list {
    background: #fff;
  }

  .box-flex {
    display: flex;
    padding: 0;
  }

  .box-flex-left {
    flex: 1;
  }

  .box-flex-right {
    width: 40px;
    position: relative;
  }

  .box-flex-right svg.icon {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0, -50%)
  }

  .box-order-title {
    line-height: 18px;
    /* font-size: 12px; */
    font-size: 0.24rem;
    color: #333;
    padding-top: 6px;
  }

  .box-half-border {
    height: 1px;
    width: 100%;
    background: #d9d9d9;
    transform: scaleY(.5);
  }

  .box-details-list {
    padding: 0 10px;
    position: relative;
    background: #fff;
    padding-bottom: 6px;
    margin-bottom: 8px;
  }

  .box-details-list.list-3::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: #d9d9d9;
  }

  .box-order-list {
    overflow: hidden;
    padding: 8px 10px 3px 10px;
    position: relative;
    font-size: 0.22rem;

  }

  .box-order-list.header.header-1 {
    padding-top: 0;
  }



  .box-order-list .left-item {
    width: 50%;
    float: left;
    line-height: 24px;
    /* font-size: 12px; */
    overflow: hidden;
    color: rgb(107, 107, 107);
  }

  .box-order-list.header .left-item .title-name {
    /* font-size: 0.28rem; */
    height: 23px;
    line-height: 23px;
    color: rgba(96, 98, 102, 1);
    font-size: 16px;
    text-align: center;

  }

  .box-order-list.footer .left-item {
    line-height: 27px;
  }

  .box-order-list.header .left-item {
    color: #6B6B6B;
  }

  .box-order-list.header .left-item span {
    height: 23px;
    line-height: 23px;
    color: rgba(144, 147, 153, 1);
    font-size: 14px;
    text-align: left;
  }

  .box-order-list .head-right-item {
    width: 50%;
    float: left;
    overflow: hidden;
    height: 29px;
    line-height: 29px;
    color: rgba(245, 108, 108, 1);
    font-size: 20px;
    text-align: right;
    font-family: Arial;
  }


  .box-order-list .right-item {
    width: 50%;
    float: left;
    /* font-size: 12px; */
    overflow: hidden;
    text-align: right;
    height: 23px;
    line-height: 23px;
    color: rgba(192, 196, 204, 1);
    font-size: 14px;
  }

  .box-order-list.footer .left-item {
    height: 23px;
    line-height: 23px;
    color: rgba(192, 196, 204, 1);
    font-size: 12px;
    text-align: left;
    font-family: Microsoft Yahei;

  }

  .box-order-list.footer::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 1px;
    background: #d4d4d4;
    transform: scaleY(.5);
  }
</style>