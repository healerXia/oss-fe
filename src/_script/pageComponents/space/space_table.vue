<template>
	<div>
		<TableC class="table" :stripe="true" :columns="columns" :data="data" :no-data-text="noData()"></TableC>
		<PageC ref="page" @on-change="changePage" @on-page-size-change="changePageSize" class="page" :total="total" :page-size-opts="pageSizeOpts" :page-size="pageSize" size="small" show-sizer show-elevator placement="top" :current="current"></PageC>
	</div>
</template>

<script>

    import $ from "jquery";
	import {Row,Col,Button,Input,Icon,Menu,Modal,Select,Option,Table,Page,DatePicker,MenuItem,Submenu} from "ui";

    export default {
        name: 'DatePickerCustom',
        components: { TableC:Table,PageC:Page},
        props: {
        	columnsAll:Array,
            data:Array,

            primarykey:String,
            secondKey:String,

            total:Number,
            pageSizeOpts:Array,
            pageSize:Number,

            changePage:Function,
            changePageSize:Function,

            current:Number,

            options:{ type:Object , default:function(){return {}} },

            pass:Function,
            reject:Function
        },
        data (){
            return{
                columns:[],
            }
        },
        watch:{
            current(value){
                this.$refs["page"].$forceUpdate();
            },
            columnsAll:{
                handler(newVal, oldVal){
                    this.columns = this.getSelectedColumns();
                },
                deep:true
            }
        },
        beforeMount (){
            let vm = this;
            vm.columns = vm.getSelectedColumns();

            // vm.$watch(function(){
            //     return vm.columnsAll;
            // }, function(newVal, oldVal){
            //     vm.columns = vm.getSelectedColumns();
            // }, {
            //     deep: true
            // })

        },
        mounted(){
            let vm = this;

            $(vm.$el).on("click",".table_btn",function(){
                let row = {};
                for(let i=0;i<vm.data.length;i++){
                    if(vm.data[i][vm.primarykey]==$(this).attr("data-id")){
                        if($(this).attr("data-skey")!=""&&vm.data[i][vm.secondKey]==$(this).attr("data-skey")){
                            row = vm.data[i]
                        }else{
                            if($(this).attr("data-skey")==""){
                                row = vm.data[i]
                            }
                        }
                        
                    }
                }
                vm.options[$(this).attr("data-type")].callback($(this).attr("data-id"),row);
            });

        },
        methods:{

            getSelectedColumns(){
                let vm = this;
                let selectedColumns = [];
                vm.columnsAll.forEach((item,i)=>{
                    if(item.isShow){
                        let columnRender = {
                            title: item.name,
                            key: item.key,
                            sortable:item.isSort,
                        }

                        if(item.key=="bucket"){
                            columnRender.render = function(h,params){
                                let row = params.row;
                                return h(
                                    "span",{
                                        "style":{
                                            color:"#3c6ffb",
                                            cursor:"pointer",
                                        },
                                        "on":{
                                            click:()=>{
                                                vm.$router.push("/space/file/list/"+row.bucketId);
                                            }
                                        }
                                    },row.bucket
                                )
                            }
                        }

                        selectedColumns.push(columnRender);
                    }

                    
                });

                selectedColumns.push({
                    title: '申请审核',
                    key: 'check',
                    align: 'center',
                    render (h,params){
                        let row = params.row;
                        let optionsArr = [];
                        if(row.statusName=="待审核"){
                            return h(
                                "span",{},  [
                                        h("span",{
                                            "class":"check_btn",
                                            "on":{
                                                click:()=>{vm.pass(row)}
                                            }
                                        },"通过"),
                                        h("span",{
                                            "class":"check_btn",
                                            "on":{
                                                click:()=>{vm.reject(row)}
                                            }
                                        },"拒绝")
                                    ]
                            )
                        }else{
                            return h("span",{},"——")
                        }
                    },
                });
                

                if(vm.options&&Object.keys(vm.options).length>0){
                    let width = Object.keys(vm.options).length*60;
                    selectedColumns.push({
                        title: '操作',
                        key: 'action',
                        width: width,
                        align: 'center',
                        render (h,params){
                            let row = params.row;
                            let optionsArr = [];
                            for(let key in vm.options){
                                let name = "";
                                if(vm.options[key].type=="multi"){
                                    for(let i=0;i<vm.options[key].stateValue.length;i++){
                                        if(row[vm.options[key].stateKey]==vm.options[key].stateValue[i]){
                                            name = vm.options[key].name[i];
                                        }
                                    }
                                }else{
                                    name = vm.options[key].name;
                                }
                                
                                optionsArr.push(h(
                                    "span",{
                                        "class":{
                                            "table_btn":true,
                                        },
                                        "attrs":{
                                            "data-type":key,
                                            "data-id":row[vm.primarykey],
                                            "data-skey":vm.secondKey?row[vm.secondKey]:""
                                        }
                                    },
                                    name
                                ));
                            }
                            return optionsArr
                        },
                    });
                }
                return selectedColumns;
            },

            noData() {
                return "<img class='table_empty_img' src='"+require("../../../_images/no_data.png")+"'></img><span class='table_no_data'>暂未查找到结果</span>"
            }
        },
    };
</script>