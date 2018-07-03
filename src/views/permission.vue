<template>
  <div class="error">
    <div class="msg">
      <div class="img-area">
        <img src="~assets/permission.png">
      </div>
      <div class="text-area">
        <h2 class="title">{{errorCode}}</h2>
        <p class="desc" v-html="errorMsg"></p>
        <mt-button type="primary" size="small" plain @click.native="$router.replace({name: 'home'})">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAN+0lEQVR4Xu2dT24bORbGP0pOtp0+wbiByNsoJ5jkBHHWjcj2CaI+QZzlrOKcwJaCWbd9gjjA7ONspQCRT9AJ0CvZ0huwXDIUt6RisVgmi/wEZBWSxfd77zP/kwr8kQAJrCWgyIYESGA9AQqE0UECGwhQIAwPEqBAGAMkYEeALYgdN+ZKhAAFkoijaaYdAQrEjhtzJUKAAknE0TTTjgAFYseNuRIhQIEk4miaaUeAArHjxlyJEKBAEnE0zbQjQIHYcWOuRAhQIIk4mmbaEaBA7LgxVyIEKJBEHE0z7QhQIHbcmCsRAhRIIo6mmXYEKBA7bsyVCAEKJBFH00w7AhSIHTfmSoQABZKIo2mmHQEKxI4bcyVCgAJJxNE0044ABWLHjbkSIUCBJOJommlHgAKx48ZciRCgQBJxNM20I0CB2HFjrkQIUCCJOJpm2hGgQOy4MVciBCiQRBxNM+0IUCB23JgrEQIUSAlH7wxkDwq7AjzS2ZTC+fQa7ycH6nuJYpi0QQQoEANndf4rXczwTgHP7iYXwXdp4eXXV+rcoCgmaRgBCmSDw7aP5dGDNt4ooL/Jr1okV3M8nRyoScP8z+oWEKBA1gDqDOQ1gEOlbrpTBr+zUU/tGqRjkgYRoEDuOOvxB3mm5ninFLpl/TjqKfIsCy3w9HRo7qC8O6XHGfu2PqNAbMmFm48CAWDRnVrpUQok3EC3rVnSAqnSnfrHbBbwadxT/5jlsnUM84VBIEmBuOhO3XXfXOE5p3rDCGqXtUhOIDsf5I3M0S8xO1XIW4CDcU+dFCZkgsYRSEYgujvVmuMYCtuuvCTAJ7TRH/+uLlyVyXLCIhC9QLaPZfthG+8AOFujEOCHAIdfe+ooLHeyNq4JRC2QWrpTgsHVHH3uv3IdimGWF6VA6uhOAbicK+xzIB5mINdVq6gEUkd3KgMveDvaU4d1OYHlhksgCoHoaduHW3gNgdMg1oPwqxn2uQkx3ACuu2aNF8jOB9nFHO8cz079UAr7o1fqtG4HsPywCTRWILo79aCN41VnNKogF8H7qzkOOQivQjGevI0TSF3dKQBfpI19rmnEE9wuLGmUQOrqTnFNw0UoxVlGIwSy6chrRbecTW8G4TxTXhFkrNmDFojpkVcL53BNwwJailmCFYi+QUSAI5ebChdrGtM5jthqpBju5W0OTiB1dae4plE+OJgDCEYgdXWn9MZCAH1uR2e42xAIQiB1dae4pmETEsyzTMCrQPJW40/Xi30A/haFrxAkOzulgO9QuD2nMhdkF9upNn5wrcf8j4BXgXQG8tnmep115onkfUavVpnD95lSX3aXC+gCgokoXFzP8IWTFz97xVsodYayr4Bjl0Ei+i+kywITLEsLR985LLrF2cKn1Fsbb/G0MxS9EfBFgjHYKJPzluZUCc6nc5yl1sJ4E0hnKOcK+HelaGGTUQlf2cwLsYjg9OueOiubv4npmysQLY5WdpiJPw8Esq5YC0exP//QXIF4CAp+cjUBAU6uZngb48EybwJ5PJR+C9ltI9V/bE2qM3RQQoxC8SaQfA1kooBfHPiGRQRCIBunAIfjPfU+kCpVqoY3geha5/uu9GDdmUiytRCvVlXyRzSZRXCBLRw0fZrYeyhlJwTb0Nd2up7y/d+14D+tFv6OJuosDWnpNxXn+XsnCl39xqJCdsPkvyyLNM4mgn6TWxPvAlmQzk4LCvRNhc6cls+0HPDyhfXxnLfiXQi6UOhWnnpf8al8bPJHE9dQghGI5pqNS1rZs2f6+TOXv9PpDAdNdJBLCKZl5c9C7CqVPVr6xDTfpnS6y3U1x8umzXQFJZAFYP1XTc2ybpcT5+hyYxs8ughakzLy22Oe5Q+ZVvJH5oMtPG/SuCRIgSwcp6eClX5I0+UgHji/umlN+CKtiUKW0uQty75S2CuZ9TZ500QStEAW3S7Xg3i2JrbhfZMvm1hpoQ+FN1YlCSbTm2ezgz+OELxAblsT/b6HZN0ud4N4tiZW8b3IlHW/bsaMpVuUfEzyPHSRNEYgTv5yrZphyfcUjV6pt5WiJeHM2W36NzOQZccop6OeehkyukYJZHkQjxmOXE5JxrKw5SvYbGcg58AfIT9E1EiB1DmIh8IhWxN7men1LBGclJlYkTaehjqz1WiB1DiIj2KbhH2YV8tZdguRbr3He+ppta/Wk7vxAqlzEK9bk9jPO9QTVuX32YX6UnA0Alk4emcgh9bTj6uiRTCZt3DAp9fKSyl/8UsfrS4cvOup96s5fgttVis6geTdLv12iO4HVzvSuxQT+hrU/FBQ8HP35UO5vhz5SvyFyZhE32M23lP9+mpTvuQoBXI72zWUfej7fV2txLM1KR9hAPJp4I8mmaezrBUJZpdD1AJZDOIftLJLsEsvZq1zKFsTk1D/OY3xCdLAHkyNXiB1DeKbtqeofEi7z2Fyk43mOt5Tv7r/ul2JyQikjkE8RVIu6PJB+7eiXCHNaCUnENeDeAHOxz31vMjp/P8bAiazjCGtiyQpkNvWxGLVd1WgT2f4NbTpyVAFaXpZRyiD9aQFsjSIr3SKca7wnOsk5pI0aUVC2aOVvEDuDOJtdqQi5L1E5mF7fykNW5GzUU/t3l+tVn+JArnDRf91EwV9ktHoKiL9gtW4px75dmTTvt8ZiJ5633j3QAhdVwpkRWTlq79GK/GhdAUaJ5Cbewc+b6p3CLNZFMgGDxVt3RbBYLyn9Go9fxYEdoaiX8Bau08rhK0nFEiBYxfnr+90uy5FX6/ZU/oIMH+WBIpW1/XLxOOe0lcPeftRIN7Q88P59U4bu1mjnt+LZCkQxqlXAp2hfN80IeJ7hpAC8Roe/HjRU3y+B+oUCGPUK4HCRUPPu3spEK/hwY8bnBXxumBIgTBGvRLIn7/4a10lfM9kUSBew4Mf1wR2hvrZo9U/3+dDKBDGqHcCRQuGPqd6KRDv4cEKFJ009Ln1nQJhfHon0BnIyaY7A3weJ6BAvIcHK1A01UuBMEaSJkCBJO1+Gl9EgAIpIsT/T5oABZK0+2l8EYEigfjcj8VBepH3+P+1EygSCDzux6JAanc/P1BEoEggbEGKCPL/oyZQJBBO80btfhpXRKBoJZ0CKSLI/4+aAAUStXtpXFUCnYH8pRTW3i3GFqQqYeZvNIFN2921YRRIo93LylchEPrNJpzmreJd5q1MoDOUfQUcbyqI50EqY2YBTSVgcEfvl1FPdX3ZxxbEF3l+NyPQGchnpbBWADyTzkBJlkDRhQ0ajO/7j9mCJBue/g03GX/43IelCVEg/uMk2RoUHbX1PcVLgSQbmmEYXrRAqGvp+xEdtiBhxEpytTDqXgGXo57a9gmHAvFJP+Fvd4byUQFFb394vXaUXayEA9Sn6fqJu4dtfCuqQwjP27EFKfIS/985AZPBeT7++G1yoCbOK1CiQAqkBCwmrU7AtPUA4HUFfWEpBVLd5yyhBIGdofwJoPj9c4/n0JfNoUBKOJdJqxHQrwZDoAVS+PP99BpbkEIXMYFLAnpbyYMWvm06GLX0Pe/TuxSIS++zrEICnaEcK8DoTXmft5jcNYRdrELXMkFVAkXvoS+XL8CPqxm2Jwfqe9XvushPgbigyDLWEjB4g/CnvCJ4P95T/VCQUiCheCLCeujjtLjGR8NxR0bA52M5q1xAgUQYmCGYZCMO31vbKZAQIieBOliJA7icztANZezBWawEAtWHiZ2BvFYKR2W/HdLM1XLd2cUq60mmX0kgPz6rbycpXiW/U4Lvc+ebXEqBMOArE8hmquY4hkLpsxuhTevehUGBVA6PdAvQGw8ftPHGdAFwFSmftyaaeI4CMaHEND8RyLpTW3gNwWElNIFsSGQXq5IXmXlBIG8xtDD2y6xtrCLo+zofU6+yBTEllXC6xwN5oRT6BkdkjSg1RRzaGArEyKVpJcq6UC28EIVnEOxWbS2W6TVJHBRIWnG/1lrdddpq4Umrha7MM0HUchduaPusTNzPFsSEUgRpdKuw1caT7K+ioKtaeCSStRBdly3EyvEG8ANAf9xTJ01DGZRAsi0KM7xrGsSQ66sE2zbrEw5tupQ2dse/qwuHZd5bUUEJpOzW6HujxA/ZERC8nc5xFNr+qjLGUCBlaDGtEQG9dQRt9JvaaiwbSYEYuZyJDAlcCnDYxLHGOvsoEEPPM9l6ArrF0Dt4R6/UaWycKJDYPHpP9uhNhhCcSgsnX1+p83v67L1/hgK5d+SN/+CZAKdXM5w2efBt6gUKxJRUuum+iOBctXA+vcZ5CqLgID3dYN9oedZtAi4guEhVEHcBsQVJSCy3AtA2CyYKmIi6+RfzOKKKi4MSSLYdYquefUBVIDU57/U1LlLrFrn0V1ACcWkYyyIBFwQoEBcUWUa0BCiQaF1Lw1wQoEBcUGQZ0RKgQKJ1LQ1zQYACcUGRZURLgAKJ1rU0zAUBCsQFRZYRLQEKJFrX0jAXBCgQFxRZRrQEKJBoXUvDXBCgQFxQZBnREqBAonUtDXNBgAJxQZFlREuAAonWtTTMBQEKxAVFlhEtAQokWtfSMBcEKBAXFFlGtAQokGhdS8NcEKBAXFBkGdESoECidS0Nc0GAAnFBkWVES4ACida1NMwFAQrEBUWWES0BCiRa19IwFwQoEBcUWUa0BCiQaF1Lw1wQoEBcUGQZ0RKgQKJ1LQ1zQYACcUGRZURLgAKJ1rU0zAUBCsQFRZYRLQEKJFrX0jAXBCgQFxRZRrQEKJBoXUvDXBCgQFxQZBnREqBAonUtDXNBgAJxQZFlREuAAonWtTTMBYH/A+oysAW2L0qkAAAAAElFTkSuQmCC"
          height="20" width="20" slot="icon">
          返回
        </mt-button>
        <mt-button v-if="isNeice" type="primary" style="margin-left: 30px;" size="small" plain @click="shengqin">
          申请内测
        </mt-button>
      </div>
    </div>
    <div class="footer">
      <p class="link">
        {{sysName}}
      </p>
      <p class="text">Copyright © 2015-2017 {{domain}}</p>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
