<template>
  <div>
    <div v-if="userHead">
      <my-block></my-block>
      <mt-cell title="头像" class="user-avatar">
        <img :src="user.avatar" v-if="user.avatar">
        <img :src="user.headimgurl" v-else-if="user.headimgurl">
        <img src="~assets/mine-tab.png" v-else>
      </mt-cell>
      <mt-cell title="姓名" :value="user.trueName"></mt-cell>
      <mt-cell title="部门" :value="user.deptName"></mt-cell>
      <mt-cell title="手机" :value="user.mobile"></mt-cell>
    </div>
    <div v-if="userBody">
      <my-block></my-block>
      <mt-cell title="性别" :value="user.sex"></mt-cell>
      <mt-cell title="QQ" :value="user.qq"></mt-cell>
      <mt-cell title="微信" :value="user.weixin"></mt-cell>
      <mt-cell title="短号" :value="user.mobile1"></mt-cell>
      <mt-cell title="邮箱" :value="user.email"></mt-cell>
      <mt-cell title="座机" :value="user.tel"></mt-cell>
      <mt-cell title="传真" :value="user.fax"></mt-cell>
      <my-block></my-block>
      <mt-cell title="备注" class="user-remark">
        <p>{{user.simDesc}}</p>
      </mt-cell>
      <my-block></my-block>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    created() {
      console.log(this.$route.path);
    },
    computed: {
      
    },
    props: {
      user: {
        type: Object,
        default: {}
      },
      userHead:{
        type: Boolean,
        default: true
      },
      userBody:{
        type: Boolean,
        default: true
      },
    }
  }
</script>

<style>
  .user-avatar img {
    padding: 6px;
    height: 90px;
    width: 90px;
    border-radius: 100%;
  }
  .user-remark .mint-cell-value {
    width: 80%;
  }
  .user-remark .mint-cell-value > p {
    width: 100%;
    text-align: right;
  }
</style>
