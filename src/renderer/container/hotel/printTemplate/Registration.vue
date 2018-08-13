<template>
    <div id="guestsListTemplate" hidden>
      <div style="width: 801px; height: 542px;position: relative;background: url('../../../../../static/images/Registration-from.jpg') no-repeat;background-size: 100% 100%;">
          <div style="position:relative;left: 40px;text-align: center;font-size: 13px;">
              <div style="position: absolute;top: 92px;height: 23px;">
                  <span style="position: relative;display:inline-block;width: 182px;">{{data.roomNo}}</span>
                  <span style="position: relative;display:inline-block;width: 190px;">{{data.enterTime}}</span>
                  <span style="position: relative;display:inline-block;width: 253px;">{{data.outerTime}}</span>
                  <span style="position: relative;display:inline-block;width: 83px;">{{data.roomPrice}}</span>
              </div>
              <div style="position: absolute;top: 130px;height: 23px;">
                  <span style="position: relative;display:inline-block;width: 372px;">{{data.contactsName}}</span>
                  <span style="position: relative;display:inline-block;width: 253px;">{{data.nationality}}</span>
                  <span style="position: relative;display:inline-block;width: 83px;">{{data.gender}}</span>
              </div>
              <div style="position: absolute;top: 172px;height: 23px;">
                  <span style="position: relative;display:inline-block;width: 182px;">{{data.birthday}}</span>
                  <span style="position: relative;display:inline-block;width: 100px;">{{data.idCardType}}</span>
                  <span style="position: relative;display:inline-block;width: 252px;">{{data.idCard}}</span>
                  <span style="position: relative;display:inline-block;width: 175px;"><!--有效期--></span>
              </div>
              <div style="position: absolute;top: 207px;height: 23px;">
                  <span style="position: relative;display:inline-block;width: 182px;"><!--入境日期--></span>
                  <span style="position: relative;display:inline-block;width: 100px;"><!--入境口岸--></span>
                  <span style="position: relative;display:inline-block;width: 252px;"><!--签证种类及号码--></span>
                  <span style="position: relative;display:inline-block;width: 175px;"><!--有效期--></span>
              </div>
              <div style="position: absolute;top: 243px;height: 23px;width: 705px">
                  {{data.address}}
              </div>
              <div style="position: absolute;top: 420px;width: 373px;height: 96px;">
                {{data.note}}
              </div>
              <div style="position: absolute;width: 334px;height: 24px;top: 430px;left: 370px;">
                  {{data.telPhone}}
              </div>
              <div style="position: absolute;width: 252px;height: 54px;left: 380px;top:470px;">
                  <!--签名-->
              </div>
              <div style="position: absolute;width: 84px;height: 54px;left: 630px;top: 465px;">
                  {{data.operatorName}}
              </div>
          </div>
      </div>
    </div>
</template>
<script>
    export default {
        props:{
            printGuestData:{
                type:Object,
                default:{},
            }
        },
        data() {
            return {
                data:{},
            }
        },
        watch:{
            printGuestData:function () {
                this.data = Object.assign({},this.printGuestData);
                //格式化性别
                if (this.printGuestData.gender === "1") {
                    this.data.gender = "男";
                } else if (this.printGuestData.gender === "2") {
                    this.data.gender = "女";
                } else {
                    this.data.gender = "";
                }

            }
        }
    }
</script>
<style scoped>

</style>
