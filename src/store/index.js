import Vuex from 'vuex'
import plan from './plan'
import contact from './contact'
import mine from './mine'
import order from './order'
import notice from './notice'
import saler from './saler'
import customer from './customer'
import money from './money'
import bank from './bank'
import sys from './sys'
import follow from './follow'

export default new Vuex.Store({
  modules: {
    plan,
    contact,
    mine,
    order,
    notice,
    saler,
    customer,
    money,
    bank,
    sys,
    follow,
  },
})
