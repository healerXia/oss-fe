<template>
	<div class="form_box">
		<Row class="form_item" type="flex" justify="start" align="middle">
            <ColC class="item_name"><label>文件说明</label></ColC>
            <ColC class="item_box textarea_box">
                <textarea name="note" v-model="note"></textarea>
                <span class="count errorMsg ok active">{{note.length}}/100</span>
                <span class="overcount errorMsg">{{note.length}}/100</span>
            </ColC>
        </Row>

		<!-- <Row class="form_item" type="flex" justify="start" align="middle">
			<ColC class="item_name"><label><span>*</span>是否分发到CDN</label></ColC>
			<ColC class="item_box cdn_box">
                <div :class="'checkbox_custom cdn_yes '+(isCDN==1?'active':'')">是</div>
                <div :class="'checkbox_custom cdn_no '+(isCDN==0?'active':'')">否</div>
			</ColC>
		</Row> -->

		<Row class="form_item" type="flex" justify="start" align="middle">
			<ColC class="item_name"><label><span>*</span>上传</label></ColC>
			<ColC class="item_box form_size_box">
                <Upload
					class="upload_box"
					multiple
					:data="{
						bucket_id:spaceId,
						desc:note
					}"
					:show-upload-list="false"
					:with-credentials="true"
					:before-upload="beforeUpload"
					:on-progress="onProgress"
					:on-success="onSuccess"
					type="drag"
					action="/oss-manager/api/oss/bucket/upload/file">
					<div class="upload_tip">
						<span class="iconfont ico-custom-upload"></span>
						<p>最多支持100个文件同时上传，拖拽到此，或点击上传</p>
					</div>
				</Upload>
			</ColC>
		</Row>
		
		

		<Modal
			class="file_task"
			v-model="showModal"
			title="上传任务">
			
			<Row class="upload_file_list" type="flex" justify="start" align="middle">
				<ColC class="uploaded_file_name">文件名称</ColC>
				<ColC class="uploaded_file_progress">上传进度</ColC>
				<ColC class="uploaded_file_progress_bar">提示</ColC>
			</Row>
			<Row class="upload_file_item" v-for="(item,index) in uploadedFileList" :key="index" type="flex" justify="start" align="middle">
				<ColC class="uploaded_file_name" :title="item.name">{{item.name}}</ColC>
				<ColC class="uploaded_file_progress">{{Math.round(item.percentage)+"%"}}</ColC>
				<ColC class="uploaded_file_progress_bar">{{item.response.errorCode?(item.response.result.list[0].succ?"上传成功":item.response.result.list[0].msg):item.response.errorMsg}}</ColC>
			</Row>
		</Modal>

		<!-- <Row class="form_item" type="flex" justify="start" align="middle">
			<ColC class="item_name"></ColC>
			<ColC class="item_box">
				<Row class="upload_file_item" v-for="(item,index) in uploadedFileList" :key="index" type="flex" justify="start" align="middle">
					<ColC class="uploaded_file_name" :title="item.name">{{item.name}}</ColC>
					<ColC class="uploaded_file_progress">{{Math.round(item.percentage)+"%"}}</ColC>
					<ColC class="uploaded_file_progress_bar">
						<div class="progress">
							<div class="progress_value" :style="{width:item.percentage+'%'}"></div>
						</div>
					</ColC>
				</Row>
			</ColC>
		</Row> -->

	</div>
</template>

<script>
	import $ from "jquery";
    import {Row,Col,Button,Input,Icon,Menu,Modal,Select,Option,Table,Page,DatePicker,MenuItem,Submenu,Radio,RadioGroup,Checkbox,CheckboxGroup,Upload} from "ui";
	import tools from "../common/tools.js";

    export default {
        name: 'Form',
        components: { Row , ColC:Col , Upload , Modal},
        props: {
			submitHandler:Function,
			id:String,
        },
        data:function() {
            return {
            	spaceId:1,
                note:"",
                // isCDN:1,

				showModal:false,
				spaceList:[
                    {id:1,name:"SSP"},
                    {id:2,name:"DSP"},
                    {id:3,name:"ISP"},
				],
				
				uploadedFileList:[
					// {name:"askjlhfakljsh.png",percentage:40},
				],
				
            }
        },
        watch:{
        	note(){
				this.validLength(false,this.note,100,"note");
			}
        },
        beforeMount:function(){
			let vm = this;
			this.spaceId = this.$route.params.space_id;
        },
        mounted:function(){
            let vm =this;

            // $(vm.$el).on("click",".cdn_box .cdn_yes",function(){
        	// 	vm.isCDN = 1;
            // });
            // $(vm.$el).on("click",".cdn_box .cdn_no",function(){
        	// 	vm.isCDN = 0;
        	// });
		},

        methods: {
			beforeUpload(){
				if(this.validLength(false,this.note,100,"note")){
					this.showModal = true;
				}else{
					return false;
				}
			},
			onProgress(event, file, fileList){
				this.uploadedFileList = fileList;
			},
			onSuccess(response, file, fileList){
				// console.log(response);
				// console.log(fileList);
			},

            validLength(isRequired,value,max,param){
            	let isOk = true;
            	if(isRequired&&value==""){
        			isOk = false;
        			this.showMessage(param,"notNull");
        		}else{
        			if(value.length>max){
        				isOk =false;
        				this.showMessage(param,"overcount");
        			}else{
        				this.showMessage(param,"count");
        			}
        		}

        		return isOk;
            },

            showMessage(param,errorName){
            	$("input[name="+param+"]").nextAll(".errorMsg").removeClass('active');
        		$("input[name="+param+"]").nextAll("."+errorName).addClass('active');

        		$("textarea[name="+param+"]").nextAll(".errorMsg").removeClass('active');
        		$("textarea[name="+param+"]").nextAll("."+errorName).addClass('active');
            },

            clearMessage(param){
            	$("input[name="+param+"]").nextAll(".errorMsg").removeClass('active');
            	$("textarea[name="+param+"]").nextAll(".errorMsg").removeClass('active');
            }
        }
    };
</script>