import $ from "jquery";
import Vue from "vue";
var tools = {

	regExp:{
		name:/^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
		url:/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\\/])+$/,
		number:/^[1-9][0-9]*$/,
	},

	subDays (date,days){
		let result = new Date(date.valueOf()-days*24*3600*1000);

		let year = result.getFullYear();
		let month = result.getMonth()+1;
		let day = result.getDate();
		let dateStr = year+"-"+(month<10?("0"+month):month)+"-"+(day<10?("0"+day):day);

		return dateStr;
	},

	initQuickDate (){
		let currentDate = new Date();
		let list = [];

		//自定义
		list.push({id:1,name:"自定义",value:"0,1"});

		//昨天
		let yesterday_start = tools.subDays(currentDate,1);
		list.push({id:2,name:"昨天",value:yesterday_start+","+yesterday_start+","+"2"});

		//今天
		let today_start = tools.subDays(currentDate,0);
		list.push({id:3,name:"今天",value:today_start+","+today_start+","+"3"});

		//本月
		let today_arr = today_start.split("-");
		today_arr[2]="01";
		let currentMonth_start = today_arr.join("-");
		list.push({id:4,name:"本月",value:currentMonth_start+","+today_start+","+"4"});

		//上月
		let lastMonth_end = tools.subDays(new Date(currentMonth_start),1);
		let lastMonth_arr = lastMonth_end.split("-");
		lastMonth_arr[2]="01";
		let lastMonth_start = lastMonth_arr.join("-");
		list.push({id:5,name:"上月",value:lastMonth_start+","+lastMonth_end+","+"5"});

		//最近七天
		let lastSeven_start = tools.subDays(currentDate,6);
		list.push({id:6,name:"最近7天",value:lastSeven_start+","+today_start+","+"6"});

		//最近30天
		let lastThirty_start = tools.subDays(currentDate,29);
		list.push({id:7,name:"最近30天",value:lastThirty_start+","+today_start+","+"7"});

		//最近3个月
		let lastNinety_first_month_end = tools.subDays(new Date(lastMonth_start),1);
		let lastNinety_first_month_arr = lastNinety_first_month_end.split("-");
		lastNinety_first_month_arr[2]="01";
		let lastNinety_start = lastNinety_first_month_arr.join("-");
		list.push({id:8,name:"最近3个月",value:lastNinety_start+","+today_start+","+"8"});

		return list
	},

	ajax:function(param,callback){
		for(let key in param.data){
			if(param.data[key] instanceof Array){
				param.data[key] = param.data[key].join(",");
			}
		}

		$.ajax({
			url:param.url,
			type:param.type,
			dataType:"json",
			cache:false,
			contentType:param.contentType?param.contentType:"application/json",
			data:JSON.stringify(param.data?param.data:{}),
			statusCode: {
				// 404: function() {
				// 	let fromUrl = window.location.href;
			    // 	window.location.href="https://a.yiche.com/static_common-portal/login.html?redirect="+fromUrl;
				// },
				// 502: function() {
				// 	let fromUrl = window.location.href;
			    // 	window.location.href="https://a.yiche.com/static_common-portal/login.html?redirect="+fromUrl;
				// },
			},
		}).then(function(data){
			if(data.errorCode==0){
				callback(data.errorMsg,data.result,data.errorCode);
			}else{
				//处理错误码
				let repeatCode = [
					10150011,   // 频道
					10200002,   // 媒体
					10170004,   // dsp
					10150020,   // 广告位
					10210003,   // 媒体账户
					10230003,   // 标签
				];

				let isRepeat = false;
				for(let i=0;i<repeatCode.length;i++){
					if(data.errorCode == repeatCode[i]){
						isRepeat = true;
						break;
					}
				}
				if(data.errorCode == 50000){
					let fromUrl = window.location.href;
					window.location.href=(data.loginUrl?data.loginUrl:"https://a.yiche.com/static_common-portal/login.html")+"?redirect="+fromUrl;
				}else if(isRepeat){
					callback(data.errorMsg,null,data.errorCode);
				}else{
					tools.alertMessage(data.errorMsg);
				}
			}
		}).fail(function(){
			//请求失败
		});
	},

	alertMessage:function(message){
		let str = '<div class="message">'+
					'<p>'+message+'</p>'+
					'<p class="options">'+
					'<span class="modal_btn ok">确定</span>'+
					'</p>'+
				   '</div>';
		let tip = document.createElement("div");
		tip.className = "modalDialog";
		tip.innerHTML = str;

		document.body.appendChild(tip);
		tip.querySelector(".ok").onclick=function(){
			document.body.removeChild(tip);
		}
	},

	modalMessage:function(message,cancelHandler,okHandler){
		let str =  '<div class="message">'+
					'<p>'+message+'</p>'+
					'<p class="options">'+
					'<span class="modal_btn cancel">取消</span>'+
					'<span class="modal_btn ok">确定</span>'+
					'</p>'+
				   '</div>';
		let tip = document.createElement("div");
		tip.className = "modalDialog";
		tip.innerHTML = str;

		document.body.appendChild(tip);
		tip.querySelector(".cancel").onclick=function(){
			document.body.removeChild(tip);
			if(cancelHandler){
				cancelHandler();
			}
		}
		tip.querySelector(".ok").onclick=function(){
			document.body.removeChild(tip);
			if(okHandler){
				okHandler();
			}
		}
	},
}

export default tools;
