<template>
    <div class="bank-list">
        <ul class="mui-table-view" v-for="account in dataList">
				<li class="mui-table-view-cell mui-media">
					<a href="javascript:;" class="">
                        <svg class="icon" aria-hidden="true">
                            <use v-bind:xlink:href="account.url"></use>
                        </svg>
						<div class="mui-media-body" >
							{{account.accBank}}
							<p class="mui-ellipsis">{{account.accName}} | {{account.accCard}}</p>
						</div>
					</a>
				</li>
			</ul>
      </div>
</template>

<script>
export default {
  name: 'my-tableView',
  data () {
    return {
    }
  },
  created() {

  },
  props: {
      dataList:Array
  }
}
</script>

<style>
div.blank+div.order-info{
  margin-top:0;
}
  .mui-table-view {
    position: relative;
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 0;
    list-style: none;
    background-color: #fff;
}
a{   
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

.mui-table-view .mui-media, .mui-table-view .mui-media-body {
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
    font-family: 'Helvetica Neue',Helvetica,sans-serif;
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
