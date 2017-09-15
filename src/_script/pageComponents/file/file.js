//引入依赖的库
import $ from "jquery";
import Vue from "vue";

import {Row,Col,Circle,Icon,Input} from "ui";

import tools from "../common/tools.js";
import mixins from "../common/mixins.js";

import TableCustom from "../../widget/table.vue";
import SelectCustom from "widgets/src/ssp_select/select.js";

export default Vue.component('File', {
	props: {

	},

	data (){
		return {
			title:"文件管理",


			permList:[
				{id:"",name:"全部"},
				{id:"1",name:"私有"},
				{id:"2",name:"公共读"},
				{id:"3",name:"公共读写"},
			],

			fileTypeList:[
				{id:"",name:"全部"},
				{id:"text",name:"文本"},
				{id:"image",name:"图片"},
				{id:"video",name:"视频"},
				{id:"zip",name:"压缩文件"},
			],

			formData:{
				fileName:"",
				budgetId:"",
				perm:"",
				acceptType:"",
				pageIndex:1,
				pageSize:10,
			},

			//表格初始化的列和数据
			table:{
				page:1,
				total:100,
				pageSize:10,
				pageSizeOpts:[10,20,50,100],
				allIdList:[],
				checkedList:{},
				columnsAll:[
					{id:"1",name:"文件ID",key:"fileId",isShow:true,isSort:false},
					{id:"2",name:"文件名称",key:"fileName",isShow:true,isSort:false},
					{id:"3",name:"文件类型",key:"fileType",isShow:true,isSort:false},
					{id:"4",name:"空间名称",key:"bucket",isShow:true,isSort:false},
					{id:"5",name:"文件地址URL",key:"fileUrl",isShow:true,isSort:false},
					{id:"6",name:"权限类型",key:"perm",isShow:true,isSort:false},
					{id:"7",name:"文件大小",key:"fileSize",isShow:true,isSort:false},
					{id:"8",name:"文件说明",key:"desc",isShow:false,isSort:false},
					{id:"9",name:"最新操作时间",key:"modifyTime",isShow:true,isSort:false},
				],
				data:[],

				options:{
					preview:{
						name:"预览",
						callback:function(id){

						}
					},
					download:{
						name:"下载",
						callback:this.downloadFile
					},
					delete:{
						name:"删除",
						callback:this.deleteFile
					},
				},
			}
		}

	},
	mixins:[mixins.commonEventMixins,mixins.commonMethodsMixins],
	methods:{
		getTableData(isTableChange){
			let vm = this;
			if(!isTableChange){
				vm.table.page=1;
				vm.formData.pageIndex=1;
			}
			tools.ajax({
				url:"/oss-manager/api/oss/bucket/file/list",
				type:"post",
				data:vm.formData,
			},function(message,data){
				vm.table.data = data.lists;
				vm.table.total = data.total;
			});
		},
		downloadFile(id,row){

		},
		deleteFile(id,row){
			tools.modalMessage("确定删除吗？",null,function(){
				tools.ajax({
					url:"/oss-manager/api/oss/bucket/file/delete",
					type:"post",
					data:{
						fileId:id,
					},
				},function(message,data){
					vm.getTableData();
				});
			});
		},
		nameInput(){
			this.formData.fileName = this.$el.querySelector(".nameInput").value;
		},
		selectPerm(data){
			this.formData.perm = data;
		},
		selectType(data){
			this.formData.acceptType = data;
		}
	},
	beforeMount (){
		this.formData.budgetId = this.$route.params.space_id;
	},
	mounted (){
		document.title=this.title;

		var vm = this;

		vm.getTableData();
		
	},

	render (h) {
		let columns = [];
		this.table.columnsAll.forEach((item,i)=>{
			let columnsDom = (
				<div class="columns_item">
					<Row type="flex" justify="start" align="middle">
						<Icon data-id={item.id} class={"column "+(item.isShow?"active":"")} type={item.isShow?"android-checkbox":"android-checkbox-outline-blank"}></Icon>
						<label>{item.name}</label>
					</Row>
				</div>
			);
			columns.push(columnsDom);
		});

		let selectColumns = (
			<div>
				<Row class="base_columns" type="flex" justify="start" align="top">
					<Col class="columns_type">
	      				选择列：
	      			</Col>
	      			<Col class="columns_item_list">
		      			{columns}
      				</Col>
      			</Row>
			</div>
		)
    	return (
			<div class="file">
				<div class="filter_wrap">
					{/*筛选*/}
					<Row class="filter" type="flex" justify="start" align="middle">
						<Col class="filter_item">
							<input onInput={this.nameInput} class="input_box nameInput" placeholder="文件名称" />
						</Col>
						<Col class="filter_item">
							<SelectCustom multi={false} search={false} placeholder="权限类型" data={this.permList} callback={this.selectPerm}></SelectCustom>
						</Col>
						<Col class="filter_item">
							<SelectCustom multi={false} search={false} placeholder="文件类型" data={this.fileTypeList} callback={this.selectType}></SelectCustom>
						</Col>
						<Col>
							<div class="search_btn" onClick={this.getTableData}>
								<span class="btn_name">查询</span>
							</div>
						</Col>
					</Row>
		  		</div>

		  		<div class="table_wrap">

					{/*导出及设置列*/}
					<Row class="table_option" type="flex" justify="start" align="middle">
						<Col>
							<router-link to={"/space/file/add/"+this.$route.params.space_id}>
								<div class="new_file options_btn">
									<span class="btn_name">上传文件</span>
								</div>
							</router-link>
						</Col>
				  		<Col class="table_btn_box">
							<Row type="flex" justify="end" align="middle">
								<Col>
									<div class="custom_columns">
										<span class="btn_name">自定义列</span>
										<div class="columns_box">
											{selectColumns}
											<span class="tips">最少选择1个项，最多同时选择10项</span>
											<Icon class="close_btn" type="close-round"></Icon>
										</div>
									</div>
								</Col>
							</Row>
						</Col>
					</Row>

					{/*表格*/}
					<Row>
						<TableCustom class="table_box" 
							primarykey="fileId"
							changePage={this.changePageHandler} 
							changePageSize={this.changePageSizeHandler}
							columnsAll={this.table.columnsAll} 
							data={this.table.data} 
							total={this.table.total} 
							pageSize={this.table.pageSize} 
							pageSizeOpts={this.table.pageSizeOpts}
							current={this.table.page}

							options={this.table.options}

							noCheckBox = {true}

						>
						</TableCustom>
					</Row>
				</div>
      		</div>
    	)
  	}
})
