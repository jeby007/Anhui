import Vue from 'vue'

import App from './App'
import VueI18n from 'vue-i18n'
import VueResource from 'vue-resource'
import $ from 'jquery'

//统一提示框
import MessageBox from './packages/message-box'
Vue.use(MessageBox)

Vue.use(VueResource);
Vue.use(VueI18n)

import VideoPlayer from 'vue-video-player'

require('video.js/dist/video-js.css')

require('vue-video-player/src/custom-theme.css')

Vue.use(VideoPlayer)

import Video from 'video.js'
import 'video.js/dist/video-js.css'

Vue.prototype.$video = Video


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false



const i18n = new VueI18n({
    locale: 'zh', // ���Ա�ʶ
	messages: {
        'zh': require('./common/lang/zh'),
        'en': require('./common/lang/en')
    }
})

//this.$i18n.locale = 'en'

/* eslint-disable no-new */
new Vue({
   i18n,
  components: { App },
  template: '<App/>'
}).$mount('#app')
