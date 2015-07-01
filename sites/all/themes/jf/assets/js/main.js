!function e(t,n,i){function o(r,s){if(!n[r]){if(!t[r]){var l="function"==typeof require&&require;if(!s&&l)return l(r,!0);if(a)return a(r,!0);var c=new Error("Cannot find module '"+r+"'");throw c.code="MODULE_NOT_FOUND",c}var u=n[r]={exports:{}};t[r][0].call(u.exports,function(e){var n=t[r][1][e];return o(n?n:e)},u,u.exports,e,t,n,i)}return n[r].exports}for(var a="function"==typeof require&&require,r=0;r<i.length;r++)o(i[r]);return o}({1:[function(e,t,n){!function(t){"use strict";var n,i,o,a,r,s=e("libs/flyweight"),l=e("modules/menu"),c=e("modules/svg"),u=e("modules/forms"),d=e("modules/navigation"),h=e("modules/banner"),m=0,p=t("body"),g=t(".site__footer .container");t(document).on("pageChange",function(e,t){switch("function"==typeof ga&&ga("send","pageview",{page:"/"+t.path,title:t.title+" -- Ajax Load"}),t.route){case"about":"object"==typeof i&&"initialize"in i?i.delegateEvents():i=new u;break;case"project":break;default:"object"==typeof n&&"initialize"in n?n.initialize():n=new c}p.addClass("loading--done");setTimeout(function(){p.removeClass("loading loading--done")},750);Drupal.attachBehaviors(".main-content")}),r=s.Router.extend({routes:{"":"home",about:"about","project/:name":"project","*any":"any"},any:function(){0===m?(a=new h,o=new l(document,{banner:a})):1===o.menu&&o.closeMenu()},home:function(){0===m?(n=new c,m=1,t(".nav__toggle").addClass("home")):p.removeClass("node-type-project"),g.removeClass().addClass("container -home")},about:function(){0===m?(i=new u,m=1):p.removeClass("node-type-project"),g.removeClass().addClass("container -information")},project:function(){0===m?m=1:p.addClass("node-type-project"),g.removeClass().addClass("container")}});var f=new r;if(s.history.start({router:f}),s.history._usePushState){new d(document,{banner:a})}}(jQuery)},{"libs/flyweight":2,"modules/banner":3,"modules/forms":4,"modules/menu":5,"modules/navigation":6,"modules/svg":7}],2:[function(e,t,n){"use strict";!function(){window.console||(window.console={});for(var e=["log","info","warn","error","debug","trace","dir","group","groupCollapsed","groupEnd","time","timeEnd","profile","profileEnd","dirxml","assert","count","markTimeline","timeStamp","clear"],t=function(){},n=0;n<e.length;n+=1)window.console[e[n]]||(window.console[e[n]]=t)}(),function(e,t){"undefined"!=typeof n?t(e,n,window.jQuery):e.Flyweight=t(e,{},e.jQuery||e.$)}(this,function(e,i,o){i=function(e){return this instanceof i?(this.name=e||"App",void(this.els=this.els||{})):new i(e)},"undefined"!=typeof n&&"undefined"!=typeof t&&t.exports&&(t.exports=i),i.debug=!1;var a=i.msg=function(e,t){t||(t="log"),this.debug&&console[t](e)},r=(i.ns=function(e){var t,n=e.split("."),i=this;for(n[0]===this.name&&(n=n.slice(1)),t=0;t<n.length;t+=1)"undefined"==typeof i[n[t]]&&(i[n[t]]={}),i=i[n[t]];return i},i.Module=function(e,t){if(!(this instanceof r))return new r;if("string"!=typeof this.name)return void i.msg("Module must have a name property","error");i.msg("Creating a module named: "+this.name,"warn");var n=e||this.el||document,a=this.options||{};return o(n).length?(o.extend(this,a,t),this.$el=o(n),this.initialize(),this.$el.on(this.name+".actionsDelegated",o.proxy(this.onDelegated,this)),void this.delegateEvents()):void i.msg("this el is no present, so module won't be initialized","warn")});o.extend(r.prototype,{debug:!1,msg:a,initialize:function(){i.msg("original init in debug mode","log")},onDelegated:function(){i.msg("original onDelegated in debug mode","log")},getName:function(){return this.name},logName:function(){console.log(this.name)},undelegateEvents:function(){return i.msg("undelegateEvents is being fired","warn"),this.$el.off(".delegatedEvents."+this.name),this},delegateEvents:function(e){if(this.undelegateEvents(),i.msg("delegateEvents is being fired","warn"),e||(e=this.events)){var t=this;return o.each(e,function(e,n){var i=e.split(" "),o=i.shift()+".delegatedEvents."+t.name,a=i.join(" ");t.$el.on(o,a,{context:t,selector:a},t[n])}),o.isEmptyObject(this.events)||this.$el.trigger(this.name+".actionsDelegated"),this}}});var s=i.Router=function(e){return this instanceof s?(this.options="undefined"!=typeof e?e:this,this.options.routes&&(this.routes=this.options.routes),this.location=window.location,void this._bindRoutes()):new s},l=function(e,t){return Object.prototype.toString.call(e)==="[object "+t+"]"},c=/[\-{}\[\]+?.,\\\^$|#\s]/g,u=/(\(\?)?:\w+/g,d=/\((.*?)\)/g,h=/\*\w+/g,m=/^[#\/]|\s+$/g,p=/^\/+|\/+$/g,g=/#.*$/,f=/\/$/;o.extend(s.prototype,{_bindRoutes:function(){if(this.routes){var e,t=[];for(o.each(this.routes,function(e,n){t.push(e)});"undefined"!=typeof(e=t.pop());)this.route(e,this.routes[e])}},_extractParameters:function(e,t){var n=e.exec(t).slice(1);return o.map(n,function(e){return e?decodeURIComponent(e):null})},_getFragment:function(e){return e.replace(m,"").replace(f,"")},_routeToRegExp:function(e){return e=e.replace(c,"\\$&").replace(d,"(?:$1)?").replace(u,function(e,t){return t?e:"([^/?]+)"}).replace(h,"([^?]*?)"),new RegExp("^"+e+"(?:\\?([\\s\\S]*))?$")},route:function(e,t,n){l(e,"RegExp")||(e=this._routeToRegExp(e)),l(t,"Function")&&(n=t,t=""),n||(n=this.options[t]);var i=this._getFragment(this.location.pathname);if(e.test(i)){var o=this._extractParameters(e,i);l(n,"Function")&&n.apply(this,o)}return this}});var v=i.History=function(){"undefined"!=typeof window&&(this.location=window.location,this.history=window.history)};v.started=!1,o.extend(v.prototype,{navigate:function(e,t){if(!v.started)return!1;t&&t!==!0||(t={trigger:!!t}),e=this.getFragment(e||"");var n=this.root;(""===e||"?"===e.charAt(0))&&(n=n.slice(0,-1)||"/");var i=n+e;return e=decodeURI(e.replace(g,"")),this.fragment!==e?(this.fragment=e,this._usePushState&&this.history[t.replace?"replaceState":"pushState"]({},document.title,i),t.trigger?this.loadUrl(e):void 0):void 0},checkUrl:function(e){var t=this.getFragment();return t===this.fragment?!1:void this.loadUrl()},getFragment:function(e){return(null===e||void 0===e)&&(e=this.getPath()),e.replace(m,"")},getHash:function(e){var t=(e||this).location.href.match(/#(.*)$/);return t?t[1]:""},getSearch:function(){var e=this.location.href.replace(/#.*/,"").match(/\?.+/);return e?e[0]:""},getPath:function(){var e=decodeURI(this.location.pathname+this.getSearch()),t=this.root.slice(0,-1);return e.indexOf(t)||(e=e.slice(t.length)),"/"===e.charAt(0)?e.slice(1):e},start:function(e){if(v.started)throw new Error("Flyweight.history has already been started");v.started=!0;var t=this;this.options=o.extend({root:"/"},this.options,e),this.root=this.options.root,this._wantsPushState=!0,this._hasPushState=!(!this.history||!this.history.pushState),this._usePushState=this._wantsPushState&&this._hasPushState,this.fragment=this.getFragment(),this.router=this.options.router,this.root=("/"+this.root+"/").replace(p,"/");var n=window.addEventListener||function(e,t){return attachEvent("on"+e,t)};return this._usePushState?void n("popstate",function(e){t.checkUrl.apply(t,[e])},!1):!1},loadUrl:function(e){var t=this;e=this.fragment=this.getFragment(e),o.each(this.router.routes,function(e,n){var i;l(e,"RegExp")||(i=t.router._routeToRegExp(e)),i.test(t.fragment)&&t.router.route(e,n)})}}),i.history=new v;var w=function(e,t){var n,i=this;n=e&&e.hasOwnProperty("constructor")?e.constructor:function(){return i.apply(this,arguments)},o.extend(n,i,t);var a=function(){this.constructor=n};return a.prototype=i.prototype,n.prototype=new a,e&&o.extend(n.prototype,e),n.__super__=i.prototype,n};return r.extend=s.extend=w,i})},{}],3:[function(e,t,n){!function(n){"use strict";var i=e("../libs/flyweight"),o=i.Module.extend({name:"Banner",initialize:function(){var e=this;e.state=n(".banner").length?1:0},closeBanner:function(e){"object"==typeof e&&e.preventDefault();var t="object"==typeof e?e.data.context:this,i=n(".banner"),o=i.height();n("body").removeClass("banner-on"),i.css({"margin-top":-o+"px"}),setTimeout(function(){i.remove()},550),t.state=0},events:{"click .banner .dismiss":"closeBanner"}});t.exports=o}(jQuery)},{"../libs/flyweight":2}],4:[function(e,t,n){!function(n){"use strict";var i;"function"==typeof e&&"function"!=typeof i&&(i=e("../libs/flyweight"));var o=i.Module.extend({name:"Forms",debug:!1,initialize:function(){var e=n(".info__form").data();this.formName=e.form},submit:function(e){e.preventDefault();var t=(e.data.context,n(this)),i=t.serialize(),o=t.data().id;n.post("/webform_ajax/"+o,i,function(e){var t=n.parseJSON(e);n(".info__form").html("<h2>"+t.title+"</h2><p>"+t.message+"</p>")})},placeHolderFocus:function(e){var t=n(this).closest(".form-item");t.find("label").hide()},placeHolderBlur:function(e){var t=n(this).closest(".form-item"),i=n(this).val();""===i&&t.find("label").show()},onDelegated:function(e){this.msg("events have been delegated!","warn")},events:{"submit .info__form form":"submit",'focus .info__form input[type="text"], .info__form textarea':"placeHolderFocus",'blur .info__form input[type="text"], .info__form textarea':"placeHolderBlur"}});t.exports=o}(jQuery)},{"../libs/flyweight":2}],5:[function(e,t,n){!function(n){"use strict";var i;"function"==typeof e&&"function"!=typeof i&&(i=e("../libs/flyweight"));var o=i.Module.extend({name:"Menu",debug:!0,options:{menu:0,delay:100,banner:{}},initialize:function(){var e=this,t=n(window).width();e.toggle=".nav__toggle",e.items=n(".overlay__item"),e.mobilewidth=700,n(window).resize(function(){var i=n(window).width();t!==i&&(1===e.menu&&e.closeMenu(),t=i)})},multiStepAnimation:function(e){var t=0;!function i(){n(e.selector)[e.method](e.steps[t]),t+=1,t<e.steps.length&&setTimeout(function(){i()},e.timeout)}()},moveItems:function(e,t,i){var o=this,a=t,r=o.itemsHeight*i,s=n(window).width(),l=o.mobilewidth,c=l>=s?2:3,u=l>=s?50:33.3333,d=l>=s?1:2;t%c===0&&t>d?a=0:(t-1)%c===0&&t>d?a=1:(t-2)%c===0&&t>d&&(a=2),n(e).css({top:r+"px",left:u*a+"%"})},openMenu:function(){var e=this,t=0,i=0,o=e.toggle,a=e.items,r=n(window).width(),s=e.mobilewidth,l=s>=r?2:3,c=n(".main-content").height();e.multiStepAnimation({selector:".overlay",steps:["pre","open"],timeout:100,method:"addClass"}),e.multiStepAnimation({selector:o,steps:["pre","open"],timeout:250,method:"addClass"}),n(".overlay__background").height(c),n.each(a,function(n,o){setTimeout(function(){n%l===0&&0!==n&&(i+=1),e.moveItems(o,n,i),n+1===a.length&&(e.menu=1)},t),t+=e.delay})},closeMenu:function(){var e=this,t=0,i=e.toggle,o=e.items,a=o.get().reverse();n(".overlay__background").height(0),n.each(a,function(a,r){setTimeout(function(){n(r).css({top:"100%",left:"100%"}),a+1===o.length&&(e.multiStepAnimation({selector:".overlay",steps:["open","pre"],timeout:500,method:"removeClass"}),e.multiStepAnimation({selector:i,steps:["open","pre"],timeout:250,method:"removeClass"}),e.menu=0)},t),t+=e.delay})},toggleMenu:function(e){e.preventDefault();var t=n(".overlay__item"),i=e.data.context;if(i.banner.hasOwnProperty("state")&&1===i.banner.state&&i.banner.closeBanner(),n(this).hasClass("home")){var o=n(".site__hero").height();return void n("html,body").animate({scrollTop:o},500)}i.itemsHeight=t.height(),0===i.menu?i.openMenu():1===i.menu&&i.closeMenu(),i.menu=2},blurImageHelper:function(e){var t=function(){var e=!1;return function(t){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4)))&&(e=!0)}(navigator.userAgent||navigator.vendor||window.opera),e};if(!t()){var i=navigator.userAgent.toLowerCase();-1!=i.indexOf("safari")&&i.indexOf("chrome")>-1;var o=n(this),a=({top:o.css("top"),left:o.css("left")},e.data.context,o.data()),r=o.width(),s=o.height();if(a.state&&a.state!==!1)a.state===!0&&(o.removeClass("hover-helper"),setTimeout(function(){o.find(".item__title").attr("style","")},500),a.state=!1);else{if(o.hasClass("hover-helper"))return;o.addClass("hover-helper"),o.find(".item__title").width(r).height(s),a.state=!0}}},events:{"click .nav__toggle":"toggleMenu","mouseenter .grid__item":"blurImageHelper","mouseleave .grid__item":"blurImageHelper","mouseenter .overlay__item":"blurImageHelper","mouseleave .overlay__item":"blurImageHelper"}});t.exports=o}(jQuery)},{"../libs/flyweight":2}],6:[function(e,t,n){!function(n){"use strict";var i=e("../libs/flyweight"),o=i.Module.extend({name:"Navigation",options:{banner:{}},initialize:function(){var e=this;this.baseUrl=window.location.protocol+"//"+window.location.host+"/",this.transitioning=!1,this.land=!0,this.where=i.history.getFragment(),this.cache={count:0,locs:[]},this.ignoreList=[".nav-tabs a","#admin-menu a",".nav__toggle",".footer__social a",".info__social a",".info__section a",".content__header a",".content__rows a",".banner a"],this.markIgnored(),n(window).on("popstate",function(t){return t.preventDefault(),e.land===!0?void(e.land=!1):void e.browserEvent.apply(e,[t])})},pageChange:function(e,t){var o=this,a=t.split("/")[0],r={next:"next",slideOut:"slide-out"};o.banner.hasOwnProperty("state")&&1===o.banner.state&&o.banner.closeBanner(),""===a?n(".nav__toggle").addClass("home"):n(".nav__toggle").removeClass("home"),o.land===!0&&(o.land=!1),n("body").addClass("loading"),o.transitioning=!0,n("html,body").animate({scrollTop:0},500),o.cache.locs[o.cache.count]=o.where,t===o.cache.locs[o.cache.count-1]?(r.next="inverse-next",r.slideOut="inverse-slide-out",0!==o.cache.count&&(o.cache.count-=1)):o.cache.count+=1,n.get(this.baseUrl+e,function(s){var l=n(s),c=l.filter(".main-content"),u=n(".main-content"),d=n(".main-content").clone().addClass(r.next).html(c.html()),h=750,m=l.filter("title").text();u.after(d).addClass("prepare"),"project"===a?d.addClass("-internal"):d.removeClass("-internal");setTimeout(function(){d.addClass("slide-in"),u.addClass(r.slideOut)},100),setTimeout(function(){u.remove(),d.removeClass(r.next+" slide-in"),n(document).trigger("pageChange",{route:a,path:t,title:m})},h);o.markIgnored(),o.transitioning=!1,document.title=m,o.where=t,i.history.navigate(e,{trigger:!0})},"html").fail(function(e,t){console.log(e.status)})},processClick:function(e){if(!n(this).hasClass("-ignored")){e.preventDefault();var t=e.data.context,o=n(this).attr("href"),a=i.history.getFragment(o);t.where!==a&&t.transitioning!==!0&&t.pageChange(o,a)}},browserEvent:function(e){var t=i.history.getFragment(),n=t,o=this;if(o.transitioning!==!0){var a=function(){var e=!1;return function(t){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4)))&&(e=!0)}(navigator.userAgent||navigator.vendor||window.opera),e};return a()?void(location.href="/"+n):void o.pageChange(n,t)}},markIgnored:function(e){var t=e||this.ignoreList;setTimeout(function(){n.each(t,function(e,t){var i=n(t);i.hasClass("-ignored")||i.addClass("-ignored")})},1e3)},events:{"click a":"processClick"}});t.exports=o}(jQuery)},{"../libs/flyweight":2}],7:[function(e,t,n){!function(n){"use strict";var i;"function"==typeof e&&"function"!=typeof i&&(i=e("../libs/flyweight"));var o=i.Module.extend({name:"Svg",el:".site__hero",initialize:function(){var e=n(this.el),t=n(this.el+" path");t&&this.prepare(t,e)},prepare:function(e,t){var i=this,o=e.length;n.each(e,function(n,a){var r=a.getTotalLength();a.style.strokeDasharray=r+" "+r,a.style.strokeDashoffset=r,a.getBoundingClientRect(),n+1===o&&(t.addClass("animate"),i.draw(e,t,o))})},draw:function(e,t,i){n.each(e,function(e,t){t.style.transition=t.style.WebkitTransition="stroke-dashoffset 2s ease-in-out",t.style.strokeDashoffset="0"}),setTimeout(function(){t.addClass("finished")},2e3)},events:{}});t.exports=o}(jQuery)},{"../libs/flyweight":2}]},{},[1]);