
	//定义tab
	var tabMap = {};

	/**资料出示*/
	var validateMap1 = '{' +
					   '"1":"tbxz_agree:同意投保须知后，进行操作！",' +
					   '"2":"bxtk_agree:同意保险条款后，进行操作！",' +
					   '"3":"cpsm_agree:同意产品说明后，进行操作！"' +
				  '}';
	tabMap["1"] =  validateMap1; 
	/**信息录入*/
	var validateMap2 = '{' +
					   '"1":"name:投保人姓名不能为空！,sex:投保人性别不能为空！",' +
					   '"2":"name:被保人姓名不能为空！,sex:被保人性别不能为空！",' +
					   '"3":"name:受益人姓名不能为空！,sex:受益人性别不能为空！"' +
				  '}';
	tabMap["2"] =  validateMap2; 
	/**影像录入*/
	var validateMap3 = '{' +
					   '"1":"name:投保人姓名不能为空！,sex:投保人性别不能为空！",' +
					   '"2":"name:被保人姓名不能为空！,sex:被保人性别不能为空！",' +
					   '"3":"name:受益人姓名不能为空！,sex:受益人性别不能为空！"' +
				  '}';
	tabMap["3"] =  validateMap3; 
	/**保单预览*/
	var validateMap4 = '{' +
					   '"1":"name:投保人姓名不能为空！,sex:投保人性别不能为空！",' +
					   '"2":"name:被保人姓名不能为空！,sex:被保人性别不能为空！",' +
					   '"3":"name:受益人姓名不能为空！,sex:受益人性别不能为空！"' +
				  '}';
	tabMap["4"] =  validateMap4; 
	/**保单提交*/ 
	var validateMap5 = '{' +
					   '"1":"name:投保人姓名不能为空！,sex:投保人性别不能为空！",' +
					   '"2":"name:被保人姓名不能为空！,sex:被保人性别不能为空！",' +
					   '"3":"name:受益人姓名不能为空！,sex:受益人性别不能为空！"' +
				  '}';
	tabMap["5"] =  validateMap5; 
 

/**
 * @功能:在线投保表单验证
 * @param {step:为scope.step对像,currentTab:当前模块tab索引值}
 * @Author:Li Jie
 * @Date 2015-03-10
*/   
function onlineIsuresFormValidateFn($scope,currentTab){
 var validateEx = tabMap[currentTab];
  var formEl = eval("("+validateEx+")");
  var isPass = true;
  if(formEl != null){
  		/**此处的pop为每一个模块中的子tab的索引值 */
  		for(pop in formEl){
  			var express = formEl[pop]; 
  			if(isPass == false){
  				break;
  			}
  			if(express){
  				 var elementArray = express.split(",");
  				 if(elementArray != null && elementArray.length > 0){
  				 	for(var i = 0; i<elementArray.length; i++){
  				 	    var mapForm = elementArray[i];
  				 	    if(mapForm){
  				 	    	var id = mapForm.split(":")[0]; //表单的ID
  				 	    	var msg = mapForm.split(":")[1]; //提示信息
  				 	    	var val = document.getElementById(id).value;
  				 	    	if(!val){ //该表单没有输入提示信息，并且跳转到该tab
  				 	    		if('1' == currentTab){
  				 	    		 	 $scope.step1 = {
				                        activeTab:pop
				                     }
  				 	    		 }else if('2' == currentTab){
  				 	    		 	 $scope.step2 = {
				                        activeTab:pop
				                     }
  				 	    		 }else if('3' == currentTab){
  				 	    		 	 $scope.step3 = {
				                        activeTab:pop
				                     }
  				 	    		 }
  				 	    		alert(msg); 
  				 	    		isPass = false;
  				 	    		break;
  				 	    	}
  				 	    }
  				 	}
  				 }
  			}else{
  				alert("表达式为空!");
  				break;
  			}
  		}
  		return isPass;
  }
} 