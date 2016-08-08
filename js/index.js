/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    inAppBrowserRef: false,
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);


        var app_el = document.getElementById("main");
        app_el.addEventListener('click', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'

    onBatteryStatus: function(info) {
    // The battery level and plugged/unplugged status
    //alert("Level: " + info.level + " isPlugged: " + info.isPlugged);
        if(info.isPlugged) {
            app.inAppBrowserRef.executeScript(
                {
                    code: "localStorage.setItem('mobile_is_plugged', true);"
                });
        } else {
            app.inAppBrowserRef.executeScript(
                {
                    code: "localStorage.removeItem('mobile_is_plugged');"
                });
        }
    },
    openWithSystemBrowser : function(url) {
        window.open('http://test.subarists.ru' + url, "_system");
    },


    checkExternalLinkClick: function() {
        // Start an interval
        var loop = setInterval(function() {
            // Execute JavaScript to check for the existence of a name in the
            // child browser's localStorage.
            app.inAppBrowserRef.executeScript(
                {
                    code: "localStorage.getItem('link');"
                },
                function( values ) {
                    var link = values[ 0 ];
                    // If a name was set, clear the interval and close the InAppBrowser.
                    if ( link ) {
                        app.inAppBrowserRef.executeScript(
                            {
                                code: "localStorage.removeItem('link');"
                            });
                        app.openWithSystemBrowser(link);
                        return;
                    }
                }
            );
        }, 1000);
    },

    onSuccessGps: function(position) {
        //alert(position.coords.longitude);
        app.inAppBrowserRef.executeScript(
            {
                code: "localStorage.setItem('gps_latitude', " + position.coords.latitude + "); localStorage.setItem('gps_longitude', " + position.coords.longitude + ");"
            });
    },
    onErrorGps: function() {
        app.inAppBrowserRef.executeScript(
            {
                code: "localStorage.removeItem('gps_latitude'); localStorage.removeItem('gps_longitude');"
            });
        //alert('Ошибка определения GPS c телефона');
    },


    onDeviceReady: function() {

        // Options: throw an error if no update is received every 30 seconds.
        //
        var watchID = navigator.geolocation.watchPosition(app.onSuccessGps, app.onErrorGps, { timeout: 30000 });

        app.inAppBrowserRef = window.open('https://test.subarists.ru/app_neighbors', '_blank', 'location=no,toolbar=no');

        app.inAppBrowserRef.addEventListener("loadstop", function(event) {
            app.inAppBrowserRef.executeScript(
                { code: "$('#neighbors-load-wrapper').on('loaded.neighbors', function(){ $('.neighbors__username a').on('click', function(e) { e.preventDefault(); localStorage.setItem('link', this.getAttribute('href')); return false; }); });"},
                app.checkExternalLinkClick
            );
        });

        window.addEventListener("batterystatus", app.onBatteryStatus, false);

    },

};
