/**
 * @功能:在线投保规则验证
 * @param {xmlUrl:文件url路径, currentIsuresID:当前的险种ID,appantAge:投保人年龄,appantSex:投保人性别 如果是被保人的话传入被保人的值}
 * @Author:Li Jie
 * @Date 2015-02-10
*/ 
function asyncOnlineRuleByXml(xmlUrl,currentIsuresID,appantAge,appantSex){
		var domDoc = getNativeXml(xmlUrl);
		if(domDoc){
			 var result_html='';
			 
			 var DisclosureItemList = domDoc.getElementsByTagName("DisclosureItem");//
			 if(DisclosureItemList != null && DisclosureItemList.length > 0){
				result_html+='<table class="impartTable color-gray">';
				var column1Style = " class='impartColumn1' ";
				var column2Style = " class='impartColumn2' ";
				
				/* 测试代码 start */
//				result_html+='<tr><td '+column1Style+'></td><td '+column2Style+'><input type="checkbox" onclick="checkedAllNo(this)" />全选否</td></tr>';
				//result_html+='<div style="width=100%;text-align:right;"><input type="checkbox" onclick="checkedAllNo(this)" />全选否</div>';
				/* 测试代码 end*/
				
				//表单元素样式设置，PAD版样式
				var textStyleS = " class='small_text_input textStyleW50' ";	//短文本框
				var textStyleM = " class='text-style textStyleW100' ";	//文本框
				var textStyle = " class='text-style textStyleP40' ";	//长文本框
				var textareaStyle = " class='text-style textStyleP80' ";	//文本域
				var checkboxStyle = " class=checkboxStyleOfImpart ";	//复选框
				var radioStyle = " class=checkboxStyleOfImpart ";	//单选按钮 modify by liuye
				var checkboxAfterHtml = "<span class='contentMarginLeft'></span>";		//控制复选框布局格式的html代码
				var radioFrontHtml = "";	//控制单选按钮布局格式的html代码
				
				//手机版样式
				var pcType = document.getElementById("pctype").value;
				if(pcType == "phone"){
					column1Style = " class='impartColumn1OfPhone' ";
					column2Style = " class='impartColumn2OfPhone' ";
					textStyleS = " class='small_text_input textStyleW50' ";	//短文本框
					textStyleM = " class='text-style textStyleW100' ";	//文本框
					textStyle = " class='text-style textStyleP95' ";	//长文本框
					textareaStyle = " class='text-style textStyleP95' ";	//文本域
					//checkboxStyle = " class=checkboxStyleOfImpart ";	//复选框
					//radioStyle = " class=radioStyleOfImpart ";	//单选按钮
					checkboxAfterHtml = "<br/>";		//控制复选框格式的html代码
					radioFrontHtml = "<br/>";
				}
				
			 	for(var i = 0; i<DisclosureItemList.length; i++){
			 		var disclosureItemEl = DisclosureItemList[i];
			 		
			 		var disclosure_ver = disclosureItemEl.getAttribute("disclosure_ver");
			 		var no_yesno = disclosureItemEl.getAttribute("no_yesno");
			 		var disclosure_id = disclosureItemEl.getAttribute("disclosure_id");
			 		
			 		var if_express = disclosureItemEl.getAttribute("if"); //条件语句
			 		if(if_express){
			 			if_express = if_express.replaceAll("&amp;","&");
			 			if_express = if_express.replaceAll("currentIsuresID",currentIsuresID);
			 			if_express = if_express.replaceAll("appantAge",appantAge);
			 			if_express = if_express.replaceAll("appantSex",appantSex);
			 		}
			 		var flag = disclosureItemEl.getAttribute("flag");  //类型标识 
			 		var childList = disclosureItemEl.childNodes; //获取所有的子节点
			 		var item_html='';
			 		var divAttributes = " id=div_"+disclosure_id+" class='impart_sub_div' ";
			 		//var checkboxInfo = "<input type='checkbox' name='checkbox_impart' id='checkbox_1_"+disclosure_id+"' value='1' onclick='pageControlleShow(this)'" + checkboxStyle + ">是" + checkboxAfterHtml + " <input type='checkbox' name='checkbox_impart' id='checkbox_0_"+disclosure_id+"' value='0' onclick='pageControlleShow(this)'" + checkboxStyle + " >否";
			 		var checkboxInfo = "<span onclick='tryTap(this)' style='display:inline-block;border:2px solid #ffffff;float:left;'><input type='checkbox' id='checkbox_1_"+disclosure_id+"' value='1' " + checkboxStyle + "><label for='checkbox_1_"+disclosure_id+"'></label>是</span><span onclick='tryTap(this)'  style='display:inline-block;border:2px solid #ffffff;float:left;' ><input type='checkbox' id='checkbox_0_"+disclosure_id+"' value='0'" + checkboxStyle + " ><label for='checkbox_0_"+disclosure_id+"'></label>否</span>";	
			 		var hiddenInput = "<input type='hidden' name='disclosure_ver' id='ver_"+disclosure_id+"' value='"+disclosure_ver+"' /><input type='hidden' name='disclosure_id' id='code_"+disclosure_id+"' value='"+disclosure_id+"' />";
			 		//‘其他’单选按钮的ID值
			 		var otherRadioId = disclosure_ver + "_" + disclosure_id + "_" + "otherRadio";
			 		var otherInputId = disclosure_ver + "_" + disclosure_id + "_" + "otherInput";

			 		if('common' == flag){ //单纯的htmlForm表单
			 			if(childList != null && childList.length > 0){
			 				item_html+='<tr><td '+column1Style+'>';
				 			for(var j = 0; j<childList.length; j++){
				 				var nodeType = childList[j].nodeType;
				 				if(1 == nodeType){
				 					var descriptionText = childList[j].getAttribute("text");
				 					//显示红色字体  add by wangzj
				 					var isColor = childList[j].getAttribute("color");
				 					if(descriptionText){ //lable文字
				 						if(isColor){
				 							item_html += '<span style="color: red;">'
				 							item_html += descriptionText;
				 							item_html += '</span>';
				 						}else{
				 							item_html += descriptionText;
				 						}
				 					}else{ 
				 						var input_key = childList[j].getAttribute("input_key");
				 						var input_length = childList[j].getAttribute("length");
				 						if(input_key){ //input框 
				 							var currentStyle = (input_length && input_length < 5) ? textStyleS : textStyle;
//			 								业务员告知带入业务员手机号;投被保人带入身高体重--add by wangzj 20160612
				 							var inputValue = '';
				 							if('salesman_phone'==input_key){
				 								var salesman_mobile = window.localStorage.getItem('phone');		
				 								// if(salesman_mobile.length!=9 || salesman_mobile.length==11){
				 								// 	alert("1salesman_phone:"+typeof salesman_mobile+":"+salesman_mobile);
				 								// 	inputValue = salesman_mobile;
				 									
				 								// }else{
				 								// 	alert("else")
				 									
				 								// }
				 							//针对业务员手机号为空时显示undefined，做的清空处理	
				 								if(isNaN(salesman_mobile) && salesman_mobile.length==9){				 									
				 									inputValue='';				 									
				 								}else{
				 									inputValue = salesman_mobile;
				 								}
				 								
				 							}else if('insured_height'==input_key){
				 								if('A0501'==disclosure_id){		//被保人
				 									inputValue = window.localStorage.getItem('recognizeeHeight');
				 								}else{							//投保人
				 									inputValue = window.localStorage.getItem('applicantHeight');
				 								}
				 							}else if('insured_weight'==input_key){
				 								if('A0501'==disclosure_id){		//被保人
				 									inputValue = window.localStorage.getItem('recognizeeWeight');
				 								}else{							//投保人
				 									inputValue = window.localStorage.getItem('applicantWeight');
				 								}
				 							}
			 								item_html += "<input "+currentStyle+" id="+disclosure_id+"_"+input_key+" size="+input_length +" value='"+inputValue+"' onblur='alerTip(this)' />";
				 						} 
				 					}
				 				}
				 			} 
				 			item_html+=hiddenInput;
				 			item_html+="</td><td "+column2Style+"></td></tr>";
				 		}
			 		}else if('ifcommon' == flag){ //带有条件判断的form表单操作 
			 		  //可以伸缩的框,根据条件进行判断 
						if(eval(if_express)){
							if(childList != null && childList.length > 0){
								item_html+="<tr><td "+column1Style+">";
					 			for(var j = 0; j<childList.length; j++){
					 				var nodeType = childList[j].nodeType;
					 				if(1 == nodeType){
					 						var descriptionText = childList[j].getAttribute("text");
					 						if(descriptionText){
								 				item_html+=descriptionText;
					 						} 
					 						var expandChild = childList[j].childNodes;
				 							if(expandChild != null && expandChild.length > 0 ){
				 								if(no_yesno != "true")
									 			{
				 									item_html+="<div "+divAttributes+" >";
									 			}
				 								for(var k = 0; k<expandChild.length; k++){
				 									if(1 ==  expandChild[k].nodeType){
				 										var exText = expandChild[k].getAttribute("text");
				 										var exTagName = expandChild[k].tagName;
				 										if(exText){
				 											 item_html += exText;
				 										}else if(exTagName=="Line"){
				 											item_html+="<br/>";
				 										}else{
				 											var ex_input_key = expandChild[k].getAttribute("input_key");
				 					 						var input_length = expandChild[k].getAttribute("length");
				 											if(ex_input_key){
				 					 							var currentStyle = (input_length && input_length < 5) ? textStyleS : textStyle;
				 												item_html += "<input "+currentStyle+" id="+disclosure_id+"_"+ex_input_key+" size="+input_length+" />";
				 											}
				 										}
				 									}
				 								}
				 								if(no_yesno != "true")
									 			{
				 									item_html+="</div>";
									 			}
				 							}
					 				}
					 			}
					 			item_html+=hiddenInput;
					 			item_html += "</td><td "+column2Style+">";
					 			if(no_yesno != "true")
					 			{
		 							item_html+=checkboxInfo;
					 			}
					 			item_html+="</td></tr>";
					 		} 
						}
			 		}else if('HealthRemarkTable' == flag){ //固定标记情况
			 			var expendable = disclosureItemEl.getElementsByTagName("Expendable");
			 			var description = disclosureItemEl.getElementsByTagName("Description");
			 			item_html+="<tr><td "+column1Style+">";
			 			item_html+=description[0].getAttribute("text");
			 			if(expendable != null && expendable.length > 0){
			 				 var ex_child = expendable[0].childNodes; 
			 				 if(ex_child != null && ex_child.length > 0){
			 					if(no_yesno != "true")
					 			{
			 						item_html+="<div "+divAttributes+" >";
					 			}
			 				 	  for(var k = 0; k<ex_child.length; k++){
			 				 	  		if(ex_child[k].nodeType == 1){
			 				 	  			var healthtable_key = ex_child[k].getAttribute("healthtable_key");
			 				 	  			var text = ex_child[k].getAttribute("text");
			 				 	  			if(text){
			 				 	  				 item_html+=text;
			 				 	  			}else{
			 				 	  				var static_hl ="<span style='display:block;text-indent:2em;' id="+disclosure_id+"_0_"+healthtable_key+">请您告知治疗或住院的具体时间:<input "+textStyle+" type='text' id=0_"+healthtable_key+" /></span>";
											    static_hl+="<span style='display:block;text-indent:2em;' id="+disclosure_id+"_1_"+healthtable_key+">请您告知医生诊断的疾病名称:<input "+textStyle+" type='text' id=_1_"+healthtable_key+" /></span>";
											    static_hl+="<span style='display:block;text-indent:2em;'  id="+disclosure_id+"_2_"+healthtable_key+">如果住院请您告知医院的名称:<input "+textStyle+" type='text' id=2_"+healthtable_key+" /></span>";
											    static_hl+="<span style='display:block;text-indent:2em;'  id="+disclosure_id+"_3_"+healthtable_key+">请您详细告知:<textarea "+textareaStyle+" id=3_"+healthtable_key+" rows=4 onblur='checkTextAreaLength(this)'></textarea></span>";
												item_html+=static_hl;
			 				 	  			} 
			 				 	  		}
			 				 	  }
			 				 	if(no_yesno != "true")
					 			{
			 				 		item_html+="</div>";
					 			}
			 				 }
			 			} 
			 			item_html+=hiddenInput;
			 			item_html+="</td><td "+column2Style+">";
			 			if(no_yesno != "true")
			 			{
				 			item_html+=checkboxInfo;
			 			}
			 			item_html+="</td></tr>";
			 		}else if('BlankRemarkTable' == flag){
			 		 	var expendable = disclosureItemEl.getElementsByTagName("Expendable");
			 			var description = disclosureItemEl.getElementsByTagName("Description");
			 			item_html+="<tr><td "+column1Style+">";
			 			item_html+=description[0].getAttribute("text");
						if(expendable != null && expendable.length > 0){
			 				 var ex_child = expendable[0].childNodes; 
			 				 if(ex_child != null && ex_child.length > 0){
			 					if(no_yesno != "true")
					 			{ 
			 						item_html+="<div "+divAttributes+" >";
					 			}
			 				 	  for(var k = 0; k<ex_child.length; k++){
			 				 	  		if(ex_child[k].nodeType == 1){
			 				 	  			var input_key = ex_child[k].getAttribute("input_key");
			 				 	  			var text = ex_child[k].getAttribute("text");
			 				 	  			var lines = ex_child[k].getAttribute("lines");
			 				 	  			if(text){
			 				 	  				 item_html+=text;
			 				 	  			}else{
			 				 	  				var static_hl ="<span style='display:block;text-indent:2em;' id="+disclosure_id+"_0_"+input_key+">请您详细告知:";
			 				 	  				if(lines){
			 				 	  					static_hl +="<textarea "+textareaStyle+" id="+input_key+" rows="+lines+" onblur='checkTextAreaLength(this)'></textarea></span>";
			 				 	  				}else{
			 				 	  					static_hl+="<input "+textStyle+" type='text' id="+input_key+" /></span>";
			 				 	  				}
											    item_html+=static_hl;
			 				 	  			} 
			 				 	  		}
			 				 	  }
			 				 	if(no_yesno != "true")
					 			{
								  item_html+="</div>";
					 			}
			 				 }
			 			} 
			 			item_html+=hiddenInput;
			 			item_html+="</td><td "+column2Style+">";
			 			if(no_yesno != "true")
			 			{
				 			item_html+=checkboxInfo;
			 			}
						item_html+="</td></tr>";
			 		}else if('HealthRemarkTableIf' == flag){
			 			if(eval(if_express)){
			 				var expendable = disclosureItemEl.getElementsByTagName("Expendable");
				 			var description = disclosureItemEl.getElementsByTagName("Description");
				 			item_html+="<tr><td "+column1Style+">";
				 			item_html+=description[0].getAttribute("text");
				 			if(expendable != null && expendable.length > 0){
				 				 var ex_child = expendable[0].childNodes; 
				 				 if(ex_child != null && ex_child.length > 0){
				 					if(no_yesno != "true")
						 			{ 
				 						item_html+="<div "+divAttributes+" >";
						 			}
				 				 	  for(var k = 0; k<ex_child.length; k++){
				 				 	  		if(ex_child[k].nodeType == 1){
				 				 	  			var text = ex_child[k].getAttribute("text");
				 				 	  			if(text){
				 				 	  				 item_html+=text;
				 				 	  			}else{
				 				 	  				var healthtable_key = ex_child[k].getAttribute("healthtable_key");
					 				 	  			var static_hl ="<span style='display:block;text-indent:2em;' id="+disclosure_id+"_0_"+healthtable_key+">请您告知治疗或住院的具体时间:<input "+textStyle+" type='text' id=0_"+healthtable_key+" /></span>";
												    static_hl+="<span style='display:block;text-indent:2em;' id="+disclosure_id+"_1_"+healthtable_key+">请您告知医生诊断的疾病名称:<input "+textStyle+" type='text' id=1_"+healthtable_key+" /></span>";
												    static_hl+="<span style='display:block;text-indent:2em;' id="+disclosure_id+"_2_"+healthtable_key+">如果住院请您告知医院的名称:<input "+textStyle+" type='text' id=2_"+healthtable_key+" /></span>";
												    static_hl+="<span style='display:block;text-indent:2em;' id="+disclosure_id+"_3_"+healthtable_key+">请您详细告知:<textarea "+textareaStyle+" id=3_"+healthtable_key+" rows=4 onblur='checkTextAreaLength(this)'></textarea></span>";
													item_html+=static_hl;
				 				 	  			} 
				 				 	  		}
				 				 	  }
				 				 	if(no_yesno != "true")
						 			{
				 				 		item_html+="</div>";
						 			}
				 				 }
				 			}
				 			item_html+=hiddenInput;
				 			item_html+="</td><td "+column2Style+">";
				 			if(no_yesno != "true")
				 			{
					 			item_html+=checkboxInfo;
				 			}
				 			item_html+="</td></tr>";
			 			} 
			 		}else if('BlankRemarkTableIf' == flag){
			 			if(eval(if_express)){
			 				var expendable = disclosureItemEl.getElementsByTagName("Expendable");
				 			var description = disclosureItemEl.getElementsByTagName("Description");
				 			item_html+="<tr><td "+column1Style+">";
				 			item_html+=description[0].getAttribute("text");
							if(expendable != null && expendable.length > 0){
				 				 var ex_child = expendable[0].childNodes; 
				 				 if(ex_child != null && ex_child.length > 0){
				 					if(no_yesno != "true")
						 			{ 
				 						item_html+="<div "+divAttributes+" >";
						 			}
				 				 	  for(var k = 0; k<ex_child.length; k++){
				 				 	  		if(ex_child[k].nodeType == 1){
				 				 	  			var input_key = ex_child[k].getAttribute("input_key");
				 				 	  			var text = ex_child[k].getAttribute("text");
				 				 	  			var lines = ex_child[k].getAttribute("lines");
				 				 	  			if(text){
				 				 	  				 item_html+=text;
				 				 	  			}else{
				 				 	  				var static_hl ="<span style='display:block;text-indent:2em;' id="+disclosure_id+"_0_"+input_key+">请您详细告知:";
					 				 	  			if(lines){
					 				 	  				static_hl+="<textarea "+textareaStyle+" id="+input_key+" rows="+lines+" onblur='checkTextAreaLength(this)'></textarea></span>";
				 				 	  				}else{
				 				 	  					static_hl+="<input "+textStyle+" type='text' id=0_"+input_key+" /></span>";
				 				 	  				}
												    item_html+=static_hl;
				 				 	  			}
				 				 	  		}
				 				 	  }
				 				 	if(no_yesno != "true")
						 			{
				 				 		item_html+="</div>";
						 			}
				 				 }
				 			} 
				 			item_html+=hiddenInput;
				 			item_html+="</td><td "+column2Style+">";
				 			if(no_yesno != "true")
				 			{
					 			item_html+=checkboxInfo;
				 			}
							item_html+="</td></tr>";
			 			} 
			 		}else if('if' == flag){
			 		 	if(eval(if_express)){
			 		 		if(childList != null && childList.length > 0){
								item_html+="<tr><td "+column1Style+">";
					 			for(var j = 0; j<childList.length; j++){
					 				var nodeType = childList[j].nodeType;
					 				if(1 == nodeType){
					 					var descriptionText = childList[j].getAttribute("text");
					 					//显示红色字体  add by wangzj
					 					var isColor = childList[j].getAttribute("color");
					 					if(descriptionText){ //lable文字
					 						if(isColor){
					 							item_html += '<span style="color: red;">'
					 							item_html += descriptionText;
					 							item_html += '</span>';
					 						}else{
					 							item_html += descriptionText;
					 						}
					 					}else{
					 						var input_key = childList[j].getAttribute("input_key");
					 						var input_length = childList[j].getAttribute("length");
					 						if(input_key){ //input框
 					 							var currentStyle = (input_length && input_length < 5) ? textStyleS : textStyle;
				 								item_html += "<input "+currentStyle+" id="+disclosure_id+"_"+input_key+" size="+input_length+"  onblur='alerTip(this)' />";
					 						} 
					 					}
					 				}
					 			}
					 			item_html+=hiddenInput;
					 			item_html+="</td><td "+column2Style+"></td></tr>";
					 		}
			 		 	}
			 		}else if('radio' == flag){
			 			if(eval(if_express)){
			 		 		if(childList != null && childList.length > 0){
								item_html+="<tr><td "+column1Style+">";
					 			for(var j = 0; j<childList.length; j++){
					 				var nodeType = childList[j].nodeType;
					 				if(1 == nodeType){
					 					var descriptionText = childList[j].getAttribute("text");
					 					if(descriptionText){ //lable文字
					 						 item_html += descriptionText;
					 					}else{
					 						var expandChild = childList[j].childNodes;
				 							if(expandChild != null && expandChild.length > 0 ){
				 								if(no_yesno != "true")
									 			{
				 									item_html+="<div "+divAttributes+" >";
									 			}
				 								for(var k = 0; k<expandChild.length; k++){
				 									if(1 ==  expandChild[k].nodeType){
				 										var exText = expandChild[k].getAttribute("text");
				 										if(exText){
				 											 item_html += exText;
				 										}else{
				 											var radio_key = expandChild[k].getAttribute("radio_key");
				 											var options = expandChild[k].getAttribute("options");
				 											var ex_input_key = expandChild[k].getAttribute("radio_key");
				 											var and_others = expandChild[k].getAttribute("and_others");
				 											if(ex_input_key){
				 												if(and_others == "true"){
				 													item_html += radioFrontHtml + '<input '+ radioStyle +' type="checkbox" name='+radio_key+'_'+disclosure_id+' id='+otherRadioId+' value="其他" onchange="initOtherInput(this,'+otherInputId+')" /><label for='+otherRadioId+'></label>' + '其他：<input '+ textStyleM +' name='+radio_key+'_'+disclosure_id+' id='+otherInputId+' allowSave="false" onfocus="checkOtherRadio(this,'+otherRadioId+')" onchange="checkOtherRadio(this,'+otherRadioId+')" />'+' ';
				 												}else {
				 													// item_html += radioFrontHtml + '<input '+ radioStyle +' type="radio" name='+radio_key+'_'+disclosure_id+' id='+disclosure_id+' value="'+options+'" onchange="initOtherInput(this,'+otherInputId+')" /><label for='+disclosure_id+'></label>'+options+' ';
				 													item_html += radioFrontHtml + '<input '+ radioStyle +' type="checkbox" name='+radio_key+'_'+disclosure_id+' id='+disclosure_id+'_'+k+' value="'+options+'" onchange="initOtherInput(this,'+otherInputId+')" /><label for='+disclosure_id+'_'+k+'></label>'+options+' ';
				 												}
				 											}
				 										}
				 									}
				 								}
				 								if(no_yesno != "true")
									 			{
				 									item_html+="</div>";
									 			}
				 							}
					 					}
					 				}
					 			}
					 			item_html+=hiddenInput;
					 			item_html += "</td><td "+column2Style+">";
					 			if(no_yesno != "true")
					 			{
						 			item_html+=checkboxInfo;
					 			}
					 			item_html+="</td></tr>";
					 		}
			 		 	}
			 		}else if('radio_noEx' == flag){
			 			if(childList != null && childList.length > 0){
							item_html+="<tr><td "+column1Style+">";
				 			for(var j = 0; j<childList.length; j++){
				 				var nodeType = childList[j].nodeType;
				 				if(1 == nodeType){
				 					var descriptionText = childList[j].getAttribute("text");
				 					if(descriptionText){ //lable文字
				 						 item_html += descriptionText;
				 					}else{
				 						var expandChild = childList[j].childNodes;
				 						if(no_yesno != "true")
							 			{
				 							item_html+="<div "+divAttributes+" >";
							 			}
			 							if(expandChild != null && expandChild.length > 0 ){
			 								for(var k = 0; k<expandChild.length; k++){
			 									if(1 ==  expandChild[k].nodeType){
			 										var exText = expandChild[k].getAttribute("text");
			 										if(exText){
			 											 item_html += exText;
			 										}else{
			 											var radio_key = expandChild[k].getAttribute("radio_key");
			 											var options = expandChild[k].getAttribute("options");
			 											var ex_input_key = expandChild[k].getAttribute("radio_key");
			 											var and_others = expandChild[k].getAttribute("and_others");
			 											if(ex_input_key){
			 												var optionArray = options.split("@@");
			 												if(optionArray.length==1){
			 													if(and_others == "true"){
				 													item_html += radioFrontHtml + '<input '+ radioStyle +' type="radio" name='+radio_key+'_'+disclosure_id+' id='+otherRadioId+' value="其他" onchange="initOtherInput(this,'+otherInputId+')" /><label name='+radio_key+'_'+disclosure_id+'  for='+otherRadioId+'></label>'+'其他：<input '+ textStyleM +' name='+radio_key+'_'+disclosure_id+' id='+otherInputId+' allowSave="false" onfocus="checkOtherRadio(this,'+otherRadioId+')" onchange="checkOtherRadio(this,'+otherRadioId+')" />'+' ';;
				 												}else{
				 													item_html += radioFrontHtml + '<input '+ radioStyle +' type="radio" name='+radio_key+'_'+disclosure_id+' id='+disclosure_id+' value="'+options+'" onchange="initOtherInput(this,'+otherInputId+')" /><label name='+radio_key+'_'+disclosure_id+' for='+disclosure_id+'></label>'+options+' ';
				 												}
			 												}else{
			 													for(var l = 0 ; l < optionArray.length ; l++){
			 														item_html += radioFrontHtml + '<input '+ radioStyle +' type="radio" name='+radio_key+'_'+disclosure_id+' id='+disclosure_id+'_'+l+' value="'+optionArray[l]+'" onchange="initOtherInput(this,'+otherInputId+')" /><label name='+radio_key+'_'+disclosure_id+' for='+disclosure_id+'_'+l+'></label>'+optionArray[l]+' ';
			 													}
				 												if(and_others == "true"){
				 													item_html += radioFrontHtml + '<input '+ radioStyle +' type="radio" name='+radio_key+'_'+disclosure_id+' id='+otherRadioId+' value="其他" onchange="initOtherInput(this,'+otherInputId+')" /><label name='+radio_key+'_'+disclosure_id+'  for='+otherRadioId+'></label>'+'其他：<input '+ textStyleM +' name='+radio_key+'_'+disclosure_id+' id='+otherInputId+' allowSave="false" onfocus="checkOtherRadio(this,'+otherRadioId+')" onchange="checkOtherRadio(this,'+otherRadioId+')" />'+' ';
				 												}
			 												}
			 											}
			 										}
			 									}
			 								}
			 							}else{
 											var options = childList[j].getAttribute("options");
 											var ex_input_key = childList[j].getAttribute("radio_key");
 											var and_others = childList[j].getAttribute("and_others");
 											if(ex_input_key){
 												var optionArray = options.split("@@");
 												if(optionArray.length==1){
 													item_html += radioFrontHtml + '<input '+ radioStyle +' type="radio" name='+radio_key+'_'+disclosure_id+' id='+disclosure_id+' value="'+options+'" onchange="initOtherInput(this,'+otherInputId+')" /><label  name='+radio_key+'_'+disclosure_id+' for='+disclosure_id+'></label>'+options+' ';
 												}else{
 													for(var l = 0 ; l < optionArray.length ; l++){
 														item_html += radioFrontHtml + '<input '+ radioStyle +' type="radio" name='+radio_key+'_'+disclosure_id+' id='+disclosure_id+'_'+l+' value="'+optionArray[l]+'" onchange="initOtherInput(this,'+otherInputId+')" /><label name='+radio_key+'_'+disclosure_id+'  for='+disclosure_id+'_'+l+'></label>'+optionArray[l]+' ';
 													}
 												}
 												if(and_others == "true"){
 													item_html += radioFrontHtml + '<input '+ radioStyle +' type="radio" name='+radio_key+'_'+disclosure_id+' id='+otherRadioId+' value="其他" onchange="initOtherInput(this,'+otherInputId+')" /><label name='+radio_key+'_'+disclosure_id+'  for='+otherRadioId+'></label>'+'其他：<input '+ textStyleM +' name='+radio_key+'_'+disclosure_id+' id='+otherInputId+' allowSave="false" onfocus="checkOtherRadio(this,'+otherRadioId+')" onchange="checkOtherRadio(this,'+otherRadioId+')" />'+' ';
 												}
 											}
			 							}
			 							if(no_yesno != "true")
							 			{
			 								item_html+="</div>";
							 			}
				 					}
				 				}
				 			}
				 			item_html+=hiddenInput;
				 			item_html += "</td><td "+column2Style+">";
				 			if(no_yesno != "true")
				 			{
					 			item_html+=checkboxInfo;
				 			}
				 			item_html+="</td></tr>";
				 		}
			 		}else{
			 			if(childList != null && childList.length > 0){
							item_html+="<tr><td "+column1Style+">";
				 			for(var j = 0; j<childList.length; j++){
				 				var nodeType = childList[j].nodeType;
				 				if(1 == nodeType){
				 					var descriptionText = childList[j].getAttribute("text");
				 					if(descriptionText){ //lable文字
				 						 item_html += descriptionText;
				 					} 
				 				}
				 			}
				 			item_html+=hiddenInput;
				 			item_html += "</td><td "+column2Style+">";
				 			if(no_yesno != "true")
				 			{
					 			item_html+=checkboxInfo;
				 			}
				 			item_html+="</td></tr>";
				 		}
			 		}
		 			result_html+=item_html;
			 	}
			 	result_html+="</table>";
			 	console.log("result_html:" +result_html);
			 	return result_html;
			 }
		}else{
			alert("系统找不到该xml文件，请确认路径是否正确!当前路径:" + xmlUrl);
		}
}


