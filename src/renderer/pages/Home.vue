<template>
  <div class="carTypeWrap">
    <transition name="fade">
      <home-swip/>
    </transition>
  </div>
</template>

<script>
  import HomeSwip from "./HomeSwip";
  import {ipcRenderer} from 'electron'
  export default {
    data() {
      return {
        isShowSelect:[1,0,2],
        carList: {},
        isShowCarPage:true
      }
    },
    mounted(){
      document.body.style.overflowY = 'hidden'
    },
    created() {
    },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link)
      },
      toggleShowCarPage(res){
        this.isShowCarPage = res
      }
    },
    components: {
      CarPage,
      HomeSwip,
    },
    props: ['isadmin']
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');


  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Source Sans Pro', sans-serif;
  }
  .carTypeWrap{
    height: 100vh;width: 100%;
    background: url("../../os/allCar_bg.jpg") no-repeat;
    -webkit-background-size: 100% auto;
    background-size: 100% auto;
  }
  .tabControl{
    height: 16%;width: 100%;border-top: 5px solid #fff;box-sizing: border-box;display: flex;justify-content: space-between;
  }
  .tabControl>li{
    width: 33.33%;height: 100%;color: #b3b7bd;display: flex;justify-content: center;align-items: center;font-size: 38px;position: relative;cursor: pointer;
  }
  .tabControl>li.active:before{
    content: "";display: block;width: 0px;height: 0px;position: absolute;left: 50%;top: -50px;margin-left: -20px;bottom: -45px;border-top: 20px transparent dashed;border-right: 20px transparent dashed;border-left: 20px transparent dashed;border-bottom: 30px #052748 solid;
  }
  .tabControl>li.active:after{
    content: '';display: block;width: 100%;height: 100%;position: absolute;top: 0;left: 0;
    background: rgba(5,39,72,.5);
  }
  .tabControl>.brand{
    background:url("../../os/brand_bg.jpg") no-repeat;
    -webkit-background-size: auto 100%;
    background-size: 100% 100%;
    flex-direction: column;line-height: 50px;
  }
  .tabControl>.brand>.en{
    font-size: 48px;font-weight: bold;font-family: Arial,serif;
  }
  .tabControl>.technology{
    background:url("../../os/technology_bg.jpg") no-repeat;
    -webkit-background-size: auto 100%;
    background-size: 100% 100%;
    width: 33.34%;
  }
  .tabControl>.carType{
    background:url("../../os/carType_bg.jpg") no-repeat;
    -webkit-background-size: auto 100%;
    background-size: 100% 100%;
  }
  .technologyIcon{
    width: 70px;height: 71px;margin-right: 40px;
    background:url("../../os/technologyIcon.png") no-repeat;
    -webkit-background-size: 100% auto;
    background-size: 100% auto;
  }
  .carTypeIcon{
    width: 72px;height: 47px;margin-right: 40px;
    background: url("../../os/carTypeIcon.png") no-repeat;
    -webkit-background-size: 100% auto;
    background-size: 100% auto;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to{
     opacity: 0;
  }
</style>
