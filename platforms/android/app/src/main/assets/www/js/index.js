var db = null;
var map = null;
//var dbPouchDB = new PouchDB('my_database');

// $('document').ready(function() {
//   

// });


document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//
function onDeviceReady() {

    //saveData();
    db = window.sqlitePlugin.openDatabase({
        name: 'my.db',
        location: 'default',
        androidDatabaseProvider: 'system'
    });

    initMap();
    getPlace();


}




function onError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}



function initMap() {
    // The location of Uluru
    var defa = {
        lat: 47.6333,
        lng: 6.8667
    };
    // The map, centered at Uluru
    map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 10,
            center: defa
        });
    google.maps.event.addListener(map, "click", function(e) {

        var latLng = e.latLng;
        alert(latLng)
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            // infoWindow.setPosition(pos);
            // infoWindow.setContent('Location found.');
            // infoWindow.open(map);
            // map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}


// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDgdZHm122qXCXlfutKei_Qsu1nhx-AXeo",
    authDomain: "focal-charge-262309.firebaseapp.com",
    databaseURL: "https://focal-charge-262309.firebaseio.com",
    projectId: "focal-charge-262309",
    storageBucket: "focal-charge-262309.appspot.com",
    messagingSenderId: "760636545158",
    appId: "1:760636545158:web:6b0dbc1377121d1502d907",
    measurementId: "G-SPKKJRTY9W"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();


db.collection("posts").get()
    .then((querySnapshot) => {

        querySnapshot.forEach((doc) => {
            console.log(doc.id);
        });

    }).catch(function(error) {
        console.log("Error getting document:", error);
    });



function getPlace() {
    var db = firebase.firestore();
    db.collection("places").get()
        .then((querySnapshot) => {

            querySnapshot.forEach((doc) => {
                var pos = {
                    lat: doc.data().longitude,
                    lng: doc.data().latitude
                };

                console.log(pos)

                var marker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    //  animation: google.maps.Animation.DROP,
                });
                var infoWindow = new google.maps.InfoWindow({
                    content: doc.data().description
                });

                marker.addListener('click', function() {
                    map.setZoom(8);
                    map.setCenter(marker.getPosition());

                    infoWindow.setPosition(pos);
                    infoWindow.setContent(renderText(doc.data().description, "image", doc.data().name));

                    infoWindow.open(map);
                    map.setCenter(pos);



                });


            });

        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

}



function saveData() {


    db.collection("places").doc("corbiss").set({

            name: "Le lion de Belfort",
            longitude: 47.636878,
            latitude: 6.864559
        })
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });



}

function addTodo(text) {
    var todo = {
        _id: new Date().toISOString(),
        title: text,
        completed: false
    };
    dbPouchDB.put(todo, function callback(err, result) {
        if (!err) {
            console.log('Successfully posted a todo!');
        }
    });
}




function renderText(description, image, name) {
    return "<h3 >" + name + "</h3>" +
        "<p>" + String(description).replace(/(.{40})/g, "$1<br>") + "</p>" + "<img  src=\"img/lion.jpg\" width=\"200\" height=\"200\"/>"
}