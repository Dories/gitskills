
angular.module('starter.controllers', [])
/**
 *主页面
 * add by genglan
 * 2015-1-24
 */
	.controller('MainCtrl', function($scope,$state,$rootScope) {
		/*$scope.isSubmit  = false; // 默认未提交
		//菜单切换
		$scope.clickMenu = function (checked){
			if(checked){
				$scope.isSubmit  = true;
				$state.go('menu.submit');
			}else{
				$scope.isSubmit  = false;
				$state.go('menu.list');
			}
		}*/
		//开放湖南陕西
		$scope.questionShow=false;

		// if(organCode.substr(0,4) == '8661'||organCode.substr(0,4)=="8643"){
		// 	$scope.questionShow=true;
		// }

		$scope.isSubmit = 'N'; // 默认未提交
		//菜单切换
		$scope.clickMenu = function (type){
			$scope.isSubmit  = type;
			if('Y' == type){
				$state.go('menu.submit');
			}else if('N' == type){
				$state.go('menu.list');
			}else if('H' == type){
				$state.go('menu.receipt');
			}else{
				$state.go('menu.question');
			}
		}
		//退出应用
		$scope.gohomeFun = function (){
			closeWebView("",function (){
				console.log('应用退出成功！');
			},function (){
				console.log('应用退出失败！');
			});
		}
	})
	/*回执列表  add by xuyanan*/
	.controller('ReceiptCtrl',function($http,$scope,$rootScope,$state,$ionicPopup,$timeout,CommonFn,submitInsurance,Variables){
		//alert('new');
		//滚动到底部自动加载数据
		$scope.sousuo = brows().iphone ? 64:44;
		$scope.currentTab = 'templates/sign_list.html';
		$scope.isAlready = false;
		//查询保单列表
		var sendUrl = API_URL + "/app/apply/queryReceiptList";
		var json = {"url":sendUrl, "parameters": {"applyNo": ''}};
		var dataLength = 0;
		$scope.loadReceiptList = function(json) {
			CommonFn.alertPopupFun($ionicPopup,'loading','加载中！...',0);
			httpRequestByPost(json, function (data) {
				Variables.alertPopup.close();
				var jsonObj = eval("("+data+")");
				if(0 == jsonObj.status.code){
				    $scope.insuranceList = jsonObj.jsonMap.list;
				}else{
				   CommonFn.alertPopupFun($ionicPopup,'loser',jsonObj.status.msg,3000);
				}  
			},function() {
				//alert('请求出错4');
				$timeout(function(){
					if(dataLength == 0){
						Variables.alertPopup.close();
						CommonFn.alertPopupFun($ionicPopup,'loser',"暂无网络请在有网的状态下进行操作!",1000);
					} 
			    },10000); 
			});
		}
		$scope.loadReceiptList(json);
		// 电子回执搜索功能后台暂时没有开发
		// $scope.autocompleteFn = function (){
		// 	var autocompleteValue = document.getElementById("autocomplete").value;
		// 	var sendUrl = API_URL + "/app/apply/receiptQuery";
		// 	var json = {"url":sendUrl, "parameters": {"applyNo": autocompleteValue}};
		// 	$scope.loadReceiptList(json);
		// }
       
		$scope.clickReceipt = function (index, 	applicantMobile, agentCode, issueTime, contNo, applyNo){
			$rootScope.selectedRow = index;
			var param_date={
					'applicantMobile':applicantMobile,
					'agentCode':agentCode,
					'issueTime':issueTime,
					'contNo':contNo,
					'applyNo':applyNo
				}
			var pctype = document.getElementById("pctype").value;
			if(pctype == '' || pctype == 'pad'){			
				$state.go('menu.receipt.duanxin',param_date);
			}else{	
				$state.go('duanxin',param_date);
			}
		}
	})
	//跳转到短信
	.controller('DuanPass',function($scope,$state,$stateParams){
		$scope.iphoneTop = brows().iphone ? 30:10;
		$scope.applicantMobile = $stateParams.applicantMobile;
		isPassSign = false; 
		$scope.closeData=function(){
			$state.go('menu.receipt');
		}
		/*发送手机验证码*/ 
		$scope.sendSms = function (){
			indexHour = 180;
			var mobile = document.getElementById("mobile").value; 
			//var mobile = '18301703156'; 
			if(!mobile){
			 	myAlert("请输入手机号码!");
			}else{
			 	var sendUrl = API_URL + "/app/apply/getAuthCode";
				var json = {"url":sendUrl, "parameters": {"phone": mobile}};
				httpRequestByPost(json, function (data) {
					var jsonObj = eval("("+data+")");
					if(jsonObj){
						var code = jsonObj["status"].code;
						if('0' == code){ //短信发送成功 
							whileThridHoursHuizhi(); //3分钟倒计时控制
						}else{
							myAlert('操作过快，请稍后再试');
						}
					}
				});
			}
		};
		$scope.checkSMS=function(){
		    var mobile = document.getElementById("mobile").value; 
			//var mobile = '18301703156'; 
			var smsCode = document.getElementById("smsCode").value;
			var validateFalg = true;
			if(!mobile || !smsCode){
				myAlert("请输入手机号码或短信验证码!");
			}else{
				pageSignCtrlTime = 900;
	 		    document.getElementById("smsCode").value ="";
				var sendUrl = API_URL + "/app/apply/checkAuthCode";
				var json = {"url":sendUrl, "parameters": {"phone": mobile,"authCode":smsCode}};
				var pctype = document.getElementById("pctype").value;
				// 验证验证码
				httpRequestByPost(json, function (data) {
					var jsonObj = eval("("+data+")");
					if(jsonObj){
						var code = jsonObj["status"].code;
						$scope.$apply(function (){
			           	 	if('0' == code){//验证成功
			           	 	 	isPassSign = true;
			           	 	 	indexHour = 0;
								if(pctype == '' || pctype == 'pad'){
									$state.go('menu.receipt.huizhi',$stateParams);
								}else{
									$state.go('huizhi',$stateParams);
								}
							}else{ //验证失败 
								 myAlert("短信验证码输入有误,请重新输入!");
								isPassSign = false;								
							}
			           	});
					}
				});
			}
		}
	})
	// 跳转到保险合同回执
	.controller('HuiZhi',function($scope,$state,$stateParams,$timeout,$ionicPopup,$http,CommonFn,Variables){
		$scope.sign_data = formatDate(new Date(),'yyyy-MM-dd');
		var org_statement = document.getElementById('org_statement');
		// 广东：8644 厦门：8690 山东：8637
		var org = ($stateParams.agentCode).substring(0,4);
		if (org == '8644') {
			$scope.org_statement = '<p>为确保您的权益，请及时拨打本公司服务电话、登录网站或到柜面进行查询，核实保单信息。\<\/p\>'
			$scope.org_statement+= '<p>全国统一客户服务专线：95596</p>'
			$scope.org_statement+= '<p>公司网站：www.minshenglife.com</p>'
			$scope.org_statement+= '<p>地址：广东省广州市天河区珠江新城华夏路49号津滨腾越大厦北塔22层</p>';
			angular.element(org_statement).html($scope.org_statement);
		}else if (org == '8690') {
			$scope.org_statement = '特别提示：保险合同中包含消费者权益告知书，请您查看。';
			angular.element(org_statement).html($scope.org_statement);
		}else if (org == '8637') {
			$scope.org_statement = ''
			$scope.org_statement+= '<p>为保护您的合法权益，请通过拔打本公司服务电话、登陆网站或咨询本公司柜面服务人员等方式，查询、核对您的保单信息（对保险期限一年期以上的寿险保单，建议在收到本保单之日起10日内完成首次查询）。</p>'
			$scope.org_statement+= '<p>全国统一客户服务专线：95596</p>'
			$scope.org_statement+= '<p>公司网站：www.minshenglife.com</p>'
			$scope.org_statement+= '<p>地址：山东省济南市历下区历山路157号</p>';
			angular.element(org_statement).html($scope.org_statement);
		}
		var issueTime = $stateParams.issueTime;
		//alert('issueTime==='+issueTime)
		function out_day_count(issueTime){
		    var out_day = 0;
		    if(null!=issueTime&&""!=issueTime&&" "!=issueTime){
		        var myDate = new Date();
		      	var s = myDate.getTime()-issueTime;
		      	out_day = s/1000/60/60/24;
		      	out_day = out_day.toString();
		    }
		    return out_day.split('.')[0];
		} 
		var out_day = out_day_count(issueTime);
		if (out_day > 7) {
			$scope.out_data = true;
		}
		$scope.rsCode = '';
		$scope.reasonCode = function(reasonCode){
			$scope.rsCode = reasonCode;
		}
		//电子签名中所有图片{投保人照片和签名、[投保人照片和签名、被保人照片和签名]、抄录声明照片}
		var signInsurnoticeList = new Array();
		// var signApplyList = new Array();
		$scope.signApplyList = new Array();
		/*电子签名插件*/
		$scope.signMarkFn = function(tableID,contentID){
			//当前的保单ID
			var currentInsuranceId = $stateParams.applyNo;
			var json = {"tableID":tableID,"applyID":currentInsuranceId,"ContentID":contentID}; 
			//alert("签名。json.applyID:"+currentInsuranceId+contentID);
			doSignature(json,function(str){
			  //重置高度
			document.getElementById("content-2").style.height ="100%"; 
			 //重置高度
			 //document.getElementById("content-3").style.height ="100%"; 
				if(str){
			  		var signObj = eval("("+str+")");
			  		if(signObj){
  			    		document.getElementById("regin_button").style.display ="none";//按钮隐藏显示图片
		  			    document.getElementById("two_recgin_photo").style.display ="";
		  			    document.getElementById("two_resign_photo").style.display ="";
		  			    		
		  				var photoPath = signObj["photoPath"]+"?"+Math.random();
		  				var signaturePath = signObj["signaturePath"]+"?"+Math.random();
		  				
		  				document.getElementById("two_recgin_photo").src =photoPath;
		  				document.getElementById("two_resign_photo").src =signaturePath; 
		  				
						signMap["3_23_people_photo"] = signObj["photoPath"]; //被保人相片url
		  				signMap["3_23_sign_photo"]  = signObj["signaturePath"];//被保人签名的URL

		  				$scope.signApplyList.push(signObj["photoPath"]);
		  				$scope.signApplyList.push(signObj["signaturePath"]); 
			  		}
			  	}
			},function(){ 
				myAlert("失败");
			});  
		}
		$scope.sign_submit = function(){
			//提交回执数据
			var regin_button = document.getElementById("regin_button").style.display;
			if(regin_button!='none'){
				CommonFn.alertPopupFun($ionicPopup,'loser','请完成电子签名！',3000);
				return;
			}
			var sendUrl = API_URL + "/app/apply/receipt";	
			var json = {"url":sendUrl, "parameters": {
				"signApplyList": $scope.signApplyList.join(","),
				"contNo": $stateParams.contNo,
				"policySignTime": $scope.sign_data,
				"reasonCode": $scope.rsCode
			}};
			$scope.sign_submit_http = function(json) {
				var signApplyList = $scope.signApplyList;
				getEncFile_receipt(function(data){
					if(data){
						var returnEncFileJson=eval("("+data+")");
						//电子签名中图片URL和加密包的字符串参数
						var signApplyParameter = signApplyList.join(",");
						signApplyParameter = signApplyParameter + "," + returnEncFileJson["receiptEncodePath"];
						//将电子签名中的图片URL存入提交保单的参数中
						json["parameters"]["signApplyList"] = signApplyParameter;					
					}
				},function(error){
					if(error===null){
						myAlert("电子签名未填写完整！");
					}else{
						// myAlert("getEncFile插件错误信息："+error);
						myAlert("插件调用失败，请重新尝试。若多次尝试后仍然如此，请联系相关人员处理！");
					}
				});
				setTimeout(
					function(){
						loadingWait();
						//alert("json-->>"+JSON.stringify(json));
						httpRequestByPost(json, function (data) {
							closeLoadingWait();
							var jsonObj = eval("("+data+")");
							//alert('jsonObj====='+jsonObj.status.code);
							if(0 == jsonObj.status.code){							
					    		$scope.insuranceList = jsonObj.jsonMap.list;
					    		//CommonFn.alertPopupFun($ionicPopup,'charging','回执单提交成功',3000);
								myAlert('回执单提交成功');
								$state.go('menu.receipt');
							}else{
					   			CommonFn.alertPopupFun($ionicPopup,'loser',jsonObj.status.msg,3000);
							}
					},function() {
						$timeout(function(){
							if(dataLength == 0){							
								CommonFn.alertPopupFun($ionicPopup,'loser',"暂无网络请在有网的状态下进行操作!",1000);
							}
					    },10000);
					});

				},500);
			}
			$scope.sign_submit_http(json);
		}
		$scope.closeData=function(){
			$state.go('menu.receipt',$stateParams);
		}
	})
/******************************************未提交保单  add by genglan 2015-1-24*********************************************/
	.controller('MenuCtrl', function($scope,$rootScope,$state,$ionicPopup,unFinshedInsurance,CommonFn,Variables,$timeout) {
		$rootScope.enableSlide1=true;//问题件列表pad端增加遮罩层，初始化侧边栏可滑is-enable为true
		CommonFn.alertPopupFun($ionicPopup,'loading','加载中！...',0);
		$scope.sousuo = brows().iphone ? 64:44;
		//查询未提交保单列表
		$scope.loadunFinshedList = function (searchVal){
			unFinshedInsurance.loadUnFinshedInsurance({
				searchVal:searchVal,
				ID:'',
				callBackFun :function (data){
					$scope.$apply(function (){
						if(null != Variables.alertPopup){
							Variables.alertPopup.close();
						}
						$scope.unFinshedList = data;
						console.log('unFinshedList+'+data);
					})
				}
			});
		};   
		//默认的加载未提交的保单信息
		$timeout(function(){
			$scope.loadunFinshedList("");
			/*unFinshedInsurance.loadUnFinshedInsurance({
				searchVal:'false',
				ID:'',
				callBackFun :function (data){ 
					$scope.loadunFinshedList('');
					if(null != Variables.alertPopup){
							Variables.alertPopup.close();
					}
					$scope.unFinshedList = data;
					console.log('unFinshedList+'+data);
				}
			}); */
	     },1000); 
		$rootScope.selectedRow = '-1';
		//点击列表
		$scope.clickMenu = function (item){
			$rootScope.selectedRow = item.ID;
			c_apply_id = item.ID;
			c_proposal_id = item.PROPOSAL_ID;
			var pctype = document.getElementById("pctype").value;
			if(pctype == '' || pctype == 'pad'){
				$state.go('menu.list.data_view',{'insuranceID':item.ID,'proposalID':item.PROPOSAL_ID,'applicantID':item.APPLICANT_ID,'recognizeeID':item.INSURANT_ID,"isreleated":item.IS_RELEATED});
			}else{
				$state.go('data_view',{'insuranceID':item.ID,'proposalID':item.PROPOSAL_ID,'applicantID':item.APPLICANT_ID,'recognizeeID':item.INSURANT_ID,"isreleated":item.IS_RELEATED});
			}
		}
		//清除搜索框里span的搜索两字
		$scope.InsuranceOnlineCtrlModule = {		   
		    keyWord: ''		    
		};
		//未提交保单搜索
		$scope.autocompleteFn = function (){			
			var autocompleteValue = document.getElementById("autocomplete").value;		
			$scope.loadunFinshedList(autocompleteValue);
		}
		//添加保单 先跳转到建议书，选择建议书，选择完后跳转到 制作建议书的第一步
		$scope.addInsurance = function (){
			var url = "promodel/"+Variables.recommendAppId+"/www/index.html#/menu/list/Y?isonlineFlag=true&pctype="+document.getElementById("pctype").value+"&agentCode="+Variables.currentCode;
			var jsonKey ={
				"serviceType":"LOCAL",
				"URL": url
			};
			pushToViewController(jsonKey, function (){
				console.log("选择建议书！");
			},function (){
				console.log("选择建议书")
			});

			//$state.go('insure_needknow')
		}
	})
/**
 *数据展示
 * add by genglan
 * 2015-1-24
 */
	.controller('DataCtrl', function($scope,$state,$stateParams,$rootScope,$ionicActionSheet,$ionicPopup,$ionicModal,unFinshedInsurance,Variables,CommonFn) {
		var insuranceID = $stateParams.insuranceID; //选择的保单ID
		var proposalID = $stateParams.proposalID; //建议书ID
		var applicantID = $stateParams.applicantID; //投保人
		var recognizeeID = $stateParams.recognizeeID; //建议书ID
		var isreleated = $stateParams.isreleated;
		//点击关闭按钮
		$scope.closeData = function (){
			$rootScope.selectedRow = '-1';
			$state.go('menu.list');
		}
		//查询投保人信息
		unFinshedInsurance.loadCustomer({
			applyID:insuranceID,
			applicantID:applicantID,
			callBackFun:function (data){
				/*$scope.applicant = data[0];
				 console.log(data[0])*/
				var prosalJson = eval('('+data[0].PROSAL_JSON+')');
				
				$scope.$apply(function (){
					prosalJson.applicantSex  =  prosalJson.applicantSex == '0' ? '男' : '女';
					prosalJson.recognizeeSex = prosalJson.recognizeeSex == '0' ? '男' : '女';

					$scope.applicant = prosalJson; 
					$scope.productsTitle = prosalJson.CONTENT.insureProductsMap.tableTitleList;
					$scope.productsData = prosalJson.CONTENT.insureProductsMap.tableDataList; 
					if(isreleated == '03' || isreleated == 'Y'){
						for(var c = 0; c < $scope.productsData.length; c++){
							if($scope.productsData[c][0] == '114403'){
								$scope.productsData.splice(c,1);
							}
						}
					}else if(isreleated == '05'){
						for(var x = 0; x < $scope.productsData.length; x++){
							if($scope.productsData[x][0] == '114403'){
								$scope.productsData.splice(0,x);
								$scope.productsData.splice(1,$scope.productsData.length-1);
							}
						}
					}
					allIsuresArray = $scope.productsData;
				}) 
				

				if($scope.productsData && $scope.productsData.length > 0){
					mianIsureId = $scope.productsData[0][0]; 
					for(var i = 1; i < $scope.productsData.length ; i++){
						code += $scope.productsData[i][0]+',';

					}
				}
				//add   2016.9.27  wuwei
				window.localStorage.setItem("applynum",$scope.productsData[0][3]);
				$scope.proType = function(item, index){
					if(index == 0){
						return '主险名称';	
					}
					return '附加险名称'+index;
				};

			}
		});
		//查询被保人信息
		/*unFinshedInsurance.loadCustomer({
		 applyID:insuranceID,
		 recognizeeID:recognizeeID,
		 callBackFun:function (data){
		 $scope.recognizee = data[0];
		 }
		 });*/
		//查询当前保单险种信息
		/*unFinshedInsurance.loadProductByID({
		 proposalID:proposalID,
		 callBackFun:function (data){
		 $scope.productList = data;
		 }
		 });*/
		//删除未提交的保单
		$scope.deleteData = function (){
			var jsonDataArr = [
				{
					"databaseName": Variables.dataBaseName,
					"tableName": "T_PROPOSAL_PRODUCT",
					"conditions": [{
						"PROPOSAL_ID": proposalID
					}]
				},
				{
					"databaseName": Variables.dataBaseName,
					"tableName": "T_PROPOSAL",
					"conditions": [{
						"ID": proposalID
					}]
				},
				{
					"databaseName": Variables.dataBaseName,
					"tableName": "T_CUSTOMER",
					"conditions": [{
						"APPLY_ID": insuranceID
					}]
				},
				{
					"databaseName": Variables.dataBaseName,
					"tableName": "T_APPLY",
					"conditions": [{
						"ID": insuranceID
					}]
				}
			]
			var hideSheet = $ionicActionSheet.show({
				titleText:'是否删除保单',
				destructiveText: '确定',
				cancelText: '取消',
				cancel: function() {},
				destructiveButtonClicked: function(){
					hideSheet();
					unFinshedInsurance.deleteInsurance({
						jsonDataArr:jsonDataArr,
						callBackFun:function (data){
							if(1 == data){
								if(DEVICE_TYPE == 'phone'){
									CommonFn.alertPopupFun($ionicPopup,'charging','删除成功！...',1500);
									$state.go('menu.list');
								}else{
									//pad版从此处走，修改日期2016.3.8
									CommonFn.deleteArray({
										array:$scope.unFinshedList,
										deleteID:insuranceID,
										callBackFun:function (data){
											CommonFn.alertPopupFun($ionicPopup,'charging','删除成功！...',1500);
											$state.go('menu.list');	
										}
									})
								}
							}else{
								CommonFn.alertPopupFun($ionicPopup,'loser','删除失败！...',1500);
							}
						}
					})
				}
			});
		}
		$ionicModal.fromTemplateUrl('templates/insurance_type_info.html', {
			scope: $scope,isureWindow : false
		}).then(function(modal) {
			$scope.modal = modal;
		});
		//查看险种详细信息
		$scope.showInsuranceInfo = function (i){
			$scope.productInfo = $scope.productsData[i];
			var items = new Array();
			for(var k = 0 ; k < $scope.productsTitle.length ; k++){
				var obj = new Object();
				obj.NAME = $scope.productsTitle[k];
				for(var j = 0 ; j < $scope.productInfo.length ; j ++){
					if( j == k ){
						obj.ITEM = $scope.productInfo[j];
					}
				}
				items.push(obj);
			}
			//修改‘交费期间’与‘交费方式’数据颠倒的问题
			var item6 = items[5];
			var item7 = items[6];
			var item0 = items[0];
			var tempItem = (item6.ITEM == "12") ? "年交" : "一次交清";
			if(item0.ITEM == "121716" || item0.ITEM == "121717" || item0.ITEM == "121718" || item0.ITEM == "121719" || item0.ITEM == "111808"){
				tempItem = "趸交";
			}
			item6.ITEM = item7.ITEM;
			item7.ITEM = tempItem;
			
			$scope.productInfoitem = items;
			$scope.modal.show();
		}
		$scope.closeModal = function (){
			$scope.modal.hide();
		}
		$scope.$on('$destroy', function() {
		    $scope.modal.remove();
		});
		//编辑未提交的保单、提交保单
		$scope.editData = function (){
			//alert("insuranceID:" + insuranceID)
			$state.go('insure_needknow',{'applyid':insuranceID,"isreleated":isreleated});//
			//alert(applicantID,recognizeeID);
		}
	})
/******************************************已提交保单列表 add by genglan 2015-1-24*********************************************/
	.controller('InsuranceCtrl', function($scope,$rootScope,$state,$stateParams,$ionicPopup,$ionicActionSheet,Variables,CommonFn,submitInsurance,unFinshedInsurance,$timeout) {
		$rootScope.enableSlide1=true;//问题件列表pad端增加遮罩层，初始化侧边栏可滑is-enable为true
		CommonFn.alertPopupFun($ionicPopup,'loading','加载中！...',0);
		$scope.tabs = brows().iphone ? 64:44;
		$scope.mtop = brows().iphone ? 108:88;
		$scope.currentTab = 'templates/insurance_list.html';
		$scope.isAlready = false;
		$scope.pageNo = 1;
		$scope.noMore = false;
		$scope.totalpage = 9999999;
		$scope.insuranceList=[];
		var pctype = document.getElementById("pctype").value;
		//查询保单列表
		$scope.getData = function(state,searchVal,applyDate,pageNo){
				var dataLength = 0;
				submitInsurance.loadFinishedInsurance({
					state:state,
					searchVal:searchVal,
					applyDate:applyDate,
					pageNo:pageNo,//页数
					callBackFun:function (data){						
						dataLength = 1;
						$scope.$apply(function (){
							if(null != Variables.alertPopup){
								Variables.alertPopup.close();
							}
							$scope.totalpage=data.jsonMap.totalpage;  //获取总页数
							//当未承保和已承保都是第一页时，清空值重新加载赋值
							if(($scope.pageNo==1 && $scope.isAlready==true) || ($scope.pageNo==1 && $scope.isAlready==false)){
								$scope.insuranceList=[];
							}
							//当页数为一，让上滑运动作加载更多可执行
							if($scope.pageNo == 1){
					          $scope.noMore = false;
					        }
					        //当没有数据时，上滑加载更多动作停止，并且清空值  
							if(data.jsonMap.list.length == 0){ 
					            $scope.noMore = true;
					            $scope.insuranceList=[];
					          }else{
					            $scope.noMore = false;
								$scope.insuranceList=$scope.insuranceList.concat(data.jsonMap.list);	
							}
							baseList=$scope.insuranceList;//保单详情赋值
							$scope.pageNo++;											
						})//括号
						$scope.$broadcast('scroll.infiniteScrollComplete');	//停止广播					
					}
					
				});
				$timeout(function(){
					if(dataLength == 0){
						Variables.alertPopup.close();
						CommonFn.alertPopupFun($ionicPopup,'loser',"暂无网络请在有网的状态下进行操作!",3000);
					} 
			    },30000);
		}
		//上滑加载更多
		$scope.loadMore = function(){
			if($scope.pageNo<=$scope.totalpage && $scope.pageNo>0){
				$scope.noMore=false;
				var autocompleteValue = document.getElementById("autocomplete").value;
				var applyDate = document.getElementById("applyDate").value;
                //CommonFn.alertPopupFun($ionicPopup,'loading','加载中！...',0);
				$scope.getData($scope.isAlready?1:0,autocompleteValue,applyDate,$scope.pageNo);
			}else{
				$scope.noMore=true;				
				$scope.$broadcast('scroll.infiniteScrollComplete'); //停止广播
			}		
		}
		//下拉刷新
		$scope.doRefresh = function(){	
			$scope.insuranceList=[];
			$scope.pageNo=1;			
			var autocompleteValue = document.getElementById("autocomplete").value;
            var applyDate = document.getElementById("applyDate").value;
			CommonFn.alertPopupFun($ionicPopup,'loading','加载中！...',0);
			$scope.getData($scope.isAlready?1:0,autocompleteValue,applyDate,1);
			$scope.$broadcast('scroll.refreshComplete');  //停止广播
		}

		//tab切换
		$scope.onClickTab = function (state){
			//pad版在切换左侧tab页时，关闭右侧详情页
			if(pctype == '' || pctype == 'pad'){
				$state.go('menu.submit');
			}
			document.getElementById('autocomplete').value = '';
            document.getElementById('applyDate').value = '';
			$rootScope.selectedRow = '-1';
			$scope.isAlready = state == '1'?true:false ;
			CommonFn.alertPopupFun($ionicPopup,'loading','加载中！...',0);
			$scope.pageNo=1;
			$scope.getData(state,'','',1);
		}
		//清除搜索框里span的搜索两字
	 	$scope.InsuranceOnlineSubmitCtrlModule = {		   
	      keyWord: ''		    
	    };

		//add  搜索  renxiaomin 2016.10.14--------------------------begin
	 //    $scope.getautocompleteFnData = function(state,searchVal,pageNo){	
		// 	$scope.noMore=false;	
		// 	var dataLength = 0;		
		// 	submitInsurance.loadFinishedInsurance({
		// 		state:state,
		// 		searchVal:searchVal,
		// 		pageNo:pageNo,//页数
		// 		callBackFun:function (data){
		// 			$scope.insuranceList=[];
		// 			Variables.alertPopup.close();					
		// 			dataLength = 1;
		// 			$scope.$apply(function (){							
		// 				$scope.insuranceList=data.jsonMap.list;	
		// 				baseList=$scope.insuranceList;//保单详情赋值															
		// 			});	
		// 			$scope.$broadcast('scroll.infiniteScrollComplete');							
		// 		}			
		// 	});
		// 	$timeout(function(){
		// 		if(dataLength == 0){
		// 			Variables.alertPopup.close();
		// 			CommonFn.alertPopupFun($ionicPopup,'loser',"暂无网络请在有网的状态下进行操作!",3000);
		// 		} 
		//     },30000);
		// }
		
		// //搜索按钮
		$scope.autocompleteFn = function (){
			var autocompleteValue = document.getElementById("autocomplete").value;
            var applyDate = document.getElementById("applyDate").value;
			$scope.pageNo = 1;
            $scope.insuranceList = [];
			CommonFn.alertPopupFun($ionicPopup,'loading','加载中！...',0);
            $scope.getData($scope.isAlready?1:0,autocompleteValue,applyDate,$scope.pageNo);
			//$scope.getautocompleteFnData($scope.isAlready?1:0,autocompleteValue,1);
			$scope.$broadcast('scroll.refreshComplete');
		}
		//选择日期
		$scope.selectDateFn = function () {
            if (!$.fn.calenderFun) {
                return
            }
            //获取当前时间的年份
            var date = new Date();
            var yearNow = parseInt(date.getFullYear());
            $.fn.calenderFun({
                'minYear': '2001',
                'maxYear': yearNow,
                'dateFormat': 'yyyy-mm-dd',
                'callBackFun': function (data) {
                	document.getElementById('applyDate').value = data;
                }
            })
        }
		//------------------------------------------------------end

		$rootScope.selectedRow = '-1';
		$scope.clickInsurance = function (index){
			$rootScope.selectedRow = index;			
			if(pctype == '' || pctype == 'pad'){
				$state.go('menu.submit.insurance_outline',{'indexNo':index});
//				$state.go('menu.submit.insurance_outline',{'indexNo':index});
			}else{//手机版的此后页面全部横屏  
				$state.go('insurance_outline',{'indexNo':index});
			}
		}
		//默认显示列表中第一个保单概要
		/*$timeout(function(){
			$scope.clickInsurance(0);
		},2000);*/
	})
/**
 *已提交保单数据展示
 * add by genglan
 * 2015-1-24
 */
.controller('InsuranceDataCtrl', function($scope,$rootScope,$state,$stateParams,$ionicModal,$ionicPopup,Variables,CommonFn,submitInsurance,initData,$ionicActionSheet){
		//CommonFn.alertPopupFun($ionicPopup,'loading','加载中！...',0);
		// var organCode='';
  //   	organCode = window.localStorage.getItem('organCode');
    	var organ=organCode.substr(0,4);
		$scope.isrelationPc = false;
		$scope.isrelationPh = false;
		var indexNo = $stateParams.indexNo;  
		if(typeof($scope.insuranceList) == 'undefined'){
			$scope.baseInfo = baseList[indexNo];
		}else{
			if(typeof($scope.insuranceList) != 'undefined' && $scope.insuranceList.length > 0){
				$scope.baseInfo = $scope.insuranceList[indexNo];//保单基本信息
			}
		}
		var rel_applyNo = $scope.baseInfo.rel_applyNo;//开门红关联保单号
		//开门红年金关联万能 如果有其中一单为非待交费状态，交费按钮置灰
		var printNo = $scope.baseInfo.printNo;
		var pctype = document.getElementById("pctype").value;
		if(pctype == 'phone'){
			$scope.pcType = false;
		}else{
			$scope.pcType = true;
		}
		/*
		submitInsurance.loadInsuranceByID({
			printNo:printNo,
			callBackFun:function (data){
				$scope.$apply(function (){
					$scope.applicant = data.applicant;//投保人
					$scope.insurant = data.insuredList[0].insurant;//被保人
					$scope.beneficiaryList = data.insuredList[0].beneficiaryList;//受益人
					$scope.insuranceList = data.insuredList[0].insuranceList//投保事项
					
					if(null != Variables.alertPopup){
						Variables.alertPopup.close();
					}
				});
			}
		});*/
		// $scope.underClickTab = function(i){
		// 	if(i == '1'){
		// 		$scope.isAlready = false;
		// 		$scope.onlineCharge = false;
		// 	}else{
		// 		$scope.onlineCharge = true;
		// 		$scope.isAlready = true;
		// 	}
		// }
		// $scope.offLineCharge = function(){
		// 	CommonFn.alertPopupFun($ionicPopup,'charging','已申请进行线下划账扣费，请保证账户余额充足。查询扣费结果请点击“查询收费状态”按钮”',2000);
		// }
		//点击关闭按钮
		$scope.closeData = function (){
			$rootScope.selectedRow = '-1';
			if(pctype == '' || pctype == 'pad'){//手机版关闭后恢复竖屏
				setScreenPortrait('',function (){
					console.log("竖屏成功！");
				},function (){
					console.log("竖屏失败！")
				})
			}
			$state.go('menu.submit');
		}
		//收费
		$ionicModal.fromTemplateUrl('templates/charge_modal.html', {
			scope: $scope,isureWindow : false
		}).then(function(modal) {
			$scope.chargeModal = modal;
		});
		//其他缴费方式
		$ionicModal.fromTemplateUrl('templates/other_way_charge.html', {
			scope: $scope,isureWindow : false
		}).then(function(modal) {
			$scope.otherModal = modal;
		});
		//关闭收费
		$scope.closeChargeModal = function (){
			$scope.chargeModal.hide();
		}
		//当我们用到模型时，清除它！
		$scope.$on('$destroy', function() {
		    $scope.chargeModal.remove();
		});

		//关闭其他收费
		$scope.closeOtherModal = function (){
            //$("#selectbank").removeAttr("selected");
            $scope.otherModal.hide();
		}
		//当我们用到模型时，清除它！
		$scope.$on('$destroy', function() {
		    $scope.otherModal.remove();
		})
		//弹出收费的modal
		$scope.showCharge =function (){
			//加载银行卡数据
			initData.loadBanks(function(){
				$scope.bankInfoList=Variables.bankJson;

				//查询当前保单状态
				submitInsurance.loadInsuranceState({
					printNo:printNo,
					callBackFun:function (data){
						$scope.state = data.state;
						//两单都为待交费时才会展示关联保单信息
						if(pctype == '' || pctype == 'pad'){
							if($scope.baseInfo.relationFlag == "Y" && $scope.state == '0'&& $scope.baseInfo.rel_state == '0'){
								$scope.isrelationPc = true;
							}
						}else{
							if($scope.baseInfo.relationFlag == "Y" && $scope.state == '0'&& $scope.baseInfo.rel_state == '0'){
								$scope.isrelationPh = true;
							}
						}
										
						$scope.chargeModal.show();
					}
				});
			});
		}
		//续期缴费时，是否使用本银行卡？
		$scope.activted = true;
		$scope.checkedRadio = function (){
			if($scope.activted){
				$scope.activted = false;
			}else{
				$scope.activted = true;
			}
		}
		//收费
		$scope.chargeFun = function (item,bankphones){
//			CommonFn.alertPopupFun($ionicPopup,'loading','加载中！...',0);
			loadingWait();
			var isCallbackFlag = false;
			var bankPro = replaceNull2(item.bankProvince);
			var bankCit = replaceNull2(item.bankCity);
			var bankSubT = replaceNull2(item.bankSubType);
			var bankPhone = replaceNull2(bankphones);//银行预留手机号
			var relApplyNo = replaceNull2(item.rel_applyNo);
			if($scope.baseInfo.rel_state!='0'){
				relApplyNo = '';
			}
			//alert("isCallbackFlag1:"+isCallbackFlag);
			submitInsurance.chargeFun({
				printNo:item.printNo,
				bankCode:item.bankCode,
				bankAccNo:item.bankAccNo,
				bankProvince:bankPro,
				bankCity:bankCit,
                bankSubType:bankSubT,
                bankPhone : bankPhone,
               // payInterfaceFlag : payInterfaceFlag, //金联万家标识
                rel_applyNo:relApplyNo,
				callBackFun:function (data){
					var isCallbackFlag = true;
					closeLoadingWait();
//					alert("isCallbackFlag2:"+isCallbackFlag);
//					if(null != Variables.alertPopup){
//						Variables.alertPopup.close();
//					}
					//alert("data.code:"+data.code);
					if(0 == data.code){
						CommonFn.alertPopupFun($ionicPopup,'charging','收费成功！',2000);
						//myAlert("收费成功！");
					}else{
						//alert("收费失败！+data.msg");			
						var ionicAlert = $ionicPopup.alert({
							title: '提示',
							okText:'确定',
							okType: 'myokbutton',
				            template: '<div class="pop_up_box1"><span class="loser"></span>'+data.msg+'</div>',
				        });
						setTimeout(function (){
				                if(null != ionicAlert){
				                    ionicAlert.close(); 
				                } 
			            },5000);								       

					}//else的括号
				}
			});
			var milliSecond = getMilliSecondOfTimeout("queryStatus");
			$timeout(function(){
				if(isCallbackFlag == false){
					//隐藏加载提示框
					closeLoadingWait();
					CommonFn.alertPopupFun($ionicPopup,'loser','请求超时！',2000);
					//myAlert("请求超时！");
				}
			},milliSecond);
		}
		//弹出其他方式收费页面
		$scope.showOtherWayCharge = function (){
			$scope.bankList = Variables.bankJson;
			$scope.bankInfo = new Object();
			$scope.chargeModal.hide();
			//当我们用到模型时，清除它！
			$scope.$on('$destroy', function() {
			    $scope.chargeModal.remove();
			});

			$scope.otherModal.show();
		}
		var allProvince = dsy.Items['0'];
		CommonFn.adressSelect('otherbankAddress', allProvince, $scope, dsy, 'BANK_PROVINCE', 'BANK_CITY', 'chargeAfress');
		$scope.otherbankAddress = {
		    adress: {
		      chargeAfress: {
		        province: allProvince,
		        city    : '',
		        county  : null
		      }
    		},
    		data: {
  				"BANK_PROVINCE" : "",
  				"BANK_CITY"  : "",
				"bankSubType":""
			}
		};		


		//add邮储直连 限时校验   wuwei  2016.9.29
		$scope.newbankname_apply = function (){
            document.getElementById("bankAccnumber").setAttribute("placeholder","请输入银行卡号");
           // $scope.otherbankAddress.data.bankSubType = "";
				$scope.$watch('$scope.bankInfo.bankCode',function(){
					//$scope.bankInfo.bankCode=='1703' ? $scope.isJLWJ2 = true:$scope.isJLWJ2 = false;
                    var bankName = CommonFn.loadBankNameByCode($scope.bankList,$scope.bankInfo.bankCode);
                    bankName.indexOf("邮政储汇局") > -1 || bankName.indexOf("邮储") > -1 || bankName.indexOf("邮政") > -1 ? $scope.isYC = true: $scope.isYC=false;
				});
				
		};
    //选择邮储账号类型
    // $scope.selectType = function (){
    //     if($scope.otherbankAddress.data.bankSubType==1){
    //         document.getElementById("bankAccnumber").setAttribute("placeholder","请输入存折账号");
    //     }else{
    //         document.getElementById("bankAccnumber").setAttribute("placeholder","请输入银行卡号");
    //     }
    // };
		//确认按钮
		$scope.insurance_yes = function(){
			document.getElementById("insurance_div").style.display="none";
			document.getElementById("bankAccnumber").disabled=false;
		}
		//取消按钮
		$scope.insurance_no = function(){			
			document.getElementById("insurance_div").style.display="none";	
			$scope.bankInfo.bankCode = "";
			document.getElementById("bankAccnumber").disabled=false;
            //document.getElementById("otherBankSubType").style.display="none";
			// var obj = document.getElementById("selectbank");
			// obj.options[1].selected = true;
		}

		//保融签约
		$ionicModal.fromTemplateUrl('templates/change_bank_charge.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.modalSignOther = modal;
		});
		//签约条款展示
		$ionicModal.fromTemplateUrl('templates/bank_sign_info.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.modalSignAgrees = modal;
		});
		//点击阅读条款
		$scope.inter_agree = function(){
			//$scope.modalSignOther.hide();
			$scope.modalSignAgrees.show();
		}
		//点击阅读条款页关闭
		$scope.closeModalInterSign = function(){
			$scope.modalSignAgrees.hide();
			//$scope.modalSignOther.show();
		}
		//当我们用到模型时，清除它！
	    $scope.$on('$destroy', function() {
    		$scope.modalSignAgrees.remove();
	    });

		$scope.closeModalSign = function (){
			myConfirm3("确认","您未完成签约授权，若此时返回，填写的信息将丢失！",function(){				
				cancelMyConfirm3();
				
			},function(){
				cancelMyConfirm3();
				
				clearTimeout(timer);
				$("#verifyBankCode").val("");
				document.getElementById("sign_info").innerHTML ="获取验证码";
				document.getElementById("sign_info").disabled = false;
				document.getElementById("sureChannelBtn").disabled = true; 
				$scope.modalSignOther.hide();
				$scope.$on('$destroy', function() {
		    		$scope.modalSignOther.remove();
			    });
				$scope.otherModal.show();
				
			});			
		}
		
		//同意签约协议
		$scope.Sign_agree = function(){
			if($("#Sign_agree").attr("checked")){
				$scope.sign_AgreeChecked = true;
				$scope.sign_Agree = true;
			}else{
				$scope.sign_AgreeChecked = false;
				$scope.sign_Agree = false;
			}
		}

		//签约界面的金额信息显示与隐藏
		$scope.showSignCustomerInfo = function(){				
			$(".showSignLimitInfoBank").toggle();	
			// if(document.getElementById("showSignLimitInfo").style.display=="block"){
			// 	document.getElementById("showSignLimitInfo").style.display="none"
			// }else{
			// 	document.getElementById("showSignLimitInfo").style.display="block"
			// }			
		}

    //OCR识别银行卡信息 by gudandie 2018-11-09
    $scope.openOcrOther = function () {
        var idtype = '17';
        var isCallBackFlag = false;
        $ionicActionSheet.show({
            buttons: [
                {text: '拍照'},
                {text: '从相册中选取'}
            ],
            cancelText: '取消',
            cancel: function () {
                console.log('CANCELLED');
            },
            buttonClicked: function (index) {
                var method = index == "0" ? "photo" : "album";
                CommonFn.showLoading('请稍后...');
                CommonFn.invoateOCR({
                    idtype:idtype,
                    method:method,
                    callBackFun:function(data){
                        CommonFn.hideLoading();
                        isCallBackFlag = true;
                        //alert('data==='+JSON.stringify(data));
                        data = eval('('+data+')');
                        if(CommonFn.isExist(data.message.status)){
                            if(data.message.status =="0"){  //识别成功
                                var cardType = data.cardsinfo.bankCardType;  //银行卡类别
                                if(CommonFn.isExist(cardType) && (cardType=='贷记卡' || cardType=='准贷记卡')){
                                    document.getElementById('bankAccnumber').value = '';
                                    CommonFn.alertPopupFun($ionicPopup,'loser','该卡为信用卡，请使用借记卡！',2000);
                                    return false;
                                }
                                document.getElementById('bankAccnumber').value = data.cardsinfo.cardNo;
                            }else{
                                document.getElementById('bankAccnumber').value = '';
                                CommonFn.alertPopupFun($ionicPopup,'loser',data.message.value,2000);
                                return false;
                            }
                        }
                    }
                })
                setTimeout(function(){
                    if(isCallBackFlag == false){
                        CommonFn.hideLoading();
                        CommonFn.alertPopupFun($ionicPopup,'loser','请求超时，请稍后再试！',2000);
                        return;
                    }
                },120000)
                return true;
            }
        })
    }

		var otherWayChargeFlag = false;
		//其他收费方式
		$scope.otherWayCharge = function (){
			//以下代码为了测试签约界面---需要注释
			// $scope.otherModal.hide();//更换银行卡立即收费关闭
			// $scope.$on('$destroy', function() {
			// 	$scope.otherModal.remove();
			// });
			// $scope.modalSignOther.show();//签约界面展示
			// $scope.sign_AgreeChecked = true;
			// $scope.sign_Agree = true;						
			// document.getElementById('DisableDate').value = getNowDate();
			//完毕
            if(!$scope.bankInfo.bankCode){
				CommonFn.alertPopupFun($ionicPopup,'loser','请选择开户银行！',2000);
				return;
			}
			if(isNull($scope.otherbankAddress.data.BANK_PROVINCE)||isNull($scope.otherbankAddress.data.BANK_CITY)){
				CommonFn.alertPopupFun($ionicPopup,'loser','请选择开户行省市！',2000);
				return;
			}
            // if(isNull($scope.otherbankAddress.data.bankSubType)){
            //     CommonFn.alertPopupFun($ionicPopup,'loser','请选择账号类型！',2000);
            //     return;
            // }
            var regex =/^[0-9-]{1,30}$/;
      	    if (!regex.test($scope.bankInfo.bankAccNo)){
      	    	CommonFn.alertPopupFun($ionicPopup,'loser','银行卡号只能是数字、“-”且不能包含其他字符，请您重新确认！',2000);
            	return ;
      	    };
			if(!$scope.bankInfo.bankAccNo){
				CommonFn.alertPopupFun($ionicPopup,'loser','请输入银行卡号！',2000);
				return;
			}
			
		//	var bankAccnumber = document.getElementById('bankAccnumber').value;//
			var bankPhone = document.getElementById('bankPhone').value;
		//	var bankCode = $scope.bankInfo.bankCode;//
			//var bankAccNo = $scope.bankInfo.bankAccNo;//
			// var otherBankSubType = '';
			// if(!isNull($scope.otherbankAddress.data.bankSubType)){ //邮储账户类型
   //              otherBankSubType = $scope.otherbankAddress.data.bankSubType;
			// }

			var regexs = /^1[3-9]\d{9}$/;
      	    if (!regexs.test(bankPhone)){
      	    	CommonFn.alertPopupFun($ionicPopup,'loser','请输入正确的银行预留手机号格式！',2000);
				return;
        	}
			
			//开始查询是否签约
			queryStatus();
			
		}

		//签约界面赋值
		function customerBankInfo(){
			submitInsurance.loadInsuranceByID({
				printNo:printNo,
				callBackFun:function (data){
					$scope.$apply(function (){						
						$scope.applicant = data.applicant;//投保人
						var applicant =  data.applicant;
						if(applicant.idType == "0"){
							$scope.applicant.IDNAME = "居民身份证";
						}else if(applicant.idType == "2"){
							$scope.applicant.IDNAME = "军官证";
						}else if(applicant.idType == "4"){
							$scope.applicant.IDNAME = "居民户口簿";
						}else if(applicant.idType == "A"){
							$scope.applicant.IDNAME = "士兵证";
						}else if(applicant.idType == "B"){
							$scope.applicant.IDNAME = "港澳居民来往内地通行证";
						}else if(applicant.idType == "D"){
							$scope.applicant.IDNAME = "警官证";
						}else if(applicant.idType == "E"){
							$scope.applicant.IDNAME = "台湾居民来往大陆通行证";
						}else if(applicant.idType == "H"){
							$scope.applicant.IDNAME = "外国护照";
						}else if(applicant.idType == "I"){
							$scope.applicant.IDNAME = "外国人永久居留证";
						}
						
						$scope.applicant.IDNO = applicant.idNo;
						$scope.applicant.NAME = applicant.realName;	
						$scope.insuranceList = data.insuredList[0].insuranceList;//投保事项
						//险种数据									
						var insuranceList = data.insuredList[0].insuranceList;
						if(insuranceList){
							for(var i = 0 ; i < insuranceList.length ; i++){				
								var productInfo = insuranceList[i];
								var subJsonInfo = {};				
								subJsonInfo["PRODUCT_NAME"] = productInfo.productCode;//投保险种
								if(subJsonInfo["PRODUCT_NAME"] == $scope.baseInfo.mainProductName){
									if(productInfo.payEndYear == "1000"){
										$scope.BRpayEndYear = 0;
									}else{									
										$scope.BRpayEndYear = productInfo.payEndYear;//交费年期
									}
									continue;
								}							
							}
						}
						//申请签约接口界面show
						$scope.otherModal.hide();//更换银行卡立即收费关闭
						$scope.$on('$destroy', function() {
				    		$scope.otherModal.remove();
					    });
						$scope.modalSignOther.show();//签约界面展示
						$scope.sign_AgreeChecked = true;
						$scope.sign_Agree = true;						
						document.getElementById('DisableDate').value = getNowDate();
					})
				}
			})
		}
		
		//状态查询接口
		function queryStatus(){			
			var inList = [];
			var inItem = {
				CorpEntity:organ,
				OppBank: $scope.bankInfo.bankCode.substring(0,2),
				OppAct:$scope.bankInfo.bankAccNo,
				BatchFlag: 1
			}
			inList[0] = inItem;

			var params = {
				"TransSource": "METX",
				"TransCode": "630SignQry",
				"TransSeq": getBaoRongTime(),
				"IN": inList
			}
			var json = {
				"url": API_URL+"/app/channel/queryStatus", 
				"parameters": params
			};
			//alert("查询："+JSON.stringify(json));
			loadingWait();
			httpRequestByPost(json, function (data) {				
				var jsonObj = eval("("+data+")");				
				if(jsonObj){					
					var jsonMap = jsonObj["jsonMap"];
					if(jsonMap && jsonMap.RtnCode == "success"){
						if(jsonMap.OUT[0].NeedSign == 1){
							//需要签约									
							customerBankInfo();//先走赋值再走申请
							closeLoadingWait();
						}else if(jsonMap.OUT[0].NeedSign == 0){
							//不需要签约							
							//CommonFn.alertPopupFun($ionicPopup,'loser',jsonMap.RtnMsg,3000);
							otherWayBank();//去收费
						}else{
							closeLoadingWait();						
							CommonFn.alertPopupFun($ionicPopup,'loser','查询失败',3000);
						}
					}else{ //失败
						closeLoadingWait();	
						var errMsg = "查询失败";
						if(jsonMap && jsonMap.RtnMsg){
							errMsg = jsonMap.RtnMsg;
						}				
						CommonFn.alertPopupFun($ionicPopup,'loser',errMsg,5000);
					}
				}else{					
					closeLoadingWait();
					CommonFn.alertPopupFun($ionicPopup,'loser','查询返回失败',3000);
				}
			}, function(err){
				//alert("查询失败");
				closeLoadingWait();
				CommonFn.alertPopupFun($ionicPopup,'loser','网络异常，请稍候重试！',3000);
			}); 
		}

		//点击发送验证码调取签约申请方法接口
		$scope.applyChannel=function(){	
			//alert("baseInfo:"+JSON.stringify($scope.baseInfo));						
			$scope.SingleLimit=$("#SingleLimit").val();
			if($scope.SingleLimit){
				//alert("sumprem:"+$scope.baseInfo.sumPrem)
				if(parseInt($scope.SingleLimit <= 0)){
					alert('请输入正确的单笔最大金额');			
					//CommonFn.alertPopupFun($ionicPopup,'loser','请输入正确的单笔最大金额',3000);
					return;
				}
				if(parseInt($scope.SingleLimit) < $scope.baseInfo.sumPrem){
					alert('委托代扣单笔最大金额小于本次保费，将会导致扣费失败，请重新修改');
					//CommonFn.alertPopupFun($ionicPopup,'loser','委托代扣单笔最大金额小于本次保费，将会导致扣费失败，请重新修改!',3000);
					return;
				}

			}else{
				$scope.SingleLimit = "5000000";
			}
			
			var timeRadio = document.getElementsByName("timeRadio");			
			for (radio in timeRadio) {
				if (timeRadio[radio].checked) {					
					$scope.timeRadio =timeRadio[radio].value;
				}
			}
			$scope.MaxCountLimit=$("#MaxCountLimit").val();
			if($scope.MaxCountLimit){
				if(!((parseInt($scope.MaxCountLimit)>0) && (parseInt($scope.MaxCountLimit)<=9999))){
					alert("最大代扣次数必须是1-9999内的整数");
					//CommonFn.alertPopupFun($ionicPopup,'loser','最大代扣次数必须是1-9999内的整数',3000);
					return;
				}
			}else{
				$scope.MaxCountLimit = 9999;
			}

			var DisableDates=$("#DisableDate").val();			
			var xDisableDate=DisableDates.replace(/-/g,"\/");
			$scope.DisableDate= DisableDates.replace(/-/g,"");
			var nowDate = new Date();
			if(DisableDates){								
				//var nowTime = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate();
				if($scope.BRpayEndYear > 1){
					var years=nowDate.getFullYear()+parseInt($scope.BRpayEndYear)-1;
					var nowTime = years +'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate();
					var nowhm = new Date(nowTime).getTime()+(60*24*60*60*1000);	
					if(new Date(xDisableDate) < new Date(nowhm)){
						alert("协议失效日期过早，可能导致本保单的保费无法自动收取，请您修改");
						//CommonFn.alertPopupFun($ionicPopup,'loser','协议失效日期过早，可能导致本保单的保费无法自动收取，请您修改!',3000);
						return;
					}
				}else{					
					var oneYear=getNowDate().replace(/-/g,"\/");
					if(new Date(xDisableDate) < new Date(oneYear)){
						alert("协议失效日期过早，可能导致本保单续保时，无法收取相应保费，请您修改");
						//CommonFn.alertPopupFun($ionicPopup,'loser','协议失效日期过早，可能导致本保单续保时，无法收取相应保费，请您修改!',3000);
						return;
					}
				}

				var oneTime = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate();
				if(new Date(xDisableDate) < new Date(oneTime)){
					alert("协议失效日期小于今天，请您修改！");
					//CommonFn.alertPopupFun($ionicPopup,'loser','协议失效日期小于今天，请您修改！!',3000);
					return;
				}
								
			}else{
				document.getElementById('DisableDate').value = getNowDate();		
				$scope.DisableDate=getNowDate().replace(/-/g,"");
			}
			
			var inList = [];
			var timeLen = getBaoRongTime().length;
			var inItem = {
				RdSeq:'mine'+getBaoRongTime().substring(0,8)+getBaoRongTime().substring(timeLen-8, timeLen),
				CorpEntity:organ,
				PrivateFlag: "1",
				BatchFlag: "1",
				OppBank: $scope.bankInfo.bankCode.substring(0,2),
				OppAct: $scope.bankInfo.bankAccNo,
				OppActName: $scope.baseInfo.applicantName,
				CardType: '2',
				CertType: getCartType($scope.applicant.idType),
				CVV2: "", 
            	ExpiredDate: "",
				CertNumber: $scope.applicant.IDNO,
				CellPhone: $scope.bankInfo.BANK_PHONE, //签约手机号
				DisableDate: $scope.DisableDate, //失效日期
				SingleLimit: $scope.SingleLimit, //代扣单笔最大金额
				LimitPeriodUnit: $scope.timeRadio, //周期时间
				MaxCountLimit: $scope.MaxCountLimit //代扣次数
			}
			inList[0] = inItem;
			var params = {
				TransSource: "METX",
				TransCode: "630SignApply",
				TransSeq: getBaoRongTime(),
				IN: inList
			}
			var json = {
				"url": API_URL+"/app/channel/applyChannel", //申请签约
				"parameters": params
			};
			//alert("签约申请:"+JSON.stringify(json));
			//childrenloadingWait();
			document.getElementById("sign_info").disabled = true;
			httpRequestByPost(json,
				function (data){
					var jsonObj = eval("("+data+")");
						if(jsonObj){							
							var jsonMap = jsonObj["jsonMap"];
							if(jsonObj && jsonMap.RtnCode == "success"){
								//childrencloseLoadingWait();
								//申请成功							
								$scope.RdSeq=jsonMap.OUT[0].RdSeq;
								CommonFn.alertPopupFun($ionicPopup,'charging','发送验证码成功！',3000);
								document.getElementById("sureChannelBtn").disabled = false; 
								SignHour=120;
								whileThridHoursSign();
								
							}else{								
								var errMsg = "发送失败";
								if(jsonMap && jsonMap.RtnMsg){
									errMsg = jsonMap.RtnMsg;
								}				
								alert(errMsg);
								document.getElementById("sign_info").disabled = false;															
							}
						}else{
							CommonFn.alertPopupFun($ionicPopup,'loser','发送失败，请稍候重试！',3000);
							document.getElementById("sign_info").disabled = false;
						}
				},function (err){
					//childrencloseLoadingWait();
					CommonFn.alertPopupFun($ionicPopup,'loser','网络异常，请稍候重试！',3000);
					document.getElementById("sign_info").disabled = false;
				}
			);
		}
		//确认签约按钮方法
		$scope.sureChannel = function(){
			///签约确认按钮
			if(!$scope.sign_Agree){
				//childrenMyAlert("请同意协议!");
				CommonFn.alertPopupFun($ionicPopup,'loser','请同意协议！',3000);
				return;
			}
			var verifyCode = document.getElementById("verifyBankCode").value;
			//$scope.verifycode = document.getElementById("verifyBankCode").value;
			if(!(verifyCode && (verifyCode.length == 6))){
				//childrenMyAlert("请输入验证码!");
				CommonFn.alertPopupFun($ionicPopup,'loser','请输入验证码!',3000);
				return;
			}
			var inList = [];
			var timeLen = getBaoRongTime().length;
			var inItem = {
				RdSeq:$scope.RdSeq,
				CorpEntity:'6000001',
				VerfyCode: verifyCode,
				ReqReserved1: "",
				ReqReserved1: ""
			}
			inList[0] = inItem;

			var params = {
				TransSource: "METX",
				TransCode: "630SignConfirm",
				TransSeq: getBaoRongTime(),
				IN: inList
			}
			var json = {
				"url": API_URL+"/app/channel/sureChannel", 
				"parameters": params
			};
			//childrenloadingWait();			
			//alert("申请确认："+JSON.stringify(json));
			httpRequestByPost(json,
				function (obj){
					var jsonObj=eval("("+obj+")");
					//childrencloseLoadingWait();
					if(jsonObj){
						var jsonMap = jsonObj["jsonMap"];
						if(jsonMap && jsonMap.RtnCode == "success"){
							//alert("jsonMap.OUT[0].SignState:"+jsonMap.OUT[0].SignState)								
							if(jsonMap.OUT[0].SignState == 2){
								//签约成功
								$scope.modalSignOther.hide();
								$scope.$on('$destroy', function() {
									$scope.modalSignOther.remove();
								});
								otherWayBank();//去收费
							}else if(jsonMap.OUT[0].SignState == 1){
								clearTimeout(timer);
								document.getElementById("sign_info").innerHTML ="重新获取";	
								document.getElementById("sign_info").disabled = false; 
								$("#verifyBankCode").val("");
								 CommonFn.alertPopupFun($ionicPopup,'loser','未签约，请重新获取验证码',3000);
								//childrenMyAlert("未签约，请重新获取验证码");
							}else{
							
								clearTimeout(timer);
								document.getElementById("sign_info").innerHTML ="重新获取";	
								document.getElementById("sign_info").disabled = false; 
								$("#verifyBankCode").val("");
								//childrenMyAlert(jsonMap.RtnMsg);
								CommonFn.alertPopupFun($ionicPopup,'loser',jsonMap.RtnMsg,5000);								
							}
						}else{	
							clearTimeout(timer);
							document.getElementById("sign_info").innerHTML ="重新获取";	
							document.getElementById("sign_info").disabled = false; 	
							$("#verifyBankCode").val("");				
							var errMsg = "签约申请失败";
							if(jsonMap && jsonMap.RtnMsg){
								errMsg = jsonMap.RtnMsg;
							}				
							//CommonFn.alertPopupFun($ionicPopup,'loser',errMsg,3000);
							alert(errMsg);								
						}
					}else{
						CommonFn.alertPopupFun($ionicPopup,'loser','签约申请失败，请稍候重试！',3000);
					}
				},function (err){
					//childrencloseLoadingWait();
					CommonFn.alertPopupFun($ionicPopup,'loser','网络异常，请稍候重试！',3000);
				}
			);
		}
//更换其他银行卡收费按钮方法
		function otherWayBank(){
		//	alert("其他银行卡交费")
			var bankAccnumber = document.getElementById('bankAccnumber').value;
			var bankPhone = document.getElementById('bankPhone').value;
			var bankCode = $scope.bankInfo.bankCode;
			//var bankAccNo = $scope.bankInfo.bankAccNo;
			var UbankProvince='';
			var UbankCity='';
			var otherBankSubType = 2;
			// if(!isNull($scope.otherbankAddress.data.bankSubType)){ //邮储账户类型
            //     otherBankSubType = $scope.otherbankAddress.data.bankSubType;
			// }
			// var UbankProvince = $scope.isJLWJ2 == false ? '' : $scope.otherbankAddress.data.BANK_PROVINCE;
			// var UbankCity = $scope.isJLWJ2 == false ? '' :  $scope.otherbankAddress.data.BANK_CITY;
			//查询地址表数据
			var tAddress10005_sql = {
				"databaseName":"promodel/10005/www/db/t_address.sqlite",
				"sql" : "select * from t_address where place_code != ''"
			}; 
			///根据省市名称获取对应code码
			// queryTableDataUseSql(tAddress10005_sql, function (data2) {
			// 	if(data2){
			// 		var addressArray = data2;
			// 		var newAddressJson = {};
			// 		for(var k = 0 ; k < addressArray.length ; k++){
			// 			var tempAddress = addressArray[k];
			// 			var placeCode = tempAddress["PLACE_CODE"];
			// 			var placeName = tempAddress["PLACE_NAME"];
			// 			newAddressJson[placeName] = placeCode;
			// 		}
					if(!isNull($scope.otherbankAddress.data.BANK_PROVINCE) && !isNull($scope.otherbankAddress.data.BANK_CITY)){
						//UbankProvince = newAddressJson[$scope.otherbankAddress.data.BANK_PROVINCE];
						//UbankCity = newAddressJson[$scope.otherbankAddress.data.BANK_CITY];
						UbankProvince = $scope.otherbankAddress.data.BANK_PROVINCE;
						UbankCity = $scope.otherbankAddress.data.BANK_CITY;
					}
					var array = {};
					array["printNo"] = printNo;
					array["bankCode"] = bankCode;
					// array["bankAccNo"] = $scope.bankInfo.bankAccNo;
					array["bankAccNo"] = bankAccnumber;
					array["bankProvince"] = UbankProvince;
					array["bankCity"] = UbankCity;
					array["rel_applyNo"] = rel_applyNo;
					array["bankSubType"]=otherBankSubType;
					array["bankPhone"]=bankPhone;
					if($scope.activted){//保存当前收费方式到数据库				
						loadingWait();
						submitInsurance.saveOtherChargeWay({
							printNo:printNo,
							bankCode:bankCode,
							bankAccNo:bankAccnumber,
							bankProvince:UbankProvince,
							bankCity:UbankCity,
							rel_applyNo:rel_applyNo,
                            bankSubType:otherBankSubType,
							callBackFun:function (data){
								if(0 == data.code){//其他方式保存成功后调收费接口
									//$scope.chargeFun(array);
									otherWayChargeFlag = true;
								}else{
									CommonFn.alertPopupFun($ionicPopup,'loser','其他银行卡交费失败！',3000);
									//myAlert("其他银行卡交费失败！");
									closeLoadingWait();
								}
							}								
						});
						setTimeout(function(){
							closeLoadingWait();
							if(otherWayChargeFlag == true){
								$scope.chargeFun(array,bankPhone);
							}else{
								CommonFn.alertPopupFun($ionicPopup,'loser','请求失败，请稍后再试',3000);
							}
						},2000)
						
					}else{//直接走收费的接口
						$scope.chargeFun(array,bankPhone);
					}
				//}
			//});
		}
		//根据保单状态码判断是否显示‘查询收费状态’、‘撤单’、‘收费’按钮
		$scope.showOperationButtonByState = function(stateCode){
//			alert("stateCode:"+stateCode);
			//‘待交费’状态时允许（查询收费状态、撤单、收费）
			//stateCode=0;
			if(stateCode == "0"){
				$scope.showQueryChargeStateFlag = true;
				$scope.showRevokeFlag = true;
				$scope.showChargeFlag = true;
//				alert("$rootScope.insuranceSubmitSuccess:"+$rootScope.insuranceSubmitSuccess);
				//已成功提交的保单，并且保单状态为‘代收费’时，显示收费界面
//				if($rootScope.insuranceSubmitSuccess){
//					//弹出收费界面
//					$scope.showCharge();
//				}
			}
			//‘待核保审核 、 已交费 、交费失败、 超额转线下’状态时允许（查询收费状态）
			else if(stateCode == "1" || stateCode == "2" || stateCode == "-6" || stateCode == "9"){
				$scope.showQueryChargeStateFlag = true;
				$scope.showRevokeFlag = false;
				$scope.showChargeFlag = false;
			}
			//其它状态时不允许相关操作
			else{
				$scope.showQueryChargeStateFlag = false;
				$scope.showRevokeFlag = false;
				$scope.showChargeFlag = false;
			}
		} 
		//保单概要页面加载时，根据保单状态码控制保单操作按钮的显示
		$scope.showOperationButtonByState($scope.baseInfo.state);
		
		//更新选中的保单状态
		$scope.updateInsuranceStatus = function(){
//			CommonFn.alertPopupFun($ionicPopup,'loading','加载中！...',0);
			loadingWait();
			var isCallbackFlag = false;
			
			//保单状态json
			//var insuranceStateJson = {"-1":"未提交","-2":"处理异常","-3":"未知状态","-4":"客户合并中","0":"待交费","1":"待核保审核","2":"已交费","-6":"交费失败","9":"超额转线下","3":"承保前撤单","4":"保单承保","5":"保单已打印","6":"已签章","7":"退保","8":"退保回退","-5":"","10","邮储收费中",11":"已签单","12":"撤单","13":"拒保","14":"延期"};
			//查询当前保单状态
			submitInsurance.loadInsuranceState({
				printNo:printNo,
				callBackFun:function (data){
					isCallbackFlag = true;
					closeLoadingWait();
//					if(null != Variables.alertPopup){
//						Variables.alertPopup.close();
//					}
					//查询的最新保单状态
					var newStateCode = data.state;
					myAlert(data.message);
					$scope.$apply(function(){
						//跟新左侧列表所选的保单状态
						$scope.baseInfo.state = newStateCode;
						//根据保单状态码控制保单相关操作
						$scope.showOperationButtonByState(newStateCode);
					});
				}
			});
			var milliSecond = getMilliSecondOfTimeout("queryStatus");
			$timeout(function(){
				//alert("isCallbackFlag:"+isCallbackFlag);
				if(isCallbackFlag == false){
					//隐藏加载提示框
					closeLoadingWait();
					//CommonFn.alertPopupFun($ionicPopup,'loser','请求超时！',3000);
					myAlert("请求超时！");
				}
			},milliSecond);
		}
		
		//撤单
		$scope.showRevokeFun = function (){
			//if(confirm("您确认要撤单吗？")){
				myConfirm('提示','您确认要撤单吗？',function(){
				cancelMyConfirm();	
//				CommonFn.alertPopupFun($ionicPopup,'loading','加载中！...',0);
				loadingWait();
				var isCallbackFlag = false;
				
				submitInsurance.showRevokeFun({
					printNo:printNo,
					drawbackReason:"",
					callBackFun:function (data){
						isCallbackFlag = true;
						closeLoadingWait();
//						if(null != Variables.alertPopup){
//							Variables.alertPopup.close();
//						}
						if(0 == data.code){
//							CommonFn.alertPopupFun($ionicPopup,'charging',data.msg,3000);
							myAlert(data.msg);
						}else{
//							CommonFn.alertPopupFun($ionicPopup,'loser',data.msg,3000);
							myAlert(data.msg);
						}
					}
				});
				var milliSecond = getMilliSecondOfTimeout("queryStatus");
				$timeout(function(){
					if(isCallbackFlag == false){
						//隐藏加载提示框
						closeLoadingWait();
//						CommonFn.alertPopupFun($ionicPopup,'loser','请求超时！',3000);
						myAlert("请求超时！");
					}
				},milliSecond);
			})
		}
		//查询收费状态
		$scope.queryChargeState = function (){
//			CommonFn.alertPopupFun($ionicPopup,'loading','加载中！...',0);
			loadingWait();
			var isCallbackFlag = false;
			submitInsurance.queryChargeState({
				printNo:printNo,
				callBackFun:function (data){
					isCallbackFlag = true;
					closeLoadingWait();
//					if(null != Variables.alertPopup){
//						Variables.alertPopup.close();
//					}
					if(0 == data.code){
//						CommonFn.alertPopupFun($ionicPopup,'charging',data.msg,3000);
						myAlert(data.msg);
					}else{
//						CommonFn.alertPopupFun($ionicPopup,'loser',data.msg,3000);
						myAlert(data.msg);
					}
				}
			});
			var milliSecond = getMilliSecondOfTimeout("queryStatus");
			$timeout(function(){
				if(isCallbackFlag == false){
					//隐藏加载提示框
					closeLoadingWait();
//					CommonFn.alertPopupFun($ionicPopup,'loser','请求超时！',3000);
					myAlert("请求超时！");
				}
			},milliSecond);
		}
		//保单预览
		$scope.insurancePreview = function(){
			if(pctype == '' || pctype == 'pad'){
				$state.go('menu.submit.insurance_preview',{'printNo':$scope.baseInfo.printNo ,'indexNo':indexNo });			
				
			}else{//手机版 
				$state.go('insurance_preview',{'printNo':$scope.baseInfo.printNo ,'indexNo':indexNo });			

			}
		};

	})
//已承保保单预览数据 add by renxiaomin 2017.6.29
.controller('InsurancePreviewCtrl', function($scope,$state,$stateParams,$compile,$ionicPopup,$rootScope,$ionicSlideBoxDelegate,$ionicActionSheet,$ionicLoading,$timeout,CommonFn,unFinshedInsurance,Variables,initData,submitInsurance,$sce,$ionicModal) {
	//保单相关数据
	var printNo = $stateParams.printNo; 
	var indexNo = $stateParams.indexNo;
	var pctype = document.getElementById("pctype").value;
	// var organCode='';//业务员机构号
 //    organCode = window.localStorage.getItem('organCode');
	//初始化银行列表
	initData.loadBanks(function(){
		$scope.bankData=Variables.bankJson;
	});
	//健康告知方法
		$scope.previewImpartContent = function(){
			//保单ID
			var applyId = document.getElementById("formID").value;
			//alert("applyId:"+applyId)
			//查询APPLY_DETAIL值
			$timeout(function(){
				var bycode = {
					"databaseName": Variables.dataBaseName,
					"tableName": "T_APPLY",
					"conditions": {"ID": applyId}
				};
				queryTableDataByConditions(bycode, function (data) {
					//alert("告知:"+JSON.stringify(data));
					if (data){						
						var applyDetailStr = data[0].APPLY_DETAIL;
						var UPDATE_TIME = data[0].UPDATE_TIME;//申请日期
						var prosalJsonStr = data[0].PROSAL_JSON;
						prosalJsonStr = prosalJsonStr.replace(/\r\n/g, "").replace(/\\\"/g, "\"").replace(/\\\//g, "\/");
						var prosalJson = eval("(" + prosalJsonStr + ")");
						
						if (applyDetailStr) {
							var applyDetailJsonStr = applyDetailStr.replace(/\r\n/g, "").replace(/\\\"/g, "\"").replace(/\\\//g, "\/");
							var applyDetailJson = eval("(" + applyDetailJsonStr + ")");
							
							//保单详情中的告知列表
							var appntImpartJsonList = applyDetailJson["appntImpartList"];		//投保人告知
							var insurantImpartJsonList = applyDetailJson["insurantImpartList"];	//被保人告知
							var agentImpartJsonList = applyDetailJson["agentImpartList"];		//业务员告知

							//告知说明及备注栏Table
							var explainTable = document.getElementById("explainTable");
							//如果表格有数据则清空，避免重复加载
							var rowCount = explainTable.rows.length;
							if(rowCount > 2){
								for(var i = 1 ; i < rowCount - 1 ; i++){
									explainTable.deleteRow(1);
								}
							}
							//投保人告知数据加载
							if(appntImpartJsonList){
								for(var i = 0 ; i < appntImpartJsonList.length ; i++){
									var appntImpartJson = appntImpartJsonList[i];
									//设置‘是否’复选框的选中状态
									var dataContainerId = "applicant_" + appntImpartJson.impartVersion + "_" + appntImpartJson.impartCode;
									var checkboxOuterDiv = document.getElementById(dataContainerId);
									if(checkboxOuterDiv){
										var checkboxInputs = checkboxOuterDiv.getElementsByTagName("input");
										for(var j = 0 ; j < checkboxInputs.length ; j++){
											checkboxInputs[j].checked = false;
											if(appntImpartJson.impartFlag == checkboxInputs[j].value){
												checkboxInputs[j].checked = true;
											}
										}
									}
									//设置告知内容
									if(appntImpartJson.impartFlag == "2" || appntImpartJson.impartFlag == "1")
									{
										var impartContentArray = appntImpartJson.impartContent.split("/");
										for(var j = 0 ; j < impartContentArray.length ; j++){
											var dataContainer = document.getElementById(dataContainerId + "_" + j);
											if(dataContainer){								
												if(dataContainer.tagName == "CHECKBOX"){
													// if(dataContainer.value == impartContentArray[j]){
													// 	dataContainer.checked = true;
													// }
												}else{
													dataContainer.innerHTML = impartContentArray[j];
												}
											}
										}
										if(appntImpartJson.impartCode=='A0531'){
											var licenseContent=appntImpartJson.impartContent.split("/");
											var insurant=document.getElementsByName('applicant');					
											for(var s = 0; s < insurant.length; s++){
												var license = document.getElementById(dataContainerId + "_" + s);
												license.checked=false;
												for(var js = 0; js < licenseContent.length;js++){						
													if(licenseContent[js]==insurant[s].value){
														license.checked=true;												
													}
												}
											}
										}
									}
									//将询问结果为‘是’的详细告知内容提取出来并放到‘告知说明及备注栏’表格中
									if(appntImpartJson.impartFlag == "1"){
										//存在‘name’属性的div才需要展示到‘告知说明及备注栏’表格中
										var impartNumber = checkboxOuterDiv.getAttribute("name");
										if(impartNumber){
											var insertRow = explainTable.insertRow(explainTable.rows.length-1);
											var serialNumber = insertRow.insertCell(0);
											var explainName = insertRow.insertCell(1);
											var explainContext = insertRow.insertCell(2);
											serialNumber.innerHTML = impartNumber;
											explainName.innerHTML = "投保人";
											explainContext.innerHTML = appntImpartJson.impartContent;
										}
									}
								}
							}

							//被保人告知数据加载
							if(insurantImpartJsonList){
								for(var i = 0 ; i < insurantImpartJsonList.length ; i++){
									var insurantImpartJson = insurantImpartJsonList[i];
									//设置‘是否’复选框的选中状态
									var dataContainerId = "insurant_" + insurantImpartJson.impartVersion + "_" + insurantImpartJson.impartCode;
									var checkboxOuterDiv = document.getElementById(dataContainerId);
									if(checkboxOuterDiv){
										var checkboxInputs = checkboxOuterDiv.getElementsByTagName("input");
										for(var j = 0 ; j < checkboxInputs.length ; j++){
											checkboxInputs[j].checked = false;
											if(insurantImpartJson.impartFlag == checkboxInputs[j].value){
												checkboxInputs[j].checked = true;
											}
										}
									}
									//设置告知内容
									if(insurantImpartJson.impartFlag == "2" || insurantImpartJson.impartFlag == "1")
									{
										var impartContentArray = insurantImpartJson.impartContent.split("/");
										for(var j = 0 ; j < impartContentArray.length ; j++){
											var dataContainer = document.getElementById(dataContainerId + "_" + j);
											if(dataContainer){
												if(dataContainer.type == "checkbox"){
													// if(dataContainer.value == impartContentArray[j]){
													// 	dataContainer.checked = true;
													// }
												}else{
													dataContainer.innerHTML = impartContentArray[j];
												}
											}
										}
										if(insurantImpartJson.impartCode=='A0531'){
											var licenseContent=insurantImpartJson.impartContent.split("/");
											var insurant=document.getElementsByName('insurant');
											for(var s = 0; s < insurant.length; s++){
												var license = document.getElementById(dataContainerId + "_" + s);
												license.checked = false;
												for(var js = 0; js < licenseContent.length;js++){						
													if(licenseContent[js]==insurant[s].value){
														license.checked=true;												
													}
												}
												
											}
										}
									}
									//将询问结果为‘是’的详细告知内容提取出来并放到‘告知说明及备注栏’表格中
									if(insurantImpartJson.impartFlag == "1"){
										//存在‘name’属性的div才需要展示到‘告知说明及备注栏’表格中
										var impartNumber = checkboxOuterDiv.getAttribute("name");
										if(impartNumber){
											var insertRow = explainTable.insertRow(explainTable.rows.length - 1);
											var serialNumber = insertRow.insertCell(0);
											var explainName = insertRow.insertCell(1);
											var explainContext = insertRow.insertCell(2);
											serialNumber.innerHTML = impartNumber;
											explainName.innerHTML = "被保险人";
											explainContext.innerHTML = insurantImpartJson.impartContent;
										}
									}
								}
							}
						}
						if(prosalJson){
							//加载‘声明授权’表格中动态信息
							var applicationDate = document.getElementById("applicationDate");
							var applicationDate2 = document.getElementById("applicationDate2");
							
							var agent_org = document.getElementById("agent_org");
							var agent_name = document.getElementById("agent_name");
							var agent_code = document.getElementById("agent_code");
							
							if(applicationDate){
								applicationDate.innerHTML = getDataYears(UPDATE_TIME); 
							}
							if(applicationDate2){
								applicationDate2.innerHTML = getDataYears(UPDATE_TIME); 
							}
							
							//获取prosalJson中agentMap数据
							var agentMap = prosalJson.CONTENT.agentMap;
							if(agent_org){
								var agentOrg = agentMap.ORGANIZATION ? agentMap.ORGANIZATION : "";
								agent_org.innerHTML = agentOrg;
							}
							if(agent_name){
								var agentName = agentMap.NAME ? agentMap.NAME : "";
								agent_name.innerHTML = agentName; 
							}
							if(agent_code){
								var agentCode = agentMap.AGENTCODE ? agentMap.AGENTCODE : "";
								agent_code.innerHTML = agentCode; 
							}
						}						
					}
				});
			},2000);
		}
	//查询保单基本信息
	// unFinshedInsurance.loadUnFinshedInsurances({
	// 	searchVal:'',
	// 	ID:printNo,
	// 	callBackFun:function (data){
	// 	//alert("data:"+JSON.stringify(data));	
	// 	console.log("请求本地data:"+JSON.stringify(data[0]))						
	// 				if(data && data[0]){
	// 					$scope.$apply(function (){
	// 						$scope.applyInfo = data[0];
						
	// 						//查询投保人基本信息
	// 						unFinshedInsurance.queryCustomerById({
	// 							applyID:$scope.applyInfo.ID,
	// 							applicantID:$scope.applyInfo.APPLICANT_ID,
	// 							recognizeeID:'',
	// 							callBackFun:function (applicantArray){
	// 								$scope.applicant = {};
	// 								if(applicantArray && applicantArray[0]){
	// 									$scope.$apply(function(){
	// 										var applicant = applicantArray[0];
	// 										replaceNull(applicant);
	// 										$scope.applicant = applicant;
	// 										$scope.applicant.NAME = applicant.NAME;
	// 										$scope.applicant.SEX = applicant.SEX;
	// 										$scope.applicant.BIRTHDAY = applicant.BIRTHDAY;
	// 										$scope.applicant.RELATION = applicant.RELATION;
	// 										$scope.applicant.OCCUPATION_CODE = applicant.OCCUPATION_CODE;
	// 										$scope.applicant.OCCUPATION = applicant.OCCUPATION;

	// 									});
	// 								}
	// 								if(applicantArray && applicantArray[1]){
	// 									$scope.$apply(function(){
	// 										var applicant1002 = applicantArray[1];
	// 										replaceNull(applicant1002);
	// 									//	$scope.applicantData.BIRTHDAY = applicant1002.BIRTHDAY; 

	// 			                        // 日期时间戳和日期转换  add by renxiaomin 2016.11.23
	// 			                          if((typeof applicant1002.ID_END_DATE == 'string') && applicant1002.ID_END_DATE != '长期有效'){
	// 			                              $scope.validity=applicant1002.ID_END_DATE;
	// 			                              var R=new Date();
	// 			                              var newY=R.getFullYear();
	// 			                              var oldY=Number($scope.validity.substr(0,4));
	// 			                             if((oldY-newY)>=90 || oldY==9999){
	// 			                                applicant1002.ID_END_DATE='长期有效';
	// 			                             }else{
	// 			                                applicant1002.ID_END_DATE=$scope.validity;
	// 			                             }     
	// 			                            }

	// 										$scope.applicant.IDNAME = applicant1002.IDTYPE;
	// 										$scope.applicant.IDNO = applicant1002.IDNO;
	// 										$scope.applicant.ID_END_DATE = applicant1002.ID_END_DATE;
	// 										$scope.applicant.NATIVE_PLACE = applicant1002.NATIVE_PLACE;
	// 										//$scope.applicant.RGT_ADDRESS = applicant1002.RGT_PROVINCE;
	// 										$scope.applicant.RGT_ADDRESS = applicant1002.RGT_PROVINCE + applicant1002.RGT_CITY;//+applicant1002.HOUSEHOLD_COUNTY;
	// 										$scope.applicant.MARRIY = applicant1002.MARRI_STATUS;
	// 										$scope.applicant.INCOME = applicant1002.INCOME;
	// 										$scope.applicant.INCOME_WAY = applicant1002.INCOME_WAY;
	// 										$scope.applicant.WORK_UNIT = applicant1002.WORK_UNIT;
	// 										$scope.applicant.OTHER_INCOME_WAY = applicant1002.OTHER_INCOME_WAY;
	// 										$scope.applicant.PHONE = applicant1002.MOBILE;
	// 										$scope.applicant.COMPANY_PHONE = applicant1002.COMPANY_PHONE;
	// 										$scope.applicant.EMAIL = applicant1002.EMAIL;
	// 										//针对山西机构把4，5级地址放到address									
	// 									    if(organCode.substr(0,4) == '8614'){
	// 										    var COMPANY_ADDRESS = applicant1002.COMPANY_ADDRESS;
	// 										    var s_COMPANY_ADDRESS='';
	// 										    var lastStr = COMPANY_ADDRESS.split('@%@');
	// 										        for(i=0;i<lastStr.length;i++){
	// 										          s_COMPANY_ADDRESS+=lastStr[i];
	// 										        }
	// 										        applicant1002.COMPANY_ADDRESS=s_COMPANY_ADDRESS; // 单位地址
	// 										    var HOME_ADDRESS = applicant1002.HOME_ADDRESS;
	// 										    var s_HOME_ADDRESS = '';
	// 										    var lastStr = HOME_ADDRESS.split('@%@');
	// 										        for(i=0; i< lastStr.length;i++){
	// 										          s_HOME_ADDRESS += lastStr[i];
	// 										        }
	// 										        applicant1002.HOME_ADDRESS=s_HOME_ADDRESS;  // 家庭住址
	// 									    }
	// 										if(applicant1002.COMPANY_PROVINCE=="北京" ||applicant1002.COMPANY_PROVINCE=="上海"||applicant1002.COMPANY_PROVINCE=="天津"||applicant1002.COMPANY_PROVINCE=="重庆"){
	// 											$scope.applicant.MAILING_ADDRESS = applicant1002.COMPANY_CITY+applicant1002.COMPANY_COUNTY+applicant1002.COMPANY_ADDRESS;
	// 										}else{
	// 											$scope.applicant.MAILING_ADDRESS = applicant1002.COMPANY_PROVINCE +applicant1002.COMPANY_CITY+applicant1002.COMPANY_COUNTY+applicant1002.COMPANY_ADDRESS;
	// 										}
	// 										$scope.applicant.MAILING_ZIP_CODE = applicant1002.COMPANY_ZIP_CODE
	// 										if(applicant1002.HOME_PROVINCE=="北京" ||applicant1002.HOME_PROVINCE=="上海"||applicant1002.HOME_PROVINCE=="天津"||applicant1002.HOME_PROVINCE=="重庆"){
	// 											$scope.applicant.HOME_ADDRESS = applicant1002.HOME_CITY+applicant1002.HOME_COUNTY+applicant1002.HOME_ADDRESS;
	// 										}else{
	// 											$scope.applicant.HOME_ADDRESS = applicant1002.HOME_PROVINCE +applicant1002.HOME_CITY+applicant1002.HOME_COUNTY+applicant1002.HOME_ADDRESS;
	// 										}
	// 										$scope.applicant.HOME_ZIP_CODE = applicant1002.HOME_ZIP_CODE;
	// 										$scope.applicant.PLURALITY_OCCUPATION_CODE_NAME = applicant1002.PLURALITY_OCCUPATION_CODE_NAME;
	// 									});
	// 								}
	// 							}
	// 						});
	// 						//被保人信息
	// 						unFinshedInsurance.queryCustomerById({
	// 							applyID:$scope.applyInfo.ID,
	// 							applicantID:'',
	// 							recognizeeID:$scope.applyInfo.INSURANT_ID,
	// 							callBackFun:function (recognizeeArray){
	// 								$scope.recognizee = {};
	// 								if(recognizeeArray && recognizeeArray[0]){
	// 									$scope.$apply(function (){
	// 										var recognizee = recognizeeArray[0];
	// 										replaceNull(recognizee);
	// 										$scope.recognizee = recognizee;
	// 										$scope.recognizee.NAME = recognizee.NAME;
	// 										$scope.recognizee.SEX = recognizee.SEX;
	// 										$scope.recognizee.BIRTHDAY = recognizee.BIRTHDAY;
	// 										$scope.recognizee.RELATION = recognizee.RELATION;
	// 										$scope.recognizee.OCCUPATION_CODE = recognizee.OCCUPATION_CODE;
	// 										$scope.recognizee.OCCUPATION = recognizee.OCCUPATION;
	// 									});
	// 								}
	// 								if(recognizeeArray && recognizeeArray[1]){
	// 									$scope.$apply(function(){
	// 										var recognizee1002 = recognizeeArray[1];
	// 										replaceNull(recognizee1002);
	// 									//	$scope.recognizeeData.BIRTHDAY = recognizee1002.BIRTHDAY;

	// 		                        // 日期时间戳和日期转换  add by renxiaomin 2016.11.23
	// 		                          if((typeof recognizee1002.ID_END_DATE == 'string') && recognizee1002.ID_END_DATE != '长期有效'){
	// 		                              $scope.validity=recognizee1002.ID_END_DATE;
	// 		                              var R=new Date();
	// 		                              var newY=R.getFullYear();
	// 		                              var oldY=Number($scope.validity.substr(0,4));
	// 		                             if((oldY-newY)>=90 || oldY==9999){
	// 		                                recognizee1002.ID_END_DATE='长期有效';
	// 		                             }else{
	// 		                                recognizee1002.ID_END_DATE=$scope.validity;
	// 		                             }     
	// 		                            }
	// 										$scope.recognizee.IDNAME = recognizee1002.IDTYPE;
	// 										$scope.recognizee.IDNO = recognizee1002.IDNO;
	// 										$scope.recognizee.ID_END_DATE = recognizee1002.ID_END_DATE;
	// 										$scope.recognizee.NATIVE_PLACE = recognizee1002.NATIVE_PLACE;
	// 										$scope.recognizee.RGT_ADDRESS = recognizee1002.RGT_PROVINCE + recognizee1002.RGT_CITY;//+recognizee1002.HOUSEHOLD_COUNTY;
	// 										$scope.recognizee.MARRIY = recognizee1002.MARRI_STATUS;
	// 										$scope.recognizee.INCOME = recognizee1002.INCOME;
	// 										$scope.recognizee.INCOME_WAY = recognizee1002.INCOME_WAY;
	// 										$scope.recognizee.WORK_UNIT = recognizee1002.WORK_UNIT;
	// 										$scope.recognizee.OTHER_INCOME_WAY = recognizee1002.OTHER_INCOME_WAY;
	// 										$scope.recognizee.PHONE = recognizee1002.MOBILE;
	// 										$scope.recognizee.COMPANY_PHONE = recognizee1002.COMPANY_PHONE;
	// 										$scope.recognizee.EMAIL = recognizee1002.EMAIL;													
	// 										$scope.recognizee.MAILING_ADDRESS = recognizee1002.COMPANY_PROVINCE +recognizee1002.COMPANY_CITY+recognizee1002.COMPANY_COUNTY+recognizee1002.COMPANY_ADDRESS;
	// 										$scope.recognizee.MAILING_ZIP_CODE = recognizee1002.COMPANY_ZIP_CODE;
	// 										//针对山西机构把4，5级地址放到address									
	// 									    if(organCode.substr(0,4) == '8614'){												    	
	// 										    var HOME_ADDRESS = recognizee1002.HOME_ADDRESS;
	// 										    var s_HOME_ADDRESS = '';
	// 										    var lastStr = HOME_ADDRESS.split('@%@');
	// 										        for(i=0; i< lastStr.length;i++){
	// 										          s_HOME_ADDRESS += lastStr[i];
	// 										        }
	// 										        recognizee1002.HOME_ADDRESS=s_HOME_ADDRESS;  // 家庭住址
	// 									    }												    
	// 										if(recognizee1002.HOME_PROVINCE=="北京"||recognizee1002.HOME_PROVINCE=="上海"||recognizee1002.HOME_PROVINCE=="天津"||recognizee1002.HOME_PROVINCE=="重庆"){
	// 											$scope.recognizee.HOME_ADDRESS =recognizee1002.HOME_CITY+recognizee1002.HOME_COUNTY+recognizee1002.HOME_ADDRESS;
	// 										}else{
	// 											$scope.recognizee.HOME_ADDRESS = recognizee1002.HOME_PROVINCE +recognizee1002.HOME_CITY+recognizee1002.HOME_COUNTY+recognizee1002.HOME_ADDRESS;
	// 										}
											
	// 										$scope.recognizee.HOME_ZIP_CODE = recognizee1002.HOME_ZIP_CODE;
	// 										$scope.recognizee.PLURALITY_OCCUPATION_CODE_NAME = recognizee1002.PLURALITY_OCCUPATION_CODE_NAME;
	// 									});
	// 								}
	// 							}
	// 						});
	// 						//受益人
	// 						unFinshedInsurance.queryCustomer({
	// 							applyID:$scope.applyInfo.ID,
	// 							benefit:'2',//查收益人
	// 							callBackFun:function (obj){
	// 								$scope.$apply(function (){
	// 									$scope.benefitList = obj;
	// 								});
	// 							}
	// 						});						
	// 						//查询保单中险种数据
	// 						unFinshedInsurance.loadCustomer({
	// 							applyID:$scope.applyInfo.ID,
	// 							applicantID:$scope.applyInfo.APPLICANT_ID,
	// 							callBackFun:function (data){

	// 								var prosalJson = eval('('+data[0].PROSAL_JSON+')');
	// 								var productsData = prosalJson.CONTENT.insureProductsMap.tableDataList;
	// 								//投保事项中展示的险种数据
	// 								var productArray = [];
	// 								//首期保险费合计
	// 								var firstPremiumTotal = 0;
	// 								//交费方式
	// 								var payMode = "";
	// 								if(productsData){
	// 									for(var i = 0 ; i < productsData.length ; i++){
	// 										var productInfo = productsData[i];
	// 										var subJsonInfo = {};
	// 										subJsonInfo["PRODUCT_NAME"] = productInfo[1];//投保险种
	// 										subJsonInfo["AMOUNT"] = productInfo[2].replace("元","");//保险金额（元）
	// 										subJsonInfo["INSU_YEARS"] = productInfo[7];//保险期间
	// 										subJsonInfo["PAY_END_YEAR"] = productInfo[6];//交费年期
	// 										subJsonInfo["PREM"] = productInfo[3].replace("元","");//标准保险费（元）
	// 										subJsonInfo["JOB_ADD_FEE"] = productInfo[4].replace("元","");//职业加费（元）
	// 										productArray[i] = subJsonInfo;
	// 										//首期保险费合计=保费+职业加费
	// 										firstPremiumTotal = numAdd(firstPremiumTotal,numAdd(subJsonInfo["PREM"],subJsonInfo["JOB_ADD_FEE"]));
	// 										if(i == 0){
	// 											payMode = productInfo[5];
	// 										}
	// 									}                                                                 
	// 								}
	// 								$scope.productArray = productArray;
	// 								$scope.firstPremiumTotal = firstPremiumTotal;//首期保险费合计
	// 								$scope.payMode = payMode;//交费方式
	// 							}
	// 						});
	// 						//投保事项(续)
	// 						unFinshedInsurance.loadPayInfo({
	// 							applyID:$scope.applyInfo.ID,
	// 							proposalID:$scope.applyInfo.PROPOSAL_ID,
	// 							applicantID:$scope.applyInfo.APPLICANT_ID,
	// 							callBackFun:function (obj){
	// 								alert('obj=='+JSON.stringify(obj))
	// 								if(obj){												
	// 									$scope.applyPayData = {};
	// 									if(obj[0]){
	// 										$scope.$apply(function (){
	// 											var payInfo1 = obj[0];												
	// 											$scope.applyPayData = payInfo1;
	// 											$scope.applyPayData.IS_NOTICE = eval(payInfo1.IS_NOTICE);
	// 											$scope.applyPayData.IS_PAY_FOR = eval(payInfo1.IS_PAY_FOR);
	// 											$scope.applyPayData.IS_INSURE = eval(payInfo1.IS_INSURE);
	// 											$scope.applyPayData.IS_INSURE_PAPER = eval(payInfo1.IS_INSURE_PAPER);
	// 										});
	// 									}
	// 									if(obj[1]){
	// 										$scope.$apply(function (){
	// 											var payInfo2 = obj[1];													
	// 											$scope.applyPayData.BANK_CODE = payInfo2.bankCode;
	// 											$scope.applyPayData.APPLICANT_NAME = payInfo2.appliantName;
	// 											$scope.applyPayData.BANK_NO = payInfo2.cardNum;
	// 										});
	// 									}
	// 								}
	// 							}
	// 						});
	// 						/********带是否有医疗保险的险种保单预览展示*********/
	// 						var bonus_json = {
	// 					        "databaseName":"promodel/10003/www/db/esales.sqlite",
	// 					        "tableName": "T_PROPOSAL_PRODUCT",
	// 					        "conditions":{"PROPOSAL_ID":$scope.applyInfo.PROPOSAL_ID}
	// 							}
	// 						queryTableDataByConditions(bonus_json,function(data){
	// 							if(data){
	// 								$scope.$apply(function (){
	// 									$scope.applyBonusData = {};
	// 									for(var bon = 0; bon < data.length; bon++){	
	// 										if(data[bon].BONUS_GET_MODE){										
	// 											if(data[bon].BONUS_GET_MODE == 'N' || data[bon].BONUS_GET_MODE == 'Y'){						
	// 												$scope.BONUS = true;
	// 												if(data[bon].BONUS_GET_MODE == 'N'){															
	// 													$scope.applyBonusData.BONUS_GET_MODE = false;																									
	// 												}else if(data[bon].BONUS_GET_MODE == 'Y'){															
	// 													$scope.applyBonusData.BONUS_GET_MODE = true;															
	// 												}
	// 											}else{
	// 												$scope.bonusGetWay=data[bon].BONUS_GET_MODE;//红利领取方式
	// 											}								
																							
	// 										}
	// 										if(data[bon].GETYEAR){
	// 											$scope.GETYEAR= data[bon].GETYEAR; //开始领取年龄											
	// 										}
	// 										if(data[bon].GETDUTYKIND){
	// 											$scope.getDutyKind= data[bon].GETDUTYKIND; //年金领取方式											
	// 										}											
	// 									}
	// 								})																						
	// 							}
	// 						})
	// 						/*********end********/
	// 						//健康告知	
	// 						document.getElementById("formID").value = $scope.applyInfo.ID;							
	// 						$scope.previewImpartContent();
	// 					});
	// 				}else{ //从服务器请求数据
						loadingWait();
						submitInsurance.loadInsuranceByID({
							printNo:printNo,
							callBackFun:function (data){
								closeLoadingWait();
								//alert("请求服务器data:"+JSON.stringify(data))
								//console.log("请求服务器data:"+JSON.stringify(data))
								$scope.$apply(function (){
									replaceNull(data.applicant);//显示空而不是undefined
									replaceNull(data.insuredList[0].insurant);
									replaceNull(data.insuredList[0].beneficiaryList);

									$scope.applicant = data.applicant;//投保人
									var applicant = data.applicant;
									$scope.recognizee = data.insuredList[0].insurant;//被保人
									var recognizee = data.insuredList[0].insurant;
									$scope.benefitListJson = data.insuredList[0].beneficiaryList;//受益人
									var benefitListJson = data.insuredList[0].beneficiaryList;
									$scope.insuranceList = data.insuredList[0].insuranceList;//投保事项
									$scope.baseInfo = data.baseInfo;//基本信息
									var baseInfo = data.baseInfo;
									//alert("受益人:"+JSON.stringify(data.insuredList[0].beneficiaryList))
									
									//下面开始进行投保人赋值	
									$scope.applicant.NAME = applicant.realName;
									$scope.applicant.SEX = applicant.sex;
									$scope.applicant.BIRTHDAY = applicant.birthday;
									$scope.applicant.RELATION = applicant.relationToMainInsured;
									$scope.applicant.OCCUPATION_CODE = applicant.occupationCode;
									$scope.applicant.OCCUPATION = applicant.occupationCodeName;
									$scope.applicant.PLURALITY_OCCUPATION_CODE_NAME = applicant.pluralityOccupationName;											
									// 日期时间戳和日期转换  add by renxiaomin 2016.11.23
		                          	if((typeof applicant.idEndDate == 'string') && applicant.idEndDate != '长期有效'){
			                            $scope.validity=applicant.idEndDate;
			                            var R=new Date();
			                            var newY=R.getFullYear();
			                            var oldY=Number($scope.validity.substr(0,4));
                                        if((oldY-newY)>=90 || oldY==9999){
			                                applicant.idEndDate='长期有效';
			                            }else{
			                                applicant.idEndDate=$scope.validity;
			                            }     
		                            }

									$scope.applicant.IDNAME = applicant.idType;
									$scope.applicant.IDNO = applicant.idNo;
									$scope.applicant.ID_END_DATE = applicant.idEndDate;
									$scope.applicant.NATIVE_PLACE = applicant.nativePlace;
									//$scope.applicant.RGT_ADDRESS = applicant.RGT_PROVINCE;
									$scope.applicant.RGT_ADDRESS = applicant.rgtProvince + applicant.rgtCity;//+applicant.HOUSEHOLD_COUNTY;
									$scope.applicant.MARRIY = applicant.marriage;
									$scope.applicant.INCOME = applicant.income;
									$scope.applicant.INCOME_WAY = applicant.incomeWay;
									$scope.applicant.WORK_UNIT = applicant.grpName;
									//$scope.applicant.OTHER_INCOME_WAY = applicant.otherIncomeWay;
									$scope.applicant.PHONE = applicant.mobile;
									$scope.applicant.COMPANY_PHONE = applicant.phone;
									$scope.applicant.EMAIL = applicant.email;
									//针对山西机构把4，5级地址放到address									
								    if(organCode.substr(0,4) == '8614'){
									    var COMPANY_ADDRESS = applicant.postalAddress;
									    var s_COMPANY_ADDRESS='';
									    var lastStr = COMPANY_ADDRESS.split('@%@');
									        for(i=0;i<lastStr.length;i++){
									          s_COMPANY_ADDRESS+=lastStr[i];
									        }
									        applicant.postalAddress=s_COMPANY_ADDRESS; // 单位地址
									    var HOME_ADDRESS = applicant.homeAddress;
									    var s_HOME_ADDRESS = '';
									    var lastStr = HOME_ADDRESS.split('@%@');
									        for(i=0; i< lastStr.length;i++){
									          s_HOME_ADDRESS += lastStr[i];
									        }
									        applicant.homeAddress=s_HOME_ADDRESS;  // 家庭住址
								    }
								
									if(applicant.postalProvince=="北京" ||applicant.postalProvince=="上海"||applicant.postalProvince=="天津"||applicant.postalProvince=="重庆"){
										$scope.applicant.MAILING_ADDRESS = applicant.postalCity+applicant.postalCounty+applicant.postalAddress;
									}else{
										$scope.applicant.MAILING_ADDRESS = applicant.postalProvince +applicant.postalCity+applicant.postalCounty+applicant.postalAddress;
									}
									$scope.applicant.MAILING_ZIP_CODE = applicant.postalZipCode
									if(applicant.homeProvince=="北京" ||applicant.homeProvince=="上海"||applicant.homeProvince=="天津"||applicant.homeProvince=="重庆"){
										$scope.applicant.HOME_ADDRESS = applicant.homeCity+applicant.homeCounty+applicant.homeAddress;
									}else{
										$scope.applicant.HOME_ADDRESS = applicant.homeProvince +applicant.homeCity+applicant.homeCounty+applicant.homeAddress;
									}
									$scope.applicant.HOME_ZIP_CODE = applicant.homeZipCode;											

									//下面开始进行被保人赋值	
									$scope.recognizee.NAME = recognizee.realName;
									$scope.recognizee.SEX = recognizee.sex;
									$scope.recognizee.BIRTHDAY = recognizee.birthday;
									$scope.recognizee.RELATION = recognizee.relationToMainInsured;
									$scope.recognizee.OCCUPATION_CODE = recognizee.occupationCode;
									$scope.recognizee.OCCUPATION = recognizee.occupationCodeName;
									$scope.recognizee.PLURALITY_OCCUPATION_CODE_NAME = recognizee.pluralityOccupationName;
									// 日期时间戳和日期转换  add by renxiaomin 2016.11.23
		                          	if((typeof recognizee.idEndDate == 'string') && recognizee.idEndDate != '长期有效'){
			                            $scope.validity=recognizee.idEndDate;
			                            var R=new Date();
			                            var newY=R.getFullYear();
			                            var oldY=Number($scope.validity.substr(0,4));
                                        if((oldY-newY)>=90 || oldY==9999){
			                                recognizee.idEndDate='长期有效';
			                            }else{
			                                recognizee.idEndDate=$scope.validity;
			                            }     
		                            }

									$scope.recognizee.IDNAME = recognizee.idType;
									$scope.recognizee.IDNO = recognizee.idNo;
									$scope.recognizee.ID_END_DATE = recognizee.idEndDate;
									$scope.recognizee.NATIVE_PLACE = recognizee.nativePlace;
									//$scope.recognizee.RGT_ADDRESS = recognizee.RGT_PROVINCE;
									$scope.recognizee.RGT_ADDRESS = recognizee.rgtProvince + recognizee.rgtCity;//+recognizee.HOUSEHOLD_COUNTY;
									$scope.recognizee.MARRIY = recognizee.marriage;
									$scope.recognizee.INCOME = recognizee.income;
									$scope.recognizee.INCOME_WAY = recognizee.incomeWay;
									$scope.recognizee.WORK_UNIT = recognizee.grpName;
									//$scope.recognizee.OTHER_INCOME_WAY = recognizee.otherIncomeWay;
									$scope.recognizee.PHONE = recognizee.mobile;
									$scope.recognizee.COMPANY_PHONE = recognizee.phone;
									$scope.recognizee.EMAIL = recognizee.email;
									//针对山西机构把4，5级地址放到address									
								    if(organCode.substr(0,4) == '8614'){
									    var COMPANY_ADDRESS = recognizee.postalAddress;
									    var s_COMPANY_ADDRESS='';
									    var lastStr = COMPANY_ADDRESS.split('@%@');
									        for(i=0;i<lastStr.length;i++){
									          s_COMPANY_ADDRESS+=lastStr[i];
									        }
									        recognizee.postalAddress=s_COMPANY_ADDRESS; // 单位地址
									    var HOME_ADDRESS = recognizee.homeAddress;
									    var s_HOME_ADDRESS = '';
									    var lastStr = HOME_ADDRESS.split('@%@');
									        for(i=0; i< lastStr.length;i++){
									          s_HOME_ADDRESS += lastStr[i];
									        }
									        recognizee.homeAddress=s_HOME_ADDRESS;  // 家庭住址
								    }
									if(recognizee.postalProvince=="北京" ||recognizee.postalProvince=="上海"||recognizee.postalProvince=="天津"||recognizee.postalProvince=="重庆"){
										$scope.recognizee.MAILING_ADDRESS = recognizee.postalCity+recognizee.postalCounty+recognizee.postalAddress;
									}else{
										$scope.recognizee.MAILING_ADDRESS = recognizee.postalProvince +recognizee.postalCity+recognizee.postalCounty+recognizee.postalAddress;
									}
									$scope.recognizee.MAILING_ZIP_CODE = recognizee.postalZipCode
									if(recognizee.homeProvince=="北京" ||recognizee.homeProvince=="上海"||recognizee.homeProvince=="天津"||recognizee.homeProvince=="重庆"){
										$scope.recognizee.HOME_ADDRESS = recognizee.homeCity+recognizee.homeCounty+recognizee.homeAddress;
									}else{
										$scope.recognizee.HOME_ADDRESS = recognizee.homeProvince +recognizee.homeCity+recognizee.homeCounty+recognizee.homeAddress;
									}
									$scope.recognizee.HOME_ZIP_CODE = recognizee.homeZipCode;

									//受益人赋值									
									var benefitList = [];//受益人数据
									for(b=0; b<benefitListJson.length; b++){
										var benefitListInfo = benefitListJson[b];
										var benefitJson = {};
										if(organCode.substr(0,4) == '8614'){										    
										    var HOME_ADDRESS =  benefitListInfo.address;
										    var s_HOME_ADDRESS = '';
										    var lastStr = HOME_ADDRESS.split('@%@');
									        for(i=0; i< lastStr.length;i++){
									          s_HOME_ADDRESS += lastStr[i];
									        }
									        benefitListInfo.address=s_HOME_ADDRESS;  // 家庭住址
									    }
										benefitJson["BENEFIT_TYPE"] = benefitListInfo.bnfType;
										benefitJson["NAME"] = benefitListInfo.realName;		
										benefitJson["SEX"] = benefitListInfo.sex;
										benefitJson["NATIVE_PLACE"] = benefitListInfo.nativePlace;
										benefitJson["BIRTHDAY"] = benefitListInfo.birthday;
										benefitJson["IDNAME"] = benefitListInfo.idType;
										benefitJson["IDNO"] = benefitListInfo.idNo;
										benefitJson["OCCUPATION"] = benefitListInfo.occupationCodeName;
										benefitJson["OCCUPATION_CODE"] = benefitListInfo.occupationCode;
										benefitJson["MOBILE"] = benefitListInfo.mobile;
										benefitJson["ID_END_DATE"] = benefitListInfo.idEndDate;
										benefitJson["RELATION"] = benefitListInfo.relationToInsured;			
										benefitJson["BENEFIT_RATE"] = benefitListInfo.bnfLot;
										benefitJson["BENEFIT_ORDER"] = benefitListInfo.bnfGrade;
										benefitJson["HOME_ADDRESS"] = benefitListInfo.address;
										benefitList[b] = benefitJson;
									}
									$scope.benefitList = benefitList;
									
									//险种数据									
									var insuranceList = data.insuredList[0].insuranceList;
									
									//投保事项中展示的险种数据
									var productArray = [];
									//首期保险费合计
									var firstPremiumTotal = 0;									
									if(insuranceList){
										//alert("insuranceList:"+JSON.stringify(insuranceList))
										$scope.applyBonusData = {};//医疗是否对象
										for(var i = 0 ; i < insuranceList.length ; i++){				
											var productInfo = insuranceList[i];
											var subJsonInfo = {};				
											subJsonInfo["PRODUCT_NAME"] = productInfo.productCode;//投保险种											
											if(productInfo.insuYearsFlag == "Y"){												
												subJsonInfo["INSU_YEARS"] = productInfo.insuYears+"年";												
											}
											if(productInfo.insuYearsFlag == "A"){
												if(productInfo.insuYears == "105"){
													subJsonInfo["INSU_YEARS"] = "终身";//保险期间	
												}else{
													subJsonInfo["INSU_YEARS"] = "至"+productInfo.insuYears+"周岁";
												}												
											}
												
											if(productInfo.payEndYear == "1000"){
												subJsonInfo["PAY_END_YEAR"] = "一次交清";
											}else{
												//114402特殊，交费年期展示为空
												// if(subJsonInfo["PRODUCT_NAME"] == "民生金生无忧年金保险（万能型）"){
												// 	subJsonInfo["PAY_END_YEAR"] = '';
												// }
												subJsonInfo["PAY_END_YEAR"] = productInfo.payEndYear+"年";//交费年期
											}											
																				
											subJsonInfo["PREM"] = (productInfo.prem) ? productInfo.prem : "0"; //标准保险费（元）
											subJsonInfo["JOB_ADD_FEE"] = (productInfo.jobAddFee) ? productInfo.jobAddFee : "0"; //职业加费（元）
																			
											if(productInfo.amount !='' && productInfo.multi !='0' && productInfo.multi != null){												
								                subJsonInfo["AMOUNT"] = productInfo.multi+"份";//保险金额（元）份数
								            }else if(productInfo.amount!='' && productInfo.amount != null && (productInfo.multi==''|| productInfo.multi =='0' || productInfo.multi != null)){								            
								                subJsonInfo["AMOUNT"] = productInfo.amount;//保险金额
								            }else{												
												subJsonInfo["AMOUNT"] = productInfo.amount;
											}
											productArray[i] = subJsonInfo;
											//首期保险费合计=保费+职业加费
											firstPremiumTotal = numAdd(firstPremiumTotal,numAdd(subJsonInfo["PREM"],subJsonInfo["JOB_ADD_FEE"]));											
											/********带是否有医疗保险的险种保单预览展示*********/								
											//if("socialInsuFlag" in productInfo){											
												if(productInfo.socialInsuFlag){													
													$scope.BONUS = true;
													if(productInfo.socialInsuFlag == 'N'){											
														$scope.applyBonusData.BONUS_GET_MODE = false;																						
													}else if(productInfo.socialInsuFlag == 'Y'){
														$scope.applyBonusData.BONUS_GET_MODE = true;																																				
													}
												}
												
											//}	
											if(productInfo.dealType){
												//alert("医疗是否:"+JSON.stringify(productInfo.dealType));		
												if(productInfo.dealType.getYear){
													$scope.GETYEAR= productInfo.dealType.getYear; //年金领取开始领取年龄												
												}
												if(productInfo.dealType.getYearKind){
													$scope.GETCOMPUTEMODE= productInfo.dealType.getYearKind; //年金领取计算方式												
												}
												if(productInfo.dealType.getDutyKind){												
													$scope.getDutyKind = productInfo.dealType.getDutyKind; //年金领取开始领取方式																							
												}
												if(productInfo.dealType.bonusGetMode){													
													if(productInfo.dealType.bonusGetMode == 'N' || productInfo.dealType.bonusGetMode == 'Y'){														
														$scope.BONUS = true;														
														if(productInfo.dealType.bonusGetMode == 'N'){	//是否有医保										
															$scope.applyBonusData.BONUS_GET_MODE = false;															
														}else if(productInfo.dealType.bonusGetMode == 'Y'){															
															$scope.applyBonusData.BONUS_GET_MODE = true;																										
														}
													}else{														
														$scope.bonusGetWay=productInfo.dealType.bonusGetMode;//红利领取方式	
													}																																					
												}												
											}										
										}																			
									}
									$scope.productArray = productArray;
									$scope.firstPremiumTotal = firstPremiumTotal;//首期保险费合计
									//投保事项（续）																							
									$scope.payMode = baseInfo.payIntv;//交费方式									
									$scope.applyPayData = {};//续期缴费
									$scope.applyPayData.IS_NOTICE = (baseInfo.renewRemindFlag=="1") ? true : false;//缴费提示								
									$scope.applyPayData.IS_PAY_FOR = (baseInfo.autoPayFlag=="1") ? true : false;//保险费是否自动垫交									
									$scope.applyPayData.IS_INSURE =(baseInfo.electronicContFlag=="Y" && baseInfo.elecprintflag=="N") ? true : false;//电子保单标记
									$scope.applyPayData.IS_INSURE_PAPER = (baseInfo.elecprintflag=="Y") ? true : false;//电子+纸质标记									
									$scope.applyPayData.BANK_CODE = baseInfo.bankCode; //银行机构
									$scope.applyPayData.APPLICANT_NAME = baseInfo.accName;  //开户名
									$scope.applyPayData.BANK_NO = baseInfo.bankAccNo; //银行卡号	
									$scope.applyPayData.bankSubType = (baseInfo.bankSubType == '1') ? "存折" : "银行卡";																
									$scope.applyPayData.bankProvince = baseInfo.bankProvince;
									$scope.applyPayData.bankCity = baseInfo.bankCity;
									$scope.applyPayData.bankPhone = baseInfo.bankPhone;//银行预留手机号

									//健康告知保单详情中的告知列表
									var appntImpartJsonList = data.appntImpartList;		//投保人告知
									var insurantImpartJsonList = data.insurantImpartList;	//被保人告知
									var agentImpartJsonList = data.agentImpartList;		//业务员告知
									
									//告知说明及备注栏Table
									var explainTable = document.getElementById("explainTable");
									//如果表格有数据则清空，避免重复加载
									var rowCount = explainTable.rows.length;
									if(rowCount > 2){
										for(var i = 1 ; i < rowCount - 1 ; i++){
											explainTable.deleteRow(1);
										}
									}
									//投保人告知数据加载
									if(appntImpartJsonList){
										for(var i = 0 ; i < appntImpartJsonList.length ; i++){
											var appntImpartJson = appntImpartJsonList[i];
											//设置‘是否’复选框的选中状态
											var dataContainerId = "applicant_" + appntImpartJson.impartVersion + "_" + appntImpartJson.impartCode;
											var checkboxOuterDiv = document.getElementById(dataContainerId);
											if(checkboxOuterDiv){
												var checkboxInputs = checkboxOuterDiv.getElementsByTagName("input");
												for(var j = 0 ; j < checkboxInputs.length ; j++){
													checkboxInputs[j].checked = false;
													if(appntImpartJson.impartFlag == checkboxInputs[j].value){
														checkboxInputs[j].checked = true;
													}
												}
											}
											//设置告知内容
											if(appntImpartJson.impartFlag == "2" || appntImpartJson.impartFlag == "1")
											{
												var impartContentArray = appntImpartJson.impartContent.split("/");
												for(var j = 0 ; j < impartContentArray.length ; j++){
													var dataContainer = document.getElementById(dataContainerId + "_" + j);
													if(dataContainer){								
														if(dataContainer.tagName == "CHECKBOX"){
															// if(dataContainer.value == impartContentArray[j]){
															// 	dataContainer.checked = true;
															// }
														}else{
															dataContainer.innerHTML = impartContentArray[j];
														}
													}
												}
												if(appntImpartJson.impartCode=='A0531'){
													var licenseContent=appntImpartJson.impartContent.split("/");
													var insurant=document.getElementsByName('applicant');					
													for(var s = 0; s < insurant.length; s++){
														var license = document.getElementById(dataContainerId + "_" + s);
														license.checked=false;
														for(var js = 0; js < licenseContent.length;js++){						
															if(licenseContent[js]==insurant[s].value){
																license.checked=true;												
															}
														}
													}
												}
											}
											//将询问结果为‘是’的详细告知内容提取出来并放到‘告知说明及备注栏’表格中
											if(appntImpartJson.impartFlag == "1"){
												//存在‘name’属性的div才需要展示到‘告知说明及备注栏’表格中
												var impartNumber = checkboxOuterDiv.getAttribute("name");
												if(impartNumber){
													var insertRow = explainTable.insertRow(explainTable.rows.length-1);
													var serialNumber = insertRow.insertCell(0);
									     		    var explainName = insertRow.insertCell(1);
									     		    var explainContext = insertRow.insertCell(2);
									     		    serialNumber.innerHTML = impartNumber;
									     		    explainName.innerHTML = "投保人";
									     		    explainContext.innerHTML = appntImpartJson.impartContent;
												}
											}
										}
									}

									//被保人告知数据加载
									if(insurantImpartJsonList){
										for(var i = 0 ; i < insurantImpartJsonList.length ; i++){
											var insurantImpartJson = insurantImpartJsonList[i];
											//设置‘是否’复选框的选中状态
											var dataContainerId = "insurant_" + insurantImpartJson.impartVersion + "_" + insurantImpartJson.impartCode;
											var checkboxOuterDiv = document.getElementById(dataContainerId);
											if(checkboxOuterDiv){
												var checkboxInputs = checkboxOuterDiv.getElementsByTagName("input");
												for(var j = 0 ; j < checkboxInputs.length ; j++){
													checkboxInputs[j].checked = false;
													if(insurantImpartJson.impartFlag == checkboxInputs[j].value){
														checkboxInputs[j].checked = true;
													}
												}
											}
											//设置告知内容
											if(insurantImpartJson.impartFlag == "2" || insurantImpartJson.impartFlag == "1")
											{
												var impartContentArray = insurantImpartJson.impartContent.split("/");
												for(var j = 0 ; j < impartContentArray.length ; j++){
													var dataContainer = document.getElementById(dataContainerId + "_" + j);
													if(dataContainer){
														if(dataContainer.type == "checkbox"){
															// if(dataContainer.value == impartContentArray[j]){
															// 	dataContainer.checked = true;
															// }
														}else{
															dataContainer.innerHTML = impartContentArray[j];
														}
													}
												}
												if(insurantImpartJson.impartCode=='A0531'){
													var licenseContent=insurantImpartJson.impartContent.split("/");
													var insurant=document.getElementsByName('insurant');
													for(var s = 0; s < insurant.length; s++){
														var license = document.getElementById(dataContainerId + "_" + s);
														license.checked = false;
														for(var js = 0; js < licenseContent.length;js++){						
															if(licenseContent[js]==insurant[s].value){
																license.checked=true;												
															}
														}
														
													}
												}
											}
											//将询问结果为‘是’的详细告知内容提取出来并放到‘告知说明及备注栏’表格中
											if(insurantImpartJson.impartFlag == "1"){
												//存在‘name’属性的div才需要展示到‘告知说明及备注栏’表格中
												var impartNumber = checkboxOuterDiv.getAttribute("name");
												if(impartNumber){
													var insertRow = explainTable.insertRow(explainTable.rows.length - 1);
													var serialNumber = insertRow.insertCell(0);
									     		    var explainName = insertRow.insertCell(1);
									     		    var explainContext = insertRow.insertCell(2);
									     		    serialNumber.innerHTML = impartNumber;
									     		    explainName.innerHTML = "被保险人";
									     		    explainContext.innerHTML = insurantImpartJson.impartContent;
												}
											}
										}
									}
								
								
									//加载‘声明授权’表格中动态信息
									var applicationDate = document.getElementById("applicationDate");
									var applicationDate2 = document.getElementById("applicationDate2");
									//var applicationDate3 = document.getElementById("applicationDate3");
									var agent_org = document.getElementById("agent_org");
									var agent_name = document.getElementById("agent_name");
									var agent_code = document.getElementById("agent_code");
									
									if(applicationDate){
										applicationDate.innerHTML = getDateToYears(baseInfo.applyDate); //申请日期
									}
									if(applicationDate2){
										applicationDate2.innerHTML = getDateToYears(baseInfo.applyDate);
									}
									
									//获取baseInfo中agentMap数据						
									var agentOrg = baseInfo.saleChannel ? baseInfo.saleChannel : "";//销售渠道
									agent_org.innerHTML = agentOrg;					
									var agentName = baseInfo.agentName ? baseInfo.agentName : "";
									agent_name.innerHTML = agentName;					
									var agentCode = baseInfo.agentCode ? baseInfo.agentCode : "";
									agent_code.innerHTML = agentCode; 
								});
							}
						});
					// }
				// }
	// });

	//保单预览关闭按钮
	$scope.closeDatas = function (){
		//$rootScope.selectedRow = '-1';		
		if(pctype == '' || pctype == 'pad'){
			$state.go('menu.submit.insurance_outline',{"indexNo": indexNo});
		}else{
			$state.go('insurance_outline',{"indexNo": indexNo});
		}
		
	}
	
})
/**********在线投保 by kezhi**********/
	.controller('NeedKnowCtrl', function($scope,$state,$stateParams,$compile,$ionicPopup,$rootScope,$ionicSlideBoxDelegate,$ionicActionSheet,$ionicLoading,$timeout,CommonFn,unFinshedInsurance,Variables,initData,submitInsurance,$sce,$ionicModal) {
		// var organCode='';
  //   	organCode = window.localStorage.getItem('organCode');
    	var organ=organCode.substr(0,4); //业务员4位code
    	var pcType = document.getElementById("pctype").value;
    	var isreleated = $stateParams.isreleated;
		isPassSign = false; 
		$scope.copyFlag = false;
        //判断是否为天津机构
        if(organ == '8612'){
            $scope.isTj = true;
        }else{
            $scope.isTj = false;
        }
		//alert($stateParams.applyid)
		//未提交保单再次提交的入口
		if($stateParams.applyid!='none') {
			var apply_Id = $stateParams.applyid;
			document.getElementById("formID").value = apply_Id;
			document.getElementById("propsalID").value = c_proposal_id;
			findCustomer(apply_Id);
			
			//验证产品说明tab是否显示 
			var url = "xml/product.xml";
			var isShow = checkProductInfoIsHasFn(url,mianIsureId);
			if(mianIsureId){
				if(isShow){ //显示
					$scope.cpsm_li = true; 
				}else{
					$scope.cpsm_li = false;  
				}
				// if(mianIsureId=='111805'){
				// 	$scope.yyB_li=true;
				// }else{
				// 	$scope.yyB_li=false;
				// }
				if((mianIsureId == '111408' || mianIsureId == '111901' || mianIsureId == '112406' || mianIsureId == '112407' || mianIsureId == '111406') && (isreleated == '03' || isreleated == 'Y')){
					$scope.glbd_li = true;
				}else{
					$scope.glbd_li = false;
					if(mianIsureId == '114403'){
						$scope.glbd_li = true;
					}
				}
			}else{
				$scope.cpsm_li = true;  
			}
		}else{	//建议书转投保入口
			//初始化
		} 
		//保单提交状态
		var insuranceStateFlag = false;	//默认‘未提交’状态
		
		//保单是否提交成功
		$rootScope.insuranceSubmitSuccess = false;
		
		//证件照片、电子签名照片后缀名
		var suffixName = ".png";
		
		//当前系统时间
		$scope.currentDate = getDateString("");
		
		//判断当前险种是否可以抄录申明
		//if(mianIsureId){
		//	initCopyStatementState(mianIsureId,$scope);
		//}
	   //判断当前险种是否可以抄录申明 add by lishuang 2017-04-02
		// if(mianIsureId){
		// 		if(mianIsureId=='112405'||mianIsureId=='112227'||mianIsureId=='112228'|| code.indexOf('121402') > -1 || code.indexOf('121403') > -1 || code.indexOf('121404') > -1 || code.indexOf('122201') > -1 || code.indexOf('122202') > -1|| code.indexOf('122203') > -1){
		// 		   $scope.copystatementState = true;
		// 		}
		// }
		
		//影像录入中证件URL初始化
		$scope.applicantInfo = {"CARD_FRONT" : "","CARD_REVERSE" : ""};
		$scope.insurantInfo = {"CARD_FRONT" : "","CARD_REVERSE" : ""};
		
		//电子签名中所有图片{投保人照片和签名、[投保人照片和签名、被保人照片和签名]、抄录声明照片}
		var signInsurnoticeList = new Array();
		var signApplyList = new Array();
        var signConfirmationList =  new Array();//天津销售确认书影像路径
        var signConApp1 = new Array();//天津销售确认书影像路径投保人1
        var signConAgent = new Array();//天津销售确认书影像路径销售人员
        var signConApp2 = new Array();//天津销售确认书影像路径投保人2
		
// 		if(brows().iphone){ //pingguo  
// 			//初始化影像录入投保人证，被保人证，受益人证
// 			 $scope.tbrFront = "ar/mobile/Containers/Data/Application/222EFB83-8D14-4ED5-873B-0FBF86EF48F6/Library/Caches/photoLib/"+$stateParams.applyid+"front-tbr"+"?random="+Math.random(); 
// 			 $scope.tbrBack  = "ar/mobile/Containers/Data/Application/222EFB83-8D14-4ED5-873B-0FBF86EF48F6/Library/Caches/photoLib/"+$stateParams.applyid+"back-tbr"+"?random="+Math.random();  
// //			 alert($scope.tbrFront)
// 			 $scope.bbrFront = "ar/mobile/Containers/Data/Application/222EFB83-8D14-4ED5-873B-0FBF86EF48F6/Library/Caches/photoLib/"+$stateParams.applyid+"front-bbr"+"?random="+Math.random();
// 			 $scope.bbrBack  = "ar/mobile/Containers/Data/Application/222EFB83-8D14-4ED5-873B-0FBF86EF48F6/Library/Caches/photoLib/"+$stateParams.applyid+"back-bbr"+"?random="+Math.random();  
// 		}else{
// 			//初始化影像录入投保人证，被保人证，受益人证
// 			 $scope.tbrFront = "/storage/emulated/0/com.ns.appmanagement/image/"+$stateParams.applyid+"front-tbr.jpg"+"?random="+Math.random(); 
// 			 $scope.tbrBack  = "/storage/emulated/0/com.ns.appmanagement/image/"+$stateParams.applyid+"back-tbr.jpg"+"?random="+Math.random();  
			 
// 			 $scope.bbrFront = "/storage/emulated/0/com.ns.appmanagement/image/"+$stateParams.applyid+"front-bbr.jpg"+"?random="+Math.random();
// 			 $scope.bbrBack  = "/storage/emulated/0/com.ns.appmanagement/image/"+$stateParams.applyid+"back-bbr.jpg"+"?random="+Math.random();  
// 		} 
			 
		/**
		 * 初始值
		 */
		//tab初始值
		var step1 = $scope.step1 = {};
		var step2 = $scope.step2 = {};
		var step3 = $scope.step3 = {};
		
		//var pctype = document.getElementById("pctype").value; //客户类型
		if('phone' == pcType){
			$scope.pcFlag = false;
			$scope.ionSlideBoxCss = 'slide_box_phone';
		}else{
			$scope.pcFlag = true;
			$scope.ionSlideBoxCss = 'insure-tabs';
		}
		
		$scope.step8  = {activeTab : 0};
		$scope.submitData = false;
		//投保须知
		$scope.clickTab1 = function (i){
			if(i == 4){
				$scope.slideIndex  = 1;
			}else{
				$scope.step1 = {activeTab : i} ;
			}
		};
		 
		kneeScope = $scope;
		/***投保须知模块 Li Jie start ********/		 
			
			// 单独打开条款		
			$scope.openTiaoKuan = function(){
				var paramArray = [];
				if(allIsuresArray && allIsuresArray.length > 0){
					for(var i = 0; i<allIsuresArray.length; i++){
				        if(allIsuresArray[i][0].length >= 6 && allIsuresArray[i][0] != 'undefined') {
							paramArray.push("promodel/10003/product/"+allIsuresArray[i][0]+"/"+allIsuresArray[i][0]+".pdf");
						}else{
							paramArray.push("promodel/10003/product/"+allIsuresArray[i]+"/"+allIsuresArray[i]+".pdf");
						}
					}
				}
				var paramStr = paramArray.join(",");
				var openJson = {"readPath":paramStr,"flag":'doubleCopy'};
				loadPDFPath(openJson,function(str){
		        },function (){
			            //失败时回调
			            alertPopupFun($timeout,$ionicPopup,'loser','pdf打开失败',3000);  
		        }); 
			}
			//投保须知同意
			// setTimeout(function(){ //点击过快主险ID加载不出来，增加延迟
				$scope.openTbxzPdfAgree = function (){    
					//document.getElementById("tbxz_agree_btn").disabled = true;
					// alert('allIsuresArray==='+JSON.stringify(allIsuresArray)+mianIsureId)
					var  openJson = {"readPath":"promodel/10005/www/xml/notes.pdf"};			 	 
			        loadPDFPath(openJson,function(str){ 
						//document.getElementById("tbxz_agree_btn").disabled = false;
			        	if(str == '1'){ //同意为1 
			        		    document.getElementById("tbxz_agree").value = true; 
			        		    $timeout(function(){   
										$scope.step1 = {
											activeTab:2
										}
								},1000); 
								 
			        	}else{//关闭
			        			document.getElementById("tbxz_agree").value = false;
			        	}	
			        });
				};
			// },2000)	
			//同意保险条款
			$scope.openTbtkPdfAgree = function(){ 
//					document.getElementById("bxtk_agree_btn").disabled = true;
					var paramArray = [];
					if(allIsuresArray && allIsuresArray.length > 0){
						for(var i = 0; i<allIsuresArray.length; i++){
					        if(allIsuresArray[i][0].length >= 6 && allIsuresArray[i][0] != 'undefined') {
								paramArray.push("promodel/10003/product/"+allIsuresArray[i][0]+"/"+allIsuresArray[i][0]+".pdf");
							}else{
								paramArray.push("promodel/10003/product/"+allIsuresArray[i]+"/"+allIsuresArray[i]+".pdf");
							}
									
						}
					}
					var paramStr = paramArray.join(",");
					var openJson = {"readPath":paramStr};
			        loadPDFPath(openJson,function(str){ 
//						document.getElementById("bxtk_agree_btn").disabled = false;
			        	if(str == '1'){ //同意为1 
							var isShowCpsm = $scope.cpsm_li;
		        		    if(isShowCpsm == true){
		        		      	document.getElementById("cpsm_agree").value = false;
								$timeout(function(){										
									$scope.step1 = {
										activeTab:3
									}									
								},1000);
		        		    }else{			        		     	
		      //   		     	if(mianIsureId=='111805'){
		      //   		     		document.getElementById("Auto_agree").value = false;
								// 	document.getElementById("Glbd_agree").value = true;
								// 	$scope.yyB_li=true;
								// 		$timeout(function(){										
								// 			$scope.step1 = {
								// 				activeTab:3
								// 			}									
								// 		},1000);
								// }else{
									if(mianIsureId=='114403' || isreleated == '03' || isreleated == 'Y'){
										document.getElementById("Glbd_agree").value = false;
										$scope.glbd_li=true;
										$timeout(function(){										
											$scope.step1 = {
												activeTab:4
											}									
										},1000);
									}else{
										document.getElementById("Glbd_agree").value = true;			
										$scope.glbd_li=false;
									}									
									//document.getElementById("Glbd_agree").value = true;
									// if(mianIsureId=='114403' || mianIsureId == '111406'){
									// 	document.getElementById("Glbd_agree").value = false;
									// }
									
								// }
								document.getElementById("cpsm_agree").value = true;
		        		    }
		        		    document.getElementById("bxtk_agree").value = true;  
			        		    
			        	}else{//关闭
		        			document.getElementById("bxtk_agree").value = false;
			        	}	
			        });
			}
			
			//产品说明
			$scope.openCpsmPdfAgree = function (){  
//				document.getElementById("cpsm_agree_btn").disabled = true;
//				alert("mianIsureId:" + mianIsureId)
					//获取主线的ID 

				 	var  openJson = {"readPath":"promodel/10003/product/"+mianIsureId+"/spec"+mianIsureId+".pdf"};
			        loadPDFPath(openJson,function(str){ 
//						document.getElementById("cpsm_agree_btn").disabled = false;
			        	if(str == '1'){ //同意为1  
			        		if($scope.glbd_li == true){
			        			document.getElementById("Glbd_agree").value = false;

								$timeout(function(){
									$scope.step1 = {
										activeTab:4
									}
								},1000);
			        		}else{
			        			document.getElementById("cpsm_agree").value = true; 
			        		    
			        		    document.getElementById("Glbd_agree").value = true;
			        		}
			        		document.getElementById("cpsm_agree").value = true; 
			        		  								 
			        	}else{//关闭
			        		document.getElementById("cpsm_agree").value = false;
			        		
			        	}	
			        });
			};
			//优医保自动续保须知
			$scope.yyB_li=false;
			$scope.glbd_li=false;//关联保单须知
			// if(mianIsureId=='111805'){
			// 	$scope.yyB_li=true;
			// }else{
				if((mianIsureId == '111408' || mianIsureId == '111901' || mianIsureId == '112406' || mianIsureId == '112407' || mianIsureId == '111406') && (isreleated == '03' || isreleated == 'Y')){
					$scope.glbd_li=true;
				}else{
					$scope.glbd_li=false;
					if(mianIsureId=='114403'){
						$scope.glbd_li=true;
					}
				}
				
			// }
			
			$scope.openGlbdPdfAgree = function(){
				var  openJson = {"readPath":"promodel/10005/www/xml/notes2.pdf"};
				loadPDFPath(openJson,function(str){ 
		        	if(str == '1'){ //同意为1 
		        		document.getElementById("Glbd_agree").value = true; 
						//document.getElementById("cpsm_agree").value = true; 
							 
		        	}else{//关闭
		        		document.getElementById("Glbd_agree").value = false;
		        		//document.getElementById("cpsm_agree").value = true; 
		        		 	 
		        	}	
		        });
			}

			
		/***投保须知模块 Li Jie end ********/		
		
		/**电子签名Tab ---Li Jie Start*/
		 
		//$scope.targetUrl = "promptbook/"+agentCode.substring(0,4)+".html";	 
		
		isPassSign = false; 
		//$scope.step8  = {activeTab : 1};
		$scope.submitData = false;
		//保单提交的切换
		$scope.clickTab8 = function (i){
			if(allIsuresArray.length>0){ //抄录声明的险种显示 
				for(var j=0;j<allIsuresArray.length;j++){
					if(allIsuresArray[j].indexOf('112228') > -1 || allIsuresArray[j].indexOf('112227') > -1 || allIsuresArray[j].indexOf('112226') > -1 || allIsuresArray[j].indexOf('114403') > -1 || allIsuresArray[j].indexOf('112406') > -1 || allIsuresArray[j].indexOf('112407') > -1 || allIsuresArray[j].indexOf('114402') > -1 || allIsuresArray[j].indexOf('111406') > -1 || allIsuresArray[j].indexOf('124405') > -1){
						$scope.copystatementState = true;
						$scope.copyState=false;
					}
				}
			}		
			 if(isPassSign && i != 1){
			 	 if(i == 1 || i == 2){
				 	$scope.submitData  = false;
				 }else{					
				 	$scope.submitData  = true;
                     if(($scope.copyFlag==true&&$scope.isTj==false && i == 3) || ($scope.copyFlag==false&&$scope.isTj==true && i == 3) || ($scope.copyFlag==true&&$scope.isTj==true && i == 4)|| ($scope.copyFlag==false&&$scope.isTj==false && i == 2)){
                         $scope.submitData  = false;
                     }
				 }
				 if(2 == i){
				 	if(agentCode){
				 		$scope.targetUrl = "promptbook/"+organCode.substring(0,4)+".html"; 
	       	 	 	}
				 }
				 $scope.step8 = {activeTab : i};
			 } 
		};

		/*发送手机验证码*/ 
		$scope.sendSms = function (){ 
			 indexHour = 180;
			 var mobile = document.getElementById("mobile").value; 
			 if(!mobile){
			 		myAlert("请输入手机号码!");
			 }else{
			 	 document.getElementById("getSms_input").disabled = true;
			 	 var sendUrl = API_URL + "/app/apply/getAuthCode";
				 var json = {"url":sendUrl, "parameters": {"phone": mobile}};
				 httpRequestByPost(json, function (data) {
//					 alert("data:"+data);
						var jsonObj = eval("("+data+")");
						if(jsonObj){
							var code = jsonObj["status"].code;
							document.getElementById("getSms_input").disabled = false;
							if('0' == code){ //短信发送成功 
								whileThridHoursBTN(); //3分钟倒计时控制
							}else if('3' == code){
								myAlert('您的手机号码已获取过验证码，请在3分钟内不要重复操作！');
							}else{
								myAlert('签名验证码短信息发送失败，请重新获取。若长时间如此，请联系管理员处理！');
							}
						}else{
							document.getElementById("getSms_input").disabled = false;
							CommonFn.alertPopupFun($ionicPopup,'loser',"请求服务无数据返回，请重新尝试!",3000);
						}
				 },function(){
				 	document.getElementById("getSms_input").disabled = false;
				 	CommonFn.alertPopupFun($ionicPopup,'loser',"请求服务器失败，请重新尝试!",3000);
				 });
			 } 
		}; 
		/*验证短信验证码*/
		$scope.checkSMS = function(){			
			var mobile = document.getElementById("mobile").value; 
			var smsCode = document.getElementById("smsCode").value;
			var validateFalg = true;
			if(!mobile || !smsCode){
				myAlert("请输入手机号码或短信验证码!"); 
			}else{
				pageSignCtrlTime = 900;
				//document.getElementById("mobile").value ="";
	 			document.getElementById("smsCode").value ="";

				var sendUrl = API_URL + "/app/apply/checkAuthCode";
				var json = {"url":sendUrl, "parameters": {"phone": mobile,"authCode":smsCode}};
//				alert(mobile + "--" + smsCode + "--" +agentCode)
				httpRequestByPost(json, function (data) {
//					alert("提交data:"+data);
						var jsonObj = eval("("+data+")"); 
						if(jsonObj){
							var code = jsonObj["status"].code;
							$scope.$apply(function (){
				           	 	 if('0' == code){//验证成功
				           	 	 	isPassSign = true;
				           	 	 	indexHour = 0; 
				           	 	 	//初始化投保提示
				           	 	 	if(agentCode){ 
				           	 	 		$scope.targetUrl = "promptbook/"+organCode.substring(0,4)+".html"; 
				           	 	 	}
				           	 	 	pageSignCtrlTimeFn(); //15分钟的操作时间，过15分钟之后进行强制第一个tab，短信发送
									$scope.step8 = {activeTab:2};  //投保提示书
                                     if(pcType == "phone"){
                                         setStepTitle(1);
                                     }
									$scope.submitData  = false;
								}else{ //验证失败 
									isPassSign = false;
									$scope.submitData  = false;
									myAlert("短信验证码输入有误,请重新输入!");
									return;
									//$scope.step8 = {activeTab:1};  //短信发送
									
								}	
				           	}); 
						}
				});
			} 
		}
		
		
		/*抄录*/
		$scope.copySign = function(){
			$scope.copyState=true;
			myAlert("本人已经阅读保险条款，产品说明书和投保提示书，了解本产品的特点和保单利益的不确定性。");	
//1			document.getElementById("copy_button").style.display ="none";//按钮隐藏显示图片
//2			document.getElementById("copy_img").style.display ="";
//			
//	3		document.getElementById("copy_img").src = "img/test.jpg?"+Math.random(); 

			//当前的保单ID
			//var currentInsuranceId = document.getElementById("formID").value;
			//var json = {"applyID":currentInsuranceId}; 
//4			alert("抄录。json.applyID:"+json.applyID);
			// doSignatureCopy(json,function(str){
			// 	//重置高度
			// 	  document.getElementById("content-2").style.height ="100%"; 
				  
			// 	//重置高度
			// 	  document.getElementById("content-3").style.height ="100%"; 
			// 	if(str){
			// 		var signObj = eval("("+str+")");
			// 		if(signObj){
			// 			var signPath = signObj["signaturePath"]+"?"+Math.random();
						
			// 			document.getElementById("copy_button").style.display ="none";//按钮隐藏显示图片
			// 			document.getElementById("copy_img").style.display ="";
						
			// 			document.getElementById("copy_img").src = signPath;
			// 			signMap["copy_photo"] = signObj["signaturePath"];
						
		 //  				signApplyList.push(signObj["signaturePath"]);
			// 		}
			// 	} 
			// });
		}
		//抄录end
		/*电子签名插件*/
		$scope.signMarkFn = function(type,tableID,contentID){		 
			//当前的保单ID
			var currentInsuranceId = document.getElementById("formID").value;
			var GatherJson = {"applicantName":$scope.applicantData.NAME,"applicantIdno":$scope.applicantData.IDNO,"recognizeeName":$scope.recognizeeData.NAME,"recognizeeIdno":$scope.recognizeeData.IDNO};
			var json = {"tableID":tableID,"applyID":currentInsuranceId,"ContentID":contentID,"GatherJson" : GatherJson}; 
			//alert("签名json:"+JSON.stringify(json));
			doSignature(json,function(str){
				//alert("str++"+str)
				//重置高度
				document.getElementById("content-2").style.height ="100%"; 
				document.getElementById("content-3").style.height ="100%";
                document.getElementById("content-4").style.height ="100%";
				if(str){
			  		var signObj = eval("("+str+")");
		  			if(signObj){
	  			    	if('1' == type){//投保人签名
	  			    		document.getElementById("sign_button").style.display ="none";//按钮隐藏显示图片
			  			    document.getElementById("people_photo").style.display ="block";
			  			    document.getElementById("sign_photo").style.display ="block";
			  			    document.getElementById("sign_photo_bak").style.display="none";
			  			    
			  				var photoPath = signObj["photoPath"]+"?"+Math.random();
			  				var signaturePath = signObj["signaturePath"]+"?"+Math.random();
			  				
			  				document.getElementById("people_photo").src =photoPath;
			  				document.getElementById("sign_photo").src =signaturePath;
							signMap["1_20_people_photo"] = signObj["photoPath"]; //投保人相片url
			  				signMap["1_20_sign_photo"]  = signObj["signaturePath"];//投保人签名的URL
			  				
			  				signInsurnoticeList.push(signObj["photoPath"]);
			  				signInsurnoticeList.push(signObj["signaturePath"]);
	  			    	}else if('2' == type){//投保人签名
		  			    		document.getElementById("tow_sign_button").style.display ="none";//按钮隐藏显示图片
				  			    document.getElementById("two_people_photo").style.display ="block";
				  			    document.getElementById("two_sign_photo").style.display ="block";
				  			    document.getElementById("two_sign_photo_bak").style.display="none";
				  			    
				  				var photoPath = signObj["photoPath"]+"?"+Math.random();
				  				var signaturePath = signObj["signaturePath"]+"?"+Math.random();
				  				
				  				document.getElementById("two_people_photo").src =photoPath;
				  				document.getElementById("two_sign_photo").src =signaturePath;
								signMap["2_21_people_photo"] = signObj["photoPath"]; //投保人相片url
				  				signMap["2_21_sign_photo"]  = signObj["signaturePath"];//投保人签名的URL
				  				
				  				signApplyList.push(signObj["photoPath"]);
				  				signApplyList.push(signObj["signaturePath"]);
		  			    }else if('3' == type){ //被保人签名
		  			    		document.getElementById("regin_button").style.display ="none";//按钮隐藏显示图片
				  			    document.getElementById("two_recgin_photo").style.display ="block";
				  			    document.getElementById("two_resign_photo").style.display ="block";
				  			    document.getElementById("two_sign_photo_bak").style.display="none";
				  			    
				  				var photoPath = signObj["photoPath"]+"?"+Math.random();
				  				var signaturePath = signObj["signaturePath"]+"?"+Math.random();
				  				
				  				document.getElementById("two_recgin_photo").src =photoPath;
				  				document.getElementById("two_resign_photo").src =signaturePath; 
				  				
								signMap["3_22_people_photo"] = signObj["photoPath"]; //被保人相片url
				  				signMap["3_22_sign_photo"]  = signObj["signaturePath"];//被保人签名的URL

				  				signApplyList.push(signObj["photoPath"]);
				  				signApplyList.push(signObj["signaturePath"]);
		  			    }else if(type=='4'){ //天津销售确认书销售人员签名
                            $(".sign_button_4").hide();//按钮隐藏显示图片
                            var photoPath = signObj["photoPath"]+"?"+Math.random();
                            var signaturePath = signObj["signaturePath"]+"?"+Math.random();

                            $(".people_photo_4").attr("src",photoPath).show();
                            $(".sign_photo_4").attr("src" ,signaturePath).show();

                            signMap["4_26_people_photo"] = signObj["photoPath"]; //销售人员相片url
                            signMap["4_26_sign_photo"]  = signObj["signaturePath"];//销售人员签名的URL
                            if(signConAgent.length>0){
                                signConAgent.splice(0,signConAgent.length);//清空数组
                            }
                            signConAgent.push(signObj["photoPath"]);
                            signConAgent.push(signObj["signaturePath"]);
                        }else if(type=='5'){//天津销售确认书投保人员签名
                            $(".sign_button_5").hide();//按钮隐藏显示图片
                            var photoPath = signObj["photoPath"]+"?"+Math.random();
                            var signaturePath = signObj["signaturePath"]+"?"+Math.random();
                            $(".people_photo_5").attr("src",photoPath).show();
                            $(".sign_photo_5").attr("src" ,signaturePath).show();

                            signMap["5_27_people_photo"] = signObj["photoPath"]; //投保人相片url
                            signMap["5_27_sign_photo"]  = signObj["signaturePath"];//投保人签名的URL
                            if(signConApp1.length>0){
                                signConApp1.splice(0,signConApp1.length);//清空数组
                            }
                            signConApp1.push(signObj["photoPath"]);
                            signConApp1.push(signObj["signaturePath"]);
                        }else if(type=='6'){//天津销售确认书投保人员核对签字签名 gudandie
                            $(".sign_button_6").hide();//按钮隐藏显示图片
                            var photoPath = signObj["photoPath"]+"?"+Math.random();
                            var signaturePath = signObj["signaturePath"]+"?"+Math.random();
                            $(".people_photo_6").attr("src",photoPath).show();
                            $(".sign_photo_6").attr("src" ,signaturePath).show();

                            signMap["6_28_people_photo"] = signObj["photoPath"]; //投保人相片url
                            signMap["6_28_sign_photo"]  = signObj["signaturePath"];//投保人签名的URL

                            if(signConApp2.length>0){
                                signConApp2.splice(0,signConApp2.length);//清空数组
                            }
                            signConApp2.push(signObj["photoPath"]);
                            signConApp2.push(signObj["signaturePath"]);
                        }
		  			}
			  	}else{
			  		myAlert("插件调用失败，请重新尝试。若多次尝试后仍然如此，请联系相关人员处理！");
			  	} 
			},function(){ 
				myAlert("失败");
			});  
		}	
		/**电子签名Tab ---Li Jie End*/
        //天津投保人核对签字
        $scope.checkSign = function (type,tableID,contentID) {
            if($(".appConfirm").attr('checked')){
                $scope.signMarkFn(type,tableID,contentID);
            }else{
                $(".people_photo_6").attr("src","").hide();
                $(".sign_photo_6").attr("src" ,"").hide();
                signMap["6_28_people_photo"] = ""; //投保人相片url
                signMap["6_28_sign_photo"]  = "";//投保人签名的URL
                if(signConApp2.length>0){
                    signConApp2.splice(0,signConApp2.length);//清空数组
                }
            }
        }
        //校验天津确认书缴费方式
        $scope.checkPayType = function (event) {
            //alert($(event.target).val());
            if($(event.target).attr('checked')){ //如果有checkbox状态为选中
                $(':checkbox[name="payType"]').removeAttr('checked'); //移除checked属性，改变checkbox状态为未选中(为页面中所有checkbox复选框添加设置)
                $(event.target).attr('checked','checked'); //为当前点击选中的checkbox复选框添加checked属性
            }
        }
        $scope.checkPayYear = function (event) {
            if($(event.target).attr('checked')){ //如果有checkbox状态为选中
                $(':checkbox[name="payYear"]').removeAttr('checked'); //移除checked属性，改变checkbox状态为未选中(为页面中所有checkbox复选框添加设置)
                $(event.target).attr('checked','checked'); //为当前点击选中的checkbox复选框添加checked属性
            }
        }

		//数据录入模块tab切换并保存，xiyawen add，2015-03-03
		$scope.clickTab2 = function (tabNumber) {
			/* 首先对操作前的选项卡内容进行保存，begin */
			//点击‘下一步’按钮，首先验证并保存当前页面数据，保存当前页面成功后验证整个大表单数据合法性，若均合法则继续。
			//点击某一个选项卡标题，首先验证并保存当前选项卡页面内容，然后跳转到指定选项卡
			var activeTab = $scope.step2.activeTab;	//当前选项卡（切换之前的选项卡）序号
			var applyId = document.getElementById("formID").value;	//保单ID
			
			//保存静态页面数据
			if (activeTab == 4) {
				//查询主险ID并加载选项卡页内容及数据
				var IS_ANEW_INSURES = "";				
				if(mianIsureId=='111805' || mianIsureId=='111702'){
					//IS_ANEW_INSURE= ($scope.applyObj.IS_ANEW_INSURE == true) ? -1 : -2;
					IS_ANEW_INSURES= $scope.applyObj.IS_ANEW_INSURES;
				}				
				var key = {
					"databaseName": Variables.dataBaseName,
					"tableName": "T_APPLY",
					"conditions": [{"ID": applyId}],
					"data": [
						{
							"IS_NOTICE": $scope.applyObj.IS_NOTICE,
							"IS_PAY_FOR": $scope.applyObj.IS_PAY_FOR,
							"IS_INSURE": $scope.applyObj.IS_INSURE,
							"IS_INSURE_PAPER": $scope.applyObj.IS_INSURE_PAPER,
							"VALID_PHONE": $scope.applyObj.VALID_PHONE,
							"IS_ANEW_INSURES" : IS_ANEW_INSURES

						}
					]
				};
				updateORInsertTableDataByConditions(key, function (data) {
					if(data){
						console.log('信息保存成功！');
					}
				});
			}
			
			//所有告知相关信息数组，分别对应[投保人告知，被保人告知，业务员告知，客户尽职调查]
			var impartXmlpathArray = ["xml/appnt_impart_template.xml", "xml/insurant_impart_template.xml", "xml/agent_impart_template.xml", "xml/client_impart_template.xml"];
			var impartDivIdArray = ["applicant_know", "recognizee_know", "agent_know", "customer_know"];
			var impartColumnArray = ["APPLICANT_INFO", "RECOGNIZEE_INFO", "AGENT_INFO", "SURVEY_INFO"];
			var impartJsonkeyArray = ["appntImpartList", "insurantImpartList", "agentImpartList", "clientImpartList"];
			var customerTypeArray = ["1","0","2","3"];

			//保存告知内容
			if (activeTab >= 5 && activeTab <= 8) {
				//当前告知数组索引[0,1,2,3]
				var currentIndex = activeTab - 5;
				$scope.saveImpartData(applyId, impartDivIdArray[currentIndex], impartColumnArray[currentIndex], impartJsonkeyArray[currentIndex],customerTypeArray[currentIndex]);
			}
			/* 首先对操作前的选项卡内容进行保存，end */

			/* 然后对当前操作的选项卡内容进行初始化，begin */

			//如果是手机版，当前选项卡内容验证通过后，设置选项卡标题
			if(pcType == "phone"){
				//‘信息录入’模块子选项卡标题列表
				var tabTitleList = ["投保人信息","被保人信息","受益人信息","投保事项","投保人告知","被保人告知","业务员告知","客户尽职调查"];

		    	document.getElementById("step2_title").innerHTML = tabTitleList[tabNumber - 1];
			}
			
			//跳转到指定选项卡
			$scope.step2 = {activeTab: tabNumber};

			//加载新打开的选项卡页内容
			if (tabNumber >= 5 && tabNumber <= 8) {
				//当前告知数组索引[0,1,2,3]
				var currentIndex = tabNumber - 5;
				var birthday,age,sexStr,sex;
				if(currentIndex == 0){
					birthday = document.getElementById("a_birthday").innerText;
					sexStr = document.getElementById("a_sex").innerText;
					age = getAgeByBirthday(birthday);
					sex = (sexStr == "男") ? 0 : 1;
				}else if(currentIndex == 1){
					birthday = document.getElementById("i_birthday").innerText;
					sexStr = document.getElementById("i_sex").innerText;
					age = getAgeByBirthday(birthday);
					sex = (sexStr == "男") ? 0 : 1;
				}

				//查询主险ID并加载选项卡页内容及数据
				var byid = {
					"databaseName": Variables.dataBaseName,
					"tableName": "T_APPLY",
					"conditions": {"ID": applyId}//保单ID
				};
				queryTableDataByConditions(byid, function (data) {
					if(data){
						var prosalJsonStr = data[0].PROSAL_JSON;
						prosalJsonStr = prosalJsonStr.replace(/\r\n/g, "").replace(/\\\"/g, "\"").replace(/\\\//g, "\/");
						var prosalJson = eval("(" + prosalJsonStr + ")");
						var mainProductID = prosalJson.productid;
						if(isreleated == '03' || isreleated == 'Y'){
							if(mainProductID.indexOf('124405') > -1){
								mainProductID = mainProductID.replace('124405', '114403');
							}
						}else if(isreleated == '05'){
							if(mainProductID.indexOf('124405') > -1){
								mainProductID = '114403';
							}
						}
						$scope.loadImpartContent(applyId, impartXmlpathArray[currentIndex], impartDivIdArray[currentIndex], impartJsonkeyArray[currentIndex],mainProductID, age, sex);
					}
				});
			}
			/* 然后对当前操作的选项卡内容进行初始化，end */
		}
		/* 告知数据保存，参数（保单ID，告知内容所在DIVid，告知字段，告知jsonkey），xiyawen add，2015-03-10 */
		$scope.saveImpartData = function (applyId, impartDivId, impartColumn, impartJsonkey,customerType) {
			var applyDetailJson = {};	//保单详情JSON
			var impartListJson = {};	//某一个告知数据JSON
			var impartDiv = document.getElementById(impartDivId);//告知内容所在的DIV
			var impartRows = impartDiv.firstChild.rows;//告知内容中表格行
			var impartSubjsonArray = [];
			for (var j = 0; j < impartRows.length; j++) {
				//获取每一行的input标签和textarea标签
				var inputsOfTr = impartRows[j].getElementsByTagName("input");
				var textareaOfTr = impartRows[j].getElementsByTagName("textarea");
				var subJson = {};		//告知数据的子json，一条记录一个json
				var contentString = "";	//内容字符串
				var contentArray = [];	//告知数据中内容数组
				var contentIndex = 0;	//内容数组索引

				subJson["customerType"] = customerType;
				subJson["impartFlag"] = "2";	//默认值
				for (var k = 0; k < inputsOfTr.length; k++) {
					var inputElement = inputsOfTr[k];
					if (inputElement.type == "hidden") {
						if (inputElement.name == "disclosure_id") {
							// 投被保人在同一页面id相同不可更改被保人选项，故修改投保人页面id后再进行转换
							var inputElementValue = '';
							if(inputElement.value.indexOf('M') == 0){
								inputElementValue = inputElement.value.substring(1);
							}else{
								inputElementValue = inputElement.value;
							}
							subJson["impartCode"] = inputElementValue;

						} else if (inputElement.name == "disclosure_ver") {
							subJson["impartVersion"] = inputElement.value;
						}
					} else if (inputElement.type == "checkbox" && inputElement.checked == true) {
						subJson["impartFlag"] = inputElement.value;
						if(inputElement.value =='A照' || inputElement.value =='B照' || inputElement.value =='C照' || inputElement.value =='D照' || inputElement.value =='E照'){
							contentArray[contentIndex] = inputElement.value;
							contentIndex++;
						}
					} else if (inputElement.type == "text") {
						//input标签设置扩展属性(allowSave="false")的文本框不保存
						if(inputElement.getAttribute("allowSave") == "false"){
							continue;
						}
						contentArray[contentIndex] = inputElement.value;
						contentIndex++;
					} else if (inputElement.type == "radio") {
						if(inputElement.checked){
							if(inputElement.value=="其他" || inputElement.value=="其它" || inputElement.value==""){
								continue;
							}
							contentArray[contentIndex] = inputElement.value;
							contentIndex++;
						}
					}
				}
				for(var k = 0 ; k < textareaOfTr.length ; k++){
					var textareaElement = textareaOfTr[k];
					var textareaContent = angular.element(textareaElement).val();
					contentArray[contentIndex] = textareaContent;
					contentIndex++;
				}
				//选择‘否’的告知内容设置为空
				if(subJson["impartFlag"]=="0"){
					contentString = "";
				}else{
					contentString = contentArray.length > 0 ? contentArray.join("/") : "";
				}
				subJson["impartContent"] = contentString;
				impartSubjsonArray[j] = subJson;
				// alert(JSON.stringify(subJson));
			}
			impartListJson[impartJsonkey] = impartSubjsonArray;
			//APPLY_DETAIL值获取
			var bycode = {
				"databaseName": Variables.dataBaseName,
				"tableName": "T_APPLY",
				"conditions": {"ID": applyId}
			};
			queryTableDataByConditions(bycode, function (data) {
				if (data) {
					var applyDetailStr = data[0].APPLY_DETAIL;
					//alert("yjl:applyDetailStr"+applyDetailStr);
					if (applyDetailStr) {
						var applyDetailJsonStr = applyDetailStr.replace(/\r\n/g, "").replace(/\\\"/g, "\"").replace(/\\\//g, "\/");
						//alert("保存前数据:"+applyDetailJsonStr);
						applyDetailJson = eval("(" + applyDetailJsonStr + ")");
						//alert("保存前json:"+applyDetailJson);
					}
					if(!applyDetailJson){
						console.log("save:applyDetailJson解析出错！");
//						alert("save:applyDetailJson解析出错！");
						return;
					}
					//更新applyDetailJson中的某一个告知子json
					applyDetailJson[impartJsonkey] = impartSubjsonArray;
					//更新数据内容
					var dataJson = {};
					if(brows().iphone)
					{
						applyDetailJson = JSON.stringify(applyDetailJson);
						impartListJson = JSON.stringify(impartListJson);
					}
					dataJson["APPLY_DETAIL"] = applyDetailJson;
					dataJson[impartColumn] = impartListJson;
					/*
					//处理告知字段对应JSON
					if (impartColumn == "APPLICANT_INFO") {
						dataJson["APPLICANT_INFO"] = impartListJson;
					} else if (impartColumn == "RECOGNIZEE_INFO") {
						dataJson["RECOGNIZEE_INFO"] = impartListJson;
					} else if (impartColumn == "AGENT_INFO") {
						dataJson["AGENT_INFO"] = impartListJson;
					} else if (impartColumn == "SURVEY_INFO") {
						dataJson["SURVEY_INFO"] = impartListJson;
					}
					*/
					//保存告知数据
					var key = {
						"databaseName": Variables.dataBaseName,
						"tableName": "T_APPLY",
						"conditions": [{"ID": applyId}],
						"data": [dataJson]
					};
					updateORInsertTableDataByConditions(key, function (data) {
						if (data) {
							console.log('告知信息保存成功！');
						}
					}, function () {
						console.log('告知信息保存失败！');
					});
				}
			});
		}
		/* 加载当前选项卡页内容及数据，参数（保单ID，告知对应的xml路径，告知内容所在DIVid，告知jsonkey，主险ID，年龄，性别），xiyawen add，2015-03-05  */
		$scope.loadImpartContent = function (applyId, impartXmlpath, impartDivId, impartJsonkey,mainProductID, age, sex) {
			/*加载告知对应的HTML内容*/
			var applicant_know = asyncOnlineRuleByXml(impartXmlpath, mainProductID, age, sex);
			var txt = $compile(applicant_know)($scope);
			var impartDiv = document.getElementById(impartDivId);
			angular.element(impartDiv).html('').append(txt);

			/* 加载已录入的告知数据 */
			var applyDetailJson = {};	//保单详情JSON
			var impartSubjsonArray = [];//告知数据数组
			//查询APPLY_DETAIL值
			var bycode = {
				"databaseName": Variables.dataBaseName,
				"tableName": "T_APPLY",
				"conditions": {"ID": applyId}
			};
			queryTableDataByConditions(bycode, function (data) {
				if (data) {
					var applyDetailStr = data[0].APPLY_DETAIL;
					//alert("yjl:applyDetailStr"+applyDetailStr);
					if (applyDetailStr) {
						var applyDetailJsonStr = applyDetailStr.replace(/\r\n/g, "").replace(/\\\"/g, "\"").replace(/\\\//g, "\/");
						//alert("加载前数据："+applyDetailJsonStr);
						applyDetailJson = eval("(" + applyDetailJsonStr + ")");
						//alert("加载前json"+applyDetailJson);
						if(!applyDetailJson){
							console.log("load:applyDetailJson解析出错！");
//							alert("load:applyDetailJson解析出错！");
							return;
						}
						//保单详情中的某一个告知子json数组
						impartSubjsonArray = applyDetailJson[impartJsonkey];
						if (impartSubjsonArray) {
							var impartRows = impartDiv.firstChild.rows;//告知内容中表格行
							for (var i = 0; i < impartRows.length; i++) {
								//获取每一行的input标签和textarea标签
								var inputsOfTr = impartRows[i].getElementsByTagName("input");
								var textareaOfTr = impartRows[i].getElementsByTagName("textarea");
								var divOfTr = impartRows[i].getElementsByTagName("div");
								var subJson = impartSubjsonArray[i];	//告知数据的子json，一条记录一个json

								var contentSubjson = subJson["impartContent"];//告知数据子json中内容json

								var contentString = subJson["impartContent"];	//内容字符串
								var contentCode=subJson["impartCode"];
								var contentArray = contentString.split("/");	//告知数据中内容数组
								var contentIndex = 0;							//内容数组索引

								for (var k = 0; k < inputsOfTr.length; k++) {
									var inputElement = inputsOfTr[k];
									if (inputElement.type == "hidden") {
										//隐藏文本框的值在加载html内容时已存在
									} else if (inputElement.type == "checkbox") {
										if (subJson["impartFlag"] == inputElement.value) {
											inputElement.checked = true;
											//行内如果存在div标签则通过impartFlag值控制其显示或隐藏
											if (divOfTr.length > 0) {
												if (subJson["impartFlag"] == 1) {
													divOfTr[0].style.display = "block";
												} else {
													divOfTr[0].style.display = "none";
												}
											}
										} else {
											inputElement.checked = false;
										}
									}
									//选择‘否’的告知内容不赋值
									if(subJson["impartFlag"]=="0"){
										continue;
									}else{
										if (inputElement.type == "text") {
											if(contentArray[contentIndex] && contentCode!='A0501'){
												inputElement.value = contentArray[contentIndex];
												//如果文本框存在‘onchange'事件，则赋值后触发
												if(inputElement.onchange){
													inputElement.onchange();
												}
											}else{
												// inputElement.value = "";
											}
											contentIndex++;
										} else if (inputElement.type == "radio") {
											if (contentArray[contentIndex] == inputElement.value) {
												inputElement.checked = true;
												contentIndex++;
											}
										}else if(inputElement.type == "checkbox"){
											if (contentArray[contentIndex] == inputElement.value) {
												inputElement.checked = true;
												contentIndex++;
											}
										}
									}
								}
								for (var k = 0; k < textareaOfTr.length; k++) {
									var textareaElement = textareaOfTr[k];
									textareaElement.textContent = contentArray[contentIndex];
									if(!textareaElement.textContent){
										textareaElement.innerText = contentArray[contentIndex];
									}
									contentIndex++;
								}
							}
						}
					}
				}
			});
		}
		//预览告知内容，xiyawen add，2015-03-19
		$scope.previewImpartContent = function(){
			//保单ID
			var applyId = document.getElementById("formID").value;			
			//查询APPLY_DETAIL值
			var bycode = {
				"databaseName": Variables.dataBaseName,
				"tableName": "T_APPLY",
				"conditions": {"ID": applyId}
			};
			queryTableDataByConditions(bycode, function (data) {
				if (data) {
					var applyDetailStr = data[0].APPLY_DETAIL;
					
					var prosalJsonStr = data[0].PROSAL_JSON;
					prosalJsonStr = prosalJsonStr.replace(/\r\n/g, "").replace(/\\\"/g, "\"").replace(/\\\//g, "\/");
					var prosalJson = eval("(" + prosalJsonStr + ")");
					
					if (applyDetailStr) {
						var applyDetailJsonStr = applyDetailStr.replace(/\r\n/g, "").replace(/\\\"/g, "\"").replace(/\\\//g, "\/");
						var applyDetailJson = eval("(" + applyDetailJsonStr + ")");
						
						//保单详情中的告知列表
						var appntImpartJsonList = applyDetailJson["appntImpartList"];		//投保人告知
						var insurantImpartJsonList = applyDetailJson["insurantImpartList"];	//被保人告知
						var agentImpartJsonList = applyDetailJson["agentImpartList"];		//业务员告知

						//告知说明及备注栏Table
						var explainTable = document.getElementById("explainTable");
						//如果表格有数据则清空，避免重复加载
						var rowCount = explainTable.rows.length;
						if(rowCount > 2){
							for(var i = 1 ; i < rowCount - 1 ; i++){
								explainTable.deleteRow(1);
							}
						}
						//投保人告知数据加载
						if(appntImpartJsonList){
							for(var i = 0 ; i < appntImpartJsonList.length ; i++){
								var appntImpartJson = appntImpartJsonList[i];
								//设置‘是否’复选框的选中状态
								var dataContainerId = "applicant_" + appntImpartJson.impartVersion + "_" + appntImpartJson.impartCode;
								var checkboxOuterDiv = document.getElementById(dataContainerId);
								if(checkboxOuterDiv){
									var checkboxInputs = checkboxOuterDiv.getElementsByTagName("input");
									for(var j = 0 ; j < checkboxInputs.length ; j++){
										checkboxInputs[j].checked = false;
										if(appntImpartJson.impartFlag == checkboxInputs[j].value){
											checkboxInputs[j].checked = true;
										}
									}
								}
								//设置告知内容
								if(appntImpartJson.impartFlag == "2" || appntImpartJson.impartFlag == "1")
								{
									var impartContentArray = appntImpartJson.impartContent.split("/");
									for(var j = 0 ; j < impartContentArray.length ; j++){
										var dataContainer = document.getElementById(dataContainerId + "_" + j);
										if(dataContainer){								
											if(dataContainer.tagName == "CHECKBOX"){
												// if(dataContainer.value == impartContentArray[j]){
												// 	dataContainer.checked = true;
												// }
											}else{
												dataContainer.innerHTML = impartContentArray[j];
											}
										}
									}
									if(appntImpartJson.impartCode=='A0531'){
										var licenseContent=appntImpartJson.impartContent.split("/");
										var insurant=document.getElementsByName('applicant');					
										for(var s = 0; s < insurant.length; s++){
											var license = document.getElementById(dataContainerId + "_" + s);
											license.checked=false;
											for(var js = 0; js < licenseContent.length;js++){						
												if(licenseContent[js]==insurant[s].value){
													license.checked=true;												
												}
											}
										}
									}
								}
								//将询问结果为‘是’的详细告知内容提取出来并放到‘告知说明及备注栏’表格中
								if(appntImpartJson.impartFlag == "1"){
									//存在‘name’属性的div才需要展示到‘告知说明及备注栏’表格中
									var impartNumber = checkboxOuterDiv.getAttribute("name");
									if(impartNumber){
										var insertRow = explainTable.insertRow(explainTable.rows.length-1);
										var serialNumber = insertRow.insertCell(0);
						     		    var explainName = insertRow.insertCell(1);
						     		    var explainContext = insertRow.insertCell(2);
						     		    serialNumber.innerHTML = impartNumber;
						     		    explainName.innerHTML = "投保人";
						     		    explainContext.innerHTML = appntImpartJson.impartContent;
									}
								}
							}
						}
						//被保人告知数据加载
						if(insurantImpartJsonList){
							for(var i = 0 ; i < insurantImpartJsonList.length ; i++){
								var insurantImpartJson = insurantImpartJsonList[i];
								//设置‘是否’复选框的选中状态
								var dataContainerId = "insurant_" + insurantImpartJson.impartVersion + "_" + insurantImpartJson.impartCode;
								var checkboxOuterDiv = document.getElementById(dataContainerId);
								if(checkboxOuterDiv){
									var checkboxInputs = checkboxOuterDiv.getElementsByTagName("input");
									for(var j = 0 ; j < checkboxInputs.length ; j++){
										checkboxInputs[j].checked = false;
										if(insurantImpartJson.impartFlag == checkboxInputs[j].value){
											checkboxInputs[j].checked = true;
										}
									}
								}
								//设置告知内容
								if(insurantImpartJson.impartFlag == "2" || insurantImpartJson.impartFlag == "1")
								{
									var impartContentArray = insurantImpartJson.impartContent.split("/");
									for(var j = 0 ; j < impartContentArray.length ; j++){
										var dataContainer = document.getElementById(dataContainerId + "_" + j);
										if(dataContainer){
											if(dataContainer.type == "checkbox"){
												// if(dataContainer.value == impartContentArray[j]){
												// 	dataContainer.checked = true;
												// }
											}else{
												dataContainer.innerHTML = impartContentArray[j];
											}
										}
									}
									if(insurantImpartJson.impartCode=='A0531'){
										var licenseContent=insurantImpartJson.impartContent.split("/");
										var insurant=document.getElementsByName('insurant');
										for(var s = 0; s < insurant.length; s++){
											var license = document.getElementById(dataContainerId + "_" + s);
											license.checked = false;
											for(var js = 0; js < licenseContent.length;js++){						
												if(licenseContent[js]==insurant[s].value){
													license.checked=true;												
												}
											}
											
										}
									}
								}
								//将询问结果为‘是’的详细告知内容提取出来并放到‘告知说明及备注栏’表格中
								if(insurantImpartJson.impartFlag == "1"){
									//存在‘name’属性的div才需要展示到‘告知说明及备注栏’表格中
									var impartNumber = checkboxOuterDiv.getAttribute("name");
									if(impartNumber){
										var insertRow = explainTable.insertRow(explainTable.rows.length - 1);
										var serialNumber = insertRow.insertCell(0);
						     		    var explainName = insertRow.insertCell(1);
						     		    var explainContext = insertRow.insertCell(2);
						     		    serialNumber.innerHTML = impartNumber;
						     		    explainName.innerHTML = "被保险人";
						     		    explainContext.innerHTML = insurantImpartJson.impartContent;
									}
								}
							}
						}
					}
					if(prosalJson){
						//加载‘声明授权’表格中动态信息
						var applicationDate = document.getElementById("applicationDate");
						var applicationDate2 = document.getElementById("applicationDate2");
						var applicationDate3 = document.getElementById("applicationDate3");
						var agent_org = document.getElementById("agent_org");
						var agent_name = document.getElementById("agent_name");
						var agent_code = document.getElementById("agent_code");
						
						if(applicationDate){
							applicationDate.innerHTML = getDateString(""); 
						}
						if(applicationDate2){
							applicationDate2.innerHTML = getDateString(""); 
						}
						if(applicationDate3){
							applicationDate3.innerHTML = getDateString(""); 
						}
						//获取prosalJson中agentMap数据
						var agentMap = prosalJson.CONTENT.agentMap;
						if(agent_org){
							var agentOrg = agentMap.ORGANIZATION ? agentMap.ORGANIZATION : "";
							agent_org.innerHTML = agentOrg;
						}
						if(agent_name){
							var agentName = agentMap.NAME ? agentMap.NAME : "";
							agent_name.innerHTML = agentName; 
						}
						if(agent_code){
							var agentCode = agentMap.AGENTCODE ? agentMap.AGENTCODE : "";
							agent_code.innerHTML = agentCode; 
						}
					}
				}
			});
		}
		  
		
		//保融网联签约的界面
	 	$ionicModal.fromTemplateUrl('templates/insurance_sign_info.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.modalSign = modal;
		});
		$scope.closeModalSign = function (){
			myConfirm3("确认","您未完成签约授权，若此时返回，填写的信息将丢失！",function(){				
				cancelMyConfirm3();
				
			},function(){
				cancelMyConfirm3();
				clearTimeout(timer);
				$("#verifyBankCode").val("");
				document.getElementById("sign_info").innerHTML ="获取验证码";
				document.getElementById("sign_info").disabled = false;
				document.getElementById("sureChannelBtn").disabled = true; 
				$scope.modalSign.hide();
				//当我们用到模型时，清除它！
				$scope.$on('$destroy', function() {
				    $scope.modalSign.remove();
				});
			});
		}

		//签约条款展示
		$ionicModal.fromTemplateUrl('templates/bank_sign_info.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.modalSignAgrees = modal;
		});
		//点击阅读条款
		$scope.inter_agree = function(){			
			$scope.modalSignAgrees.show();
		}
		//点击阅读条款页关闭
		$scope.closeModalInterSign = function(){
			$scope.modalSignAgrees.hide();
			
		}
		//当我们用到模型时，清除它！
		$scope.$on('$destroy', function() {
		    $scope.modalSignAgrees.remove();
		});


		//签约界面金额等信息隐藏与显示
		$scope.showSignCustomerInfo = function(){
			$(".showSignLimitInfoBanks").toggle();	
			// if(document.getElementById("showSignLimitInfo").style.display=="block"){
			// 	document.getElementById("showSignLimitInfo").style.display="none"
			// }else{
			// 	document.getElementById("showSignLimitInfo").style.display="block"
			// }
		}

        //OCR识别银行卡信息 by gudandie 2018-11-09
        $scope.openOcr = function () {
            var idtype = '17';
            var isCallBackFlag = false;
            $ionicActionSheet.show({
                buttons: [
                    {text: '拍照'},
                    {text: '从相册中选取'}
                ],
                cancelText: '取消',
                cancel: function () {
                    console.log('CANCELLED');
                },
                buttonClicked: function (index) {
                    var method = index == "0" ? "photo" : "album";
                    CommonFn.showLoading('请稍后...');
                    CommonFn.invoateOCR({
                        idtype:idtype,
                        method:method,
                        callBackFun:function(data){
                            CommonFn.hideLoading();
                            isCallBackFlag = true;
                            //alert('data==='+JSON.stringify(data));
                            data = eval('('+data+')');
                            if(CommonFn.isExist(data.message.status)){
                                if(data.message.status =="0"){  //识别成功
                                    var cardType = data.cardsinfo.bankCardType;  //银行卡类别
                                    if(CommonFn.isExist(cardType) && (cardType=='贷记卡' || cardType=='准贷记卡')){
                                        if(pcType=='phone'){
                                            document.getElementById('phone-num-pc').value = '';
                                            document.getElementById('phone-num-pc2').value = '';
                                        }else{
                                            document.getElementById('phone-num').value = '';
                                            document.getElementById('phone-num2').value = '';
                                        }
                                        myAlert('该卡为信用卡，请使用借记卡！');
                                        return false;
                                    }

									if(pcType=='phone'){
										document.getElementById('phone-num-pc').value = data.cardsinfo.cardNo;
										document.getElementById('phone-num-pc2').value = data.cardsinfo.cardNo;
									}else{
										document.getElementById('phone-num').value = data.cardsinfo.cardNo;
										document.getElementById('phone-num2').value = data.cardsinfo.cardNo;
									}
									//myAlert('银行卡识别成功！');
                                }else{
                                    if(pcType=='phone'){
                                        document.getElementById('phone-num-pc').value = '';
                                        document.getElementById('phone-num-pc2').value = '';
                                    }else{
                                        document.getElementById('phone-num').value = '';
                                        document.getElementById('phone-num2').value = '';
                                    }
                                    myAlert(data.message.value);
                                    return false;
                                }
                            }
                        }
                    })
                    setTimeout(function(){
                        if(isCallBackFlag == false){
                            CommonFn.hideLoading();
                            CommonFn.ionicAlert('请求超时，请稍后再试');
                            return;
                        }
                    },120000)
                    return true;
                }
            })
        }
		//添加银行方法
		$scope.saveBankInfo = function(){ 
			 var bankSeleVal = '';
			 var phoneNUM ='';
			 var phoneNUM2 ='';
			 var bankObj ='';			 
			 
			 // $scope.modalSign.show(); //用于调试签约界面
			 // return;
			 if(pcType == 'phone'){
			 	 bankSeleVal = document.getElementById("bank_select_pc").value;//获取当前选择银行
			 	 bankObj =  document.getElementById("bank_select_pc");
				 if(!bankSeleVal){  
				    myAlert("交费选择银行为空，请您重新确认！");
				 	return;	
				 } 
				phoneNUM = document.getElementById("phone-num-pc").value; 				 
				phoneNUM2 = document.getElementById("phone-num-pc2").value;
				// if(isNull($scope.bankAddress.data.bankSubType )){
	   //              myAlert("请选择账户类型");
	   //              return false;
	   //          } 
                if(isNull($scope.bankAddress.data.BANK_PROVINCE )|| isNull($scope.bankAddress.data.BANK_CITY)){
					myAlert("请添加账户开户行省市");
					return false;
				}
	            
                if(phoneNUM != phoneNUM2){
					   myAlert("银行卡号两次输入不一致，请您重新确认！");
				 	   return;
			    }else{
		      	    var regex =/^[0-9-]{1,30}$/;
		      	    if (!regex.test(phoneNUM)){
		      	    	myAlert("银行卡号只能是数字、“-”且不能包含其他字符，请您重新确认！"); 
                    	return ;
		      	    };                 	        
                }		

				//内蒙古农信社存折不能使用  
				if($scope.id3 =='内蒙古农村信用社'){
					if (phoneNUM.length == 22 || phoneNUM2.length == 22) {
						myAlert("内蒙古农村信用社存折无法使用，请更换其他银行扣费");
						document.getElementById("phone-num-pc").value = "";
						document.getElementById("phone-num-pc2").value = "";							
						return false;
					}				
				}
			}else{
				//pad端的校验
			 	bankSeleVal = document.getElementById("bank_select").value;//获取当前选择银行
			 	bankObj =  document.getElementById("bank_select");
				if(!bankSeleVal){ 
				    myAlert("交费选择银行为空，请您重新确认！");
				 	return;	
				}  
				
				// if(isNull($scope.bankAddress.data.bankSubType)){
    //                 myAlert("请选择账户类型");
    //                 return false;
    //             }
				phoneNUM = document.getElementById("phone-num").value;				 
				phoneNUM2 = document.getElementById("phone-num2").value; 				 
                if(isNull($scope.bankAddress.data.BANK_PROVINCE)|| isNull($scope.bankAddress.data.BANK_CITY)){
					myAlert("请添加账户开户行省市");
					return false;
				}
                
                if(phoneNUM != phoneNUM2){
				    myAlert("银行卡号两次输入不一致，请您重新确认！");
			 	    return;
				}else{
			      	//var regex = /^[0-9]+$/;//不能输入小数点
		      	    //var regex = /[^\d]/g; //不能输入空格
		      	    var regex =/^[0-9-]{1,30}$/;
		      	    if (!regex.test(phoneNUM)){
		      	    	myAlert("银行卡号只能是数字、“-”且不能包含其他字符，请您重新确认！"); 
                    	return ;
			    	}
                }
				
				 //内蒙古农信社存折不能使用  
				if($scope.id3 =='内蒙古农村信用社'){
					if (phoneNUM.length == 22 || phoneNUM2.length == 22) {
						myAlert("内蒙古农村信用社存折无法使用，请更换其他银行扣费");
						document.getElementById("phone-num").value = "";
						document.getElementById("phone-num2").value = "";							
						return false;
					}				
				}
			}
			$scope.cardNum = phoneNUM; //赋值给签约页面			
			
			var regex = /^1[3-9]\d{9}$/;
      	    if (!regex.test($('.bankPhone').val())){
      	    	myAlert("请输入正确的手机号码！"); 
            	return false;
        	}

        	if(!$scope.id5 || $scope.id5 == undefined || typeof $scope.id5==undefined){
				myAlert("交费银行名称必须搜索选择");
				return;
			}
					
        	//alert("bankPhone:"+$scope.applyObj.BANK_PHONE)
        	
			if($scope.applicantData.MOBILE != $('.bankPhone').val()){			

					myConfirm2('提示','您填写的手机号码与本保单的联系电话不一致，请确认两个手机号码是否均为您本人所使用！',function(){
						cancelMyConfirm2();  															
					},function(){//确认				 
						queryStatus(phoneNUM);
						cancelMyConfirm2();					
		            });
				}else{
					queryStatus(phoneNUM);
				}
        	//}			

		}  //添加方法完毕
		
		//状态查询接口
		function queryStatus(OppAct){
			//alert(OppAct);
			var inList = [];
				var inItem = {
					CorpEntity:organ,
					OppBank:$scope.id5.substring(0,2),
					OppAct: OppAct,
					BatchFlag: 1
				}
				inList[0] = inItem;

				var params = {
					"TransSource": "METX",
					"TransCode": "630SignQry",
					"TransSeq": getBaoRongTime(),
					"IN": inList
				}
				var json = {
					"url": API_URL+"/app/channel/queryStatus", 
					"parameters": params
				};
				//alert("查询："+JSON.stringify(json));
				loadingWait();
				httpRequestByPost(json, function (data) {					
					var jsonObj = eval("("+data+")");
					if(jsonObj){
						var jsonMap = jsonObj["jsonMap"];
						if(jsonMap && jsonMap.RtnCode == "success"){
							if(jsonMap.OUT[0].NeedSign == 1){
								//需要签约
								closeLoadingWait();
								myConfirm2('提示','使用本账户缴纳保费需要获得您的授权',function(){
									closeLoadingWait();   									
									cancelMyConfirm2();								
								},function(){
									cancelMyConfirm2();
									$scope.modalSign.show();
									$scope.sign_AgreeChecked = true;
									$scope.sign_Agree = true;																		
									document.getElementById('DisableDate').value = getNowDate();								
								});
							}else if(jsonMap.OUT[0].NeedSign == 0){
								//不需要签约
								closeLoadingWait();
								valdataFlag($scope.cardNum);
							}else{
								//不确定因素
								closeLoadingWait();
								myAlert("查询失败");
							}
						}else{
							closeLoadingWait();
							var errMsg = "查询返回失败";
							if(jsonMap && jsonMap.RtnMsg){
								errMsg = jsonMap.RtnMsg;
							}
							myAlert(errMsg);							
						}
					}else{
						closeLoadingWait();
						myAlert("查询失败");
						
					}
				}, function(err){
					closeLoadingWait();
					myAlert("网络异常，请稍候重试！");
				}); 
			
		}
//往数据库保存
		function valdataFlag(phoneNUM){
			 		var appliantName = $scope.applicantData.NAME; //投保人姓名  
					/*var bankName = bankObj.options[bankObj.options.selectedIndex].text; 
					var bankVal = $scope.bankData[bankObj.options.selectedIndex-1]["BANK_CODE"]; */
					 //重新获取银行名称和CODE   2016.8.11 wuwei
					var bankName = $scope.id3; //银行名称
					var bankVal = $scope.id5; //银行code 
					var applynum = $scope.MoneyCount; //保费总额
					var customerid = $scope.applicantData.CUSTOMER_ID;  
					var apply_id = document.getElementById("formID").value;

					var bankprovince = '';
		 			var bankcity = '';
		 			var bankSubType="";//选择邮储用于判断银行卡还是存折		 			
					var bankPhoneNum=''; //银行预留手机号
					bankprovince = $scope.bankAddress.data.BANK_PROVINCE;
					bankcity = $scope.bankAddress.data.BANK_CITY;
					bankSubType =  '2';//$scope.bankAddress.data.bankSubType;					
					bankPhoneNum = $scope.applyObj.BANK_PHONE;
					var bankSubTypeText = (bankSubType == "1") ? "存折" : "银行卡";
		 			var bank_Json={
			        	"databaseName":"promodel/10005/www/db/t_bank.sqlite",
			        	"tableName": "T_APP_BANK",
			        	"conditions": [{"applyId":apply_id,"appliantId": customerid,"bankCode":bankVal,"cardNum":phoneNUM}],
				        "data": [
				              { 
				                 "applyId": apply_id,
				                 "bankCode": bankVal,
				                 "appliantId": customerid,
				                 "appliantName": appliantName,
				                 "cardNum": phoneNUM ,
				                 "createTime":new Date().getTime(),
				                 "isChecked":"false",
				                 "BANK_PROVINCE":bankprovince,
				                 "BANK_CITY":bankcity,
								 "bankSubType":bankSubType,
								 "bankPhoneNum" : bankPhoneNum
				              }
				            ]
			    	};
				     updateORInsertTableDataByConditions(bank_Json,function(str){
				        if(1 == str[0]){ //银行卡信息保存成功
				           	var domBankDiv =  pcType == 'phone'?document.getElementById("bank_info_div_pc"):document.getElementById("bank_info_div");
				           	//var cur_html ='<table width="100%" height="30px"><tr><td width="5%"><input type="radio" style="width:20px;height:20px" name="bank" onclick="chooseBank(\''+bankVal+'\',\''+bankName+'\',\''+phoneNUM+'\')" value=\''+bankVal+'\'></input></td><td width="20%">'+ bankName + '</td><td  width="10%">' + appliantName + '</td><td  width="20%">' + phoneNUM+ '</td><td width="10%"><input class="push-button" type="button" value="删除" onclick="deleteBankByCode(\''+apply_id+'\',\''+bankVal+'\',\''+phoneNUM+'\')"></input></td></tr></table>';
				             var phone_html ='';
				          	phone_html+='<div class="table_list">';
							phone_html+='<p>'+ bankName + '</p>';
							phone_html+='<p>'+ appliantName + '</p>';
							phone_html+='<p>'+ phoneNUM+ '</p>';
								
       						phone_html+='<p>'+bankSubTypeText+'</p>';							
							phone_html+='<p>'+ bankprovince + '</p>';
							phone_html+='<p>'+ bankcity + '</p>';
							phone_html+='<p>'+ bankPhoneNum + '</p>';
							
							phone_html+='<button class="button button-stable" onclick="chooseBank(\''+bankVal+'\',\''+bankName+'\',\''+phoneNUM+'\')">选中</button>'; 
							phone_html+='<button  class="button button-stable" onclick="deleteBankByCode(\''+customerid+'\',\''+bankVal+'\',\''+phoneNUM+'\')">删除</button>';
							phone_html+='</div>';
							//alert("cur_html--->>>"+cur_html+domBankDiv.innerHTML)
				          	domBankDiv.innerHTML =pcType == 'phone'?(phone_html+domBankDiv.innerHTML):(phone_html + domBankDiv.innerHTML);
				           	//清空表单
				           	resetClearBankForm($scope);
				           	var newList = [];
				           	//更新对象
				           	var omap ={};
				           	omap["applyId"] = apply_id;
				           	omap["bankCode"] = bankVal;
				           	omap["appliantId"] = customerid;
				           	omap["bankprovince"] = bankprovince;
				           	omap["bankcity"] = bankcity;
                            omap["bankSubType"] = bankSubType;
                            omap["bankPhoneNum"] = bankPhoneNum;
				           	omap["appliantName"] = appliantName;
				           	omap["cardNum"] = phoneNUM;  //bankCardNumber; 
				           	omap["createTime"] = new Date().getTime();				           	
				           	newList.push(omap);
				           	if($scope.listBank != null && $scope.listBank.length > 0){
				           		var list = $scope.listBank;
				           		for(var k = 0; k<list.length; k++){
				           			newList.push(list[k]);
				           		}
				           	}
				           	$scope.$apply(function (){
				           	 	$scope.listBank = newList;
				           	});
				        }
				      },function (){
				        console.log("银行卡信息保存失败！");
				      });
			 }

		// 同意签约协议
		$scope.Sign_agree = function(){
			//alert("jq:"+$("#Sign_agree").attr("checked"))
			if($("#Sign_agree").attr("checked")){
				$scope.sign_AgreeChecked = true;
				$scope.sign_Agree = true;
			}else{
				$scope.sign_AgreeChecked = false;
				$scope.sign_Agree = false;
			}
		}
		
		//发送签约申请验证码
		$scope.applyChannel =function(){
			//alert("签约申请验证码")												
			$scope.SingleLimit=$("#SingleLimit").val();
			if($scope.SingleLimit){
				if(parseInt($scope.SingleLimit)<=0){					
					alert("请输入正确的单笔最大金额");
					return;
				}
				if(parseInt($scope.SingleLimit) < parseInt($scope.MoneyCount)){
					alert("委托代扣单笔最大金额小于本次保费，将会导致扣费失败，请重新修改!");
					return;
				}
			}else{
				$scope.SingleLimit = "5000000";
			}
			
			var timeRadio = document.getElementsByName("timeRadio");			
			for (radio in timeRadio) {
				if (timeRadio[radio].checked) {					
					$scope.timeRadio =timeRadio[radio].value;
				}
			}
			$scope.MaxCountLimit=$("#MaxCountLimit").val();
			if($scope.MaxCountLimit){
				if(!((parseInt($scope.MaxCountLimit)>0) && (parseInt($scope.MaxCountLimit)<=9999))){
					alert("最大代扣次数必须是1-9999内的整数");
					return;
				}
			}else{
				$scope.MaxCountLimit = 9999;
			}
						
			var DisableDates=$("#DisableDate").val();			
			var xDisableDate=DisableDates.replace(/-/g,"\/");
			$scope.DisableDate= DisableDates.replace(/-/g,"");
			var nowDate = new Date();
			//alert("productsData:"+JSON.stringify($scope.productsData)+"------"+$scope.MoneyCount);
			if($scope.productsData[0][5]=="一次交清"){
                $scope.BRpayEndYear=0;
			}else{
				$scope.BRpayEndYear=parseInt($scope.productsData[0][5]);				
			}
			//alert("$scope.BRpayEndYear:"+$scope.BRpayEndYear)
			if(DisableDates){								
				//var nowTime = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate();
				if(parseInt($scope.BRpayEndYear) > 1){
					var years=nowDate.getFullYear()+parseInt($scope.BRpayEndYear)-1;
					var nowTime = years +'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate();
					var nowhm = new Date(nowTime).getTime()+(60*24*60*60*1000);	
					if(new Date(xDisableDate) < new Date(nowhm)){
						alert("协议失效日期过早，可能导致本保单的保费无法自动收取，请您修改!");
						return;
					}
				}else{
				 	var oneYear=getNowDate().replace(/-/g,"\/");
					if(new Date(xDisableDate) < new Date(oneYear)){
						alert("协议失效日期过早，可能导致本保单续保时，无法收取相应保费，请您修改！");
						return;
					}
				}
				
				var oneTime = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate();
				if(new Date(xDisableDate) < new Date(oneTime)){
					alert("协议失效日期小于今天，请您修改！");
					return;
				}				
			}else{
				document.getElementById('DisableDate').value = getNowDate();		
				$scope.DisableDate=getNowDate().replace(/-/g,"");
			}
			
			var inList = [];
			var timeLen = getBaoRongTime().length;

			var inItem = {
				RdSeq:'mine'+getBaoRongTime().substring(0,8)+getBaoRongTime().substring(timeLen-8, timeLen),
				CorpEntity: organ,
				PrivateFlag: "1",
				BatchFlag: "1",
				OppBank: $scope.id5.substring(0,2),
				OppAct: $scope.cardNum,
				OppActName: $scope.applicantData.NAME,
				CardType: '2',
				CertType: getCartType($scope.applicantData.IDNAME),
				CVV2: "", 
            	ExpiredDate: "",
				CertNumber: $scope.applicantData.IDNO,
				CellPhone: $scope.applyObj.BANK_PHONE, //签约手机号
				DisableDate: $scope.DisableDate, //失效日期
				SingleLimit: $scope.SingleLimit, //代扣单笔最大金额
				LimitPeriodUnit: $scope.timeRadio, //周期时间
				MaxCountLimit: $scope.MaxCountLimit //代扣次数
			}
			inList[0] = inItem;

			var params = {
				TransSource: "METX",
				TransCode: "630SignApply",
				TransSeq: getBaoRongTime(),
				IN: inList
			}
			var json = {
				"url": API_URL+"/app/channel/applyChannel", //申请签约
				"parameters": params
			};
			//alert("签约申请:"+JSON.stringify(json));
			//childrenloadingWait();
			document.getElementById("sign_info").disabled = true;
			httpRequestByPost(json,
				function (data){
					try{
						var jsonObj = eval("("+data+")");
						//childrencloseLoadingWait();
						if(jsonObj){
							var jsonMap = jsonObj["jsonMap"];
							if(jsonMap && jsonMap.RtnCode == "success"){
								//申请成功								
								$scope.RdSeq=jsonMap.OUT[0].RdSeq;
								//closeLoadingWait();
								//childrencloseLoadingWait();
								CommonFn.alertPopupFun($ionicPopup,'charging','发送验证码成功！',3000);
								document.getElementById("sureChannelBtn").disabled = false; 
								SignHour=120;
								whileThridHoursSign();
							}else{
								var errMsg = "发送失败";
								if(jsonMap && jsonMap.RtnMsg){
									errMsg = jsonMap.RtnMsg;
								}
								//childrenMyAlert(errMsg);								
								alert(errMsg);
								document.getElementById("sign_info").disabled = false;
							}
						}else{
							//childrencloseLoadingWait();
							CommonFn.alertPopupFun($ionicPopup,'loser','发送失败，请稍候重试！',3000);
							document.getElementById("sign_info").disabled = false;
						}
					}catch(e){
						CommonFn.alertPopupFun($ionicPopup,'loser','处理异常，请联系管理员！',3000);
						document.getElementById("sign_info").disabled = false;
					}
					
				},function (err){
					//childrencloseLoadingWait();
					CommonFn.alertPopupFun($ionicPopup,'loser','网络异常，请稍候重试！',3000);
					document.getElementById("sign_info").disabled = false;
				}
			);
		}

		$scope.sureChannel = function(){
			//签约确认按钮
			if(!$scope.sign_Agree){
				//alert("请同意协议!");
				CommonFn.alertPopupFun($ionicPopup,'loser','请同意协议！',3000);
				return;
			}
			var verifyCode = document.getElementById("verifyBankCode").value;
			if(!(verifyCode && (verifyCode.length == 6))){
				//alert("请输入验证码!");
				CommonFn.alertPopupFun($ionicPopup,'loser','请输入验证码!',3000);
				return;
			}
			var inList = [];
			var timeLen = getBaoRongTime().length;
			var inItem = {
				RdSeq:$scope.RdSeq,
				CorpEntity:'6000001',
				VerfyCode: verifyCode,
				ReqReserved1: "",
				ReqReserved1: ""
			}
			inList[0] = inItem;

			var params = {
				TransSource: "METX",
				TransCode: "630SignConfirm",
				TransSeq: getBaoRongTime(),
				IN: inList
			}
			var json = {
				"url": API_URL+"/app/channel/sureChannel", 
				"parameters": params
			};
			//childrenloadingWait();
			//alert("申请确认："+JSON.stringify(json));
			httpRequestByPost(json,
				function (obj){
					var jsonObj=eval("("+obj+")");
					//childrencloseLoadingWait();
					if(jsonObj){
						var jsonMap = jsonObj["jsonMap"];
							if(jsonMap && jsonMap.RtnCode == "success"){								
								if(jsonMap.OUT[0].SignState == 2){
									//签约成功
									$scope.modalSign.hide();
									//当我们用到模型时，清除它！
									  $scope.$on('$destroy', function() {
									    $scope.modalSign.remove();
									  });

									valdataFlag($scope.cardNum);
								}else if(jsonMap.OUT[0].SignState == 1){
									clearTimeout(timer);
									document.getElementById("sign_info").innerHTML ="重新获取";	
									document.getElementById("sign_info").disabled = false; 
									$("#verifyBankCode").val("");
									//childrenMyAlert("未签约，请重新获取验证码");
									CommonFn.alertPopupFun($ionicPopup,'loser','未签约，请重新获取验证码！',3000);
									
								}else{
									clearTimeout(timer);
									document.getElementById("sign_info").innerHTML ="重新获取";	
									document.getElementById("sign_info").disabled = false; 
									$("#verifyBankCode").val("");
									//childrenMyAlert(jsonMap.RtnMsg);
									//alert(jsonMap.RtnMsg);
									CommonFn.alertPopupFun($ionicPopup,'loser',jsonMap.RtnMsg,3000);
								}
							}else{
								clearTimeout(timer);
								document.getElementById("sign_info").innerHTML ="重新获取";	
								document.getElementById("sign_info").disabled = false; 
								$("#verifyBankCode").val("");
								var errMsg = "签约申请失败";
								if(jsonMap && jsonMap.RtnMsg){
									errMsg = jsonMap.RtnMsg;
								}
								alert(errMsg);
							}
					}else{
						CommonFn.alertPopupFun($ionicPopup,'loser','签约申请失败，请稍候重试！',3000);
					}
				},function (err){
					//childrencloseLoadingWait();
					CommonFn.alertPopupFun($ionicPopup,'loser','网络异常，请稍候重试！',3000);
				}
			);
		}
	//保融接口调用完毕
						
		//根据保单中的主险ID判断投保人告知项是否显示，xiyawen add，2015-03-19
		function isShowAppntImpart(applyId){
			//初始值
			$scope.showAppntImpart = false;
			//根据保单ID查询主险ID
			var byid = {
				"databaseName": Variables.dataBaseName,
				"tableName": "T_APPLY",
				"conditions": {"ID": applyId}//保单ID
			};
			queryTableDataByConditions(byid, function (data) {
				if(data){
					var prosalJsonStr = data[0].PROSAL_JSON;
					var applicantID = data[0].APPLICANT_ID;
					var recognizeeID = data[0].INSURANT_ID;
//				alert("applicantID:"+applicantID);
//				alert("recognizeeID:"+recognizeeID);
					
					prosalJsonStr = prosalJsonStr.replace(/\r\n/g, "").replace(/\\\"/g, "\"").replace(/\\\//g, "\/");
					var prosalJson = eval("(" + prosalJsonStr + ")");
					if(!prosalJson){
						console.log("isShowAppntImpart:json解析出错！");
						return;
					}
					var currentProductID = prosalJson.productid;	//险种ID，多个险种有逗号分隔
					var productIDArray = currentProductID.split(",");
					var insurList = Variables.productJson;	//险种列表
					if(insurList){
						for(var i = 0 ; i < insurList.length ; i++){
							//险种ID
							var insurID = insurList[i].id;
							var hasAppntImpart = insurList[i].hasAppntImpart;
							for(var j = 0 ; j < productIDArray.length ; j++){
								if(productIDArray[j] == insurID && hasAppntImpart == "true"){
									if(applicantID && recognizeeID && applicantID != recognizeeID){
										$scope.$apply(function(){
											$scope.showAppntImpart = true;
										});
										break;
									}
								}
							}
						}
					}
				}
			});
		}

		// 强制印刷号输入14位数字
		$scope.stopCount = function(id){
	        var sPrint = document.getElementById(id);
	        var lPrint = sPrint.value;
	        if(lPrint.length >= 14){
	            sPrint.blur();
	            return false;
	        }
        }

		//提交保单
		$scope.commitInsurance = function (){
            var tjConfirmationData = null;
			// 电子签名需要验证影像件是否全部录入  add by wangzj
			if($scope.SignMark){
				var sign_button = document.getElementById("sign_button").style.display;
				var tow_sign_button = document.getElementById("tow_sign_button").style.display;
				var regin_button = document.getElementById("regin_button").style.display;
				//var chaolu_button = document.getElementById("copy_button").style.display;
				if(sign_button!='none' || tow_sign_button!='none' || regin_button!='none'){
					CommonFn.alertPopupFun($ionicPopup,'loser','请完成电子签名！',3000);
					return;
				}
				if($scope.copystatementState == true && (!$scope.applicantInfo.COPY_FRONT || !$scope.applicantInfo.COPY_REVERSE)){
					myAlert('请上传影像件及手持确认书影像件');
					return true;
				}
                if($scope.isTj){
                    //天津确认书信息
                    var agentName = $scope.agentInfo.AGENT_NAME;//销售人员姓名
                    var cerNo = $(".cerNo").val();//展业资格证号
                    var productNames = $scope.productNames;
                    var payment = {};
                    var productType = "";
                    $('input[name="productType"]:checked').each(function(){
                        productType+=$(this).val()+',';
                    });
                    var agentSign = signMap["4_26_sign_photo"] ;
                    var appSign = signMap["5_27_sign_photo"];
                    var appSign2 = signMap["6_28_sign_photo"];
                    var agentPhoto = signMap["4_26_people_photo"] ;
                    var appPhoto = signMap["5_27_people_photo"];
                    var appPhoto2 = signMap["6_28_people_photo"];
                    //天津机构验证是否信息都填写
                    if(cerNo==""||cerNo==null||cerNo==undefined){
                        myAlert('请输入代理人展业证（资格证）号！');
                        return false;
                    }
                    if(!$(".appConfirm").attr('checked') || $(".sign_photo_6").is(":hidden")){
                        myAlert('请投保人核对签字！');
                        return false;
                    }
                    //验证缴费方式
                    if($('input[name="payType"]:checked').length<1){
                        myAlert('请选择缴费方式！');
                        return false;
                    }
                    var payType = "";
                    $('input[name="payType"]:checked').each(function(){
                        payType = $(this).val();
                    });
                    if(parseInt(payType)==0){
                        var payEndYear = $(".paytype0-1").val();
                        var payIntv ="";
                        $('input[name="payYear"]:checked').each(function(){
                            payIntv = $(this).val();
                        });
                        var payAmountPer = $(".paytype0-2").val();
                        var payAmontTotal =  $(".paytype0-3").val();
                        //alert("payEndYear:"+payEndYear+",payIntv:"+payIntv+",payAmountPer:"+payAmountPer+",payAmontTotal:"+payAmontTotal);
                        if(CommonFn.isExist(payEndYear) && CommonFn.isExist(payIntv) && CommonFn.isExist(payAmountPer) && CommonFn.isExist(payAmontTotal)){
                            if(parseInt(payEndYear)<=0 || parseFloat(payAmountPer)<=0 || parseFloat(payAmontTotal)<=0){
                                myAlert('缴费方式输入有误！');
                                return false;
                            }
                            payment = {payType:0,payEndYear:payEndYear,payIntv:payIntv,payAmountPer:payAmountPer,payAmontTotal:payAmontTotal};
                        }else{
                            myAlert('请输入完整缴费方式！');
                            return false;
                        }
                    }else if(parseInt(payType)==1){
                        var payAmontTotal =  $(".paytype1-1").val();
                        if(CommonFn.isExist(payAmontTotal)){
                            if(parseFloat(payAmontTotal)<=0){
                                myAlert('一次性缴费额输入有误！');
                                return false;
                            }
                            payment = {payType:1,payAmontTotal:payAmontTotal};
                        }else{
                            myAlert('请输入一次性缴费额！');
                            return false;
                        }
                    }else if(parseInt(payType)==2){
                        var payAmont = $(".paytype2-1").val();
                        if(CommonFn.isExist(payAmont)){
                            payment = {payType:2,payAmont:payAmont};
                        }else{
                            myAlert('请输入具体缴费方式！');
                            return false;
                        }
                    }
                    if(productType!=""){
                        productType = productType.substr(0,parseInt(productType.length)-1);
                    }else {
                        myAlert('请选择产品类型！');
                        return false;
                    }
                    if(!$(".sign_button_4").is(":hidden") || !$(".sign_button_5").is(":hidden")){
                        CommonFn.alertPopupFun($ionicPopup,'loser','请完成电子签名！',3000);
                        return;
                    }
                    tjConfirmationData = {agentName:agentName,cerNo:cerNo,productNames:productNames,payment:payment,productType:productType,
                        confirmDate:$scope.currentDate,agentSign:agentSign,appSign:appSign,appSignConfirm:appSign2,agentPhoto:agentPhoto,appPhoto:appPhoto,appPhotoConfirm:appPhoto2};
                    //alert("确认书信息："+JSON.stringify(tjConfirmationData));
                    signConfirmationList = signConAgent.concat(signConApp1).concat(signConApp2);
                    //alert("确认书影像信息："+JSON.stringify(signConfirmationList));
                }
			}

//			alert("commitInsurance.insuranceStateFlag:"+insuranceStateFlag);
			if(insuranceStateFlag){
				return;
			}
			var isElecFlag = "Y";
			var printNo1 = document.getElementById("printNo1").value;
			var printNo2 = document.getElementById("printNo2").value;
			var formID = document.getElementById("formID").value;//保单ID
			var propsalID = document.getElementById("propsalID").value;//建议书ID
			var applicantID = document.getElementById("applicantID").value;//投保人ID
			var PrintReg = /^116[0-9]{11}$/;			
			
			//纸质签名需要验证印刷号
			//alert("$scope.SignMark:"+$scope.SignMark);
			if(!$scope.SignMark){
				isElecFlag = "N";
				// if(!printNo1){
				// 	CommonFn.alertPopupFun($ionicPopup,'loser','电子投保申请确认书的印刷号不能为空！',3000);
				// 	return;
				// }
				if(!PrintReg.test(printNo1)){
					myAlert('印刷号不能为空,且必须以116开头只能是14位数字！');
		            printNo1='';
		            printNo1.focus();
		            return;
				// }else if(printNo1.indexOf("116") != 0){
				// 	CommonFn.alertPopupFun($ionicPopup,'loser','电子投保申请确认书的印刷号必须以116开头！',3000);
				// 	return;
				// }else if(printNo1.length != 14){
				// 	CommonFn.alertPopupFun($ionicPopup,'loser','电子投保申请确认书的印刷号只能是14位！',3000);
				// 	return;
				 }else if(printNo1 != printNo2){
					CommonFn.alertPopupFun($ionicPopup,'loser','请检查，两次输入不一致！',3000);
					return;
				}				

				//保存该保单已录入的印刷号
				var printNoParameterJson = {
						applyID : formID,
						applyData : {"PRINT_NO" : printNo1},
						callBackFun : function(result){
							if(result){
								
							}
						}
				};
				unFinshedInsurance.updateInsuranceData(printNoParameterJson);
			}
			//var confirmResult = confirm("请您仔细查看您填写的信息是否有误，如有误请返回上一步给予修改！");
			myConfirm('提示','请您确认您填写的信息是否有误，如有误请点击取消返回上一步给予修改！',function(){
				//				CommonFn.alertPopupFun($ionicPopup,'loading','保单提交中...',0);
				cancelMyConfirm();
				loadingWait();
				// insuranceStateFlag = true;
				
				var isCallbackFlag = false;
				unFinshedInsurance.commitInsurance({
					isreleated:isreleated,
					printNo:printNo1,
					formID:formID,
					signInsurnoticeList:signInsurnoticeList,
					signApplyList:signApplyList,
                    signConfirmationList:signConfirmationList,
                    tjConfirmationData:tjConfirmationData,
					elecSignNameFlag:isElecFlag,
					propsalID:propsalID,
					applicantID:applicantID,
					callBackFun:function (data){
//						if(null != Variables.alertPopup){
//							Variables.alertPopup.close();
//						} 
						isCallbackFlag = true; 
						//隐藏加载提示框
						closeLoadingWait();	
						//返回的当前保单状态
						var returnStatus = data.status;
						var returnjsonMap = data.jsonMap;
						var customerList=data.customerUnionQuestionVOList; //客户合并的参数
						if(1 == returnStatus.code || 2 == returnStatus.code || 3 == returnStatus.code || -1 == returnStatus.code || 7 == returnStatus.code){
							myAlert(returnStatus.msg);
							insuranceStateFlag = false;
							//CommonFn.alertPopupFun($ionicPopup,'loser',returnStatus.msg,3000);
						}else if(-4 == returnStatus.code){ //客户合并的code码
							//客户合并方法开始-----------------
							//alert("code:"+returnStatus.code+"customerList:"+JSON.stringify(customerList));
							//以下方法为动态添加客户合并那个弹窗的dom结构
							
							var customer_html = document.getElementById("customer_div");
							var html='';
				            for(i=0;i<customerList.length;i++){
				                    
				                var str ='<tr style="padding-top:20px;padding-bottom: 10px;">'+
				                  '<td id="message_'+customerList[i].customerType+'"style="text-align: left;">'+customerList[i].customerAddress+'</td>'+'</tr>'+                     
				                '<tr>'+
				                    '<td>'+
				                        '<span class="input_style">'+
				                           '<input type="radio" name="choice_'+customerList[i].customerType+'" id="yes_'+customerList[i].customerType+'" onclick="bind_radio(this.id);" value ="1" />是'+
				                        '</span>'+
				                        '<span class="input_style">'+
				                            '<input type="radio" name="choice_'+customerList[i].customerType+'" id="no_'+customerList[i].customerType+'"  onclick="bind_radio(this.id);"  value ="0" />否'+
				                        '</span>'+
				                    '</td>'+
				                '</tr>'
				                var html= html+str;				                      
				            }
				            customer_html.innerHTML=html; //给页面添加结构，至此动态添加结构完毕
							myAlertOkFun(function(){
								//客户合并弹窗确认后上传，以下为所需传给后台的参数(投被保人所选的是否)answers
								var customer_obj = {};
								var customer_array = [];
								for(i=0;i<customerList.length;i++){
									var customer_obj = {};
									customer_obj["customerNo"] = customerList[i].customerNo;
									customer_obj["customerType"] = customerList[i].customerType;
									if(customerList[i].customerType==0){
										var Recognizee_choice = radioValue('choice_0'); //获取被保人0的选择是否(value=1是,value=0否)
										// alert("Recognizee_choice:"+Recognizee_choice);
										customer_obj["unionFlag"] = Recognizee_choice;
									}else{
										var Applicant_choice = radioValue('choice_1'); //获取投保人1的选择是否
										//alert("Applicant_choice:"+Applicant_choice);
										customer_obj["unionFlag"] = Applicant_choice;
									}									
									customer_array[i] = customer_obj;
								}
								var relationflag = '';
								if(isreleated == '03' || isreleated == 'Y'){
									relationflag = 'FY';
								}else if(isreleated == '05'){
									relationflag = 'WY';
								}
								var relCusapplyNo = returnjsonMap.applyNo;
								var sendUrl = API_URL + "/app/apply/mergeCustomer";
								var json = {"url":sendUrl, "parameters": {
											"applyNo": relCusapplyNo,
											"sAnswerList": customer_array,
											"relationFlag":relationflag
											}
									}
								loadingWait(); //加载提示框
								httpRequestByPost(json,function (data){
									//alert("data:"+JSON.stringify(data));
									closeLoadingWait();  //隐藏加载提示框
									var jsonObj = eval("("+data+")");
									var code = jsonObj["status"].code;
									var existsWNX = jsonObj["jsonMap"].existsWNX;
									if('4' == code || '3' == code){//成功合并客户后跳转到已提交保单的未承保页面									  			
										if(existsWNX == "0" ){
											var recommendId = generatePrimaryKey();
											var propsalID = document.getElementById("propsalID").value;//建议书ID
											var insuraId = generatePrimaryKey();
											var applyNo =  returnjsonMap.applyNo;
											var existsWNXmsg = '由于您既往未投保过《民生聚鑫宝年金保险（万能型）》保单，请选择万能险未提交保单再次投保';
											myAlert(jsonObj["status"].msg+'<br/><br/>'+existsWNXmsg);								
											unFinshedInsurance.updateApplyInfo({
									        	insuraId:insuraId,
									        	recommendId:recommendId,
									        	formID:formID,
									        	applyNo:applyNo,
									        	callBackFun : function(result){
									        		$scope.isSubmit  = "Y";
													insuranceStateFlag = false;
													$rootScope.insuranceSubmitSuccess = false;
													$state.go('menu.list');
									        	}
									        });
									        unFinshedInsurance.updateReleatedInfo({
									        	insuraId:insuraId,
									        	recommendId:recommendId,
									        	propsalID:propsalID,
									        	formID:formID,
									        	applyNo:applyNo
									        });
										}else{
											insuranceStateFlag = true;
											myAlert(jsonObj["status"].msg); 
											//调用插件去修改建议书和客户的状态
											var propsalID = document.getElementById("propsalID").value;//建议书ID
											submitInsurance.updateOtherAppDb({
												formID:formID,
												propsalID:propsalID
											});

											//修改保单提交时间
											var parameterJson = {
												applyID : formID,
												submitTime : new Date().getTime(),
												callBackFun : function(result){
													if(result){
														$scope.isSubmit  = "Y";
														$rootScope.insuranceSubmitSuccess = true;
														$state.go('menu.submit');
													}
												}
											};
											unFinshedInsurance.updateInsuranceState(parameterJson);
										}
									}else{  //合并失败
										insuranceStateFlag = false;
										myAlert(jsonObj["status"].msg); 
										return;
									}										
							 	},function (err){
									closeLoadingWait();
									myAlert('网络异常，请稍候重试！');
								});//post请求结束

								//何时关闭弹窗
								for(i=0; i<customerList.length; i++){
									if(customerList.length<=1){
										if(customerList[i].customerType==0){ //被保人
											var Recognizee_choice = radioValue('choice_0');
											if(Recognizee_choice != undefined){
												closemyAlertOkFun('choice_0'); //关闭myalert方法
											}
										}
										if(customerList[i].customerType==1){ //投保人
											var Applicant_choice = radioValue('choice_1');
											if(Applicant_choice != undefined){
												closemyAlertOkFun('choice_1'); //关闭myalert方法
											}
										}
										
									}else{ //投被保人同时存在
										var Recognizee_choice = radioValue('choice_0');
										var Applicant_choice = radioValue('choice_1');						
										if(Recognizee_choice != undefined && Applicant_choice != undefined){
											closemyAlertOkFun('choice_2'); //关闭myalert方法
										}
										break;
									}	
							 	}//关闭结束							 	
							});
						//客户合并方法结束----------------------	

						}else{//保单提交成功后跳转到已提交保单的未承保页面	
							// alert('returnStatus=='+JSON.stringify(data) )
							var recommendId = generatePrimaryKey();
							var propsalID = document.getElementById("propsalID").value;//建议书ID
							var insuraId = generatePrimaryKey();
							var existsWNX = returnjsonMap.existsWNX;//关联万能时是否投过万能险标识
							var applyNo =  returnjsonMap.applyNo;
							if(existsWNX == '0'){
								var existsWNXmsg = '由于您既往未投保过《民生聚鑫宝年金保险（万能型）》保单，请选择万能险未提交保单再次投保'
								myAlert(returnStatus.msg+'<br/><br/>'+existsWNXmsg);								
								unFinshedInsurance.updateApplyInfo({
						        	insuraId:insuraId,
						        	recommendId:recommendId,
						        	formID:formID,
						        	applyNo:applyNo,
						        	callBackFun : function(result){
						        		$scope.isSubmit  = "Y";
										insuranceStateFlag = false;
										$rootScope.insuranceSubmitSuccess = false;										
								        unFinshedInsurance.updateReleatedInfo({
						        			insuraId:insuraId,
						        			recommendId:recommendId,
						        			propsalID:propsalID,
						        			formID:formID,
						        			applyNo:applyNo
						        		});
						        		$state.go('menu.list');
						        	}
						        });

							}else{
								myAlert(returnStatus.msg);
								//设置保单为提交成功状态
								insuranceStateFlag = true;
								//CommonFn.alertPopupFun($ionicPopup,'charging',returnStatus.msg,3000);							
								//调用插件去修改建议书和客户的状态
								var propsalID = document.getElementById("propsalID").value;//建议书ID
								submitInsurance.updateOtherAppDb({
									formID:formID,
									propsalID:propsalID
								});

								//修改保单提交时间
								var parameterJson = {
									applyID : formID,
									submitTime : new Date().getTime(),
									callBackFun : function(result){
										if(result){
											$scope.isSubmit  = "Y";
											$rootScope.insuranceSubmitSuccess = true;
											$state.go('menu.submit');
										}
									}
								};
								unFinshedInsurance.updateInsuranceState(parameterJson);
							}
						}
					}
				});

				/****************解析config.xml返回dom对像 Li Jie start 2015-04-20 ******************/
				var milliSecond = getMilliSecondOfTimeout("commitInsurance");
				$timeout(function(){ 
					if(isCallbackFlag == false){
						//隐藏加载提示框
						closeLoadingWait();
						CommonFn.alertPopupFun($ionicPopup,'loser','请求超时！',3000);
					}
				},milliSecond); 
			
			});
			/*if(confirmResult){
}*/
		}
		$scope.slideChanged = function (index) {
			//$scope.step2 = { activeTab : 1};
			$scope.slideIndex = index;
		};
		$scope.disableSwipe = function() {
			$ionicSlideBoxDelegate.enableSlide(false);
		};
		
		/*********电子签名  Li Jie start**********/
		
		$scope.signatureTypeSelect = function(type){
			/*type 0----电子签名  1---纸质签名*/
			if('0' == type){ //电子签名
					var dzSign = document.getElementById("dzSign").checked;
					if(dzSign){ //将纸质签名的按钮设置disabled
							document.getElementById("zzSign").checked= false;
							isSiagn = 1;
					}else{
							isSiagn = 0;
					}
			}else if('1' == type){//纸质签名
					var zzSign = document.getElementById("zzSign").checked;
					if(zzSign){
							document.getElementById("dzSign").checked= false;
							isSiagn = 2;
					}else{
							isSiagn = 0;
					} 
			}
		}
		
		/********电子签名  Li Jie end***********/ 
		/**初始化受益人的码表信息 --受益人关系**/ 
		$timeout(function(){
			var bycode = {
				"databaseName": 'promodel/10005/www/db/t_code.sqlite',
				"tableName": "T_CODE",
				"conditions": {"CODE_TYPE": 'relation'}
			};
			queryTableDataByConditions(bycode, function (data) {
				if(data){
					$scope.$apply(function (){
						relationList = data; 
					}); 
				}
			});
		},2000);
		/**受益人信息保存**/
		$scope.saveSyrDataBase = function(benefitMan) {
		 		iterRatorSyrUserData(benefitMan);
		};
		//取消
		$scope.insure_cancel = function(){
			$rootScope.selectedRow = '-1';
			pageSignCtrlTime = 0;		    
 			if(window.location.href.indexOf("?") > 0 && window.location.href.indexOf("none") >0 ){
 				var url = "promodel/"+Variables.recommendAppId+"/www/index.html#/menu/list/Y?isonlineFlag=true&pctype="+document.getElementById("pctype").value+"&agentCode="+agentCode;
				var jsonKey ={
					"serviceType":"LOCAL",
					"URL": url,
					"closePrev":"yes"
				};

				pushToViewController(jsonKey, function (){
					console.log("返回到已完成建议书");
				},function (){
					console.log("返回到已完成建议书失败");
				});
				// closeWebView("",function (){
				// 	console.log('应用退出成功！');
				// },function (){
				// 	console.log('应用退出失败！');
				// });
 			}else{
 				$state.go('menu.list');	
 			}  	 										

		}; 
		
		$scope.setSmsCodeEnable = function(){
			 var values = document.getElementById("mobile").value;
			 if(values){
					document.getElementById("smsCode").disabled = false;
			 }else{
					document.getElementById("smsCode").disabled = true;
			 }
		};
		
		
		/**********************************投保须知&影像录入***************************************/

		angular.element(document).ready(function () {
			//pdf高度
			/*var pdfH = document.getElementById('pdf-con').offsetHeight;
			document.getElementById('frame').height = pdfH - 82;*/
		});

		//document.addEventListener('deviceready', function(){
			/**
			 * 投保事项里的选择银行select
			 */
			//initData.loadBanks(function(){
			//	$scope.bankData=Variables.bankJson;
			//});
			/*$scope.sele=function(selectedBank){
				alert(selectedBank.BANK_CODE)
			};*/
//---------------------------------------------begin------------------------------------------------------
			/**模糊查询银行列表  2016.8.6  wuwei
			 * [queryBank description]
			 * @return {[type]} [description]
			 * "01"-工商银行 04-农业银行,"03"-建设银行,02中国银行,22-邮储,17-农村信用社
			 * */
			var allProvince = dsy.Items['0'];
			CommonFn.adressSelect('bankAddress', allProvince, $scope, dsy, 'BANK_PROVINCE', 'BANK_CITY', 'basicAfress');
			$scope.bankAddress = {
			    adress: {
			      basicAfress: {
			        province: allProvince,
			        city    : '',
			        county  : null
			      }
	    		},
	    		data: {
      				"BANK_PROVINCE" : "",
      				"BANK_CITY"  : "",
					"bankSubType":""
    			}
  			};		
			$scope.returnbank = function (newBankNameList){
			 	$scope.bankDatas = newBankNameList;
			 	if(pcType=='phone'){
					document.getElementById('iDBody2').style.display = "block";
				}else{
					document.getElementById('iDBody1').style.display = "block";
				}
				//document.getElementById('iDBody1').style.display = "block";	
				return $scope.bankDatas;
			};

			$scope.queryBank = function(){            				
				initData.loadBanks1(function(){
					Variables.bankJsons = deleteRepeatBC(Variables.bankJsons);
					//搜索框根据条件搜索银行信息，不进行排序							
					if(Variables.bankJsons!="" && Variables.bankJsons!= undefined && Variables.bankJsons!=null){
						$scope.$apply(function (){							
							$scope.bankDatas = Variables.bankJsons;	
						});					
						if(pcType=='phone'){
							document.getElementById('iDBody2').style.display = "block";
						}else{
							document.getElementById('iDBody1').style.display = "block";
						}									
						return $scope.bankDatas;					
					}else{
						myAlert("银行信息查询错误");
						return;
					}
			    });
				
			};

			//将选定的银行信息带入到搜索框里  add  2016.8.11
			$scope.newbankname = function(index){
				$scope.bankData_chackname = $scope.bankDatas[index];	
				$scope.id3 = $scope.bankData_chackname.BANK_NAME;
				$scope.id5 = $scope.bankData_chackname.BANK_CODE;
				if(pcType=='phone'){
					document.getElementById('bank_select_pc').value =$scope.id3;
					document.getElementById('iDBody2').style.display = "none";
				}else{
					document.getElementById('bank_select').value =$scope.id3;
					document.getElementById('iDBody1').style.display = "none";
				}
						
				
										
				var num1 =parseFloat($scope.productsData[0][3]);//主险保费					
				var num = 0;
				for(var j =1;j<$scope.productsData.length;j++){//附加险保费	
					num+=parseFloat($scope.productsData[j][3]);					
				}												
				numCount = num1+num;//保费总额
				$scope.MoneyCount = numCount;

				if($scope.id3 == "江西省农村信用社"){$scope.GbaneMeney(numCount,10000,"江西省农村信用社");}
				if($scope.id3 == "山东农村信用社"){$scope.GbaneMeney(numCount,5000000,"山东农村信用社");}						
				if($scope.id3 == "福建省农村信用社"){$scope.GbaneMeney(numCount,50000,"福建省农村信用社");}		
				if($scope.id3 == "安徽农村信用社"){$scope.GbaneMeney(numCount,5000000,"安徽农村信用社");}				
				if($scope.id3 == "湖南农村信用社"){$scope.GbaneMeney(numCount,1000000,"湖南农村信用社");}	
				if($scope.id3 == "湖北省农村信用社"){$scope.GbaneMeney(numCount,5000000,"湖北省农村信用社");}
				if($scope.id3 == "内蒙古农村信用社"){$scope.GbaneMeney(numCount,5000000,"内蒙古农村信用社");}
				if($scope.id3 == "重庆农村商业银行"){$scope.GbaneMeney(numCount,5000000,"重庆农村商业银行");}								
				if($scope.id3 == "河北省农村信用社"){$scope.GbaneMeney(numCount,50000,"河北省农村信用社");}

				//add邮储非工作时间提示信息  2016.9.11  wuwie  2538	
				//添加邮储直连限时扣费
				if($scope.id3.indexOf("邮政储汇局") > -1 || $scope.id3.indexOf("邮储") > -1 || $scope.id3.indexOf("邮政") > -1){
                    myConfirm_PO("邮储收费温馨提示:","(1)使用邮政储蓄银行卡扣费，保费金额低于5万元（含）在00:00-20:00期间可进行实时扣费。(2)使用邮政储蓄银行卡扣费，保费金额高于5万元（不含）在9：30-17:00期间可进行准实时扣费。(3)使用邮政储蓄银行存折扣费，在9：30-17:00期间可进行准实时扣费。",function(){
                        if(pcType=='phone'){
                            document.getElementById('bank_select_pc').value ="";
                            $('#bankSubType').css('display','none');
                            document.getElementById("phone-num-pc").setAttribute("placeholder","请输入银行卡号");
                            document.getElementById("phone-num-pc2").setAttribute("placeholder","请再次输入银行卡号");
                        }else{
                            document.getElementById('bank_select').value ="";
                            $('#bankSubType_pc').css('display','none');
                            document.getElementById("phone-num").setAttribute("placeholder","请输入银行卡号");
                            document.getElementById("phone-num2").setAttribute("placeholder","请再次输入银行卡号");
                        }
                        cancelMyConfirm_PO();
                    },function(){
                        cancelMyConfirm_PO();
                    });



				}


			};
//-------------------------------------------------end------------------------------------------------------------
			//超额的公共方法  add  2016.8.26  wuwei
			$scope.GbaneMeney = function(numCount,numCount2,insuranceList){
					if(numCount > numCount2){
						if(pcType=='phone'){
							document.getElementById('bank_select_pc').value ="";
						}else{
							document.getElementById('bank_select').value ="";
						}
						myAlert("由于"+insuranceList+"线上扣费单笔单日上限为"+numCount2+"元，您的保费已超过限额，请更换其他银行扣费");
						return ;
					}				
			};
			$scope.autoPayFlag = "N";

			$scope.autoPAY_FOR = function(applyObj){
				
				$scope.autoPayFlag = "Y";
				if(pcType == "phone"){
					var autoPay = document.getElementById("phone_autoPay");
				}else{
					var autoPay = document.getElementById("Pc_autoPay");
				}
				Pay_myAlertOkFun("续期保险费超过宽限期仍未交付时，是否选择保险费自动垫交，请选择！",function(){					
					 var values=radioValue("choice_PAY_FOR");
						if(values=='1'){
							autoPay.checked = true;
							$scope.applyObj.IS_PAY_FOR = true;
							Pay_closemyAlertOkFun();
						}
						if(values=='0'){
							autoPay.checked = false;
							$scope.applyObj.IS_PAY_FOR = false;
							Pay_closemyAlertOkFun();
						}					
				})
			}
			//优医保自动重新投保点击方法获取值 add by renxiaomin 2019.1.29
			$scope.anewInsure = function(){
				var anewInsure="";
				if(pcType == "phone"){
					anewInsure= document.getElementById("phone_anewInsure").getAttribute("anewInsureValue");
				}else{
					anewInsure= document.getElementById("Pc_anewInsure").getAttribute("anewInsureValue");
				}
				if(anewInsure == "-2"){
					$scope.applyObj.IS_ANEW_INSURES=false;
					document.getElementById("Pc_anewInsure").setAttribute("anewInsureValue") = "-1";
				}else{
					$scope.applyObj.IS_ANEW_INSURES=true;
					document.getElementById("Pc_anewInsure").setAttribute("anewInsureValue") = "-2";
				}
			}
			$scope.electronicChange = function(applyObj){
				if(pcType == "phone"){
					var applyObjName = document.getElementsByName('applyObjName');
				}else{
					var applyObjName = document.getElementsByName('Pc_applyObjName');
				}				
				for (var i = 0; i < applyObjName.length; i++) {
			      // if(applyObjName[0].checked){
			      	myConfirm2("保单提供形式确认","若勾选此项，我公司将不再为您递送纸质保险合同。",function(){
			      		cancelMyConfirm2();
			      		applyObjName[0].checked = false;
			      		applyObjName[1].checked = true;
			      		$scope.applyObj.IS_INSURE = false;
			      		$scope.applyObj.IS_INSURE_PAPER = true;
			      	},function(){
			      		cancelMyConfirm2();
			      		applyObjName[0].checked = true;
			      		applyObjName[1].checked = false;
			      		$scope.applyObj.IS_INSURE = true;
			      		$scope.applyObj.IS_INSURE_PAPER = false;
			      	});
			      // }
			    }
			}; 
			$scope.electronicChangeTwo = function(applyObj){
				if(pcType == "phone"){
					var applyObjName = document.getElementsByName('applyObjName');
				}else{
					var applyObjName = document.getElementsByName('Pc_applyObjName');
				}
				for (var i = 0; i < applyObjName.length; i++){
					applyObjName[i].checked = false;
				}
				applyObjName[1].checked = true;
				$scope.applyObj.IS_INSURE = false;
			    $scope.applyObj.IS_INSURE_PAPER = true;
			}
			
			 /***********************在线投保 险种设计跳转详情页面 Li Jie 2015-4-14 start*************************/
			$ionicModal.fromTemplateUrl('templates/insurance_type_info.html', {
				scope: $scope
			}).then(function(modal) {
				$scope.modal = modal;
			});
			//查看险种详细信息
			$scope.showInsuranceInfo = function (i){
				$scope.productInfo = $scope.productsData[i];
				var items = new Array();
				for(var k = 0 ; k < $scope.productsTitle.length ; k++){
					var obj = new Object();
					obj.NAME = $scope.productsTitle[k];
					for(var j = 0 ; j < $scope.productInfo.length ; j ++){
						if( j == k ){
							obj.ITEM = $scope.productInfo[j];
						}
					}
					items.push(obj);
				}
				var item0 = items[0];
				var item6 = items[6];
				if(item0.ITEM == "121716" || item0.ITEM == "121717" || item0.ITEM == "121718" || item0.ITEM == "121719" || item0.ITEM == "111808"){
					item6.ITEM = "趸交";
				}
				$scope.productInfoitem = items;
				$scope.modal.show();
			}
			$scope.closeModal = function (){
				$scope.modal.hide();
			}	
			$scope.$on('$destroy', function() {
			    $scope.modal.remove();
			});
			
			$ionicModal.fromTemplateUrl('templates/insurance_customer_info.html', {
				scope: $scope
			}).then(function(modal) {
				$scope.modalCustomer = modal;
			});
			//查看受益人信息
			$scope.showCustomerInfo = function (i,type){ 
				if('0' == type){
					$scope.customerInfo = $scope.benefitOneData[i];
					$scope.customerInfo.currentIndex = i;
					$scope.customerInfo.type = 0;
				}else{
					$scope.customerInfo = $scope.benefitTwoData[i];
					$scope.customerInfo.currentIndex = i;
					$scope.customerInfo.type = 1;
				}
				$scope.modalCustomer.show();
			}
			$scope.closeModalCustomer = function (){
				$scope.modalCustomer.hide();
			}
			$scope.$on('$destroy', function() {
			    $scope.modalCustomer.remove();
			});
		/***********************在线投保 险种设计跳转详情页面 Li Jie 2015-4-14 end*************************/
				
			/**
			 * 下一步
			 */

			$scope.NextStep = function (slideIndex) { 
				var formID = document.getElementById("formID").value;
				var applicantID = document.getElementById('applicantID').value;
				var recognizeeID = document.getElementById('recognizeeID').value;
				var agentCode = storage.getItem('agentCode'); 
				var listValMap = [{"id":"tbxz_agree","msg":"投保须知选择同意后进行操作!"},{"id":"bxtk_agree","msg":"保险条款选择同意后进行操作!"},{"id":"cpsm_agree","msg":"产品说明选择同意后进行操作!"},{"id":"Glbd_agree","msg":"关联保单特别约定选择同意后进行操作!"}];
				//‘资料出示’验证，暂时屏蔽便于测试
				//var isPass =  agreeNextValidateFn(listValMap,$ionicPopup); 
				// if(!isPass){
				// 	return;
				// }
				isPass = true;
				//获取保费  2016.9.26  wuwei
				applynum = parseFloat(window.localStorage.getItem('applynum'));
				if((slideIndex == 0||slideIndex == undefined) && isPass == true){
					if(pcType == 'phone'){
						//document.getElementById("step2_title").innerHTML ='投保人信息';
						setPageIndexLogoCss("index_two");
					}

					/* 进入第二步‘信息录入’时，初始化页面相关数据 */
					//初始化关系列表
					initRelationList();
					if(mianIsureId == '111805' || mianIsureId == '111802' || mianIsureId =='111702'){
						$scope.cardBefit = true; //受益人不显示
						if(mianIsureId != '111802'){
							$scope.yyB_show = true; //重新投保显示 
						}
					}

					//初始化银行列表
					initData.loadBanks(function(){
						$scope.bankData=Variables.bankJson;
					});
					bankScope = $scope; 
					/***************初始化银行卡信息*****************/ 
					online_apply_id = formID 
					var bank_List = {
						"databaseName":"promodel/10005/www/db/t_bank.sqlite",
						"sql": "select a.[applyId],a.[appliantName],a.[appliantId],a.[bankCode],a.isChecked, a.[cardNum],a.[createTime],a.[BANK_CITY],a.[BANK_PROVINCE],a.[bankSubType],a.[bankPhoneNum],(select b.BANK_NAME from t_bank b where b.BANK_CODE = a.[bankCode]) as   BANK_NAME  from T_APP_BANK a where a.appliantId ='"+applicantID+"' and a.isChecked ='true'  order by a.createTime desc "
					}; 
					queryTableDataUseSql(bank_List,function(data){
						data = deleteRepeat(data)
						if(data){
							var domBankDiv = pcType == 'phone'?document.getElementById("bank_info_div_pc"):document.getElementById("bank_info_div");
							var cur_html ='';
							var phone_html ='';
							var isCheckHtml ='';
							for(var i = 0; i<data.length; i++){
								if(data[i].isChecked == 'true'){
									cur_html +='<table width="100%" height="30px"><tr><td width="5%"><input type="radio" style="width:20px;height:20px" checked="checked" name="bank" onclick="chooseBank(\''+data[i].bankCode+'\',\''+data[i].BANK_NAME+'\',\''+data[i].cardNum+'\')" value=\''+data[i].bankCode+'\'></input></td><td width="20%">'+ data[i].BANK_NAME + '</td><td  width="10%">' + data[i].appliantName + '</td><td  width="20%">' +  data[i].cardNum+ '</td><td  width="10%">' +  data[i].BANK_PROVINCE+ '</td><td  width="10%">' +  data[i].BANK_CITY+ '</td><td  width="10%">' + data[i].bankPhoneNum + '</td><td width="10%"><input class="push-button" type="button" value="删除" onclick="deleteBankByCode(\''+data[i].applyId+'\',\''+data[i].bankCode+'\',\''+data[i].cardNum+'\')"></input></td></tr></table><span></span>';
									isCheckHtml+='<span></span>';
								}else{
									cur_html +='<table width="100%" height="30px"><tr><td width="5%"><input type="radio" style="width:20px;height:20px" name="bank" onclick="chooseBank(\''+data[i].bankCode+'\',\''+data[i].BANK_NAME+'\',\''+data[i].cardNum+'\')" value=\''+data[i].bankCode+'\'></input></td><td width="20%">'+ data[i].BANK_NAME + '</td><td  width="10%">' + data[i].appliantName + '</td><td  width="20%">' +  data[i].cardNum+ '</td><td  width="10%">' +  data[i].BANK_PROVINCE+ '</td><td  width="10%">' +  data[i].BANK_CITY+ '</td><td  width="10%">' + data[i].bankPhoneNum + '</td><td width="10%"><input class="push-button" type="button" value="删除" onclick="deleteBankByCode(\''+data[i].applyId+'\',\''+data[i].bankCode+'\',\''+data[i].cardNum+'\')"></input></td></tr></table>';
									isCheckHtml ='';
								}  
								phone_html+='<div class="table_list">';
								phone_html+='<p>'+ data[i].BANK_NAME + '</p>';
								phone_html+='<p>'+ data[i].appliantName + '</p>';
								phone_html+='<p>'+ data[i].cardNum+ '</p>';
								if(data[i].bankSubType=='1'){
                                    phone_html+='<p>存折</p>';
								}else if(data[i].bankSubType=='2'){
                                    phone_html+='<p>银行卡</p>';
								}
								phone_html+='<p>'+ data[i].BANK_PROVINCE+ '</p>';
								phone_html+='<p>'+ data[i].BANK_CITY+ '</p>';
								phone_html+='<p>'+ data[i].bankPhoneNum+ '</p>';
								if(data[i].isChecked != 'true'){
									phone_html+='<button class="button button-stable" onclick="chooseBank(\''+data[i].bankCode+'\',\''+data[i].BANK_NAME+'\',\''+data[i].cardNum+'\',\''+applynum+'\')">选中</button>';
								} 
								phone_html+='<button  class="button button-stable" onclick="deleteBankByCode(\''+data[i].applyId+'\',\''+data[i].bankCode+'\',\''+data[i].cardNum+'\',\''+applynum+'\')">删除</button>';
								phone_html+=''+isCheckHtml+'</div>';
							}
							domBankDiv.innerHTML = pcType == 'phone'?phone_html:phone_html; 
						}
						$scope.listBank = data;
					}); 
					/*alert(slideIndex);
					alert(formID);*/
					//投保人
					//$timeout(function(){
						var fromUnfinishTbr = {
							"databaseName": Variables.dataBaseName,
							"tableName": "T_CUSTOMER",
							"conditions": {"CUSTOMER_ID": applicantID,"IS_BENEFIT":"0","APPLY_ID":formID}
						};
						queryTableDataByConditions(fromUnfinishTbr, function (data) {
							
							console.log(data[0]);

								var tempData = data[0];
								$scope.$apply(function(){
									replaceNull(tempData);
									$scope.applicantData = tempData;
									$scope.applicantData.NAME = tempData.NAME;
									$scope.applicantData.SEX = tempData.SEX;
									$scope.applicantData.BIRTHDAY = tempData.BIRTHDAY;
									$scope.applicantData.RELATION = tempData.RELATION;
									$scope.applicantData.OCCUPATION_CODE = tempData.OCCUPATION_CODE;
									$scope.applicantData.OCCUPATION = tempData.OCCUPATION;
									//$scope.applicantData.RELATION = tempData.RELATION;
								});
								var query1002_sql = {
									"databaseName": 'promodel/10002/www/db/esales.sqlite',
									"tableName": "T_CUSTOMER",
									"conditions": {"ID":data[0].CUSTOMER_ID }
								};
								queryTableDataByConditions(query1002_sql, function (data2) {

									$scope.$apply(function(){
										var tempData = data2[0];
										replaceNull(tempData);
										// 投保人告知中带入身高体重 --add by wangzj
										window.localStorage.setItem("applicantHeight", tempData.HEIGHT);
										window.localStorage.setItem("applicantWeight", tempData.WEIGHT);
										window.localStorage.setItem("applicantPhone", tempData.COMPANY_PHONE);
										window.localStorage.setItem("applicantMobile", tempData.MOBILE);
					                    // 日期时间戳和日期转换  add by renxiaomin 2016.11.23
					                    if((typeof tempData.ID_END_DATE == 'string') && tempData.ID_END_DATE != '长期有效'){
					                        $scope.validity=tempData.ID_END_DATE;
					                        var R=new Date();
					                        var newY=R.getFullYear();
					                        var oldY=Number($scope.validity.substr(0,4));
                                            if((oldY-newY)>=90 || oldY==9999){
					                          tempData.ID_END_DATE='长期有效';
					                       }else{
					                          tempData.ID_END_DATE=$scope.validity;
					                       }     
					                      }

										$scope.applicantData.BIRTHDAY = tempData.BIRTHDAY;
										$scope.applicantData.IDNAME = tempData.IDTYPE;
										$scope.applicantData.IDNO = tempData.IDNO;
										$scope.applicantData.ID_END_DATE = tempData.ID_END_DATE;
										$scope.applicantData.NATIVE_PLACE = tempData.NATIVE_PLACE;
										//$scope.applicantData.RGT_ADDRESS = tempData.HOME_PROVINCE+tempData.HOME_CITY+tempData.HOME_COUNTY+tempData.HOUSEHOLD_ADRESS;
										$scope.applicantData.RGT_ADDRESS = tempData.RGT_PROVINCE + tempData.RGT_CITY;//+tempData.HOUSEHOLD_COUNTY;
										$scope.applicantData.MARRIY = tempData.MARRI_STATUS;
										$scope.applicantData.INCOME = tempData.INCOME;
										$scope.applicantData.INCOME_WAY = tempData.INCOME_WAY;
										$scope.applicantData.WORK_UNIT = tempData.WORK_UNIT;
										$scope.applicantData.PHONE = tempData.COMPANY_PHONE;
										$scope.applicantData.MOBILE = tempData.MOBILE;
										$scope.applicantData.EMAIL = tempData.EMAIL;

										// 在线投保投保事项中带入手机号 add by wangzj 20160829
										$scope.applyObj.VALID_PHONE = tempData.MOBILE;
										//银行预留投保人手机号
										$scope.applyObj.BANK_PHONE = tempData.MOBILE;


										if(organCode.substr(0,4) == '8614'){
										    var COMPANY_ADDRESS = tempData.COMPANY_ADDRESS;
										    var s_COMPANY_ADDRESS='';
										    var lastStr = COMPANY_ADDRESS.split('@%@');
										        for(i=0;i<lastStr.length;i++){
										          s_COMPANY_ADDRESS+=lastStr[i];
										        }
										        tempData.COMPANY_ADDRESS=s_COMPANY_ADDRESS; // 单位地址
										    var HOME_ADDRESS = tempData.HOME_ADDRESS;
										    var s_HOME_ADDRESS = '';
										    var lastStr = HOME_ADDRESS.split('@%@');
										        for(i=0; i< lastStr.length;i++){
										          s_HOME_ADDRESS += lastStr[i];
										        }
										        tempData.HOME_ADDRESS=s_HOME_ADDRESS;  // 家庭住址
								    	}
										if(tempData.COMPANY_PROVINCE=="北京"||tempData.COMPANY_PROVINCE=="上海"||tempData.COMPANY_PROVINCE=="天津"||tempData.COMPANY_PROVINCE=="重庆"){
											$scope.applicantData.MAILING_ADDRESS =tempData.COMPANY_CITY+tempData.COMPANY_COUNTY+tempData.COMPANY_ADDRESS;
										}else{
											$scope.applicantData.MAILING_ADDRESS = tempData.COMPANY_PROVINCE +tempData.COMPANY_CITY+tempData.COMPANY_COUNTY+tempData.COMPANY_ADDRESS;
										}
										$scope.applicantData.MAILING_ZIP_CODE = tempData.COMPANY_ZIP_CODE;
										if(tempData.HOME_PROVINCE=="北京"||tempData.HOME_PROVINCE=="上海"||tempData.HOME_PROVINCE=="天津"||tempData.HOME_PROVINCE=="重庆"){
											$scope.applicantData.HOME_ADDRESS = tempData.HOME_CITY+tempData.HOME_COUNTY+tempData.HOME_ADDRESS;
										}else{
											$scope.applicantData.HOME_ADDRESS = tempData.HOME_PROVINCE +tempData.HOME_CITY+tempData.HOME_COUNTY+tempData.HOME_ADDRESS;
										}
										
										$scope.applicantData.HOME_ZIP_CODE = tempData.HOME_ZIP_CODE;
										$scope.applicantData.SUB_HOME_ADDRESS = $scope.applicantData.HOME_ADDRESS;
										$scope.applicantData.OCCUPATION_CODE = tempData.OCCUPATION_CODE;
										$scope.applicantData.OCCUPATION = tempData.OCCUPATION_CODE_NAME;
										$scope.applicantData.PLURALITY_OCCUPATION_CODE_NAME = tempData.PLURALITY_OCCUPATION_CODE_NAME;
										//$scope.mobileVal = tempData.MOBILE;							
									});
								});
						});
						var fromUnfinishBbr = {
							"databaseName": Variables.dataBaseName,
							"tableName": "T_CUSTOMER",
							"conditions": {"CUSTOMER_ID": recognizeeID,"IS_BENEFIT":"1","APPLY_ID":formID}
						};
						queryTableDataByConditions(fromUnfinishBbr, function (data) {

							$scope.$apply(function(){
								var tempData = data[0];
								replaceNull(tempData);
								$scope.recognizeeData = tempData;
								$scope.recognizeeData.NAME = tempData.NAME;
								$scope.recognizeeData.SEX = tempData.SEX;
								$scope.recognizeeData.BIRTHDAY = tempData.BIRTHDAY;
								$scope.recognizeeData.RELATION = tempData.RELATION;
								$scope.recognizeeData.OCCUPATION_CODE = tempData.OCCUPATION_CODE;
								$scope.recognizeeData.OCCUPATION = tempData.OCCUPATION;
							});
							var query1002_sql = {
								"databaseName": 'promodel/10002/www/db/esales.sqlite',
								"tableName": "T_CUSTOMER",
								"conditions": {"ID":data[0].CUSTOMER_ID }
							};
							queryTableDataByConditions(query1002_sql, function (data2) {
								$scope.$apply(function(){
									var tempData = data2[0];
									replaceNull(tempData);
									// 被保人告知中带入身高体重 --add by wangzj
									window.localStorage.setItem("recognizeeHeight", tempData.HEIGHT);
									window.localStorage.setItem("recognizeeWeight", tempData.WEIGHT);	
									window.localStorage.setItem("recognizeePhone", tempData.COMPANY_PHONE);
									window.localStorage.setItem("recognizeeMobile", tempData.MOBILE);

				                  	// 日期时间戳和日期转换  add by renxiaomin 2016.11.23
				                    if((typeof tempData.ID_END_DATE == 'string') && tempData.ID_END_DATE != '长期有效'){
				                        $scope.validity=tempData.ID_END_DATE;
				                        var R=new Date();
				                        var newY=R.getFullYear();
				                        var oldY=Number($scope.validity.substr(0,4));
                                        if((oldY-newY)>=90 || oldY==9999){
				                          tempData.ID_END_DATE='长期有效';
				                       }else{
				                          tempData.ID_END_DATE=$scope.validity;
				                       }     
				                      }

									$scope.recognizeeData.BIRTHDAY = tempData.BIRTHDAY;
									$scope.recognizeeData.IDNAME = tempData.IDTYPE;
									$scope.recognizeeData.IDNO = tempData.IDNO;
									$scope.recognizeeData.ID_END_DATE = tempData.ID_END_DATE;
									$scope.recognizeeData.NATIVE_PLACE = tempData.NATIVE_PLACE;
									//$scope.recognizeeData.RGT_ADDRESS = tempData.HOME_PROVINCE +tempData.HOME_CITY+tempData.HOME_COUNTY+tempData.HOUSEHOLD_ADRESS;
									$scope.recognizeeData.RGT_ADDRESS = tempData.RGT_PROVINCE + tempData.RGT_CITY;//+tempData.HOUSEHOLD_COUNTY;
									$scope.recognizeeData.MARRIY = tempData.MARRI_STATUS;
									$scope.recognizeeData.INCOME = tempData.INCOME;
									$scope.recognizeeData.INCOME_WAY = tempData.INCOME_WAY;
									$scope.recognizeeData.WORK_UNIT = tempData.WORK_UNIT;
									$scope.recognizeeData.PHONE = tempData.COMPANY_PHONE;
									$scope.recognizeeData.MOBILE = tempData.MOBILE;
									$scope.recognizeeData.EMAIL = tempData.EMAIL;
									//针对山西机构把4，5级地址放到address									
								    if(organCode.substr(0,4) == '8614'){
									    var COMPANY_ADDRESS = tempData.COMPANY_ADDRESS;
									    var s_COMPANY_ADDRESS='';
									    var lastStr = COMPANY_ADDRESS.split('@%@');
									        for(i=0;i<lastStr.length;i++){
									          s_COMPANY_ADDRESS+=lastStr[i];
									        }
									        tempData.COMPANY_ADDRESS=s_COMPANY_ADDRESS; // 单位地址
									    var HOME_ADDRESS = tempData.HOME_ADDRESS;
									    var s_HOME_ADDRESS = '';
									    var lastStr = HOME_ADDRESS.split('@%@');
									        for(i=0; i< lastStr.length;i++){
									          s_HOME_ADDRESS += lastStr[i];
									        }
									        tempData.HOME_ADDRESS=s_HOME_ADDRESS;  // 家庭住址
								    }
									if(tempData.COMPANY_PROVINCE=="北京"||tempData.COMPANY_PROVINCE=="上海"||tempData.COMPANY_PROVINCE=="天津"||tempData.COMPANY_PROVINCE=="重庆"){
										$scope.recognizeeData.MAILING_ADDRESS = tempData.COMPANY_CITY+tempData.COMPANY_COUNTY+tempData.COMPANY_ADDRESS;
									}else{
										$scope.recognizeeData.MAILING_ADDRESS = tempData.COMPANY_PROVINCE +tempData.COMPANY_CITY+tempData.COMPANY_COUNTY+tempData.COMPANY_ADDRESS;
									}
									$scope.recognizeeData.MAILING_ZIP_CODE = tempData.COMPANY_ZIP_CODE;
									if(tempData.HOME_PROVINCE=="北京"||tempData.HOME_PROVINCE=="上海"||tempData.HOME_PROVINCE=="天津"||tempData.HOME_PROVINCE=="重庆"){
										$scope.recognizeeData.HOME_ADDRESS = tempData.HOME_CITY+tempData.HOME_COUNTY+tempData.HOME_ADDRESS;
									}else{
										$scope.recognizeeData.HOME_ADDRESS = tempData.HOME_PROVINCE +tempData.HOME_CITY+tempData.HOME_COUNTY+tempData.HOME_ADDRESS;
									}
									  
									$scope.recognizeeData.HOME_ZIP_CODE = tempData.HOME_ZIP_CODE;
									$scope.recognizeeData.OCCUPATION_CODE = tempData.OCCUPATION_CODE;
									$scope.recognizeeData.OCCUPATION = tempData.OCCUPATION_CODE_NAME;
									$scope.recognizeeData.PLURALITY_OCCUPATION_CODE_NAME = tempData.PLURALITY_OCCUPATION_CODE_NAME;
								});
							});						
						});
						var fromUnfinishSyr = {
							"databaseName": "promodel/10005/www/db/insurance_online.sqlite",
							"tableName": "T_CUSTOMER",
							"conditions": {'APPLY_ID': formID,'IS_BENEFIT':2}
						};  
						queryTableDataByConditions(fromUnfinishSyr, function (syrData) { 
							//去除受益人系被保人关系列表的‘本人’选项
							if(benefitRelationList.length == 0){
								for(var i = 0 ; i < relationList.length ; i++){
									var relationName = relationList[i].CODE_NAME;
									if(relationName == "本人"){
										continue;
									}
									benefitRelationList.push(relationList[i]);
								}
							}
							
							var oneList =[];
							var twoList =[];

							if(syrData  && syrData.length > 0){
								for(var k = 0;k<syrData.length; k++){
									var omap = {};
									var type = syrData[k]["BENEFIT_TYPE"];
									syrData[k]["OCCUPATION_CODE_NAME"]=syrData[k]["OCCUPATION"];//修改受益人职业名称第二次进来不显示  add dongchangren 2017.3.29
									omap = syrData[k];
									omap["relationList"] = benefitRelationList;
									if(relationList != null){
										for(var j = 0; j<relationList.length; j++){
											 if(relationList[j]["CODE"] == syrData[k]["RELATION"]){
										 		omap["RELATION"] = relationList[j];
											 }
										}
									}
									var benefitRate = parseFloat(omap["BENEFIT_RATE"]);
									if(!isNaN(benefitRate)){
										omap["BENEFIT_RATE"] = benefitRate;
									}
									if(type == '0'){
										oneList.push(omap);
									}else if(type == '1'){
										twoList.push(omap);
									}
								}
							}
							$scope.benefitOneData = oneList;
							$scope.benefitTwoData = twoList;
						});
					//},500);
					var tbsxJson = {
							"databaseName": Variables.dataBaseName,
							"tableName": "T_APPLY",
							"conditions": {"ID": formID}
						};
					queryTableDataByConditions(tbsxJson, function (data) {
						//alert(data[0].PROSAL_JSON);
						var prosalJson = eval('('+data[0].PROSAL_JSON+')');
						//$scope.applicantItem = prosalJson;

						$scope.$apply(function (){
							//获取投保事项部分数据
							$scope.productsTitle = prosalJson.CONTENT.insureProductsMap.tableTitleList;
							$scope.productsData = prosalJson.CONTENT.insureProductsMap.tableDataList;
							if(isreleated == '03' || isreleated == 'Y'){
								for(var c = 0; c < $scope.productsData.length; c++){
									if($scope.productsData[c][0] == '114403'){
										$scope.productsData.splice(c,1);
									}
								}
							}else if(isreleated == '05'){
								for(var x = 0; x < $scope.productsData.length; x++){
									if($scope.productsData[x][0] == '114403'){
										$scope.productsData.splice(0,x);
										$scope.productsData.splice(1,$scope.productsData.length-1);
									}
								}
							}
							var currentProductsData = $scope.productsData;
							//总保费
							var totalPremium = 0;//年期总保费
							var alltotalPremium = 0;//累计总保费--add by wangzj 20160813
							var permium = 0;
							for(var i = 0 ; i < currentProductsData.length ; i++){
								var tempProduct = currentProductsData[i];
								//alert("i:"+i+"==;tempProduct:"+JSON.stringify(tempProduct));
								var insurYearsData = (tempProduct[5]=="12") ? "年交" : "一次交清";
								var premium = tempProduct[3].replace("元","");//保费
								var addJob = tempProduct[4].replace("元","");//职业加费
								//反洗钱校验，获得累积总保费 --add by wangzj
								var insurYears = tempProduct[6].replace("年","");
								if(tempProduct[5]=="12"){
									if(!isNaN(premium) && !isNaN(insurYears)){
										alltotalPremium = alltotalPremium + parseFloat(premium)*parseFloat(insurYears)+parseFloat(addJob);
									}
								}else{
									if(!isNaN(premium)){
										alltotalPremium = alltotalPremium + parseFloat(premium)+parseFloat(addJob);
									}
								}

								tempProduct[5] = tempProduct[6];
								tempProduct[6] = insurYearsData;
								
								//保费
								if(!isNaN(premium)){
									totalPremium = totalPremium + parseFloat(premium);
								}
							}
							var tempData = data[0];
							$scope.applyObj = tempData;
							var isNotice = (tempData.IS_NOTICE==true || tempData.IS_NOTICE=="true") ? true : false;
							var isPayFor = (tempData.IS_PAY_FOR==true || tempData.IS_PAY_FOR=="true") ? true : false;
							var isInsure = (tempData.IS_INSURE==true || tempData.IS_INSURE=="true") ? true : false;
							var isInsurePaper = (tempData.IS_INSURE_PAPER==true || tempData.IS_INSURE_PAPER=="true") ? true : false;
							
							$scope.applyObj.IS_NOTICE = isNotice;
							$scope.applyObj.IS_PAY_FOR = isPayFor;
							$scope.applyObj.IS_INSURE = isInsure;
							$scope.applyObj.IS_INSURE_PAPER = isInsurePaper;
							$scope.applyObj.VALID_PHONE = tempData.VALID_PHONE;
							$scope.totalPremium = totalPremium;
							$scope.alltotalPremium = alltotalPremium;
							//alert("从数据库加载已录入的信息")
						});
					}); 
					
					//查询用户信息
					getUserInfo(function (data) {
					//alert("userInfo:"+JSON.stringify(data));
						var agentName = data["AGENT_NAME"];
						$scope.agentInfo = data;
					},function (data) {
						//alert('失败');
					});
					//根据险种ID判断是否需要显示‘投保人告知’选项卡
					isShowAppntImpart(formID);
					//若为关联后生成的万能险保单，不做校验直接跳到保单预览
					if(isreleated == '05'){
						$scope.step3  = {activeTab : 3};
						$ionicSlideBoxDelegate.next();
						$scope.NextStep('2');
					}					
				}else if(1 == slideIndex){
						// 控制主险是111805的一些交费规则
						if($scope.step2.activeTab == 3){
							if(mianIsureId=="111805" || mianIsureId == "111702"){
								$scope.applyObj.IS_NOTICE =true; //缴费提示默认是							
								$scope.applyObj.IS_ANEW_INSURES = true;//重新投保默认是
								//alert("slideIndex:"+$scope.applyObj.IS_ANEW_INSURES)
								$scope.applyObj.IS_PAY_FOR=false;//是否自动垫交默认为否
								if(pcType=='phone'){
									document.getElementById('phone_payNotice').disabled = true;//缴费提示不可修改
									document.getElementById("phone_autoPay").disabled=true;//自动交付不可修改
								}else{
									document.getElementById('Pc_payNotice').disabled = true;
									document.getElementById("Pc_autoPay").disabled=true;
								}
							}
						}												
						
						var fromUnfinishTbr = {
							"databaseName": Variables.dataBaseName,
							"tableName": "T_CUSTOMER",
							"conditions": {"CUSTOMER_ID": applicantID,"IS_BENEFIT":"0","APPLY_ID":formID}
						};
						queryTableDataByConditions(fromUnfinishTbr, function (data) {
							var tempData = data[0];
							var query1002_sql = {
								"databaseName": 'promodel/10002/www/db/esales.sqlite',
								"tableName": "T_CUSTOMER",
								"conditions": {"ID":data[0].CUSTOMER_ID }
							};
							queryTableDataByConditions(query1002_sql, function (data2) {
								$scope.$apply(function(){
									var tempData = data2[0];
									replaceNull(tempData);
									// 投保人告知中带入身高体重 --add by wangzj
									window.localStorage.setItem("applicantHeight", tempData.HEIGHT);
									window.localStorage.setItem("applicantWeight", tempData.WEIGHT);
									window.localStorage.setItem("applicantPhone", tempData.COMPANY_PHONE);
									window.localStorage.setItem("applicantMobile", tempData.MOBILE);							
								});
							});
						});
						var fromUnfinishBbr = {
							"databaseName": Variables.dataBaseName,
							"tableName": "T_CUSTOMER",
							"conditions": {"CUSTOMER_ID": recognizeeID,"IS_BENEFIT":"1","APPLY_ID":formID}
						};
						queryTableDataByConditions(fromUnfinishBbr, function (data) {
							var query1002_sql = {
								"databaseName": 'promodel/10002/www/db/esales.sqlite',
								"tableName": "T_CUSTOMER",
								"conditions": {"ID":data[0].CUSTOMER_ID }
							};
							queryTableDataByConditions(query1002_sql, function (data2) {
								$scope.$apply(function(){
									var tempData = data2[0];
									replaceNull(tempData);
									// 被保人告知中带入身高体重 --add by wangzj
									window.localStorage.setItem("recognizeeHeight", tempData.HEIGHT);
									window.localStorage.setItem("recognizeeWeight", tempData.WEIGHT);	
									window.localStorage.setItem("recognizeePhone", tempData.COMPANY_PHONE);
									window.localStorage.setItem("recognizeeMobile", tempData.MOBILE);
								});
							});						
						});
					//信息录入模块验证整个表单数据，若验证不通过则不跳转下一步，(insuranceValidate.js)
					if(isreleated!='05'){//若为关联后生成的万能险保单，不做校验直接跳到保单预览
						var validateResult = validateTabChangeOfNextStep($scope); 
						if(!validateResult){
							return;
						}
					}
					//alert("验证通过");  

					//‘信息录入’验证通过后设置下一个步骤的标题
					if(pcType == 'phone'){  
						setPageIndexLogoCss("index_three");
					} 
					/*****保存投保事项的数据****/
					//var num = document.getElementById('phone-num').value;
					//console.log('number2'+$scope.bankCardNumber+':'+$scope.phoneForElectronic);
					/*****保存投保事项的数据 end*****/
					
					//查询保单数据
					/*
					 	var queryApply = {
							"databaseName": Variables.dataBaseName,
							"tableName": "T_APPLY",
							"conditions": {"APPLY_ID": formID}
						};
						queryTableDataByConditions(queryApply, function (data) {
							if(data){
								$scope.applyDataInfo = data[0];
							}
						}); */


					//查询影像录入数据
					var fromBf_Sql = {
						"databaseName": Variables.dataBaseName,
						"tableName": "T_CUSTOMER",
						"conditions": {"APPLY_ID": formID}
					};
					queryTableDataByConditions(fromBf_Sql, function (data) {
						if(data){
							$scope.$apply(function(){
								var benefitArray = new Array();
								for(var i = 0 ; i < data.length ; i++){
									var tempData = data[i];
									if(tempData["IS_BENEFIT"] == "0"){
										$scope.applicantInfo = tempData;
									}else if(tempData["IS_BENEFIT"] == "1"){
										$scope.insurantInfo = tempData;
									}else if(tempData["IS_BENEFIT"] == "2"){
										//CARD_FRONT" : "","CARD_REVERSE"
										tempData["CARD_FRONT"] = tempData["CARD_FRONT"] == null ? "" : tempData["CARD_FRONT"];
										tempData["CARD_REVERSE"] = tempData["CARD_REVERSE"] == null ? "" : tempData["CARD_REVERSE"];
										benefitArray.push(tempData);
									}
								}
								$scope.BfList = benefitArray;
							});
						}
					}); 			
				}else if(2 == slideIndex){//下一步操作是保单预览
					if(isSiagn==1){
						document.getElementById('dzSign').checked=true;
						document.getElementById('zzSign').checked=false;
					}else{
						document.getElementById('zzSign').checked=true;
						document.getElementById('dzSign').checked=false;
					}
					
					//验证并保存影像录入中证件照片
					var validateResult = validateCardImage($scope);
					//  if(!validateResult){
					//  	return;
					//  } 
					//‘影像录入’验证通过后设置下一个步骤的标题
					if(pcType == 'phone'){
						setPageIndexLogoCss("index_four");
					}
					//查询保单基本信息(保单预览中的信息)
					unFinshedInsurance.loadUnFinshedInsurance({
						searchVal:'',
						ID:formID,
						callBackFun:function (data){							
							if(data && data[0]){
								$scope.$apply(function (){
									$scope.applyInfo = data[0];
								
									//查询投保人基本信息
									unFinshedInsurance.queryCustomerById({
										applyID:formID,
										applicantID:$scope.applyInfo.APPLICANT_ID,
										recognizeeID:'',
										callBackFun:function (applicantArray){
											$scope.applicant = {};
											if(applicantArray && applicantArray[0]){
												$scope.$apply(function(){
													var applicant = applicantArray[0];
													replaceNull(applicant);
													$scope.applicant = applicant;
													$scope.applicant.NAME = applicant.NAME;
													$scope.applicant.SEX = applicant.SEX;
													$scope.applicant.BIRTHDAY = applicant.BIRTHDAY;
													$scope.applicant.RELATION = applicant.RELATION;
													$scope.applicant.OCCUPATION_CODE = applicant.OCCUPATION_CODE;
													$scope.applicant.OCCUPATION = applicant.OCCUPATION;
													if(isreleated == "05"){
														$scope.applicantInfo = applicant;
													}
												});
											}
											if(applicantArray && applicantArray[1]){
												$scope.$apply(function(){
													var applicant1002 = applicantArray[1];
													replaceNull(applicant1002);
												//	$scope.applicantData.BIRTHDAY = applicant1002.BIRTHDAY; 

						                        // 日期时间戳和日期转换  add by renxiaomin 2016.11.23
						                          if((typeof applicant1002.ID_END_DATE == 'string') && applicant1002.ID_END_DATE != '长期有效'){
						                              $scope.validity=applicant1002.ID_END_DATE;
						                              var R=new Date();
						                              var newY=R.getFullYear();
						                              var oldY=Number($scope.validity.substr(0,4));
                                                      if((oldY-newY)>=90 || oldY==9999){
						                                applicant1002.ID_END_DATE='长期有效';
						                             }else{
						                                applicant1002.ID_END_DATE=$scope.validity;
						                             }     
						                            }

													$scope.applicant.IDNAME = applicant1002.IDTYPE;
													$scope.applicant.IDNO = applicant1002.IDNO;
													$scope.applicant.ID_END_DATE = applicant1002.ID_END_DATE;
													$scope.applicant.NATIVE_PLACE = applicant1002.NATIVE_PLACE;
													//$scope.applicant.RGT_ADDRESS = applicant1002.RGT_PROVINCE;
													$scope.applicant.RGT_ADDRESS = applicant1002.RGT_PROVINCE + applicant1002.RGT_CITY;//+applicant1002.HOUSEHOLD_COUNTY;
													$scope.applicant.MARRIY = applicant1002.MARRI_STATUS;
													$scope.applicant.INCOME = applicant1002.INCOME;
													$scope.applicant.INCOME_WAY = applicant1002.INCOME_WAY;
													$scope.applicant.WORK_UNIT = applicant1002.WORK_UNIT;
													$scope.applicant.OTHER_INCOME_WAY = applicant1002.OTHER_INCOME_WAY;
													$scope.applicant.PHONE = applicant1002.MOBILE;
													$scope.applicant.COMPANY_PHONE = applicant1002.COMPANY_PHONE;
													$scope.applicant.EMAIL = applicant1002.EMAIL;
													//针对山西机构把4，5级地址放到address									
												    if(organCode.substr(0,4) == '8614'){
													    var COMPANY_ADDRESS = applicant1002.COMPANY_ADDRESS;
													    var s_COMPANY_ADDRESS='';
													    var lastStr = COMPANY_ADDRESS.split('@%@');
													        for(i=0;i<lastStr.length;i++){
													          s_COMPANY_ADDRESS+=lastStr[i];
													        }
													        applicant1002.COMPANY_ADDRESS=s_COMPANY_ADDRESS; // 单位地址
													    var HOME_ADDRESS = applicant1002.HOME_ADDRESS;
													    var s_HOME_ADDRESS = '';
													    var lastStr = HOME_ADDRESS.split('@%@');
													        for(i=0; i< lastStr.length;i++){
													          s_HOME_ADDRESS += lastStr[i];
													        }
													        applicant1002.HOME_ADDRESS=s_HOME_ADDRESS;  // 家庭住址
												    }
													if(applicant1002.COMPANY_PROVINCE=="北京" ||applicant1002.COMPANY_PROVINCE=="上海"||applicant1002.COMPANY_PROVINCE=="天津"||applicant1002.COMPANY_PROVINCE=="重庆"){
														$scope.applicant.MAILING_ADDRESS = applicant1002.COMPANY_CITY+applicant1002.COMPANY_COUNTY+applicant1002.COMPANY_ADDRESS;
													}else{
														$scope.applicant.MAILING_ADDRESS = applicant1002.COMPANY_PROVINCE +applicant1002.COMPANY_CITY+applicant1002.COMPANY_COUNTY+applicant1002.COMPANY_ADDRESS;
													}
													$scope.applicant.MAILING_ZIP_CODE = applicant1002.COMPANY_ZIP_CODE
													if(applicant1002.HOME_PROVINCE=="北京" ||applicant1002.HOME_PROVINCE=="上海"||applicant1002.HOME_PROVINCE=="天津"||applicant1002.HOME_PROVINCE=="重庆"){
														$scope.applicant.HOME_ADDRESS = applicant1002.HOME_CITY+applicant1002.HOME_COUNTY+applicant1002.HOME_ADDRESS;
													}else{
														$scope.applicant.HOME_ADDRESS = applicant1002.HOME_PROVINCE +applicant1002.HOME_CITY+applicant1002.HOME_COUNTY+applicant1002.HOME_ADDRESS;
													}
													$scope.applicant.HOME_ZIP_CODE = applicant1002.HOME_ZIP_CODE;
													$scope.applicant.PLURALITY_OCCUPATION_CODE_NAME = applicant1002.PLURALITY_OCCUPATION_CODE_NAME;
												});
											}
										}
									});
									//被保人信息
									unFinshedInsurance.queryCustomerById({
										applyID:formID,
										applicantID:'',
										recognizeeID:$scope.applyInfo.INSURANT_ID,
										callBackFun:function (recognizeeArray){
											$scope.recognizee = {};
											if(recognizeeArray && recognizeeArray[0]){
												$scope.$apply(function (){
													var recognizee = recognizeeArray[0];
													replaceNull(recognizee);
													$scope.recognizee = recognizee;
													$scope.recognizee.NAME = recognizee.NAME;
													$scope.recognizee.SEX = recognizee.SEX;
													$scope.recognizee.BIRTHDAY = recognizee.BIRTHDAY;
													$scope.recognizee.RELATION = recognizee.RELATION;
													$scope.recognizee.OCCUPATION_CODE = recognizee.OCCUPATION_CODE;
													$scope.recognizee.OCCUPATION = recognizee.OCCUPATION;
												});
											}
											if(recognizeeArray && recognizeeArray[1]){
												$scope.$apply(function(){
													var recognizee1002 = recognizeeArray[1];
													replaceNull(recognizee1002);
												//	$scope.recognizeeData.BIRTHDAY = recognizee1002.BIRTHDAY;

					                        // 日期时间戳和日期转换  add by renxiaomin 2016.11.23
					                          if((typeof recognizee1002.ID_END_DATE == 'string') && recognizee1002.ID_END_DATE != '长期有效'){
					                              $scope.validity=recognizee1002.ID_END_DATE;
					                              var R=new Date();
					                              var newY=R.getFullYear();
					                              var oldY=Number($scope.validity.substr(0,4));
                                                  if((oldY-newY)>=90 || oldY==9999){
					                                recognizee1002.ID_END_DATE='长期有效';
					                             }else{
					                                recognizee1002.ID_END_DATE=$scope.validity;
					                             }     
					                            }
													$scope.recognizee.IDNAME = recognizee1002.IDTYPE;
													$scope.recognizee.IDNO = recognizee1002.IDNO;
													$scope.recognizee.ID_END_DATE = recognizee1002.ID_END_DATE;
													$scope.recognizee.NATIVE_PLACE = recognizee1002.NATIVE_PLACE;
													$scope.recognizee.RGT_ADDRESS = recognizee1002.RGT_PROVINCE + recognizee1002.RGT_CITY;//+recognizee1002.HOUSEHOLD_COUNTY;
													$scope.recognizee.MARRIY = recognizee1002.MARRI_STATUS;
													$scope.recognizee.INCOME = recognizee1002.INCOME;
													$scope.recognizee.INCOME_WAY = recognizee1002.INCOME_WAY;
													$scope.recognizee.WORK_UNIT = recognizee1002.WORK_UNIT;
													$scope.recognizee.OTHER_INCOME_WAY = recognizee1002.OTHER_INCOME_WAY;
													$scope.recognizee.PHONE = recognizee1002.MOBILE;
													$scope.recognizee.COMPANY_PHONE = recognizee1002.COMPANY_PHONE;
													$scope.recognizee.EMAIL = recognizee1002.EMAIL;													
													$scope.recognizee.MAILING_ADDRESS = recognizee1002.COMPANY_PROVINCE +recognizee1002.COMPANY_CITY+recognizee1002.COMPANY_COUNTY+recognizee1002.COMPANY_ADDRESS;
													$scope.recognizee.MAILING_ZIP_CODE = recognizee1002.COMPANY_ZIP_CODE;
													//针对山西机构把4，5级地址放到address									
												    if(organCode.substr(0,4) == '8614'){												    	
													    var HOME_ADDRESS = recognizee1002.HOME_ADDRESS;
													    var s_HOME_ADDRESS = '';
													    var lastStr = HOME_ADDRESS.split('@%@');
													        for(i=0; i< lastStr.length;i++){
													          s_HOME_ADDRESS += lastStr[i];
													        }
													        recognizee1002.HOME_ADDRESS=s_HOME_ADDRESS;  // 家庭住址
												    }												    
													if(recognizee1002.HOME_PROVINCE=="北京"||recognizee1002.HOME_PROVINCE=="上海"||recognizee1002.HOME_PROVINCE=="天津"||recognizee1002.HOME_PROVINCE=="重庆"){
														$scope.recognizee.HOME_ADDRESS =recognizee1002.HOME_CITY+recognizee1002.HOME_COUNTY+recognizee1002.HOME_ADDRESS;
													}else{
														$scope.recognizee.HOME_ADDRESS = recognizee1002.HOME_PROVINCE +recognizee1002.HOME_CITY+recognizee1002.HOME_COUNTY+recognizee1002.HOME_ADDRESS;
													}
													
													$scope.recognizee.HOME_ZIP_CODE = recognizee1002.HOME_ZIP_CODE;
													$scope.recognizee.PLURALITY_OCCUPATION_CODE_NAME = recognizee1002.PLURALITY_OCCUPATION_CODE_NAME;
												});
											}
										}
									});
									//受益人
									unFinshedInsurance.queryCustomer({
										applyID:formID,
										benefit:'2',//查收益人
										callBackFun:function (obj){
											$scope.$apply(function (){
												$scope.benefitList = obj;
											});
										}
									});
									//投保事项
									/*unFinshedInsurance.loadProductByID({
										proposalID:$scope.applyInfo.PROPOSAL_ID,
										callBackFun:function (obj){
											$scope.$apply(function (){
												$scope.productList = obj;
											});
										}
									});*/
									//查询保单中险种数据(在线投保保单预览)
									unFinshedInsurance.loadCustomer({
										applyID:formID,
										applicantID:applicantID,
										callBackFun:function (data){
											var prosalJson = eval('('+data[0].PROSAL_JSON+')');
											var productsData = prosalJson.CONTENT.insureProductsMap.tableDataList;
											//投保事项中展示的险种数据
											var productArray = [];
											//首期保险费合计
											var firstPremiumTotal = 0;
											//交费方式
											var payMode = "";
											if(isreleated == 'Y' || isreleated == '03'){ 
												for(var c = 0; c < productsData.length; c++){
													if(productsData[c][0]== '114403'){
														productsData.splice(c,1);
													}
												}
											}else if(isreleated == '05'){
												for(var x = 0; x < productsData.length; x++){
													if(productsData[x][0]== '114403'){
														productsData.splice(0,x);
														productsData.splice(1,productsData.length-1);
													}
												}
											}	
											if(productsData){
												for(var i = 0 ; i < productsData.length ; i++){
													var productInfo = productsData[i];
													var subJsonInfo = {};
													subJsonInfo["PRODUCT_NAME"] = productInfo[1];//投保险种
													subJsonInfo["AMOUNT"] = productInfo[2].replace("元","");//保险金额（元）
													subJsonInfo["INSU_YEARS"] = productInfo[7];//保险期间
													// if(subJsonInfo["PRODUCT_NAME"] == "民生金生无忧年金保险（万能型）"){
													// 	productInfo[6] = '';
													// }
													subJsonInfo["PAY_END_YEAR"] = productInfo[6];//交费年期
													subJsonInfo["PREM"] = productInfo[3].replace("元","");//标准保险费（元）
													subJsonInfo["JOB_ADD_FEE"] = productInfo[4].replace("元","");//职业加费（元）
													productArray[i] = subJsonInfo;
													//首期保险费合计=保费+职业加费
													firstPremiumTotal = numAdd(firstPremiumTotal,numAdd(subJsonInfo["PREM"],subJsonInfo["JOB_ADD_FEE"]));
													if(i == 0){
														payMode = productInfo[5];
													}
												}                                                                 
											}
											$scope.productArray = productArray;
											$scope.firstPremiumTotal = firstPremiumTotal;//首期保险费合计
											$scope.payMode = payMode;//交费方式
											//拼接产品名称 by gudandie
											var productNames = "";
											for(var i=0;i<productArray.length;i++){
                                                productNames +=productArray[i].PRODUCT_NAME+",";
											}
                                            $scope.productNames = productNames.substr(0,productNames.length-1);

										}
									});
									//投保事项(续)
									unFinshedInsurance.loadPayInfo({
										applyID:formID,
										applicantID:applicantID,
										proposalID:$scope.applyInfo.PROPOSAL_ID,
										callBackFun:function (obj){
											if(obj){												
												$scope.applyPayData = {};
												if(obj[0]){
													$scope.$apply(function (){
														var payInfo1 = obj[0];												
														$scope.applyPayData = payInfo1;
														$scope.applyPayData.IS_NOTICE = eval(payInfo1.IS_NOTICE);
														$scope.applyPayData.IS_PAY_FOR = eval(payInfo1.IS_PAY_FOR);
														$scope.applyPayData.IS_INSURE = eval(payInfo1.IS_INSURE);
														$scope.applyPayData.IS_INSURE_PAPER = eval(payInfo1.IS_INSURE_PAPER);
													});
												}
												if(obj[1]){
													$scope.$apply(function (){
														var payInfo2 = obj[1];
														//$scope.isJLWJ = false;														
														$scope.applyPayData.BANK_CODE = payInfo2.bankCode;		
														$scope.applyPayData.APPLICANT_NAME = payInfo2.appliantName;
														$scope.applyPayData.BANK_NO = payInfo2.cardNum;
														//if(payInfo2.bankCode == '1703'){
															//$scope.isJLWJ = true;
															$scope.applyPayData.bankprovince = payInfo2.BANK_PROVINCE;
															$scope.applyPayData.bankcity = payInfo2.BANK_CITY;
														//}
														if(payInfo2.bankSubType == '1'){
															$scope.applyPayData.bankSubType = "存折";
														}else{
															$scope.applyPayData.bankSubType = "银行卡";
														}
														
														$scope.applyPayData.bankPhoneNum = payInfo2.bankPhoneNum;
													});
												}
											}
										}
									});
									/********带是否有医疗保险的险种保单预览展示*********/
									var bonus_json = {
								        "databaseName":"promodel/10003/www/db/esales.sqlite",
								        "tableName": "T_PROPOSAL_PRODUCT",
								        "conditions":{"PROPOSAL_ID":$scope.applyInfo.PROPOSAL_ID}
										}
									queryTableDataByConditions(bonus_json,function(data){
										if(data){
											$scope.$apply(function (){
												$scope.applyBonusData = {};
												for(var bon = 0; bon < data.length; bon++){
													if(data[bon].BONUS_GET_MODE){												
														if(data[bon].BONUS_GET_MODE == 'N' || data[bon].BONUS_GET_MODE == 'Y'){						
															$scope.BONUS = true;
															if(data[bon].BONUS_GET_MODE == 'N'){															
																$scope.applyBonusData.BONUS_GET_MODE = false;																										
															}else if(data[bon].BONUS_GET_MODE == 'Y'){															
																$scope.applyBonusData.BONUS_GET_MODE = true;															
															}
														}else{
															$scope.bonusGetWay=data[bon].BONUS_GET_MODE;//红利领取方式	
															if(isreleated == 'Y' || isreleated == '03'){
																if(mianIsureId=='112406' || mianIsureId =='112407'){
																	$scope.bonusGetWay = '2';
																}
															}else if(isreleated == '05'){
																if(mianIsureId == '114403'){
																	$scope.bonusGetWay = '';
																}
															}
														}																							
													}
													if(data[bon].GETYEAR){
														$scope.GETYEAR= data[bon].GETYEAR; //开始领取年龄											
													}
													if(data[bon].GETCOMPUTEMODE){
														$scope.GETCOMPUTEMODE= data[bon].GETCOMPUTEMODE; //开始领取计算方式										
													}
													if(data[bon].GETDUTYKIND){
														$scope.getDutyKind= data[bon].GETDUTYKIND; //年金领取方式											
													}
													
												}
											})																						
										}
									})
									/*********end********/
									//健康告知
									$scope.previewImpartContent();
								});
							}
						}
					});
				}
				
				if(slideIndex == 3){
					var applicantAge = getAgeByBirthday($scope.applicantData.BIRTHDAY);//投保人年龄
					$scope.user_name = storage.getItem('agentName');//业务员姓名
					$scope.user_code = storage.getItem('agentCode');//工号
					$scope.applicantPerson = $scope.applicant.NAME;//投保人姓名
					$scope.recognizeePerson =  $scope.recognizee.NAME;//被保人姓名
					if($scope.applicantPerson == $scope.recognizeePerson){
						$scope.isSamePer = true;
					}
					var insYears = false;
					for(var x = 0; x < $scope.productArray.length; x++){
						if($scope.productArray[x].INSU_YEARS!= '1年'){
							insYears = true;
						}
					}
					
					$scope.PaperCopyOne = false;
					$scope.PaperCopyTwo = false;
					$scope.NotnewProduct = false;
					$scope.newProduct = false;
					$scope.SignMark = false;
					$scope.PaperMark = false;
					$scope.Hesitation = '10';
					
					if(pcType == 'phone'){
						setPageIndexLogoCss("index_five");
					}
					//alert("isSiagn:"+isSiagn);
					if(isSiagn == 1){ //电子签名跳转
						myAlert("您本次投保选择的为电子签名，请您根据系统提示在电子单据上签名后进行投保单提交。");
					    $scope.SignMark = true;
					    isPassSign = false;
					    pageSignCtrlTime = 900;
                        if(pcType == 'phone'){
                            document.getElementById("step8_title").innerHTML = "短信验证";
                        }
					    $scope.step8  = {activeTab : 1};
					    if(allIsuresArray.length>0){
							for(var j=0;j<allIsuresArray.length;j++){ 
								if(applicantAge >= 60 && insYears == true && allIsuresArray[j][0]=='114402'){
									//万能险模板 
									$scope.copyFlag = true;
									$scope.newProduct = true;
									$scope.Universal =true;
									break;
								}
								if(applicantAge >= 60 && insYears == true && (allIsuresArray[j][0]=='112228' || allIsuresArray[j][0]=='112227' || allIsuresArray[j][0]=='112226')){
									//分红行模板
									$scope.copyFlag = true;
									$scope.newProduct = true;
									$scope.Bonus =true;
									break;
								}
								if(applicantAge >= 60 && insYears == true && (allIsuresArray[j][0]!='112228' && allIsuresArray[j][0]!='112227' && allIsuresArray[j][0]!='112226')){
									//投保人大于60岁且不含分红、万能及投连险种  -->>非新型模板
									$scope.copyFlag = true;
									$scope.NotnewProduct = true;
									break;
								}
							}
						}
					    //alert("$scope.applicant.PHONE:"+$scope.applicant.PHONE);
					    document.getElementById("mobile").value = $scope.applicant.PHONE;
					 	$ionicSlideBoxDelegate.next();
					}else if(isSiagn == 2){
						//纸质签名跳转	
						$scope.PaperMark = true;					
						if(allIsuresArray.length>0){ 
							for(var j=0;j<allIsuresArray.length;j++){
								if(applicantAge >= 60 && insYears == true && allIsuresArray[j][0]=='114402'){
									//万能险模板 
									$scope.PaperMark = false;
									$scope.PaperCopyOne = true;
									$scope.Universal =true;
									break;
								}
								if(applicantAge >= 60 && insYears == true && (allIsuresArray[j][0]=='112228' || allIsuresArray[j][0]=='112227' || allIsuresArray[j][0]=='112226')){
									//分红行模板
									$scope.PaperMark = false;
									$scope.PaperCopyOne = true;
									$scope.Bonus =true;
									break;
								}
								if(applicantAge >= 60 && insYears == true && (allIsuresArray[j][0]!='112228' && allIsuresArray[j][0]!='112227' && allIsuresArray[j][0]!='112226')){
									//非新型模板
									$scope.PaperMark = false;
									$scope.PaperCopyTwo = true;
									break;
								}
							}
						}					
						$ionicSlideBoxDelegate.next(); 
					}else{
						myAlert('请选择签名方式')
						return false;
					}
				}else if(slideIndex == 4){
					if(allIsuresArray.length>0){ //抄录声明的险种显示 
						for(var j=0;j<allIsuresArray.length;j++){
							if(allIsuresArray[j].indexOf('112228') > -1 || allIsuresArray[j].indexOf('111301') > -1 || allIsuresArray[j].indexOf('112227') > -1 ||allIsuresArray[j].indexOf('112226') > -1 ||allIsuresArray[j].indexOf('112405') > -1 ||allIsuresArray[j].indexOf('124402') > -1 ||allIsuresArray[j].indexOf('124403') > -1 || allIsuresArray[j].indexOf('124404') > -1 || allIsuresArray[j].indexOf('114403') > -1 || allIsuresArray[j].indexOf('112406') > -1 || allIsuresArray[j].indexOf('112407') > -1|| allIsuresArray[j].indexOf('111406') > -1){
								$scope.copystatementState = true;
								$scope.copyState=false;
							}
						}
					}
					$scope.submitData = false;
					if(isSiagn == 2){
						$scope.PaperCopyOne = false;
						$scope.PaperCopyTwo = false;
						$scope.PaperMark = true;
					}else{
                        var activeTab = $scope.step8.activeTab;
                        var nextTab = activeTab + 1;
                        var validateResult = setStepTitle(activeTab);
                        if(!validateResult){
                            return;
                        }
                        if(nextTab <= 5){
                            $scope.step8.activeTab = nextTab;
                            if(nextTab=='5' && $scope.copyFlag==true && $scope.isTj==true){
                                $scope.submitData = true;
                            }else if($scope.copyFlag==false &&$scope.isTj==true && nextTab=='4'){
                                $scope.submitData = true;
                            }else if($scope.copyFlag==true &&$scope.isTj==false && nextTab=='4'){
                                $scope.submitData = true;
                            }else if($scope.copyFlag==false &&$scope.isTj==false && nextTab=='3'){
                                $scope.submitData = true;
                            }
                            return false;
                        }
					}
					// $scope.step8  = {activeTab : 3};
				}else{
					$ionicSlideBoxDelegate.next(); 
				}
			};
			$scope.PrevStep = function (slideIndex) {
				pageSignCtrlTime = 0;
				//document.getElementById("mobile").value ="";
	 			document.getElementById("smsCode").value ="";
	 			
				//如果在‘信息录入’模块，上一步按钮控制‘信息录入’中的tab页切换
				if(1 == slideIndex){
					var validateResult = validateTabChangeOfPrevStep($scope);
					if(!validateResult){
						return;
					}
				}
				//在‘影像录入’模块，上一步按钮控制‘影像录入’中的tab页切换
				if(2 == slideIndex){
					var validateResult = tabChangeOfCardImage($scope);
					if(!validateResult){
						return;
					}
				}
				//手机版，验证通过后
				if(pcType == 'phone'){
					if(slideIndex == 1){
						setPageIndexLogoCss("index_one");
					}else if(2 == slideIndex){
						setPageIndexLogoCss("index_two");
					}else if(3 == slideIndex){
						setPageIndexLogoCss("index_three");
					}else if(slideIndex == 4){
						setPageIndexLogoCss("index_four");
					}else{
						setPageIndexLogoCss("index_one");
					} 
				}
				$scope.submitData = false;
				$ionicSlideBoxDelegate.previous();
			};
		//});
        //设定保单提交titie
        function setStepTitle(activeTab) {
            var passFlag = true;
            if(pcType == "phone"){
                //‘保单提交’模块子选项卡标题列表
                var tabTitleList = [];
                var flag = 0;
                if($scope.copyFlag && $scope.isTj){
                    tabTitleList = ["短信验证","双录话术","投保提示书","投保保单","人身保险产品销售服务确认书"];
                    flag=1;
                }
                if(!$scope.copyFlag && !$scope.isTj){
                    tabTitleList = ["短信验证","投保提示书","投保保单"];
                    flag=2;
                }
                if($scope.copyFlag && !$scope.isTj){
                    tabTitleList = ["短信验证","双录话术","投保提示书","投保保单"];
                    flag=3;
                }
                if(!$scope.copyFlag && $scope.isTj){
                    tabTitleList = ["短信验证","投保提示书","投保保单","人身保险产品销售服务确认书"];
                    flag=4;
                }

                if(flag==1 || flag==3){ //有双录
                    if(activeTab==3){  //提示书
                        var sign_button = document.getElementById("sign_button").style.display;
                        if(sign_button!='none'){
                            CommonFn.alertPopupFun($ionicPopup,'loser','请完成电子签名！',3000);
                            passFlag = false;
                            return false;
                        }
                    }
                    if(activeTab==4){  //投保保单
                        var tow_sign_button = document.getElementById("tow_sign_button").style.display;
                        var regin_button = document.getElementById("regin_button").style.display;
                        if($scope.copystatementState == true && (!$scope.applicantInfo.COPY_FRONT || !$scope.applicantInfo.COPY_REVERSE)){
                            myAlert('请上传影像件及手持确认书影像件');
                            passFlag = false;
                            return false;
                        }
                        if(tow_sign_button!='none' || regin_button!='none'){
                            CommonFn.alertPopupFun($ionicPopup,'loser','请完成电子签名！',3000);
                            passFlag = false;
                            return false;
                        }
                    }

                }else{ //无双录
                    if(activeTab==2){  //提示书
                        var sign_button = document.getElementById("sign_button").style.display;
                        if(sign_button!='none'){
                            CommonFn.alertPopupFun($ionicPopup,'loser','请完成电子签名！',3000);
                            passFlag = false;
                            return false;
                        }
                    }
                    if(activeTab==3){  //投保保单
                        var tow_sign_button = document.getElementById("tow_sign_button").style.display;
                        var regin_button = document.getElementById("regin_button").style.display;
                        if($scope.copystatementState == true && (!$scope.applicantInfo.COPY_FRONT || !$scope.applicantInfo.COPY_REVERSE)){
                            myAlert('请上传影像件及手持确认书影像件');
                            passFlag = false;
                            return false;
                        }
                        if(tow_sign_button!='none' || regin_button!='none'){
                            CommonFn.alertPopupFun($ionicPopup,'loser','请完成电子签名！',3000);
                            passFlag = false;
                            return false;
                        }
                    }
                }
                document.getElementById("step8_title").innerHTML = tabTitleList[activeTab];
            }
            return passFlag;
        };
		/**********受益人点击切换事件 Li Jie start**********************/
	    $scope.removeSyr = function(currentIndex,objBean){
	    	 //0--type删除身故 1--删除除身故 
			 var deletesql = { 
				"databaseName":"promodel/10005/www/db/insurance_online.sqlite",
				"sql": " delete from T_CUSTOMER where APPLY_ID ='"+objBean["APPLY_ID"]+"' and BENEFIT_TYPE ='"+objBean["BENEFIT_TYPE"]+"' and CUSTOMER_ID= '"+objBean.CUSTOMER_ID+"' "
	   		 }; 
			
			 //提示确认删除
			 $ionicActionSheet.show({
	            titleText:"您是否删除该受益人！",  
	            buttons: [ { text: '确认' }, { text: '取消' } ], 
	            buttonClicked: function(index) { 
	            	 if(0 == index){ //确认
	            		 executeUpdateSql(deletesql,function(data){
	            			 //js动态删除记录
	            			 $scope.$apply(function(){
	            				 if(objBean["BENEFIT_TYPE"] == "0"){
	            					 $scope.benefitOneData.splice(currentIndex,1);
	            				 }else{
	            					 $scope.benefitTwoData.splice(currentIndex,1);
	            				 }
	            			 });
	            			 //myAlert("数据移除成功!");
	            			 var ionicAlert = $ionicPopup.alert({
	     			            template: '<div class="pop_up_box"><span class="loser"></span>删除成功！</div>'
	     			        });
	     					setTimeout(function (){
     			                if(null != ionicAlert){
     			                    ionicAlert.close(); 
									$scope.modalCustomer.hide();
     			                } 
	     		            },2000); 
							
							/*
							$scope.$apply(function () { 
								 var fromUnfinishSyr = {
									"databaseName": "promodel/10005/www/db/insurance_online.sqlite",
									"tableName": "T_CUSTOMER",
									"conditions": {'APPLY_ID': objBean["APPLY_ID"],'IS_BENEFIT':2}
								}; 
								queryTableDataByConditions(fromUnfinishSyr, function (syrData) { 
									var oneList =[];
									var twoList =[];
									if(syrData  && syrData.length > 0){
										for(var k = 0;k<syrData.length; k++){
											var omap = {};
											var type = syrData[k]["BENEFIT_TYPE"];
											omap = syrData[k];
											omap["relationList"] = relationList;
											if(relationList != null){
												for(var j = 0; j<relationList.length; j++){
													 if(relationList[j]["CODE"] == syrData[k]["RELATION"]){
															omap["RELATION"] = relationList[j];
													 }
												}
											} 
											if(type == '0'){
												oneList.push(omap);
											}else if(type == '1'){
												twoList.push(omap);
											}
										}
									}
									$scope.benefitOneData = oneList;
									$scope.benefitTwoData = twoList;  
								});
							});
							*/
						});
	            	  	return true;
	            	 }else{ //取消
	            	 	return true;
	            	 }
	            }
	        });  
	    }
	    
	    //保存受益人信息
		$scope.changeRelationFn	= function(syrBean){
//------------------------添加受益人和被保人关系判断---3.24 wuwei---起----------------------------------------------		
            if(!syrBean.RELATION){
            	//childrenMyAlert("系被保人关系不能为空，请选择！");
            	$ionicActionSheet.show({
					titleText:'系被保人关系不能为空，请选择！',
					cancelText: '确定'               
				});
				return;
            }
            var relation=syrBean["RELATION"]["CODE"];//与受益人关系 
            var beneficiary_sex=syrBean["SEX"];//受益人性别
			var beneficiary_age = getAgeByBirthday(syrBean["BIRTHDAY"]);//受益人年龄
            //被保人数据         
			var recognizeeData =$scope.recognizeeData; 
			var recognizee_sex=recognizeeData["SEX"];//被保人性别
            var recognizee_age= getAgeByBirthday(recognizeeData["BIRTHDAY"]);//被保人年龄
//------------------------添加受益人和被保人关系判断---3.24 wuwei----止---------------------------------------------
			//系被保人关系
			if(!relation || ""==relation){
				//childrenMyAlert("系被保人关系不能为空，请选择！");
				$ionicActionSheet.show({
					titleText:'系被保人关系不能为空，请选择！',
					cancelText: '确定'               
				});
				return;
			}else{
//------------------------添加受益人和被保人关系判断---3.24 wuwei---起----------------------------------------------
			  var ageDiffer = parseInt(beneficiary_age) - parseInt(recognizee_age); //受益人与被保人年龄的差值
			  if(relation == '01'){//丈夫
			 	 if((recognizee_sex=="0") || (recognizee_sex=="1" && beneficiary_sex=='1')){
					       $ionicActionSheet.show({
						   titleText:'受益人系被保人的关系有误，请重新确认',
						   cancelText: '确定' 
						});
						   return;	   
				   }/* else if(recognizee_sex="1" && beneficiary_sex=='1'){
                            $ionicActionSheet.show({
						    titleText:'投保人系被保人的关系有误，请重新确认',
						    cancelText: '确定'});									
				  }	*/			  
			   }

			  if(relation == '02'){//妻子
				 if((recognizee_sex=="0" && beneficiary_sex=='0') || (recognizee_sex=="1")){
					       $ionicActionSheet.show({
						   titleText:'受益人系被保人的关系有误，请重新确认',
						   cancelText: '确定' 
						});
						   return;				
				   }/*else if(recognizee_sex="1"){
                            $ionicActionSheet.show({
						    titleText:'投保人系被保人的关系有误，请重新确认',
						    cancelText: '确定'});									
				  }*/				
			  }

			  if(relation == '03'){//父亲
				 if(beneficiary_sex == '1' || ageDiffer<=0){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}
			  if(relation == '04'){//母亲
				 if(beneficiary_sex == '0' || ageDiffer<=0){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}
			  if(relation == '05'){//儿子
				 if(beneficiary_sex == '1' || ageDiffer>=0){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}

			  if(relation == '06'){//女儿
				    if(beneficiary_sex == '0' || ageDiffer>=0){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			  }
			  if(relation == '07'){//祖父
				  if(beneficiary_sex == '1' || ageDiffer<=0){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}
			  if(relation == '08'){//祖母
				  if(beneficiary_sex == '0' || ageDiffer<=0){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}
			  if(relation == '09'){//孙子
				  if(beneficiary_sex == '1' || ageDiffer>=0){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}
			  if(relation == '10'){//孙女
				  if(beneficiary_sex == '0' || ageDiffer>=0){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}
			  if(relation == '11'){//外祖父
				  if(beneficiary_sex == '1' || ageDiffer<=0){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}
			  if(relation == '12'){//外祖母
				  if(beneficiary_sex == '0' || ageDiffer<=0){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}
			  if(relation == '13'){//外孙
				  if(beneficiary_sex == '1' || ageDiffer>=0){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}
			  if(relation == '14'){//外孙女
				  if(beneficiary_sex == '0' || ageDiffer>=0){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}
			  if(relation == '15'){//哥哥,男性
				  if(beneficiary_sex == '1' || ageDiffer<0){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}						
			  if(relation == '16'){//姐姐,女性
				  if(beneficiary_sex == '0' || ageDiffer<0){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}						
			  if(relation == '17'){//弟弟,男性
				  if(beneficiary_sex == '1' || ageDiffer>0){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}					
			  if(relation == '18'){//妹妹,女性
				  if(beneficiary_sex == '0' || ageDiffer>0){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}
			  if(relation == '19'){//公公
				  if(beneficiary_sex == '1'){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}					
			  if(relation == '20'){//婆婆
				  if(beneficiary_sex == '0'){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}
			  if(relation == '21'){//岳父
				  if(beneficiary_sex == '1'){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}					
			  if(relation == '22'){//岳母
				  if(beneficiary_sex == '0'){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}
			  if(relation == '23'){//儿媳
				  if(beneficiary_sex == '0'){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}
			  if(relation == '24'){//女婿
				 if(beneficiary_sex == '1'){
					$ionicActionSheet.show({
						titleText:'受益人系被保人的关系有误，请重新确认',
						cancelText: '确定'               
					});
						return;
				}
			}	
		
//------------------------添加受益人和被保人关系判断---3.24 wuwei----止---------------------------------------------                  
	}
			
			if(!syrBean.BENEFIT_ORDER){
				//childrenMyAlert("受益顺序不能为空，请选择！");
				$ionicActionSheet.show({
					titleText:'受益顺序不能为空，请选择！',
					cancelText: '确定'               
				});
				return;
			}
			if(!syrBean.BENEFIT_RATE){
				//childrenMyAlert("受益比例不能为空，请输入！"); 
				$ionicActionSheet.show({
					titleText:'受益比例不能为空，请输入！',
					cancelText: '确定'               
				});
				return;
			}
		/*	//受益人列表
			var benefitList;
			if(syrBean.BENEFIT_TYPE == "0"){
				benefitList = $scope.benefitOneData;
			}else{
				benefitList = $scope.benefitTwoData;
			}
			var benefitRateTotal = 0;
			for(var i = 0 ; i < benefitList.length ; i++){
				var tempRate = benefitList[i]["BENEFIT_RATE"];
				var tempRateNum = parseFloat(tempRate);
				if(!isNaN(tempRateNum)){
					benefitRateTotal += tempRateNum;
				}
			}
			//判断受益比例是否大于100%
			if(benefitRateTotal > 100){
				childrenMyAlert("受益人的受益比例之和不能超过100%，请重新输入！");
				return;
			}*/
//--------------------------每个受益顺序收益比例之和都为100%---3.29 zhanglei-----起---------------------
			//受益人列表
			var benefitList;
			if(syrBean.BENEFIT_TYPE == "0"){
				benefitList = $scope.benefitOneData;
			}else{
				benefitList = $scope.benefitTwoData;
			}
			var benefitRateTotal1 = 0;//第一受益人受益比例之和
			var benefitRateTotal2 = 0;//第二受益人受益比例之和
			var benefitRateTotal3 = 0;//第三受益人受益比例之和
			var benefitRateTotal4 = 0;//第四受益人受益比例之和
			for(var i = 0 ; i < benefitList.length ; i++){
				var tempRate = benefitList[i]["BENEFIT_RATE"];
				var tempRate2 = benefitList[i]["BENEFIT_ORDER"];
				var tempRateNum = parseFloat(tempRate);
				if(tempRate2 == 1){
					if(!isNaN(tempRateNum)){
					   benefitRateTotal1 += tempRateNum;
				    }
				}else if(tempRate2 == 2){
					if(!isNaN(tempRateNum)){
					   benefitRateTotal2 += tempRateNum;
				    }
				}else if(tempRate2 == 3){
					if(!isNaN(tempRateNum)){
					   benefitRateTotal3 += tempRateNum;
				    }
				}else if(tempRate2 == 4){
					if(!isNaN(tempRateNum)){
					   benefitRateTotal4 += tempRateNum;
				    }
				}
				
			}
			//判断受益比例是否大于100%
			if(benefitRateTotal1 > 100){
				//childrenMyAlert("受益人顺序为1的受益比例之和不能超过100%，请重新输入！");
				$ionicActionSheet.show({
					titleText:'受益人顺序为1的受益比例之和不能超过100%，请重新输入！',
					cancelText: '确定'               
				});
				return;
			}else if(benefitRateTotal2 > 100){
				//childrenMyAlert("受益人顺序为2的受益比例之和不能超过100%，请重新输入！");
				$ionicActionSheet.show({
					titleText:'受益人顺序为2的受益比例之和不能超过100%，请重新输入！',
					cancelText: '确定'               
				});
				return;
			}else if(benefitRateTotal3 > 100){
				//childrenMyAlert("受益人顺序为3的受益比例之和不能超过100%，请重新输入！");
				$ionicActionSheet.show({
					titleText:'受益人顺序为3的受益比例之和不能超过100%，请重新输入！',
					cancelText: '确定'               
				});
				return;
			}else if(benefitRateTotal4 > 100){
				//childrenMyAlert("受益人顺序为4的受益比例之和不能超过100%，请重新输入！");
				$ionicActionSheet.show({
					titleText:'受益人顺序为4的受益比例之和不能超过100%，请重新输入！',
					cancelText: '确定'               
				});
				return;
			}
//--------------------------每个受益顺序收益比例之和都为100%---3.29 zhanglei-----止---------------------	

			if(pcType == 'phone'){ //手机版
				var omap = {};
				if(syrBean != null){
					omap = syrBean;
				} 
				var cstm ={};
				cstm["CUSTOMER_ID"] = omap["CUSTOMER_ID"];
				cstm["APPLY_ID"] = omap["APPLY_ID"];
				cstm["PROPOSAL_ID"] = omap["PROPOSAL_ID"];
				cstm["AGENT_CODE"] = omap["AGENT_CODE"];
				cstm["NAME"] = omap["NAME"];
				cstm["SEX"] = omap["SEX"];
				cstm["BIRTHDAY"] = omap["BIRTHDAY"];
				cstm["IDNAME"] = omap.IDTYPE;
				cstm["IDNO"] = omap.IDNO;
				cstm["ID_END_DATE"] = omap.ID_END_DATE;
				//cstm["IS_FOREVER"] = omap.BIRTHDAY;
				cstm["MARRIY"] = omap.MARRI_STATUS;
				cstm["NATIVE_PLACE"] = omap.NATIVE_PLACE;
				cstm["RGT_ADDRESS"] = omap.HOUSEHOLD_ADRESS;
				cstm["INCOME"] = omap.INCOME;
				cstm["INCOME_WAY"] = omap.INCOME_WAY;
				cstm["WORK_UNIT"] = omap.WORK_UNIT;
				cstm["HOME_ADDRESS"] = omap.HOME_ADDRESS;
				//cstm["HOME_ADDRESS"] = omap.HOME_CITY+omap.HOME_COUNTY+omap.HOME_ADDRESS;
				cstm["HOME_ZIP_CODE"] = omap.HOME_ZIP_CODE;
				cstm["OCCUPATION"] = omap.OCCUPATION_CODE_NAME;
				cstm["OCCUPATION_CODE"] = omap.OCCUPATION_CODE;
				cstm["PHONE"] = omap.COMPANY_PHONE;
				cstm["MOBILE"] = omap.MOBILE;
				cstm["EMAIL"] = omap.EMAIL;
				cstm["CREATE_TIME"] = new Date();
				cstm["UPDATE_TIME"] = new Date();
				cstm["IS_BENEFIT"] = 2;
				/*
				var selectVal = document.getElementById("customer_relation").value;  
				if(selectVal){
					if(relationList != null && relationList.length > 0){
							selectVal = relationList[selectVal]["CODE"];
					}   
					cstm["RELATION"] = selectVal;//与受益人关系
				}*/
				cstm["RELATION"] = omap["RELATION"]["CODE"];//与受益人关系
				cstm["BENEFIT_ORDER"] = omap.BENEFIT_ORDER;//序号
				cstm["BENEFIT_RATE"] = omap.BENEFIT_RATE;//百分比   
				cstm["BENEFIT_TYPE"] = omap["BENEFIT_TYPE"]; 
				//进行数据库的保存操作 
				var addCstm = {
					"databaseName": "promodel/10005/www/db/insurance_online.sqlite",
					"tableName": "T_CUSTOMER",
					"conditions": [{"CUSTOMER_ID": omap["CUSTOMER_ID"],"APPLY_ID":omap["APPLY_ID"],"BENEFIT_TYPE":omap["BENEFIT_TYPE"]}],
					"data": [cstm]
				};
				updateORInsertTableDataByConditions(addCstm, function (str) { 
					var ionicAlert = $ionicPopup.alert({
			            template: '<div class="pop_up_box"><span class="loser"></span>受益人信息保存成功!</div>'
			        });
					setTimeout(function (){
			                if(null != ionicAlert){
			                    ionicAlert.close(); 
								$scope.modalCustomer.hide();
			                } 
		            },2000); 
				}, function () {
					console.log("客户信息保存失败！");
				});
			}else{
				var omap = {};
				if(syrBean != null){
					omap = syrBean;
				} 
				var cstm ={};
				cstm["CUSTOMER_ID"] = omap["CUSTOMER_ID"];
				cstm["APPLY_ID"] = omap["APPLY_ID"];
				cstm["PROPOSAL_ID"] = omap["PROPOSAL_ID"];
				cstm["AGENT_CODE"] = omap["AGENT_CODE"];
				cstm["NAME"] = omap["NAME"];
				cstm["SEX"] = omap["SEX"];
				cstm["BIRTHDAY"] = omap["BIRTHDAY"];
				cstm["IDNAME"] = omap.IDTYPE;
				cstm["IDNO"] = omap.IDNO;
				cstm["ID_END_DATE"] = omap.ID_END_DATE;
				//cstm["IS_FOREVER"] = omap.BIRTHDAY;
				cstm["MARRIY"] = omap.MARRI_STATUS;
				cstm["NATIVE_PLACE"] = omap.NATIVE_PLACE;
				cstm["RGT_ADDRESS"] = omap.HOUSEHOLD_ADRESS;
				cstm["INCOME"] = omap.INCOME;
				cstm["INCOME_WAY"] = omap.INCOME_WAY;
				cstm["WORK_UNIT"] = omap.WORK_UNIT;
				cstm["HOME_ADDRESS"] = omap.HOME_ADDRESS;
				cstm["HOME_ZIP_CODE"] = omap.HOME_ZIP_CODE;
				cstm["OCCUPATION"] = omap.OCCUPATION_CODE_NAME;
				cstm["OCCUPATION_CODE"] = omap.OCCUPATION_CODE;
				cstm["PHONE"] = omap.COMPANY_PHONE;
				cstm["MOBILE"] = omap.MOBILE;
				cstm["EMAIL"] = omap.EMAIL;
				cstm["CREATE_TIME"] = new Date();
				cstm["UPDATE_TIME"] = new Date();
				cstm["IS_BENEFIT"] = 2;  
				cstm["RELATION"] = omap["RELATION"]["CODE"];
				cstm["BENEFIT_ORDER"] = omap["BENEFIT_ORDER"];//序号
				cstm["BENEFIT_RATE"] = omap["BENEFIT_RATE"];//百分比  
				cstm["BENEFIT_TYPE"] = omap["BENEFIT_TYPE"];		
				/*
				var customerId = omap["CUSTOMER_ID"];  
				if('1' == type){ //身故   
					//获取当前选中的值
					var selectVal = document.getElementById(customerId+"_sg_relation").value;
					if(selectVal){
						if(relationList != null && relationList.length > 0){
								selectVal = relationList[selectVal]["CODE"];
						}
						cstm["RELATION"] = selectVal;//与受益人关系
					}
					
					cstm["BENEFIT_ORDER"] = document.getElementById(customerId+"_sg_rate").value;//序号
					cstm["BENEFIT_RATE"] =document.getElementById(customerId+"_sg_percent").value;//百分比  
					cstm["BENEFIT_TYPE"] = 0;  
				}else if('2' == type){//除身故 
					var selectVal =  document.getElementById(customerId+"_nosg_relation").value;
					if(selectVal){
						if(relationList != null && relationList.length > 0){
								selectVal = relationList[selectVal]["CODE"];
						} 
						cstm["RELATION"] = selectVal;//与受益人关系
					}
					
					cstm["BENEFIT_ORDER"] = document.getElementById(customerId+"_nosg_rate").value;//序号
					cstm["BENEFIT_RATE"] = document.getElementById(customerId+"_nosg_percent").value;//百分比 
					cstm["BENEFIT_TYPE"] = 1; 
				}
				 */
				
				//进行数据库的保存操作 
				var addCstm = {
					"databaseName": "promodel/10005/www/db/insurance_online.sqlite",
					"tableName": "T_CUSTOMER",
					"conditions": [{"CUSTOMER_ID": omap["CUSTOMER_ID"],"APPLY_ID":omap["APPLY_ID"],"BENEFIT_TYPE":omap["BENEFIT_TYPE"]}],
					"data": [cstm]
				};
				updateORInsertTableDataByConditions(addCstm, function (str) {
	//				alert("数据保存:" + str)
					myAlert("数据保存成功！");
				}, function () {
					console.log("客户信息保存失败！");
				});
			} 
		}
			
		/******************受益人点击切换事件 Li Jie END**************/	
		$scope.toCustomer = function (customerType){
			var url = '';
			syrUserType = customerType;
			var toBackFlag = 'true';
			//被保人年龄小于18，年收入，收入来源，工作单位不应填写
			var r_age = document.getElementById('phone_i_birthday').innerText; //被保人出生日期
			var r_age_pc = document.getElementById('i_birthday').innerText;
			var phone_a_occupation = document.getElementById('phone_a_occupation').innerText;//投保人职业
			var phone_a_occupation_code = document.getElementById('phone_a_occupation_code').innerText;//投保人职业编码
			var a_occupation = document.getElementById('a_occupation').innerText;
            var a_occupation_code = document.getElementById('a_occupation_code').innerText;
			var i_occupation = document.getElementById('i_occupation').innerText;//被保人职业
            var i_occupation_code = document.getElementById('i_occupation').innerText;//被保人职业代码
			var phone_i_occupation = document.getElementById('phone_i_occupation').innerText;
            var phone_i_occupation_code = document.getElementById('phone_i_occupation_code').innerText;
			var rages = getAgeByBirthday(r_age);
			var rages_pc = getAgeByBirthday(r_age_pc);
			if(customerType==1){//编辑投保人，身高，体重为不必填项
				var applicantID = document.getElementById('applicantID').value;
				if(organCode.substr(0,4) == '8614'){
					//alert("针对山西机构去掉单位和家庭adress");
					url = "promodel/"+Variables.customerAppId+"/www/index.html?pctype="+document.getElementById("pctype").value+"&recommend=1&proid="+Variables.customerAppId+"&applicant_id="+applicantID+"&agentCode="+agentCode+"&toBackFlag="+toBackFlag+"&editCustom=true&mustNeedKey=IDNO,INCOME,INCOME_WAY,OCCUPATION_CODE,MOBILE,MARRI_STATUS,NATIVE_PLACE,RGT_PROVINCE,RGT_CITY,IDTYPE,BIRTHDAY,COMPANY_ZIP_CODE,HOME_ZIP_CODE,WORK_UNIT,HOME_PROVINCE,HOME_CITY,HOME_COUNTY,COMPANY_PROVINCE,COMPANY_CITY,COMPANY_COUNTY";
				}else{
					url = "promodel/"+Variables.customerAppId+"/www/index.html?pctype="+document.getElementById("pctype").value+"&recommend=1&proid="+Variables.customerAppId+"&applicant_id="+applicantID+"&agentCode="+agentCode+"&toBackFlag="+toBackFlag+"&editCustom=true&mustNeedKey=IDNO,INCOME,INCOME_WAY,OCCUPATION_CODE,COMPANY_ADDRESS,MOBILE,MARRI_STATUS,NATIVE_PLACE,RGT_PROVINCE,RGT_CITY,IDTYPE,BIRTHDAY,COMPANY_ZIP_CODE,HOME_ADDRESS,HOME_ZIP_CODE,WORK_UNIT,HOME_PROVINCE,HOME_CITY,HOME_COUNTY,COMPANY_PROVINCE,COMPANY_CITY,COMPANY_COUNTY";
					if(phone_a_occupation.indexOf('学生') > -1 || a_occupation.indexOf('学生') > -1){
						url = "promodel/"+Variables.customerAppId+"/www/index.html?pctype="+document.getElementById("pctype").value+"&recommend=1&proid="+Variables.customerAppId+"&applicant_id="+applicantID+"&agentCode="+agentCode+"&toBackFlag="+toBackFlag+"&editCustom=true&mustNeedKey=IDNO,OCCUPATION_CODE,COMPANY_ADDRESS,MOBILE,MARRI_STATUS,NATIVE_PLACE,RGT_PROVINCE,RGT_CITY,IDTYPE,BIRTHDAY,COMPANY_ZIP_CODE,HOME_ADDRESS,HOME_ZIP_CODE,WORK_UNIT,HOME_PROVINCE,HOME_CITY,HOME_COUNTY,COMPANY_PROVINCE,COMPANY_CITY,COMPANY_COUNTY";
					}
				}

			}else if(customerType==2){//编辑被保人
				var recognizeeID = document.getElementById('recognizeeID').value;
				if(organCode.substr(0,4) == '8614'){
					//alert("针对山西机构去掉单位和家庭adress");					
					if(rages<=18 || rages_pc<=18 || phone_i_occupation.indexOf('学生') > -1 || i_occupation.indexOf('学生') > -1){
						url = "promodel/"+Variables.customerAppId+"/www/index.html?pctype="+document.getElementById("pctype").value+"&recommend=2&proid="+Variables.customerAppId+"&applicant_id="+recognizeeID+"&agentCode="+agentCode+"&toBackFlag="+toBackFlag+"&editCustom=true&mustNeedKey=IDNO,OCCUPATION_CODE,MOBILE,NATIVE_PLACE,RGT_PROVINCE,RGT_CITY,IDTYPE,BIRTHDAY,COMPANY_ZIP_CODE,HEIGHT,WEIGHT,HOME_ZIP_CODE,HOME_PROVINCE,HOME_CITY,HOME_COUNTY,COMPANY_PROVINCE,COMPANY_CITY,COMPANY_COUNTY";
					}else{
						url = "promodel/"+Variables.customerAppId+"/www/index.html?pctype="+document.getElementById("pctype").value+"&recommend=2&proid="+Variables.customerAppId+"&applicant_id="+recognizeeID+"&agentCode="+agentCode+"&toBackFlag="+toBackFlag+"&editCustom=true&mustNeedKey=IDNO,INCOME,INCOME_WAY,OCCUPATION_CODE,MOBILE,MARRI_STATUS,NATIVE_PLACE,RGT_PROVINCE,RGT_CITY,IDTYPE,BIRTHDAY,COMPANY_ZIP_CODE,HEIGHT,WEIGHT,HOME_ZIP_CODE,WORK_UNIT,HOME_PROVINCE,HOME_CITY,HOME_COUNTY,COMPANY_PROVINCE,COMPANY_CITY,COMPANY_COUNTY";
					}
				}else{
					if(rages<=18 || rages_pc<=18 || phone_i_occupation.indexOf('学生') > -1 || i_occupation.indexOf('学生') > -1){
						url = "promodel/"+Variables.customerAppId+"/www/index.html?pctype="+document.getElementById("pctype").value+"&recommend=2&proid="+Variables.customerAppId+"&applicant_id="+recognizeeID+"&agentCode="+agentCode+"&toBackFlag="+toBackFlag+"&editCustom=true&mustNeedKey=IDNO,OCCUPATION_CODE,COMPANY_ADDRESS,MOBILE,NATIVE_PLACE,RGT_PROVINCE,RGT_CITY,IDTYPE,BIRTHDAY,COMPANY_ZIP_CODE,HOME_ADDRESS,HEIGHT,WEIGHT,HOME_ZIP_CODE,HOME_PROVINCE,HOME_CITY,HOME_COUNTY,COMPANY_PROVINCE,COMPANY_CITY,COMPANY_COUNTY";
					}else{
						url = "promodel/"+Variables.customerAppId+"/www/index.html?pctype="+document.getElementById("pctype").value+"&recommend=2&proid="+Variables.customerAppId+"&applicant_id="+recognizeeID+"&agentCode="+agentCode+"&toBackFlag="+toBackFlag+"&editCustom=true&mustNeedKey=IDNO,INCOME,INCOME_WAY,OCCUPATION_CODE,COMPANY_ADDRESS,MOBILE,MARRI_STATUS,NATIVE_PLACE,RGT_PROVINCE,RGT_CITY,IDTYPE,BIRTHDAY,COMPANY_ZIP_CODE,HOME_ADDRESS,HEIGHT,WEIGHT,HOME_ZIP_CODE,WORK_UNIT,HOME_PROVINCE,HOME_CITY,HOME_COUNTY,COMPANY_PROVINCE,COMPANY_CITY,COMPANY_COUNTY";
					}
				}
				
			}else if(customerType==3){//选择受益人
				//url = "promodel/"+Variables.customerAppId+"/www/index.html?pctype="+document.getElementById("pctype").value+"&recommend=3&favoreetype=0&proid="+Variables.customerAppId+"&agentCode="+agentCode+"&editCustom=false&mustNeedKey=REAL_NAME,BIRTHDAY,SEX,IDTYPE,IDNO,ID_END_DATE,HOME_ADDRESS,HOME_ZIP_CODE,WORK_UNIT";
				url = "promodel/"+Variables.customerAppId+"/www/index.html?pctype="+document.getElementById("pctype").value+"&recommend=3&favoreetype=0&proid="+Variables.customerAppId+"&agentCode="+agentCode+"&editCustom=false&mustNeedKey=REAL_NAME,BIRTHDAY,SEX,IDTYPE,IDNO,ID_END_DATE,HOME_PROVINCE,HOME_CITY,HOME_COUNTY,HOME_ADDRESS,NATIVE_PLACE,OCCUPATION_CODE";
			}else if(customerType==4){//选择其他受益人
				url = "promodel/"+Variables.customerAppId+"/www/index.html?pctype="+document.getElementById("pctype").value+"&recommend=3&favoreetype=1&proid="+Variables.customerAppId+"&agentCode="+agentCode+"&editCustom=false&mustNeedKey=REAL_NAME,BIRTHDAY,SEX,IDTYPE,IDNO,ID_END_DATE,HOME_ADDRESS,NATIVE_PLACE,OCCUPATION_CODE";
				console.log("url:" + url);
			}
            //农民、家庭主妇、无业人员工作单位可不填
            if(phone_a_occupation_code=="8010104"||phone_a_occupation_code=="8010102"||phone_a_occupation_code=="8010101"||phone_a_occupation_code=="5010101"||
				a_occupation_code=="8010104"||a_occupation_code=="8010102"||a_occupation_code=="8010101"||a_occupation_code=="5010101"||
				phone_i_occupation_code=="8010104"||phone_i_occupation_code=="8010102"||phone_i_occupation_code=="8010101"||phone_i_occupation_code=="5010101"||
                i_occupation_code=="8010104"||i_occupation_code=="8010102"||i_occupation_code=="8010101"||i_occupation_code=="5010101"){
                url = url.replace("WORK_UNIT,","");
            }
            //alert(url);
			var jsonKey ={
				"serviceType":"LOCAL",
				"URL": url
			};
			pushToViewController(jsonKey, function (){
				console.log("选择客户！");
			},function (){
				console.log("选择失败");
			});
		};
		//受益人直选投保人
		$scope.sameOfApplicant = function(benefitType){
			//受益人列表
			var oneList = $scope.benefitOneData;
			var twoList = $scope.benefitTwoData;
			var applicantID = document.getElementById("applicantID").value;
			var recognizeeID = document.getElementById("recognizeeID").value;
			
			//身故受益人
			if(benefitType == "0" && oneList){
				//身故受益人不允许重复添加同一个客户
				for(var i = 0 ; i < oneList.length ; i++){
					var tempCustomerId = oneList[i]["CUSTOMER_ID"];
					if(applicantID == tempCustomerId){
						myAlert("投保人已在列表中！");
						return;
					}
				}
			}else if(benefitType == "1" && twoList){
				//非身故受益人不允许重复添加同一个客户
				for(var i = 0 ; i < twoList.length ; i++){
					var tempCustomerId = twoList[i]["CUSTOMER_ID"];
					if(applicantID == tempCustomerId){
						myAlert("投保人已在列表中！");
						return;
					}
				}
			}
			
			//投保人数据
			var applicantData = $scope.applicantData;
			//被保人数据
			var recognizeeData=$scope.recognizeeData;
			//身故受益人列表对象    
			var benefitData = new Object();
			benefitData["CUSTOMER_ID"] = applicantData.CUSTOMER_ID;
			benefitData["NAME"] = applicantData.NAME;
			benefitData["SEX"] = applicantData.SEX;
			benefitData["BIRTHDAY"] = applicantData.BIRTHDAY;
			benefitData["IDNAME"] = applicantData.IDNAME;
			benefitData["IDNO"] = applicantData.IDNO;
			benefitData["ID_END_DATE"] = applicantData.ID_END_DATE;
			benefitData["HOME_ADDRESS"] = applicantData.SUB_HOME_ADDRESS;
			//benefitData["HOME_ADDRESS"] = applicantData.HOME_ADDRESS;			
			benefitData["APPLY_ID"] = document.getElementById("formID").value;;
			benefitData["PROPOSAL_ID"] = document.getElementById("propsalID").value;
			benefitData["AGENT_CODE"] = agentCode;
			benefitData["CREATE_TIME"] = new Date();
			benefitData["UPDATE_TIME"] = new Date();
			benefitData["IS_BENEFIT"] = 2;
			benefitData["RELATION"] = "";
			benefitData["relationList"] = benefitRelationList;
			benefitData["BENEFIT_TYPE"] = benefitType;
			benefitData["MOBILE"] = applicantData.MOBILE;
			benefitData["OCCUPATION_CODE_NAME"] = applicantData.OCCUPATION;
			benefitData["OCCUPATION_CODE"] = applicantData.OCCUPATION_CODE;
			benefitData["NATIVE_PLACE"] = applicantData.NATIVE_PLACE;
			
			//身故受益人与被保险人之间的校验
			if(benefitType == "0" && oneList){
				if(benefitData["NAME"]==recognizeeData.NAME || benefitData["IDNO"]==recognizeeData.IDNO ){
					myAlert("身故受益人不能是被保险人本人");
					return;
			}
		};
			//身故受益人
			if(benefitType == "0"){
				oneList.push(benefitData);
			}else{
				twoList.push(benefitData);
			}
		}
		
/*
		//投保须知
		$scope.agree1 = function(check1){
			console.log(check1.on)
			if(check1.on == true){
				$timeout(function(){
					$scope.step1 = {
						activeTab:2
					}
				},800)
			}
		};
		//保险条款
		$scope.agree2 = function(check2){
			console.log(check2.on)
			if(check2.on == true){
				$timeout(function(){
					$scope.step1 = {
						activeTab:3
					}
				},800)
			}
		};
		//产品说明
		$scope.agree3 = function(check3){
			console.log(check3.on)
			if(check3.on == true){
				$scope.step1 = {
				 activeTab:1
				 };
				console.log('finish')
			}
		};*/

		//投保须知
		$scope.agree1 = function(check1){
			console.log(check1.on)
			if(check1.on == true){
				$timeout(function(){
					document.getElementById("tbxz_agree").value = true;
					$scope.step1 = {
						activeTab:2
					}
				},800)
			}else{
					document.getElementById("tbxz_agree").value = false;
			}
		};
		//保险条款
		$scope.agree2 = function(check2){
			console.log(check2.on)
			if(check2.on == true){
				document.getElementById("bxtk_agree").value = true;
				$timeout(function(){
					$scope.step1 = {
						activeTab:3
					}
				},800)
			}else{
					document.getElementById("bxtk_agree").value = false;
			}
		};
		//产品说明
		$scope.agree3 = function(check3){
			console.log(check3.on)
			if(check3.on == true){
				document.getElementById("cpsm_agree").value = true;
				/*$scope.step1 = {
				 activeTab:1
				 };*/
				console.log('finish')
			}else{
					document.getElementById("cpsm_agree").value = false;
			}
		};
		/*if(check1.on == true&&check2.on == true&&check3.on == true){

		 }*/
		if(organCode.substr(0,6) == '863205'){
			$scope.Suzhou = true;
		}
		/**
		 * 影像录入
		 */
		$scope.goAction = function ($event,tb,customerid,currentIndex) {
//			alert("currentIndex:"+currentIndex);
			if(isreleated == "05" && tb.indexOf('tbr') > -1){
				customerid = document.getElementById("applicantID").value;
			}
			$ionicActionSheet.show({
				buttons: [
					{
						text: '拍照'
					}
					,
					{
						text: '从相册中选取'
					}
				],	
				cancelText: '取消',
				cancel: function () {
					console.log('CANCELLED');
				},
				buttonClicked: function (index) { 
					if (index == 0) {
						var formId = document.getElementById("formID").value;
						var photoUrl = formId + tb + customerid + suffixName;
						getPhotoFromCamera1(photoUrl,function (imageURL) {
//							alert("imageURL:"+imageURL);
//							imageURL = imageURL + "?random=" + Math.random();
							if (tb == 'fronttbr') {
								//投保人正面
								$scope.$apply(function () { 
									//$scope.tbrFront = imageURL+"?random="+Math.random(); 
									$scope.applicantInfo.CARD_FRONT = imageURL;
									// alert("applicantInfo.CARD_FRONT"+$scope.applicantInfo.CARD_FRONT);
								})
							} else if (tb == 'backtbr') { 
								//投保人反面
								$scope.$apply(function () {
//									$scope.tbrBack = imageURL+"?random="+Math.random(); 
									$scope.applicantInfo.CARD_REVERSE = imageURL;
//									alert("applicantInfo.CARD_REVERSE"+$scope.applicantInfo.CARD_REVERSE);
								})
							}else if(tb == 'banktbr'){
								$scope.$apply(function () {
									$scope.applicantInfo.BANK_FRONT = imageURL;
									// alert("银行卡===="+$scope.applicantInfo.BANK_FRONT);
								})								
							}
							 else if (tb == 'frontbbr') {
								//被保人正面
								$scope.$apply(function () {
//									$scope.bbrFront = imageURL+"?random="+Math.random(); 
									$scope.insurantInfo.CARD_FRONT = imageURL;
								})
							} else if (tb == 'backbbr') {
								//被保人反面
								$scope.$apply(function () {
//									$scope.bbrBack = imageURL+"?random="+Math.random(); 
									$scope.insurantInfo.CARD_REVERSE = imageURL; 
								})
							}else if(tb == 'frontcopy'){
								$scope.$apply(function () {
//									$scope.bbrBack = imageURL+"?random="+Math.random(); 
									$scope.applicantInfo.COPY_FRONT = imageURL; 
								})
							} else if(tb == 'backcopy'){
								$scope.$apply(function () {
//									$scope.bbrBack = imageURL+"?random="+Math.random(); 
									$scope.applicantInfo.COPY_REVERSE = imageURL; 
								})
							} else if(tb == 'cusmftbr'){
								$scope.$apply(function () {
//									$scope.bbrBack = imageURL+"?random="+Math.random(); 
									$scope.applicantInfo.CUSTOM_FRONT = imageURL; 
								})
							} else if(tb == 'cusmbtbr'){
								$scope.$apply(function () {
//									$scope.bbrBack = imageURL+"?random="+Math.random(); 
									$scope.applicantInfo.CUSTOM_REVERSE = imageURL; 
								})
							} 
							else if (tb == 'frontsyr') {
								//受益人正面
								$scope.$apply(function () {
									//$scope.syrFront = imageURL;
									var currentBenefit = $scope.BfList[currentIndex];
									currentBenefit["CARD_FRONT"] = imageURL;
//									alert("currentBenefit.NAME"+currentBenefit["NAME"]);
//									alert("currentBenefit.CARD_FRONT"+currentBenefit["CARD_FRONT"]);
//									alert("currentBenefit.CARD_FRONT2"+$scope.BfList[currentIndex]["CARD_FRONT"]);
								})
							} else if (tb == 'backsyr') {
								//受益人反面
								$scope.$apply(function () {
//									$scope.syrBack = imageURL;
									var currentBenefit = $scope.BfList[currentIndex];
									currentBenefit["CARD_REVERSE"] = imageURL;
//									alert("currentBenefit.CARD_REVERSE"+currentBenefit["CARD_REVERSE"]);
//									alert("currentBenefit.CARD_REVERSE2"+$scope.BfList[currentIndex]["CARD_REVERSE"]);
								})
							}
							//拍照实时保存
							$scope.saveCardImage(currentIndex);
						}, function () {
//                          alert('调用相机失败')
							$ionicLoading.show({
								template: '调用相机失败!'
							});
							$timeout(function () {
								$ionicLoading.hide();
							}, 1000);
						});
					} 
					else if (index == 1) {
						getPhotoFromAlbum(1, function (imageURL) {
							// $scope.image = 
							if(tb=='fronttbr'){
								//投保人正面
								// alert('imageURL=='+imageURL)
								$scope.$apply(function () {
									// $scope.image = true;
									$scope.applicantInfo.CARD_FRONT = imageURL;
								})
								// alert('CARD_FRONT=='+$scope.applicantInfo.CARD_FRONT)
							}else if(tb=='backtbr'){
								//投保人反面
								$scope.$apply(function () {
//									$scope.tbrBack = imageURL+"?random="+Math.random(); 
									$scope.applicantInfo.CARD_REVERSE = imageURL;
//									alert("applicantInfo.CARD_REVERSE"+$scope.applicantInfo.CARD_REVERSE);
								})
							}else if(tb == 'banktbr'){
								$scope.$apply(function () { 
									$scope.applicantInfo.BANK_FRONT = imageURL;
									// alert("银行卡===="+$scope.applicantInfo.BANK_FRONT);
								})	
							}else if(tb == 'frontcopy'){
								$scope.$apply(function () {
//									$scope.bbrBack = imageURL+"?random="+Math.random(); 
									$scope.applicantInfo.COPY_FRONT = imageURL; 
								})
							}else if(tb == 'backcopy'){
								$scope.$apply(function () {
//									$scope.bbrBack = imageURL+"?random="+Math.random(); 
									$scope.applicantInfo.COPY_REVERSE = imageURL; 
								})
							}else if(tb=='frontbbr'){
								//被保人正面
								$scope.$apply(function () {
//									$scope.bbrFront = imageURL+"?random="+Math.random(); 
									$scope.insurantInfo.CARD_FRONT = imageURL;
								})
							}else if(tb=='backbbr'){
								//被保人反面
								$scope.$apply(function () {
//									$scope.bbrBack = imageURL+"?random="+Math.random(); 
									$scope.insurantInfo.CARD_REVERSE = imageURL; 
								})
							}else if(tb == 'cusmftbr'){
								$scope.$apply(function () {
//									$scope.bbrBack = imageURL+"?random="+Math.random(); 
									$scope.applicantInfo.CUSTOM_FRONT = imageURL; 
								})
							} else if(tb == 'cusmbtbr'){
								$scope.$apply(function () {
//									$scope.bbrBack = imageURL+"?random="+Math.random(); 
									$scope.applicantInfo.CUSTOM_REVERSE = imageURL; 
								})
							} else if(tb=='frontsyr'){
								//受益人正面
								$scope.$apply(function () {
									//$scope.syrFront = imageURL;
									var currentBenefit = $scope.BfList[currentIndex];
									currentBenefit["CARD_FRONT"] = imageURL;
//									alert("currentBenefit.NAME"+currentBenefit["NAME"]);
//									alert("currentBenefit.CARD_FRONT"+currentBenefit["CARD_FRONT"]);
//									alert("currentBenefit.CARD_FRONT2"+$scope.BfList[currentIndex]["CARD_FRONT"]);
								})
							}else if(tb=='backsyr'){
							//受益人反面
								$scope.$apply(function () {
//									$scope.syrBack = imageURL;
									var currentBenefit = $scope.BfList[currentIndex];
									currentBenefit["CARD_REVERSE"] = imageURL;
//									alert("currentBenefit.CARD_REVERSE"+currentBenefit["CARD_REVERSE"]);
//									alert("currentBenefit.CARD_REVERSE2"+$scope.BfList[currentIndex]["CARD_REVERSE"]);
								})
							}
							$scope.saveCardImage(currentIndex);
						}, function () {
//                          alert('调用相册失败')
							$ionicLoading.show({
								template: '调用相册失败!'
							});
							$timeout(function () {
								$ionicLoading.hide();
							}, 1000);
						})
					}
					return true;
				}
			});
		};
		
		//保存影像录入中的证件照片
		$scope.saveCardImage = function(currentIndex){
			var activeTab = $scope.step3.activeTab;
			var formId = document.getElementById("formID").value;
			var applicantID = $scope.applicantInfo.CUSTOMER_ID;
			if(isreleated == "05"){
				applicantID = document.getElementById("applicantID").value;
			}
			var insurantID = $scope.insurantInfo.CUSTOMER_ID;
			var benefitList = $scope.BfList;
			
			var conditionArray = new Array();
			var dataArray = new Array();
//			alert("activeTab:"+activeTab);
			if(activeTab == 1){		//投保人证件照片
				var tempCondition = new Object();
				var tempData = new Object();
				tempCondition["APPLY_ID"] = formId;
				tempCondition["CUSTOMER_ID"] = applicantID;
				tempCondition["IS_BENEFIT"] = "0";
				conditionArray.push(tempCondition);
				
				tempData["CARD_FRONT"] = $scope.applicantInfo.CARD_FRONT;
				tempData["CARD_REVERSE"] = $scope.applicantInfo.CARD_REVERSE;
				tempData["BANK_FRONT"] = $scope.applicantInfo.BANK_FRONT;
				tempData["COPY_FRONT"] = $scope.applicantInfo.COPY_FRONT;
				tempData["COPY_REVERSE"] = $scope.applicantInfo.COPY_REVERSE;
				tempData["CUSTOM_FRONT"] = $scope.applicantInfo.CUSTOM_FRONT;
				tempData["CUSTOM_REVERSE"] = $scope.applicantInfo.CUSTOM_REVERSE;
//				alert("applicantInfo.CARD_FRONT"+$scope.applicantInfo.CARD_FRONT);
//				alert("applicantInfo.CARD_REVERSE"+$scope.applicantInfo.CARD_REVERSE);
				dataArray.push(tempData);
			}else if(activeTab == 2){	//被保人证件照片
				var tempCondition = new Object();
				var tempData = new Object();
				tempCondition["APPLY_ID"] = formId;
				tempCondition["CUSTOMER_ID"] = insurantID;
				tempCondition["IS_BENEFIT"] = "1";
				conditionArray.push(tempCondition);
				
				tempData["CARD_FRONT"] = $scope.insurantInfo.CARD_FRONT;
				tempData["CARD_REVERSE"] = $scope.insurantInfo.CARD_REVERSE;
				dataArray.push(tempData);
			}else if(activeTab == 3){	//受益人证件照片
				if(benefitList && benefitList.length > 0){
					var tempCondition = new Object();
					var tempData = new Object();
						
					//受益人
					var tempBenefit = benefitList[currentIndex];
					var tempBenefitId = tempBenefit.CUSTOMER_ID;
					tempCondition["APPLY_ID"] = formId;
					tempCondition["CUSTOMER_ID"] = tempBenefitId;
					tempCondition["IS_BENEFIT"] = "2";
					conditionArray.push(tempCondition);
						
					tempData["CARD_FRONT"] = tempBenefit.CARD_FRONT;
					tempData["CARD_REVERSE"] = tempBenefit.CARD_REVERSE;
//					alert("currentBenefit.CARD_FRONT"+currentBenefit["CARD_FRONT"]);
//					alert("currentBenefit.CARD_FRONT2"+$scope.BfList[currentIndex]["CARD_FRONT"]);
					dataArray.push(tempData);
				}
			}
			for(var i = 0 ; i < conditionArray.length ; i++){
				var tempCondition = conditionArray[i];
				var tempData = dataArray[i];
				var updateCardImageKey = {
					"databaseName":Variables.dataBaseName,
					"sql": "update t_customer set CARD_FRONT='"+tempData.CARD_FRONT+"',CARD_REVERSE='"+tempData.CARD_REVERSE+"',BANK_FRONT='"+tempData.BANK_FRONT+"',COPY_FRONT='"+tempData.COPY_FRONT+"',COPY_REVERSE='"+tempData.COPY_REVERSE+"',CUSTOM_FRONT='"+tempData.CUSTOM_FRONT+"',CUSTOM_REVERSE='"+tempData.CUSTOM_REVERSE+"' where customer_id='"+tempCondition.CUSTOMER_ID+"' and is_benefit='"+tempCondition.IS_BENEFIT+"' and apply_id='"+tempCondition.APPLY_ID+"'"
				}; 
				// alert("updateCardImageKey.sql："+updateCardImageKey.sql);
				executeUpdateSql(updateCardImageKey,function(data){
//					alert("data:-"+data +"-");
					if (data) {
						console.log('证件上传成功!');
//							element.attr('src',imageURL);
						$ionicLoading.show({
							template: '证件上传成功!'
						});
						$timeout(function () {
							$ionicLoading.hide();
//								$scope.step3 = {activeTab : i};
						}, 2000);
						return true;
					}else{
						$ionicLoading.show({
							template: '证件上传失败!'
						});
						$timeout(function () {
							$ionicLoading.hide();
						}, 2000);
						return false;
					}
				});
			}
		}
		
		/*$scope.tbrFront = '../img/add_red.png';
		 $scope.tbrBack = '../img/add_red.png';*/
		// $scope.saveTbr = function(i){

		// 	if($scope.tbrFront==''&&$scope.tbrBack==''){
		// 		$ionicLoading.show({
		// 			template: '证件正反面都要上传!'
		// 		});
		// 		$timeout(function () {
		// 			$ionicLoading.hide();
		// 		}, 1000);
		// 	}else{

		// 	}
		// 	/* alert($scope.tbrFront);
		// 	 alert($scope.tbrBack);*/
		// 	//投保人正面
		// 	var insuranceID = $stateParams.insuranceID;
		// 	var byid = {
		// 		"databaseName": Variables.dataBaseName,
		// 		"tableName": "T_APPLY",
		// 		"conditions": {"ID": insuranceID}//保单ID
		// 	};
		// 	queryTableDataByConditions(byid, function (data) {
		// 		console.log(data[0]);
		// 		var applicantID = data[0].APPLICANT_ID;
		// 		//var insurantID = data[0].INSURANT_ID;
		// 		var inserttbr = {
		// 			"databaseName": Variables.dataBaseName,
		// 			"tableName": "T_CUSTOMER",
		// 			"conditions": [
		// 				{"APPLY_ID": insuranceID,"CUSTOMER_ID":applicantID}
		// 			],
		// 			"data": [
		// 				{
		// 					"CARD_FRONT": $scope.tbrFront,
		// 					"CARD_ REVERSE": $scope.tbrBack
		// 				}
		// 			]
		// 		};
		// 		updateORInsertTableDataByConditions(inserttbr, function (data) {
		// 			if (data == 1) {
		// 				console.log('投保人证件正面插入数据成功！');
		// 				element.attr('src',imageURL);
		// 				$ionicLoading.show({
		// 					template: '投保人证件上传成功!'
		// 				});
		// 				$timeout(function () {
		// 					$ionicLoading.hide();
		// 					$scope.step3 = {activeTab : i};
		// 				}, 1000);
		// 			}else{
		// 				$ionicLoading.show({
		// 					template: '证件上传失败!'
		// 				});
		// 				$timeout(function () {
		// 					$ionicLoading.hide();
		// 				}, 1000);
		// 			}
		// 		});
		// 	});
		// };
	})
.controller('QuestionCtrl',function($http,$scope,$rootScope,$state,$ionicPopup,$timeout,CommonFn,submitInsurance,Variables){		
		$scope.sousuo = brows().iphone ? 64:44;
		$scope.currentTab = 'templates/question_detail.html';
		$scope.isAlready = false;
		$rootScope.QustionHide=false;
		$rootScope.enableSlide1=true;
		var pctype=document.getElementById("pctype").value;
		//查询保单列表
		var sendUrl = API_URL + "/app/apply/queryProblemList";
		var json = {"url":sendUrl, "parameters": {"prtNo": ''}};
		var dataLength = 0;
		$scope.loadReceiptList = function(json) {
			CommonFn.alertPopupFun($ionicPopup,'loading','加载中！...',0);
			httpRequestByGet(json, function (data) {
				Variables.alertPopup.close();
			//	console.log("请求成功"+data);
				var jsonObj = eval("("+data+")");
				//alert('jsonObj===='+JSON.stringify(jsonObj));
				if(0 == jsonObj.status.code){
				    $scope.insuranceList = jsonObj.jsonMap.list; 
				}else{
					if(!jsonObj.status.msg)
					{
						jsonObj.status.msg="没有数据";
					}
				   CommonFn.alertPopupFun($ionicPopup,'loser',jsonObj.status.msg,3000);
				}
			},function() {
				//alert('请求出错4');
				$timeout(function(){
					if(dataLength == 0){
						Variables.alertPopup.close();
						CommonFn.alertPopupFun($ionicPopup,'loser',"暂无网络请在有网的状态下进行操作!",1000);
					}
			    },10000);
			});
		}
		$scope.loadReceiptList(json);
		// 问卷搜索功能暂时后台没有
		// $scope.autocompleteFn = function (){
		// 	var autocompleteValue = document.getElementById("autocomplete").value;
		// 	var sendUrl = API_URL + "/app/apply/queryProblemList";
		// 	var json = {"url":sendUrl, "parameters": {"applyNo": autocompleteValue}};
		// 	$scope.loadReceiptList(json);
		// }
		$scope.clickQuestion = function (index,prtNo,code,prtSeq,manageCom,appntTel,insuredName){
				//pad端问题件列表遮罩层显示与隐藏
				if(pctype=='phone'){
					$rootScope.QustionHide=false;
				}else{
					$rootScope.QustionHide=true;
					$rootScope.enableSlide1=false;
				}		
				$rootScope.selectedRow = index;
				//alert(index+'phone');
				//查询保单列表
				var sendUrl = API_URL + "/app/apply/queryProblemDetails";
				var json = {"url":sendUrl, "parameters": {"prtNo": prtNo,"code": code,"appntTel":appntTel,"prtSeq": prtSeq,"manageCom": manageCom  }};
				var dataLength = 0;
				$scope.loadReceiptListDetail = function(json) {
					CommonFn.alertPopupFun($ionicPopup,'loading','加载中！...',0);
					httpRequestByGet(json, function (data) {
						Variables.alertPopup.close();
						var jsonObj = eval("("+data+")");
						if(0 == jsonObj.status.code){
							$scope.$apply(function(){
								questionObj.prtSeq=prtSeq;
								jsonObj.jsonMap.problemDetail[0].insuredname=insuredName;
								/*console.log("insuredName:"+insuredName);
								console.log(jsonObj.jsonMap.problemDetail[0]);*/
								questionObj.noticeDetail=jsonObj.jsonMap.problemDetail[0];
								var noticedetail=JSON.stringify(jsonObj.jsonMap.problemDetail[0]);
								storage.setItem('noticedetail'+prtSeq,noticedetail);
								loadQuestionData(questionObj,'2',$scope,$state,code,prtNo,manageCom,appntTel);
							})						    					
						}else{
						   	CommonFn.alertPopupFun($ionicPopup,'loser',jsonObj.status.msg,3000);
							$rootScope.QustionHide=false;
							$rootScope.enableSlide1=true;
						}  
						//alert('jsonObj==='+JSON.stringify(jsonObj));												
					},function() {
						//alert('请求出错');
						$timeout(function(){
							if(dataLength == 0){
								Variables.alertPopup.close();
								CommonFn.alertPopupFun($ionicPopup,'loser',"暂无网络请在有网的状态下进行操作!",1000);
							} 
					    },10000); 
					});					
				}
				$scope.loadReceiptListDetail(json);
		}
	})
/**核保通知书**/
.controller('UnderwirtingCtrl',function($stateParams,$http,$scope,$rootScope,$state,$ionicActionSheet,$ionicModal,$ionicPopup,$timeout,CommonFn,unFinshedInsurance,submitInsurance,Variables){	
	var prtSeq = $stateParams.prtSeq;   //合同号	
	var phone = $stateParams.appntTel;  //手机号
	var prtNo = $stateParams.prtNo;     //投保单号
	var manageCom = $stateParams.manageCom; //管理机构
	var code = $stateParams.code;       //通知书类型
	var detail= eval("("+storage.getItem('noticedetail'+prtSeq)+")");
	var agentcode = detail.agentcode;   //代理人编码
	var agentname = detail.agentname;   //业务员姓名
	var appntname = detail.appntname;   //投保人姓名
	var insuredname = detail.insuredname;//被保人姓名
	console.log("detail");
	console.log(detail);
	storage.setItem('data_code'+prtSeq,code);
	storage.setItem('data_phone'+prtSeq,phone);
	var lcquestionnaire=JSON.stringify(detail.lcquestionnaire);
	storage.setItem("prtSeq"+prtSeq,lcquestionnaire);
	//alert('合同号:'+prtSeq+"手机号:"+phone+'投保单号:'+prtNo+'管理机构:'+manageCom+'通知书类型:'+code);
	// loadQuestionData(questionObj,'1',$scope,$state,code,prtNo,manageCom);
	//alert('detail===='+detail);
	$scope.questionList=detail;
	$scope.tabs = brows().iphone ? 64:44;
	$scope.isAlready = false;
	var suffixName = ".png";//证件照片、电子签名照片后缀名
	$scope.signatureTab = 'templates/underwirting.html';
	if(code=='TB89'){
		$scope.hebaoFlag=true;
	}else if(code=='TB90'){
		$scope.hebaoFlag=false;
	}else if(code=='14'){
		$scope.Mtop=0;
		$scope.tabShow=true;
		$scope.signatureTab="templates/salesman_notice.html";
	}
	if($scope.questionList.changepolrow[0].changepolcol1!=" "){
		$scope.hasPlan=true;
	}
	$scope.underClickTab = function(book){
		if(book == 1){
			$scope.isAlready = false;
			$scope.ShowSignature=false;
		}else{
			$scope.isAlready = true;
			$scope.ShowSignature=true;
			document.getElementById("mobile").value = phone; 
			// $scope.signatureTab = 'templates/signature.html';
			// var replyJia=document.getElementById('replyJia').value;	
			// storage.setItem('replyJia'+prtSeq,replyJia);
			// var replyYi=document.getElementById('replyYi').value;
			// storage.setItem('replyYi'+prtSeq,replyYi);			
		}
	}	
	$scope.goQuestionWrite=function(){
		$state.go('question_menu.question_main',{'prtSeq':prtSeq});				
	}
	
	//关闭当前页面
	$scope.returnUp=function(){
		$rootScope.QustionHide=false;
		$rootScope.enableSlide1=true;
		$state.go('menu.question');
		if(code=='TB89'){ //核保甲回复内容
			var replyJia=document.getElementById('replyJia').value;	
			storage.setItem('replyJia'+prtSeq,replyJia);
		}else if(code=='TB90'){  //核保乙回复内容
			var replyYi=document.getElementById('replyYi').value;
			storage.setItem('replyYi'+prtSeq,replyYi);
		}else if(code=='14'){  //业务员回复内容
			var replySales=document.getElementById('replySales').value;
			storage.setItem('replySales'+prtSeq,replySales);
		}
	}
	$scope.submit_salesman=function(){//业务员提交方法
		var replySales=document.getElementById('replySales').value;
		if(!replySales){
			myAlert('请输入回复内容');
			return;
		}else{
			var noticedetail=storage.getItem('noticedetail'+prtSeq);
			var sendUrl = API_URL + "/app/apply/problemPieces";
			var json = {"url":sendUrl, "parameters": {'noticedetail':noticedetail,'replyresult': replySales,'prtno':prtNo,'prtSeq':prtSeq,'code':code,'managecom':manageCom,'agentcode':agentcode,'agentname':agentname,'appntname':appntname,'insuredname':insuredname}};
			/*console.log("业务员通知书："+JSON.stringify(json));
			return;*/
			loadingWait();
			httpRequestByPost(json, function (data) {
				closeLoadingWait();
				var jsonObj = eval("("+data+")");
				//alert('jsonObj==='+JSON.stringify(jsonObj));
				if(jsonObj){
					var code = jsonObj["status"].code;
					//alert('code==='+code);
		        	if('0' == code){   //成功		           	 	
		           	 	myAlert("问题件提交成功");
		           	 	//salestrue=true;
		           	 	$state.go('menu.question');
					}else{            //失败
						myAlert("问题件提交失败");
						//salestrue=false;
					}
				}
			});
		}
	} 

	//下面为电子签名和问题件影像件的校验和保存，以及回显  add by renxiaomin 2016.10.26
	//查询影像录入数据进行回显
	$scope.preload=function(){
		//回复内容的赋值
		code=='14'?	document.getElementById('replySales').value=storage.getItem('replySales'+prtSeq):
		code=='TB89'?document.getElementById('replyJia').value=storage.getItem('replyJia'+prtSeq):
		document.getElementById('replyYi').value=storage.getItem('replyYi'+prtSeq);	
		if(!$scope.isAlready){
			var fromBf_Sql= {
				"databaseName": Variables.dataBaseName,
				"tableName": "T_QUESTION_PIECES",
				"conditions": {"PRT_SEQ": prtSeq}
			};
			//alert('影像件进行回显'+prtSeq);
			var PatientHtml=document.getElementById('Patient');
			var OtherpatientHtml=document.getElementById('OtherPatient');
			var PatientDatas="";
			var OthersDatas="";
			queryTableDataByConditions(fromBf_Sql, function (data) { //请求数据库
				if(data){
					$scope.$apply(function(){
						for(var i = 0; i < data.length; i++){
							var PatientData=data[i];
							var OthersData=data[i];
							PatientDatas=PatientData['PARIENT'];
							OthersDatas=OthersData['OTHER_PARIENT'];														
						}
						if(PatientDatas==null || PatientDatas==undefined || PatientDatas==""){
							PatientDatas="";							
						}
						if(OthersDatas==null || OthersDatas=="" || OthersDatas==undefined){
							OthersDatas="";
						}
						var PatientDataes=PatientDatas.split(",");							
						var OthersDataes=OthersDatas.split(",");
						if(!PatientDataes.length==0 && !PatientDatas==""){
							for(var j = 0; j < PatientDataes.length; j++){
								var patient_html ='';
					          	patient_html+='<li>';
								patient_html+='<img src="'+PatientDataes[j]+'" />';
								patient_html+='</li>'; 
					          	PatientHtml.innerHTML = PatientHtml.innerHTML+patient_html;
							}
						}
						if(!OthersDataes.length==0 && !OthersDatas==""){
							for(var k = 0; k < OthersDataes.length; k++){
								var otherpatient_html ='';
					          	otherpatient_html+='<li>';
								otherpatient_html+='<img src="'+OthersDataes[k]+'" />';
								otherpatient_html+='</li>'; 
					          	OtherpatientHtml.innerHTML =OtherpatientHtml.innerHTML+otherpatient_html;
							}
						}
					});
				}
			});
		}
	}//回显方法完毕

	//签名页的相关信息控制  add by renxiaomin 2016.10.19
	/*发送获取手机验证码*/ 
	$scope.sendMobile = function (){
		indexHour = 180;
		var mobile =document.getElementById("mobile").value;
		//var mobile='18321906858';
		if(!mobile){
		 	myAlert("请输入手机号码!");
		}else{
		 	var sendUrl = API_URL + "/app/apply/getAuthCode";
			var json = {"url":sendUrl, "parameters": {"phone": mobile}};
			httpRequestByPost(json, function (data){
				var jsonObj = eval("("+data+")");
				if(jsonObj){
					var code = jsonObj["status"].code;
					if('0' == code){ //短信发送成功 
						whileThridHoursProblem(); //3分钟倒计时控制
					}else if('3' == code){
						myAlert('您的手机号码已获取过验证码，请在3分钟内不要重复操作！');
					}else{
						myAlert('签名验证码短信息发送失败，请重新获取。若长时间如此，请联系管理员处理！');
					}
				}
			});
		}
	};
	/*电子签名插件*/
	var signInsurnoticeList = new Array();
	var signApplyList = new Array();
	$scope.signMarkFn = function(type,tableID,contentID){
		//当前的保单ID
		var GatherJson = {"applicantName":$scope.questionList.appntname,"applicantIdno":$scope.questionList.appntidno,"recognizeeName":$scope.questionList.insuredname,"recognizeeIdno":$scope.questionList.insuredidno};
		var currentInsuranceId = prtSeq;
		var json = {"tableID":tableID,"applyID":currentInsuranceId,"ContentID":contentID,"GatherJson" : GatherJson};  
        //alert("签名。json.applyID:"+json.applyID);
		doSignature(json,function(str){
			//alert("str++"+str)
			//重置高度
			document.getElementById("content_signature").style.height ="100%"; 
			if(str){
		  		var signObj = eval("("+str+")");
	  			if(signObj){
					if('2' == type){//投保人签名
  			    		document.getElementById("tow_sign_button").style.display ="none";//按钮隐藏显示图片
		  			    document.getElementById("two_people_photo").style.display ="block";
		  			    document.getElementById("two_sign_photo").style.display ="block";
		  			    document.getElementById("two_sign_photo_bak").style.display="none";
		  				var photoPath = signObj["photoPath"]+"?"+Math.random();
		  				var signaturePath = signObj["signaturePath"]+"?"+Math.random();
		  				document.getElementById("two_people_photo").src =photoPath;
		  				document.getElementById("two_sign_photo").src =signaturePath;
						signMap["2_24_people_photo"] = signObj["photoPath"]; //投保人相片url
		  				signMap["2_24_sign_photo"]  = signObj["signaturePath"];//投保人签名的URL
		  				signApplyList.push(signObj["photoPath"]);
		  				signApplyList.push(signObj["signaturePath"]);
	  			    }else if('3' == type){ //被保人签名
  			    		document.getElementById("regin_button").style.display ="none";//按钮隐藏显示图片
		  			    document.getElementById("two_recgin_photo").style.display ="block";
		  			    document.getElementById("two_resign_photo").style.display ="block";
		  			    document.getElementById("two_sign_photo_bak").style.display="none";
		  			    
		  				var photoPath = signObj["photoPath"]+"?"+Math.random();
		  				var signaturePath = signObj["signaturePath"]+"?"+Math.random();
		  				
		  				document.getElementById("two_recgin_photo").src =photoPath;
		  				document.getElementById("two_resign_photo").src =signaturePath; 
		  				
						signMap["3_25_people_photo"] = signObj["photoPath"]; //被保人相片url
		  				signMap["3_25_sign_photo"]  = signObj["signaturePath"];//被保人签名的URL

		  				signApplyList.push(signObj["photoPath"]);
		  				signApplyList.push(signObj["signaturePath"]);
	  			    }
	  			}
		  	}else{
		  		myAlert("插件调用失败，请重新尝试。若多次尝试后仍然如此，请联系相关人员处理！");
		  	}
		},function(){
			myAlert("失败");
		});
	}
	//提交校验保存手机号码和签名照片
	$scope.submit_signature = function(){
		/*验证短信验证码*/
		var mobile = document.getElementById("mobile").value; 
		//var mobile='18321906858';
		var smsCode = document.getElementById("smsCode").value;
		if(!mobile || !smsCode){
		 	myAlert("请输入手机号码或短信验证码!"); 
		 	return;
		}
		/**********************************验证码校验写在后台*********************************/
		//else{
 	    //		document.getElementById("smsCode").value ="";
		//  	var sendUrl = API_URL + "/app/apply/checkAuthCode";
		//  	var json = {"url":sendUrl, "parameters": {"phone": mobile,"authCode":smsCode}};
		//  	//alert(mobile + "--" + smsCode + "--" +agentCode)
		//  	httpRequestByPost(json, function (data) {
		//  	//alert("提交data:"+data);
		//  		var jsonObj = eval("("+data+")"); 
		//  		if(jsonObj){
		//  			var code = jsonObj["status"].code;
		//             	if('0' == code){//验证成功
		//             	 	isPassSign = true;
		//             	 	indexHour = 0;
		//             	 	//alert("短信验证成功"+isPassSign);
		//  			}else{ //验证失败 
		//  				isPassSign = false; 
		//  				myAlert("短信验证码输入有误,请重新输入!");
		//  			}	
		//  		}
		//  	});
		//  }
	   /**********************************验证码校验写在后台******************************/
		// 以上为验证码的提交
		//以下是电子签名的的校验和提交 -------
		// 电子签名需要验证影像件是否全部录入
		var tow_sign_button = document.getElementById("tow_sign_button").style.display;
		var regin_button = document.getElementById("regin_button").style.display;
		if(tow_sign_button!='none' || regin_button!='none'){
			CommonFn.alertPopupFun($ionicPopup,'loser','请完成电子签名！',1000);
			return;
		}
		//电子签名提交数据所需的参数
		var sendUrl = API_URL + "/app/apply/problemPieces";
		var json = {"url":sendUrl, "parameters": {
			"signApplyList": signApplyList.join(","),
			"printno" : prtNo, //投保单号
			"code" : code, //通知书类型
			"prtSeq" : prtSeq, //通知书号
			"manageCom" : manageCom //管理机构
			}
		};
		$scope.sign_submit_http = function(json){
			//alert("2->>"+signApplyList);
			getEncFile_problem(function(data){  //生成签名包
				if(data){
					var returnEncFileJson=eval("("+data+")");
					//alert("5-->>"+JSON.stringify(data));
					//电子签名中图片URL和加密包的字符串参数
					var signApplyParameter = signApplyList.join(",");
					signApplyParameter = signApplyParameter + "," + returnEncFileJson["problemEncodePath"];
					//alert("6-->>"+signApplyParameter);
					//将电子签名中的图片URL存入提交保单的参数中
					json["parameters"]["signApplyList"] = signApplyParameter;
					//alert("7-->>"+json["parameters"]["signApplyList"]);
				}
				//signature=true;
			},function(error){
				//signature=false;
				if(error==null){
					myAlert("电子签名未填写完整！");
				}else{
					// myAlert("getEncFile插件错误信息："+error);
					myAlert("插件调用失败，请重新尝试。若多次尝试后仍然如此，请联系相关人员处理！");
				}
			});
		}
		
		$scope.sign_submit_http(json);     //自调签名提交
		var noticedetail=storage.getItem('noticedetail'+prtSeq);//通知书json
		//var sendUrl = API_URL + "/app/apply/problemPieces";
		if(code=='TB89'){  //核保通知书甲
			//var replyText=storage.getItem('replyJia'+prtSeq);
			var replyText=document.getElementById('replyJia').value;
			var questionpiecedetail={      //核保通知书甲问题件json为固定
				"problempieces_01":false,"problempieces_02":false,
				"problempieces_03":false,"problempieces_04":false,
				"problempieces_05":false,"problempieces_06":false,
				"problempieces_07":false,"problempieces_08":false,
				"problempieces_09":false,"problempieces_10":false,
				"problempieces_11":false,"problempieces_12":false,
				"problempieces_13":false,"problempieces_14":false,
				"problempieces_15":false,"problempieces_16":false,
				"problempieces_17":false,"problempieces_18":false,
				"problempieces_19":false,"problempieces_20":false,
				"problempieces_21":false,"problempieces_22":false,
				"problempieces_23":false,"problempieces_24":false,
				"problempieces_25":false,"problempieces_36":false,
				"problempieces_37":false,"problempieces_26":false,
				"problempieces_27":false,"problempieces_28":false,
				"problempieces_29":false,"problempieces_30":false,
				"problempieces_31":false,"problempieces_32":false,
				"problempieces_33":false,"problempieces_34":false,
				"problempieces_35":false
			};
			json['parameters']['questionpiecedetail'] = questionpiecedetail;
			json['parameters']['noticedetail'] = noticedetail;
			json['parameters']['replyresult'] = replyText;
			json['parameters']['agentcode'] = agentcode;
			json['parameters']['agentname'] = agentname;
			json['parameters']['appntname'] = appntname;
			json['parameters']['insuredname'] = insuredname;

			json['parameters']['mobile'] = mobile;
			json['parameters']['smsCode'] = smsCode;
		}else if(code=='TB90'){  //核保通知书乙
			//var replyText=storage.getItem('replyYi'+prtSeq);
			var replyText=document.getElementById('replyYi').value;
			var questionpiecedetail=storage.getItem("questionnaire_data"+prtSeq);//问题件json
			var lcquestionnaire=storage.getItem("prtSeq"+prtSeq);
			lcquestionnaire=eval("("+lcquestionnaire+")");

			/*if(lcquestionnaire.length > 0 && questionpiecedetail == null){//有默认勾选项但没有填写
				myAlert('问卷不能为空,请点击问卷调查按钮前去填写');
				return;
			}else if(lcquestionnaire.length==0 && questionpiecedetail == null){//没有默认勾选项,问题件json	为固定*/

				var questionpiecedetail={
					"problempieces_01":false,"problempieces_02":false,
					"problempieces_03":false,"problempieces_04":false,
					"problempieces_05":false,"problempieces_06":false,
					"problempieces_07":false,"problempieces_08":false,
					"problempieces_09":false,"problempieces_10":false,
					"problempieces_11":false,"problempieces_12":false,
					"problempieces_13":false,"problempieces_14":false,
					"problempieces_15":false,"problempieces_16":false,
					"problempieces_17":false,"problempieces_18":false,
					"problempieces_19":false,"problempieces_20":false,
					"problempieces_21":false,"problempieces_22":false,
					"problempieces_23":false,"problempieces_24":false,
					"problempieces_25":false,"problempieces_36":false,
					"problempieces_37":false,"problempieces_26":false,
					"problempieces_27":false,"problempieces_28":false,
					"problempieces_29":false,"problempieces_30":false,
					"problempieces_31":false,"problempieces_32":false,
					"problempieces_33":false,"problempieces_34":false,
					"problempieces_35":false
				}
			/*}*/
			json['parameters']['questionpiecedetail'] = questionpiecedetail;
			json['parameters']['noticedetail'] = noticedetail;
			json['parameters']['replyresult'] = replyText;

			json['parameters']['agentcode'] = agentcode;
			json['parameters']['agentname'] = agentname;
			json['parameters']['appntname'] = appntname;
			json['parameters']['insuredname'] = insuredname;

			json['parameters']['mobile'] = mobile;
			json['parameters']['smsCode'] = smsCode;

			var fromBf_Sql= {
				"databaseName": Variables.dataBaseName,
				"tableName": "T_QUESTION_PIECES",
				"conditions": {"PRT_SEQ": prtSeq}
			};
			//病例资料和其它资料
			queryTableDataByConditions(fromBf_Sql, function (data) {
				var parientImg = '';
				var otherparientImg = '';
				if(data){
					for(var i = 0; i < data.length; i++){
						var PatientData=data[i];
						var OthersData=data[i];
						parientImg=PatientData['PARIENT'];
						otherparientImg=OthersData['OTHER_PARIENT'];
					}
				} 
				json['parameters']['parientImg'] = parientImg;
				json['parameters']['otherparientImg'] = otherparientImg;
			})			
		}
		//alert("json===="+JSON.stringify(json));
		myConfirm('提示','请您仔细查看您的资料信息是否录入齐全，如否请返回填写！',function(){
			cancelMyConfirm();
			loadingWait();

			/*console.log("问题件数据######:"+JSON.stringify(json));
			return;*/

			httpRequestByPost(json,function (data){
				closeLoadingWait();
				var jsonObj = eval("("+data+")");
				//alert('jsonObj===='+JSON.stringify(jsonObj));
				if(jsonObj){
					var code = jsonObj["status"].code;
					//alert('code==='+code);
			        if('0' == code){ 	//成功 
			           	myAlert("问题件提交成功");
			           	$rootScope.QustionHide=false;
						$rootScope.enableSlide1=true;
			           	$state.go('menu.question');
					}else if('1'==code){
						myAlert("短信验证码输入有误,请重新输入!")
					}else{		 	//失败						
						myAlert("问题件提交失败");
					}
				}
			});
		});
	} //提交方法end

	/* 影像录入*/
	$scope.goAction = function ($event,po) { //po表示病历资料和其它资料的id
		//alert('影像录入中prtSeq:'+prtSeq);
		var photoUrl = po + prtSeq +suffixName;
		getPhotoFromCamera1(photoUrl,function (imageURL){
			//alert("imageURL:"+imageURL);
			//alert('photoUrl:'+photoUrl);
			var PatientHtml=document.getElementById('Patient');
			var OtherpatientHtml=document.getElementById('OtherPatient');
				if (po == 'patient_data') {
					//病例资料
					$scope.$apply(function () {
						var patient_html ='';
			          	patient_html+='<li>';
						patient_html+='<img src="'+imageURL+'" />';
						patient_html+='</li>'; 
			          	PatientHtml.innerHTML = PatientHtml.innerHTML+patient_html;
					})
					var patients=document.getElementById('Patient').querySelectorAll('li');	
					//alert('patients.length------'+patients.length);
					var TotalImgurl='';
					for(var i=0; i<patients.length; i++){
						var Imgurl=patients[i].querySelector('img').getAttribute("src");
						TotalImgurl = TotalImgurl + Imgurl+',';
						//alert('拼后的路径'+TotalImgurl);
					}
					TotalImgurl=TotalImgurl.substr(0,TotalImgurl.length-1);
				}else{
					//其他资料
					$scope.$apply(function () {
						var otherpatient_html ='';
			          	otherpatient_html+='<li>';
						otherpatient_html+='<img src="'+imageURL+'" />';
						otherpatient_html+='</li>';
			          	OtherpatientHtml.innerHTML =OtherpatientHtml.innerHTML+otherpatient_html;  
					})
					var otherpatients=document.getElementById('OtherPatient').querySelectorAll('li');	
					//alert('otherpatients.length------'+otherpatients.length);	
					var OtherTotalImgurl='';
					for(var i=0; i<otherpatients.length; i++){
						var Imgurl=otherpatients[i].querySelector('img').getAttribute("src");
						OtherTotalImgurl = OtherTotalImgurl + Imgurl+',';
						//alert('拼后的路径'+OtherTotalImgurl);
					}
					OtherTotalImgurl=OtherTotalImgurl.substr(0,OtherTotalImgurl.length-1);
				}
				//拍照实时保存
				$scope.saveCardImage(TotalImgurl,OtherTotalImgurl);
			}, function () { 
        			myAlert('调用相机失败!');
				});
	} 

	//拍照实时保存方法
	$scope.saveCardImage = function(TotalImgurl,OtherTotalImgurl){
		var prtseq = $stateParams.prtSeq;
		var conditionArray = new Array(); //把印刷号放过来
		var dataArray = new Array();  //把img路径放过来
		var tempCondition = new Object(); //放印刷号
		var tempData = new Object();  //放img路径
		tempCondition["PRT_SEQ"] = prtseq;
		tempData["PARIENT"] = TotalImgurl; //病历资料
		tempData["OTHER_PARIENT"] = OtherTotalImgurl; //其他资料
		conditionArray.push(tempCondition);
		dataArray.push(tempData);
		//alert('保存方法中的最终TotalImgurl:-------'+TotalImgurl);
		//alert('保存方法中的最终OtherTotalImgurl:-----'+OtherTotalImgurl);
		for(var i = 0 ; i < conditionArray.length ; i++){
			var tempCondition = conditionArray[i];
			var tempData = dataArray[i];
			if(!(TotalImgurl=='') && !(TotalImgurl==undefined)){
				var updateCardImageKey = {
					"databaseName":Variables.dataBaseName,
					"sql": "update t_question_pieces set PARIENT='"+tempData.PARIENT+"' where PRT_SEQ = '"+tempCondition.PRT_SEQ+"'"
				};
			}else{
				var updateCardImageKey = {
					"databaseName":Variables.dataBaseName,
					"sql": "update t_question_pieces set OTHER_PARIENT='"+tempData.OTHER_PARIENT+"' where PRT_SEQ = '"+tempCondition.PRT_SEQ+"'"
				};
			} 
			executeUpdateSql(updateCardImageKey,function(data){
				if (data) {
					myAlert('影像件上传成功');
					return true;
				}else{
					myAlert('影像件上传失败');
					return false;
				}
			});
		}
	}   //保存方法完毕
})	
/*问题卷左侧菜单栏 add by wangzj */
.controller('QuestionMenuCtrl',function($scope,$compile,$stateParams,$ionicScrollDelegate,$state,$timeout,readyLoad,QuestionInit){
    $scope.resetPage = function(){
        $ionicScrollDelegate.resize();
    }
    $scope.question_names = [
        {id:"div_problempieces_01",value:"H001",name:"残疾问卷"},
        {id:"div_problempieces_02",value:"H002",name:"癫痫问卷"},
        {id:"div_problempieces_03",value:"H003",name:"肝脏疾病或乙肝病毒携带问卷"},
        {id:"div_problempieces_04",value:"H004",name:"高血压问卷"},
        {id:"div_problempieces_05",value:"H005",name:"呼吸系统疾病问卷"},
        {id:"div_problempieces_06",value:"H006",name:"甲状腺疾病问卷"},
        {id:"div_problempieces_07",value:"H007",name:"颈腰椎疾病问卷"},
        {id:"div_problempieces_08",value:"H008",name:"泌尿系统结石问卷"},
        {id:"div_problempieces_09",value:"H009",name:"尿检异常问卷"},
        {id:"div_problempieces_10",value:"H010",name:"女性健康问卷"},
        {id:"div_problempieces_11",value:"H011",name:"贫血问卷"},
        {id:"div_problempieces_12",value:"H012",name:"乳腺疾病问卷"},
        {id:"div_problempieces_13",value:"H013",name:"视力问卷"},
        {id:"div_problempieces_14",value:"H014",name:"受伤问卷"},
        {id:"div_problempieces_15",value:"H015",name:"糖尿病问卷"},
        {id:"div_problempieces_16",value:"H016",name:"特别健康问卷"},
        {id:"div_problempieces_17",value:"H017",name:"听力问卷"},
        {id:"div_problempieces_18",value:"H018",name:"痛风及血尿酸值异常问卷"},
        {id:"div_problempieces_19",value:"H019",name:"消化系统疾病问卷"},
        {id:"div_problempieces_20",value:"H020",name:"哮喘问卷"},
        {id:"div_problempieces_21",value:"H021",name:"心脏疾病问卷"},
        {id:"div_problempieces_22",value:"H022",name:"心脏结构疾病问卷"},
        {id:"div_problempieces_23",value:"H023",name:"胸痛问卷"},
        {id:"div_problempieces_24",value:"H024",name:"婴幼儿健康状况问卷"},
        {id:"div_problempieces_25",value:"H025",name:"肿瘤问卷"},
        {id:"div_problempieces_36",value:"H026",name:"补充告知问卷（被保人）"},
        {id:"div_problempieces_37",value:"O012",name:"补充告知问卷（投保人）"},
        {id:"div_problempieces_26",value:"F001",name:"财务问卷"},
        {id:"div_problempieces_27",value:"O001",name:"出国人员问卷"},
        {id:"div_problempieces_28",value:"O002",name:"机动车驾驶执照持有者问卷"},
        {id:"div_problempieces_29",value:"O003",name:"赛车问卷"},
        {id:"div_problempieces_30",value:"O004",name:"危险职业问卷"},
        {id:"div_problempieces_31",value:"O005",name:"跳伞问卷"},
        {id:"div_problempieces_32",value:"O006",name:"爬山问卷"},
        {id:"div_problempieces_33",value:"O007",name:"危险运动问卷"},
        {id:"div_problempieces_34",value:"O008",name:"海运问卷"},
        {id:"div_problempieces_35",value:"O010",name:"航空问卷"},
		{id:"div_problempieces_38",value:"O038",name:"关节炎问卷"},
		{id:"div_problempieces_39",value:"O039",name:"肾脏和泌尿系统疾病调查问卷"}
    ]
    // 合同书号prtseq
    var prtSeq = $stateParams.prtSeq;
    var noticeDetail = window.localStorage.setItem("prtSeq", prtSeq);
    // 服务器锁死的问卷
    var noticeDetail= window.localStorage.getItem("prtSeq"+prtSeq);

    noticeDetail = '{"lcquestionnaire":'+noticeDetail+'}';
    // 本地存储 null
    var piecesDetail = window.localStorage.getItem("questionnaire_data"+prtSeq);
    //console.log('piecesDetail===='+piecesDetail);
    //alert('合同书号prtseq：'+prtSeq+'服务器锁死的问卷prtseq:'+noticeDetail+'本地存储questionnaire_data:'+piecesDetail);
    // 测试over
    $timeout(function() {
        //初始化数据
        if (noticeDetail && piecesDetail) {
            readyLoad(0,noticeDetail,piecesDetail);
        }else if (noticeDetail){
            readyLoad(1,noticeDetail,'');
        }else if (piecesDetail){
            readyLoad(0,'',piecesDetail);
        }
    });
    // 左侧复选框绑定事件
    $scope.testLoadCotent = function(event){
        var currentElement = event.target;
        var xmlId = currentElement.id.substring(4);
        if(currentElement.checked){
            // var impartXmlpath = "xml/"+xmlId+".xml";
            var xmlId = xmlId.substring(14);
            var impartXmlpath = "xml/problempieces_"+xmlId+".xml";
            var impartDivId = "question1_test";
            $scope.loadImpartContent(impartXmlpath,impartDivId);
        }else{
            var divId = xmlId;
            // document.getElementById(divId).style.display = "none";
            var divNode = document.getElementById(divId);
            divNode.parentNode.removeChild(divNode);
        }
        // 初始显示隐藏
        var isuranc_sex = '';
        var isuranc_age = '';
        var appnt_sex = '';
        var appnt_age = '';
        QuestionInit(isuranc_sex,isuranc_age,appnt_sex,appnt_age);
    }
    // 解析XML内容到HTML页面
    $scope.loadImpartContent = function (impartXmlpath, impartDivId) {
        var allInnerHTML = '';
        var applicant_know = asyncQuestionRuleByXml(impartXmlpath);
        var txt = $compile(applicant_know)($scope);
        var impartDiv = document.getElementById(impartDivId);
        angular.element(impartDiv).append(txt);
    }
    //返回按钮
    $scope.gohomeFun = function (){
        var detailJson=eval("("+window.localStorage.getItem('noticedetail'+prtSeq)+")");
        var appntTel=window.localStorage.getItem('data_phone'+prtSeq);
        var code=window.localStorage.getItem('data_code'+prtSeq);
        var agentname=detailJson.agentname;
        var agentcode=detailJson.agentcode;
        var appntname=detailJson.appntname;
        var insuredname=detailJson.insuredname;
        var prtNo=detailJson.prtno;
        var manageCom=detailJson.managecom;
        var pctype = document.getElementById("pctype").value;

		//console.log("问题件数据："+JSON.stringify(questionObj));

		if(pctype == '' || pctype == 'pad'){
			$state.go('menu.question.underwirting',{'prtSeq':questionObj.prtSeq,'appntTel':appntTel,'code':code,'prtNo':prtNo,'manageCom':manageCom});
		}else{//手机版的此后页面全部横屏
			$state.go('underwirting',{'prtSeq':questionObj.prtSeq,'appntTel':appntTel,'code':code,'prtNo':prtNo,'manageCom':manageCom});
		}
	}
})
/*问题卷主页面 add by wangzj*/
.controller('QuestionMainCtrl',function($scope, $timeout, $state){
	//残疾问卷
	// $('#problemPieces_01 input').live('click', function(){
 		//var isCheck = $(this).attr("checked");
        //var id = $(this).attr("id");
        //if(isCheck && id=="A_1_6_yes"){
        	//$('input[id=A_1_6_yes]').attr('donotcheckyes','yes');
        //}
	// }
    // 听力问卷
    $('#problempieces_17 input').live('click', function(){
        var isCheck = $(this).attr("checked");
        var id = $(this).attr("id");
        //听力问卷先天性，后天性区别选项
        if(isCheck && id=="A_17_3_b"){
            $('input[id^=A_17_3_0]').attr('disabled',false);
        }
        if(isCheck && id=="A_17_3_a"){
            $('input[id^=A_17_3_0]').attr('disabled',true);
            $('input[id^=A_17_3_0]').attr('checked',false);
        }
    });
    //高血压问卷
    $('#problempieces_04 input').live('click', function(){
     	var isCheck = $(this).attr("checked");
        var id = $(this).attr("id");
        if(isCheck && id=='A_4_11_no'){
            $('input[id^=A_4_11_0]').attr('disabled',true);
        }else if(isCheck && id=='A_4_11_yes'){
        	$('input[id^=A_4_11_0]').attr('disabled',false);
        }
    });
    //甲状腺疾病
    $('#problempieces_06 input').live('click', function(){
     	var isCheck = $(this).attr("checked");
        var id = $(this).attr("id");
        if(isCheck && id=='A_6_3_no'){
            $('input[id^=A_6_3_0]').attr('disabled',true);
        }else if(isCheck && id=='A_6_3_yes'){
        	$('input[id^=A_6_3_0]').attr('disabled',false);
        }
    });
    //颈椎疾病
    $('#problempieces_07 input').live('click', function(){
     	var isCheck = $(this).attr("checked");
        var id = $(this).attr("id");
        if(isCheck && id=='A_7_7_no'){
            $('input[id^=A_7_7_0]').attr('disabled',true);
        }else if(isCheck && id=='A_7_7_yes'){
        	$('input[id^=A_7_7_0]').attr('disabled',false);
        }
    });
    // 视力问卷
	$("#problempieces_13 #A_13_2_a").live("click",function()
	{
		$("#problempieces_13 tbody tr").eq(1).find("input").val("");
		$("#problempieces_13 tbody tr").eq(1).find("input").attr("disabled","disabled");
		$("#A_13_2_a").removeAttr("disabled");
		$("#A_13_2_b").removeAttr("disabled");
		$("#problempieces_13 tbody tr").eq(1).find("input[type=checkbox]").removeAttr("checked");


	});
	$("#problempieces_13 #A_13_2_b").live("click",function()
	{
		$("#problempieces_13 tbody tr").eq(1).find("input").removeAttr("disabled");
	});

    $('#problempieces_13 input').live('click', function(){
        var isCheck = $(this).attr("checked");
        var id = $(this).attr("id");
        // 左眼、右眼区别选项
        if(isCheck){
            if (id=="A_13_1_a" || id=="A_13_1_b" || id=="A_13_1_c" || id=="A_13_1_d") {
                $('input[id=A_13_1_a]').attr('checked',false);
                $('input[id=A_13_1_b]').attr('checked',false);
                $('input[id=A_13_1_c]').attr('checked',false);
                $('input[id=A_13_1_d]').attr('checked',false);
                $('input[id='+id+']').attr('checked',true);
            }
            if (id=="A_13_1_e" || id=="A_13_1_f" || id=="A_13_1_g" || id=="A_13_1_h") {
                $('input[id=A_13_1_e]').attr('checked',false);
                $('input[id=A_13_1_f]').attr('checked',false);
                $('input[id=A_13_1_g]').attr('checked',false);
                $('input[id=A_13_1_h]').attr('checked',false);
                $('input[id='+id+']').attr('checked',true);
            }
        }
        if(isCheck || $(this).val() != 'on' ){
            $('input[id=A_13_1_06]').attr('allowSave',false);
        }else{
            $('input[id=A_13_1_06]').attr('allowSave',true);
        }
    });
    // 肝脏疾病问卷
    $('#problempieces_03 input').live('click', function(){
        var isCheck = $(this).attr("checked");
        var id = $(this).attr("id");
        // 肝炎
        if(isCheck && id=="A_3_1_a"){
            // alert('fd')
            $('input[id^=A_3_2_]').attr('allowSave',true);
        }else if(!isCheck && id=="A_3_1_a"){
            $('input[id^=A_3_2_]').attr('allowSave',false);
        }
        // 乙肝
        if(isCheck && id=="A_3_2_b"){
            $('input[id^=A_3_3_]').attr('allowSave',true);
        }else if(!isCheck && id=="A_3_2_b"){
            $('input[id^=A_3_3_]').attr('allowSave',false);
        } 
        //第六题 
        if(isCheck && id=='A_3_6_no'){
            $('input[id^=A_3_6_0]').attr('disabled',true);
        }else if(isCheck && id=='A_3_6_yes'){
        	$('input[id^=A_3_6_0]').attr('disabled',false);
        }
        //第七题
        if(isCheck && id=='A_3_7_no'){
        	$('input[id^=A_3_7_0]').attr('disabled',true);
        }else if(isCheck && id=='A_3_7_yes'){
        	$('input[id^=A_3_7_0]').attr('disabled',false);
        }
    });
    // 婴幼儿健康状况问卷
    $('#problempieces_24 input').live('click', function(){
        var isCheck = $(this).attr("checked");
        var id = $(this).attr("id");
        // 非自然分娩：
        if(isCheck && id=="A_24_1_2_yes"){
            // (2)
            $('#problempieces_24 label[for^=A_24_1_2_0]').show();
            $('#problempieces_24 span[key^=A_24_1_2_0]').show();
            // (3)
            $('#problempieces_24 label[for^=A_24_1_3_]').show();
            $('#problempieces_24 span[key^=A_24_1_3_]').show();
        }else if(isCheck && id=="A_24_1_2_no"){
            // (2)
            $('#problempieces_24 label[for^=A_24_1_2_0]').hide();
            $('#problempieces_24 span[key^=A_24_1_2_0]').hide();
            $('#problempieces_24 input[id^=A_24_1_2_0]').attr('checked',false);
            // (3)
            $('#problempieces_24 label[for^=A_24_1_3_]').hide();
            $('#problempieces_24 span[key^=A_24_1_3_]').hide();
            $('#problempieces_24 input[id^=A_24_1_3_]').attr('checked',false);
        }
        // 问题1（3）如已勾选，不再校验并提示“1（1）-1（8）有回答是，请说明”。
        if(isCheck && id.indexOf('A_24_1_3_') != '-1'){
            $('input[id=A_24_1_4_yes]').attr('donotcheckyes',"yes");
            $('input[id=A_24_1_5_yes]').attr('donotcheckyes',"yes");
            $('input[id=A_24_1_6_yes]').attr('donotcheckyes',"yes");
            $('input[id=A_24_1_7_yes]').attr('donotcheckyes',"yes");
            $('input[id=A_24_1_8_yes]').attr('donotcheckyes',"yes");
        }
    });
    // 出国人员问卷
    $('#problempieces_27 input').live('click', function(){
        var isCheck = $(this).attr("checked");
        var id = $(this).attr("id");
        // 工作派遣
        if(isCheck && id=="C_9_2_i"){
            $('input[id=C_9_3_job_title]').attr('allowSave',true);
            $('input[id=C_9_3_content]').attr('allowSave',true);
        }else if(!isCheck && id=="C_9_2_i"){
            $('input[id=C_9_3_job_title]').attr('allowSave',false);
            $('input[id=C_9_3_content]').attr('allowSave',false);
        }   
    });
    // 初始显示隐藏
    $timeout(function() {
        // 肝脏疾病问卷 第6、7题
        $('#div_A_3_6_').show();
        $('#div_A_3_7_').show();
        //高血压问卷    第11题
        $('#div_A_4_11_').show();
        //甲状腺问卷    第3题
        $('#div_A_6_3_').show();
        //劲椎疾病问卷  第7、10题
        $('#div_A_7_7_').show();
        $('#div_A_7_10_').show();
        // 机动车驾驶执照持有者问卷 // 点击右
        $('#div_C_6_4_').show();
    });
    // 婴幼儿健康状况问卷
    $timeout(function() {
        // 婴幼儿健康状况问卷(2)
        $('#problempieces_24 label[for^=A_24_1_2_0]').hide();
        $('#problempieces_24 span[key^=A_24_1_2_0]').hide();
        // 婴幼儿健康状况问卷(3)
        $('#problempieces_24 label[for^=A_24_1_3_]').hide();
        $('#problempieces_24 span[key^=A_24_1_3_]').hide();
    });
    // 补充告知问卷（被保人）
    // 被保人 年龄isuranc_age：
    var isuranc_age = 3;
    var isuranc_sex = '女';
    $timeout(function() {
        if (isuranc_age >= 14 && isuranc_sex == '女' ) {
            $('input[id=E_26_11_a_yes1]').attr('permission_empty',"no");
            $('input[id=E_26_11_a_no1]').attr('permission_empty',"no");
            $('input[id=E_26_11_b_yes1]').attr('permission_empty',"no");
            $('input[id=E_26_11_b_no1]').attr('permission_empty',"no");
            // 12题
            $('input[id=E_26_12_01]').attr('allowSave',"false");
            $('input[id=E_26_12_02]').attr('allowSave',"false");
            $('input[id=E_26_12_b_yes1]').attr('permission_empty',"yes");
            $('input[id=E_26_12_b_no1]').attr('permission_empty',"yes");
        }else if(isuranc_age <= 2){
            $('input[id=E_26_11_a_yes1]').attr('permission_empty',"yes");
            $('input[id=E_26_11_a_no1]').attr('permission_empty',"yes");
            $('input[id=E_26_11_b_yes1]').attr('permission_empty',"yes");
            $('input[id=E_26_11_b_no1]').attr('permission_empty',"yes");
            // 12题
            $('input[id=E_26_12_01]').attr('permission_empty',"no");
            $('input[id=E_26_12_02]').attr('permission_empty',"no");
            $('input[id=E_26_12_b_yes1]').attr('permission_empty',"no");
            $('input[id=E_26_12_b_no1]').attr('permission_empty',"no");
        }else{
            // 11题
            $('input[id=E_26_11_a_yes1]').attr('permission_empty',"yes");
            $('input[id=E_26_11_a_no1]').attr('permission_empty',"yes");
            $('input[id=E_26_11_b_yes1]').attr('permission_empty',"yes");
            $('input[id=E_26_11_b_no1]').attr('permission_empty',"yes");
            // 12题
            $('input[id=E_26_12_01]').attr('allowSave',"false");
            $('input[id=E_26_12_02]').attr('allowSave',"false");
            $('input[id=E_26_12_b_yes1]').attr('permission_empty',"yes");
            $('input[id=E_26_12_b_no1]').attr('permission_empty',"yes");
        }
    });
    // 补充告知问卷（投保人）
    // 投保人 年龄appnt_age：
    var appnt_age = 18; // 肯定大于18岁
    var appnt_sex = '女'; // 11
    $timeout(function() {
        if (appnt_sex == '女' ) {
            $('input[id=F_26_11_a_yes2]').attr('permission_empty',"no");
            $('input[id=F_26_11_a_no2]').attr('permission_empty',"no");
            $('input[id=F_26_11_b_yes2]').attr('permission_empty',"no");
            $('input[id=F_26_11_b_no2]').attr('permission_empty',"no");
        }else{
            $('input[id=F_26_11_a_yes2]').attr('permission_empty',"yes");
            $('input[id=F_26_11_a_no2]').attr('permission_empty',"yes");
            $('input[id=F_26_11_b_yes2]').attr('permission_empty',"yes");
            $('input[id=F_26_11_b_no2]').attr('permission_empty',"yes");
        }
    });
    var prtSeq = window.localStorage.getItem("prtSeq");
    //点击保存按钮
        $scope.submitQuesData = function (){
            // 保存前进行校验
            if(!$scope.questionFormValidate()){
                return;
            };
            // 生成json
            var json_o = '{';
            var list_o = $('[id^=problempieces_]');  
            for(var j = 0; j < list_o.length; j++){//遍历所有匹配到的元素，进行json重新组装
                //因为后台保存的第二个P为大写，做个简单的转换
                var qName = "problempieces"+list_o[j].id.substring(13);
                json_o += '"'+qName+'"' + ":" +true+ ",";
                var yn = list_o[j].getAttribute('yn');
                //var val = $('[id^='+yn+']');
                var list_i = $('[id^='+yn+']'); 
                for(var i = 0; i < list_i.length; i++){//遍历所有匹配到的元素，进行json重新组装
                    if(list_i[i].value!=undefined){
                        if(list_i[i].type=="radio"||list_i[i].type=="checkbox"){
                            if(list_i[i].checked){
                                json_o += '"'+list_i[i].id+'"' + ":" +true+ ",";
                            }else{
                                json_o += '"'+list_i[i].id+'"' + ":" +false+ ",";
                            }
                        }else{
                            json_o += '"'+list_i[i].id+'"' + ":" + '"'+list_i[i].value+'"' + ",";
                        }
                    }
                }
            }
            json_o = json_o.substring(0,json_o.length-1) +"}";
            // 验证成功
            // alert(' json_o==='+ json_o)
            window.localStorage.setItem("questionnaire_data"+prtSeq,json_o);
            // window.questionjson.saveData(json_o);
            //保存后返回问题件列表
            var detailJson=eval("("+window.localStorage.getItem('noticedetail'+prtSeq)+")");
            var appntTel=window.localStorage.getItem('data_phone'+prtSeq);
            var code=window.localStorage.getItem('data_code'+prtSeq);
            var agentname=detailJson.agentname;
            var agentcode=detailJson.agentcode;
            var appntname=detailJson.appntname;
            var insuredname=detailJson.insuredname;
            var prtNo=detailJson.prtno;
            var manageCom=detailJson.managecom;
            //alert('手机号=='+appntTel);
            //alert('通知书号=='+code);
			//console.log("问题件数据："+json_o);
            var pctype = document.getElementById("pctype").value;
			if(pctype == '' || pctype == 'pad'){
				$state.go('menu.question.underwirting',{'prtSeq':questionObj.prtSeq,'appntTel':appntTel,'code':code,'prtNo':prtNo,'manageCom':manageCom});					
				closeLoadingWait();	
				myAlert('问卷填写保存成功！');		
			}else{//手机版的此后页面全部横屏
				$state.go('underwirting',{'prtSeq':questionObj.prtSeq,'appntTel':appntTel,'code':code,'prtNo':prtNo,'manageCom':manageCom});
				closeLoadingWait();
				myAlert('问卷填写保存成功！');
			}       
        }
        // 问题卷相关校验 ---wangzj
        $scope.questionFormValidate = function(){


			   return problemValidate();

        }
})
/*
.controller('TestCtrl', function($scope,$ionicActionSheet){
		$scope.bankData = [
			{
				"BANK_CODE" : 2201,
				"BANK_NAME" : "中国银行"
			},
			{
				"BANK_CODE" : 2401,
				"BANK_NAME" : "北京银行"
			},
			{
				"BANK_CODE" : 3021,
				"BANK_NAME" : "华夏银行"
			}
		];
//$scope.selectedBank = $scope.bankData[0]

		//alert($scope.selectedBank)

	$scope.ifElectronic={checked : false};
	$scope.aa={checked : false};
	$scope.bb={checked : false};
		//$scope.selectedBank={BANK_CODE : null};
	$scope.ifcheck = function(){
		console.log($scope.ifElectronic.checked,$scope.aa.checked,$scope.bb.checked,$scope.selectedBank.BANK_CODE,$scope.bankCardNumber);
	};
		$scope.ck = function(aa){
			if(aa.checked==true){
				$ionicActionSheet.show({
					titleText:'若勾选此项我们将',
					buttons:[{text:'若勾选此项我们将不再发送缴费提示！'}],
					cancelText: '取消',
					cancel: function () {
						console.log('CANCELLED');
					}
				})
			}
		}

		$scope.sele=function(selectedBank){
			alert(selectedBank.BANK_CODE)
		}


	})
*/
