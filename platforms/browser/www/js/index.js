var db = null;
var map = null;
var positiontamp = null;
var user = null;
var button = null;
var local_db = null;
var participation = null;
var infoWindow = null;
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//
function onDeviceReady() {
    initMap();
    getActivities()
    getListActivities()
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
    })
    loadActivityAll()
    local_db = window.openDatabase("Database", "1.0", "Database particpate", 200000);
    local_db.transaction(createDB, errorCreating, successCreating);
    // local_db.transaction(searchIfInDBTest, error, success)
    loadMyParticpate();
}

function createDB(tx) {
    //  tx.executeSql('DROP TABLE IF EXISTS PARTICIPATIONS');

    tx.executeSql('CREATE TABLE IF NOT EXISTS PARTICIPATIONS (id INTEGER PRIMARY KEY, name)');
}


function errorCreating(item, err) {
    alert("Error creating SQL: " + err);
}


function successCreating() {
    alert("success DB creating");
}


function error(item, err) {
    alert("Error SQL: " + err);
}

function success(item, err) {
    alert("Success: " + err);
}

function successCB() {
    alert("success DB create");
}

function insert(item) {
    item.executeSql('INSERT INTO PARTICIPATIONS (name) VALUES ("' + participation + '")');
}

function searchIfInDB(item) {
    item.executeSql('SELECT * FROM PARTICIPATIONS WHERE name="' + participation + '"', [], callbackSuccess);
}

function searchIfInDBTest(item) {
    item.executeSql('SELECT * FROM PARTICIPATIONS', [], callback);
}

function callback(tx, results) {
    var element = ""
    var strTxt =
        "<div data-role=\"page\" id=\"participate\">" +
        "<div data-role=\"header\">" + "Mes participations" +
        "</div>" +
        "<div role = \"main\" class = \"ui-content\" >" +
        "<ul data-role=\"listview\" data-inset=\"true\" data-theme=\"a\">"



    if (results.rows.length == 0) {
        alert("0")
    } else {
        alert("1")


        for (var i = 0; i < results.rows.length; i++) {
            var docRef = db.collection("activites").doc(results.rows.item(i).name);
            docRef.get().then(function(doc) {
                element += "<li>" + doc.data().name + "</li>"
                strTxt = strTxt + element
                strTxt += "</ul></div><div data-role=\"footer\" data-position=\"fixed\"><div data-role=\"navbar\"><ul><li><a href=\"index.html#mapSide\" data-icon=\"grid\">Map Activity</a></li><li><a href=\"index.html#list\" data-icon=\"star\">List of Activity</a></li><li><a href=\"index.html#participate\" data-icon=\"heart\">List of Activity</a></li></ul></div></div></div></div>"
                $("body").append(strTxt);

                // resolve(element);
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
            alert(element)
                //var activite = db.collection('activites').doc(results.rows.item(i).name).get()

        }


    }

}

function changeValue(elementp) {
    element = element + elementp
}


function callbackSuccess(tx, results) {
    if (results.rows.length == 0) {
        local_db.transaction(insert, errorCreating, successCreating);
        alert("0")
    } else {
        alert("1")
    }
}

function loadMyParticpate() {
    local_db.transaction(searchIfInDBTest, error, success)
}







function queryDB(tx) {
    tx.executeSql('SELECT * FROM PARTICIPATIONS', [], querySuccess, errorCB);
}

function querySuccess(tx, results) {
    console.log("Returned rows = " + results.rows.length);
    // this will be true since it was a select statement and so rowsAffected was 0
    if (!results.rowsAffected) {
        console.log('No rows affected!');
        return false;
    }
    // for an insert statement, this property will return the ID of the last inserted row
    console.log("Last inserted row ID = " + results.insertId);
}

function errorCB(err) {
    alert("Error processing SQL: " + err.code);
}


function saveActivity(title, description, date, position) {

    const ref = db.collection('activites').doc();
    const id = ref.id
    db.collection("activites").doc(id).set({
            name: title,
            longitude: position.lng(),
            latitude: position.lat(),
            description: description,
            date: date,
            participants: []
        })
        .then(function() {
            getActivities()
            getListActivities()

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
    //  if (user === 'admin@admin.com') {



    google.maps.event.addListener(map, "click", function(e) {

        var latLng = e.latLng;

        positiontamp = latLng
        $('#myPopupDiv').popup('open');
        console.log("click sur map")
    });


    //  }

    // Try HTML5 geolocation.
    /*  if (navigator.geolocation) {
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
      }*/

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
                    infoWindow.setContent(renderText(doc.data().description, doc.data().name));
                    infoWindow.open(map);
                    map.setCenter(pos);
                });
            });

        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

}



