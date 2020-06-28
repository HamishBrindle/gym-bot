(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["Settings"],{"674a":function(t,e,i){"use strict";var s=i("a1b6"),a=i.n(s);a.a},8547:function(t,e,i){"use strict";var s=i("2b0e"),a=i("80d2");e["a"]=s["a"].extend({name:"comparable",props:{valueComparator:{type:Function,default:a["i"]}}})},"9d01":function(t,e,i){},a1b6:function(t,e,i){},b332:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"settings__wrapper"},[i("div",{staticClass:"settings"},[i("v-row",[i("v-col",[i("span",{staticClass:"display-1 font-weight-light"},[t._v("Settings")])])],1),i("v-row",[i("v-col",[i("v-card",{staticClass:"mx-auto",attrs:{elevation:"0",outlined:""}},[i("v-list-item",{attrs:{"three-line":""}},[i("v-list-item-content",[i("div",{staticClass:"overline mb-4"},[t._v(" GENERAL ")]),i("v-list-item-title",{staticClass:"headline mb-1"},[t._v(" Light/Dark Mode ")]),i("v-list-item-subtitle",[t._v(" Change the look and feel of the dashboard (turn out the lights!) ")])],1),i("v-switch",{attrs:{"hide-details":"",inset:"",color:"accent"},model:{value:t.isDarkTheme,callback:function(e){t.isDarkTheme=e},expression:"isDarkTheme"}})],1)],1)],1)],1)],1)])},a=[],n=i("d4ec"),l=i("262e"),o=i("2caf"),r=i("9ab4"),c=i("60a3"),h=i("7ffd"),u=function(t){Object(l["a"])(i,t);var e=Object(o["a"])(i);function i(){return Object(n["a"])(this,i),e.apply(this,arguments)}return i}(c["b"]);Object(r["a"])([Object(h["b"])("context/theme@dark"),Object(r["b"])("design:type",Boolean)],u.prototype,"isDarkTheme",void 0),u=Object(r["a"])([Object(c["a"])({name:"Settings"})],u);var d=u,p=d,v=(i("674a"),i("2877")),f=i("6544"),m=i.n(f),g=i("b0af"),b=i("62ad"),C=i("da13"),w=i("5d23"),V=i("0fd9"),y=(i("0481"),i("4069"),i("5530")),S=(i("ec29"),i("9d01"),i("4de4"),i("45fc"),i("d3b7"),i("25f0"),i("c37a")),k=i("5607"),j=i("2b0e"),A=j["a"].extend({name:"rippleable",directives:{ripple:k["b"]},props:{ripple:{type:[Boolean,Object],default:!0}},methods:{genRipple:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return this.ripple?(t.staticClass="v-input--selection-controls__ripple",t.directives=t.directives||[],t.directives.push({name:"ripple",value:{center:!0}}),t.on=Object.assign({click:this.onChange},this.$listeners),this.$createElement("div",t)):null},onChange:function(){}}}),O=i("8547"),_=i("58df"),D=Object(_["a"])(S["a"],A,O["a"]).extend({name:"selectable",model:{prop:"inputValue",event:"change"},props:{id:String,inputValue:null,falseValue:null,trueValue:null,multiple:{type:Boolean,default:null},label:String},data:function(){return{hasColor:this.inputValue,lazyValue:this.inputValue}},computed:{computedColor:function(){if(this.isActive)return this.color?this.color:this.isDark&&!this.appIsDark?"white":"primary"},isMultiple:function(){return!0===this.multiple||null===this.multiple&&Array.isArray(this.internalValue)},isActive:function(){var t=this,e=this.value,i=this.internalValue;return this.isMultiple?!!Array.isArray(i)&&i.some((function(i){return t.valueComparator(i,e)})):void 0===this.trueValue||void 0===this.falseValue?e?this.valueComparator(e,i):Boolean(i):this.valueComparator(i,this.trueValue)},isDirty:function(){return this.isActive},rippleState:function(){return this.disabled||this.validationState?this.validationState:"primary"}},watch:{inputValue:function(t){this.lazyValue=t,this.hasColor=t}},methods:{genLabel:function(){var t=this,e=S["a"].options.methods.genLabel.call(this);return e?(e.data.on={click:function(e){e.preventDefault(),t.onChange()}},e):e},genInput:function(t,e){return this.$createElement("input",{attrs:Object.assign({"aria-checked":this.isActive.toString(),disabled:this.isDisabled,id:this.computedId,role:t,type:t},e),domProps:{value:this.value,checked:this.isActive},on:{blur:this.onBlur,change:this.onChange,focus:this.onFocus,keydown:this.onKeydown},ref:"input"})},onBlur:function(){this.isFocused=!1},onChange:function(){var t=this;if(!this.isDisabled){var e=this.value,i=this.internalValue;if(this.isMultiple){Array.isArray(i)||(i=[]);var s=i.length;i=i.filter((function(i){return!t.valueComparator(i,e)})),i.length===s&&i.push(e)}else i=void 0!==this.trueValue&&void 0!==this.falseValue?this.valueComparator(i,this.trueValue)?this.falseValue:this.trueValue:e?this.valueComparator(i,e)?null:e:!i;this.validate(!0,i),this.internalValue=i,this.hasColor=i}},onFocus:function(){this.isFocused=!0},onKeydown:function(t){}}}),x=i("c3f0"),E=i("0789"),L=i("490a"),$=i("80d2"),B=D.extend({name:"v-switch",directives:{Touch:x["a"]},props:{inset:Boolean,loading:{type:[Boolean,String],default:!1},flat:{type:Boolean,default:!1}},computed:{classes:function(){return Object(y["a"])({},S["a"].options.computed.classes.call(this),{"v-input--selection-controls v-input--switch":!0,"v-input--switch--flat":this.flat,"v-input--switch--inset":this.inset})},attrs:function(){return{"aria-checked":String(this.isActive),"aria-disabled":String(this.disabled),role:"switch"}},validationState:function(){return this.hasError&&this.shouldValidate?"error":this.hasSuccess?"success":null!==this.hasColor?this.computedColor:void 0},switchData:function(){return this.setTextColor(this.loading?void 0:this.validationState,{class:this.themeClasses})}},methods:{genDefaultSlot:function(){return[this.genSwitch(),this.genLabel()]},genSwitch:function(){return this.$createElement("div",{staticClass:"v-input--selection-controls__input"},[this.genInput("checkbox",Object(y["a"])({},this.attrs,{},this.attrs$)),this.genRipple(this.setTextColor(this.validationState,{directives:[{name:"touch",value:{left:this.onSwipeLeft,right:this.onSwipeRight}}]})),this.$createElement("div",Object(y["a"])({staticClass:"v-input--switch__track"},this.switchData)),this.$createElement("div",Object(y["a"])({staticClass:"v-input--switch__thumb"},this.switchData),[this.genProgress()])])},genProgress:function(){return this.$createElement(E["c"],{},[!1===this.loading?null:this.$slots.progress||this.$createElement(L["a"],{props:{color:!0===this.loading||""===this.loading?this.color||"primary":this.loading,size:16,width:2,indeterminate:!0}})])},onSwipeLeft:function(){this.isActive&&this.onChange()},onSwipeRight:function(){this.isActive||this.onChange()},onKeydown:function(t){(t.keyCode===$["u"].left&&this.isActive||t.keyCode===$["u"].right&&!this.isActive)&&this.onChange()}}}),I=Object(v["a"])(p,s,a,!1,null,null,null);e["default"]=I.exports;m()(I,{VCard:g["a"],VCol:b["a"],VListItem:C["a"],VListItemContent:w["a"],VListItemSubtitle:w["b"],VListItemTitle:w["c"],VRow:V["a"],VSwitch:B})},ec29:function(t,e,i){}}]);
//# sourceMappingURL=Settings.b3a91c85.js.map