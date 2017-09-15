
/*
引入依赖
*/
import Vue from "vue";
import VueRouter from "vuerouter";

import router from "./_script/router/router.js";

/*
引入sass、less或css
*/

import myCss from "./_sass/pages/style.scss";

Vue.use(VueRouter);

const app = new Vue({  
    router:router,
    render (h){
    	return (
        	<router-view></router-view>
    	)
    },  
}).$mount('#app');
