//引入依赖的库
import $ from "jquery";
import Vue from "vue";

import tools from "../common/tools.js";

import {Row,Col,Button,Input,Icon,Menu,Modal,Select,Option,Table,Page,DatePicker,MenuItem,Submenu} from "ui";

export default Vue.component('Header', {
	props: {
		
	},

	data (){
		return {
			user:"USER",
		}
	},
	beforeMount (){

	},
	mounted (){
		let vm =this;

		vm.getUserInfo();

		$(vm.$el).on("click",".logout",function(){
			tools.ajax({
				url:"/common-portal/common/portal/logout",
				type:"post",
			},function(message,data){
				window.location.reload();
			});
		});
	},

	methods:{
		getUserInfo(){
			let vm = this;
			tools.ajax({
				url:"/oss-manager/api/oss/user/list",
				type:"get",
			},function(message,data){
				vm.user = data.name;
			});
		}
	},

	render (h) {
    	return (
  			<Row class="header" type="flex" justify="start" align="middle">
  				<Col class="logo">
  					<img src={require("../../../_images/logo.png")} alt="" />
  				</Col>
  				<Col class="logo_name">
  					<span>文件存储平台</span>
  				</Col>
        		<Col class="user">
					<Row type="flex" justify="end" align="middle">
						<Col>
							<a href="http://e.yiche.com/entrance.html"><img title="主页" class="toHome" src={require("../../../_images/custom-backhome.svg")}></img></a>
					    </Col>
      					<Col>
					        <span class="username">
					            {"欢迎您，"+this.user}
					        </span>
					    </Col>
					    <Col>
							{/*"<span title="消息" class="icon-custom-message"></span>
		<span title="帮助" class="icon-custom-help"></span>"*/}
							<a class="logout"><span title="退出" class="icon-custom-exit"></span></a>
					    </Col>
				    </Row>
        		</Col>

    		</Row>
    	)
  	}
})
