<template>
  <div class="customer-info-block">
    <mt-header title="客户详情" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
      <mt-button slot="right" v-show="PermitCheck('cust-user/edit')" @click="$router.push({name:'customer-edit'})">修改</mt-button>
    </mt-header>
    <div style="height:40px"></div>

    <my-block bottom left>基本信息</my-block>
    <my-cell title="公司资料" is-link :value="customer.cpyName" @click.native="popupStatus=!popupStatus" class="newline"></my-cell>
    <mt-cell title="姓名" v-model="customer.trueName"></mt-cell>
    <mt-cell title="性别" :value="sexTypes[customer.sex]"></mt-cell>
    <mt-cell title="所在部门" v-model="customer.deptName"></mt-cell>
    <mt-cell title="职位" v-model="customer.job"></mt-cell>
    <mt-cell title="手机号" v-model="customer.mobile"></mt-cell>
    <my-block bottom left>联系信息</my-block>
    <mt-cell title="邮箱" v-model="customer.email"></mt-cell>
    <mt-cell title="QQ" v-model="customer.qq"></mt-cell>
    <mt-cell title="微信" v-model="customer.weixin"></mt-cell>
    <mt-cell title="电话" v-model="customer.tel"></mt-cell>
    <mt-cell title="传真" v-model="customer.fax"></mt-cell>
    <my-block bottom left>额度信息</my-block>
    <mt-cell title="信用额度" :value="customer.gradeMoney"></mt-cell>
    <mt-cell title="欠款总额" :value="customer.supGradeMoney||0"></mt-cell>
    <mt-cell title="剩余额度" :value="customer.gradeMoney-customer.supGradeMoney"></mt-cell>
    <my-block bottom left>其他信息</my-block>
    <my-cell class="newline" title="网址"  v-model="customer.website"></my-cell>
    <my-cell class="newline" title="地址" v-model="customer.addr"></my-cell>
    <mt-cell title="备注" v-model="customer.remark"></mt-cell>
    <my-block></my-block>
    <my-button-block fixed> 
      <mt-button type="primary" @click.native="$router.push({'name':'follow-record'})" size="large">跟进记录</mt-button>
    </my-button-block>
    <mt-header title="公司资料" fixed v-if="popupStatus" style="z-index:2100">
      <a slot="left">
        <mt-button icon="back" @click="popupStatus=!popupStatus">返回</mt-button>
      </a>
    </mt-header>
    <mt-popup v-model="popupStatus" popup-transition="popup-fade" position="right" class="my-popup-right">
      <div style="height:40px"></div>
      <!-- 公司详情弹出 -->
      <div class="detail-title">
        <span class="little-border">| </span>
        <span>{{customer.cpyName}}</span>
      </div>
      <div class="detail-content" v-html="htmlEncode(customer.describe)">
        <!-- dom 元素注入 -->
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { MessageBox , Toast, Indicator} from 'mint-ui';

export default {
  data() {
    return {
      popupStatus: false,
      sexPopupStatus: false,
      sexTmp: "",
      sexTypes: ['男', '女'],
    }
  },
  mounted() {
  },
  computed: {
    customer() {
      return this.$store.getters["customer/customer"];
    },
  },
  methods: {
    htmlEncode(str) {
      if(str) {
        return HtmlEncode(str);
      }
    },
  },
  watch: {
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

<style>
.customer-info-block .input-right .mint-cell-value input{
  text-align: right;
}
</style>

<style scoped>
  .detail-title {
    margin: 10px;
    font-size: 1.1em;
    color: #222;
    /*border-left: 5px solid blue;*/
  }
  .detail-title .little-border {
    font-size:0.8em;
    color: #33CCFF;
    position: relative;
    top: -2px;
  }
  .detail-content {
    margin: 10px;
  }
</style>
