//引入依赖的库
import $ from "jquery";
import Vue from "vue";

import {Row,Col,Button,Input,Icon,Menu,Modal,Select,Option,Table,Page,DatePicker,MenuItem,Submenu} from "ui";


export default Vue.component('SideBar', {
	props: {
		// tree:Array,
	},

	data (){
		return {
			active:this.$route.name,
			open:[],
			tree:[
				{
					name:"空间管理",
					url:"/space",
					disable:false,
					icon:"space",
				},
			]
		}
	},
	methods:{
		getActive(name){
			let route_arr = name.split("-");
			let index = parseInt(route_arr[0].substring(1,2));
			if(this.tree[index].children&&this.tree[index].children.length>0){
				this.active = route_arr[0]+"-"+route_arr[1];
			}else{
				this.active = route_arr[0];
			}
			this.open=[route_arr[0]];
		}
	},
	beforeMount(){
		this.getActive(this.$route.name);
	},
	mounted (){
		let vm = this;
		$(vm.$el).find(".menu_item_level1").off().on("click",function(){
			$(vm.$el).find(".menu_item_level1").removeClass("ivu-menu-item-active");
			$(this).addClass("ivu-menu-item-active");

			$(vm.$el).find(".submenu").removeClass("ivu-menu-opened");
			$(vm.$el).find(".submenu .ivu-menu").hide();
			vm.getActive($(this).find(".menu_item_level1_text").attr("data-name"));
		});

		$(vm.$el).find(".submenu .ivu-menu-submenu-title").off().on("click",function(){
			$(vm.$el).find(".menu_item_level1").removeClass("ivu-menu-item-active");
			
			$(vm.$el).find(".submenu").removeClass("ivu-menu-opened");
			$(vm.$el).find(".submenu .ivu-menu").hide();

			let aList = $(this).next(".ivu-menu").find("a");
			for(let i = 0;i<aList.length;i++){
				if(!aList.eq(i).hasClass("disabled")){
					let active = aList.eq(i).find(".menu_item_level2 .menu_item_level2_text").attr("data-name");
					vm.getActive(active);
					vm.$router.push(aList.eq(i).attr("href").replace("#",""));
					break;
				}
			}

			$(this).parent(".submenu").addClass("ivu-menu-opened");
			$(this).next(".ivu-menu").show();
		});

		$(vm.$el).find(".submenu .menu_item_level2").off().on("click",function(){
			if(!$(this).parent("a").hasClass("disabled")){
				vm.active = $(this).find(".menu_item_level2_text").attr("data-name");
			}
		})

	},

	render (h) {
		let tree = this.tree.map((item,i)=>{
			if(item.children){
				let children = item.children.map((child,j)=>{
					return (
						<router-link class={(child.disable?"disabled":"")} to={child.disable?"":child.url}>
							<MenuItem class="menu_item_level2" name={"i"+i+"-"+j}>
								<span class="menu_item_level2_text" data-name={"i"+i+"-"+j}>{child.name}</span>
				        	</MenuItem>
				        </router-link>
				    )
				});
				return (
					<Submenu class="submenu" name={"i"+i}>
	                    <template slot="title">
	                    	<span class={"menu_icon iconfont ico-custom-"+item.icon} ></span>
	                        <span>{item.name}</span>
	                    </template>
	                    {children}
	                </Submenu>
				)
			}else{
				return (
					<router-link class={(item.disable?"disabled":"")} to={item.disable?"":item.url}>
						<MenuItem class="menu_item_level1" name={"i"+i}>
							<span class={"menu_icon iconfont ico-custom-"+item.icon} ></span>
							<span class="menu_item_level1_text" data-name={"i"+i}>{item.name}</span>
						</MenuItem>
					</router-link>
				)
			}
		});
    	return (
      		<div class="sidebar">
      			<Menu class="side_menu" accordion theme="light" width="auto" active-name={this.active} open-names={this.open}>
      				{tree}
      			</Menu>
      		</div>
    	)
  	}
})
