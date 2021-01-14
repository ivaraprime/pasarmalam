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



//-------------retrieve data------------//
var sellerid = localStorage.getItem("openStall");
var username = localStorage.getItem("username");

document.getElementById('currentusername').innerHTML = username;

//-----------------retrieve stall info---------//
var stallRef = database.ref('Users/Type of Account/seller/' + sellerid);

stallRef.child('StallInfo').once('value').then(function(snapshot) {
    var sname = snapshot.val().stallName;
    var sdescp = snapshot.val().stallDescp;
    var scategory = snapshot.val().stallCategory;

    document.getElementById("stall_name").innerHTML = sname;
    document.getElementById("stall_description").innerHTML = sdescp;

    console.log(snapshot.val());
});
stallRef.child('Address').once('value').then(function(snapshot) {
    var num = snapshot.val().num;
    var street = snapshot.val().street;
    var zipcode = snapshot.val().zipcode;
    var city = snapshot.val().city;
    var state = snapshot.val().state;

    document.getElementById("saddress").innerHTML = num + ", " + street + ", " + zipcode + " " +
        city + ", " + state + ".";

    console.log(snapshot.val());
});
stallRef.child('Contact Details').once('value').then(function(snapshot) {
    var telNo = snapshot.val().phoneNum;

    document.getElementById("scontact").innerHTML = "Tel: " + telNo;

    console.log(snapshot.val());
});

//-----------------retrieve product info---------// 
var stallRef = database.ref('Productinfo/' + sellerid);
stallRef.on('value', gotPData, errData);

function gotPData(data) {
    var product = data.val();
    var keys = Object.keys(product);
    //var type = 'crow';

    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var name = product[k].Product_name;
        var descript = product[k].Price_desc;
        var img = product[k].productUrl;
        var price = product[k].Price;
        var typeprice = product[k].Type_price;
        var productID = product[k].pid;

        //var datapath =" Stalls/Clothes and Accessories";
        displayProducts(name, descript, price, img, typeprice, productID);
    }

}

function errData(err) {
    console.log('Error!');
    console.log(err);
}

function displayProducts(pName, pDescript, pPrice, pImage, pUnit, pID) {
    var Row = document.createElement('div');
    Row.classList.add('shop-items');
    var product = document.getElementsByClassName('product-item')[0];
    var num = Math.round(pPrice * 100) / 100;
    var price = num.toFixed(2);

    var RowContents = `
        <div class="shop-item">
          <img class="shop-item-image" src="${pImage}"></a>
          <button id="${pID}"class="btn-primary shop-item-button" 
          type="button" onclick="addToPCart(this.id)">ADD TO CART<i class = "fa fa-plus plusIcon"></i></button>
        </div>
        <div class="shop-item-details">
          <span class="shop-item-title">${pName}</span><br>
          <span class="shop-item-price">RM${price}</span><span class="shop-item-unit">${pUnit}</span><br>
          <span class="shop-item-price">Description: ${pDescript}</span>

        </div>
      `
    Row.innerHTML = RowContents;
    product.append(Row);
}
//-------------End of retrieve------------//


//-------------------Cart page-------------//

let orderRef = database.ref("Orders");

var removeCartItemButtons = document.getElementsByClassName('btn-remove');
for (var i = 0; i < removeCartItemButtons.length; i++) {
    var button = removeCartItemButtons[i]
    button.addEventListener('click', removeCartItem);
}

var quantityInputs = document.getElementsByClassName('cart-quantity-input');
for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener('change', quantityChanged);
}

document.getElementsByClassName('btn-checkout')[0].addEventListener('click', checkoutClicked);

