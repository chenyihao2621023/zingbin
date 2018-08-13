<template>
  <div class="loading_container">
    <div class="load_img" :style="{backgroundPositionY: '-2.5rem'}">
    </div>
    <svg class="load_ellipse" version="1.1">
      <ellipse cx="26" cy="10" rx="26" ry="10" style="fill:#ddd;stroke:none;"></ellipse>
    </svg>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //-(positionY%7)*2.5 +
        positionY: 0,
        timer: null,
      }
    },
    created() {
      this.timer = setInterval(() => {
        this.positionY++;
      }, 600)
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }
  }
</script>

<style scoped>
  @keyframes load {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-50px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  @keyframes ellipse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.3);
    }
    100% {
      transform: scale(1);
    }
  }

  .loading_container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    @include wh(2.5rem, 2.5rem);
  }

  .load_img {
    width: 45px;
    height: 35px;
    @include wh(100%, 100%);
    background: url(../../../assets/img/icon_loading.png) no-repeat 0 0;
    background-size: 2.5rem auto;
    transform: translateY(0px);
    animation: load .6s infinite ease-in-out;
    position: relative;
    z-index: 1002;
  }
  .load_ellipse{
    position: absolute;
    @include wh(2.6rem, 2rem);
    top: 2.2rem;
    left: 0.2rem;
    z-index: 1001;
    animation: ellipse .6s infinite ease-in-out;
  }
</style>
