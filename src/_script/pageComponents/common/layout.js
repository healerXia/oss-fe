//引入依赖的库
import Vue from "vue";
import Header from "../common/header.js";
import SideBar from "../common/sidebar.js";
import Footer from "../common/footer.js";
export default Vue.component('Layout', {
	props: {
		
	},

	data (){
		return {

		}
	},

	methods:{
		setHeight:function(){
			let winHeight = window.innerHeight;
			let headerHeight = document.querySelector(".header").offsetHeight;
			let footerHeight = document.querySelector(".footer").offsetHeight;
			// document.querySelector(".right").style.minHeight = (winHeight-headerHeight-1)+"px";
			document.querySelector(".right > .right_content").style.minHeight = (winHeight-150)+"px";
		},
		setWidth:function(){
			this.$el.querySelector(".right").style.width="calc(100% - 200px)";
		},
	},

	mounted (){
		this.setHeight();
		this.setWidth();
	},

	render (h) {
    	return (
    		<div class="container">
        		<Header></Header>
        		<div class="layout">
        			<div class="left">
	        			<SideBar></SideBar>
	        		</div>
	        		<div class="right" >
	        			<div class="right_content">
		        			<router-view></router-view>
	        			</div>
	        			<Footer></Footer>
	        		</div>
        		</div>
      		</div>
    	)
  	}
})
