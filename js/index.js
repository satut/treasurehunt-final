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

    // Treasures location (latitude & longitude)
    treasureLat = 0;
    treasureLon = 0;

    // Current Geolocation Watches ID and current dictance from treasure's location
    watchID = null;
    treasureDistance = 999;

    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        $( document ).delegate(".treasurehunt", "pageinit", function() {
            findLocation();  

            $('.relocate').click(function(){
                findLocation();
            });

        });

    }

    // Funktio, joka tarkkaillee käyttäjän sijaintia ja päivittää käyttäjän sijainnin longituden ja latituden tarvittaessa
    function findLocation() {
        //document.getElementById('geolocation').innerHTML = 'Etsitään sijaintia...';

        // Throw an error if no update is received every 5 seconds
        var options = {maximumAge: 0, timeout: 5000, enableHighAccuracy:true};
        watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
    }



    // onSuccess Geolocation
    function onSuccess(position) {
        var currentHuntID = $.mobile.activePage.attr("id");
        treasureLat = parseFloat($('input#'+currentHuntID+'lat').val());
        treasureLon = parseFloat($('input#'+currentHuntID+'lon').val());    
        var element = document.getElementById(currentHuntID+'geolocation');
        var coldWarm = document.getElementById(currentHuntID+'checkedLocation');
        var nextStepBtn = $('#'+currentHuntID).children('.content').children('#tonextstep');
        var lastStepBtn = $('#'+currentHuntID).children('.content').children('#tolaststep');
        var treasurehuntProgress = $('#' + currentHuntID + 'progress');
        var currentTreasureDistance = 999;

        // The user's current Lat and Long
        var userLat = parseFloat(position.coords.latitude);
        var userLon = parseFloat(position.coords.longitude);


        currentTreasureDistance = ( (treasureLat + treasureLon) - (userLat + userLon) );

        // The current distance to the treasure from user's current location [(treasure long + lat) - (current long + lat)]
        if ( currentTreasureDistance < 0 ) {
            currentTreasureDistance = ( currentTreasureDistance * (-1) );
        }
        else {
            currentTreasureDistance = currentTreasureDistance;
        }

        //console.log('treasureDistance: ' + treasureDistance + ' currentTreasureDistance: ' + currentTreasureDistance);  
        //console.log('treasureDistance - currentTreasureDistance : ' + (treasureDistance-currentTreasureDistance));  

        console.log('treasureLat - userLat: ' + (treasureLat - userLat) + ' ja treasureLon - userLon: ' + (treasureLon - userLon));

        if ( ( (treasureLat - userLat <= 0.0015 ) && (treasureLat - userLat >= -0.0015 ) ) &&
            ( (treasureLon - userLon <= 0.0015 ) && (treasureLon - userLon >= -0.0015 ) ) ) {
                element.innerHTML = 'Olet lähellä aarretta!';
                lastStepBtn.css('display', 'block');
                nextStepBtn.css('display', 'block');
                treasurehuntProgress.css('width', '75%');
                //showAlert();
                //navigator.geolocation.clearWatch(watchID);
        }
        else if ( ( (treasureLat - userLat <= 0.003 ) && (treasureLat - userLat >= -0.003 ) ) &&
            ( (treasureLon - userLon <= 0.003 ) && (treasureLon - userLon >= -0.003 ) ) ) {
                element.innerHTML = 'Olet melko lähellä aarretta';
                nextStepBtn.css('display', 'block');
                treasurehuntProgress.css('width', '50%');
        }
        else if ( ( (treasureLat - userLat <= 0.005 ) && (treasureLat - userLat >= -0.005) ) &&
            ( (treasureLon - userLon <= 0.005 ) && (treasureLon - userLon >= -0.005) ) ) {
                element.innerHTML = 'Olet vielä melko kaukana aarteesta';
            treasurehuntProgress.css('width', '25%');
        }
        else {
            element.innerHTML = 'Et ole lähellä aarretta, etsiskelehän vielä';
            treasurehuntProgress.css('width', '0%');
        }


        if ( (treasureDistance >= currentTreasureDistance) && ( (currentTreasureDistance <= 0.0003) ) ) {
            coldWarm.innerHTML = 'Polttaa';
        }        
        else if (treasureDistance > currentTreasureDistance) {
            coldWarm.innerHTML = 'Lämpenee';
        }
        else if (treasureDistance < currentTreasureDistance) {
            coldWarm.innerHTML = 'Kylmenee';
        }
        else if (treasureDistance == currentTreasureDistance) {
            coldWarm.innerHTML = 'Ei kylmene eikä lämpene';       
        }

        treasureDistance = currentTreasureDistance;

    }



    // onError Callback receives a PositionError object
    function onError(error) {
        alert('Tapahtui virhe.' + '\n' + 'Koodi: '    + error.code    + '\n' +
              'Viesti: ' + error.message + '\n');
    }

    // Jos käyttäjä on aarteen lähellä, näytetään notifikaatio
    function showAlert() {
        navigator.notification.alert(
            'Olet aivan aarteen lähellä!',  // message
            'Polttaa polttaa!',            // title
            'OK'                  // buttonName
        );
    }
