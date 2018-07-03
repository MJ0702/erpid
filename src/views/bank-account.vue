<template>
  <!-- 银行账户 -->
  <div>
    <mt-header title="银行账户" fixed>
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="blank" style="height:40px"></div>
    <!--<my-search placeholder="搜索" cancel-text="" @click.native="$router.push({name:'bank-search'})" class="contact-list-search"></my-search>-->
    <my-search placeholder="搜索" cancel-text="" @click.native="searchClick" class="contact-list-search"></my-search>
    <div class="bank-list">
      <ul class="mui-table-view" v-for="(account,index) in bank_account" @click="detailClick(index)">
        <li class="mui-table-view-cell mui-media">
          <a href="javascript:;" class="">
            <svg class="icon" aria-hidden="true">
              <use v-bind:xlink:href="account.url"></use>
            </svg>
            <div class="mui-media-body">
              {{account.accBank}}
              <p class="mui-ellipsis">{{account.accName}} | {{account.accCard}}</p>
            </div>
          </a>
        </li>
      </ul>
    </div>
    <!--<my-tableView :dataList="bank_account"></my-tableView>-->
    <!--银行账户详情弹出-->
    <mt-header title="账户详情" fixed v-if="popupStatus" style="z-index:2101">
      <a slot="left">
        <mt-button icon="back" @click="popupStatus=!popupStatus">返回</mt-button>
      </a>
    </mt-header>
    <mt-popup v-model="popupStatus" popup-transition="popup-fade" position="right" class="my-popup-right">
      <div style="height:40px"></div>
      <mt-cell title="账号简称" :value="accounts.simName"></mt-cell>
      <mt-cell title="开户行" :value="accounts.accBank"></mt-cell>
      <mt-cell title="开户名" :value="accounts.accName"></mt-cell>
      <mt-cell title="账号" :value="accounts.accCard"></mt-cell>
    </mt-popup>
    <mt-header title="银行账户搜索" fixed v-if="searchPopupStatus" style="z-index:2100">
      <a slot="left">
        <mt-button icon="back" @click="searchPopupStatus=!searchPopupStatus">返回</mt-button>
      </a>
    </mt-header>
    <mt-popup v-model="searchPopupStatus" popup-transition="popup-fade" position="right" class="my-popup-right">
      <div style="height:40px"></div>

      <my-search placeholder="搜索" class="contact-list-searrch" v-model="keyword" cancel-text="取消" @cancel="$router.go(-1)" autofocus
        show fixed>
      </my-search>
      <div style="height:52px"></div>
      <ul class="mui-table-view" v-for="(banksearch,index) in bank_search" @click="searchDetailClick(index)">
        <li class="mui-table-view-cell mui-media">
          <a href="javascript:;" class="">
            <svg class="icon" aria-hidden="true">
              <use v-bind:xlink:href="banksearch.url"></use>
            </svg>
            <div class="mui-media-body">
              {{banksearch.accBank}}
              <p class="mui-ellipsis">{{banksearch.accName}} | {{banksearch.accCard}}</p>
            </div>
          </a>
        </li>
      </ul>
    </mt-popup>
  </div>
</template>

