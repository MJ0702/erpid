<template>
  <div>
    <mt-header title="添加客户联系人" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
      <!-- <mt-button slot="right" @click="$router.go(-1)">取消</mt-button> -->
    </mt-header>
    <div style="height:40px"></div>

    <my-block></my-block>
    <mt-cell title="客户公司" v-model="company.simName"></mt-cell>
    <mt-field label="姓名" placeholder="请输入客户姓名" :attr="{maxlength:20}" v-model="customer.trueName" class="require-field"></mt-field>
    <mt-field label="手机号" placeholder="请输入客户手机号" :attr="{maxlength:20}" type="tel" v-model="customer.mobile" class="require-field"></mt-field>
    <mt-field label="所在部门" placeholder="请输入客户部门" :attr="{maxlength:20}" v-model="customer.deptName"></mt-field>
    <mt-field label="职位" placeholder="请输入客户职位" :attr="{maxlength:20}" v-model="customer.job"></mt-field>
    <my-block></my-block>
    <mt-field label="邮箱" placeholder="请输入客户邮箱" :attr="{maxlength:30}" type="email" v-model="customer.email"></mt-field>
    <mt-field label="QQ" placeholder="请输入客户QQ" :attr="{maxlength:20}" type="number" v-model="customer.qq"></mt-field>
    <mt-field label="微信" placeholder="请输入客户微信" :attr="{maxlength:30}" v-model="customer.weixin"></mt-field>
    <mt-field label="电话" placeholder="请输入客户电话" :attr="{maxlength:20}" type="tel" v-model="customer.tel"></mt-field>
    <mt-field label="传真" placeholder="请输入客户传真" :attr="{maxlength:20}" v-model="customer.fax"></mt-field>
    <my-block></my-block>
    <mt-field label="网址" placeholder="请输入网址" type="url" v-model="customer.website"></mt-field>
    <mt-field label="地址" placeholder="请输入地址，60字以内" :attr="{maxlength:60}" v-model="customer.addr"></mt-field>
    <my-block></my-block>
    <mt-field label="备注" placeholder="请输入备注信息" v-model="customer.remark"></mt-field>
    <my-block></my-block>
    <my-button-block>
      <mt-button type="primary" size="large" @click.native="addCustomer">确定</mt-button>
    </my-button-block>
  </div>
</template>

<script>
import { MessageBox , Toast, Indicator} from 'mint-ui';

export default {
  data() {
    return {
    }
  },
  computed: {
    customer() {
      return this.$store.getters["order/customer/customer_new"];
    },
    company() {
      return this.$store.getters["order/customer/company"];
    }
  },
  methods: {
    addCustomer() {
      if(!this.customer.trueName) {Toast("请输入客户姓名");return;}
      if(!this.customer.mobile){Toast("请输入客户手机号");return;}
      Indicator.open({
        text: '正在操作...',
        spinnerType: 'fading-circle'
      });
      this.$store.dispatch("order/customer/customer_add").then(state => {
        Indicator.close();
        if(state.success) {
          Toast("保存成功");
          this.$router.go(-1);
        } else {
          Toast(state.msg);
        }
      }).catch(err => {
        console.log(err);
        Indicator.close();
        Toast("网络错误");
      })
    }
  }
}
</script>

<style>
</style>
