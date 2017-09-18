<%@ page language="C#" autoeventwireup="true" CodeFile="iShop.aspx.cs" inherits="uxlcorp.iShop" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--
 Copyright 2008 Google Inc.
 Licensed under the Apache License, Version 2.0:
 http://www.apache.org/licenses/LICENSE-2.0
 -->
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
<meta name="Expires" value="0">
<meta name="Pragma" value="no-cache">
<meta name="cache-control" value="no-cache">
    <title>iShoppingAlert - Local Shops</title>
    <link href="https://www.google.com/uds/css/gsearch.css" rel="stylesheet" type="text/css"/>
    <link href="css/places.css" rel="stylesheet" type="text/css"/>

    <!--script src="https://www.google.com/uds/api?file=uds.js&amp;v=1.0&amp;key=ABQIAAAAjU0EJWnWPMv7oQ-jjS7dYxQ82LsCgTSsdpNEnBsExtoeJv4cdBSUkiLH6ntmAr_5O4EfjDwOa0oZBQ" type="text/javascript"></script-->

  </head>
  <body style="font-family: Arial, sans-serif; font-size: small;margin:0px;padding:0px;">

      <div id="map" style="height: <%=Request.Params["h"]%>px; border: none;"></div>

          <script type="text/javascript">
              //<![CDATA[

              // Our global state
              var gLocalSearch;
              var gMap;
              var gInfoWindow;
              var gSelectedResults = [];
              var gCurrentResults = [];
              var gSearchForm;
              var gYellowIcon;
              var gRedIcon;
              var gSmallShadow;
              var bounds;
              var gCPmarker;
              var gPCinfowindow;
		
              // Set up the map and the local searcher.
              function OnLoad() {
                  // Create our "tiny" marker icon
                  gYellowIcon = new google.maps.MarkerImage(
                    "https://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_yellow.png",
                    new google.maps.Size(12, 20),
                    new google.maps.Point(0, 0),
                    new google.maps.Point(6, 20));
                  gRedIcon = new google.maps.MarkerImage(
                    "https://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_red.png",
                    new google.maps.Size(12, 20),
                    new google.maps.Point(0, 0),
                    new google.maps.Point(6, 20));
                  gSmallShadow = new google.maps.MarkerImage(
                    "https://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_shadow.png",
                    new google.maps.Size(22, 20),
                    new google.maps.Point(0, 0),
                    new google.maps.Point(6, 20));
			  
                  // Initialize the map with default UI.
                  //var gCenter = new google.maps.LatLng(<%=Request.Params["lat"]%>, <%=Request.Params["lng"]%>);
            var gCenter = {lat: <%=Request.Params["lat"]%>, lng:<%=Request.Params["lng"]%>};
            gMap = new google.maps.Map(document.getElementById("map"), {
                center: gCenter,
                zoom: 13,
                mapTypeId: 'roadmap',
                panControl: true,
                zoomControl: true,
                mapTypeControl: true,
                scaleControl: true,
                streetViewControl: true,
                overviewMapControl: true,
                rotateControl: true,
                zoomControl: true,
                zoomControlOptions: {style: google.maps.ZoomControlStyle.SMALL},
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                    position: google.maps.ControlPosition.TOP_CENTER}				
            });
            // Create one InfoWindow to open when a marker is clicked.
            gInfoWindow = new google.maps.InfoWindow();
            google.maps.event.addListener(gInfoWindow, 'closeclick', function () {
                unselectMarkers();
            });
            gCPmarker = new google.maps.Marker({position:gCenter, icon: "http://maps.google.com/mapfiles/arrow.png"});
            gCPmarker.setMap(gMap);

            gPCinfowindow = new google.maps.InfoWindow({
                content: "You're here."
            });
            gPCinfowindow.open(gMap,gCPmarker);
			
            var service = new google.maps.places.PlacesService(gMap);
            service.nearbySearch({
                location: gCenter,
                radius: 5000,
                keyword: '<%=Request.Params["qry"]%>'
			}, OnLocalSearch);			
      }

      function unselectMarkers() {
          for (var i = 0; i < gCurrentResults.length; i++) {
              gCurrentResults[i].unselect();
          }
      }

      function OnLocalSearch(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
              // Close the infowindow
              gInfoWindow.close();

              gCurrentResults = [];
              bounds = new google.maps.LatLngBounds();
              for (var i = 0; i < results.length; i++) {
                  //createMarker(results[i]);
                  console.log("results[" + i + "]=" + JSON.stringify(results[i]));
                  gCurrentResults.push(new LocalResult(results[i], results.length));				
              }
          }
          if (typeof window.parent !== 'undefined' && window.parent && 
              typeof window.parent.document != 'undefined' && window.parent.document) {
              var divwait = window.parent.document.getElementById('divwait');
              if (divwait)
                  divwait.style.display = 'none';
          }			
      }


      function LocalResult(result, total) {
          var me = this;
          me.result_ = result;
          me.resultNode_ = me.node();
          me.marker_ = me.marker(total);
          google.maps.event.addDomListener(me.resultNode_, 'mouseover', function () {
              me.highlight(true);
          });
          google.maps.event.addDomListener(me.resultNode_, 'mouseout', function () {
              if (!me.selected_) me.highlight(false);
          });
          google.maps.event.addDomListener(me.resultNode_, 'click', function () {
              me.select();
          });
      }

      LocalResult.prototype.node = function () {
          if (this.resultNode_) return this.resultNode_;
          return this.html();
      };

      // Returns the GMap marker for this result, creating it with the given
      // icon if it has not already been created.
      LocalResult.prototype.marker = function (total) {
          var me = this;
          if (me.marker_) return me.marker_;
          var tmpLatLng = new google.maps.LatLng(parseFloat(me.result_.geometry.location.lat()),
                                       parseFloat(me.result_.geometry.location.lng()));
          var marker = me.marker_ = new google.maps.Marker({
              position: tmpLatLng,
              icon: gYellowIcon, shadow: gSmallShadow, map: gMap
          });
          google.maps.event.addListener(marker, "click", function () {
              me.select();
          });
          if (total && total > 1){
              bounds.extend(tmpLatLng);
              gMap.fitBounds(bounds);
          }
          return marker;
      };

      // Unselect any selected markers and then highlight this result and
      // display the info window on it.
      LocalResult.prototype.select = function () {
          unselectMarkers();
          this.selected_ = true;
          this.highlight(true);
          gInfoWindow.setContent(this.html(true));
          gInfoWindow.open(gMap, this.marker());
      };

      LocalResult.prototype.isSelected = function () {
          return this.selected_;
      };

      // Remove any highlighting on this result.
      LocalResult.prototype.unselect = function () {
          this.selected_ = false;
          this.highlight(false);
      };

      // Returns the HTML we display for a result before it has been "saved"
      LocalResult.prototype.html = function () {
          var me = this;
          var container = document.createElement("div");
          container.className = "unselected";
          me.result_.html = me.result_.name + '<br/>' + me.result_.vicinity;
          container.innerHTML = me.result_.html;
          return container;
      }

      LocalResult.prototype.highlight = function (highlight) {
          this.marker().setOptions({ icon: highlight ? gRedIcon : gYellowIcon });
          this.node().className = "unselected" + (highlight ? " red" : "");
      }

      //]]>
    </script>
	<script src="https://maps.google.com/maps/api/js?key=AIzaSyBryuVc7Z_UJt2iJaxWJxEd_5WAVVFkbaI&libraries=places&callback=OnLoad" async defer></script>
  </body>
</html>



