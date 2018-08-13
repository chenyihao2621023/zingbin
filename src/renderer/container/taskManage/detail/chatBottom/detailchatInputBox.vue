<template>
    <div class="taskManage-input-box taskManage-border-top-1px">
        <div class="input-box-left">
            <!--<i class="iconfont icon-jianpan" @click="handleKeyboard"></i>-->
        </div>
        <div class="input-text" :class="{active: inputActive}">
            <div class="input-scroll-mask">
                <textarea
                    ref="input"
                    @focus="onFocus"
                    @blur="onBlur"
                    @click="onClick"
                    @paste="onPaste"
                    @change="onChange"
                    v-model="text"
                    rows="1"
                    v-adjust-and-scroll
                    @resize="onInputResize"
                    @keyup="onKeyup"
                />
            </div>
        </div>
        <div class="input-box-right">
            <i class="iconfont icon-biaoqing"
               @click="handleEmoji"
               v-if="fooderContent !== 'emoji'"></i>
            <i class="iconfont icon-jianpan" @click="handleKeyboardRight" v-else></i>
            <i class="iconfont icon-tianjia1" @click="handleMore" v-if="text.length === 0"></i>
            <div
                class="send-btn"
                v-else
                @click="send">
                {{'发送'}}
            </div>
        </div>
        <org-member-picker
            :showPicker="showPersonPicker"
            :showTab="showTab"
            @picked="onPicked"
            @abort="onPickAbort">
        </org-member-picker>
    </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import AdjustAndScroll from "../../../chat/adjust-and-scroll";
import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";

