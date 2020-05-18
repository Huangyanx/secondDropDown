/**
 * Created by Administrator on 2019/6/18.
 */
/* select 二级菜单
 * hasInput:true,//是否已建input输入框
 *  inputTips:'',//输入框的提示语
 *  menuValue:{key:[value,value],[value]}或{key:{key:{},key:{}}}或{key:[{},{}]},json值
 *  valname ：string  下拉框二级菜单选中时的值所对应的 menuValue 中第三维所对应的键名
 *  valpos ：int      下拉框二级菜单选中时的值所对应的 menuValue 中第三维所对应的位置（下标）
 * callBack 选中值调用的回调函数
 * has_selected  触发选中事件  根据
 * activeBgColor  选中样式（背景色）及鼠标移上去背景色,
 * showName//三维数组作为显示的字段名称
 * */

(function( $ ){
    var _global;

    function SelectPlug(obj,op) {
        this.obj=obj;
        this.ops={};
        this._initial(this.obj,op);
    };
    SelectPlug.prototype ={
        _initial:function (obj,options) {
            var defaults = {
                hasInput:false,//是否已建input输入框
                inputTips:'请选择',
                menuValue:[],
                valName:'',
                valPos:'',
                showName:'',
                titleName:'',
                activeBgColor:'#519fec',
                callBack : function (res){}
            };
            var that = obj;
            var _this=this;
            var ops= _this.ops = $.extend({}, defaults, options);
            //为is_more赋值为true，默认为true，防被篡改  表示二级菜单的值是否是有更多的内容，是对象类型，否则是数组类型，只有一个值
            ops.is_more=this.ops.is_more=true;
            function creatSelect() {
                var tag="",secondMenu='<div class="selectMenu2">',valpos=ops.valPos,titlename=ops.titleName,showName=ops.showName;
                if(!ops.hasInput) {tag+='<input  placeholder="'+ops.inputTips+'" class="select-input" type="text"   readonly="1" >';}
                tag+='<div class="selectMenu1">';
                $.each(ops.menuValue,function (index,val) {
                    //一级菜单 遍历
                    tag+='<div class="select_level1" data-val="'+index+'" title="'+index+'">';
                    tag+=index+'</div>';
                    //二级菜单遍历
                    secondMenu+='<div class="select_wrap2">';
                        $.each(val, function (i, val1) {
                            if(!ops.is_more || typeof val1==='string'){
                                ops.is_more=_this.ops.is_more=false;
                                var more_val =  "title='" + val1 + "'";
                                var val2 =  val1 ;
                                var data_name=val1
                            }else{
                                var data_name=i
                                var arr1 = Object.values(val1);
                                var len1 = arr1.length;
                                if (len1 > 1) {
                                    var val2 = showName==='' ? arr1[0] : val1[showName];
                                    var more_val = '';
                                    for (var k in arr1) {
                                        more_val += ' data-val' + k + '="' + arr1[k] + '"';
                                    }
                                } else {
                                    var val2 = showName==='' ? arr1[0] : val1[showName];
                                    var more_val = "data-val='" + arr1[0] + "'";
                                }
                                if(titlename!=='') {more_val+='title="'+val1[titlename]+' "';}
                            }
                            secondMenu += '<div class="select_level2" data-name="' + data_name + '"  ' + more_val + '>';
                            secondMenu += val2 + '</div>';
                        });

                    secondMenu+="</div>";

                });
                tag+="</div>";
                secondMenu+="</div>";
                tag+=secondMenu;
                $(that).append(tag);
                //动态添加样式 无法在未插入前添加样式
                addStyle();
                open();
                through ($(that).find('.select_level1'),true);
                through ($(that).find('.select_level2'));
                _this.has_selected();
            }
            //鼠标划入事件
            function through (obj,isOne) {
                $(obj).mouseenter(function () {
                    $(obj).siblings().css({
                        backgroundColor: '#fff',
                        color: '#000'
                    });
                    $(this).css({
                        backgroundColor: ops.activeBgColor,
                        color: '#fff'
                    });
                    if(isOne){
                        var index=$(this).index();
                        $(that).find('.select_wrap2').hide();
                        $($(that).find('.select_wrap2').eq(index)).show();
                    }
                });
            }

            // 打开关闭
            function open() {
                $(that).delegate('input','click',function (e) {
                    //获取当前一级菜单状态
                    var ishidden=$(that).find('.selectMenu1').is(':hidden');
                    $(".selectMenu1,.select_wrap2").hide();
                    if(ishidden){
                        if($(that).hasClass('drop')) {$(that).removeClass('drop').addClass('upward');}
                        $(that).find('.selectMenu1').show();
                    }else {
                        if($(that).hasClass('upward')) {$(that).removeClass('upward').addClass('drop');}
                        $(that).find('.selectMenu1').hide();
                    }
                    e.stopPropagation();
                });
                $('html').delegate("",'click',function(){ //点击隐藏预约项目的一、二级菜单
                    $(that).find('.selectMenu1,.select_wrap2').hide();
                });
            }
            //二级菜单的样式---位置
            function addStyle() {
                var source_len=$(that).find('.select_wrap2').length;
                $(that).find('.select_wrap2').each(function (i,ele) {
                    var level1_len=$(ele).find('.select_level2').length;
                    var cur_pos=((level1_len+2)>source_len || (source_len>10 && level1_len<(source_len/3*2)))) ? 0 : i;
                    var top=cur_pos*23;
                    $(ele).css('marginTop',top);
                });

            }
            creatSelect();
        },
        has_selected:function (val,is_name) {
            var that=this.obj;
            var ops=this.ops;
            if(typeof val ==='undefined'){
                $(that).delegate('.select_level2', 'click', function(e){
                    if(!ops.is_more){  //只有一个值
                        var val=$(this).text();
                    }else{
                        if(ops.valPos!==''){
                            var val=$(this).data('val'+ops.valPos);
                        }
                        else if($(this).data('val')){
                            var val=$(this).data('val');
                        }else {
                            var val=$(this).text();
                        }
                    }
                    //按钮样式
                    if($(that).hasClass('drop')) {$(that).removeClass('drop').addClass('upward');}
                    else if($(that).hasClass('upward')) {$(that).removeClass('upward').addClass('drop');}

                    $(that).find('input').val(val);
                    ops.callBack($(this).data('name'),that,this);
                });
                $(that).delegate('.select_level1', 'click', function(e){ //点击1级菜单，选择第1个2级的值
                    var source_level2 = $(this).text();
                    var index=$(this).index();
                    //var source_level1=t_to_s(source_level2)[0];  //繁体转简体
                    if(!ops.is_more){  //只有一个值
                        var val=Object.values(ops.menuValue[source_level2])[0];
                    }else{
                        var val= ops.valName!==''? Object.values(ops.menuValue[source_level2])[0][ops.valName] : Object.values(Object.values(ops.menuValue[source_level2])[0])[0];
                    }
                    //按钮样式
                    if($(that).hasClass('drop')) {$(that).removeClass('drop').addClass('upward');}
                    else if($(that).hasClass('upward')) {$(that).removeClass('upward').addClass('drop');}

                    $(that).find('input').val(val);
                    var val_id=Object.keys(ops.menuValue[source_level2])[0];
                    ops.callBack(val_id,this,$(that).find(".selectMenu2 .select_level1").eq(index));
                })
            }
            else {
               that.find('.select_level2').each(function (i,ele) {
                   if(is_name){
                       if($(ele).data('name')==val){
                           $(ele).trigger('click');
                           return false;
                       }
                   }else if(ops.valPos!==''){
                       if($(ele).data('val'+ops.valPos)===val){
                           $(ele).trigger('click');
                           return false;
                       }
                   }else {
                       if($(ele).text()===val){
                           $(ele).trigger('click');
                           return false;
                       }
                   }
               })
            }
        }
    };

    _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = SelectPlug;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return SelectPlug;});
    } else {
        !('SelectPlug' in _global) && (_global.SelectPlug = SelectPlug);
    }

})( jQuery );