/**
 * @功能  问题卷xml生成html规则 
 * @param {Object} xmlUrl
 * @author wangzj
 */
function asyncQuestionRuleByXml(xmlUrl){
        var domDoc = getNativeXml(xmlUrl);
        if(domDoc){
             var result_html='';
             var DisclosureItemList = domDoc.getElementsByTagName("DisclosureItem");
             if(DisclosureItemList != null && DisclosureItemList.length > 0){
                var questionName = DisclosureItemList[0].getAttribute("text");
                var questionCheckbox_id = DisclosureItemList[0].getAttribute("disclosure_id");
                var disclosure_ver = DisclosureItemList[0].getAttribute("disclosure_ver");
                if(questionName&&questionCheckbox_id){
                    result_html += '<div id="'+questionCheckbox_id+'" yn="'+disclosure_ver+'" ><p class="question_title" id="p_'+questionCheckbox_id+'" onclick=showTable(this)>'+questionName+'</p>'
                }
                result_html+='<table class="impartTable color-gray" id="table_'+questionCheckbox_id+'">';
                var column1Style = " class='impartColumn1' ";
                var column2Style = " class='impartColumn2' ";
                
                //表单元素样式设置，PAD版样式
                var textStyleS = " class='small_text_input textStyleW50' "; //短文本框
                var textStyleM = " class='text-style textStyleW100' ";  //文本框
                var textStyle = " class='text-style textStyleP40' ";    //长文本框
                var textareaStyle = " class='text-style textStyleP80' ";    //文本域
                var checkboxStyle = " class=checkboxStyleOfImpart ";    //复选框
                var radioStyle = " class=checkboxStyleOfImpart ";   //单选按钮 modify by liuye
                var checkboxAfterHtml = "<span class='contentMarginLeft'></span>";      //控制复选框布局格式的html代码
                var radioFrontHtml = "";    //控制单选按钮布局格式的html代码
                
                //手机版样式
                var pcType = document.getElementById("pctype").value;
                if(pcType == "phone"){
                    column1Style = " class='impartColumn1OfPhone' ";
                    column2Style = " class='impartColumn2OfPhone' ";
                    textStyleS = " class='small_text_input textStyleW50' "; //短文本框
                    textStyleM = " class='text-style textStyleW100' ";  //文本框
                    textStyle = " class='text-style textStyleP95' ";    //长文本框
                    textareaStyle = " class='text-style textStyleP95' ";    //文本域
                    //checkboxStyle = " class=checkboxStyleOfImpart ";  //复选框
                    //radioStyle = " class=radioStyleOfImpart ";    //单选按钮
                    checkboxAfterHtml = "<br/>";        //控制复选框格式的html代码
                    radioFrontHtml = "<br/>";
                }
                
                for(var i = 0; i<DisclosureItemList.length; i++){
                    var disclosureItemEl = DisclosureItemList[i];
                    var disclosure_ver = disclosureItemEl.getAttribute("disclosure_ver");
                    var no_yesno = disclosureItemEl.getAttribute("no_yesno");
                    var isCheck_yes = disclosureItemEl.getAttribute("isCheck_yes");
                    var disclosure_id = disclosureItemEl.getAttribute("disclosure_id");

                    var flag = disclosureItemEl.getAttribute("flag");  //类型标识 
                    var childList = disclosureItemEl.childNodes; //获取所有的子节点
                    var item_html='';
                    var divAttributes = " id=div_"+disclosure_id+" class='impart_sub_div' ";
                    // 是否按钮
                    var checkboxInfo = "<input type='checkbox' id='"+disclosure_id+"yes' value='1' onclick='pageControlleShow(this)'" + checkboxStyle + "><label for='"+disclosure_id+"yes'></label>是<input type='checkbox' id='"+disclosure_id+"no' value='0' onclick='pageControlleShow(this)'" + checkboxStyle + " ><label for='"+disclosure_id+"no'></label>否";
                    //‘其他’单选按钮的ID值
                    var otherRadioId = disclosure_ver + "_" + disclosure_id + "_" + "otherRadio";
                    var otherInputId = disclosure_ver + "_" + disclosure_id + "_" + "otherInput";

                    if('common' == flag){ //通用型html表单
                        var expendable = disclosureItemEl.getElementsByTagName("Expendable");
                        if(no_yesno != "true"){
                            item_html+="<tr><td "+column1Style+">";
                        }else{
                            item_html+="<tr><td "+column1Style+' colspan="2">';
                        }
                        if(expendable != null && expendable.length > 0){
                            var description = disclosureItemEl.getElementsByTagName("Description");
                            var ex_child = expendable[0].childNodes;
                            item_html+=description[0].getAttribute("text");
                            if(ex_child != null && ex_child.length > 0){
                                if(no_yesno != "true"){ 
                                    item_html+="<div "+divAttributes+" >";
                                }
                                  for(var k = 0; k<ex_child.length; k++){
                                        if(ex_child[k].nodeType == 1){
                                            var descriptionText = ex_child[k].getAttribute("text");
                                            if(descriptionText){ //lable文字
                                                 item_html += descriptionText;
                                            }else{
                                                var input_type = ex_child[k].getAttribute("input_type");
                                                var input_key = ex_child[k].getAttribute("input_key");
                                                var input_length = ex_child[k].getAttribute("length");
                                                var radio_key = ex_child[k].getAttribute("radio_key");
                                                var lines = ex_child[k].getAttribute("lines");
                                                var options = ex_child[k].getAttribute("options");
                                                var and_others = ex_child[k].getAttribute("and_others");
                                                if("text" == input_type){
                                                    var currentStyle = (input_length && input_length < 5) ? textStyleS : textStyle;
                                                    item_html += "<input type='text' "+currentStyle+" id='"+input_key+"' size="+input_length +" />";
                                                }else if("number" == input_type){
                                                    var currentStyle = (input_length && input_length < 5) ? textStyleS : textStyle;
                                                    item_html += "<input "+currentStyle+" id='"+input_key+"' size="+input_length +" onkeyup='numberChange(this)' />";
                                                }else if("checkbox" == input_type){
                                                    if(and_others=="true"){
                                                        item_html += radioFrontHtml + '<input '+ radioStyle +' type="checkbox" name="'+disclosure_id+'name" id="'+radio_key+'" onchange="questionCheckOtherRadio(this)" /><label for="'+radio_key+'"></label>'+options+' ';
                                                    }else{
                                                        item_html += radioFrontHtml + '<input '+ radioStyle +' type="checkbox" name="'+disclosure_id+'name" id="'+radio_key+'" /><label for="'+radio_key+'"></label>'+options+' ';
                                                    }
                                                }else if("radio" == input_type){
                                                    if(and_others=="true"){
                                                        item_html += radioFrontHtml + '<input '+ radioStyle +' type="radio" name="'+disclosure_id+'name" id="'+radio_key+'" onchange="questionCheckOtherRadio(this)" /><label for="'+radio_key+'"></label>'+options+' ';
                                                    }else{
                                                        item_html += radioFrontHtml + '<input '+ radioStyle +' type="radio" name="'+disclosure_id+'name" id="'+radio_key+'" /><label for="'+radio_key+'"></label>'+options+' ';
                                                    }
                                                }else if("textarea" == input_type){
                                                    item_html +="<span style='display:block;text-indent:2em;'>请您详细告知:";
                                                    item_html +="<textarea "+textareaStyle+" id="+input_key+" rows="+lines+" onblur='checkTextAreaLength(this)'></textarea></span>";
                                                }else if("select" == input_type){
                                                    var optionArray = options.split("@@");
                                                    item_html += "<select id="+radio_key+">"
                                                    for(var l = 0 ; l < optionArray.length ; l++){
                                                        var optionSmallArray = optionArray[l].split("##");
                                                        item_html += '<option value="'+optionSmallArray[0]+'">'+optionSmallArray[1]+'</option>';
                                                    }
                                                    item_html += "</select>";
                                                }else if("br" == input_type){
                                                    item_html +="<br/>";
                                                }else{
                                                    item_html +='<span style="color: red;">这里解析出错了！！！！！！</span>';
                                                }
                                            }
                                        }
                                  }
                                if(no_yesno != "true")
                                {
                                  item_html+="</div>";
                                }
                             }
                        }else{
                            for(var j = 0; j<childList.length; j++){
                                var nodeType = childList[j].nodeType;
                                if(1 == nodeType){
                                    var descriptionText = childList[j].getAttribute("text");
                                    if(descriptionText){ //lable文字
                                         item_html += descriptionText;
                                    }else{
                                        var input_type = childList[j].getAttribute("input_type");
                                        var input_key = childList[j].getAttribute("input_key");
                                        var input_length = childList[j].getAttribute("length");
                                        var radio_key = childList[j].getAttribute("radio_key");
                                        var lines = childList[j].getAttribute("lines");
                                        var options = childList[j].getAttribute("options");
                                        var isCheckedInput = childList[j].getAttribute("is_checked");
                                        var and_others = childList[j].getAttribute("and_others");
                                        if("text" == input_type){
                                            var currentStyle = (input_length && input_length < 5) ? textStyleS : textStyle;
                                            if(isCheckedInput && isCheckedInput=="false"){
                                                item_html += "<input type='text' "+currentStyle+" id='"+input_key+"' size="+input_length +" allowSave='false'  />";
                                            }else{
                                                item_html += "<input "+currentStyle+" id='"+input_key+"' size="+input_length +"  />";
                                            }
                                        }else if ("number" == input_type){
                                            var currentStyle = (input_length && input_length < 5) ? textStyleS : textStyle;
                                            if(isCheckedInput && isCheckedInput=="false"){
                                                item_html += "<input "+currentStyle+" id='"+input_key+"' size="+input_length +" allowSave='false' onkeyup='numberChange(this)' />";
                                            }else{
                                                item_html += "<input "+currentStyle+" id='"+input_key+"' size="+input_length +" onkeyup='numberChange(this)' />";
                                            }   
                                        }else if("checkbox" == input_type){
                                            if(and_others=="true"){
                                                item_html += radioFrontHtml + '<input '+ radioStyle +' type="checkbox" name="'+disclosure_id+'name" id="'+radio_key+'" onchange="questionCheckOtherRadio(this)" /><label for="'+radio_key+'"></label>'+options+' ';
                                            }else if(isCheckedInput && isCheckedInput=="false"){
                                                item_html += radioFrontHtml + '<input '+ radioStyle +' type="checkbox" name="'+disclosure_id+'name" id="'+radio_key+'" allowSave="false"/><label for="'+radio_key+'"></label>'+options+' ';
                                            }else{
                                                item_html += radioFrontHtml + '<input '+ radioStyle +' type="checkbox" name="'+disclosure_id+'name" id="'+radio_key+'" /><label for="'+radio_key+'"></label><span key="'+radio_key+'">'+options+'</span>';
                                            }
                                        }else if("radio" == input_type){
                                            if(and_others=="true"){
                                                item_html += radioFrontHtml + '<input '+ radioStyle +' type="radio" name="'+disclosure_id+'name" id="'+radio_key+'" onchange="questionCheckOtherRadio(this)" /><label for="'+radio_key+'"></label>'+options+' ';
                                            }else{
                                                item_html += radioFrontHtml + '<input '+ radioStyle +' type="radio" name="'+disclosure_id+'name" id="'+radio_key+'" /><label for="'+radio_key+'"></label>'+options+' ';
                                            }
                                        }else if("textarea" == input_type){
                                            if(isCheckedInput && isCheckedInput=="false"){
                                                item_html +="<span style='display:block;text-indent:2em;'>请您详细告知:";
                                                item_html +="<textarea allowSave='false' "+textareaStyle+" id="+input_key+" rows="+lines+" onblur='checkTextAreaLength(this)'></textarea></span>";
                                            }else{
                                                item_html +="<span style='display:block;text-indent:2em;'>请您详细告知:";
                                                item_html +="<textarea "+textareaStyle+" id="+input_key+" rows="+lines+" onblur='checkTextAreaLength(this)'></textarea></span>";
                                            }

                                        }else if("select" == input_type){
                                            var optionArray = options.split("@@");
                                            item_html += "<select id="+radio_key+">"
                                            for(var l = 0 ; l < optionArray.length ; l++){
                                                var optionSmallArray = optionArray[l].split("##");
                                                item_html += '<option value="'+optionSmallArray[0]+'">'+optionSmallArray[1]+'</option>';
                                            }
                                            item_html += "</select>";
                                        }else if("br" == input_type){
                                            item_html +="<br/>";
                                        }else{
                                            item_html +='<span style="color: red;">解析出错！！！！！！</span>';
                                        }
                                    }
                                }
                            }
                        }
                        if(no_yesno != "true"){
                            item_html+="</td><td "+column2Style+">";
                      		//  item_html+=checkboxInfo;
                            //当是、否 按钮的id需要自己定义时，且以yes/no结尾
                            if(no_yesno == "custom"){
                                var custom_yesno = disclosureItemEl.getAttribute("custom_yesno");
                                item_html+="<input type='checkbox' id='"+custom_yesno+"yes' value='1' onclick='pageControlleShow(this)'" + checkboxStyle + "><label for='"+custom_yesno+"yes'></label>是<input type='checkbox' id='"+custom_yesno+"no' value='0' onclick='pageControlleShow(this)'" + checkboxStyle + " ><label for='"+custom_yesno+"no'></label>否";
                            }else if("customAll" == no_yesno){
                                var custom_yes = disclosureItemEl.getAttribute("custom_yes");
                                var custom_no = disclosureItemEl.getAttribute("custom_no");
                                var donotCheckYes = disclosureItemEl.getAttribute("donotCheckYes");
                                if (donotCheckYes && donotCheckYes == 'yes') {
                                    item_html+="<input type='checkbox' donotCheckYes='yes' allowSave='false' id='"+custom_yes+"' value='1' onclick='pageControlleShow(this)'" + checkboxStyle + "><label for='"+custom_yes+"'></label>是<input type='checkbox' donotCheckYes='yes' allowSave='false' id='"+custom_no+"' value='0' onclick='pageControlleShow(this)'" + checkboxStyle + " ><label for='"+custom_no+"'></label>否";
                                }else{
                                    item_html+="<input type='checkbox' id='"+custom_yes+"' value='1' onclick='pageControlleShow(this)'" + checkboxStyle + "><label for='"+custom_yes+"'></label>是<input type='checkbox' id='"+custom_no+"' value='0' onclick='pageControlleShow(this)'" + checkboxStyle + " ><label for='"+custom_no+"'></label>否";
                                }
                            }else if("haveNone" == no_yesno){//有的不是“是、否”字样，而是“有、无”字样
                                item_html +=  "<input type='checkbox' id='"+disclosure_id+"yes' value='1' onclick='pageControlleShow(this)'" + checkboxStyle + "><label for='"+disclosure_id+"yes'></label>有<input type='checkbox' id='"+disclosure_id+"no' value='0' onclick='pageControlleShow(this)'" + checkboxStyle + " ><label for='"+disclosure_id+"no'></label>无";
                            }else if("donotCheckYes" == no_yesno){//部分选项选择“是”后无需填写病历资料
                                item_html +=  "<input type='checkbox' donotCheckYes='yes' id='"+disclosure_id+"yes' value='1' onclick='pageControlleShow(this)'" + checkboxStyle + "><label for='"+disclosure_id+"yes'></label>是<input type='checkbox' id='"+disclosure_id+"no' value='0' onclick='pageControlleShow(this)'" + checkboxStyle + " ><label for='"+disclosure_id+"no'></label>否";
                            }
                            else{
                                item_html+=checkboxInfo;
                            }
                        }
                        item_html+="</td></tr>";
                    }else if('BlankRemarkTable' == flag){
                        var expendable = disclosureItemEl.getElementsByTagName("Expendable");
                        var description = disclosureItemEl.getElementsByTagName("Description");
                        if(no_yesno != "true"){
                            item_html+="<tr><td "+column1Style+">";
                        }else{
                            item_html+="<tr><td "+column1Style+' colspan="2">';
                        }
                        item_html+=description[0].getAttribute("text");
                        if(expendable != null && expendable.length > 0){
                             var ex_child = expendable[0].childNodes; 
                             if(ex_child != null && ex_child.length > 0){
                                if(no_yesno != "true")
                                { 
                                    item_html+="<div "+divAttributes+" >";
                                }
                                  for(var k = 0; k<ex_child.length; k++){
                                        if(ex_child[k].nodeType == 1){
                                            var input_key = ex_child[k].getAttribute("input_key");
                                            var text = ex_child[k].getAttribute("text");
                                            var lines = ex_child[k].getAttribute("lines");
                                            if(text){
                                                 item_html+=text;
                                            }else{
                                                var static_hl ="<span style='display:block;text-indent:2em;'>请您详细告知:";
                                                if(lines){
                                                    if(isCheck_yes == "false"){
                                                        static_hl +="<textarea "+textareaStyle+" id='"+input_key+"' rows="+lines+" isCheck_yes='true' onblur='checkTextAreaLength(this)'></textarea></span>";
                                                    }else{
                                                        static_hl +="<textarea "+textareaStyle+" id='"+input_key+"' rows="+lines+" onblur='checkTextAreaLength(this)'></textarea></span>";
                                                    }
                                                }else{
                                                    static_hl+="<input "+textStyle+" type='text' id='"+input_key+"' /></span>";
                                                }
                                                item_html+=static_hl;
                                            } 
                                        }
                                  }
                                if(no_yesno != "true")
                                {
                                  item_html+="</div>";
                                }
                             }
                        } 
                        if(no_yesno != "true"){
                            item_html+="</td><td "+column2Style+">";
                            if("haveNone" == no_yesno){//有的不是“是、否”字样，而是“有、无”字样
                                item_html +=  "<input type='checkbox' id='"+disclosure_id+"yes' value='1' onclick='pageControlleShow(this)'" + checkboxStyle + "><label for='"+disclosure_id+"yes'></label>有<input type='checkbox' id='"+disclosure_id+"no' value='0' onclick='pageControlleShow(this)'" + checkboxStyle + " ><label for='"+disclosure_id+"no'></label>无";
                            }else if("donotCheckYes" == no_yesno){//部分选项选择“是”后无需填写病历资料
                                item_html +=  "<input type='checkbox' donotCheckYes='yes' id='"+disclosure_id+"yes' value='1' onclick='pageControlleShow(this)'" + checkboxStyle + "><label for='"+disclosure_id+"yes'></label>是<input type='checkbox' id='"+disclosure_id+"no' value='0' onclick='pageControlleShow(this)'" + checkboxStyle + " ><label for='"+disclosure_id+"no'></label>否";
                            }
                            else{
                                item_html+=checkboxInfo;
                            }
                        }
                        item_html+="</td></tr>";
                    }else if('radio_noEx' == flag){
                        if(childList != null && childList.length > 0){
                            item_html+="<tr><td "+column1Style+">";
                            for(var j = 0; j<childList.length; j++){
                                var nodeType = childList[j].nodeType;
                                if(1 == nodeType){
                                    var descriptionText = childList[j].getAttribute("text");
                                    if(descriptionText){ //lable文字
                                         item_html += descriptionText;
                                    }else{
                                        var expandChild = childList[j].childNodes;
                                        if(no_yesno != "true")
                                        {
                                            item_html+="<div "+divAttributes+" >";
                                        }
                                        if(expandChild != null && expandChild.length > 0 ){
                                            for(var k = 0; k<expandChild.length; k++){
                                                if(1 ==  expandChild[k].nodeType){
                                                    var exText = expandChild[k].getAttribute("text");
                                                    if(exText){
                                                         item_html += exText;
                                                    }else{
                                                        var radio_key = expandChild[k].getAttribute("radio_key");
                                                        var options = expandChild[k].getAttribute("options");
                                                        var ex_input_key = expandChild[k].getAttribute("radio_key");
                                                        var and_others = expandChild[k].getAttribute("and_others");
                                                        if(ex_input_key){
                                                            var optionArray = options.split("@@");
                                                            for(var l = 0 ; l < optionArray.length ; l++){
                                                                item_html += radioFrontHtml + '<input '+ radioStyle +' type="radio" name="'+disclosure_id+'name" id="'+disclosure_id+'0'+(l+1)+'" onchange="initOtherInput(this,'+otherInputId+')" /><label for="'+disclosure_id+'0'+(l+1)+'"></label>'+optionArray[l]+' ';
                                                            }
                                                            if(and_others == "true"){
                                                                item_html += radioFrontHtml + '<input '+ radioStyle +' type="radio" name="'+disclosure_id+'name" id="'+disclosure_id+'0'+(l+1)+'" onchange="initOtherInput(this,'+otherInputId+')" /><label for="'+disclosure_id+'0'+(l+1)+'"></label>'+'其他：<input '+ textStyleM +' name="'+disclosure_id+'_name" id='+radio_key+' allowSave="false" onfocus="checkOtherRadio(this,'+otherRadioId+')" onchange="checkOtherRadio(this,'+otherRadioId+')" />'+' ';
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }else{
                                            var options = childList[j].getAttribute("options");
                                            var ex_input_key = childList[j].getAttribute("radio_key");
                                            var and_others = childList[j].getAttribute("and_others");
                                            if(ex_input_key){
                                                var optionArray = options.split("@@");
                                                // if(optionArray.length==1){
                                                //  item_html += radioFrontHtml + '<input '+ radioStyle +' type="radio" name='+radio_key+'_'+disclosure_id+' id='+disclosure_id+' value="'+options+'" onchange="initOtherInput(this,'+otherInputId+')" /><label  name='+radio_key+'_'+disclosure_id+' for='+disclosure_id+'></label>'+options+' ';
                                                // }else{
                                                    for(var l = 0 ; l < optionArray.length ; l++){
                                                        item_html += radioFrontHtml + '<input '+ radioStyle +' type="radio" name="'+disclosure_id+'_name" id="'+disclosure_id+'0'+(l+1)+'" onchange="initOtherInput(this,'+otherInputId+')" /><label for="'+disclosure_id+'0'+(l+1)+'"></label>'+optionArray[l]+' ';
                                                    }
                                                // }
                                                if(and_others == "true"){
                                                    item_html += radioFrontHtml + '<input '+ radioStyle +' type="radio" name="'+disclosure_id+'_name" id="'+disclosure_id+'0'+(l+1)+'" onchange="initOtherInput(this,'+otherInputId+')" /><label for="'+disclosure_id+'0'+(l+1)+'"></label>'+'其他：<input '+ textStyleM +' name="'+disclosure_id+'_name" id='+radio_key+' allowSave="false" onfocus="checkOtherRadio(this,'+otherRadioId+')" onchange="checkOtherRadio(this,'+otherRadioId+')" />'+' ';
                                                }
                                            }
                                        }
                                        if(no_yesno != "true")
                                        {
                                            item_html+="</div>";
                                        }
                                    }
                                }
                            }
                            item_html += "</td><td "+column2Style+">";
                            if(no_yesno != "true"){
                                if("donotCheckYes" == no_yesno){//部分选项选择“是”后无需填写病历资料
                                    item_html +=  "<input type='checkbox' donotCheckYes='yes' id='"+disclosure_id+"yes' value='1' onclick='pageControlleShow(this)'" + checkboxStyle + "><label for='"+disclosure_id+"yes'></label>是<input type='checkbox' id='"+disclosure_id+"no' value='0' onclick='pageControlleShow(this)'" + checkboxStyle + " ><label for='"+disclosure_id+"no'></label>否";
                                }else{
                                    item_html+=checkboxInfo;
                                }
                            }
                            item_html+="</td></tr>";
                        }
                    }else if('checkbox_noEx' == flag){
                        if(childList != null && childList.length > 0){
                            item_html+="<tr><td "+column1Style+">";
                            for(var j = 0; j<childList.length; j++){
                                var nodeType = childList[j].nodeType;
                                if(1 == nodeType){
                                    var descriptionText = childList[j].getAttribute("text");
                                    if(descriptionText){ //lable文字
                                         item_html += descriptionText;
                                    }else{
                                        var expandChild = childList[j].childNodes;
                                        if(no_yesno != "true")
                                        {
                                            item_html+="<div "+divAttributes+" >";
                                        }
                                        if(expandChild != null && expandChild.length > 0 ){
                                            for(var k = 0; k<expandChild.length; k++){
                                                if(1 ==  expandChild[k].nodeType){
                                                    var exText = expandChild[k].getAttribute("text");
                                                    if(exText){
                                                         item_html += exText;
                                                    }else{
                                                        var radio_key = expandChild[k].getAttribute("radio_key");
                                                        var options = expandChild[k].getAttribute("options");
                                                        var ex_input_key = expandChild[k].getAttribute("radio_key");
                                                        var and_others = expandChild[k].getAttribute("and_others");
                                                        if(ex_input_key){
                                                            var optionArray = options.split("@@");
                                                            for(var l = 0 ; l < optionArray.length ; l++){
                                                                item_html += radioFrontHtml + '<input '+ radioStyle +' type="checkbox" name="'+disclosure_id+'name" id="'+disclosure_id+'0'+(l+1)+'" onchange="initOtherInput(this,'+otherInputId+')" /><label for="'+disclosure_id+'0'+(l+1)+'"></label>'+optionArray[l]+' ';
                                                            }
                                                            if(and_others == "true"){
                                                                item_html += radioFrontHtml + '<input '+ radioStyle +' type="checkbox" name="'+disclosure_id+'name" id="'+disclosure_id+'0'+(l+1)+'" onchange="initOtherInput(this,'+otherInputId+')" /><label for="'+disclosure_id+'0'+(l+1)+'"></label>'+'其他：<input '+ textStyleM +' name="'+disclosure_id+'_name" id='+radio_key+' allowSave="false" onfocus="checkOtherRadio(this,'+otherRadioId+')" onchange="checkOtherRadio(this,'+otherRadioId+')" />'+' ';
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }else{
                                            var options = childList[j].getAttribute("options");
                                            var ex_input_key = childList[j].getAttribute("radio_key");
                                            var and_others = childList[j].getAttribute("and_others");
                                            if(ex_input_key){
                                                var optionArray = options.split("@@");
                                                // if(optionArray.length==1){
                                                //  item_html += radioFrontHtml + '<input '+ radioStyle +' type="radio" name='+radio_key+'_'+disclosure_id+' id='+disclosure_id+' value="'+options+'" onchange="initOtherInput(this,'+otherInputId+')" /><label  name='+radio_key+'_'+disclosure_id+' for='+disclosure_id+'></label>'+options+' ';
                                                // }else{
                                                    for(var l = 0 ; l < optionArray.length ; l++){
                                                        item_html += radioFrontHtml + '<input '+ radioStyle +' type="checkbox" name="'+disclosure_id+'_name" id="'+disclosure_id+'0'+(l+1)+'" onchange="initOtherInput(this,'+otherInputId+')" /><label for="'+disclosure_id+'0'+(l+1)+'"></label>'+optionArray[l]+' ';
                                                    }
                                                // }
                                                if(and_others == "true"){
                                                    item_html += radioFrontHtml + '<input '+ radioStyle +' type="checkbox" name="'+disclosure_id+'_name" id="'+disclosure_id+'0'+(l+1)+'" onchange="initOtherInput(this,'+otherInputId+')" /><label for="'+disclosure_id+'0'+(l+1)+'"></label>'+'其他：<input '+ textStyleM +' name="'+disclosure_id+'_name" id='+radio_key+' allowSave="false" onfocus="checkOtherRadio(this,'+otherRadioId+')" onchange="checkOtherRadio(this,'+otherRadioId+')" />'+' ';
                                                }
                                            }
                                        }
                                        if(no_yesno != "true")
                                        {
                                            item_html+="</div>";
                                        }
                                    }
                                }
                            }
                            item_html += "</td><td "+column2Style+">";
                            if(no_yesno != "true")
                            {
                                if("donotCheckYes" == no_yesno){//部分选项选择“是”后无需填写病历资料
                                    item_html +=  "<input type='checkbox' donotCheckYes='yes' id='"+disclosure_id+"yes' value='1' onclick='pageControlleShow(this)'" + checkboxStyle + "><label for='"+disclosure_id+"yes'></label>是<input type='checkbox' id='"+disclosure_id+"no' value='0' onclick='pageControlleShow(this)'" + checkboxStyle + " ><label for='"+disclosure_id+"no'></label>否";
                                }else{
                                    item_html+=checkboxInfo;
                                }
                            }
                            item_html+="</td></tr>";
                        }
                    }else if('questionName'==flag){
                        item_html +='';
                    }else{
                        if(childList != null && childList.length > 0){
                            item_html+="<tr><td "+column1Style+">";
                            for(var j = 0; j<childList.length; j++){
                                var nodeType = childList[j].nodeType;
                                if(1 == nodeType){
                                    var descriptionText = childList[j].getAttribute("text");
                                    if(descriptionText){ //lable文字
                                        item_html += descriptionText;
                                    } 
                                }
                            }
                            item_html += "</td><td "+column2Style+">";
                            if(no_yesno != "true"){
                                if("donotCheckYes" == no_yesno){//部分选项选择“是”后无需填写病历资料
                                    item_html +=  "<input type='checkbox' donotCheckYes='yes' id='"+disclosure_id+"yes' value='1' onclick='pageControlleShow(this)'" + checkboxStyle + "><label for='"+disclosure_id+"yes'></label>是<input type='checkbox' id='"+disclosure_id+"no' value='0' onclick='pageControlleShow(this)'" + checkboxStyle + " ><label for='"+disclosure_id+"no'></label>否";
                                }else{
                                    item_html+=checkboxInfo;
                                }
                            }
                            item_html+="</td></tr>";
                        }
                    }
                    result_html+=item_html;
                }
                result_html+="</table>";
                if(questionName){
                    result_html += "</div>";
                }
                // alert(result_html);
                return result_html;
             }
        }else{
            alert("系统找不到该xml文件，请确认路径是否正确!当前路径:" + xmlUrl);
        }
}

/**
 * @功能:自定义string替换方法
 * @Author:Li Jie
 * @Date 2015-02-10
 */
String.prototype.replaceAll = function (AFindText,ARepText){
	raRegExp = new RegExp(AFindText,"g");
	return this.replace(raRegExp,ARepText);
}
/**
 * number文本框数字正则验证方法
 * @param {Object} currentInput
 * @author add by wangzj
 */
function numberChange(currentInput){
	currentInput.value = currentInput.value.replace(/[^\d]/g,'');
}
/**
 * @功能:中转点击事件
 * @Author:wucy
 * @Date 2017-06-15
 */
function tryTap(obj){
	pageControlleNotify(obj.children[0]);
}

/**
 * @功能:控制页面事件
 * @Author:Li Jie
 * @Date 2015-02-10
 */
 function pageControlleNotify(currentCheckbox){ //投被保人告知
	var currentTd = currentCheckbox.parentElement.parentElement;
	var currentTr = currentTd.parentElement;
	var currentDiv = currentTr.getElementsByTagName("div");
	var divObj = currentDiv.length > 0 ? currentDiv[0] : "";
	var yesCheckbox = currentTd.children[0].children[0];
	var noCheckbox = currentTd.children[1].children[0];
	var checkboxOfTr = currentTr.cells[0].getElementsByTagName('input');
	var textAreaOfTr = currentTr.cells[0].getElementsByTagName('textarea');
	if(currentCheckbox.value == 1){//显示自选项
		if('A_1_6_yes'==currentCheckbox.id){
			if(divObj){	
				divObj.style.display = "none";
			}
		}else{
			divObj.style.display = "block";
		}
		currentCheckbox.checked = true;
		noCheckbox.checked = false;
		// 先选是，再选否时，清空选择是时已选则的内容 ---wangzj
	}else if(currentCheckbox.value == 0 && 'checkbox_0_A0152' != currentCheckbox.id){ //隐藏自选项
		if(currentCheckbox.id=='A_1_6_no'||currentCheckbox.id=='A_3_7_no'||currentCheckbox.id=='A_3_6_no'||currentCheckbox.id=='A_4_11_no'||currentCheckbox.id=='A_6_3_no'||currentCheckbox.id=='A_7_7_no'){
			if(divObj){
				divObj.style.display = "block";
			}
		}else{
			divObj.style.display = "none";
		}
		currentCheckbox.checked = true;
		yesCheckbox.checked = false;
		for(var i=0;i<=checkboxOfTr.length;i++){
			if(checkboxOfTr[i].type == "radio"){
				checkboxOfTr[i].checked=false;
			}else if(checkboxOfTr[i].type == "text"){
				checkboxOfTr[i].value = "";
			}else if(checkboxOfTr[i].type == "checkbox"){
				checkboxOfTr[i].checked=false;
			}
		}
		if(textAreaOfTr){
			for(var j=0;j<textAreaOfTr.length;j++){
				textAreaOfTr[j].value = "";
			}
		}
	}
//	 alert('currentCheckbox.id=='+currentCheckbox.id+'currentCheckbox.name=='+currentCheckbox.name);
	// 业务员告知未亲眼见过被保险人选择否时，弹出提示框 ---wangzj
	if('checkbox_0_A0152' == currentCheckbox.id){
		myConfirm2('提示','您确定未亲眼见过被保险人吗？',function(){
			cancelMyConfirm2();
			yesCheckbox.checked = true;
			currentCheckbox.checked = false;
		},function(){
			cancelMyConfirm2();
			yesCheckbox.checked = false;
			currentCheckbox.checked = true;
		})
	}
}
function pageControlleShow(currentCheckbox){ //39个问卷
	var currentTd = currentCheckbox.parentElement;
	var currentTr = currentTd.parentElement;
	var currentDiv = currentTr.getElementsByTagName("div");
	var divObj = currentDiv.length > 0 ? currentDiv[0] : "";
	var yesCheckbox = currentTd.children[0];
	var noCheckbox = currentTd.children[2];
	var checkboxOfTr = currentTr.cells[0].getElementsByTagName('input');
	var textAreaOfTr = currentTr.cells[0].getElementsByTagName('textarea');
	if(currentCheckbox.value == 1){//显示自选项
		if('A_1_6_yes'==currentCheckbox.id||currentCheckbox.id=='A_4_8_yes'||currentCheckbox.id=='A_6_7_yes'||currentCheckbox.id=='C_9_6_yes'){
			if(divObj){
				divObj.style.display = "none";
				console.log("选择是");
				$(currentCheckbox).parent().prev().find(".text-style").val("");
				$(currentCheckbox).parent().prev().find(".checkboxStyleOfImpart").removeAttr("checked");
				$(currentCheckbox).parent().prev().find(".small_text_input").val("");
			}
		}else{
			if(divObj){
				divObj.style.display = "block";
			}			
		}
		currentCheckbox.checked = true;
		noCheckbox.checked = false;
		// 先选是，再选否时，清空选择是时已选则的内容 ---wangzj
	}
	else if(currentCheckbox.value == 0 && 'checkbox_0_A0152' != currentCheckbox.id){ //隐藏自选项
		if(currentCheckbox.id=='A_1_6_no'||currentCheckbox.id=='A_4_8_no'||currentCheckbox.id=='A_6_7_no'||currentCheckbox.id=='C_9_6_no'){
			if(divObj){
				divObj.style.display = "block";
			}
		}else{
			if(divObj){
				divObj.style.display = "none";
				console.log("选择否");
				$(currentCheckbox).parent().prev().find(".text-style").val("");
				$(currentCheckbox).parent().prev().find(".checkboxStyleOfImpart").removeAttr("checked");
				$(currentCheckbox).parent().prev().find(".small_text_input").val("");
			}
		}
		currentCheckbox.checked = true;
		yesCheckbox.checked = false;
		for(var i=0;i<=checkboxOfTr.length;i++){
			if(checkboxOfTr[i].type == "radio"){
				checkboxOfTr[i].checked=false;
			}else if(checkboxOfTr[i].type == "text"){
				checkboxOfTr[i].value = "";
			}else if(checkboxOfTr[i].type == "checkbox"){
				checkboxOfTr[i].checked=false;
			}
		}
		if(textAreaOfTr){
			for(var j=0;j<textAreaOfTr.length;j++){
				textAreaOfTr[j].value = "";
			}
		}
	}
}
/**
 * ‘其他’文本框输入时，选中‘其他’单选按钮
 * @param otherInput
 * @param otherRadioId
 * @return
 */
function checkOtherRadio(otherInput,otherRadioId){
	if(otherRadioId && otherRadioId.type == "radio"){
		if(otherInput.value){
			otherRadioId.checked = true;
			otherInput.setAttribute("allowSave","true");
		}
	}
}
/**
 * 单选按钮选中后，设置‘其他’文本框的属性
 * @param radioElement
 * @param otherInputId
 * @return
 */
function initOtherInput(radioElement,otherInputId){
	if(otherInputId && otherInputId.type == "text"){
		if(radioElement.checked){
			if(radioElement.value=="其他" || radioElement.value=="其它" || radioElement.value==""){
				otherInputId.setAttribute("allowSave","true");
			}else{
				otherInputId.setAttribute("allowSave","false");
				otherInputId.value = "";
			}
		}
	}
}
//校验优化需求  add by wangzj
function alerTip(ele){
	// alert('ele.id=='+ele.id)
	var recognizeePhone = window.localStorage.getItem('recognizeePhone');
	var recognizeeMobile = window.localStorage.getItem('recognizeeMobile');
	var applicantPhone = window.localStorage.getItem('applicantPhone');
	var applicantMobile = window.localStorage.getItem('applicantMobile');
	if(ele.id=='A0158_salesman_phone' && ele.value!='' && ele.value!=null){
		if(recognizeePhone==ele.value || recognizeeMobile==ele.value){
			myConfirm2("确认","您录入的业务员电话与被保人电话一致，请再次确认？",function(){
				ele.value='';
				cancelMyConfirm2();
				ele.blur();
			},function(){
				cancelMyConfirm2();
				ele.blur();
			});
		}
		if((applicantPhone!=recognizeePhone&&applicantPhone!=recognizeeMobile) && (applicantMobile!=recognizeePhone&&applicantMobile!=recognizeeMobile) && applicantPhone==ele.value || applicantMobile==ele.value){
			myConfirm2("确认","您录入的业务员电话与投保人电话一致，请再次确认？",function(){
				ele.value='';
				cancelMyConfirm2();
				ele.blur();
			},function(){
				cancelMyConfirm2();
				ele.blur();
			});
		}
	}
	if(ele.id=='A0501_insured_height' && ele.value && (ele.value<30 || ele.value>200)){
		myConfirm2("确认","您录入的被保险人身高为"+ele.value+"厘米，请再次确认？",function(){
			ele.value='';
			cancelMyConfirm2();
			ele.blur();
		},function(){
			cancelMyConfirm2();
			ele.blur();
		});
	}
	if(ele.id=='A0501_insured_weight' && ele.value>200){
		myConfirm2("确认","您录入的被保险人体重为"+ele.value+"公斤，请再次确认？",function(){
			ele.value='';
			cancelMyConfirm2();
			ele.blur();
		},function(){
			cancelMyConfirm2();
			ele.blur();
		});
	}
	if(ele.id=='MA0501_insured_height' && ele.value && (ele.value<30 || ele.value>200)){
		myConfirm2("确认","您录入的投保人身高为"+ele.value+"厘米，请再次确认？",function(){
			ele.value='';
			cancelMyConfirm2();
			ele.blur();
		},function(){
			cancelMyConfirm2();
			ele.blur();
		});
	}
	if(ele.id=='MA0501_insured_weight' && ele.value>200){
		myConfirm2("确认","您录入的投保人体重为"+ele.value+"公斤，请再次确认？",function(){
			ele.value='';
			cancelMyConfirm2();
			ele.blur();
		},function(){
			cancelMyConfirm2();
			ele.blur();
		});
	}
	if(ele.id=='A0523_birth_height' && ele.value && (ele.value<30 || ele.value>60)){
		myConfirm2("确认","您录入的被保险人出生时身高为"+ele.value+"厘米，请再次确认？",function(){
			ele.value='';
			cancelMyConfirm2();
			ele.blur();
		},function(){
			cancelMyConfirm2();
			ele.blur();
		});
	}
	if(ele.id=='A0523_birth_weight' && ele.value>6){
		myConfirm2("确认","您录入的被保险人出生时体重为"+ele.value+"公斤，请再次确认？",function(){
			ele.value='';
			cancelMyConfirm2();
			ele.blur();
		},function(){
			cancelMyConfirm2();
			ele.blur();
		});
	}

}

//校验优化需求  add by wangzj
function checkTextAreaLength(ele){
    var textLength = ele.value.length;
    if(textLength>150){
       myAlert("最多允许录入150字!");
       return;
    }

}

/**
 * 问题卷中，‘其他’选项选中时，设置文本框属性
 * add by wangzj
 */
function questionCheckOtherRadio(radioElement){
	var otherInput = $(radioElement).next().next();
	if(otherInput.attr("type")=="text"){
		if($(radioElement).attr("checked")){
			otherInput.removeAttr("allowSave");
			otherInput.val('');
			otherInput.attr("allowSave","true");
		}else{
			otherInput.removeAttr("allowSave");
			otherInput.attr("allowSave","false");
			otherInput.attr("value","");
		}
	}
}
/**
 * 点击问卷标题后控制相应表格的显示和隐藏
 * @param {Object} obj
 * @author wangzj
 */
function showTable(obj){
	var tableId = "table_"+obj.id.substring(2);
	var traget = document.getElementById(tableId);
	if(traget.style.display=="none"){
        traget.style.display="";
    }else{
        traget.style.display="none";
    }
}

/**
 * @功能:返回xml DOM对象
 * @param {xmlUrl:文件url路径}
 * @Author:Li Jie
 * @Date 2015-02-10
*/
function getNativeXml(xmlUrl){ 
   var xmlDoc;  
   if (window.ActiveXObject) {
        xmlDoc = new ActiveXObject('Microsoft.XMLDOM');//IE浏览器
        xmlDoc.async = false;
        xmlDoc.load(xmlUrl);
    }
    else if (isFirefox=navigator.userAgent.indexOf("Firefox")>0) { //火狐浏览器 
        xmlDoc = document.implementation.createDocument('', '', null);
        xmlDoc.load(xmlUrl);
    }
    else{ //谷歌浏览器
           var xmlhttp = new window.XMLHttpRequest();  
            xmlhttp.open("GET",xmlUrl,false);  
            xmlhttp.send(null);  
            xmlDoc = xmlhttp.responseXML;  
        }  
	return xmlDoc;
}