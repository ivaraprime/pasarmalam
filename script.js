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



const hamburger = document.querySelector('.header .nav-bar .nav-list .hamburger');
const mobile_menu = document.querySelector('.header .nav-bar .nav-list ul');
const menu_item = document.querySelectorAll('.header .nav-bar .nav-list ul li a');
const header = document.querySelector('.header.container');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobile_menu.classList.toggle('active');
});

document.addEventListener('scroll', () => {
    var scroll_position = window.scrollY;
    if (scroll_position > 250) {
        header.style.backgroundColor = '#e5c35eff';
    } else {
        header.style.backgroundColor = 'transparent';
    }
});



function logOut() {
    firebase.auth().signOut();
    alert("You are logged out!");
    Redirect();
}

function Redirect() {
    window.location.assign("register_login.html");
}
//-------------Vegetables------------//
var vref = database.ref('Stalls/Vegetables')
vref.on('value', retrieveData, errData);

function retrieveData(data) {
    var vstall = data.val();
    var keys = Object.keys(vstall);
    var type = 'vrow';
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var name = vstall[k].StallInfo.stallName;
        var descript = vstall[k].StallInfo.stallDescp;
        var img = vstall[k].StallInfo.stallImage;
        var rating = vstall[k].Rating.Overall;
        var sid = vstall[k].StallInfo.stallID;
        displayStall(type, name, rating, img, sid);
    }
}
//-------------End of Vegetables------------//
//-------------Meats and Seafood------------//
var fref = database.ref('Stalls/Meats and Seafood')
fref.on('value', getData, errData);

function getData(data) {
    var mstall = data.val();
    var keys = Object.keys(mstall);
    var type = 'mrow';
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var name = mstall[k].StallInfo.stallName;
        var descript = mstall[k].StallInfo.stallDescp;
        var img = mstall[k].StallInfo.stallImage;
        var rating = mstall[k].Rating.Overall;
        var sid = mstall[k].StallInfo.stallID;
        displayStall(type, name, rating, img, sid);
    }
}
//-------------End of Meats and Seafood------------//
//-------------Asian Foods------------//
var fref = database.ref('Stalls/Asian Foods')
fref.on('value', gtData, errData);

function gtData(data) {
    var fstall = data.val();
    var keys = Object.keys(fstall);
    var type = 'frow';
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var name = fstall[k].StallInfo.stallName;
        var descript = fstall[k].StallInfo.stallDescp;
        var img = fstall[k].StallInfo.stallImage;
        var rating = fstall[k].Rating.Overall;
        var sid = fstall[k].StallInfo.stallID;
        displayStall(type, name, rating, img, sid);
    }
}
//-------------End of Asian Foods------------//

//-------------Clothes and Accessories------------//
var cref = database.ref('Stalls/Clothes and Accessories')
cref.on('value', gotData, errData);

function gotData(data) {
    var cstall = data.val();
    var keys = Object.keys(cstall);
    var type = 'crow';

    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var name = cstall[k].StallInfo.stallName;
        var descript = cstall[k].StallInfo.stallDescp;
        var img = cstall[k].StallInfo.stallImage;
        var rating = cstall[k].Rating.Overall;
        var sid = cstall[k].StallInfo.stallID;
        displayStall(type, name, rating, img, sid);
    }

}

function errData(err) {
    console.log('Error!');
    console.log(err);
}

function displayStall(stalltype, title, rating, imageSrc, stallID) {
    getcurrentname();
    var Row = document.createElement('div');
    Row.classList.add('col-4');
    var stall = document.getElementsByClassName(stalltype)[0];
    var ratingStar;
    ratingStar = calculateRating(rating);

    var RowContents = `
         <a href="stallpage.html" >
         <img id="${stallID}" onclick="getSID(this.id)" src="${imageSrc}"></a>
          <h4 class="stallname">${title}</h4>
          <div class="rating">${ratingStar}</div>
      `
    Row.innerHTML = RowContents;
    stall.append(Row);
}
//-------------End of Clothes and Accessories------------//

function calculateRating(ratingVal) {

    //to show star rating
    var num = Number(ratingVal);
    var b = parseInt(ratingVal);
    var unchecked = 5 - num;
    var starrating = '<i class="fa fa-star"></i>';
    var star = '<i class="fa fa-star"></i>';
    var emptystar = '<i class="fa fa-star-o"></i>';
    for (var i = 1; i < b; i++) {
        starrating += star;
    }

    if (unchecked > 0) {
        if ((unchecked % 1) != 0) {
            starrating += '<i class="fa fa-star-half-o"></i>'
        } else if (unchecked >= 1) {
            starrating += emptystar;
        }
        for (var i = 1; i < unchecked; i++) {
            starrating += emptystar;
        }
    }

    return starrating;

}

function getSID(stallid) {
    localStorage.setItem("openStall", stallid);
}

function getcurrentname() {

    let userId = firebase.auth().currentUser.uid;
    console.log(userId);

    var nameref = database.ref('Users/Type of Account/cust/' + userId);
    nameref.once('value').then(function(snapshot) {
        var username = snapshot.val().name;
        document.getElementById('currentusername').innerHTML = username;
        localStorage.setItem("username", username);
    });

}