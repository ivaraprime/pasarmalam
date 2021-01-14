// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyCrrd39UiNqYGrXESuIe9j-M7bSoQPEZS0",
    authDomain: "virtual-pasar.firebaseapp.com",
    projectId: "virtual-pasar",
    storageBucket: "virtual-pasar.appspot.com",
    messagingSenderId: "386082595981",
    appId: "1:386082595981:web:7773e4cffc18e4adef6ec4",
    measurementId: "G-L0DTRQWPPH"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var database = firebase.database();

const auth = firebase.auth();

function logOut() {
    firebase.auth().signOut();
    alert("You are logged out!");
    Redirect();
}

function Redirect() {
    window.location.assign("register_login.html");
}

function on() {
    document.getElementById("overlay").style.display = "block";;
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        let userId = firebase.auth().currentUser.uid;
        console.log(userId)

        //show profile
        // var userId = firebase.auth().currentUser.uid;
        var database = firebase.database();
        var CustP = database.ref('Users/' + 'Type of Account/' + 'cust/' + userId);
        CustP.once('value').then(function(snapshot) {
            var username = snapshot.val().name;
            document.getElementById('currentusername').innerHTML = username;
        });
    }
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        let userId = firebase.auth().currentUser.uid;
        console.log(userId)

        //show profile
        // var userId = firebase.auth().currentUser.uid;
        var database = firebase.database();
        var userRef = database.ref('Users/' + 'Type of Account/' + 'cust/' + userId);
        var userRef1 = database.ref('Users/' + 'Type of Account/' + 'cust/' + userId + "/Contact Details");
        var userRef2 = database.ref('Users/' + 'Type of Account/' + 'cust/' + userId + "/Address");


        userRef.once('value').then(function(snapshot) {
            var name = snapshot.val().name;
            var email = snapshot.val().emailacc;

            document.getElementById("custName").innerHTML = name;
            document.getElementById("email").innerHTML = email;

            console.log(snapshot.val());
        });

        userRef1.once('value').then(function(snapshot) {
            var phone = snapshot.val().phoneNum;

            document.getElementById("HP").innerHTML = phone;

            console.log(snapshot.val());
        });

        userRef2.once('value').then(function(snapshot) {
            var num = snapshot.val().num;
            var street = snapshot.val().street;
            var zipcode = snapshot.val().zipcode;
            var city = snapshot.val().city;
            var state = snapshot.val().state;

            document.getElementById("custAdd").innerHTML = num + ", " + street + ", " + zipcode + " " +
                city + ", " + state + ".";

            console.log(snapshot.val());
        });

    } //end if user exist
});

var CNUm = document.getElementById("CNumber");
var CStreet = document.getElementById("Street");
var CZipcode = document.getElementById("Zipcode");
var CCity = document.getElementById("City");
var CState = document.getElementById("State");

function updateC_Add() {
    var userId = firebase.auth().currentUser.uid;
    if (CZipcode.value.length != 5) {
        alert("Zipcode must be of length of 5!")
    } else if (CNUm.value == "" || CStreet.value == "" || CZipcode.value == "" || CCity.value == "" || CState.value == "") {
        alert("Fields must not be empty!")
    } else {
        firebase.database().ref("Users/" + "Type of Account/" + "cust/" + userId + "/Address").set({
            num: CNUm.value,
            street: CStreet.value,
            zipcode: CZipcode.value,
            city: CCity.value,
            state: CState.value
        });
        alert("Address Updated!")
        Show();
    }

}

var CustHP = document.getElementById("cHP");

function updateCustPhone() {

    var userId = firebase.auth().currentUser.uid;
    if (CustHP.value.length > 11 || CustHP.value.length < 10) {
        alert("Phone number format incorrect!")
    } else if (CustHP.value == "") {
        alert("Field must not be empty!")
    } else {
        firebase.database().ref("Users/" + "Type of Account/" + "cust/" + userId + "/Contact Details").set({
            phoneNum: CustHP.value
        });
        alert("Phone Number Updated!")
        Show();
    }
}

function Show() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            let userId = firebase.auth().currentUser.uid;
            console.log(userId)

            //show profile
            // var userId = firebase.auth().currentUser.uid;
            var database = firebase.database();
            var userRef = database.ref('Users/' + 'Type of Account/' + 'cust/' + userId);
            var userRef1 = database.ref('Users/' + 'Type of Account/' + 'cust/' + userId + "/Contact Details");
            var userRef2 = database.ref('Users/' + 'Type of Account/' + 'cust/' + userId + "/Address");


            userRef.once('value').then(function(snapshot) {
                var name = snapshot.val().name;
                var email = snapshot.val().emailacc;

                document.getElementById("custName").innerHTML = name;
                document.getElementById("email").innerHTML = email;

                console.log(snapshot.val());
            });

            userRef1.once('value').then(function(snapshot) {
                var phone = snapshot.val().phoneNum;

                document.getElementById("HP").innerHTML = phone;

                console.log(snapshot.val());
            });

            userRef2.once('value').then(function(snapshot) {
                var num = snapshot.val().num;
                var street = snapshot.val().street;
                var zipcode = snapshot.val().zipcode;
                var city = snapshot.val().city;
                var state = snapshot.val().state;

                document.getElementById("custAdd").innerHTML = num + ", " + street + ", " + zipcode + " " +
                    city + ", " + state + ".";

                console.log(snapshot.val());
            });

        } //end if user exist
    });
}