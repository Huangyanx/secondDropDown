# 二级下拉框
## 使用
1、所需文件及具体用法
> 所需文件及顺序：
依赖jQuery，引入样式select.css及js单选下拉框selectPlug.min.js或多选下拉框selectCheckBox.min.js
>> 生成二级下拉框：
创建一个带类.select-wrap的标签，在script内 new或调用 SelectPlug({menuValue:data),即生成一个单选二级下拉框

## 普通二级下拉框
>点击下拉框，显示一级菜单，鼠标移到一级菜单，显示二级菜单，点击一级菜单，选中二级菜单的第一个值，点击二级菜单选中点中的值
>>带有向上或向上箭头
创建一个带类.select-wrap的标签时，再加类.drop，可实现显示、隐藏箭头

## 单选二级下拉框
二级下拉菜单实现显示的值不同于获取的值，并且可以获取更多二级菜单的值，而不仅仅是一个值

1.js文件SelectPlug.min.js，调用SelectPlug即可，具体参数如下
 *  hasInput:Boolean, 默认 true      //是否已创建下拉框（input输入框），默认创建
 *  inputTips:string, 默认 '请选择',//下拉框的提示语
 *  menuValue:json, 默认[]。  //二级菜单数据，数据可以对应是以下数据结构{key:[value,value],[value]}或{key:{key:{},key:{}}}或{key:[{},{}]},json值
 *  valname ：string ,默认空  // 下拉框二级菜单选中时的值所对应的 menuValue 中二级菜单所对应的键名
 *  valpos ：int 默认空     下拉框二级菜单选中时的值所对应的 menuValue 中二级菜单所对应的位置（下标）
 * showName:string 默认空  //二级菜单中作为显示的字段名称
  * titlename:string  二级菜单中title 对应的名称
 * callBack:(val,select_obj,element) //选中值调用的回调函数,val:选中的值，select_obj:函数对象本身，element，选中对应的标签
 * has_selected(val,is_name)  默认选中的值  //val 选中的值，is_name:表示val是data-name的值
 * activeBgColor:string,默认：'#519fec'  选中样式（背景色）及鼠标移上去背景色,
[1]:http://www.huangyanx.top/Views/file/dir/2020-5-20_09_20/images/selectPlug.gif

## 多选二级下拉菜单
  checkAll:Boolean, 默认 true  //初始化时是否全选
 *  hasInput:Boolean, 默认 true, //是否已创建下拉框（input输入框），默认创建
 *  inputTips:string, 默认 '请选择',//下拉框的提示语
 *  menuValue:json, 默认[]。  //二级菜单数据，数据可以对应是以下数据结构{key:[value,value],[value]}或{key:{key:{},key:{}}}或{key:[{},{}]},json值
 *  valname ：string ,默认空  // 下拉框二级菜单选中时的值所对应的 menuValue 中二级菜单所对应的键名
 * showName:string 默认空  //二级菜单中作为显示的字段名称
 * titlename:string  二级菜单中title 对应的名称
 * isopen:Boolean,默认false 打开二级菜单
 *  haschange:Boolean,默认true  用已标记值是否改变，避免每次点击页面都执行选中函数
 *  activeBgColor： 选中样式（背景色）及鼠标移上去背景色
 * callBack 选中值调用的回调函数
 * has_selected  默认选中的值  //val 选中的值，is_name:表示val是data-name的值
