<template>
  <div class="cwHead">
    <div class="scroll-list-wrap">
      <ul v-if="cwkData.length > 0">
        <li v-for="(item, index) in cwkData" :key="index">
          <GridCard @click.native="showQuote(item)">
            <div slot="cardLeft" class="left">
              <!--<avatar :src="require('../../../assets/img/tou.png')"></avatar>-->
              <avatar :src="item.pzShowImg"></avatar>
              <div class="left-wrapper">
                <p class="left-wrapper-title">{{item.pzId}}</p>
              </div>
            </div>
          </GridCard>
        </li>
      </ul>
      <ul v-else>
        <div class="no-data-style">
          暂无操作记录
        </div>
      </ul>
    </div>
  </div>

</template>

<script>
import GridCard from "@/components/gridcard/GridCard";
import Avatar from "@/components/avatar/Avatar";
import Tag from "@/components/tag/Tag";

export default {
  name: "financialCWList",
  components: {
    GridCard,
    Avatar,
    Tag
  },
  props: ["cwkDatas"],
  data() {
    return {};
  },
  computed: {
    cwkData: {
      get: function() {
        return this.cwkDatas;
      },
      set: function() {}
    }
  },
  created() {
    console.log(this.cwkDatas);
  },
  methods: {
    showQuote(item) {
      this.$emit("showQuote", item);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.cwHead {
    height: 100%;

    .scroll-list-wrap {
        position: relative;
        height: 100%;
        border-radius: 4px;
        transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
        overflow: hidden;

        .left {
            flex: 1;
            flex-center(row, start, center);

            &-wrapper {
                margin-left: 10px;
                flex: 1;

                &-title {
                    font-size: $font-size-base + 2px;
                    margin-bottom: 6px;
                    cursor: pointer;
                }

                &-desc {
                    width: 160px;
                    color: #ddd;
                    cursor: pointer;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
            }
        }

        .right {
            flex: 1;
            text-align: right;

            .tag-wrapper {
                margin-top: 10px;

                &.tag+.tag {
                    margin-left: 10px;
                }
            }
        }

        .classifi-left {
            &-name {
                margin-bottom: 10px;
            }

            &-tag-wrapper {
                &.tag+.tag {
                    margin-left: 10px;
                }
            }
        }

        .classifi-right {
            align-self: flex-start;
        }

        .no-data-style {
            color: #ff8000;
            font-size: 18px;
            padding-top: 15px;
            min-height: 100px;
            text-align: center;
        }
    }
}
</style>