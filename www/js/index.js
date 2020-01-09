var db = null;
var map = null;
var positiontamp = null;
var user = null;

document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//
function onDeviceReady() {

    // //saveData();
    // db = window.sqlitePlugin.openDatabase({
    //     name: 'my.db',
    //     location: 'default',
    //     androidDatabaseProvider: 'system'
    // });

    initMap();
    getPlace();
    getList();
    connect();
    $("#mypanel").trigger("updatelayout");
    $('#myPopupDiv').popup();
    $('#cancel').click(function() {
        $("#myPopupDiv").popup("close")
    })

    $('#validate').click(function() {

        const txtTitle = document.getElementById('txtTitle')
        const txtDecription = document.getElementById('txtDecription')
        const txtDate = document.getElementById('txtDate')
        const title = txtTitle.value;
        const description = txtDecription.value;
        const date = txtDate.value;

        saveActivity(title, description, date, positiontamp)
            //window.location = "index.html#list";


    })

















}



function saveActivity(title, description, date, position) {

    const ref = db.collection('activites').doc();
    const id = ref.id
    db.collection("activites").doc(id).set({
            name: title,
            longitude: position.lng(),
            latitude: position.lat(),
            description: description,
            date: date
        })
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });

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

        positiontamp = latLng
        console.log(positiontamp)
        $('#myPopupDiv').popup('open');
        alert(latLng)
        console.log("click sur map")
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

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
db = firebase.firestore();

/*
db.collection("posts").get()
    .then((querySnapshot) => {

        querySnapshot.forEach((doc) => {
            console.log(doc.id);
        });

    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

*/

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



function saveData(nom, loc, description) {

    const ref = db.collection('activites').doc();
    const id = ref.id
    db.collection("places").doc(nom).set({

            name: "Le lion de Belfort",
            longitude: loc.longitude,
            latitude: loc.latitude,
            description: description,
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


function getList() {
    var db = firebase.firestore();

    var ul = document.getElementById("listPlace");
    var li = document.createElement("li");



    db.collection("places").get()
        .then((querySnapshot) => {

            querySnapshot.forEach((doc) => {

                li.appendChild(document.createTextNode(doc.data().name));
                ul.appendChild(li);

            })
        })


}



function connect() {

    const txtEmail1 = document.getElementById('txtEmail1');
    const txtPassword1 = document.getElementById('txtPassword1');
    const btnLogin = document.getElementById('btnLogin');
    const btnLogout = document.getElementById('btnLogout');


    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const txtName = document.getElementById('txtName');
    const txtNumber = document.getElementById('txtNumber');
    const btnSignUp = document.getElementById('btnSignUp');


    btnLogin.addEventListener('click', e => {
        //get email and pass
        const email1 = txtEmail1.value;
        const password1 = txtPassword1.value;


        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(email1, password1)
        promise.catch(e => {
            console.log(e.message)
        });
    });

    btnSignUp.addEventListener('click', e => {
        //get Email and pass
        const email = txtEmail.value;
        const password = txtPassword.value
        const name = txtName.value
        const number = txtNumber.value
        const auth = firebase.auth();
        //Sign up
        const promise = auth.createUserWithEmailAndPassword(email, password).then(result => {

            this.SetUserData(result.user, name, number);


        });
        console.log("saut")
        promise.catch(e => {
            console.log(e.message)
        })

    });


    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log(firebaseUser.email)




            // var usernames = document.getElementsByClassName('username');
            // for (var i = 0; i < usernames.length; i++) {
            //     divs[i].style.height = rand + 'px';
            // }

            $('.username').each(function() {
                $(this).html(firebaseUser.email);
            });

            user = firebaseUser.email

            window.location = "index.html#mapSide";
        } else {
            console.log('not logged in')
            window.location = "index.html";
        }
    });

    btnLogout.addEventListener('click', function() {
        firebase.auth().signOut();
        console.log("je suis de connecté")
    });

}