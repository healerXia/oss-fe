//引入依赖的库
import Vue from "vue";

import {Row,Col,Button,Input,Icon,Menu,Modal,Select,Option,Table,Page,DatePicker,MenuItem,Submenu} from "ui";

export default Vue.component('Footer', {

	render (h) {
    	return (
  			<Row class="footer" type="flex" justify="center" align="middle">
  				<span>Copyright 2017 易车 All Right Reserved</span>
    		</Row>
    	)
  	}
})
