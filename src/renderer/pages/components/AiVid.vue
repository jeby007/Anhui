<template>
  <div class="aiVid">
    <video
      id="AiVid"
      preload="auto"
      class="video-js"
      type="video/mp4"
      :autoplay='true'
      @touchstar="togglePlay"
      @click="switchVid"
      @ended="vidEnd"
    >
      <source
        :src = 'vid'
        type = "video/mp4"
      />
    </video>
    <!--<div class="closeBtn" @click="closeVid"></div>-->
    <!--<div class="playIcon" v-show="aiPlayer && isPlay"></div>-->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        aiPlayer:null,
        isPlay:false,
        vid:require('../../../os/vid/test1.mp4')
      }
    },
    mounted(){
      this.$nextTick(()=>{
        this.initVideo()
      })
    },
    methods:{
      switchVid(){
        this.$emit('closeAiVid',false)
        this.aiPlayer.pause()
      },
      vidEnd(){
        alert(11)
      },
      togglePlay(){
        //this.aiPlayer.paused() ? this.aiPlayer.play() : this.aiPlayer.pause()
      },
      toCarPage(){
        this.$emit('toggleShowCarPage',true)
      },
      initVideo(){
        this.aiPlayer = this.$video(AiVid,{
          controls: false,
          autoplay: true,
          preload: "auto",
          fluid:true,
          loop:true
          // width:'1920px',
          // height:'1080px'
        })
      },
    },
  }
</script>

<style scoped>
  .aiVid{width: 100%;height:100%;position: fixed;top: 0;left: 0;z-index: 5;background: rgba(0,0,0,.8)}
  .aiVid>video{width: 100%;height: 100%}
  .aiVid>.closeBtn{width: 50px;height: 50px;background: url("../../../os/closeicon.png") no-repeat center;position: absolute;top: 30px;right: 30px;animation:upToDown 1s infinite alternate;cursor: pointer;}
  .playIcon{position: absolute;width: 100px;height: 100px;background: url("../../../os/playicon.png") no-repeat center;background-size: 100% auto;top:50%;left: 50%;transform: translate(-50%,-50%)}
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
  .homeSwip>>>.video-js .vjs-big-play-button{position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);}
  .homeSwip>>>.video-js .vjs-fullscreen-control{display: none}
  .homeSwip>>>.video-js .vjs-picture-in-picture-control{display: none}

</style>
