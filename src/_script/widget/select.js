import $ from "jquery";
import Vue from "vue";

import {Row,Col,Button,Input,Icon,Menu,Modal,Select,Option,Table,Page,DatePicker,MenuItem,Submenu} from "ui";

export default Vue.component('SelectChosen', {
	props: {
	    data: Array,
	    width:String,
	    height:String,
	    callback:Function,
	    placeholder:String,
	    multi:Boolean,
	    search:Boolean,
	},
	watch:{
		data(value){
			this.list.renderData = value;
		}
	},
	data (){
		return {
			list:{
				renderData:[],
			},
		}
	},
	methods: {
		getSelectedItem:function(){
			let tempData = [];
			for(let i = 0;i<this.data.length;i++){
				if(this.data[i].isSelect){
					tempData.push(this.data[i]);
				}
			}
			return tempData;
		},

		changeItemState:function(id,isSelect){
			for(let i = 0;i<this.data.length;i++){
				if(this.data[i].id==id){
					this.data[i].isSelect=isSelect;
				}
			}
			for(let i = 0;i<this.list.renderData.length;i++){
				if(this.list.renderData[i].id==id){
					this.list.renderData[i].isSelect=isSelect;
				}
			}
			this.$forceUpdate();
		},

		changeSingleItemState:function(id){
			for(let i = 0;i<this.data.length;i++){
				if(this.data[i].id == id){
					this.data[i].isSelect=true;
				}else{
					this.data[i].isSelect=false;
				}
			}
			for(let i = 0;i<this.list.renderData.length;i++){
				if(this.list.renderData[i].id==id){
					this.list.renderData[i].isSelect=true;
				}else{
					this.list.renderData[i].isSelect=false;
				}
			}
			this.$forceUpdate();
		}
	},
	beforeMount (){
		this.list.renderData = this.data;
	},
	beforeUpdate(){

	},
	mounted (){
		let vm = this;

		//输入关键字时进行检索
		$(vm.$el).on("input",".jq-search-box input",function(){
			let keyword = $(this).val().trim();
			let tempData = [];
			if(keyword!=""){
				vm.data.forEach((item,i)=>{
					if(item.name&&item.name.indexOf(keyword)!=-1){
						tempData.push(item);
					}
				})
				vm.list.renderData = tempData;
			}else{
				vm.list.renderData = vm.data;
			}
		});

		//点击确定，执行回调函数，将选中的数据作为参数传到回调函数中
		$(vm.$el).on("click",".jq-ok",function(){
			let tempData = [];
			for(let i = 0;i<vm.data.length;i++){
				if(vm.data[i].isSelect){
					tempData.push(vm.data[i].id);
				}
			}
			$(vm.$el).find(".jq-selected-item").removeClass("jq-select-opend");
			$(this).parents(".jq-select-drop").hide();
			if(vm.callback){
				vm.callback(tempData);
			}
			$(vm.$el).find(".jq-search-box input").val("");
			$(vm.$el).find(".jq-search-box input").trigger("input");
		});


		$(vm.$el).on("click",".jq-check-item",function(){
			let id = $(this).attr("data-id");
			$(this).toggleClass('active');
			let isSelect = $(this).hasClass('active');
			// this.checked = isSelect;
			vm.changeItemState(id,isSelect);
		});

		//全选按钮
		$(vm.$el).on("click",".jq-checkall",function(){
			for(let i = 0;i<vm.list.renderData.length;i++){
				vm.changeItemState(vm.list.renderData[i].id,true);
			}
		})

		//清除按钮
		$(vm.$el).on("click",".jq-clear",function(){
			for(let i = 0;i<vm.data.length;i++){
				vm.changeItemState(vm.data[i].id,false);
			}
			for(let i = 0;i<vm.list.renderData.length;i++){
				vm.changeItemState(vm.list.renderData[i].id,false);
			}
		})

		//单选框点击选择
		$(vm.$el).on("click",".jq-single-item",function(){
			let id = $(this).attr("data-id");
			$(this).parents(".jq-select-drop").hide();
			$(vm.$el).find(".jq-selected-item").removeClass("jq-select-opend");
			vm.changeSingleItemState(id);
			if(vm.callback){
				vm.callback(id);
			}
			$(vm.$el).find(".jq-search-box input").val("");
			$(vm.$el).find(".jq-search-box input").trigger("input");
		});

		//打开或关闭下拉面板
		$("body").on("click",function(){
			$(".jq-selected-item").removeClass("jq-select-opend");
			$(".jq-selected-item").next().hide();
			$(vm.$el).find(".jq-search-box input").val("");
			$(vm.$el).find(".jq-search-box input").trigger("input");
		})

		$(vm.$el).on("click",".jq-selected-item",function(e){
			e = e||window.event;
			e.stopPropagation();
			e.cancelBubble = true;
			$(this).toggleClass("jq-select-opend");
			$(this).next().toggle();
			$(".jq-select-drop").not($(this).next()).hide();
			$(this).next().find(".jq-search-box input").val("");
			$(this).next().find(".jq-search-box input").trigger("input");
		})

		$(vm.$el).on("click",".jq-select-drop",function(e){
			e = e||window.event;
			e.stopPropagation();
			e.cancelBubble = true;
		})

	},

	render (h) {
		let tempData = [];
		for(let i = 0;i<this.data.length;i++){
			if(this.data[i].isSelect){
				tempData.push(this.data[i].id);
			}
		}

		let search = "";
		if(this.search){
			search = <Input class="jq-search-box" icon="ios-search" type="text" placeholder="输入名称关键字" ></Input>
		}
		if(this.multi){
			let dataList = this.list.renderData.map((item,i)=>{
				return (
					<div class="jq-item" key={i}>
						<div class="jq-multi-item"><label title={item.name}>{item.name}</label><Icon class={"jq-check-item "+(item.isSelect?"active":"")} data-id={item.id} type={item.isSelect?"android-checkbox":"android-checkbox-outline-blank"}></Icon></div>
					</div>
				)
			});
			let selectedList = this.getSelectedItem();
	    	return (
	      		<div class="jq-select-box">
	        		<div class="jq-selected-item">
	        			<input type="text" placeholder={this.placeholder} value={tempData.length?("共选择 "+tempData.length+" 项"):""} readonly />
	        			<div class="jq-input-icon">
							<span class="icon-custom-arrow-down"></span>
							<span class="icon-custom-arrow-up"></span>
	        			</div>
	        		</div>
	        		<div class="jq-select-drop">
	        			{search}
	        			<div class="jq-item-list">
	        				<div class="jq-list-header">
	        					<a class="jq-checkall">全选</a>
	        					<span>已选择 {selectedList.length} 项</span>
	        				</div>
	        				<div class="jq-list-body">
	        					{dataList.length?dataList:(<p class="jq-select-empty">暂无数据</p>)}
	        				</div>
	        				<div class="jq-list-footer">
	        					<a class="jq-clear">清除</a>
	        					<a class="jq-ok">确定</a>
	        				</div>
	        			</div>
	        		</div>
	      		</div>
	    	)
		}else{
			let dataList = this.list.renderData.map((item,i)=>{
				return (
					<div class="jq-item" key={i}>
						<div title={item.name} class={"jq-single-item "+(item.isSelect?"jq-item-hover":"")} data-id={item.id}>{item.name}</div>
					</div>
				)
			});
			let selectedList = this.getSelectedItem();
	    	return (
	      		<div class="jq-select-box">
	        		<div class="jq-selected-item">
	        			<input type="text" placeholder={this.placeholder} value={selectedList.length?(selectedList[0].name):""} readonly />
	        			<div class="jq-input-icon">
	        				<span class="icon-custom-arrow-down"></span>
							<span class="icon-custom-arrow-up"></span>
	        			</div>
	        		</div>
	        		<div class="jq-select-drop">
	        			{search}
	        			<div class="jq-item-list">
	        				<div class="jq-list-body">
	        					{dataList.length?dataList:(<p class="jq-select-empty">暂无数据</p>)}
	        				</div>
	        			</div>
	        		</div>
	      		</div>
	    	)
		}
		
  	}
})
