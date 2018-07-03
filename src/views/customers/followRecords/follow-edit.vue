<template>
  <div class="follow-info-block">
    <div style="height:40px"></div>
    <mt-header title="修改跟进记录" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
      <mt-button slot="right" @click="followEdit">保存</mt-button>
    </mt-header>
    <mt-cell title="客户名称" class="input-right require-field" :value="customer.cpyName">
    </mt-cell>
    <mt-cell title="跟进方式" @click.native="popShow(1)" :value="follow.tags || '请选择'" is-link class="require-field input-right">
    </mt-cell>
    <mt-field class="" rows="4" type="textarea" placeholder="请输入跟进内容" v-model="follow.noteBak"></mt-field>
    <mt-cell title="下次跟进时间" class="input-right" :value="follow.nextTime || '请选择'" is-link @click.native="openPicker">
    </mt-cell>
    <mt-header :title="['','跟进方式'][showWhich]" fixed v-if="popupStatus" style="z-index:2101">
      <a slot="left">
        <mt-button icon="back" @click="popupStatus=!popupStatus">返回</mt-button>
      </a>
    </mt-header>
    <mt-popup v-model="popupStatus" popup-transition="popup-fade" position="right" class="my-popup-right">
      <div style="height:40px"></div>
      <div v-if="showWhich==1">
        <mt-cell v-for="tag in tags" @click.native="fnTagSelect(tag)" :title="tag"></mt-cell>
      </div>
    </mt-popup>
    <yd-datetime  style="display:none" type="date" ref="picker" :startDate="startDate" v-model="follow.nextTime"
    slot="right"></yd-datetime>
    <my-bottom-box>
      <mt-button type="primary" @click.native="followEdit" size="large">保存</mt-button>
    </my-bottom-box>
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
      console.log('this.$store.getters:',this.$store.getters['mine/mine']);
    },
    computed: {
      customer() {
        return this.$store.getters['customer/customer'];
      },
      follow() {
        return this.$store.getters['follow/followSelect'];
      },
      userID() {
        return this.$store.getters['mine/mine'].ID;
      },
      // customerSelect() {
      //   return this.$store.getters['customer/customerSelect'];
      // },
    },
    methods: {
      fnClear(){
        this.follow.doupdateTime='';
        this.dateValue= DateFmt(new Date(), 'yyyy-MM-dd');
      },
      followEdit() {
        let id;
        this.follow.userID=this.userID;
        this.follow.cpyID= this.customer.cpyID;
        let follow={};
        follow.ID=this.follow.ID;
        follow.tags=this.follow.tags;
        follow.noteBak=this.follow.noteBak;
        follow.nextTime=this.follow.nextTime;
        if (!this.follow.tags) {
          Toast('跟进方式未填写');
          return;
        }
        if (!this.follow.noteBak) {
          Toast('跟进记录未填写');
          return;
        }
        if (!this.follow.nextTime) {
          Toast('下次跟进时间未填写');
          return;
        }

        this.$store.dispatch('follow/follow_edit',follow).then(end => {
          if (end.success) {
            Toast('添加成功');
            this.$router.go(-1);
          } else {
            Toast(end.msg);
          }
        });
      },
      fnCusSelect(item) {
        this.cpyName = item.cpySimName;
        this.follow.userID = item.userID;
        this.popupStatus = !this.popupStatus;
      },
      fnTagSelect(item) {
        this.follow.tags = item;
        this.popupStatus = !this.popupStatus;
      },
      fnFrSelect(item) {
        console.log(item);
        this.isWorked = item.label;
        this.follow.isWorked = item.value;
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