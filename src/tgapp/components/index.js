import icon from './icon.vue'
import datetime from './datetime'
// import datetime from "./datetime";
export default (Vue)=>{
  Vue.component(icon.name,icon)
  Vue.component(datetime.name,datetime)
}