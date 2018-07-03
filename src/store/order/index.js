import order from './order.js'
import customer from './customer.js'
import city from './city.js'
import saler from './saler.js'
import price from './price.js'
import plan from './plan.js'
import bills from './bills.js'
import receipt from './receipt.js'
import tour from './tour.js'
import confirmbook from './confirmbook.js'
import plansnotice from './plansnotice.js'
import attachment from './attachment.js'

order.modules = {
  customer,
  city,
  price,
  saler,
  plan,
  bills,
  receipt,
  tour,
  confirmbook,
  plansnotice,
  attachment,
}

export default order;
