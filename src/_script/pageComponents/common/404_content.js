
//引入依赖的库
import $ from "jquery";
import Vue from "vue";

import tools from "../common/tools.js";
import {Row,Col,Button,Input,Icon,Menu,Modal,Select,Option,Table,Page,DatePicker,MenuItem,Submenu} from "ui";


export default Vue.component('NotFoundC', {

	data (){
		return {
			title:"404",
		}
	},
	methods:{
		
	},
	
	mounted (){
		
	},

	render (h) {

    	return (
      		<div class="container ad_account">
      			<Row type="flex" justify="center" align="top">
      				<img src={require("../../../_images/vision_404.png")} alt="" />
      			</Row>
      			<Row type="flex" justify="center" align="top">
      				<span style="margin-top:20px">Oops!! 页面好像崩溃了...</span>
      			</Row>
      			<Row type="flex" justify="center" align="top">
	      			<router-link to="/res_manage/ad_position">
	      				<img src={require("../../../_images/back_to_home.png")} alt="" style="margin-top:20px" />
	      			</router-link>
      			</Row>
      		</div>
    	)
  	}
})
