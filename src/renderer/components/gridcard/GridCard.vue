<template>
    <div class="grid-card">

        <slot name="cardLeft">
        </slot>

        <slot name="cardRight">
        </slot>

    </div>
</template>

<script>
export default {
  name: "GridCard",
  components: {},
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/variable.styl';
@import '../../assets/stylus/mixin.styl';

.grid-card {
    flex-center(row, space-between, center);
    padding: 5px 13px;
    border-bottom: 1px solid #eaeefb;
}

.scroll-list-wrap {
    position: relative;
    height: 100%;
    border-radius: 4px;
    transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
    overflow: hidden;
}

.left {
    flex: 1;
    flex-center(row, start, center);

    &-wrapper {
        margin-left: 8px;
        flex: 1;

        &-title {
            font-size: 17px;
            margin-bottom: 6px;
            cursor: pointer;
        }

        &-desc {
            width: 160px;
            color: #888;
            cursor: pointer;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            font-size: 14px;
        }
    }
}

.right {
    flex: 1;
    text-align: right;

    .icon-gengduo {
        font-size: 30px;
    }
}

.classifi-left {
    &-name {
        margin-bottom: 10px;
    }

    &-tag-wrapper {
        &.tag + .tag {
            margin-left: 10px;
        }
    }
}

.classifi-right {
    align-self: flex-start;
}
</style>

