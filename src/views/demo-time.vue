<template>
  <div>
    <iframe :src="qrcode" frameborder="0"></iframe>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        datetime1: '05:21',
        datetime2: '2018-03-29',
        datetime3: '2016-06-06 06:06',
        datetime4: '2017-05-11',
        datetime5: '',
        datetime6: '10:20',
        datetime7: DateFmt(new Date(), 'yyyy-MM-dd'),
        startDate: DateFmt(new Date(), 'yyyy-MM-dd', 'y-10'),
        endDate: DateFmt(new Date(), 'yyyy-MM-dd', 'y+10'),
        yearFormat: '<span style="color:#F00;">{value}<i style="font-size: 12px;margin-left: 1px;">年</i></span>',
        monthFormat: '<span style="color:#0BB20C;">{value}<i style="font-size: 12px;margin-left: 1px;">月</i></span>',
        dayFormat: '<span style="color:#FFB400;">{value}<i style="font-size: 12px;margin-left: 1px;">日</i></span>',
        qrcode:'',
      }
    },
    computed: {
      query() {
        return {
          startDate: DateFmt(new Date(), "yyyy-MM-dd"), //开始日期
          endDate: DateFmt(new Date(), "yyyy-MM-dd", "M+1"), //结束日期
        }
      }
    },
    created(){
      // var _head=document.getElementsByTagName('head')[0];
      //   var _script=document.createElement('script');
      //   _script.src="https://cdn.op110.com.cn/controls/jquery/jquery-1.10.2.min.js";
      //   _head.appendChild(_script);
      this.goPay();
      // if($('script[src="https://cdn.op110.com.cn/controls/jquery/jquery-1.10.2.min.js"]').length<1){

      // }
    },
    methods: {
      open() {
        this.$refs.endTime.open();
      },
      goPay() {
      // Toast("正在前往付款页面");
      this.$store.dispatch("money/receipt/receipt_qrcode_request", true).then((body)=>{
        if(body&&body.executeStatus==0&&body.qrcode) {
          // window.location.href = body.qrcode;
          this.qrcode=body.qrcode;
        } else {
          Toast("付款导航失败")
        }
      })
    }
    }
  }

</script>