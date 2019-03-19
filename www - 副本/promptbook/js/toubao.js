$(function(){
	var getDate = new Date();
	var year = getDate.getFullYear();
	var month = getDate.getMonth()+1;
	var date = getDate.getDate();
	$('.today').html(year+'年'+month+'月'+date+'日');
	$('#applicationDate2').html(year+'年'+month+'月'+date+'日');
    

	/**
	 * @功能:调用拍照接口和签名接口
	 * @Date 2014-10-30
	 */

	$('.signature').on('click',function(){
		var data = window.javaprompt.getSignture();
	});

	$('.takephoto').on('click',function(){ 

		var data = window.javaprompt.taktphone();
	});
	$('.declaration-btn').on('click',function(){

		var data = window.insureinfo.getMultSign();
	});


});

/**
 * @功能:通过绝对路径展示图片/恢复数据
 * @Date 2014-10-30
 */
function promptTakePhotoHtml(data) {
	$('#153').hide();
	$('#53').show();
	$('#53').attr("src",data+"?"+Math.random());
//	$('.takephoto').after('<img class="photo" src ="'+data+'"  alt=""/>')
}
function promptSigntureHtml(data) {
	$('#120').hide();
	$('#20').show();
	$('#20').attr("src",data+"?"+Math.random());
}
function updateAgent_Html(data) {
	$('.declaration-btn').hide();
	$('#30').show();
	$('#30').attr("src",data+"?"+Math.random());
}
function photo_54(data) {
	$('#154').hide(); 
	$('#54').show();
	$('#54').attr("src",data+"?"+Math.random());
//	$('#photo-above').after('<img class="photo" id="54" onclick="photoClickFn(54,\''+data+'\')" src ="'+data+'"  alt=""/>')
}
function photo_55(data) {
	$('#155').hide();
	$('#55').show();
	$('#55').attr("src",data+"?"+Math.random());
}
function photo_56(data) {
	$('#156').hide();
	$('#56').show();
	$('#56').attr("src",data+"?"+Math.random());
}
function signture_21(data) {
	$('#121').hide();
	$('#21').show();
	$('#21').attr("src",data+"?"+Math.random());
}
function signture_22(data) {
	$('#122').hide();
	$('#22').show();
	$('#22').attr("src",data+"?"+Math.random());
}
function signture_23(data) {
	$('#123').hide();
	$('#23').show();
	$('#23').attr("src",data+"?"+Math.random());
}
/**
 * @功能:投保单----调用拍照和签名
 * @param str 自定义拍照和签名的标识Id
 */
function takePhoto(str) {
	window.insureinfo.taktphone(str);
}
function Signture(data) {
	 window.insureinfo.getSignture(data);
}

/**
 * @功能:告知书----调用拍照和签名
 * @param str 自定义拍照和签名的标识Id
 */
function takeAgentPhoto(str) {
	window.agentinfo.taktphone(str);
}
function AgentSignture(data) {
	 window.agentinfo.getSignture(data);
}
/**
 * @功能:投保单---拍照后图片点击事件
 * @Date 2014-10-30
 */
function photoClickFn(id,imageUrl){
//	$('#test').val(444);
	window.insureinfo.photoClick(id,imageUrl);
}
/**
 * @功能:投保单---拍照后图片点击事件
 * @Date 2014-10-30
 */
function photoClick(id,imageUrl){
//	$('#test').val(444);
	window.agentinfo.photoClick(id,imageUrl);
}
/**
 * @功能:提示书---拍照后图片点击事件
 * @Date 2014-10-30
 */
function promptClickFn(id,imageUrl){
	window.javaprompt.photoClick(id,imageUrl);
}
/**
 * @功能:投保单---拍照后图片点击事件
 * @Date 2014-10-30
 */
function refershHtml(id,photoId){
	// $('#1'+id).show();
	// $('#'+id).hide();
	if (photoId == 0 ) {
		$('#1'+id).show();
		$('#'+id).hide();
	}
	else{
		$('#1'+id).show();
		$('#'+id).hide();
		$('#'+photoId).hide();
	}
}


/**
 * 初始化告知书网页
 */
function showHtml() {
	$('#53').hide();
	$('#20').hide();
	window.javaprompt.getDataPrompt();
}
/**
 * 初始化投保单网页
 */
function showInsureHtml() {
	window.insureinfo.getInsureData();
}

/**
 * 判断分红、万能险
 */
function MainInsure() {
	$("#130").attr("disabled", true); 
}
function Main_Insure() {
	$("#130").removeAttr("disabled");
}
