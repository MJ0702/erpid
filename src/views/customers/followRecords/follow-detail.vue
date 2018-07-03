<template>
  <div class="follow-info-block">
    <div style="height:40px"></div>
    <mt-header title="跟进记录详情" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
      <mt-button slot="right" @click="followEdit">修改</mt-button>
    </mt-header>
    <mt-cell title="客户名称" class="input-right" :value="follow.cpyName">
    </mt-cell>
    <mt-cell title="跟进方式" :value="follow.tags" class="input-right">
    </mt-cell>
    <div style="padding:0 0 0 10px;background: #fff">
    <div class="my-cell-title">跟进内容</div>
  </div>
    <mt-field rows="2" class="fang-sign" type="textarea" readonly placeholder="请输入跟进内容" v-model="follow.noteBak"></mt-field>
    <my-block></my-block>
    <mt-cell title="下次跟进时间" class="input-right" :value="DateFmt(follow.nextTime,'yyyy-MM-dd hh:mm')">
    </mt-cell>
    <mt-cell title="联系人" :value="follow.userName"></mt-cell>
    <my-block></my-block>
    <mt-cell title="添加人" :value="follow.admName"></mt-cell>
    <mt-cell title="添加时间" :value="DateFmt(follow.addTime,'yyyy-MM-dd hh:mm')"></mt-cell>
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
        showWhich: 0,
        tags: ['上门拜访', '电话联系', '短信联系', '邮件联系', 'QQ联系', '微信联系', '其它'],
        skey: '', 
        startDate: DateFmt(new Date(), 'yyyy-MM-dd'),
        dateValue: DateFmt(new Date(), 'yyyy-MM-dd'),
        cpyName: '',
        followResult: [
          { value: 0, label: '无效' },
          { value: 1, label: '有效' }
        ],
        isWorked: '有效',
      }
    },
    created() {
      console.log('this.$store.getters:',this.$store.getters['customer/customer']);
    },
    computed: {
      customer() {
        return this.$store.getters['customer/customer'];
      },
      userID() {
        return this.$store.getters['mine/mine'];
      },
      follow(){
        return this.$store.getters['follow/followSelect'];
      },
    },
    watch: {
    },
    methods: {
      followEdit() {
        let id=this.$route.query.id;
        this.$router.push({name:'follow-edit',query:{id:id}});
      },
      fnTagSelect(item) {
        this.follow.tags = item;
        this.popupStatus = !this.popupStatus;
      },
      dateSelect(v) {
        this.follow.doupdateTime = DateFmt(v, "yyyy-MM-dd hh:mm");
      },
      openPicker() {
        this.$refs.picker.open();
      },
      popShow(i) {
        this.popupStatus = !this.popupStatus;
        this.showWhich = i;
      },
    },
  }

</script>

<style scoped>
  .mint-header-title span,
  .mint-header-title img {
    vertical-align: middle;
  }
  
  .mint-button.fang-btn-padding {
    padding: 0 6px;
  }
  


  .fang-navbar-sign .mint-tab-item {
    position: relative
  }
  .my-cell-title{
    line-height: 34px;
    border-top: 1px solid #ddd;
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
</style>
<style>
  .mint-cell.fang-sign .mint-cell-wrapper{
    background-image:none;
  }
</style>