<template>
  <!-- 确认书常用数据 -->
  <div>
    <mt-header title="确认书常用数据" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="blank" style="height:40px"></div>
    <!--
    -->
    <div v-if="!types.length" class="box-no-data">暂无确认书常用数据</div>
    <my-radio v-else :title="type.fnTitle" v-for="type in types" @click.native="typeClick(type)" :checked="type.fnTitle == typeSlect"></my-radio>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    created() {
      this.$store.dispatch('order/confirmbook/confirmation_interface_request');
    },
    computed: {
      types() {
        let confirmRows = this.$store.getters["order/confirmbook/confirmRows"];
        return confirmRows;
      },
      typeSlect() {
        return this.$store.getters["order/confirmbook/fnTitle"];
      },

    },
    methods: {
      typeClick(type) {
        this.$store.dispatch("order/confirmbook/fnTitle_select", type.fnTitle);
        this.$store.dispatch("order/confirmbook/fnConfig_select", JSON.parse(type.fnConfig));
        this.$router.go(-1);
      },

    },
    components: {

    }
  }

</script>

<style>
  .box-no-data {
    text-align: center;
    line-height: 40px;
    color: #888;
    font-size: 14px;
  }
</style>