function checkoutClicked() {

    let userId = auth.currentUser.uid;
    let newOrder = orderRef.push().key;

    if ((!document.getElementById('self_pickup').checked) && (!document.getElementById('delivery').checked)) {
        alert('Please choose the type of delivery');
    } else if ((!document.getElementById('online').checked) && (!document.getElementById('cash').checked)) {
        alert('Please choose one of the payment type');
    } else {

        var cartItems = document.getElementsByClassName('cart-items')[0];
        var currentdate = todayDate();
        var typeofdelivery;
        if (document.getElementById('self_pickup').checked) {
            typeofdelivery = "Self-Pickup";
        }
        if (document.getElementById('delivery').checked) {
            typeofdelivery = "Delivery";
        }

        firebase.database().ref("Orders/" + newOrder + "/Info").set({
            sid: sellerid,
            cid: userId,
            date: currentdate
        });
        firebase.database().ref('Users/Type of Account/cust/' + userId + "/Order/" + newOrder).set({
            orderID: newOrder
        });
        firebase.database().ref('Users/Type of Account/seller/' + sellerid + "/Order/" + newOrder).set({
            orderID: newOrder
        });

        var amount = document.getElementsByClassName('cart-total-price')[0].id;
        var i = 0;
        while (document.getElementsByClassName('cart-item-title')[i] != null) {
            //store data to order
            var pImg = document.getElementsByClassName('cart-item-image')[i].src;
            var pName = document.getElementsByClassName('cart-item-title')[i].id;
            let product = orderRef.push().key;
            var pQt = document.getElementsByClassName('cart-quantity-input')[i].value;

            firebase.database().ref("Orders/" + newOrder + "/Products/" + product).set({
                Product_name: pName,
                productUrl: pImg,
                productQt: pQt
            });

            i++;
        }

        while (cartItems.hasChildNodes()) {
            cartItems.removeChild(cartItems.firstChild);
        }

        document.getElementById('self_pickup').checked = false;
        document.getElementById('delivery').checked = false;

        if (document.getElementById('cash').checked) {
            firebase.database().ref("Orders/" + newOrder + "/Payment").set({
                total: amount,
                payment_method: "cash",
                payment_status: "unpaid",
                order_status: "preparing",
                typeofdelivery: typeofdelivery
            });
            document.getElementById('cash').checked = false;
            alert('Order received. Please waiting for the delivery');
            updateCartTotal();
            closeCart();
            //redirect to order details page
        }
        if (document.getElementById('online').checked) {
            firebase.database().ref("Orders/" + newOrder + "/Payment").set({
                total: amount,
                payment_method: "bank",
                payment_status: "unpaid",
                order_status: "preparing",
                typeofdelivery: typeofdelivery
            });
            document.getElementById('online').checked = false;
            alert('Redirect to transaction section.');
            updateCartTotal();
            closeCart();

            //redirect to transaction page
            window.location.replace("transaction.html");
        }

    }
}

function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
}

function addToPCart(id) {
    //retrieve product info
    var productRef = database.ref('Productinfo/' + sellerid + "/" + id);

    productRef.once('value').then(function(snapshot) {
        var name = snapshot.val().Product_name;
        var price = snapshot.val().Price;
        var image = snapshot.val().productUrl;
        addItemToCart(name, price, image);
        updateCartTotal();
    });
}

function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
    var num = Math.round(price * 100) / 100;
    var Pprice = num.toFixed(2);
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart');
            return
        }
    }
    var cartRowContents = `
    <div class="cart-item cart-column">
        <img class="cart-item-image" id="pimage" src="${imageSrc}" width="100" height="100">
        <span class="cart-item-title" id="${title}">${title}</span>
    </div>
    <span class="cart-price cart-column">${Pprice}</span>
    <div class="cart-quantity cart-column">
        <input class="cart-quantity-input" id="quantity" type="number" value="1">
        <button class="btn btn-remove" type="button">REMOVE</button>
    </div>
    `
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow.getElementsByClassName('btn-remove')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    var total = 0;
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price')[0];
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        var price = parseFloat(priceElement.innerText.replace('RM', ''));
        var quantity = quantityElement.value;
        total = total + (price * quantity);
    }
    total = Math.round(total * 100) / 100;
    var a = total.toFixed(2);
    document.getElementsByClassName('cart-total-price')[0].innerText = 'RM' + a;
    document.getElementsByClassName('cart-total-price')[0].id = a.toString();
}

