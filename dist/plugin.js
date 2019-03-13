"use strict";W.loadPlugin({name:"windy-plugin-sounding",version:"0.4.0",author:"Victor Berchet",repository:{type:"git",url:"git+https://github.com/vicb/windy-plugins"},description:"Soundings for paraglider pilots.",displayName:"Better Sounding",hook:"contextmenu",dependencies:["https://cdn.jsdelivr.net/npm/d3@5/dist/d3.min.js","https://cdn.jsdelivr.net/npm/preact@8/dist/preact.min.js"],className:"drop-down-window ",classNameMobile:"drop-down-window down",attachPoint:".leaflet-popup-pane",attachPointMobile:"#plugins"},"<h3>Sounding forecast <span id=\"sounding-model\"></span></h3> <div id=\"sounding-chart\"></div>","#windy-plugin-sounding{font-size:12px;padding:.5em .7em;line-height:2;z-index:100;width:600px;height:650px;margin-left:-10px}#windy-plugin-sounding h3{margin:0 0 .3em .6em}#windy-plugin-sounding .closing-x{display:block}#windy-plugin-sounding section{margin-left:10px;line-height:1.5}#windy-plugin-sounding section span:not(:first-child){margin-left:1em}#windy-plugin-sounding section:first-of-type{color:black}#windy-plugin-sounding section:last-of-type{font-size:.9em}#windy-plugin-sounding section [data-ref=\"modelAlt\"].red{color:red}#windy-plugin-sounding [data-ref=\"zoom\"]{position:absolute;right:20px;bottom:15px;font-size:25px;color:#9d0300}@media only screen and (max-device-width:736px){#windy-plugin-sounding{display:block;left:0;top:0;right:0;width:calc(100% - 20px);margin:10px}}#windy-plugin-sounding .axis path,#windy-plugin-sounding .axis line{fill:none;stroke:#000;shape-rendering:crispEdges}#windy-plugin-sounding #sounding-chart{height:600px;position:relative}#windy-plugin-sounding #sounding-chart svg{width:100%;height:100%}#windy-plugin-sounding #sounding-chart .infoLine .dewpoint{fill:steelblue}#windy-plugin-sounding #sounding-chart .infoLine .temp{fill:red}#windy-plugin-sounding #sounding-chart .zoomButton{cursor:pointer}",function(){var a,b=this,d=W.require("windy-plugin-sounding/soundingGraph"),e=W.require("store"),f=W.require("pluginDataLoader"),g=W.require("map"),h=W.require("rootScope"),c=f({key:"QKlmnpLWr2rZSyFaT7LpxZc0d5bo34D4",plugin:"windy-plugin-sounding"}),i=null;this.onopen=function(f){var k,l;if(!f){var q=g.getCenter();k=q.lat,l=q.lng}else k=f.lat,l=f.lon;var m={lng:l,lat:k},n=g.latLngToLayerPoint(m),o=n.x,p=n.y;if(!h.isMobile)b.node.style.position="absolute",b.node.style.left="".concat(o-15,"px"),b.node.style.top="".concat(p+15,"px");else{var c=b.node.clientHeight;g.center({lat:k,lon:l},!1).panBy([0,-.5*c+50])}i?i.setLatLng(m):i=L.marker(m,{icon:g.myMarkers.pulsatingIcon,zIndexOffset:-300}).addTo(g),d.init(b.refs),j(k,l),null!=a&&e.off(a),a=e.on("product",function(){return j(k,l)}),b.node.oncontextmenu=b.node.ondblclick=b.node.onclick=function(a){return a.stopPropagation()}};var j=function(a,b){var f=/gfs|ecmwf|nam\w+/,g=e.get("product");f.test(g)||(g="ecmwf"),document.getElementById("sounding-model").innerText=g.toUpperCase();var h={model:g,lat:a,lon:b};c("airData",h).then(function(c){d.load(a,b,c.data)})};this.onclose=function(){null!=a&&(e.off(a),a=null),i&&(g.removeLayer(i),i=null)}}),W.define("windy-plugin-sounding/soundingGraph",["overlays","store","$","utils","windy-plugin-sounding/soundingUtils"],function(a,b,c,e,d){var j=Math.round,k=Math.pow;function f(){var a=Number.MIN_VALUE,b=Number.MAX_VALUE,c=b,f=a,g=b,h=a,i=b,j=a,k=a,r=function(a){var b=G.data[a];b.forEach(function(a,d){var l=Math.max,m=Math.min;0==d&&(g=m(g,a.gh),j=l(j,a.pressure)),d==b.length-1&&(h=l(h,a.gh),i=m(i,a.pressure)),c=m(c,a.dewpoint),f=l(f,a.temp);var n=e.wind2obj([a.wind_u,a.wind_v]).wind;k=l(k,n)})};for(var s in G.data)r(s);c=243,f=303,l.domain([c,f]),o.domain([I(c),I(f)]),n.domain([0,30/3.6,k]),n.range([0,50,100]),p.domain([0,30,J(k)]),p.range([0,50,100]),m.domain([j,i]),q.domain([M(g),M(h)])}function g(a,b,c,d){var e=a.data["".concat(b,"-").concat(c)];return Array.isArray(e)?e[d]:null}function i(a,b,c,d){var e=g(a,"gh",b,c);if(null!=e)return e;var f=-.0065,h=288.15/f*(k(d/1013.25,-f*287.053/9.80665)-1);return j(h)}var l,m,n,o,p,q,r,s,t,u,v,w,x,y,z=c("#sounding-chart"),A=100,B=z.clientWidth-100-20-15,C=z.clientHeight-20,D=preact,E=D.h,h=D.render,F=.4,G={lat:0,lon:0,elevation:0,data:{}},H=[],I=a.temp.convertNumber,J=a.wind.convertNumber,K=a.pressure.convertNumber,M=function(b){return j("ft"===a.cloudtop.metric?3.28084*b:b)},N=function(){if(!l){l=d3.scaleLinear().range([0,B]),n=d3.scaleLinear().range([0,A]),m=d3.scaleLog().range([C,0]),o=d3.scaleLinear().range([0,B]),q=d3.scaleLinear().range([C,0]),p=d3.scaleLinear().range([0,A]),r=d3.axisBottom(o).ticks(5,"-d"),t=d3.axisRight(q).ticks(10,"d"),s=d3.axisBottom(p).ticks(4,"d"),u=d3.line().x(function(a){return l(a.temp)+F*(C-m(a.pressure))}).y(function(a){return m(a.pressure)}),v=d3.line().x(function(a){return l(a.dewpoint)+F*(C-m(a.pressure))}).y(function(a){return m(a.pressure)}),w=d3.line().x(function(a){return n(e.wind2obj([a.wind_u,a.wind_v]).wind)}).y(function(a){return m(a.pressure)});var a=function(a){var b=a.temp;if(0==F)return null;var c=l(b+273);return E("line",{x1:c,y1:C,x2:B,y2:C-(B-c)/F,stroke:"darkred","stroke-width":"0.2"})},c=function(a){for(var b=Math.log,c=a.q,d=[],e=C/6,f=C;f>-e;f-=e){var g=m.invert(f),h=k(b(g*c/(c+622)/6.11),-1),i=273+k(17.269/237.3*(h-1/17.269),-1);d.push({t:i,p:g})}var j=d3.line().x(function(a){return l(a.t)+F*(C-m(a.p))}).y(function(a){return m(a.p)});return E("path",{fill:"none",stroke:"blue","stroke-width":"0.3","stroke-dasharray":"2",d:j(d)})},d=function(a){for(var b=a.temp,c=[],d=m.domain()[0],e=C/15,f=C;f>-e;f-=e){var g=m.invert(f),h=(b+273)*k(d/g,-287/1030);c.push({t:h,p:g})}var i=d3.line().x(function(a){return l(a.t)+F*(C-m(a.p))}).y(function(a){return m(a.p)});return E("path",{fill:"none",stroke:"green","stroke-width":"0.3",d:i(c)})},f=function(a){for(var b=Math.exp,c=a.temp,d=[],e=m.domain()[0],f=1030,g=25e5,h=287,i=c+273,j=e,k=C/15,n=C;n>-k;n-=k){var o=m.invert(n),p=g/461*(1/273-1/i),q=6.11*b(p)*(.622/o),r=g*q/(h*i),s=h*i/(f*o)*(1+r),u=1+r*(1555000/(f*i));i-=s/u*(j-o),j=o,d.push({t:i,p:o})}var v=d3.line().x(function(a){return l(a.t)+F*(C-m(a.p))}).y(function(a){return m(a.p)});return E("path",{fill:"none",stroke:"green","stroke-width":"0.3","stroke-dasharray":"3 5",d:v(d)})},g=function(a){var b=a.wind_u,c=a.wind_v,d=a.y,f=e.wind2obj([b,c]);return E("g",null,1<f.wind?E("g",{transform:"translate(0,".concat(d,") rotate(").concat(f.dir,")"),stroke:"black",fill:"none"},E("line",{y2:"-30"}),E("polyline",{points:"-5,-10 0,0 5,-10","stroke-linejoin":"round"})):E("g",{transform:"translate(0,".concat(d,")"),stroke:"black",fill:"none"},E("circle",{r:"6"}),E("circle",{r:"1"})))},i=function(a){var b=a.elevation;if(null==b)return null;var c=j(q(b));return c>=C?null:E("rect",{y:c,width:B+30+A,height:C-c,fill:"brown",opacity:"0.2"})};x=function(){var b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},e=b.data,h=b.elevation;return E("svg",{id:"sounding"},E("defs",null,E("clipPath",{id:"clip-chart"},E("rect",{x:"0",y:"0",width:B,height:C+20}))),e?E("g",null,E(i,{elevation:h}),E("g",{class:"wind"},E("g",{class:"chart",transform:"translate(".concat(B+30,",0)")},E("g",{class:"x axis",transform:"translate(0,".concat(C,")"),ref:function b(a){return d3.select(a).call(s)}}),E("line",{y1:C,y2:"0",stroke:"black","stroke-width":"0.2","stroke-dasharray":"3"}),E("line",{y1:C,x1:n(15/3.6),y2:"0",x2:n(15/3.6),stroke:"black","stroke-width":"0.2","stroke-dasharray":"3"}),E("rect",{x:A/2,width:A/2,height:C,fill:"red",opacity:"0.1"}),E("g",{class:"chartArea","clip-path":"url(#clip-chart)"},E("path",{class:"temperature chart",fill:"none",stroke:"purple","stroke-linejoin":"round","stroke-linecap":"round","stroke-width":"1.5",d:w(e)}),E("g",{transform:"translate(".concat(A/2,",0)")},e.map(function(a){return E(g,{wind_u:a.wind_u,wind_v:a.wind_v,y:m(a.pressure)})}))))),E("g",{class:"chart",transform:"translate(10,0)"},E("g",{class:"axis"},E("g",{class:"x axis",transform:"translate(0,".concat(C,")"),ref:function b(a){return d3.select(a).call(r)}}),E("g",{class:"y axis",y:C+16,ref:function b(a){return d3.select(a).call(t)}})),E("g",{class:"chartArea","clip-path":"url(#clip-chart)","stroke-linejoin":"round","stroke-linecap":"round"},E("rect",{class:"overlay",width:B,height:C,opacity:"0"}),E("path",{class:"temperature chart",fill:"none",stroke:"red","stroke-width":"1.5",d:u(e)}),E("path",{class:"dewpoint chart",fill:"none",stroke:"steelblue","stroke-width":"1.5",d:v(e)}),[-70,-60,-50,-40,-30,-20,-10,0,10,20].map(function(b){return E(a,{temp:b})}),[-20,-10,0,5,10,15,20,25,30,40,50,60,70,80].map(function(a){return E(d,{temp:a})}),[-20,-10,0,5,10,15,20,25,30,35].map(function(a){return E(f,{temp:a})}),[.01,.1,.5,1,2,5,8,12,16,20].map(function(a){return E(c,{q:a})})))):E("text",{x:"50%",y:"50%","text-anchor":"middle"},"No Data"))},y=h(E(x,{display:"block",elevation:"0"}),z,y),b.on("timestamp",O)}},O=function(){if(H=null,G.data){var a,c,e=b.get("timestamp"),f=Object.getOwnPropertyNames(G.data).sort(function(c,a){return+c<+a?-1:1}),g=f.findIndex(function(a){return a>=e});-1<g&&(0==g?a=c=f[0]:(a=f[g-1],c=f[g]),H=d.interpolateArray(G.data[a],G.data[c],c==a?0:(e-a)/(c-a)))}y=h(E(x,{data:H,elevation:G.elevation,display:"block"}),z,y)};return{load:function n(a,b,c){var d=c.data.hours,e=new Set,h=new Set;for(var o in c.data){var p=o.match(/([^-]+)-(.+)h$/);null!==p&&(e.add(p[1]),h.add(+p[2]))}var j=Array.from(h).filter(function(a){return 300<a}).sort(function(c,a){return+c<+a?1:-1}),k={};d.forEach(function(a,b){k[a]=[],j.forEach(function(d){var e="".concat(d,"h"),f=i(c,e,b,d);k[a].push({temp:g(c,"temp",e,b),dewpoint:g(c,"dewpoint",e,b),gh:f,wind_u:g(c,"wind_u",e,b),wind_v:g(c,"wind_v",e,b),pressure:d})})}),G.lat=a,G.lon=b,G.data=k;var l=null==c.header.elevation?0:c.header.elevation;null==c.header.modelElevation&&(l=c.header.modelElevation),G.elevation=l,f(G),O()},init:N}}),W.define("windy-plugin-sounding/soundingUtils",[],function(){function a(a,b,c){var d={},e=Object.getOwnPropertyNames(a);return e.forEach(function(e){d[e]=(1-c)*a[e]+c*b[e]}),d}return{interpolateArray:function(b,c,d){var e=[];return b.forEach(function(b,f){var g=b.pressure,h=0==f?c[0]:c.find(function(a){return a.pressure==g});h&&e.push(a(b,h,d))}),e},interpolatePoint:a}});