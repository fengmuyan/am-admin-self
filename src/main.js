import 'normalize.css/normalize.css'
import '@/assets/styles/index.scss'
import '@/assets/el-style/index.css'
import '@/assets/styles/am.scss'
import '@/assets/styles/private.scss'
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'
import throttle from './directive/throttle'

import './assets/icons'
import './permission'
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, download } from "@/utils/am";
import Pagination from "@/components/Pagination";

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.download = download

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}
Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}
Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

// 全局组件挂载
Vue.component('Treeselect', VueTreeselect.Treeselect)
Vue.component('Pagination', Pagination)

Vue.use(permission)
Vue.use(throttle)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
