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

function clearCache() {
    var items = document.getElementsByClassName('productfield')[0];
    var list = document.getElementsByClassName('orderlist')[0];
    while (items.hasChildNodes() || list.hasChildNodes()) {
        if (items.hasChildNodes()) {
            items.removeChild(items.firstChild);
        } else {
            list.removeChild(list.firstChild);
        }
    }

}

function logOut() {
    firebase.auth().signOut();
    alert("You are logged out!");
    Redirect();
}

function Redirect() {
    window.location.assign("register_login.html");
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        let userId = firebase.auth().currentUser.uid;
        console.log("order::" + userId);

        var cnameref = database.ref('Users/Type of Account/cust/' + userId);
        cnameref.once('value').then(function(snapshot) {

            if (snapshot.val() == null) {

                //user is seller
                var snameref = database.ref('Users/Type of Account/seller/' + userId);
                snameref.once('value').then(function(snapshot) {
                    var username = snapshot.val().name;
                    document.getElementById('currentusername').innerHTML = username;
                });

                snameref.child("Order").once('value').then(function(snapshot) {
                    //check order
                    if (snapshot.val() == null) { //if no order
                        alert("No order now.")

                    } else {
                        //if has order
                        var orderReference = database.ref('Orders');
                        orderReference.orderByChild('Info/sid').equalTo(userId).once('value').then(function(snapshot) {
                            console.log(snapshot.val());

                            var order = snapshot.val();
                            var keys = Object.keys(order);
                            console.log(keys); //get the oid
                            for (var i = 0; i < keys.length; i++) {
                                var k = keys[i];
                                var date = order[k].Info.date;
                                var amount = order[k].Payment.total;
                                var status = order[k].Payment.order_status;
                                //display order list
                                displayOrder(k, date, amount, status);
                            }


                        });
                    }

                });



            } else {

                //user is customer
                var username = snapshot.val().name;
                document.getElementById('currentusername').innerHTML = username;
                cnameref.child("Order").once('value').then(function(snapshot) {
                    //check order
                    if (snapshot.val() == null) { //if no order
                        alert("No order now.")

                    } else {
                        //if has order
                        var orderReference = database.ref('Orders');
                        orderReference.orderByChild('Info/cid').equalTo(userId).once('value').then(function(snapshot) {
                            console.log(snapshot.val());

                            var order = snapshot.val();
                            var keys = Object.keys(order);
                            console.log(keys); //get the oid
                            for (var i = 0; i < keys.length; i++) {
                                var k = keys[i];
                                var date = order[k].Info.date;
                                var amount = order[k].Payment.total;
                                var status = order[k].Payment.order_status;
                                //display order list
                                displayOrder(k, date, amount, status);
                            }


                        });
                    }

                });
            }

        });

    } //end user exist    
});

function displayOrder(key, date, amount, status) {
    var Row = document.createElement('div');
    Row.classList.add('listcontainer');
    Row.id = key;
    Row.setAttribute('onclick', "openOrder(this.id)");
    var order = document.getElementsByClassName('orderlist')[0];


    var RowContents = `
            <span class="order_date">${date}</span>
            <span class="order_total">RM ${amount}</span>
            <span class="order_status">${status}</span>
        `
    Row.innerHTML = RowContents;
    order.append(Row);
}

function errData(err) {
    console.log('Error!');
    console.log(err);
}
//open particular order page
function openOrder(id) {
    let userId = firebase.auth().currentUser.uid;

    localStorage.setItem("updateOID", id);
    var reference = database.ref('Orders');
    reference.on('value', getOrder, errData);

    function getOrder(data) {
        var order = data.val();
        var date = order[id].Info.date;
        var amount = order[id].Payment.total;
        var order_status = order[id].Payment.order_status;
        var sid = order[id].Info.sid;
        var cid = order[id].Info.cid;
        var method = order[id].Payment.payment_method;
        var payment_status = order[id].Payment.payment_status;
        var delivery_type = order[id].Payment.typeofdelivery;

        //retrieve seller infor
        var stallRef = database.ref('Users/Type of Account/seller/' + sid);
        stallRef.once('value').then(function(snapshot) {
            var sname = snapshot.val().name;
            var phone = snapshot.child("Contact Details").val().phoneNum;
            var num = snapshot.child("Address").val().num;
            var street = snapshot.child("Address").val().street;
            var zipcode = snapshot.child("Address").val().zipcode;
            var city = snapshot.child("Address").val().city;
            var state = snapshot.child("Address").val().state;
            var address = num + ", " + street + ", " + zipcode + " " + city + ", " + state + ".";
            document.getElementById("stall_name").innerHTML = sname;
            document.getElementById("stall_contact").innerHTML = phone;
            document.getElementById("stall_address").innerHTML = address;
        });

        //retrieve customer info
        var custRef = database.ref('Users/Type of Account/cust/' + cid);
        custRef.once('value').then(function(snapshot) {
            var cname = snapshot.val().name;
            var phone = snapshot.child("Contact Details").val().phoneNum;
            var num = snapshot.child("Address").val().num;
            var street = snapshot.child("Address").val().street;
            var zipcode = snapshot.child("Address").val().zipcode;
            var city = snapshot.child("Address").val().city;
            var state = snapshot.child("Address").val().state;
            var caddress = num + ", " + street + ", " + zipcode + " " + city + ", " + state + ".";

            document.getElementById("cust_name").innerHTML = cname;
            document.getElementById("cust_contact").innerHTML = phone;
            document.getElementById("cust_address").innerHTML = caddress;
        });


        document.getElementById("order_Date").innerHTML = date;
        document.getElementById("total_amount").innerHTML = "RM" + amount;
        document.getElementById("orderStatus").innerHTML = order_status;
        document.getElementById("paymentMethod").innerHTML = method;
        document.getElementById("paymentStatus").innerHTML = payment_status;
        document.getElementById("deliveryType").innerHTML = delivery_type;

        if (sid == userId) {

            if (method == "cash" && payment_status == "unpaid") {
                document.getElementById("receivedbut").style.display = "block"
            } else {
                document.getElementById("receivedbut").style.display = "none";
            }
            if (!order_status == "Delivered") {
                document.getElementById("receivedbut").style.display = "none";
            }

            if (order_status == "preparing") {
                document.getElementById("updatebut").style.display = "block";
            } else {
                document.getElementById("updatebut").style.display = "none";
            }
            document.getElementById("makepaymentbut").style.display = "none";


        } else if (cid == userId) {

            if ((payment_status == "unpaid") && (method == "bank")) {
                document.getElementById("makepaymentbut").style.display = "block"
            } else {
                document.getElementById("makepaymentbut").style.display = "none";
            }

            if (order_status == "Delivered") {
                document.getElementById("receivedbut").style.display = "none";
            } else {
                document.getElementById("receivedbut").style.display = "block";
            }
            document.getElementById("updatebut").style.display = "none";

        } //end else if

    } //end getorder

    reference.child(id).child("Products").on('value', getProduct, errData);

    function getProduct(data) {
        var order = data.val();
        var keys = Object.keys(order);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var pname = order[k].Product_name;
            var quantity = order[k].productQt;
            var url = order[k].productUrl;

            displayProduct(pname, quantity, url);
        }

    }

    openOrderDetails();


}

