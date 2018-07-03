import company from './company.js'
import planBill from './plan-bill.js'
import billList from './bill-list.js'
import editReceivables from './edit-receivables.js'
import common from './common.js'
import hotel from './hotel-form.js'
import meal from './meal-form.js'
import ticket from './ticket-form.js'
import car from './car-form.js'
import other from './other-form.js'

company.modules = {
    planBill,
    billList,
    editReceivables,
    common,
    hotel,
    meal,
    ticket,
    car,
    other
}

export default company;