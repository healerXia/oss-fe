import $ from "jquery";
import tools from "./tools.js";

var mixins = {
	commonEventMixins:{
		mounted:function(){
			let vm = this;
			document.title=this.title;

		    //全选按钮
			$(vm.$el).on("click",".checkAll",function(){
				if($(this).hasClass('active')){
					vm.table.checkedList={};
				}else{
					let temp = {};
					for(let i = 0;i<vm.table.allIdList.length;i++){
						temp[vm.table.allIdList[i]]=true;
					}
					vm.table.checkedList = temp;
				}
			});

			//清除按钮
			$(vm.$el).on("click",".clearSelect",function(){
				vm.table.checkedList={};
			});

			//选择列时修改对应的columnsAll中列的状态
			$(vm.$el).on("click",".custom_columns .columns_box .column",function(){
				$(this).toggleClass("active");
				let selectedList = $(vm.$el).find(".custom_columns .columns_box .column.active");
				let id = $(this).attr("data-id");
				if(selectedList.length<1){
					$(this).addClass("active");
					for(let i=0;i<vm.table.columnsAll.length;i++){
						if(vm.table.columnsAll[i].id==id){
							vm.table.columnsAll[i].isShow = true;
						}
					}
				}else if(selectedList.length>10){
					$(this).removeClass("active");
					for(let i=0;i<vm.table.columnsAll.length;i++){
						if(vm.table.columnsAll[i].id==id){
							vm.table.columnsAll[i].isShow = false;
						}
					}
				}else{
					for(let i=0;i<vm.table.columnsAll.length;i++){
						if(vm.table.columnsAll[i].id==id){
							vm.table.columnsAll[i].isShow = $(this).hasClass('active');
						}
					}
				}
				
			});

			//自定义列
			$(vm.$el).on("click",".custom_columns .btn_name",function(){
				$(this).next().toggle();
			});

			//关闭自定义列
			$(vm.$el).on("click",".custom_columns .columns_box .close_btn",function(){
				$(this).parents(".columns_box").hide();
			});
		}
	},

	commonMethodsMixins:{
		methods:{
			//保存检索条件，并请求对应的列表数据
			setFormParam:function(param){
				this.formData[param.name]=param.value;
			},
			//改变页码时触发
			changePageHandler:function(page){
				this.table.page=page;
				this.setFormParam({
					name:"pageIndex",
					value:page
				});
				this.getTableData(true);
			},

			//改变每页条数时触发
			changePageSizeHandler:function(pageSize){
				this.setFormParam({
					name:"pageSize",
					value:pageSize
				});
				this.getTableData(true);
			},

			//选择列表中数据时触发
			checkBoxClickHandler:function(checkedList){
				this.table.checkedList = checkedList;
				this.$forceUpdate();
			},

		}
	},
}

export default mixins;