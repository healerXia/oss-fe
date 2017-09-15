<template>
	<div class="form_box">
		<Row class="form_item" type="flex" justify="start" align="middle">
			<ColC class="item_name"><label><span>*</span>空间名称</label></ColC>
			<ColC class="item_box">
				<input class="common_input" type="text" name="spaceName" v-model="spaceName" />
				<span class="notNull errorMsg">空间名称不能为空</span>
				<span class="typeError errorMsg">只含小写字母、数字和短横线；必须以小写字母和数字开头结尾；长度限制在3-36个字符之间</span>
				<span class="exist errorMsg">空间名称已存在</span>
			</ColC>
		</Row>
		<Row class="form_item" type="flex" justify="start" align="middle">
			<ColC class="item_name"><label>服务器机房</label></ColC>
			<ColC class="item_box">
				<SelectC class="common_select" name="server" v-model="serverId">
					<OptionC v-for="item in serverList" :key="item.id" :value="item.id">{{item.name}}</OptionC>
				</SelectC>
			</ColC>
		</Row>
		<Row class="form_item" type="flex" justify="start" align="middle">
			<ColC class="item_name"><label><span>*</span>空间大小</label></ColC>
			<ColC class="item_box form_size_box">
                <input class="common_input" type="text" name="size" placeholder="做多100G" v-model="size" />
				<SelectC class="common_select" name="unit" v-model="unitId" >
					<OptionC v-for="item in unitList" :key="item.id" :value="item.id">{{item.name}}</OptionC>
				</SelectC>
                <span class="notNull errorMsg">空间大小不能为空</span>
                <span class="typeError errorMsg">请填写正整数</span>
                <span class="sizeError errorMsg">大小不超过100G</span>
			</ColC>
		</Row>
		<Row class="form_item" type="flex" justify="start" align="middle">
			<ColC class="item_name"><label><span>*</span>权限类型</label></ColC>
			<ColC class="item_box perm_box">
                <div v-for="(item,index) in permList" :key="index" :data-id="item.id" :class="'checkbox_custom '+(item.checked?'active':'')">
                    {{item.name}}
                </div>
			</ColC>
		</Row>

		<Row class="form_item" v-if="perm=='private'" type="flex" justify="start" align="middle">
			<ColC class="item_name"><label>空间最大访问量</label></ColC>
			<ColC class="item_box form_max_visit">
				<input class="common_input" type="text" name="maxVisit" placeholder="最大800" v-model="maxVisit" />
                <span class="visit_unit">个/秒</span>
				<span class="typeError errorMsg">请填写正确的数字</span>
                <span class="sizeError errorMsg">大小不超过800</span>
			</ColC>
		</Row>

		<Row class="form_item" type="flex" justify="start" align="middle">
			<ColC class="item_name"><label><span>*</span>文件类型</label></ColC>
			<ColC class="item_box file_type_box">
                <div v-for="(item,index) in fileTypeList" :key="index" :data-id="item.id" :class="'checkbox_custom '+(item.checked?'active ':'')+(item.id==0?'allType':'singleType')">
                    {{item.name}}
                </div>
			</ColC>
		</Row>

        <Row class="form_item" type="flex" justify="start" align="middle">
			<ColC class="item_name"></ColC>
			<ColC class="item_box file_type_select_box">
                <Row class="single_type_list" v-for="(item,index) in showFileList" :key="index" type="flex" justify="start" align="middle">
                    <ColC><label>{{item.name}}：</label></ColC>
                    <ColC class="columns_item_list">
                        <Row type="flex" justify="start" align="middle">
                            <ColC class="columns_item">
                                <Checkbox v-model="item.isCheckAll" label="全部">全部</Checkbox>
                                <CheckboxGroup @on-change="(data)=>{changeType(data,index)}" class="singleItem" v-model="item.selected">
                                    <Checkbox v-for="(type,typeindex) in item.typeList" :key="typeindex" :label="type">{{type}}</Checkbox>
                                </CheckboxGroup>
                            </ColC>
                        </Row>
                    </ColC>
                </Row>
			</ColC>
		</Row>

		<Row class="form_item" type="flex" justify="start" align="middle">
			<ColC class="item_name"></ColC>
			<ColC><div class="form_btn cancel">取消</div></ColC>
			<ColC><div class="form_btn save">保存</div></ColC>
		</Row>
	</div>
</template>

