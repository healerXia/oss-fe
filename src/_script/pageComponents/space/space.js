//引入依赖的库
import $ from "jquery";
import Vue from "vue";

import {Row,Col,Circle,Icon,Input} from "ui";

import tools from "../common/tools.js";
import mixins from "../common/mixins.js";

import TableCustom from "./space_table.vue";
import SelectCustom from "widgets/src/ssp_select/select.js";

export default Vue.component('Space', {
	props: {

	},

	data (){
		return {
			title:"空间管理",


			permList:[
				{id:"",name:"全部"},
				{id:"private",name:"私有"},
				{id:"public",name:"公共"},
			],

			stateList:[
				{id:"",name:"全部"},
				{id:"1",name:"待审核"},
				{id:"2",name:"已通过"},
				{id:"3",name:"已拒绝"},
			],

			formData:{
				bucket:"",
				bucketId:"",
				user:"",
				perm:"",
				idc:"",
				email:"",
				bucketStatus:"",
				departName:"",
				pageIndex:1,
				pageSize:10,
			},

			spaceInfo:{
				type:1,
				curAddFlow:0,
				curDelFlow:0,
				lastAddFlow:0,
				lastDelFlow:0,
				totalSize:100,
				usedSize:0
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
					{id:"1",name:"空间ID",key:"bucketId",isShow:true,isSort:false},
					{id:"2",name:"空间名称",key:"bucket",isShow:true,isSort:false},
					{id:"3",name:"访问地址URL",key:"bucketUrl",isShow:true,isSort:false},
					{id:"4",name:"权限类型",key:"perm",isShow:true,isSort:false},
					{id:"5",name:"文件类型",key:"acceptType",isShow:false,isSort:false},
					{id:"6",name:"申请状态",key:"statusName",isShow:false,isSort:false},

					{id:"7",name:"空间大小",key:"bucketSize",isShow:false,isSort:false},
					{id:"8",name:"已使用空间",key:"usedBucketSize",isShow:false,isSort:false},
					{id:"9",name:"文件数",key:"fileCount",isShow:false,isSort:false},

					{id:"10",name:"最新操作时间",key:"modifyTime",isShow:false,isSort:false},
					{id:"11",name:"申请人",key:"email",isShow:false,isSort:false},
					{id:"12",name:"申请时间",key:"createTime",isShow:false,isSort:false},
					{id:"13",name:"审核时间",key:"auditTime",isShow:false,isSort:false},
				],
				data:[],

				options:{
					budgetkey:{
						name:[
							"",
							"生成密钥对",
						],
						stateValue:[
							"",
							"2",
						],
						stateKey:"bucketStatus",
						type:"multi",
						callback:this.getBudgetKey
					},
					// edit:{
					// 	name:"编辑",
					// 	icon:"pencil",
					// 	callback:function(id){

					// 	}
					// },
					delete:{
						name:"删除",
						icon:"delete",
						callback:this.deleteSpace
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
				url:"/oss-manager/api/oss/bucket/list",
				type:"post",
				data:vm.formData,
			},function(message,data){
				vm.table.data = data.lists;
				vm.table.total = data.total;
			});
		},
		getSpaceInfo(){
			let vm = this;
			tools.ajax({
				url:"/oss-manager/api/oss/bucket/overview",
				type:"post",
			},function(message,data){
				for(let key in data){
					vm.spaceInfo[key] = data[key];
				}
			});
		},
		
		deleteSpace(id,row){
			tools.modalMessage("确定删除吗？",null,function(){
				tools.ajax({
					url:"/oss-manager/api/oss/bucket/delete",
					type:"post",
					data:{
						bucketId:id
					},
				},function(message,data){
					vm.getTableData();
				});
			});
		},

		getBudgetKey(id,row){
			
			tools.ajax({
				url:"/oss-manager/api/oss/bucket/key/create",
				type:"post",
				data:{
					bucket:row.bucket
				},
			},function(message,data){
				tools.ajax({
					url:"/oss-manager/api/oss/bucket/key/get",
					type:"post",
					data:{
						bucket:row.bucket
					},
				},function(message,data_get){
					console.log(data_get)
				});
			});
			// tools.alertMessage("<span>04 A1 B6 4F 0B 9D D2 2F D2 61 6E 45</span><br/><span>04 A1 B6 4F 0B 9D D2 2F D2 61 6E 45</span>")
		},

		reject(row){
			tools.modalMessage(row.email+"申请"+(row.bucketSize/1024).toFixed(3)+"G空间，确定拒绝？",null,function(){
				tools.ajax({
					url:"/oss-manager/api/oss/bucket/audit/reject",
					type:"post",
					data:{
						bucketId:row.bucketId
					},
				},function(message,data){
					vm.getTableData();
				});
			});
		},
		pass(row){
			tools.modalMessage(row.email+"申请"+(row.bucketSize/1024).toFixed(3)+"G空间，确定通过？",null,function(){
				tools.ajax({
					url:"/oss-manager/api/oss/bucket/audit/pass",
					type:"post",
					data:{
						bucketId:row.bucketId
					},
				},function(message,data){
					vm.getTableData();
				});
			});
		},
		nameInput(){
			this.formData.bucket = this.$el.querySelector(".nameInput").value;
		},
		userInput(){
			this.formData.user = this.$el.querySelector(".userInput").value;
		},
		selectPerm(data){
			this.formData.perm = data;
		},
		selectState(data){
			this.formData.bucketStatus = data;
		}
	},
	beforeMount (){

	},
	mounted (){
		document.title=this.title;

		var vm = this;

		vm.getTableData();

		vm.getSpaceInfo();
		
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
			<div class="space">
				<Row class="space_info" type="flex" justify="start" align="top">
					<Col class="space_size">
						<div class="info_title">
							<span>空间总量  <span class="size_unit">单位G</span></span>
							<span class="legend legend_unuse">未使用</span>
							<span class="legend legend_used">已使用</span>
						</div>
						<div class="info_detail">
							<Circle
								size={150}
								trail-width={5}
								trail-color="#f9fafc"
								stroke-width={5}
								percent={this.spaceInfo.usedSize/this.spaceInfo.totalSize*100}
								stroke-linecap="square"
								stroke-color="#3d70fb">
								<div class="demo-i-circle-custom">
									<span>
										已使用：{(this.spaceInfo.usedSize/1024).toFixed(3)}
									</span>
								</div>
							</Circle>
						</div>
					</Col>
					<Col class="space_data">
						<div class="info_title">
							<span>本月流量</span>
							<span onClick={()=>{this.spaceInfo.type=0}} class={"options option_del "+(this.spaceInfo.type==0?"active":"")}>删除</span>
							<span onClick={()=>{this.spaceInfo.type=1}} class={"options option_add "+(this.spaceInfo.type==1?"active":"")}>新增</span>
						</div>
						<div class="info_detail">
							<div><span class="data_num">{this.spaceInfo.type==0?this.spaceInfo.curDelFlow:this.spaceInfo.curAddFlow}</span> Mb</div>
							<div>上月流量 {this.spaceInfo.type==0?this.spaceInfo.lastDelFlow:this.spaceInfo.lastAddFlow} Mb</div>
						</div>
					</Col>
				</Row>
				<div class="filter_wrap">
					{/*筛选*/}
					<Row class="filter" type="flex" justify="start" align="middle">
						<Col class="filter_item">
							<input onInput={this.nameInput} class="input_box nameInput" placeholder="空间名称" />
						</Col>
						<Col class="filter_item">
							<input onInput={this.userInput} class="input_box userInput" placeholder="申请人" />
						</Col>
						<Col class="filter_item">
							<SelectCustom multi={false} search={false} placeholder="权限类型" data={this.permList} callback={this.selectPerm}></SelectCustom>
						</Col>
						<Col class="filter_item">
							<SelectCustom multi={false} search={false} placeholder="申请状态" data={this.stateList} callback={this.selectState}></SelectCustom>
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
							<router-link to={"/space/add"}>
								<div class="new_space options_btn">
									<span class="btn_name">新建空间</span>
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
							primarykey="bucketId"
							changePage={this.changePageHandler} 
							changePageSize={this.changePageSizeHandler}
							columnsAll={this.table.columnsAll} 
							data={this.table.data} 
							total={this.table.total} 
							pageSize={this.table.pageSize} 
							pageSizeOpts={this.table.pageSizeOpts}
							current={this.table.page}

							options={this.table.options}

							pass={this.pass}
							reject={this.reject}

						>
						</TableCustom>
					</Row>
				</div>
      		</div>
    	)
  	}
})
