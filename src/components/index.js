import Grid from "./grid.vue";
import GridItem from "./grid-item.vue";
import Block from "./block.vue";
import Pad from "./pad.vue";
import Cell from "./cell.vue";
import ButtonBlock from "./button-block.vue";
import ButtonPanel from "./button-panel.vue";
import Modal from "./modal.vue";
import Radio from "./radio.vue";
import MediaBox from "./media-box.vue";
import Search from "./search.vue";
import Navbar from "./navbar.vue";
import BottomBox from "./bottom-box.vue";
import tableView from "./table-view.vue";
import checklist from "./checklist.vue";
import datetime from "./datetime";
import {Accordion, AccordionItem} from "./accordion";
import {TimeLine, TimeLineItem} from "./timeline";

export default function(Vue){
    //注册自定义组件
    Vue.component(Grid.name, Grid);
    Vue.component(GridItem.name, GridItem);
    Vue.component(Block.name, Block);
    Vue.component(Pad.name, Pad);
    Vue.component(Cell.name, Cell);
    Vue.component(Modal.name, Modal);
    Vue.component(Radio.name, Radio);
    Vue.component(ButtonBlock.name, ButtonBlock);
    Vue.component(ButtonPanel.name, ButtonPanel);
    Vue.component(MediaBox.name, MediaBox);
    Vue.component(Search.name, Search);
    Vue.component(Navbar.name, Navbar);
    Vue.component(BottomBox.name, BottomBox);
    Vue.component(tableView.name, tableView);
    Vue.component(checklist.name, checklist);
    Vue.component(datetime.name, datetime);
    Vue.component(Accordion.name, Accordion);
    Vue.component(AccordionItem.name, AccordionItem);
    Vue.component(TimeLine.name, TimeLine);
    Vue.component(TimeLineItem.name, TimeLineItem);
}
