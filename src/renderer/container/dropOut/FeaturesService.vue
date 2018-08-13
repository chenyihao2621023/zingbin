<template>
    <div>
        <zing-head :title="title"></zing-head>
        <iframe :src="src" frameborder="0" width="100%" :height="height"></iframe>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    export default {
        name: "FeaturesService",
        components:{
            ZingHead
        },
        data() {
          return {
              height:0,
              src:''
          }
        },
        computed: {
            title() {
                let t = this.$route.query.title;
                if (t === "服务协议") {
                    this.src = "/SRender?jsLoader=home%2FserviceAgreementLoader&tpl=home%2FserviceAgreement"
                } else if (t === "功能介绍") {
                    this.src = "SRender?jsLoader=home%2FfunctionIntroducedLoader&tpl=home%2FfunctionIntroduced"
                }
                return t
            }
        },
        created() {
          this.$nextTick(() => {
              this.height = (document.documentElement.clientHeight || document.body.clientHeight) - 50 + "px";
          });
        }
    }
</script>

<style scoped>

</style>
