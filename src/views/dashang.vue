<template>
  <!-- 我的 -->
  <div>
    <mt-header title="" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div style="height:40px"></div>
    <div class="dashang">
      <img src="https://ohp96o3wl.qnssl.com/files/1/image/20170617/1_1497695128563.png" usemap="#Map" border="0" />
      <map name="Map" id="Map">
        <area shape="rect" coords="106,170,187,261" href="http://www.dashangcloud.com/sh/87937e" />
        <area shape="rect" coords="198,172,276,263" href="http://www.dashangcloud.com/sh/87937f" />
        <area shape="rect" coords="108,280,185,368" href="http://www.dashangcloud.com/sh/879380" />
        <area shape="rect" coords="198,279,275,367" href="http://www.dashangcloud.com/sh/879381" />
        <area shape="rect" coords="107,378,185,468" href="http://www.dashangcloud.com/sh/879382" />
        <area shape="rect" coords="196,378,273,465" href="http://www.dashangcloud.com/sh/879383" />
      </map>

    </div>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui';
  import Vue from 'vue'

  export default {
    data() {
      return {

      }
    },
    created() {
      Vue.http.get(
          '/sys/api/pub_m/dashang',
        ).then(res => {

        })
    },
    computed: {
    },
    methods: {
    },
  }

</script>

<style>

</style>