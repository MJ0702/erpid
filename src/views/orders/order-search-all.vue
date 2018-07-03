<template>
  <!--全部订单筛选-->
  <div class="order-search">
    <mt-header title="订单筛选" fixed>
      <router-link to="/order-all-list" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <!-- <mt-button slot="right" @click="$router.push({path: '/order-list'})">取消</mt-button> -->
    </mt-header>
    <div style="height:40px"></div>

    <my-block></my-block>
    <mt-cell title="订单状态" :value="query.isOKStr" is-link @click.native="isOKClick"></mt-cell>
    <mt-cell title="占位">
      <mt-switch v-model="query.isTicket"></mt-switch>
    </mt-cell>
    <my-block></my-block>
    <mt-cell title="日期类型" :value="query.dateType.title" is-link @click.native="dateTypeClick"></mt-cell>
    <mt-cell title="开始日期" :value="DateFmt(query.startdate,'yyyy-MM-dd')" is-link @click.native="startdateClick"></mt-cell>
    <mt-cell title="结束日期" :value="DateFmt(query.enddate,'yyyy-MM-dd')" is-link @click.native="enddateClick"></mt-cell>
    <my-block></my-block>
    <mt-field label="关键字" placeholder="请输入订单\客户\线路名称" v-model="query.skey"></mt-field>
    <my-button-block fixed>
      <mt-button type="primary" size="large" @click.native="searchOrder">搜索</mt-button>
    </my-button-block>

    <mt-header :title="['','订单状态','日期类型'][showWhich]" fixed v-if="popupStatus" style="z-index:2100">
      <router-link to="/order-search-all" slot="left">
        <mt-button icon="back" @click="popupStatus=!popupStatus">返回</mt-button>
      </router-link>
      <mt-button slot="right" @click="popupStatus=!popupStatus">取消</mt-button>
    </mt-header>
    <mt-popup v-model="popupStatus" popup-transition="popup-fade" position="right" class="my-popup-right">
      <div style="height:40px"></div>
      <!-- 订单状态右侧弹出 -->
      <!-- <mt-checklist v-model="isOKAll" :options="['全选']" @change="isOKAllClick" v-show="showWhich==1"></mt-checklist> -->
      <mt-checklist v-model="query.isOK" :options="isOKs" @change="isOKChange" v-if="showWhich==1"></mt-checklist>
      <!-- 日期类型右侧弹出 -->
      <my-radio :title="d.title" name="dateType" @click.native="dateTypeSelect(d)" :checked="d.value==query.dateType.value" v-for="d in dateTypes"
        v-show="showWhich==2"></my-radio>
    </mt-popup>
    <my-button-block fixed v-if="popupStatus" style="z-index:2100">
      <mt-button type="primary" size="large" @click.native="popupStatus=!popupStatus">确定</mt-button>
    </my-button-block>
    <!-- 日期下方弹出 -->
    <mt-datetime-picker v-model="dateValue" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"
      @confirm="dateSelect" ref="picker">
    </mt-datetime-picker>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isOKs: [
          { label: "预留中", value: "0,预留中" },
          { label: "已确认", value: "1,已确认" },
          { label: "已取消", value: "-3,已取消" },
          { label: "已撤销", value: "-2,已撤销" },
          { label: "已清位", value: "-4,已清位" },
        ],
        // isOKAll:[],
        dateTypes: [
          { title: "订单日期", value: "orddate" },
          { title: "出团日期", value: "plandate" },
          { title: "回团日期", value: "backdate" },
          { title: "到期日期", value: "enddate" },
          { title: "确认日期", value: "suredate" },
        ],
        popupStatus: false,
        showWhich: 0,
        dateValue: DateFmt(new Date(), 'yyyy-MM-dd'),
      }
    },
    created() {
    },
    computed: {
      query() {
        return this.$store.getters["order/orders_search_all_query"];
      }
    },
    methods: {
      searchOrder() {
        this.$router.push({ path: "/order-search-all-list" });
      },
      dateTypeSelect(dateType) {
        this.query.dateType = dateType;
      },
      dateSelect(v) {
        if (this.showWhich == 3) {
          this.query.startdate = v;
        } else if (this.showWhich == 4) {
          this.query.enddate = v;
        }
      },
      isOKClick() {
        this.showWhich = 1;
        this.popupStatus = !this.popupStatus;
      },
      dateTypeClick() {
        this.showWhich = 2;
        this.popupStatus = !this.popupStatus;
      },
      startdateClick() {
        this.showWhich = 3;
        this.$refs.picker.open();
      },
      enddateClick() {
        this.showWhich = 4;
        this.$refs.picker.open();
      },
      // isOKAllClick() {
      //   if(this.isOK.length>=this.isOKs.length) {
      //     this.isOK = [];
      //   } else {
      //     this.isOK = this.isOKs.map(v=>v.value);
      //   }
      // },
      isOKChange(val) {
        let isokstr = "";
        let isokval = "";
        isokval = val.map(v => v.split(",")[0]).toString();
        isokstr = val.map(v => v.split(",")[1]).toString();
        if (isokstr.length > 16) {
          isokstr = isokstr.slice(0, 16) + '...'
        }
        this.query.isOKStr = isokstr;
        this.query.isOKVal = isokval;
      },
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
  /*.my-popup-right {
  width: 100%;
  height: 100%;
  overflow: scroll;
}*/
</style>