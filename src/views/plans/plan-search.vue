<template>
  <div class="plan-search">
    <mt-header title="团期筛选" fixed>
      <!-- <router-link to="/plan-search" @click.native="backClick" slot="left" replace>
        <mt-button icon="back">返回</mt-button>
      </router-link> -->
      <a @click="backClick" slot="left" replace>
        <mt-button icon="back">返回</mt-button>
      </a>
      <!-- <mt-button slot="right" @click="$router.go(-1)">取消</mt-button> -->
    </mt-header>
    <div style="height:40px"></div>

    <my-block></my-block>
    <mt-cell title="线路类别" :value="query.lineType" is-link @click.native="lineTypeClick"></mt-cell>
    <my-block bottom left>出团日期</my-block>
    <mt-cell title="开始日期" :value="DateFmt(query.startDate,'yyyy-MM-dd')" is-link @click.native="startDateClick"></mt-cell>
    <mt-cell title="结束日期" :value="DateFmt(query.endDate,'yyyy-MM-dd')" is-link @click.native="endDateClick"></mt-cell>
    <my-block bottom left>关键字</my-block>
    <mt-field label="线路名称" placeholder="请输入线路名称" v-model="query.lineKey"></mt-field>
    <mt-field label="团号" placeholder="请输入团号" v-model="query.plancodeKey"></mt-field>
    <my-block></my-block>
    <mt-cell title="起止城市" :value="query.fromCity" is-link @click.native="fromCityClick"></mt-cell>
    <mt-cell title="团期状态" :value="query.isLock" is-link @click.native="isLockClick"></mt-cell>
    <mt-cell title="团期类型" :value="query.planType" is-link @click.native="planTypeClick"></mt-cell>
    <mt-cell title="经营类型" :value="operateTypeShow" is-link @click.native="operateTypeClick"></mt-cell>
    <mt-cell title="只看有余位">
      <mt-switch v-model="query.isYuWei" @change="handleChange"></mt-switch>
    </mt-cell>
    <mt-cell title="包括取消团">
      <mt-switch v-model="query.isCancelPlan" @change="handleChange"></mt-switch>
    </mt-cell>
    <mt-cell title="显示市场价">
      <mt-switch v-model="showPrice.sadultPrice" @change="handleChange"></mt-switch>
    </mt-cell>
    <mt-cell title="显示同行价">
      <mt-switch v-model="showPrice.adultPrice" @change="handleChange"></mt-switch>
    </mt-cell>
    <!-- <details>
      <summary>
        <mt-cell title="团期类型" :value="planType.title" is-link></mt-cell>
      </summary>
      <nav>
        <my-radio :title="p.title" name="planType" @click.native="planTypeSelect(p)" v-for="p in planTypes"></my-radio>
      </nav>
    </details> -->
    <my-pad></my-pad>
    <my-button-block fixed>
      <mt-button type="primary" size="large" @click.native="searchPlan">搜索</mt-button>
    </my-button-block>

    <mt-header :title="['','线路类别','起止城市','团期状态'][showWhich]" v-if="popupStatus" fixed style="z-index:2100">
      <router-link to="/plan-search" slot="left">
        <mt-button icon="back" @click="popupStatus=!popupStatus">返回</mt-button>
      </router-link>
      <!-- <mt-button slot="right" @click="popupStatus=!popupStatus">取消</mt-button> -->
    </mt-header>
    <mt-popup v-model="popupStatus" popup-transition="popup-fade" position="right" class="my-popup-right">
      <div style="height:40px"></div>

      <!-- 线路类别右侧弹出 -->
      <mt-checklist v-model="query.lineTypes" :options="lineTypeOptions" @change="lineTypesChange" v-if="showWhich==1"></mt-checklist>
      <!-- 起止城市右侧弹出 -->
      <mt-checklist v-model="query.fromCitys" :options="fromCityOptions" @change="fromCitysChange" v-if="showWhich==2"></mt-checklist>
      <!-- 团期状态右侧弹出 -->
      <mt-checklist v-model="isLocksAll" :options="['全选']" @change="isLocksAllChange" v-show="showWhich==3" class="checklist-beauty"></mt-checklist>
      <mt-checklist v-model="query.isLocks" :options="isLockOptions" @change="isLocksChange" v-if="showWhich==3" class="checklist-beauty"></mt-checklist>
      <my-pad></my-pad>
    </mt-popup>
    <my-button-block fixed v-if="popupStatus" style="z-index:2100">
      <mt-button type="primary" size="large" @click.native="popupStatus=!popupStatus">确定</mt-button>
    </my-button-block>
    <!-- 日期下方弹出 -->
    <!--<mt-datetime-picker v-model="dateValue" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"
      @confirm="dateSelect" ref="picker">
    </mt-datetime-picker>-->
    <!-- 团期类型下方弹出 -->
    <mt-popup v-model="planTypePopupStatus" position="bottom" class="my-popup">
      <mt-picker :slots="planTypes" @change="planTypeSelect" showToolbar visibleItemCount="3">
        <span class="mint-datetime-action mint-datetime-cancel" @click="planTypeClick">取消</span>
        <span class="mint-datetime-action mint-datetime-confirm" @click="planTypeConfirm">确认</span>
      </mt-picker>
    </mt-popup>
    <yd-datetime style="display:none" type="date" ref="startTime" :startDate="startDate" :endDate="endDate" v-model="query.startDate"
      slot="right"></yd-datetime>
    <yd-datetime style="display:none" type="date" ref="endTime" :startDate="startDate" :endDate="endDate" v-model="query.endDate"
      slot="right"></yd-datetime>
    <!-- 经营状态下方弹出 -->
    <mt-popup v-model="operateTypePopupStatus" position="bottom" class="my-popup">
      <mt-picker :slots="operate_type" @change="operateTypeSelect" showToolbar visibleItemCount="3">
        <span class="mint-datetime-action mint-datetime-cancel" @click="operateTypeClick">取消</span>
        <span class="mint-datetime-action mint-datetime-confirm" @click="operateTypeConfirm">确认</span>
      </mt-picker>
    </mt-popup>
  </div>