function displayProduct(name, quantity, img) {
    var Row = document.createElement('div');
    Row.classList.add('order_products');
    var product = document.getElementsByClassName('productfield')[0];


    var RowContents = `
            <img id="pimage" src="${img}">
            <span class="pname">${name}</span>
            <span class="pquantity">${quantity}</span>
        `
    Row.innerHTML = RowContents;
    product.append(Row);
}

function hadOpen() {
    alert('You already open MY Order!');
}

function openOrderDetails() {
    document.getElementById("order_overlay").style.display = "block";
}

function off() {
    //remove

    var items = document.getElementsByClassName('productfield')[0];
    while (items.hasChildNodes()) {
        items.removeChild(items.firstChild);
    }
    document.getElementById("order_overlay").style.display = "none";
}

//----------Customer part-------------//
function ReceivedDelivery() {

    var oid = localStorage.getItem("updateOID")
    var statusRef = database.ref('Orders/' + oid + "/Payment");

    statusRef.once('value').then(function(snapshot) {

        var payment_status = snapshot.val().payment_status;
        var payment_method = snapshot.val().payment_method;


        if ((payment_method == 'bank') && (payment_status == 'unpaid')) {
            alert("Failed. You haven't pay of this order.");
        } else {

            if (confirm("Are you sure you have received the delivery?")) {
                var items = document.getElementsByClassName('orderlist')[0];
                while (items.hasChildNodes()) {
                    items.removeChild(items.firstChild);
                }
                statusRef.update({
                    order_status: "Delivered",
                    payment_status: "paid"
                });

                // document.getElementById("cust_name").innerHTML = cname;   
                alert("Received Delivery. Status updated.")
                off();
                location.reload();
            }

        }

    });

}

function makePayment() {
    window.location.replace("transaction.html");
}



//------------Seller part--------------//
function InDelivery() {
    var oid = localStorage.getItem("updateOID")
    var statusRef = database.ref('Orders/' + oid + "/Payment");

    statusRef.once('value').then(function(snapshot) {

        var payment_status = snapshot.val().order_status;
        var payment_method = snapshot.val().payment_method;


        if ((payment_method == 'bank') && (payment_status == 'unpaid')) {
            alert("Failed. Customer haven't pay of this order.");
        } else {

            if (confirm("Parcel on delivery?")) {

                var items = document.getElementsByClassName('orderlist')[0];
                while (items.hasChildNodes()) {
                    items.removeChild(items.firstChild);
                }
                statusRef.update({
                    order_status: "On delivery"
                });

                alert("Parcel on Delivery. Status updated.")
                off();
                location.reload();
            }
        }

    });

}

function goToProfile() {
    let userId = firebase.auth().currentUser.uid;

    var SGP = database.ref('Users/Type of Account/seller/' + userId);
    SGP.once('value').then(function(snapshot) {
        var accT = snapshot.val().accType;
        if (accT == "seller") {
            window.location.assign("sellerProfile.html");
        }
    });

    var CGP = database.ref('Users/Type of Account/cust/' + userId);
    CGP.once('value').then(function(snapshot) {
        var accT = snapshot.val().accType;
        if (accT == "cust") {
            window.location.assign("custProfile.html");
        }
    });
}

function goMain() {
    let userId = firebase.auth().currentUser.uid;

    var CGP = database.ref('Users/Type of Account/cust/' + userId);
    CGP.once('value').then(function(snapshot) {
        var accT = snapshot.val().accType;
        if (accT == "cust") {
            window.location.assign("mainpage.html");
        }
    });
}