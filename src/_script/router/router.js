//引入依赖的库
import Vue from "vue";
import VueRouter from "vuerouter";

//引入路由组件

import Layout from "../pageComponents/common/layout.js";
import LayoutNoSidebar from "../pageComponents/common/layout_no_sidebar.js";


import File from "../pageComponents/file/file.js";
import Space from "../pageComponents/space/space.js";

import SpaceDetail from "../pageComponents/space/space_file.js";

import SpaceAdd from "../pageComponents/space/space_add.js";

import FileAdd from "../pageComponents/file/file_add.js";

//404页面
import NotFound from "../pageComponents/common/404_content.js";


var router = new VueRouter({
	routes:[
		{ 	//默认跳转的页面
			path: '/',
			redirect:'/space/list',
		},

	  	{ 	//空间
	  		path: '/space',
	  		component: Layout,
	  		redirect:'/space/list',
	  		children: [
		        {
		        	name:"i0",
		          	path: 'list',
		          	component: Space
				},
						
				{
		        	name:"i0-0",
		          	path: 'add',
		          	component: SpaceAdd
				},


				{
					path:"file",
					name:"i0-1",
					component:SpaceDetail,
					children:[
						{
							path:"list/:space_id",
							name:"i0-1-0",
							component: File
						},
					]
				},

				{
					name:"i0-2",
					  path: 'file/add/:space_id',
					  component: FileAdd
				},

				// {
				// 	path:"file/list",
				// 	name:"i0-1",
				// 	component: File
				// },

				// {
		        // 	name:"i1-0",
		        //   	path: 'file/add',
		        //   	component: FileAdd
				// },
	        ]
	  	},

	  	// { 	//文件
	  	// 	path: '/file',
	  	// 	component: Layout,
	  	// 	redirect:'/file/list',
	  	// 	children: [
		//         {
		//         	name:"i1",
		//           	path: 'list',
		//           	component: File
		// 		},

		// 		{
		//         	name:"i1-0",
		//           	path: 'add',
		//           	component: FileAdd
		// 		},
	    //     ]
	  	// },

	  	{ 	//捕获404
	  		path: '*',
	  		redirect:'/NotFound/404',
	  		name:"i2",
	  	},

	  	{ 	//404
	  		path: '/NotFound',
	  		component: LayoutNoSidebar,
	  		children: [
		        {
		        	name:"i2-0-0",
		          	path: '404',
		          	component: NotFound
		        },
	        ]
	  	}
	]
})

export default router;
