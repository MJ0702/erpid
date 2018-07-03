<template>
  <div>
    <header class="mint-header is-fixed">
      <div class="mint-header-button is-left" @click="$router.history.go(-1)">
        <my-icon href="fanhui" size="22" style="fill:#fff"></my-icon>
      </div>
      <div class="center-button single-over" @click="changeCpyVisble">
        <span class="header-title single-over middle-span">{{sel_cpy.cpyName}}</span>
        <my-icon v-if="sel_cpy_list.length>1" href="arrow-down" size="16" style="fill:#fff;margin-top:4px;"></my-icon>
      </div>
      <div class="mint-header-button is-right" @click="goNext()">
        历史报账
      </div>
    </header>
    <div style="height:84px"></div>
    <div class="rounded-rect-fixed">
      <div class="rounded-rect">
        <div class="label-box">
          <span class="middle-span">报账状态</span>
          <my-icon href="arrow-down" size="16" style="fill:#ccc;"></my-icon>
        </div>
        <div class="label-box">
          <span class="middle-span">出团时间</span>
          <my-icon href="arrow-down" size="16" style="fill:#ccc;"></my-icon>
        </div>
        <div class="rounded-right">
          <input class="" v-model="query.skey" placeholder="线路名称、团号">
          <span @click="fnCpyPlanQuery" class="search-btn">搜索</span>
        </div>
      </div>
    </div>
    <div class="list-count-box">
      <span>
        团量：{{ sel_cpy_plan.length }}个
      </span>
      <span class="long-tag">|</span>
      <span>
        行程结束需报账：{{ plan_end_count }}个
      </span>
    </div>
    <div class="card-list-box">
      <div class="card-list" v-for="item in sel_cpy_plan"  @click="planBill(item)">
        <div class="hd">
          <div class="title-tag single-over">{{item.lineTitle}}</div>
          <div class="type-tag">{{reimbursement[item.if_reimbursement]}}</div>
        </div>
        <div class="bd">
          <div class="bd-left">
            <div :class="item.amount>=0 ? 'single-over bz-count-price plus' : 'single-over bz-count-price reduce' ">              
              <span class="price-tag">￥</span>   
              {{ item.amount >=0 ? '+' : '-' }}           
              {{item.amount?Math.abs(item.amount).toFixed(2):'0.00'}}</div>
            <div class="bz-count-name">报账合计</div>
          </div>
          <div class="bd-right">
            <div class="bd-child-item1">
              <span class="content single-over">团号：{{item.planCode}}</span>
              <span class="status-tag">{{ item.status ? '正在进行' : '行程结束' }}</span>
            </div>
            <div class="bd-child-item2">往返时间：{{ DateFmt(item.planDate,'yyyy-MM-dd')}}/{{ DateFmt(item.backDate,'yyyy-MM-dd')}}</div>
            <div class="bd-child-item3">线路op：
              <span>{{item.opName}}</span>|
              <span>联系我</span>
              <a :href="'tel:'+item.mobile" v-on:click.stop v-if="item.mobile">
                <my-icon href="shouji" size="24" style="fill:#E6A23C"></my-icon>
              </a>
            </div>
          </div>
        </div>
        <div class="blank"></div>
        <div class="ft">
          <div class="ft-left">
            {{sel_cpy.cpyName}}
          </div>
          <div class="ft-right bt-normal-blue" @click="billAdd(item)">
            记一笔
          </div>
        </div>
      </div>
      <div class="david-border">-------已经见底了-------</div>
      <!-- <div class="card-list">
        <div class="hd">
          <div class="title-tag single-over">我是线路名称我是线路名称我是线路名称</div>
          <div class="type-tag">未报帐</div>
        </div>
        <div class="bd">
          <div class="bd-left">
            <div class="bz-count-price">
              <span class="price-tag">￥</span>10000.00</div>
            <div class="bz-count-name">报账合计</div>
          </div>
          <div class="bd-right">
            <div class="bd-child-item1">
              <span class="content">团号：txxfjsdkalfjkalj</span>
              <span class="status-tag">正在进行</span>
            </div>
            <div class="bd-child-item2">往返时间：2017-10-10/2017-10-20</div>
            <div class="bd-child-item3">线路op：
              <span>含精油尽快落实到借款方</span>|
              <span>联系我</span>
              <my-icon href="shouji" size="24" style="fill:#E6A23C"></my-icon>
            </div>
          </div>
        </div>
        <div class="blank"></div>
        <div class="ft">
          <div class="ft-left">
            深圳同天下科技有限公司
          </div>
          <div class="ft-right bt-normal-blue">
            记一笔
          </div>
        </div>
      </div> -->
    </div>
    <mt-popup v-model="cpyVisible" style="width:100%;top:40px;left:0;transform: none;" pop-transition="popup-fade" :modal="false">
      <div class="popup-cpy-list" :style="item.erpId === sel_cpy.erpId?'color:#409eff':''" @click="changeCpy(item)" v-for="item in sel_cpy_list">{{ item.cpyName }}</div>
    </mt-popup>
  </div>
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
        reimbursement:{'0':'未报帐','1':'计调审核','2':'财务审核','-1':'计调拒绝','-2':'财务拒绝'},
        clickFlag: false
      };
    },
    created() {
      let erpId= Number(this.$route.query.erpId)
      this.$store.dispatch('tgapp/clear_cpy_plan_query')
      if(!this.erpId){
        this.$store.dispatch('tgapp/sel_cpy_list').then(end=>{
          let sel_cpy_list=this.sel_cpy_list
          let sel_cpy=end.find((x)=>{
            return x.erpId===erpId
          })  
          // console.log('sel_cpy:',sel_cpy)
          this.$store.dispatch('tgapp/change_sel_cpy', sel_cpy)
          this.$store.dispatch('tgapp/change_erpId', sel_cpy.erpId)
          this.$store.dispatch('tgapp/sel_cpy_plan')
        })
        return;
      }
      this.$store.dispatch('tgapp/sel_cpy_plan')

    },
    computed: {
      sel_cpy() {
        return this.$store.getters['tgapp/sel_cpy']
      },
      erpId() {
        return this.$store.getters['tgapp/erpId']
      },
      plan_end_count(){
        return this.$store.getters['tgapp/plan_end_count']
      },
      sel_cpy_list() {
        return this.$store.getters['tgapp/sel_cpy_list']
      },
      sel_cpy_plan() {
        return this.$store.getters['tgapp/sel_cpy_plan']
      },
      query(){
        return this.$store.getters['tgapp/cpy_plan_query']
      }
    },
    methods: {
      goNext() {
        let erpId=this.$route.query.erpId
        this.$router.push({path:'tgapp-history-plan-list',query:{erpId:erpId}})
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
        this.$store.dispatch('tgapp/sel_cpy_plan')
        this.cpyVisible = false
        this.$router.replace({path:'tgapp-plan-list',query:{erpId:item.erpId}})
      },
      fnCpyPlanQuery(){
        this.$store.dispatch('tgapp/sel_cpy_plan')
      },
      billAdd(item){
        let erpId=item.erpid;
        let planId=item.planID;
        this.$router.push({path:'tgapp-bill-add',query:{erpId:erpId, planId:planId}});
        this.clickFlag = true;
      },
      // billList(item){
      //   if(this.clickFlag){
      //     this.clickFlag = false;
      //     return;
      //   }        
      //   let erpId=item.erpid;
      //   let planId=item.planID;
      //   this.$router.push({path:'tgapp-bill-list'})  
      //   this.$store.dispatch('tgapp/billList/change_erpId', erpId)
      //   this.$store.dispatch('tgapp/billList/change_planId', planId)
      // },
      planBill(item){
        if(this.clickFlag){
          this.clickFlag = false;
          return;
        }        
        let erpId=item.erpid;
        let planId=item.planID;
        this.$router.push({path:'tgapp-plan-bill',query:{erpId:erpId, planId:planId}})  
        this.$store.dispatch('tgapp/planBill/change_erpId', erpId)
        this.$store.dispatch('tgapp/planBill/change_planId', planId)
      }
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


  .rounded-rect-fixed{
    position:fixed;
    top:40px;
    left:0;
    right:0;
    z-index:10;
  }
  .rounded-rect {
    height: 44px;
    line-height: 44px;
    color: rgba(16, 16, 16, 1);
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
    color: rgba(16, 16, 16, 1);
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

  .list-count-box {
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    color: rgba(230, 162, 60, 1);
    font-size: 12px;
    text-align: left;
    font-family: Arial;
    span.long-tag {
      margin: 0 10px;
    }
  }

  .card-list-box {

    .card-list {
      margin-bottom: 10px;
      background: #fff;
      .hd {
        display: flex;
        height: 40px;
        padding: 8px 10px;
        .title-tag {
          flex: 1;
          -webkit-box-flex: 1;
          height: 23px;
          line-height: 23px;
          color: rgba(96, 98, 102, 1);
          font-size: 16px;
          text-align: left;
          font-family: Arial;
        }
        .type-tag {
          width: 50px;
          height: 23px;
          line-height: 23px;
          border-radius: 20px;
          background-color: rgba(239, 247, 230, 1);
          color: rgba(103, 194, 58, 1);
          font-size: 12px;
          text-align: center;
          font-family: Arial;
          border: 1px solid rgba(103, 194, 58, 1);
          box-sizing: border-box;
        }
      }
      .bd {
        display: flex;
        padding: 0 10px;
        .bd-left {
          flex: 1;
          -webkit-box-flex: 1;
          text-align: center;
          padding-right: 10px;
          .bz-count-price {
            height: 29px;
            line-height: 29px;
            //color: rgba(245, 108, 108, 1);
            font-size: 18px;
            text-align: center;
            font-family: Arial;
          }
          .bz-count-name {
            height: 23px;
            line-height: 20px;
            color: rgba(192, 196, 204, 1);
            font-size: 14px;
            text-align: center;
            font-family: Arial;
          }
        }
        .bd-right {
          flex: 2;
          -webkit-box-flex: 2;
          overflow: hidden;
          .bd-child-item1 {
            display: flex;
            .content {
              flex: 1;
              -webkit-box-flex: 1;
              height: 23px;
              line-height: 17px;
              color: rgba(144, 147, 153, 1);
              font-size: 12px;
              text-align: left;

            }
            .status-tag {
              width: 49px;
              height: 23px;
              line-height: 17px;
              color: rgba(64, 158, 255, 1);
              font-size: 12px;
              text-align: center;
            }
          }
          .bd-child-item2 {
            /* height: 23px; */
            line-height: 23px;
            color: rgba(144, 147, 153, 1);
            font-size: 12px;
            text-align: left;
            font-family: Arial;
          }
          .bd-child-item3 {
            height: 23px;
            line-height: 17px;
            color: rgba(144, 147, 153, 1);
            font-size: 12px;
            text-align: left;
            font-family: Arial;
          }
        }
      }
      .ft {
        display: flex;
        padding: 8px 10px;
        .ft-left {
          flex: 1;
          -webkit-box-flex: 1;
          height: 23px;
          line-height: 23px;
          color: rgba(192, 196, 204, 1);
          font-size: 12px;

        }
        .bt-normal-blue {
          width: 72px;
          height: 24px;
          line-height: 24px;
          opacity: 0.5;
          border-radius: 20px;
          background-color: rgba(64, 158, 255, 1);
          color: rgba(255, 255, 255, 1);
          font-size: 12px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 1);
          box-sizing: border-box;

        }
      }
    }
  }
  .popup-cpy-list:last-child{
 
  }
  .plus{
    color: #F56C6C;
  }
  .reduce{
    color: #67C23A;
  }
</style>