<template>
  <div id="app">
    <Home/>
  </div>
</template>

<script>
  import Home from '@/pages/HomeSwip.vue'
  const { ipcRenderer} = require('electron');
  export default {
    created(){
      //ipcRenderer.send('autoupdate:app:check');
  	},
    components: {
      Home
    },
    mounted() {
      //this.updateApp();
      //document.body.style.overflowY = 'hidden'
      document.body.style.margin = 0
    },
    methods: {
      updateApp: function() {
        var _self = this;
          //当更新时发生错误的时候触发
          ipcRenderer.on('autoupdate:app:error', (error) => {
             console.log('--------------------', error)
          });

          //确定是否此刻下载
          ipcRenderer.on('autoupdate:app:isUpdateNow', (event) => {
              _self.$confirm({message:'是否现在更新？', confirm:() => {
                ipcRenderer.send('updateNow');
              }})
          });

          //没有可更新数据
          ipcRenderer.on('autoupdate:app:update-not-available',(event, {message}) => {
              //alert("未发现更新版本");
          });

          //发现可更新数据
          ipcRenderer.on('autoupdate:app:update-available',(event, {message}) => {
             /* alert("更新内容为：" + message.releaseNotes);*/
          });

          //下载监听 进度
          ipcRenderer.on("autoupdate:app:download-progress", (event, progressObj)=> {
                //   this.downloadPercent = progressObj.percent || 0;
                //   let _li = document.createElement("li");
                //   _li.innerHTML = "更新进度 <br>data:" + this.downloadPercent +"<hr>";
                //   _ol.appendChild(_li);
          });
      }
    }
  }
</script>

<style scoped>
  /* CSS */
</style>

