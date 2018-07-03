<template>
  <div class="order-place-block">
    <mt-header title="添加客户公司" fixed>
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div style="height:40px"></div>

    <my-block></my-block>
    <mt-field label="公司名称" v-model="company.simName" placeholder="请输入" class="input-right require-field"></mt-field>
    <my-cell title="结算方式" is-link @click.native="jiesuanShow(1)" :value="company.payType || '请选择'" class="require-field newline"></my-cell>
    <mt-cell title="结算价格" is-link @click.native="jiesuanShow(2)" class="input-right require-field" :value="price || '请选择'"></mt-cell>
    <mt-field label="负责人" class="input-right require-field" placeholder="请输入" :attr="{maxlength:20}" v-model="company.leader"></mt-field>
    <mt-field label="手机号" type="number" class="input-right" placeholder="请输入" :attr="{maxlength:20}" v-model="company.mobile"></mt-field>
    <!--<mt-field label="所在地区" class="input-right" placeholder="请输入" :attr="{maxlength:30}" type="email" v-model="company.proveinceArea"></mt-field>-->
    <mt-cell title="所在地区" is-link class="input-right" @click.native="addressShow=true" >
      <input type="text" max="50" @click.stop.prevent v-model="company.ProvinceCity"  placeholder="请选择或输入" class="mint-field-core">
    </mt-cell>
    <mt-field label="公司地址" class="input-right" placeholder="请输入" :attr="{maxlength:30}" v-model="company.addr"></mt-field>
    <mt-field label="备注" class="input-right" placeholder="请输入" v-model="company.remark"></mt-field>
    <my-block></my-block>
    <my-button-block>
      <mt-button type="primary" size="large" @click.native="addcompany">保存</mt-button>
    </my-button-block>
    <mt-header :title="['','结算方式','结算价格'][showWhich]" fixed v-if="popupStatus" style="z-index:2100">
      <a slot="left">
        <mt-button icon="back" @click="popupStatus=!popupStatus">返回</mt-button>
      </a>
    </mt-header>
    <mt-popup v-model="popupStatus" popup-transition="popup-fade" position="right" class="my-popup-right">
      <div style="height:40px"></div>
      <div v-if="showWhich==1">
        <mt-radio class="company" align="right" v-model="company.payType" @click.native="jiesuanSelect" :options="jiesuan">
        </mt-radio>
      </div>
      <div v-if="showWhich==2">
        <mt-radio align="right" v-model="price" @click.native="jiesuanSelect" :options="priceArr">
        </mt-radio>
      </div>
    </mt-popup>
    <mt-popup  v-model="addressShow" position="bottom" class="mint-datetime">
      <div class="picker-toolbar">
          <span @click="openAddress()" class="mint-datetime-action mint-datetime-cancel">取消</span>
          <span @click="openAddress('qr')" class="mint-datetime-action mint-datetime-confirm">确定</span></div>
      <div class="page-picker-wrapper">
        <mt-picker :slots="addressSlots" @change="onAddressChange" :visible-item-count="7"></mt-picker>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import { MessageBox, Toast, Indicator } from 'mint-ui';
  import Vue from 'vue';
  export default {
    data() {
      return {
        popupStatus: false,
        price: '同行价',
        priceArr: [
          { "value": '市场价', "label": "市场价" },
          { "value": '同行价', "label": "同行价" },
          { "value": '成本价', "label": "成本价" },
        ],
        showWhich: 0,
        company: {
          code: '系统自动生成',
          settlement: '同行',
          simName: '',
          payType: '',
          isVip: '',
          set_btb_price_type: '1',
          btb_price_type: '3',
          gradeMoney: '',
          ProvinceCity: '',
          addr: '',
          url: '',
          leader: '',
          email: '',
          mobile: '',
          qq: '',
          tel: '',
          fax: '',
          remark: '',
          bySort: '0',
          isLock: '0',
          gradeID: '',
          saleID: '',
          groupIDs: '',
          province: '',
          area: '',
          groupName: '',
          groupID: '',
          saleName: '',
        },
        jiesuan: [],
        addressShow:false,
        addressSlots: [
          {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }, {
            divider: true,
            content: '-',
            className: 'slot2'
          }, {
            flex: 1,
            values: ['北京'],
            className: 'slot3',
            textAlign: 'center'
          }
        ],
        addressProvince: '北京',
        addressCity: '北京',
        address:{},
      }
    },
    created(){
      this.fnInit();
      Vue.http.post(
          "pub/bast-text",
          {
            type:'125',
            page:1,
            start:0,
            limit:123456
          },
          { emulateJSON: true }
        ).then(res => {
          if (!res.body) return;
          let data=res.body.rows;
          this.company.payType=data[0].title;
          for(var i=0;i<data.length;i++){
            data[i].label=data[i].title;
            data[i].value=data[i].title;
          }
          this.jiesuan=data;
        })
    },
    computed: {
    },
    methods: {
      fnInit(){
        Vue.http.post(
          "pub/province-city",
          {},
          { emulateJSON: true }
        ).then(res => {
          if (!res.body) return;
          let data = res.body.rows;
          let proSign='';
          let proSignArr=[];
          let address={};
          data.forEach(x=>{
            let y=x.ProvinceCity.split(' ');
            if(proSign!=y[0]){
              let result = proSignArr.find(end=>{
                return end==y[0];
              });
              if(!result){
                proSignArr.push(y[0]);
                proSign=y[0];
                address[proSign]=[];
                address[proSign].push(y[1]);
              }else{
                proSign=result;
                address[result].push(y[1]);
              }
            }else{
              address[proSign].push(y[1]);
            }
          })
          this.addressSlots[0].values=Object.keys(address);
          this.address=address;
        })
      },
      onAddressChange(picker, values) {
        let address=this.address;
        picker.setSlotValues(1, address[values[0]]);
        this.addressProvince = values[0];
        this.addressCity = values[1];
      },
      openAddress(arg) {
        this.addressShow = !this.addressShow;
        if (arg == 'qr') {
          this.company.ProvinceCity = this.addressProvince + ' ' + this.addressCity;
          this.company.province=this.addressProvince;
          this.company.area=this.addressCity;
          return;
        }
      },
      addcompany() {
        if (!this.company.simName) { Toast("请输入客户公司"); return; }
        if (!this.company.payType) { Toast("请输入结算方式"); return; }
        if (!this.company.leader) { Toast("请输入负责人"); return; }
        if (this.price == '市场价') {
          this.company.isVip = 0;
        } else if (this.price == '同行价') {
          this.company.isVip = 1;
        } else {
          this.company.isVip = 2;
        }
        let company = this.company;
        Vue.http.post(
          "cust-cpy/cpy-insert",
          company,
          { emulateJSON: true }
        ).then(res => {
          if (!res.body) return;
          let data = res.body;
          if (data.success) {
            Toast('添加成功');
            this.$router.push('company');
          } else {
            Toast(data.msg);
          }
        }).catch(err => {
          Toast('添加失败');
        })
      },
      jiesuanShow(i) {
        this.showWhich = i;
        this.popupStatus = !this.popupStatus;
      },
      jiesuanSelect() {
        this.$router.go(-1);
      },

    },
    beforeRouteLeave(to, from, next) {
      if (this.popupStatus) {
        this.popupStatus = !this.popupStatus;
        next(false);
      } else {
        next();
      }
    }
  }

</script>

<style>
.company .mint-radio-label{
  margin-left:0;
}
</style>