<template>
  <div class="customer-info-block">
    <mt-header title="客户修改" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div style="height:40px"></div>

    <my-block bottom left>基本信息</my-block>
    <mt-cell title="姓名" is-link>
      <mt-field disableClear :attr="{maxlength:20}" v-model="customer.trueName" class="input-right" @change="updateField('trueName')"></mt-field>
    </mt-cell>
    <mt-cell title="性别" :value="sexTypes[customer.sex]" is-link @click.native="sexPopupStatus=!sexPopupStatus"></mt-cell>
    <mt-cell title="所在部门" is-link>
      <mt-field disableClear :attr="{maxlength:20}" v-model="customer.deptName" class="input-right" @change="updateField('deptName')"></mt-field>
    </mt-cell>
    <mt-cell title="职位" is-link>
      <mt-field disableClear :attr="{maxlength:20}" v-model="customer.job" class="input-right" @change="updateField('job')"></mt-field>
    </mt-cell>
    <mt-cell title="手机号" is-link>
      <mt-field disableClear :attr="{maxlength:20}" type="tel" v-model="customer.mobile" class="input-right field-in-cell" @change="updateField('mobile')"></mt-field>
    </mt-cell>
    <my-block bottom left>联系信息</my-block>
    <mt-cell title="邮箱" is-link>
      <mt-field disableClear :attr="{maxlength:30}" type="email" v-model="customer.email" class="input-right" @change="updateField('email')"></mt-field>
    </mt-cell>
    <mt-cell title="QQ" is-link>
      <mt-field disableClear :attr="{maxlength:30}" type="number" v-model="customer.qq" class="input-right" @change="updateField('qq')"></mt-field>
    </mt-cell>
    <mt-cell title="微信" is-link>
      <mt-field disableClear :attr="{maxlength:30}" v-model="customer.weixin" class="input-right" @change="updateField('weixin')"></mt-field>
    </mt-cell>
    <mt-cell title="电话" is-link>
      <mt-field disableClear :attr="{maxlength:20}" v-model="customer.tel" class="input-right" @change="updateField('tel')"></mt-field>
    </mt-cell>
    <mt-cell title="传真" is-link>
      <mt-field disableClear :attr="{maxlength:20}" v-model="customer.fax" class="input-right field-in-cell" @change="updateField('fax')"></mt-field>
    </mt-cell>
    <my-block bottom left>其他信息</my-block>
    <mt-cell title="网址" is-link>
      <mt-field disableClear type="url" v-model="customer.website" class="input-right" @change="updateField('website')"></mt-field>
    </mt-cell>
    <mt-cell title="地址" is-link>
      <mt-field disableClear :attr="{maxlength:60}" v-model="customer.addr" class="input-right" @change="updateField('addr')"></mt-field>
    </mt-cell>
    <mt-cell title="备注" is-link>
      <mt-field disableClear v-model="customer.remark" class="input-right field-in-cell" @change="updateField('remark')"></mt-field>
    </mt-cell>
    <my-block></my-block>

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

    <!-- 性别下方弹出 -->
    <mt-popup v-model="sexPopupStatus" position="bottom" class="my-popup">
      <mt-picker :slots="sexs" @change="sexUpdate" visibleItemCount="3" showToolbar>
        <span class="mint-datetime-action mint-datetime-cancel" @click="sexPopupStatus=!sexPopupStatus">取消</span>
        <span class="mint-datetime-action mint-datetime-confirm" @click="sexConfirm">确认</span>
      </mt-picker>
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
    sexs() {
      return [{ //性别选择项
        flex: 1,
        values: this.sexTypes,
        className: 'slot',
        defaultIndex: this.sexTypes.indexOf(this.customer.sex||this.sexTypes[0]),
      }]
    }
  },
  methods: {
    htmlEncode(str) {
      if(str) {
        return HtmlEncode(str);
      }
    },
    updateField(fieldType) {
      if(!this.customer.ID) {
        Toast("未选择有效客户")
        return;
      }
      if(!(/^1[34578]\d{9}$/.test(this.customer.mobile))){ 
        Toast("手机号码有误，请重填");  
        return false; 
      } 
      let value = this.customer[fieldType];
      if (value === null || value === undefined) {
        value = "";
      }
      this.$http.post(
        "cust-user/edit",
        {
          ID: this.customer.ID,
          fieldType,
          value,
        },
        {emulateJSON: true}
      ).then(res => {
        if (!res.body) return;
        let datas=res.body;
         let ID=this.customer.ID;
         setTimeout(()=>{
          this.$store.dispatch("customer/customer_request",ID);
         },300);
        if(datas.success){
          Toast("修改成功");
        }else{
          Toast(datas.msg);
        }
       
      })
    },
    sexConfirm() {
      this.sexPopupStatus = false;
      if(this.sexTmp) {
        this.customer.sex = this.sexTypes.indexOf(this.sexTmp);
        this.updateField('sex');
      }
    },
    sexUpdate(e, v) {
      this.sexTmp = v[0];
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
  .field-in-cell {
    background-image: none;
  }
</style>
