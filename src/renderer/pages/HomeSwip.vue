<template>
  <div class="homeSwip">
<!--
    <div class="homeAi">
      <div class="btnWrap">
        <div @click="isShowAiVideo = true">AI场景</div>
        <div @click="toCarPage">蜘蛛智选</div>
      </div>
    </div>
-->
    <transition name="fade">
      <!--带bar页面-->
      <AiVid @closeAiVid="closeAiVid" v-if="isShowAiVideo"/>
      <!--<AiVid2/>-->
    </transition>
    <transition name="fade">
      <div v-show="!isShowAiVideo">H5页面</div>
    </transition>
  </div>
</template>

<script>
  import AiVid from "./components/VidTest1";
  import AiVid2 from "./components/AiVid";
  export default {
    props:['isShowCarPage'],
    data() {
      return {
        isShowAiVideo:true,
        aiPlayer:null
      }
    },
    methods:{
      toCarPage(){
        this.$emit('toggleShowCarPage',true)
      },
      closeAiVid(res){
        this.isShowAiVideo = res
      }
    },
    components:{AiVid,AiVid2}
  }
</script>

<style scoped>
  .homeSwip{width: 100%;height: 100vh}
  .homeAi{width: 100%;height: 100%;background: url("../../os/homeAi_bg.jpg") no-repeat center;background-size: 100% auto}
  .homeAi>.btnWrap{width: 420px;height: 62px;position: fixed;left: 255px;bottom: 285px;display: flex;align-items: center;justify-content: space-between;font-size: 26px}
  .homeAi>.btnWrap>div{width: 190px;height: 100%;display: flex;justify-content: center;align-items: center;border-radius: 5px;color: #fff;cursor: pointer;}
  .homeAi>.btnWrap>div:first-child{background: #444444}
  .homeAi>.btnWrap>div:last-child{background: #1f7bce}
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to{
    opacity: 0;
  }
  @keyframes upToDown {
    from{transform: translateY(10px) scale(1.2);opacity: .5}
    to{transform: translateY(0);opacity: .5}
  }
  .homeSwip>>>.video-js .vjs-big-play-button{position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);opacity: 0}
  .homeSwip>>>.video-js .vjs-fullscreen-control{display: none}
  .homeSwip>>>.video-js .vjs-picture-in-picture-control{display: none}
</style>
