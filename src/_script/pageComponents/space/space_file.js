//引入依赖的库
import Vue from "vue";

import {Menu,MenuItem,Submenu} from "ui";

export default Vue.component('SpaceDetail', {
	props: {

	},

	data (){
		return {
			tag:[
				{name:"文件列表",route_name:"i0-1-0",url:"/file/list",disable:false},
			]
		}
	},

	mounted (){

	},

	render (h) {
		let menu = this.tag.map((item,i)=>{
			return (
				<router-link class={(item.disable?"disabled":"")} to={item.disable?"":item.url+this.$route.params.space_id}>
		        	<MenuItem name={item.route_name}>{item.name}</MenuItem>
		        </router-link>
			);
		});
    	return (
    		<div>
    			<div class="menu_level3_wrap">
	    			<Menu class="menu_level3" accordion mode="horizontal" theme="light" active-name={this.$route.name}>
				        {menu}
				    </Menu>
			    </div>
			    <router-view></router-view>
    		</div>
    	)
  	}
})
