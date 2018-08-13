<template>
  <div>
    <card>
      <cell title="一级导航" is-link :border-intent="false" :arrow-direction="showCardContent?'up' : 'down'"
            @click.native="showCardContent=!showCardContent">
      </cell>
      <div class="slide" :class="showCardContent?'animate':''">
        <p>一级以及一级一级一级</p>
        <p>一级以及一级一级一级</p>
        <p>一级以及一级一级一级</p>
        <p>一级以及一级一级一级</p>
        <p>一级以及一级一级一级</p>
        <p>一级以及一级一级一级</p>
      </div>
      hello world
    </card>
  </div>
</template>

<script>
  import { Cell, XInput, Card } from 'vux'

  export default {
    components: { Cell, XInput, Card },
    data() {
      return {
        showCardContent: false,
      }
    },
    created: {},
    methods: {}
  }
</script>
<style scoped>
  .slide {
    padding: 0 20px;
    overflow: hidden;
    max-height: 0;
    transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
  }

  .animate {
    max-height: 9999px;
    transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
    transition-delay: 0s;
  }
</style>
