<template>
  <!-- 出团通知书模板 -->
  <div>
    <mt-header title="出团通知书模板" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="blank" style="height:40px"></div>
    <!--
    -->
    <my-radio :title="type.fileName"
      v-for="type in types"
      @click.native="typeClick(type)"
      :checked="type.fileConfig == typeSlect.fileConfig"
    ></my-radio>
  </div>
</template>

<script>


  export default {
    data () {
      return {

      }
    },
    created() {
       let planTemplateList = this.$store.getters["order/plansnotice/planTemplate"];
       if(!planTemplateList.length){
         this.$store.dispatch('order/plansnotice/plan_template_request');
       }
    },
    computed: {
      types() {
        return this.$store.getters["order/plansnotice/planTemplate"];
      },
      typeSlect() {
        return this.$store.getters["order/plansnotice/planTemplateSelect"];
      },
    },
    methods:{
      typeClick(type) {
        this.$store.dispatch("order/plansnotice/plan_template_select", type);
        this.$router.go(-1);
      },
    },
    components: {
      
    }
  }
</script>

<style>

</style>
