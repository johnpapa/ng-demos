!function(){"use strict";angular.module("app",["app.core","app.widgets","app.avengers","app.dashboard","app.layout"])}(),function(){"use strict";angular.module("app.avengers",[])}(),function(){"use strict";angular.module("app.core",["ngAnimate","ngSanitize","blocks.exception","blocks.logger","blocks.router","ui.router","ngplus"])}(),function(){"use strict";angular.module("app.dashboard",[])}(),function(){"use strict";angular.module("app.layout",[])}(),function(){"use strict";angular.module("app.widgets",[])}(),function(){"use strict";angular.module("blocks.exception",["blocks.logger"])}(),function(){"use strict";angular.module("blocks.logger",[])}(),function(){"use strict";angular.module("blocks.router",["ui.router","blocks.logger"])}(),function(){"use strict";function n(n,e){function t(){return a().then(function(){e.info("Activated Avengers View")})}function a(){return n.getAvengers().then(function(n){return r.avengers=n,r.avengers})}var r=this;r.avengers=[],r.title="Avengers",t()}angular.module("app.avengers").controller("Avengers",n),n.$inject=["dataservice","logger"]}(),function(){"use strict";function n(n){n.configureStates(e())}function e(){return[{state:"avengers",config:{url:"/avengers",templateUrl:"app/avengers/avengers.html",controller:"Avengers",controllerAs:"vm",title:"avengers",settings:{nav:2,content:'<i class="fa fa-lock"></i> Avengers'}}}]}angular.module("app.avengers").run(n),n.$inject=["routerHelper"]}(),function(){"use strict";function n(n){n.options.timeOut=4e3,n.options.positionClass="toast-bottom-right"}function e(n,e,t,r,i){function s(){var n={ready:["dataservice",function(n){return n.ready()}]};r.configure({$stateProvider:e,$urlRouterProvider:t,docTitle:"NG-Modular: ",resolveAlways:n})}n.debugEnabled&&n.debugEnabled(!0),i.config.appErrorPrefix=a.appErrorPrefix,s()}var t=angular.module("app.core");t.config(n),n.$inject=["toastr"];var a={appErrorPrefix:"[NG-Modular Error] ",appTitle:"Angular Modular Demo",version:"1.0.0"};t.value("config",a),t.config(e),e.$inject=["$logProvider","$stateProvider","$urlRouterProvider","routerHelperProvider","exceptionConfigProvider"]}(),function(){"use strict";angular.module("app.core").constant("toastr",toastr).constant("moment",moment)}(),function(){"use strict";function n(n,e,t,a,r){function i(){function t(n){return n.data[0].data.results}return n.get("/api/maa").then(t).catch(function(n){a.catcher("XHR Failed for getAvengers")(n),e.url("/")})}function s(){function n(n){return e=n.length,t.when(e)}var e=0;return o().then(n).catch(a.catcher("XHR Failed for getAvengerCount"))}function o(){var n=[{name:"Robert Downey Jr.",character:"Tony Stark / Iron Man"},{name:"Chris Hemsworth",character:"Thor"},{name:"Chris Evans",character:"Steve Rogers / Captain America"},{name:"Mark Ruffalo",character:"Bruce Banner / The Hulk"},{name:"Scarlett Johansson",character:"Natasha Romanoff / Black Widow"},{name:"Jeremy Renner",character:"Clint Barton / Hawkeye"},{name:"Gwyneth Paltrow",character:"Pepper Potts"},{name:"Samuel L. Jackson",character:"Nick Fury"},{name:"Paul Bettany",character:"Jarvis"},{name:"Tom Hiddleston",character:"Loki"},{name:"Clark Gregg",character:"Agent Phil Coulson"}];return t.when(n)}function l(){function n(){u=!0,r.info("Primed data")}return d?d:d=t.when(!0).then(n)}function c(n){var e=d||l();return e.then(function(){return t.all(n)}).catch(a.catcher('"ready" function failed'))}var d,u=!1,v={getAvengersCast:o,getAvengerCount:s,getAvengers:i,ready:c};return v}angular.module("app.core").factory("dataservice",n),n.$inject=["$http","$location","$q","exception","logger"]}(),function(){"use strict";function n(n){n.configureStates(e(),"/")}function e(){return[{state:"dashboard",config:{url:"/",templateUrl:"app/dashboard/dashboard.html",controller:"Dashboard",controllerAs:"vm",title:"dashboard",settings:{nav:1,content:'<i class="fa fa-dashboard"></i> Dashboard'}}}]}angular.module("app.dashboard").run(n),n.$inject=["routerHelper"]}(),function(){"use strict";function n(n,e,t){function a(){var e=[r(),i()];return n.all(e).then(function(){t.info("Activated Dashboard View")})}function r(){return e.getAvengerCount().then(function(n){return s.avengerCount=n,s.avengerCount})}function i(){return e.getAvengersCast().then(function(n){return s.avengers=n,s.avengers})}var s=this;s.news={title:"Marvel Avengers",description:"Marvel Avengers 2 is now in production!"},s.avengerCount=0,s.avengers=[],s.title="Dashboard",a()}angular.module("app.dashboard").controller("Dashboard",n),n.$inject=["$q","dataservice","logger"]}(),function(){"use strict";function n(n,e,t){function a(){t.success(e.appTitle+" loaded!",null),r()}function r(){n(function(){i.showSplash=!1},1e3)}var i=this;i.title=e.appTitle,i.busyMessage="Please wait ...",i.isBusy=!0,i.showSplash=!0,a()}angular.module("app.layout").controller("Shell",n),n.$inject=["$timeout","config","logger"]}(),function(){"use strict";function n(n,e){function t(){a()}function a(){s&&0!==s.length&&(i.navStates=s.filter(function(n){return n.settings&&n.settings.nav}).sort(function(n,e){return n.settings.nav-e.settings.nav}))}function r(e){if(!e.title||!n.current||!n.current.title)return"";var t=e.title;return n.current.title.substr(0,t.length)===t?"current":""}var i=this,s=e.getStates();i.isCurrent=r,t()}angular.module("app.layout").controller("Sidebar",n),n.$inject=["$state","routerHelper"]}(),function(){"use strict";function n(){function n(n,e){function t(e){var t="dropy";e.preventDefault(),r.hasClass(t)?r.hasClass(t)&&(r.removeClass(t),a.slideUp(350,n.whenDoneAnimating)):(a.slideDown(350,n.whenDoneAnimating),r.addClass(t))}var a=e.find(".sidebar-inner"),r=e.find(".sidebar-dropdown a");e.addClass("sidebar"),r.click(t)}var e={link:n,restrict:"A",scope:{whenDoneAnimating:"&?"}};return e}angular.module("app.widgets").directive("ccSidebar",n)}(),function(){"use strict";function n(n){function e(e,t,a){e.spinner=null,e.$watch(a.ccSpinner,function(a){e.spinner&&e.spinner.stop(),e.spinner=new n.Spinner(a),e.spinner.spin(t[0])},!0)}var t={link:e,restrict:"A"};return t}angular.module("app.widgets").directive("ccSpinner",n),n.$inject=["$window"]}(),function(){"use strict";function n(){function n(n,e,t){function a(n){n.preventDefault(),e.parent().parent().parent().hide(100)}t.$set("href","#"),t.$set("wclose"),e.click(a)}var e={link:n,template:'<i class="fa fa-remove"></i>',restrict:"A"};return e}angular.module("app.widgets").directive("ccWidgetClose",n)}(),function(){"use strict";function n(){var n={scope:{title:"@",subtitle:"@",rightText:"@",allowCollapse:"@"},templateUrl:"app/widgets/widgetheader.html",restrict:"A"};return n}angular.module("app.widgets").directive("ccWidgetHeader",n)}(),function(){"use strict";function n(){function n(n,e,t){function a(n){n.preventDefault();var t=e.parent().parent().next(".widget-content"),a=e.children("i");t.is(":visible")?(a.removeClass("fa fa-chevron-up"),a.addClass("fa fa-chevron-down")):(a.removeClass("fa fa-chevron-down"),a.addClass("fa fa-chevron-up")),t.toggle(500)}t.$set("href","#"),t.$set("wminimize"),e.click(a)}var e={link:n,template:'<i class="fa fa-chevron-up"></i>',restrict:"A"};return e}angular.module("app.widgets").directive("ccWidgetMinimize",n)}(),function(){"use strict";function n(n,e){function t(t,a,r){e.error(t,r),n.error("Error: "+t,a)}function a(t,a,r){e.info(t,r),n.info("Info: "+t,a)}function r(t,a,r){e.success(t,r),n.info("Success: "+t,a)}function i(t,a,r){e.warning(t,r),n.warn("Warning: "+t,a)}var s={showToasts:!0,error:t,info:a,success:r,warning:i,log:n.log};return s}angular.module("blocks.logger").factory("logger",n),n.$inject=["$log","toastr"]}(),function(){"use strict";function n(){function n(n,t,a,r){function i(n,t){n.forEach(function(n){n.config.resolve=angular.extend(n.config.resolve||{},e.resolveAlways),g.state(n.state,n.config)}),t&&!u&&(u=!0,p.otherwise(t))}function s(){t.$on("$stateChangeError",function(e,t,a,i,s,o){if(!d){v.errors++,d=!0;var l=t&&(t.title||t.name||t.loadedTemplateUrl)||"unknown target",c="Error routing to "+l+". "+(o.data||"")+". <br/>"+(o.statusText||"")+": "+(o.status||"");r.warning(c,[t]),n.path("/")}})}function o(){s(),c()}function l(){return a.get()}function c(){t.$on("$stateChangeSuccess",function(n,a){v.changes++,d=!1;var r=e.docTitle+" "+(a.title||"");t.title=r})}var d=!1,u=!1,v={errors:0,changes:0},g=e.$stateProvider,p=e.$urlRouterProvider,f={configureStates:i,getStates:l,stateCounts:v};return o(),f}var e={$stateProvider:void 0,$urlRouterProvider:void 0,docTitle:void 0,resolveAlways:void 0};this.configure=function(n){e.$stateProvider=n.$stateProvider,e.$urlRouterProvider=n.$urlRouterProvider,e.docTitle=n.docTitle,e.resolveAlways=n.resolveAlways},this.$get=["$location","$rootScope","$state","logger",function(e,t,a,r){return new n(e,t,a,r)}],this.$get.$inject=["$location","$rootScope","$state","logger"]}angular.module("blocks.router").provider("routerHelper",n)}(),function(){"use strict";function n(){this.config={},this.$get=function(){return{config:this.config}}}function e(n){n.decorator("$exceptionHandler",t)}function t(n,e,t){var a=e.config.appErrorPrefix||"";return function(e,r){n(e,r);var i={exception:e,cause:r},s=a+e.message;t.error(s,i)}}angular.module("blocks.exception").provider("exceptionConfig",n).config(e),e.$inject=["$provide"],t.$inject=["$delegate","exceptionConfig","logger"]}(),function(){"use strict";function n(n){function e(e){return function(t){n.error(e,t)}}var t={catcher:e};return t}angular.module("blocks.exception").factory("exception",n),n.$inject=["logger"]}(),angular.module("app.core").run(["$templateCache",function(n){n.put("app/avengers/avengers.html",'<section class="mainbar">\n    <section class="matter">\n        <div class="container">\n            <div class="row">\n                <div class="widget wblue">\n                    <div data-cc-widget-header title="{{vm.title}}"></div>\n                    <div class="widget-content user">\n                        <!--<pre>{{vm.avengers.data | json}}</pre>-->\n\n                        <input data-ng-model="vm.filter.name" placeholder="Find Avengers by name" type="search"/>\n                        <table class="table table-condensed table-striped">\n                            <thead>\n                            <tr>\n                                <th></th>\n                                <th>Character</th>\n                                <th>Description</th>\n                            </tr>\n                            </thead>\n                            <tbody>\n                            <tr data-ng-repeat="c in vm.avengers | filter:vm.filter track by c.id">\n                                <td><img\n                                        ng-src="{{c.thumbnail.path}}.{{c.thumbnail.extension}}"\n                                        class="avenger-thumb img-rounded"/></td>\n                                <td><span class="avenger-name">{{c.name}}</span></td>\n                                <td>{{c.description | limitTo: 2000 }} ...</td>\n                            </tr>\n                            </tbody>\n                        </table>\n                    </div>\n                    <div class="widget-foot">\n                        <div class="clearfix"></div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </section>\n</section>\n'),n.put("app/dashboard/dashboard.html",'<section id="dashboard-view" class="mainbar">\n    <section class="matter">\n        <div class="container">\n            <div class="row">\n                <div class="col-md-12">\n                    <ul class="today-datas">\n                        <li class="blightblue">\n                            <div class="pull-left"><i class="fa fa-plane"></i></div>\n                            <div class="datas-text pull-right">\n                                <span class="bold">Stark Tower</span> New York, New York\n                            </div>\n                            <div class="clearfix"></div>\n                        </li>\n\n                        <li class="bblue">\n                            <div class="pull-left avenger-logo"></div>\n                            <div class="datas-text pull-right">\n                                <span class="bold">{{vm.avengerCount}}</span> Cast\n                            </div>\n                            <div class="clearfix"></div>\n                        </li>\n\n                    </ul>\n                </div>\n            </div>\n            <div class="row">\n                <div class="col-md-6">\n                    <div class="widget wblue">\n                        <div data-cc-widget-header title="Avengers Movie Cast"\n                             allow-collapse="true"></div>\n                        <div class="widget-content text-center text-info">\n                            <table class="table table-condensed table-striped">\n                                <thead>\n                                    <tr>\n                                        <th>Name</th>\n                                        <th>Character</th>\n                                    </tr>\n                                </thead>\n                                <tbody>\n                                    <tr data-ng-repeat="a in vm.avengers">\n                                        <td>{{a.name}}</td>\n                                        <td>{{a.character}}</td>\n                                    </tr>\n                                </tbody>\n                            </table>\n                        </div>\n                        <div class="widget-foot">\n                            <div class="clearfix"></div>\n                        </div>\n                    </div>\n                </div>\n                <div class="col-md-6">\n                    <div class="widget wlightblue">\n                        <div data-cc-widget-header title="{{vm.news.title}}"\n                             allow-collapse="true"></div>\n                        <div class="widget-content text-center text-info">\n                            <small>{{vm.news.description}}</small>\n                        </div>\n                        <div class="widget-foot">\n                            <div class="clearfix"></div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </section>\n</section>'),n.put("app/layout/shell.html",'<div data-ng-controller="Shell as vm">\n    <div id="splash-page" data-ng-show="vm.showSplash" class="dissolve-animation">\n        <div class="page-splash">\n            <div class="page-splash-message">\n                Modular Demo\n            </div>\n        </div>\n    </div>\n\n    <header class="clearfix">\n        <div data-ng-include="\'app/layout/topnav.html\'"></div>\n    </header>\n    <section id="content" class="content">\n        <div data-ng-include="\'app/layout/sidebar.html\'"></div>\n\n        <div data-ui-view class="shuffle-animation"></div>\n\n        <div ngplus-overlay\n             ngplus-overlay-delay-in="50"\n             ngplus-overlay-delay-out="700"\n             ngplus-overlay-animation="dissolve-animation">\n            <img src="../../content/images/busy.gif"/>\n\n            <div class="page-spinner-message overlay-message">{{vm.busyMessage}}</div>\n        </div>\n    </section>\n</div>\n\n\n'),n.put("app/layout/sidebar.html",'<div data-cc-sidebar when-done-animating="vm.sidebarReady()" data-ng-controller="Sidebar as vm">\n    <div class="sidebar-filler"></div>\n    <div class="sidebar-dropdown"><a href="#">Menu</a></div>\n    <div class="sidebar-inner">\n        <div class="sidebar-widget"></div>\n        <ul class="navi">\n            <li class="nlightblue fade-selection-animation" data-ng-class="vm.isCurrent(state)"\n                data-ng-repeat="state in vm.navStates">\n                <a ui-sref="{{state.name}}"\n                   data-ng-bind-html="state.settings.content"></a>\n            </li>\n        </ul>\n    </div>\n</div>\n'),n.put("app/layout/topnav.html",'<nav class="navbar navbar-fixed-top navbar-inverse">\n    <div class="navbar-header">\n        <a href="/" class="navbar-brand"><span class="brand-title">{{vm.title}}</span></a>\n        <a class="btn navbar-btn navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">\n            <span class="icon-bar"></span>\n            <span class="icon-bar"></span>\n            <span class="icon-bar"></span>\n        </a>\n    </div>\n    <div class="navbar-collapse collapse">\n        <div class="pull-right navbar-logo">\n            <ul class="nav navbar-nav pull-right">\n                <li>\n                    <a href="http://www.johnpapa.net/hottowel-angular" target="_blank">\n                        Created by John Papa\n                    </a>\n                </li>\n                <li class="dropdown dropdown-big">\n                    <a href="http://www.angularjs.org" target="_blank">\n                        <img src="content/images/AngularJS-small.png" />\n                    </a>\n                </li>\n                <li>\n                    <a href="http://developer.marvel.com/" target="_blank">Marvel API</a>\n                </li>\n            </ul>\n        </div>\n    </div>\n</nav>'),n.put("app/widgets/widgetheader.html",'<div class="widget-head">\n    <div class="page-title pull-left">{{title}}</div>\n    <small class="page-title-subtle" data-ng-show="subtitle">({{subtitle}})</small>\n    <div class="widget-icons pull-right" data-ng-if="allowCollapse">\n        <a data-cc-widget-minimize></a>\n    </div>\n    <small class="pull-right page-title-subtle" data-ng-show="rightText">{{rightText}}</small>\n    <div class="clearfix"></div>\n</div>')}]);