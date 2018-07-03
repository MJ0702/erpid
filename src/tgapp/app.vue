<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Toast } from "mint-ui";
  import icon from './lib/iconfont'
  export default {
    name: 'app',
    data() {
      return {
      }
    },
    created() {
      // Vue.http.interceptors.push((req, next) => {
        
      // })
    },
    methods: {
    },
  }

</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
  }

   :root {
    --background-color: #f0f0f2;
  }
  input{
    outline: none;
  }
  html,
  body {
    margin: 0;
    height: 100%;
    background-color: var(--background-color);
  }

  .my-icon,span.middle-span{
    vertical-align: middle;
  }

  .router-link {
    text-decoration: none;
    color: inherit;
  }

  details summary::-webkit-details-marker {
    display: none;
  }

  .page-infinite-loading {
    text-align: center;
    display: block;
  }

  .page-infinite-loading>span>div {
    margin: 0 auto;
  }

  .page-infinite-loading-no {
    display: none;
  }

  .loadmore-end {
    color: #888;
    text-align: center;
    display: block;
    font-size: 0.8em;
    margin: 12px 0px;
  }

  .loadmore-end-no {
    display: none;
  }
  .single-over {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .mint-header-title {
    line-height: 16px;
  }

  .mint-cell {
    margin-top: -1px;
  }

  .mint-cell.require-field .mint-cell-title {
    color: red;
  }

  .mint-cell.input-right .mint-cell-value input {
    text-align: right;
  }

  .mint-toast {
    z-index: 2100;
  }

  .my-cell-swipe .mint-cell-value {
    width: 70%;
  }

  .my-cell-swipe .mint-cell-value>p {
    width: 100%;
    text-align: right;
  }

  .my-popup {
    width: 100%;
  }

  .my-popup-right {
    width: 100%;
    height: 100%;
    overflow: scroll;
    background-color: var(--background-color);
  }

  .checklist-beauty .mint-checklist-title {
    margin: -1px;
  }

  .input-text-right .mint-cell-value input.mint-field-core {
    text-align: right;
  }

  .weui-uploader .weui-uploader_tmpl1__bd {
    height: 200px;
  }

  .box-uploader {
    background: #fff;
    padding: 10px 20px;
    overflow: hidden;
  }

  .box-no-data {
    text-align: center;
    line-height: 40px;
    color: #888;
    font-size: 14px;
  }

  .arrow-right::after {
    border: solid 2px #c8c8cd;
    border-bottom-width: 0;
    border-left-width: 0;
    content: " ";
    top: 50%;
    right: 20px;
    position: absolute;
    width: 5px;
    height: 5px;
    -webkit-transform: translateY(-50%) rotate(45deg);
    transform: translateY(-50%) rotate(45deg);
  }

  .my-block+.mint-cell .mint-cell-wrapper {
    background-origin: border-box;
  }

  .box-small-circle {
    padding: 0 4px;
    border-radius: 3px;
    font-size: 10px;
    margin: 0 2px;
    display: inline-block;
    border: 1px solid rgb(0, 153, 255);
    color: rgb(0, 153, 255);
    line-height: initial;
    vertical-align: middle;
  }
  .box-small-circle.no-normal {
    color:grey;
    border-color:grey;
  }
  .mint-header{
    background:#409EFF;
  }
  .blank{
    height:10px;
    overflow:hidden;
  }
  /*导游当前带团和历史带团公共样式*/
  .popup-cpy-list{
    width:100%;
    background: #fff;
    line-height: 36px;
    text-align: center;
  }
  .david-border {
    width: 100%;
    height: 23px;
    line-height: 17px;
    padding: 10px 0;
    color: rgba(144, 147, 153, 1);
    font-size: 12px;
    text-align: center;
    font-family: Arial;
  }
</style>