import Vue from 'vue'
export default {
  data () {
    return {
      errorCode: "",
      errorMsg: "",
      sysName: "",
      domain: "",
      isNeice:false,
    }
  },
  created() {
    
    let { errorCode, errorMsg, sysName, domain } = this.$route.params;
    if(Params.isObject(errorMsg) && Object.keys(errorMsg).includes('private_test') && !errorMsg.private_test){
      errorMsg="<span style='text-align:left;display: inline-block;'>亲，您当前没有内测资格，如果您在过去15天内均有连续使用移动端，请通过“意见反馈”申请内测资格，或与同天下客服团队进行申请，批准后便可进入荣誉内测组。<br><br><span style='font-size:14px'>注：申请格式（网址+登录账号）</span></span>";
      this.isNeice=true;
    }
    console.log("this.$route.params");
    console.log(this.$route.params);
    this.errorCode = errorCode||"权限错误";
    this.errorMsg = errorMsg||"您没有访问此功能的权限";
    this.sysName = sysName;
    this.domain = domain;
  },
  methods: {
    shengqin(){
      Vue.http.post(
        'pub/reg-private',
        {},
        {emulateJSON: true}
      ).then(res=>{
        Toast('您的申请已提交');
      })
    },
  },
  beforeRouteLeave (to, from, next) {
    if(to.name != "home") {
      next({name: "home"});
    } else {
      next();
    }
  }
}
</script>

<style scoped>
.error {
  height: 100%;
  background-color: #fff;
}
.msg {
  padding-top: 78px;
  text-align: center;
}

.img-area {
  margin-bottom: 30px;
  text-align: center;
  padding: 10px;
}
.img-area img {
  width: 60%;
}

.text-area .mint-button {
  border-radius: 20px;
  width: 86px;
  /*height: 36px;*/
}
.title {
  color: #666;
}
.desc {
  margin-left: 30px;
  margin-right: 30px;
  line-height: 22px;
  color: #888;
}

.footer {
  position: fixed;
  bottom: .52em;
  left: 0;
  right: 0;
  color: #999;
  text-align: center;
  font-size: 14px;
}
.link {
  display: inline-block;
  vertical-align: top;
  margin: 0 .62em;
  position: relative;
  font-size: 14px;
}
.text {
  padding: 0 .34em;
  font-size: 12px;
}

.fanhui{
  background-image: url("data:image/png;base64,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");
}
</style>