<script>
	import $ from "jquery";
    import {Row,Col,Button,Input,Icon,Menu,Modal,Select,Option,Table,Page,DatePicker,MenuItem,Submenu,Radio,RadioGroup,Checkbox,CheckboxGroup} from "ui";
	import tools from "../common/tools.js";

    export default {
        name: 'Form',
        components: { Row , ColC:Col , SelectC:Select , OptionC:Option , Radio , RadioGroup,Icon,Checkbox,CheckboxGroup},
        props: {
			submitHandler:Function,
			id:String,
        },
        data:function() {
            return {
            	spaceName:"",
                serverId:"shouming",
                size:"",
            	unitId:1,
                perm:1,
                maxVisit:0,
            	fileType:0,


				serverList:[
                    {id:"shouming",name:"首鸣机房文件存储服务器"},
                    {id:"M5",name:"M5机房文件存储服务器"},
                ],
                unitList:[
                    {id:1,name:"G"},
                    {id:2,name:"M"}
                ],

                permList:[
                    {id:"public",name:"公共",checked:true},
                    {id:"private",name:"私有",checked:false}
                ],

                fileTypeList:[
                    {id:0,name:"全部",checked:true},
                    // {id:1,name:"文本文件",checked:false,typeList:[]},
                    // {id:2,name:"图片文件",checked:false,typeList:[]},
                    // {id:3,name:"视频文件",checked:false,typeList:[]},
                    // {id:4,name:"压缩文件",checked:false,typeList:[]}
                ],

                showFileList:[
                    
                ],
				
				isEdit:false,
            }
        },
        watch:{
        	spaceName(){
                this.validName();
            },
            size(){
                this.validSize();
            },
            maxVisit(){
                this.validVisit();
            }
        },
        beforeMount:function(){
        	let vm = this;
            // if(vm.id){
			// 	vm.isEdit = true;
			// 	tools.ajax({
			// 		url:"/ssp-manager/v1/media/editinfo?id="+vm.id,
			// 		type:"get",
			// 	},function(message,data){
			// 		vm.mediaName = data.name;
			// 		vm.mediaShortName = data.shortname;
			// 		vm.mediaType = data.mediatype.toString();
			// 		vm.plat = data.platform;
			// 		vm.homeUrl = data.homepage;
			// 		vm.note = data.mediadesc;

			// 		vm.masterId = data.masterId;
			// 	});
			// }else{
			// 	vm.masterId = vm.$route.params.master_id;
			// }
        },
        mounted:function(){
            let vm =this;
            
            $(vm.$el).on("click",".perm_box .checkbox_custom",function(){
        		for(let i=0;i<vm.permList.length;i++){
                    if(vm.permList[i].id == $(this).attr("data-id")){
                        vm.permList[i].checked = true;
                        vm.perm = vm.permList[i].id;
                    }else{
                        vm.permList[i].checked = false;
                    }
                }
            });

            $(vm.$el).on("click",".file_type_box .allType",function(){
        		for(let i=0;i<vm.fileTypeList.length;i++){
                    if(vm.fileTypeList[i].id == $(this).attr("data-id")){
                        vm.fileTypeList[i].checked = true;
                    }else{
                        vm.fileTypeList[i].checked = false;
                    }
                }
                vm.getSelectedFileTypeList();
        	});
            
            $(vm.$el).on("click",".file_type_box .singleType",function(){
                vm.fileTypeList[0].checked = false;
                let checkedNum = 0;
        		for(let i=1;i<vm.fileTypeList.length;i++){
                    if(vm.fileTypeList[i].id == $(this).attr("data-id")){
                        vm.fileTypeList[i].checked = !vm.fileTypeList[i].checked;
                    }
                    if(vm.fileTypeList[i].checked){
                        checkedNum++;
                    }
                }
                if(checkedNum==0){
                    vm.fileTypeList[0].checked = true;
                }

                vm.getSelectedFileTypeList();
            });

            vm.getFileType();


        	$(vm.$el).find(".save").on("click",function(){
        		vm.saveSpace();
        	});

        	$(vm.$el).find(".cancel").on("click",function(){
        		vm.$router.push("/space/list");
        	})
		},

        methods: {
            getSelectedFileTypeList(){
                let selected = [];

                if(this.fileTypeList[0].checked){
                    for(let i = 1;i<this.fileTypeList.length;i++){
                        selected.push({
                            name:this.fileTypeList[i].name,
                            key:this.fileTypeList[i].key,
                            typeList:this.fileTypeList[i].typeList,
                            selected:[],
                            isCheckAll:true,
                        })
                    }
                }else{
                    for(let i = 1;i<this.fileTypeList.length;i++){
                        if(this.fileTypeList[i].checked){
                            selected.push({
                                name:this.fileTypeList[i].name,
                                key:this.fileTypeList[i].key,
                                typeList:this.fileTypeList[i].typeList,
                                selected:[],
                                isCheckAll:true,
                            })
                        }
                    }
                }

                this.showFileList = selected;
                
            },

            getSelectedFileType(){
                let selected = [];
                for(let i = 0;i<this.showFileList.length;i++){
                    
                    if(this.showFileList[i].isCheckAll){
                        let typeList = this.showFileList[i].typeList.map((item,j)=>{
                            return this.showFileList[i].key+"/"+item
                        })
                        selected = selected.concat(typeList);
                    }else{
                        let typeList = this.showFileList[i].selected.map((item,j)=>{
                            return this.showFileList[i].key+"/"+item
                        })
                        selected = selected.concat(typeList);
                    }
                    
                }
                return selected;
            },
            changeType(data,index){
                if(data.length>0){
                    this.showFileList[index].isCheckAll = false;
                }
            },
			save(url){
                let vm = this;
                let data = {
                    bucket:vm.spaceName,
                    idc:vm.serverId,
                    departName:"",
                    bucketSize:vm.unitId==1?vm.size*1024:vm.size,
                    perm:vm.perm,
                    rateLimit:vm.maxVisit,
                    acceptType:this.getSelectedFileType()
                };
				tools.ajax({
					url:url,
					type:"post",
					data:data,
				},function(message,data,code){
					if(code == 0){
						vm.submitHandler();
						vm.$router.push("/space/list");
					}else{
						vm.showMessage("spaceName","exist");
					}
					
				});
			},
            saveSpace:function(isnext){
            	let vm = this;
				if(vm.validAll()){
					let url = "/oss-manager/api/oss/bucket/apply";
					// if(vm.isEdit){
                    //     tools.modalMessage("你确定保存编辑当前媒体?",null,function(){
                    //         vm.save(url,isnext);
                    //     });
                    // }else{
                        vm.save(url);
                    // }
				}
			},

            validAll(){
				let isOk = this.validName()&&this.validSize()&&this.validVisit();
            	return isOk;
            },


            validType(isRequired,value,reg,selector,errorName){
                let isOk = true;
                if(isRequired&&value==""){
                    isOk = false;
                    this.showMessage(selector,"notNull");
                }else{
                    if(value!=""){
                        if(reg.test(value)){
                            isOk =true;
                            this.clearMessage(selector);
                        }else{
                            isOk =false;
                            this.showMessage(selector,errorName);
                        }
                    }else{
                        this.clearMessage(selector);
                    }
                }

                return isOk;
            },

            getFileType(){
                let vm = this;
                tools.ajax({
					url:"/oss-manager/api/oss/bucket/type/list",
					type:"post",
				},function(message,data){
                    let titleMap = {
                        text:"文本文件",
                        image:"图片文件",
                        video:"视频文件",
                        zip:"压缩文件",
                    }
                    let i=1;
                    for(let key in data){
                        vm.fileTypeList.push({
                            id:i,
                            key:key,
                            name:titleMap[key],
                            checked:false,
                            typeList:data[key]
                        });
                        i++;
                    }
                    vm.getSelectedFileTypeList();
				});
            },

            showMessage(param,errorName){
            	$(param).nextAll(".errorMsg").removeClass('active');
        		$(param).nextAll("."+errorName).addClass('active');

        		$(param).nextAll(".errorMsg").removeClass('active');
        		$(param).nextAll("."+errorName).addClass('active');
            },

            clearMessage(param){
            	$(param).nextAll(".errorMsg").removeClass('active');
            	$(param).nextAll(".errorMsg").removeClass('active');
            },


            validName(){
                if(this.validType(true,this.spaceName,tools.regExp.name,"[name=spaceName]","typeError")){
                    if(this.spaceName.length>=3&&this.spaceName.length<=36){
                        this.clearMessage("[name=spaceName]");
                        return true;
                    }else{
                        this.showMessage("[name=spaceName]","typeError");
                        return false;
                    }
                }else{
                    return false;
                }
            },

            validSize(){
                if(this.validType(true,this.size,tools.regExp.number,"[name=size]","typeError")){
                    let size = parseInt(this.size);
                    let max = 100;
                    if(this.unitId == 1){
                        max=100;
                    }else if(this.unitId==2){
                        max=100*1024;
                    }
                    if(size<=max){
                        this.clearMessage("[name=size]");
                        return true;
                    }else{
                        this.showMessage("[name=size]","sizeError");
                        return false;
                    }
                }else{
                    return false;
                }
            },

            validVisit(){
                if(this.perm=="private"){
                    if(this.validType(false,this.maxVisit,tools.regExp.number,"[name=maxVisit]","typeError")){
                        let maxVisit = parseInt(this.maxVisit);
                        if(this.maxVisit==""||maxVisit<=800){
                            this.clearMessage("[name=maxVisit]");
                            return true;
                        }else{
                            this.showMessage("[name=maxVisit]","sizeError");
                            return false;
                        }
                    }else{
                        return false;
                    }
                }else{
                    this.clearMessage("[name=maxVisit]");
                    return true;
                }
            },
        }
    };
</script>