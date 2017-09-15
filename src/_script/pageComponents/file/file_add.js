//引入依赖的库
import $ from "jquery";
import Vue from "vue";

import tools from "../common/tools.js";

import {Row,Col,Button,Input,Icon,Menu,Modal,Select,Option,Table,Page,DatePicker,MenuItem,Submenu} from "ui";

import FileForm from "./file_form.vue";


export default Vue.component('SpaceAdd', {
	props: {

	},

	data (){
		return {
			title:"上传文件",

			canLeave:false,
		}
	},
	methods:{
		submitHandler(){
			this.canLeave = true;
		},
	},
	beforeMount (){

	},
	mounted (){
		document.title=this.title;

		var vm = this;
		//初始化页面数据
		
	},

	beforeRouteLeave (to, from, next) {
        if(!this.canLeave){
        	tools.modalMessage("你确定放弃当前上传文件的操作吗?",function(){
				let route_arr = from.name.split("-");
				let name = route_arr[0]+"-"+route_arr[1];
				$(".sidebar span[data-name="+name+"]").trigger('click');
                next(false);
        	},function(){
				let route_arr = to.name.split("-");
				let name = route_arr[0]+"-"+route_arr[1];
				$(".sidebar span[data-name="+name+"]").trigger('click');
        		next();
        	});
        }else{
            let route_arr = to.name.split("-");
            let name = route_arr[0]+"-"+route_arr[1];
            $(".sidebar span[data-name="+name+"]").trigger('click');
            next();
        }
        
    },

	render (h) {
		

    	return (
      		<div class="res_add file_add">
                <div class="filter_wrap">
          			<Row class="top_progress" type="flex" justify="start" align="middle">
          				<Col class="step_name active">上传文件</Col>
          			</Row>
                </div>
                <div class="table_wrap">
      			   <FileForm submitHandler={this.submitHandler}></FileForm>
                </div>
      		</div>
    	)
  	}
})
