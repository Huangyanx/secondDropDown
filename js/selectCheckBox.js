/**
 * Created by Administrator on 2019/6/18.
 */
/* select 二级菜单
 *  checkAll:true,//初始化时是否全选
 *  hasInput:true,//是否已建input输入框
 *  inputTips:'',//输入框的提示语
 *  menuValue:[],数组值 三维数组，都有键值对的
 *  valname ：string  下拉框二级菜单选中时的值所对应的 menuValue 中第三维所对应的键名
 * showname: string 显示的名称
 * titlename:string  title 对应的名称
 * isopen:false 打开二级菜单
 *  haschange:true  用已标记值是否改变，避免每次点击页面都执行选中函数
 *  activeBgColor： 选中样式（背景色）及鼠标移上去背景色
 * callBack 选中值调用的回调函数
 * has_selected  触发选中事件  根据
 * */

(function( $ ){
    var _global;
    function SelectCheckBox(obj,op) {
        this.obj=obj;
        this.ops={};
        this._initial(this.obj,op);
    };
    SelectCheckBox.prototype ={
        _initial:function (obj,options) {
            var defaults = {
                hasInput:false,//是否已建input输入框
                inputTips:'请选择',
                checkAllTips:'全选',
                has_cehecked_all:'已全选',
                checkAll:true,
                menuValue:[],
                valName:'',
                showName:'',
                titleName:'',
                isOpen:false,
                hasChange:false,
                activeBgColor:'#519fec',
                callBack : function (res){}
            };
            var that = obj;
            var _this=this;
            var ops= _this.ops = $.extend({}, defaults, options);
            //为is_more赋值为true，默认为true，防被篡改  表示二级菜单的值是否是有更多的内容，是对象类型，否则是数组类型，只有一个值
            ops.is_more=this.ops.is_more=true;
            function creatSelect() {
                var tag="",secondMenu='<div class="selectMenu2">',showname=ops.showName,titlename=ops.titleName,checkAll=ops.checkAll;
                if(!ops.hasInput){ tag+='<input  placeholder="'+ops.inputTips+'" class="select-input" type="text"   readonly="1" >';}
                var checked= checkAll ? "checked":'';
                tag+='<div class="selectMenu1">';
                tag+='<div class="select_level1 select_all" data-val=" "><input type="checkbox" '+checked+' class="check_all">'+ops.checkAllTips+'</div>';
                $.each(ops.menuValue,function (index,val) {
                    //一级菜单 遍历
                    tag+='<div class="select_level1" data-val="'+index+'" title="'+index+'">';
                    tag+='<input type="checkbox" name="check_first" '+checked+' class="check_first">';
                    tag+=index+'</div>';
                    //二级菜单遍历
                    secondMenu+='<div class="select_wrap2">';
                        $.each(val, function (i, val1) {
                            if(!ops.is_more || typeof val1==='string'){
                                ops.is_more=_this.ops.is_more=false;
                                var more_val =  "title='" + val1 + "'";
                                var val2 =  val1 ;
                                var data_name=val1;
                            }else{
                                var data_name=i
                                var arr1 = Object.values(val1);
                                var len1 = arr1.length;
                                if (len1 > 1) {
                                    var val2 = arr1[0];
                                    var more_val = '';
                                    for (var k in arr1) {
                                        more_val += ' data-val' + k + '="' + arr1[k] + '"';
                                    }
                                } else {
                                    var val2 = arr1[0];
                                    var more_val = "data-val='" + arr1[0] + "'";
                                }
                                if(titlename!=='') {more_val+='title="'+val1[titlename]+' "';}
                                else { more_val+='title="'+val2+' "';}

                                if (showname!=='') {val2=val1[showname];}
                            }
                            secondMenu += '<div class="select_level2" data-name="' + data_name + '"  ' + more_val + '>';
                            secondMenu += '<input type="checkbox" value="' + val2 + '" name="check_second" class="check_second" '+checked+'>';


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
                selected();
            }
            //鼠标划入事件
            function through (obj,isOne) {
                $(obj).mouseenter(function () {
                    $(obj).siblings().css({
                        backgroundColor: '#fff',
                        color: '#000'
                    });
                    $(this).css({
                        backgroundColor:ops.activeBgColor,
                        color: '#fff'
                    });
                    if(isOne){
                        var index=($(this).index()-1);
                        $(that).find('.select_wrap2').hide();
                        if(index>=0){
                            $($(that).find('.select_wrap2').eq(index)).show();
                        }
                    }
                });
            }
            // 打开关闭
            function open() {
                $(that).delegate(".select-input",'click',function (e) {
                    //获取当前一级菜单状态
                    var ishidden=$(that).find('.selectMenu1').is(':hidden');
                    $(".selectMenu1,.select_wrap2").hide();
                    if(ishidden){
                        if($(that).hasClass('drop')) {$(that).removeClass('drop').addClass('upward');}
                        $(that).find('.selectMenu1').show();
                        ops.isOpen=true;
                    }else {
                        if($(that).hasClass('upward')) {$(that).removeClass('upward').addClass('drop');}
                        $(that).find('.selectMenu1').hide();
                        ops.isOpen=false;
                    }
                    e.stopPropagation();
                });
                $(document).delegate(":not('.check_first,.check_second')",'click',function(){ //点击隐藏预约项目的一、二级菜单
                    if(ops.isOpen){
                        if($(that).hasClass('upward')) {$(that).removeClass('upward').addClass('drop');}
                        if(ops.hasChange) getValues(this);
                        $(that).find('.selectMenu1,.select_wrap2').hide();
                        ops.isOpen=false;
                    }

                });
            }
            //二级菜单的样式---位置
            function addStyle() {
                var source_len=$(that).find('.select_wrap2').length;
                $(that).find('.select_wrap2').each(function (i,ele) {
                    var level1_len=$(ele).find('.select_level2').length;
                    if(i>source_len/2 && ((level1_len>source_len/2 || level1_len>4) && level1_len<source_len ))  var cur_pos=source_len-level1_len+1;
                    else if((source_len>10 && level1_len>source_len/2) || (level1_len+2)>source_len) var cur_pos=0;
                    else var cur_pos=(i+1);
                    var top=cur_pos*23;
                    $(ele).css('marginTop',top);
                });
            }
            //点击菜单进行选择
            function selected() {
                $(that).delegate('.select_level2', 'click', function(e){
                    if( $(this).find('.check_second').prop('checked'))  $(this).find('.check_second').prop('checked',false);
                    else  {
                        var index= $(this).parent().index()+1;
                        $($(that).find('.select_level1').eq(index)).find('.check_first').prop('checked',true);
                        $(this).find('.check_second').prop('checked',true);
                    }
                    e.stopPropagation();
                    ops.hasChange=true;
                });
                //二级菜单多选框
                $(that).delegate('.select_level2 .check_second', 'click',function (e) {
                    //点击该多选框出现隐藏菜单情况
                    $(this).parents('.select_wrap2').show();
                    $(that).find('.selectMenu1').show();
                    if( $(this).prop('checked')){
                        var index= $(this).parents('.select_wrap2').index()+1;
                        $($(that).find('.select_level1').eq(index)).find('.check_first').prop('checked',true);
                    }
                    e.stopPropagation();
                    ops.hasChange=true;
                });
                //一级菜单
                $(that).delegate('.select_level1', 'click', function(e){ //点击1级菜单，选择第1个2级的值
                    var index=($(this).index()-1);
                    var source_level1 = $(this).text();
                    if( $(this).find('.check_first').prop('checked')) {
                        $(this).find('.check_first').prop('checked',false);
                        $($(that).find('.select_wrap2').eq(index)).find('.select_level2 .check_second').prop('checked',false);
                    }
                    else  {
                        $(this).find('.check_first').prop('checked',true);
                        $($(that).find('.select_wrap2').eq(index)).find('.select_level2 .check_second').prop('checked',true);
                    }
                    e.stopPropagation();
                    ops.hasChange=true;
                });
                $(that).delegate('.select_level1 .check_first', 'click',function (e) {
                    //点击该多选框出现隐藏菜单情况
                    var index=($(this).parent().index()-1);
                    $($(that).find('.select_wrap2').eq(index)).show();
                    $(that).find('.selectMenu1').show();
                    $($(that).find('.select_wrap2').eq(index)).find('.select_level2').trigger('click');
                    e.stopPropagation();
                    ops.hasChange=true;
                });
                //全选
                $(that).delegate('.select_all', 'click',function (e) {
                    if( $(this).find('.check_all').prop('checked')) {
                        $(this).find('.check_all').prop('checked',false);
                        $(that).find('.check_first,.check_second').prop('checked',false);
                    }
                    else  {
                        $(this).find('.check_all').prop('checked',true);
                        $(that).find('.check_first,.check_second').prop('checked',true);
                    }
                    e.stopPropagation();
                    ops.hasChange=true;
                });
                $(that).delegate('.select_all .check_all', 'click',function (e) {
                    $(that).find('.selectMenu1').show();
                    if( $(this).prop('checked')) {
                        $(that).find('.check_first,.check_second').prop('checked',true);
                    }
                    else  {
                        $(that).find('.check_first,.check_second').prop('checked',false);
                    }
                    e.stopPropagation();
                    ops.hasChange=true;
                });
            }
            //离开菜单 获取选中值
            function getValues(obj) {
                var has_cehecked_all=ops.has_cehecked_all,all=false;
                var len=$(that).find('.check_second').length;
                    var values=[];
                    var arr_name='';//记录来源名称
                    $(that).find(".check_second:checked").each(function (i,ele) {
                        values.push($(ele).val());
                        if(i===0) arr_name=$(ele).parent().text();
                    });
                    var arr_len=values.length;
                    if(len===arr_len){
                        //全选
                        all=true;
                        $(that).find(".select-input").val(has_cehecked_all);
                    }
                    else if(arr_len===1){
                        $(that).find(".select-input").val(arr_name);
                    }else if(arr_len>0){
                        $(that).find(".select-input").val('已选择'+arr_name+'等'+arr_len+'项');
                    }else {
                        $(that).find(".select-input").val('未进行选择');
                    }

                ops.callBack(values,that,obj,all);
                ops.hasChange=false;
            }
            creatSelect();
        },
        has_selected:function (val) {
            var that=this.obj;
            var ops=this.ops;
            var has_cehecked_all=ops.has_cehecked_all;
            //二级菜单  选中
            if(val!==''){
                if(val==='all'){
                    $(that).find('.check_first,.check_second').prop('checked',true);
                    $(that).find(".select-input").val(has_cehecked_all);
                }else {
                    var new_name='';
                    $(that).find('.select_wrap2 .check_second').each(function (i,ele) {
                        if($(ele).val()===val){
                            var index=($(ele).parents('select_wrap2').index()+1);
                            $(ele).prop('checked',true);
                            $($(that).find('.select_level1').eq(index)).find('.check_first').prop('checked',true);
                            new_name=$(ele).parent().text();
                        }
                    });
                    $(that).find(".select-input").val(new_name);

                }
            }


        }

    };

    _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = SelectCheckBox;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return SelectCheckBox;});
    } else {
        !('SelectCheckBox' in _global) && (_global.SelectCheckBox = SelectCheckBox);
    }

})( jQuery );


