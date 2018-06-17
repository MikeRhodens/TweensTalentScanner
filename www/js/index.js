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
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById('scan-button').addEventListener('click', function () {
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    if (!result.cancelled) {
                        // In this case we only want to process QR Codes
                        if (result.format == "QR_CODE") {
                            var value = result.text;
                            //na de scan
                            document.getElementById('scan-container').style.display = "none";
                            document.getElementById('result-container').style.display = "block";
                            document.getElementById('backbutton').style.display = "block";

                            const options = {
                                method: 'get',
                                data: {user: "ed.shenk@ma-web.nl", password: '1324'},
                                headers: {Authorization: 'bearer:' + token}
                            };

                            var request = 'studens/';
                            var id = value;

                            var fullUrl = url + request + id;
                            cordova.plugin.http.sendRequest(fullUrl, options, function (response) {
                                // prints 200
                                var data = JSON.parse(response['data']);
                                var talents = document.getElementsByClassName('talent');
                                talents[0].innerHTML = data['talenten'][0];
                                talents[1].innerHTML = data['talenten'][1];
                                talents[2].innerHTML = data['talenten'][2];

                            }, function (response) {
                                // prints 403
                                console.log(response.status);

                                //prints Permission denied
                                console.log(response.error);
                            });
                            console.log(value);
                        } else {
                            alert("Sorry, only qr codes this time ;)");
                        }
                    } else {
                        alert("The user has dismissed the scan");
                    }
                },
                function (error) {
                    alert("An error ocurred: " + error);
                }
            );
        });
        document.getElementById('backbutton').addEventListener('click', function () {
            document.getElementById('scan-container').style.display = "block";
            document.getElementById('result-container').style.display = "none";
            document.getElementById('backbutton').style.display = "none";
        });
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        var url = 'localhost:8000/';
        var request = 'auth/login';

        var fullUrl = url + request;
        const options = {
            method: 'get',
            data: {user: "ed.shenk@ma-web.nl", password: '1324'}
        };

        cordova.plugin.http.sendRequest(fullUrl, options, function (response) {
            window.token = response['access_token']
        }, function (response) {
            console.log(response.status);
            console.log(response.error);
        });


    },


    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
