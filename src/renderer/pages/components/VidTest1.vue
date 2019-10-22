<template>
  <div class="aiVid" id="aiVid" :class="{rotateVid:isRotate}" v-show="isShowPage">
    <video-player
      :options="vidOption"
      ref="vidPlayer"
      @ended="onPlayerEnded($event)"
      @play="onPlayerPlay($event)"
      @loadeddata="onPlayerLoadeddata($event)"
    />
    <div class="vidMask" @click="switchVid(1)">
      <div class="shou" @click="closeAiVid" v-if="isShowshou"></div>
    </div>
<!--
    <video :src="vidOption.sources[0].src" autoplay id="vjs_video_3_html5_api" loop></video>
    <canvas id="vidCanvas"></canvas>
-->
  </div>
</template>

<script>
  import {ipcRenderer} from 'electron'
  export default {
    data() {
      return {
        aiPlayer:null,
        isPlay:false,
        numFlag:0,
        vidOption:{
          playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: true,       //自动播放。
          muted: false,         // 静音播放。
          loop: true,           // 循环播放。
          preload: 'auto',      // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '9:16',  // 将播放器置于流畅模式，播放比例
          fluid: true,          // 按比例缩放自适应。
          sources: [{
            src: require('../../../os/vid/vid1.mp4'),
            type: 'video/mp4'   // 类型
          }],
          poster: "../../static/images/test.jpg", //你的封面地址
          // width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: false
          // controlBar:{
          //   timeDivider: true,
          //   durationDisplay: true,
          //   remainingTimeDisplay: false,
          //   fullscreenToggle: true  //全屏按钮
          // }
        },
        isShowVidMsk:true,
        isShowshou:false,
        isRotate:true,
        isShowPage:false
      }
    },
    mounted(){
      this.$nextTick(()=>{
        //this.playCanvas()
        this.regMenus()
      })
      console.log('this is current player instance object', this.player)
    },
    methods:{
      upLoad(){
        this.isShowPage = true
      },
      regMenus(){
        ipcRenderer.on('app:refresh',(event,data)=>{
          this.isRotate = true
          this.vidOption.aspectRatio = '9:16'
          this.vidOption.sources[0].src = require('../../../os/vid/vid1.mp4')
          this.vidOption.loop = true
          this.$refs.vidPlayer.player.play()
        })
      },
      playCanvas(){
        let v = document.getElementById("vjs_video_3_html5_api");
        let c = document.getElementById("vidCanvas");
        let ctx = c.getContext('2d');
        //每16毫秒画一次图
        v.addEventListener('play', () => {
          let i = window.setInterval(function() {
            ctx.drawImage(v, 0, 0, 300, 300);
            //打印当前视频的播放时间
            console.log(v.currentTime);
            //当视频结束的时候去掉循环
            if(v.ended){
              clearInterval(i)
            }
          }, 16);
        }, false);
        // //将视频暂停
        // setTimeout(function(){
        //   v.pause();
        // },4000);
        // //将视频播放
        // setTimeout(function(){
        //   v.play();
        // },7000)
      },
      onPlayerEnded(e){

      },
      onPlayerPlay(player){
        console.log('播放');
      },
      onPlayerLoadeddata(){
        this.isShowPage = true
        console.log(this.isShowPage);
        this.$refs.vidPlayer.player.play()
      },
      switchVid(n){
        this.numFlag = this.numFlag + n
        if (this.numFlag == 1){
          this.isRotate = false
          this.vidOption.aspectRatio = '16:9'
          this.vidOption.sources[0].src = require('../../../os/vid/test2.mp4')
          this.vidOption.loop = false
        }
      },
      closeAiVid(){
        this.$parent.closeAiVid(false)
      }
    },
    computed:{
      player() {
        return this.$refs.vidPlayer.player
      }
    }
  }
</script>

<style scoped>
  .aiVid{width: 1920px;height:1080px;position: fixed;top: 0;left: 0;z-index: 5;background: rgba(0,0,0,.8)}
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
  .video-player{width: 100%;height: 100%}
  .vidMask{position: absolute;top: 0;left: 0;width: 100%;height: 100%;display: flex;align-items: center;justify-content: center}
  .shou{
    transform:rotate(-90deg);
    width: 88px;height: 83px;background: url("../../../os/shou.png") no-repeat center;background-size: 100% auto;
    animation:move 1s infinite
  }
  @keyframes move {
    from {transform: translate(0,0) rotate(-90deg)}
    to {transform: translate(-10px,-10px) rotate(-90deg)}
  }
  /*切换前平铺视频样式*/
  /*.rotateVid >>>.vjs-tech{transform: rotate(-90deg);position: absolute;top: -425px;left: 420px;width: 1080px;height: 1980px;object-fit:fill;}*/
  .rotateVid >>>.vjs-tech{transform: rotate(-90deg) translateX(60%) scale(0.55);/*position: absolute;top: -425px;left: 420px;*//*width: 1080px;height: 1980px;*/object-fit:fill;}
  /*Canvas*/
  #vidCanvas{transform: rotate(-90deg);position: absolute;top: 0;left: 0;width: 1200px;height: 1000px}
</style>
