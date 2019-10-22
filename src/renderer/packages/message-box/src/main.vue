<template>
  <div v-if="visible" class="popup__mask">
    <div v-if="type === 'alert'" class="popup__msg">
      <div class="popup__msg-hint">
        <div class="iconfont"></div>
        <span>{{message}}</span>
      </div>
      <div class="line"></div>
      <div class="btnWrap">
        <div class="btn" @click="enter">
          {{confirmBtnText}}
        </div>
      </div>
    </div>
    <div v-if="type === 'confirm'" class="popup__msg">
      <div class="popup__msg-hint">
        <span class="iconfont"></span>
        <span>{{message}}</span>
      </div>
      <div class="line"></div>
      <div class="btnWrap">
        <div class="btn conBtn" @click="close">
          {{cancelBtnText}}
        </div>
        <div class="btn" @click="enter">
          {{confirmBtnText}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'YBMessageBox',
    props: {
      type: {
        type: String,
        default: ''
      },
      message: {
        type: String,
        default: ''
      },
      confirmBtnText: {
        type: String,
        default: '确定',
      },
      cancelBtnText: {
        type: String,
        default: '取消',
      },
      confirm: Function,
      cancel: Function,
    },
    data() {
      return {
        visible: false
      }
    },
    methods: {
      close() {
        this.visible = false
        //this.$emit('close')
        this.cancel()
      },
      enter() {
        this.visible = false;
        this.$emit('userConfirm')
      }
    }
  }
</script>

<style scoped>
.popup__mask{
  width: 100%;height: 100%;background: rgba(0, 0, 0, .5);display :flex;flex-direction: column;justify-content: center;align-items: center;position: fixed;top: 0;left: 0;z-index:2;
}
.popup__mask>.popup__msg{
  width: 40%;height :30%;background: #fff;border-radius :30px;display :flex;flex-direction :column;align-items: center;
}
.popup__mask>.popup__msg>.popup__msg-hint{
  color: #246aaf;font-size: 20px;display :flex;justify-content: center;align-items: center;width: 100%;height :60%;
}
.popup__mask>.popup__msg>.popup__msg-hint>.iconfont{
  display: inline-block;width: 50px;height :50px;font-size: 80px;padding-right :10px;background: url("./images/iconfont.png") no-repeat;-webkit-background-size: 100% auto;background-size: 100% auto;margin-right: 15px;
}
.popup__mask>.popup__msg>.popup__msg-hint>span{
  font-size: 30px
}
.popup__mask>.popup__msg>.line{
  border-bottom: 1px solid #246aaf;width: 80%;opacity: .3;
}
.btn{
  width: 22%;height :50%;margin-top: 4%;background: #246aaf;color: #fff;font-size: 25px;display: flex;justify-content: center;align-items: center;border-radius: 15px;cursor: pointer
}
.btn:active{
  background: skyblue
}
.btnWrap{
  display: flex;justify-content: center;width: 100%;height: 30%;
}
.conBtn{
  margin-right: 40px;background: transparent;border: 1px solid #246aaf;color: #246aaf !important;box-sizing: border-box
}
</style>