function getActivities() {
    var db = firebase.firestore();
    db.collection("activites").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var pos = {
                    lat: doc.data().latitude,
                    lng: doc.data().longitude
                };
                $(doc.data().id).click(function(event) {
                    alert(event.target.id)
                });
                var marker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    // animation: google.maps.Animation.DROP,
                });
                var infoWindow = new google.maps.InfoWindow({
                    // content: doc.data().description
                });

                console.log(doc.id)


                marker.addListener('click', function() {
                    map.setZoom(15);
                    map.setCenter(marker.getPosition());
                    /*renderText(doc.data().description, doc.data().name, doc.data().date)*/
                    infoWindow.setPosition(pos);
                    infoWindow.setContent("<h2>" + doc.data().name + "</h2>" +
                        "<p>" + doc.data().description + "</p>" +
                        "<span style=\"color:blue\" style=\"font-style:italic\">" + doc.data().date + "</span>" +
                        "<button onclick=\"document.getElementById(\'" + doc.id + "\').click();;\">" + "Participate" + "</button>"
                    );

                    infoWindow.open(map);
                    map.setCenter(pos);
                    button = document.createElement("button");
                    button.setAttribute("id", doc.id)

                    // 2. Append somewhere
                    var body = document.getElementsByTagName("body")[0];
                    body.appendChild(button);

                    // 3. Add event handler
                    button.addEventListener("click", function() {
                        addParticipate(this.id)
                            // console.log("salut")
                    });

                });
            });

        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

}



function addParticipate(id) {

    participation = id;

    var participateAct = db.collection("activites").doc(id);
    var act = participateAct.get()

    act.then(function(doc) {
        if (doc.exists) {

            console.log(doc.data())

            if (confirm("Voulez vous participer?")) {
                var participateAct = db.collection("activites").doc(id);
                return participateAct.set({
                        name: doc.data().name,
                        description: doc.data().description,
                        longitude: doc.data().longitude,
                        latitude: doc.data().latitude,
                        date: doc.data().date,
                        participants: [user].concat(doc.data().participants)
                    })
                    .then(function() {
                        console.log("Document successfully updated!");
                    })
                    .catch(function(error) {
                        console.error("Error updating document: ", error);
                    });

            } else {
                alert("annuler")
            }



        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

    alert(participation)
    local_db.transaction(insert, errorCB, successCB)

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



function renderText(description, name, date, id) {
    console.log(date)
    var d = new Date(Date.parse(date));
    return "<h3 >" + name + "</h3>" +
        "<p>" + String(description).replace(/(.{40})/g, "$1<br>") + "<br>" +
        +String(d) + "<br><button id=\"" + id + "\">Participate</button>" +
        "<button onclick=\"document.getElementById(\'" + id + "\').click();\">Click Me</button>"
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

function getListActivities() {
    var db = firebase.firestore();
    var ul = document.getElementById("listPlace");

    var child = ul.lastElementChild;
    while (child) {
        ul.removeChild(child);
        child = ul.lastElementChild;
    }


    db.collection("activites").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var li = document.createElement("li");
                li.appendChild(document.createTextNode(doc.data().name));
                li.setAttribute("id", "li" + doc.id)
                ul.appendChild(li);
                li.addEventListener('click', function(event) {
                    window.location = "index.html#" + event.target.id;
                });
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
            const ref = db.collection('users').doc();
            const id = ref.id

            db.collection("users").doc(id).set({
                    name: name,
                    number: number,
                    email: email,
                    password: password
                })
                .then(function() {

                    console.log("Document successfully written!");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });


        });
        console.log("saut")
        promise.catch(e => {
            console.log(e.message)
        })

    });


    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log(firebaseUser.email)

            $('.username').each(function() {
                $(this).html(firebaseUser.email);
            });

            user = firebaseUser.email

            window.location = "index.html#mapSide";
        } else {
            console.log('not logged in')
                //window.location = "index.html";
        }
    });

    btnLogout.addEventListener('click', function() {
        firebase.auth().signOut();
        console.log("je suis deconnecté")
    });

}





function loadActivityAll() {
    var strTxt = "";
    var ulTxt = "";

    db.collection("activites").get()
        .then((querySnapshot) => {

            querySnapshot.forEach((doc) => {
                console.log("doc.id")
                console.log(doc.data().participants)
                strTxt =
                    "<div data-role=\"page\" id=\"" + "li" + doc.id + "\">" +
                    "<div data-role=\"header\">" + doc.data().name +
                    "</div>" +
                    "<div role = \"main\" class = \"ui-content\" >" +
                    "<p>" + doc.data().description + "</p>"
                ulTxt = "<h2>The participants</h2>" +
                    "<ul data-role = \"listview\" data-theme = \"c\">";
                if (doc.data().participants != null) {
                    for (item in doc.data().participants) {
                        ulTxt += "<li>" + doc.data().participants[item] + "</li>"
                    }

                } else {
                    ulTxt += "There are no participants"
                }

                ulTxt += "</ul>" + "</div>" + "</div>"



                ulTxt += "<div data-role=\"footer\" data-position=\"fixed\"><h4>Copyright</h4></div>"
                $("body").append(strTxt + ulTxt);

            })
        })
}

function loadActivity(id) {
    var name = document.getElementById("name").innerHTML = '';
    var description = document.getElementById("description").innerHTML = '';
    var listParticipant = document.getElementById("listParticipant");
    var child = listParticipant.lastElementChild;
    while (child) {
        listParticipant.removeChild(child);
        child = listParticipant.lastElementChild;
    }

    var participateAct = db.collection("activites").doc(id);
    var act = participateAct.get()

    act.then(function(doc) {
        console.log(doc.data())

        if (doc.exists) {
            name.innerHTML = doc.data().name
            description.innerHTML = doc.data().description
            for (item in doc.data().participants) {

                var li = document.createElement("li");
                li.appendChild(document.createTextNode(item));
                listParticipant.appendChild(li);
            }
        }
    });
    window.location = "index.html#show";
}