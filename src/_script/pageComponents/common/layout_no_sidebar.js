//引入依赖的库
import Vue from "vue";
import Header from "../common/header.js";
import SideBar from "../common/sidebar.js";
import Footer from "../common/footer.js";
export default Vue.component('LayoutNoSidebar', {
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
			document.querySelector(".right").style.minHeight = (winHeight-headerHeight-1)+"px";
			document.querySelector(".right > .right_content").style.minHeight = (winHeight-headerHeight-footerHeight-79-1)+"px";
		},
		setWidth:function(){
			this.$el.querySelector(".right").style.width="100%";
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