</template>

<script>
  import Vue from 'vue';

  export default {
    data() {
      return {
        lineTypeOptions: [], //保存线路类别选择项
        fromCityOptions: [], //保存起止城市选择项
        isLockOptions: [ //团期状态选择项
          { label: '正常', value: '0,正常' },
          { label: '停售', value: '1,停售' },
          { label: '售罄', value: '3,售罄' },
          { label: '候补', value: '2,候补' },
          { label: '封团', value: '4,封团' },
          { label: '审结', value: '9,审结' },
          // {label: '取消', value: '-1,取消'},
        ],
        isLocksAll: [],
        planTypeTmp: "",
        operateTypeShow: '全部',
        operateTypeTmp: "",
        planTypePopupStatus: false,
        operateTypePopupStatus: false,
        popupStatus: false,
        showWhich: 0,
        dateValue: DateFmt(new Date(), 'yyyy-MM-dd'),
        routeLinkTo: {},
        goback: { name: "home" },
        isYuWei: false,
        isCancel: false,
        startDate: DateFmt(new Date(), 'yyyy-MM-dd', 'y-10'),
        endDate: DateFmt(new Date(), 'yyyy-MM-dd', 'y+10'),
      }
    },
    computed: {
      query() {
        let query=this.$store.getters["plan/plans_search_query"];
        query.startDate = DateFmt(query.startDate,'yyyy-MM-dd');
        return query;
      },
      showPrice() {
        return this.$store.getters["plan/showPrice"];
      },
      planTypes() {
        return [{ //团期类型选择项
          flex: 1,
          values: ['全部', '散', '团'],
          className: 'slot',
          defaultIndex: ['全部', '散', '团'].indexOf(this.query.planType),
        }]
      },
      operate_type() {
        return [{ //团期类型选择项
          flex: 1,
          values: ['全部', '自营', '他营'],
          className: 'slot',
          defaultIndex: ['全部', '自营', '他营'].indexOf('全部'),
        }]
      },
    },
    created() {
      let vm = this;
      Vue.http.post( //获取线路类别选择列表
        "line-plan/line-type",
        {},
        { emulateJSON: true }
      ).then(res => {
        if (!res.body) return;
        let rows = [];
        res.body.rows.forEach((v) => {
          rows.push({
            label: v.cnName,
            value: v.ID + "," + v.cnName,
          });
        })
        vm.lineTypeOptions = rows;
      });
      Vue.http.post( //获取起止城市选择列表
        "line-plan/from-city",
        {},
        { emulateJSON: true }
      ).then(res => {
        if (!res.body) return;
        let rows = [];
        if (res.body.rows) {
          res.body.rows.forEach((v) => {
            rows.push({
              label: v.CityName,
              value: v.ID + "," + v.CityName,
            });
          })
        }
        vm.fromCityOptions = rows;
      });
      if (this.query.isLocks.length == this.isLockOptions.length) {
        this.isLocksAll = ["全选"];
      }
    },
    watch: {
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        console.log(from);
        console.log(to);
        let n = "home";
        if (from && from.name) {
          n = from.name;
        }
        vm.goback.name = n;
      })
    },
    methods: {
      backClick() {
        this.$router.push(this.goback);
      },
      isLocksAllChange(val) {
        if (val.length > 0) {
          this.query.isLocks = this.isLockOptions.map(v => v.value);
          this.query.isLock = "全选";
          this.query.isLockID = "";
        } else {
          this.query.isLocks = [];
          this.query.isLock = "";
          this.query.isLockID = "";
        }
      },
      isLocksChange(val) {
        if (this.isLocksAll.length) {
          this.isLocksAll = [];
        }
        if (val.length == this.isLockOptions.length) {
          this.isLocksAll = ["全选"];
        }
        let isLock = "", isLockID = "";
        isLock = val.map(v => v.slice(v.indexOf(",") + 1, v.length)).toString();
        isLockID = val.map(v => v.slice(0, v.indexOf(","))).toString();
        if (isLock.length > 16) {
          isLock = isLock.slice(0, 16) + '...'
        }
        this.query.isLockID = isLockID;
        this.query.isLock = isLock;
      },
      fromCitysChange(val) {
        let fromCity = "", fromCityID = "";
        fromCity = val.map(v => v.slice(v.indexOf(",") + 1, v.length)).toString();
        fromCityID = val.map(v => v.slice(0, v.indexOf(","))).toString();
        if (fromCity.length > 16) {
          fromCity = fromCity.slice(0, 16) + '...'
        }
        this.query.fromCityID = fromCityID;
        this.query.fromCity = fromCity;
      },
      lineTypesChange(val) {
        let lineType = "", lineTypeID = "";
        lineType = val.map(v => v.slice(v.indexOf(",") + 1, v.length)).toString();
        lineTypeID = val.map(v => v.slice(0, v.indexOf(","))).toString();
        if (lineType.length > 16) {
          lineType = lineType.slice(0, 16) + '...'
        }
        this.query.lineTypeID = lineTypeID;
        this.query.lineType = lineType;
      },
      searchPlan() {
        this.$router.push({ path: "/line-plan" });
      },
      planTypeSelect(e, v) {
        this.planTypeTmp = v[0];
      },
      planTypeConfirm() {
        this.planTypePopupStatus = false;
        if (this.planTypeTmp) {
          this.query.planType = this.planTypeTmp;
        } else {
          this.query.planType = "全部";
        }
      },
      operateTypeSelect(e, v) {
        this.operateTypeTmp = v[0];
      },
      operateTypeConfirm() {
        let arr = ['全部', '自营', '他营'];
        this.operateTypePopupStatus = false;
        if (this.operateTypeTmp) {
          this.query.operate_type = arr.indexOf(this.operateTypeTmp) - 1;
          this.operateTypeShow = this.operateTypeTmp;
        } else {
          this.query.operate_type = "-1";
          this.operateTypeShow = "全部";
        }
      },
      dateSelect(v) {
        if (this.showWhich == 4) {
          this.query.startDate = v;
        } else if (this.showWhich == 5) {
          this.query.endDate = v;
        }
      },
      lineTypeClick() {
        this.showWhich = 1;
        this.popupStatus = !this.popupStatus;
      },
      fromCityClick() {
        this.showWhich = 2;
        this.popupStatus = !this.popupStatus;
      },
      isLockClick() {
        this.showWhich = 3;
        this.popupStatus = !this.popupStatus;
      },
      startDateClick() {
        // this.showWhich = 4;
        // console.log('startDate:', this.query.startDate);
        // this.dateValue = this.query.startDate;
        // this.$refs.picker.open();
        this.$refs.startTime.open();
      },
      endDateClick() {
        // this.showWhich = 5;
        // this.dateValue = this.query.endDate;
        // this.$refs.picker.open();
        this.$refs.endTime.open();
      },
      planTypeClick() {
        this.planTypePopupStatus = !this.planTypePopupStatus
      },
      operateTypeClick() {
        this.operateTypePopupStatus = !this.operateTypePopupStatus
      },
    },
    beforeRouteLeave(to, from, next) {
      if (this && this.popupStatus) {
        this.popupStatus = !this.popupStatus;
        next(false);
      } else {
        next();
      }
    },
  }

</script>

<style>

</style>