export default {
  name: "InputBox",
  directives: {
    AdjustAndScroll
  },
  components: {
    OrgMemberPicker
  },
  props: {
    activitieId: String,
    activitieVal: String,
    activitieRouting: String,

    updadeTaskActivits: Function,
    insertParams: Object,
    loadParams: Object,
    emojiIconShow: {
      type: Boolean,
      default: true
    },
    fooderContent: {
      type: String,
      default: "emoji"
    }
  },
  data() {
    return {
      clientY: 0,
      inputActive: false,
      text: "",
      showPersonPicker: false,//是否显示选人组件
      showTab:['colleague'],//自定義顯示選人tab

      newPerson:''
    };
  },
  computed: {
    ...mapState({
      insertTexts: state => state.taskChat.insertTexts
    })
  },
  watch: {
    insertTexts(val) {
      if (!val) return;
      // 重复发送相同表情需要清空上次状态
      this.insertText("");
      setTimeout(() => {
        this.insertAtCursor(this.$refs.input, val, value => {
          this.text = value;
        });
      }, 200);
    },
    activitieVal() {
      //监视编辑评论的值
      this.text = this.activitieVal;
    }
  },
  mounted() {},
  methods: {
      onPicked(list) {
       this.showPersonPicker = false;
       let arr = ''
        for (let i=0; i< list.length; i++){
            arr += list[i].cardUrl + ' '
        }
        this.newPerson = arr

        this.text += this.newPerson + ':'
        this.$refs.input.focus()
    },
    onPickAbort() {
      this.showPersonPicker = false;
    },
    ...mapMutations({
      insertText: "INSERT_TEXT",
      insertTextEnd: "INSERT_TEXT_END"
    }),
    insertAtCursor(input, value, cb) {
      console.log("value", value);
      if (document.selection) {
        const sel = document.selection.createRange();
        sel.text = value;
        sel.select();
      } else if (input.selectionStart || input.selectionStart === "0") {
        const startPos = input.selectionStart;
        const endPos = input.selectionEnd;
        const restoreTop = input.scrollTop;
          input.value =
              input.value.substring(0, startPos) +
              value +
              input.value.substring(endPos, input.value.length);
        if (restoreTop > 0) {
          input.scrollTop = restoreTop;
        }
        // input.focus();
        input.selectionStart = startPos + value.length;
        input.selectionEnd = startPos + value.length;
      } else {
        input.value += value;
        //                    input.focus();
      }
      // 触发input事件
      let inputEvt = new Event("input", {
        view: window,
        bubbles: true,
        cancelable: true
      });
      input.dispatchEvent(inputEvt);

      cb(input.value);
    },
    onFocus() {
      this.inputActive = true;
      this.$emit("inputFocus");
    },
    onBlur() {
      this.inputActive = false;
    },
    onClick() {
      console.log("onclick");
      this.$emit("inputClick");
    },
    onPaste() {},
    onChange() {},
    onKeyup() {
      if (this.text.length === 1 && this.text === "@") {
         this.showPersonPicker = true;

//        this.text += this.newPerson + ':'
      } else if(this.text.length === 0){
          this.newPerson = ''
      }
    },
    onInputResize() {
      this.$emit("inputResize");
    },
    handleEmoji() {
      this.$emit("emojiClick");
    },
    handleMore() {
      this.$emit("moreClick");
    },
    handleKeyboardRight() {
      this.$emit("rightKeyboardClick");
    },
    send() {
      let that = this;

        //编辑评论
      if (this.activitieVal) {
        let url = "/ZingMH/ZDesk/activity/mater/updateActivity.action";
        let params = {
          // 【（已编辑）】
          activitieId: this.activitieId,
          val: that.text,
          activitieRouting: this.activitieRouting
        };
        that.$http
          .get(url, { params: params })
          .then(res => {
              //通知load
              let TellDetail = 3;
              let TellVal = {
                  imgVal: {
                      fileName: "",
                      fileSize: "",
                      relativePath: ""
                  },
                  filedVal: {
                      fileName: ""
                  },
                  commentVal: {
                      val: that.text
                  }
              };
              let TellValJSON = JSON.stringify(TellVal);
              //第四个参数 delete 删除 update 修改
              that.updadeTaskActivits(params, TellDetail, TellValJSON,'update');
              //清空this.activitieVal
              this.activitieVal = ''
          })
          .catch(err => {
            console.log(err);
          });
      }
      //添加评论
      else {
        let url = "/ZingMH/ZDesk/activity/mater/insertActivity.action";
        that.insertParams.val = that.text;
        that.insertParams.prefixMsg = "添加评论";
        that.insertParams.type = "comment";
        that.$http
          .get(url, { params: that.insertParams })
          .then(res => {
            //通知load
            let TellDetail = 3;
            let TellVal = {
              imgVal: {
                fileName: "",
                fileSize: "",
                relativePath: ""
              },
              filedVal: {
                fileName: ""
              },
              commentVal: {
                val: that.text
              }
            };
            let TellValJSON = JSON.stringify(TellVal);
            that.updadeTaskActivits(res.data.data, TellDetail, TellValJSON);
          })
          .catch(err => {
            console.log(err);
          });
      }

      that.text = "";
      that.newPerson = '';//選人清空
      that.$refs.input.focus();
      that.$refs.input.style.height = "30px";
    }
  }
};
</script>
<style lang="stylus">
@import '../../../../assets/stylus/variable.styl';
@import '../../../../assets/stylus/mixin.styl';

.taskManage-input-box {
    height 50px
    padding: 4px 10px;
    background-color: #f2f2f2;
    width: 100%;
    border-top: 1px solid #d9d9d9;
    flex-center(space-between, center);

    .input-box-left {
        height: 100%;
        line-height: 1;
    }
    .iconfont {
        font-size: 30px;
    }
    &.taskManage-border-top-1px {
        border-top-1px(#E4E4E6)
    }
    i {
        color: #7d7d7d;
    }
    .input-text {
        flex: 1;
        padding: 0 10px;

        .input-scroll-mask {
            width: 100%;
            overflow: hidden;
            border-bottom  1px solid #919191
            textarea {
                width: calc(100% + 10px);
                padding: 5px 10px 5px 0;
                border: none;
                background-color: transparent !important;
                max-height: 84px;
                font-size: 16px;
                resize: none;
                overflow-y: auto;

                &:focus {
                    outline: none;
                }
            }
        }

        &.active {
            .input-scroll-mask {
                textarea {
                    border-bottom: 1px #fe8c19 solid;
                }
            }
        }
    }

    .input-box-right {
        flex-center(row, center, center);

        & > i:first-child {
           margin-right: 0.5rem;
        }

        & > .send-btn {
            display: inline-block;
            width: 44px;
            height: 30px;
            font-size: 16px;
            line-height: 32px;
            text-align: center;
            background-color: #ff8000;
            color: #fff;
            border-radius: 3px;
            user-select: none;
        }
    }

    .open-height {
        height: 40px;
    }
}
</style>

