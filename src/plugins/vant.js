// 按需全局引入 vant组件
import Vue from 'vue'
import {
  NavBar,
  Button,
  Row,
  List,
  Cell,
  CellGroup,
  Form,
  Field,
  Tabbar,
  TabbarItem,
  Grid,
  GridItem,
  Image as VanImage,
  Toast
} from 'vant'
Vue.use(Button)
  .use(NavBar)
  .use(Cell)
  .use(CellGroup)
  .use(List)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Row)
  .use(Field)
  .use(VanImage)
  .use(Form)
  .use(Toast)
  .use(Grid)
  .use(GridItem)