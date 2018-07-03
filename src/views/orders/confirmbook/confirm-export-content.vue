<template>
  <!-- 导出内容 -->
  <div>
    <mt-header title="导出内容" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="blank" style="height:40px"></div>
    <!--
    -->
    <!--<my-radio :title="type.ID"
      v-for="type in types"
      @click.native="typeClick(type)"
      :checked="type.ID == typeSlect.ID"
    ></my-radio>-->
    <mt-checklist v-model="confirm_search_query.exportContents" :options="confirm_search_query.exportContentDatas" @change="exportContentsChange">

    </mt-checklist>
    <my-button-block fixed>
      <mt-button type="primary" size="large" @click.native="$router.go(-1)">确定</mt-button>
    </my-button-block>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    created() {

    },
    computed: {
      confirm_search_query() {
        return this.$store.getters["order/confirmbook/confirm_search_query"];
      }
    },
    methods: {
      exportContentsChange(val) {
        let exportContent = "", exportContentID = "";
        exportContent = val.map(v => v.slice(v.indexOf(",") + 1, v.length)).toString();
        exportContentID = val.map(v => v.slice(0, v.indexOf(","))).toString();
        if (exportContent.length > 16) {
          exportContent = exportContent.slice(0, 16) + '...'
        }
        this.confirm_search_query.exportContentID = exportContentID;
        this.confirm_search_query.exportContent = exportContent;
        // this.$store.dispatch("order/confirmbook/base_account_select", exportContent);
      },
    },
    components: {

    }
  }

</script>

<style>

</style>