function on() {
    document.getElementById("overlay").style.display = "block";;
}

function closeCart() {
    document.getElementById('self_pickup').checked = false;
    document.getElementById('delivery').checked = false;
    document.getElementById('cash').checked = false;
    document.getElementById('online').checked = false;
    document.getElementById("overlay").style.display = "none";
}


function todayDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;

    return today;
}
//=================================================================================//
//Rating and Comment 

//Show all the ratings and comments associated with the seller ID
var stallRef = database.ref('RatingComment/' + sellerid);
stallRef.on('value', gotCData, errCData);

function gotCData(data) {
    var RnC = data.val();
    var RCkeys = Object.keys(RnC);


    for (var i = 0; i < RCkeys.length; i++) {
        var c = RCkeys[i];
        var ratings = RnC[c].rating;
        var comments = RnC[c].comment;

        displayRC(ratings, comments);
    }
}

function errCData(err) {
    console.log('Error!');
    console.log(err);
}

function displayRC(RCrating, RCcomment) {
    var RCrow = document.createElement('div');
    RCrow.classList.add('reviews');

    var Review = document.getElementsByClassName('ShowRC')[0];

    var RCrowContents = `
        <div class="reviews">
            <span class="RatingTT">${RCrating}</span> 
            <span class="CommentTT">${RCcomment}</span>
        </div>
        `
    RCrow.innerHTML = RCrowContents;
    Review.append(RCrow);
}

//Calculate the overall rating
var RCref = database.ref('RatingComment/' + sellerid);
RCref.on('value', gotRData, errRData);
var Rates = [];

function gotRData(data) {
    var RnC = data.val();
    var RCkeys = Object.keys(RnC);

    for (var i = 0; i < RCkeys.length; i++) {
        var c = RCkeys[i];
        Rates[i] = RnC[c].rating;
    }
    var total = 0;

    for (var i in Rates) {
        total += parseInt(Rates[i]);
    }
    var OverallRt = parseFloat(total / Rates.length).toFixed(2);

    var stallRef = database.ref('Users/Type of Account/seller/' + sellerid);

    stallRef.child('StallInfo').once('value').then(function(snapshot) {

        var scategory = snapshot.val().stallCategory;

        firebase.database().ref("Stalls/" + scategory + "/" + sellerid + "/Rating").set({
            Overall: OverallRt
        });

    });
    document.getElementById("overall_rating").innerHTML = OverallRt + "/5.00";

    //Show Overall Star Rating
    var b = parseInt(OverallRt);
    var unchecked = 5 - OverallRt;
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
    document.getElementById("StarRating").innerHTML = starrating;
}

function errRData(err) {
    console.log('Error!');
    console.log(err);
}


//Customer give ratings and comments
var commetG = document.getElementById("commenttext");
let RC = firebase.database().ref("RatingComment");

function GiveRC() {

    var StarValue = "0";
    var cmtValue = "-";
    for (i = 0; i < document.getElementsByName('rate').length; i++) {
        if (document.getElementsByName('rate')[i].checked) {
            StarValue = document.getElementsByName('rate')[i].value;
        }
    }

    if (StarValue == "0") {
        alert("Please submit a Rating in order to post!")
    } else if (commetG.value == "") {
        commetG.value = "-";
    } else {
        cmtValue = commetG.value;
        let newRC = RC.push().key;

        firebase.database().ref("RatingComment/" + sellerid + "/" + newRC).set({
            rating: StarValue,
            comment: cmtValue
        });
        alert("You have given a rating of " + StarValue + " ! Comment given: " + cmtValue + ".")

        var Review = document.getElementsByClassName('ShowRC')[0];

        while (Review.hasChildNodes()) {
            Review.removeChild(Review.firstChild);
        }
    }
}