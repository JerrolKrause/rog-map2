(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{"9B2W":function(t,e,o){"use strict";o.d(e,"a",function(){return a});var i=o("CcnG"),a=function(){function t(){this.listingSelected=new i.EventEmitter}return t.prototype.ngOnInit=function(){},t}()},"CE6+":function(t,e,o){"use strict";o.d(e,"a",function(){return a});var i=function(){return(i=Object.assign||function(t){for(var e,o=1,i=arguments.length;o<i;o++)for(var a in e=arguments[o])Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t}).apply(this,arguments)},a=function(){function t(){}return t.prototype.markersAdd=function(t,e){t&&e&&e.length&&e.forEach(function(e){return e.addTo(t)})},t.prototype.heatMapAdd=function(t,e){t.addSource("heatmap",this.markersConvertToGeoJSON(e)),t.addLayer({id:"heatmap",type:"heatmap",source:"heatmap",paint:{"heatmap-color":["interpolate",["linear"],["heatmap-density"],0,"rgba(33,102,172,0)",.2,"rgb(103,169,207)",.4,"rgb(209,229,240)",.6,"rgb(253,219,199)",.8,"rgb(239,138,98)",1,"rgb(178,24,43)"],"heatmap-weight":["interpolate",["exponential",1.5],["zoom"],0,["interpolate",["linear"],["get","density"],0,0,25,1],18.1,["interpolate",["linear"],["get","density"],0,0,15,1]],"heatmap-radius":["interpolate",["linear"],["zoom"],0,2,9,20],"heatmap-intensity":["interpolate",["linear"],["zoom"],0,.25,.99,1,1,.25,1.99,1,2,.25,2.99,1,3,.25,3.99,1,4,.25,4.99,1,5,.25,5.99,1,6,.25,6.99,1,7,.25,7.99,1,8,.25,8.99,1,9,.25,9.99,1,10,.25,10.99,1,11,.25,11.99,1,12,.25,18.99,2],"heatmap-opacity":["interpolate",["exponential",1.5],["zoom"],16,1,18.1,.6]}},"water")},t.prototype.heatMapRemove=function(t){t&&void 0!==t.getLayer("heatmap")&&(t.removeLayer("heatmap"),t.removeSource("heatmap"))},t.prototype.clusterLayerAdd=function(t,e){this.clusterLayerRemove(t),t.addSource("clusters",i({},this.markersConvertToGeoJSON(e),{cluster:!0,clusterMaxZoom:14,clusterRadius:50})),t.addLayer({id:"cluster-layer",type:"circle",source:"clusters",filter:["has","point_count"],paint:{"circle-color":["step",["get","point_count"],"#ead499",100,"#c7ab5f",750,"#9a7c29"],"circle-radius":["step",["get","point_count"],20,100,30,750,40]}}),t.addLayer({id:"cluster-count",type:"symbol",source:"clusters",filter:["has","point_count"],layout:{"text-field":"{point_count_abbreviated}","text-font":["DIN Offc Pro Medium","Arial Unicode MS Bold"],"text-size":12}}),t.addLayer({id:"unclustered-point",type:"circle",source:"clusters",filter:["!",["has","point_count"]],paint:{"circle-color":"#11b4da","circle-radius":4,"circle-stroke-width":1,"circle-stroke-color":"#fff"}}),t.on("click","cluster-layer",function(e){var o=t.queryRenderedFeatures(e.point,{layers:["cluster-layer"]}),i=o[0].properties.cluster_id;t.getSource("clusters").getClusterExpansionZoom(i,function(e,i){e||t.flyTo({center:o[0].geometry.coordinates,zoom:i})})}),t.on("mouseenter","clusters",function(){t.getCanvas().style.cursor="pointer"}),t.on("mouseleave","clusters",function(){t.getCanvas().style.cursor=""})},t.prototype.clusterLayerRemove=function(t){t&&(void 0!==t.getLayer("unclustered-point")&&t.removeLayer("unclustered-point"),void 0!==t.getLayer("cluster-count")&&t.removeLayer("cluster-count"),void 0!==t.getLayer("cluster-layer")&&(t.removeLayer("cluster-layer"),t.removeSource("clusters")))},t.prototype.markersConvertToGeoJSON=function(t){return{type:"geojson",data:{type:"FeatureCollection",crs:{type:"name",properties:{name:"urn:ogc:def:crs:OGC:1.3:CRS84"}},features:t.map(function(t){return{type:"Feature",geometry:{type:"Point",coordinates:[t.longitude,t.latitude]}}})}}},t.prototype.mapFitBounds=function(t,e){t&&e&&e.length&&setTimeout(function(){t.rotateTo(0,{duration:500}),setTimeout(function(){var o=new window.mapboxgl.LngLatBounds;e.forEach(function(t){o.extend(t.getLngLat())}),t.fitBounds(o)},500)},100)},t.prototype.flyToLocation=function(t,e,o){setTimeout(function(){t.rotateTo(0,{duration:500}),setTimeout(function(){t.flyTo(i({center:e,zoom:10,pitch:0,speed:2.2,curve:1.42,easing:function(t){return t}},o))},500)},100)},t.prototype.markersCreate=function(t){return t.map(function(t){if(t.latitude&&t.longitude){var e=document.createElement("div");e.className=t.metadata&&t.metadata.iconClass?t.metadata.iconClass:"marker";var o=new window.mapboxgl.Marker(e).setLngLat([t.longitude,t.latitude]);return o.location=i({},t),o}})},t.prototype.createPopup=function(t,e){var o="";e.metadata&&e.metadata.title&&(o+="<h3>"+e.metadata.title+"</h3>"),e.metadata&&e.metadata.description&&(o+="<div>"+e.metadata.description+"</div>"),t.setPopup(new window.mapboxgl.Popup({offset:25}).setHTML(o))},t}()},L6tT:function(t,e,o){"use strict";o.d(e,"a",function(){return n});var i=o("CcnG"),a=o("26FU"),n=function(){function t(){this.listingSelected=new i.EventEmitter,this.locations$=new a.a(null),this.pageIndex=0,this.pageSize=10}return t.prototype.ngOnInit=function(){},t.prototype.ngOnChanges=function(){this.locations&&(this.pageIndex=0),this.locations$.next(this.locationsFilter(this.locations,this.pageIndex,this.pageSize))},t.prototype.pageChanged=function(t){this.pageIndex=t.pageIndex,this.pageSize=t.pageSize,this.locations$.next(this.locationsFilter(this.locations,this.pageIndex,this.pageSize))},t.prototype.modalLaunch=function(){},t.prototype.locationsFilter=function(t,e,o){if(t){var i=e*o,a=(e+1)*o-1;return t.filter(function(t,e){return e>=i&&e<=a})}},t}()},NpCv:function(t,e,o){"use strict";o.d(e,"a",function(){return a});var i=o("CcnG"),a=function(){function t(){this.heatMap=!0,this.submit=new i.EventEmitter,this.listingSelected=new i.EventEmitter,this.toggleSelected=new i.EventEmitter}return t.prototype.ngOnInit=function(){},t.prototype.propTypeChanged=function(t,e){var o={};o[e]=t.source.checked,this.formSearch.patchValue(o)},t.prototype.submitForm=function(t){this.submit.emit(this.formSearch.value),t.stopPropagation(),t.preventDefault()},t}()},cyqa:function(t,e,o){"use strict";o.d(e,"a",function(){return r});var i=o("mrSG"),a=o("idnu"),n=o("z9zS"),s=function(){return(s=Object.assign||function(t){for(var e,o=1,i=arguments.length;o<i;o++)for(var a in e=arguments[o])Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t}).apply(this,arguments)},r=function(){function t(t,e,o,i){this.fb=t,this.http=e,this.dialog=o,this.ref=i,this.sidebarMobileShow=!1,this.heatmap=!1,this.mapStyle="streets"}return t.prototype.ngOnInit=function(){var t=this;this.formSearch=this.fb.group({zip:[{value:"89147",disabled:!1},[]],isBrand:[!1,[]],priceLow:["",[]],priceHigh:["",[]],bedroomsMin:["",[]],bedroomsMax:["",[]],bathsMin:["",[]],bathsMax:["",[]],days_on_market:["2",[]],homeTypes:[null,[]],sqFootageMin:["",[]],sqFootageMax:["",[]],listing_status_active:[!0,[]],listing_status_pending:[!0,[]],listing_status_withdrawn:[!0,[]],listing_status_sold:[!0,[]],is_single_family:[!0,[]],is_multi_family:[!0,[]],is_townhouse:[!0,[]],is_condo:[!0,[]]}),this.formSearch.controls.zip.disable(),this.formSearch.valueChanges.subscribe(function(){t.locationsSearch()}),this.http.get("assets/mock-data/properties.json").subscribe(function(e){t.locationsOriginal=e.map(function(t){var e=t.office_name.toLowerCase().replace(/[^A-Z0-9]/gi,"");return s({},t,{metadata:{title:t.display_address,description:t.city+", "+t.county+" "+t.zip_code,iconClass:-1!==e.indexOf("realtyonegroup")?"marker rog ":null,isBrand:-1!==e.indexOf("realtyonegroup")},latitude:t.display_lat,longitude:t.display_lng})}),t.locationsSearch(),t.ref.markForCheck()})},t.prototype.listingSelected=function(t){this.flyTo={zoom:15.5,coords:[t.display_lng,t.display_lat]},this.modalOpen(t)},t.prototype.pinClicked=function(t){this.modalOpen(t)},t.prototype.modalOpen=function(t){this.listingModal=this.dialog.open(a.a,{width:"95%",maxHeight:"90vh",data:t})},t.prototype.locationsSearch=function(){var t=this.formSearch.getRawValue();this.locations=this.locationsOriginal.filter(function(e){if(""!==t.zip.toString()&&(e.zip_code.toString(),t.zip.toString()),!0===t.isBrand&&!0!==e.metadata.isBrand)return!1;var o=parseInt(e.listing_price.split(".")[0].replace(/[^a-zA-Z0-9]/g,""));if(""!==t.priceLow&&o<parseInt(t.priceLow))return!1;if(""!==t.priceHigh&&o>parseInt(t.priceHigh))return!1;if(""!==t.bedroomsMin&&e.total_bedrooms<parseInt(t.bedroomsMin))return!1;if(""!==t.bedroomsMax&&e.total_bedrooms>parseInt(t.bedroomsMax))return!1;if(""!==t.bathsMin&&e.total_bathrooms<parseInt(t.bathsMin))return!1;if(""!==t.bathsMax&&e.total_bathrooms>parseInt(t.bathsMax))return!1;if(""!==t.sqFootageMin&&e.square_feet<parseInt(t.sqFootageMin))return!1;if(""!==t.sqFootageMax&&e.square_feet>parseInt(t.sqFootageMax))return!1;if(""!==t.days_on_market){if("0"===t.days_on_market&&e.days_on_market>30)return!1;if("1"===t.days_on_market&&(e.days_on_market>60||e.days_on_market<=31))return!1;if("2"===t.days_on_market&&e.days_on_market<90)return!1}var i=!1;if(!0===t.listing_status_active&&"Active"===e.listing_status&&(i=!0),!0===t.listing_status_pending&&"Pending"===e.listing_status&&(i=!0),!0===t.listing_status_sold&&"Sold"===e.listing_status&&(i=!0),!0===t.listing_status_withdrawn&&"Withdrawn"===e.listing_status&&(i=!0),!i)return!1;var a=!1;return!1!==t.is_single_family&&""!==e.is_single_family&&(a=!0),!1!==t.is_multi_family&&""!==e.is_multi_family&&(a=!0),!1!==t.is_townhouse&&""!==e.is_townhouse&&(a=!0),!1!==t.is_condo&&""!==e.is_condo&&(a=!0),!!a}),this.sidebarMobileShow=!1,document.getElementById("map-container").scrollTo({top:0,behavior:"smooth"})},t.prototype.toggleSelected=function(t){switch(t.event){case"heatmap":this.heatmap=!this.heatmap;break;case"mapStyle":this.mapStyle=t.data}},t.prototype.ngOnDestroy=function(){},Object(i.__decorate)([Object(n.a)()],t)}()},idnu:function(t,e,o){"use strict";o.d(e,"a",function(){return i});var i=function(){function t(t,e,o){this.dialogRef=t,this.data=e,this.dataAlt=o}return t.prototype.ngOnInit=function(){},t.prototype.submit=function(){this.dialogRef.close(this.dataAlt||this.data)},t}()},ygIs:function(t,e,o){"use strict";o.d(e,"a",function(){return n});var i=o("CcnG"),a=(o("CE6+"),"pk.eyJ1Ijoicm9ndXNlciIsImEiOiJjanB1YzFrMmwwZjZnNDNxbGkwY28wdnI5In0.Xe4QgRnvsvP3WAncobSxqg"),n=function(){function t(t){var e=this;this.mapObjects=t,this.apiKey=a,this.zoom=15.5,this.style="streets",this.heatmap=!1,this.pinClicked=new i.EventEmitter,this.isLoaded=!1,this.uniqueId="map-box"+Math.floor(1e6*Math.random()),this.isRotating=!0,this.rotateTo=function(t){e.map.rotateTo(t/300%360,{duration:0}),e.isRotating&&requestAnimationFrame(e.rotateTo)}}return t.prototype.ngOnInit=function(){},t.prototype.ngOnChanges=function(t){t.style&&this.isLoaded&&this.map.setStyle("mapbox://styles/mapbox/"+this.style+"-v9"),this.isLoaded&&this.mapDisplayData(),t.flyTo&&this.isLoaded&&(this.isRotating=!1,this.mapObjects.flyToLocation(this.map,this.flyTo.coords,{zoom:15,speed:3}))},t.prototype.mapDisplayData=function(){var t=this;if(this.locations&&this.locations.length)this.heatmap&&this.locations?(this.mapObjects.clusterLayerRemove(this.map),this.heatMapAdd()):this.heatmap||(this.mapObjects.heatMapRemove(this.map),this.clusterMapAt&&this.map.getZoom()<this.clusterMapAt?(this.locationsRemove(),this.mapObjects.clusterLayerAdd(this.map,this.locations)):(this.mapObjects.clusterLayerRemove(this.map),this.locationsAdd(!1)));else{var e=function(e,o){t.locations=[{latitude:e,longitude:o}],t.locationsAdd(!1)};navigator.geolocation.getCurrentPosition(function(t){return e(t.coords.latitude,t.coords.longitude)},function(t){console.log(t),e(-115.172813,36.114647)})}},t.prototype.ngAfterViewInit=function(){this.scriptsLoad()},t.prototype.scriptsLoad=function(){var t=this;if(window.mapboxgl)this.mapInit(),this.isLoaded=!0;else{var e=document.createElement("script");e.type="text/javascript",e.src="https://api.mapbox.com/mapbox-gl-js/v0.52.0/mapbox-gl.js",e.onload=function(){t.mapInit()},document.head.appendChild(e)}},t.prototype.mapInit=function(){var t=this;!this.map&&document.getElementById(this.uniqueId)&&(window.mapboxgl.accessToken=this.apiKey,navigator.geolocation.getCurrentPosition(function(){t.mapCreate()},function(e){console.log(e),t.mapCreate()}))},t.prototype.mapCreate=function(){var t=this;this.map=new window.mapboxgl.Map({container:this.uniqueId,style:"mapbox://styles/mapbox/"+this.style+"-v9",zoom:this.zoom,center:[-115.156665,36.1383415],pitch:60}),this.map.once("click",function(){t.isRotating=!1,setTimeout(function(){t.mapObjects.mapFitBounds(t.map,t.markers)},100)}),this.map.on("load",function(){t.rotateTo(0),t.zoomLast=t.map.getZoom(),t.map.on("easeend",function(){console.log("ease end")}),t.map.on("zoomend",function(){var e=t.map.getZoom();(e>=t.clusterMapAt&&t.zoomLast<=t.clusterMapAt||e<=t.clusterMapAt&&t.zoomLast>=t.clusterMapAt)&&t.mapDisplayData(),t.zoomLast=e}),t.mapDisplayData(),t.map.addLayer({id:"3d-buildings",source:"composite","source-layer":"building",filter:["==","extrude","true"],type:"fill-extrusion",paint:{"fill-extrusion-color":"#aaa","fill-extrusion-height":["interpolate",["linear"],["zoom"],15,0,15.05,["get","height"]],"fill-extrusion-base":["interpolate",["linear"],["zoom"],15,0,15.05,["get","min_height"]],"fill-extrusion-opacity":.6}}),t.isLoaded=!0})},t.prototype.heatMapAdd=function(){this.locationsRemove(),this.mapObjects.heatMapRemove(this.map),this.mapObjects.heatMapAdd(this.map,this.locations),this.markers=this.mapObjects.markersCreate(this.locations),this.mapObjects.mapFitBounds(this.map,this.markers)},t.prototype.locationsAdd=function(t){var e=this;void 0===t&&(t=!0),this.locations&&this.locations.length?(this.locationsRemove(),this.markers=this.mapObjects.markersCreate(this.locations),this.markers.forEach(function(t){t.getElement().addEventListener("click",function(o){e.isRotating=!1,e.pinClicked.emit(t.location),o.stopPropagation()})}),this.mapObjects.markersAdd(this.map,this.markers),t&&this.mapObjects.mapFitBounds(this.map,this.markers)):this.locationsRemove()},t.prototype.locationsRemove=function(){this.markers&&this.markers.length&&this.markers.forEach(function(t){return t.remove()})},t}()}}]);