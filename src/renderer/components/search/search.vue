<template>
    <div v-show="searchFlag" class="searchContainer">
        <div class="Top-bar">
            <span class="cancel-icon">
                <span class="cancelInput" @click="cancelInput">取消</span>
            </span>
            <span class="inputSpan" id="inputSpan">
                <form action="" class="">
                    <input ref="input" class="inputForm" :placeholder="holder" v-model="inputText">
                </form>
            </span>
            <span class="confirm-icon">
                <span class="confirmInput" @click="confirmInput">确定</span>
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "search",
        props:{
            searchFlag:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                inputText:"",
            }
        },
        methods:{
            cancelInput() {
                this.$emit("cancelInput",this.inputText)
            },
            confirmInput() {
                this.$emit("confirmInput",this.inputText)
            },
            setFocus() {
                this.$nextTick(() => {
                    this.$refs.input.focus()
                })
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .searchContainer{
        width:100%;
        background-color: #F7F8F9;
        padding: 5px 13px;
        .Top-bar{
            padding-bottom 12px
            position relative
            height 30px
            width 100%
            .goback{
                position absolute
                top: 50%
                transform translateY(-50%)
                i{
                    font-size 20px
                    font-weight bold
                }
            }
            .cancel-icon{
                position absolute
                top: 50%
                transform translateY(-50%)
                font-size: 14px;
                span{
                    color: #BDBDBD;
                }
            }
            .inputSpan{
                position: absolute;
                left: 40px;
                right:90px;
                top 50%
                transform translateY(-50%)
                .inputForm{
                    width:100% ;
                    padding: 4px 20px 4px 28px !important;
                    margin-left: 5px;
                    font-size: 16px !important;
                    background: url(../../../../static/images/search.png) center left no-repeat;
                    background-size: 16px 16px;
                    background-position-x: 7px;
                    background-color: white;
                    border-radius: 8px !important
                }
            }
            .confirm-icon{
                position: absolute;
                top 50%
                transform translateY(-50%)
                right: 5px;
                font-size: 16px;
                .confirmInput{
                    color: #ff8000 ;
                    font-size 14px
                    text-decoration:none;
                }
            }

        }
    }
    input::-webkit-input-placeholder{
        color: #707070 ;
        font-size 14px
        font-family italic
    }
    .inputForm:focus{
        outline none !important
    }
    #inputSpan{
        right 50px
    }
</style>