<script>
  import { Toast } from "mint-ui";

  export default {
    data() {
      return {
        popupStatus: false,
        searchPopupStatus: false,
        accounts: {},
        keyword: "",
        timeout: null,
      }
    },
    created() {
      this.getAccounts();
    },
    computed: {
      bank_account() {
        return this.$store.getters["bank/bank_account"];
      },
      bank_type() {
        return this.$store.getters["bank/bank_type"];
      },
      bank_search() {
        return this.$store.getters["bank/bank_search"];
      }
    },
    methods: {
      getAccounts() {
        if (!this.bank_type) {
          this.$store.dispatch("bank/bank_request");
          this.$store.dispatch("bank/change_bank_type", !this.bank_type);
        }

      },
      detailClick(index) {
        this.accounts = this.bank_account[index];
        this.popupStatus = !this.popupStatus;
      },
      searchClick() {
        this.searchPopupStatus = !this.searchPopupStatus;
      },
      searchDetailClick(index) {
        this.accounts = this.bank_search[index];
        // this.searchPopupStatus = !this.searchPopupStatus;
        this.popupStatus = !this.popupStatus;
      }
    },
    watch: {
      keyword(val) {
        if (val) {
          if (this.timeout) {
            clearTimeout(this.timeout)
          }
          this.timeout = setTimeout(() => {
            this.$store.dispatch("bank/bank_search_request", val);
          }, 100)
        }
      }
    },
    components: {

    },
    beforeRouteLeave(to, from, next) {
      if (this.popupStatus) {
        this.popupStatus = !this.popupStatus;
        next(false);
      } else if (this.searchPopupStatus) {
        this.searchPopupStatus = !this.searchPopupStatus;
        next(false);
      } else {
        next();
      }
    }
  }

</script>

<style>
  .icon {
    /* 通过设置 font-size 来改变图标大小 */
    width: 1em;
    height: 1em;
    /* 图标和文字相邻时，垂直对齐 */
    vertical-align: -0.15em;
    /* 通过设置 color 来改变 SVG 的颜色/fill */
    fill: currentColor;
    /* path 和 stroke 溢出 viewBox 部分在 IE 下会显示
      normalize.css 中也包含这行 */
    overflow: hidden;
  }
  
  .bank-list ul.mui-table-view:first-of-type {
    margin-top: 52px;
  }
  
  .contact-search {
    height: auto;
  }
  
  .contact-list-search {
    height: auto;
  }
  
  .mint-searchbar-core {
    width: 100%;
  }
  
  .mui-media .icon {
    font-size: 42px;
    line-height: 100px;
    color: #333;
    -webkit-transition: font-size 0.25s ease-out 0s;
    -moz-transition: font-size 0.25s ease-out 0s;
    transition: font-size 0.25s ease-out 0s;
    float: left;
    margin-right: 14px;
  }
  /*.order-info {
    margin-top:10px;
    background-color: #fff;
    padding: 10px 15px;
    position:relative;
  }

  .order-info div{
    line-height:24px;
    height:24px;
  }
  .order-info div span:nth-child(1) {
    color: #666;
  }
  .order-info div span:nth-child(2) {
    float: right;
  }
  .order-info div span.receipted {
    color: green;
  }
  .order-info div span.noreceipted {
    color: red;
  }
div.blank+div.order-info{
  margin-top:0;
}*/
  
  .mui-table-view {
    position: relative;
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 0;
    list-style: none;
    background-color: #fff;
  }
  
  a {
    text-decoration: none;
  }
  
  .mui-table-view:before {
    position: absolute;
    right: 0;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
    top: -1px;
  }
  
  .mui-table-view .mui-media,
  .mui-table-view .mui-media-body {
    overflow: hidden;
    /*background:#f76666;*/
  }
  
  .mui-table-view-cell {
    position: relative;
    overflow: hidden;
    padding: 11px 15px;
    -webkit-touch-callout: none;
  }
  
  .mui-table-view-cell>a:not(.mui-btn) {
    position: relative;
    display: block;
    overflow: hidden;
    margin: -11px -15px;
    padding: inherit;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: inherit;
  }
  
  .mui-table-view .mui-media-object.mui-pull-left {
    margin-right: 10px;
  }
  
  .mui-table-view .mui-media-object {
    line-height: 42px;
    max-width: 42px;
    height: 42px;
  }
  
  .mui-pull-left {
    float: left;
  }
  
  img {
    border: 0;
  }
  
  .mui-table-view .mui-media-body {
    box-sizing: border-box;
    overflow: hidden;
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 17px;
    line-height: 21px;
    /*color:#fff;*/
  }
  
  .mui-table-view-cell p {
    margin-bottom: 0;
    font-size: 13px;
    margin-top: 0;
  }
  
  .mui-table-view-cell:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 15px;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }
  
  .mui-table-view:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }
</style>