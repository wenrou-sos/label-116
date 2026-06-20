import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { pinia } from './stores'
import { lazyLoadDirective } from '@/composables/useLazyLoad'
import {
  NavBar,
  Tabbar,
  TabbarItem,
  Icon,
  Field,
  Cell,
  CellGroup,
  Button,
  Loading,
  Toast,
  Dialog,
  Popup,
  Tabs,
  Tab,
  PullRefresh,
  List,
  Picker,
  Search,
  Tag,
  Grid,
  GridItem,
  Empty,
  Sticky,
  Col,
  Row,
  Image as VanImage
} from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.use(NavBar)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Icon)
app.use(Field)
app.use(Cell)
app.use(CellGroup)
app.use(Button)
app.use(Loading)
app.use(Toast)
app.use(Dialog)
app.use(Popup)
app.use(Tabs)
app.use(Tab)
app.use(PullRefresh)
app.use(List)
app.use(Picker)
app.use(Search)
app.use(Tag)
app.use(Grid)
app.use(GridItem)
app.use(Empty)
app.use(Sticky)
app.use(Col)
app.use(Row)
app.use(VanImage)

app.directive('lazy', lazyLoadDirective)

app.config.globalProperties.$toast = Toast
app.config.globalProperties.$loading = Toast.loading
app.config.globalProperties.$closeLoading = Toast.clear
app.config.globalProperties.$confirm = Dialog.confirm
app.config.globalProperties.$successToast = Toast.success

app.mount('#app')
