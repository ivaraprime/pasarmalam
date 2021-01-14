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


var userProfile = document.getElementById("Profile");

function logOut() {
    firebase.auth().signOut();
    alert("You are logged out!");
    Redirect();
}

function Redirect() {
    window.location.assign("register_login.html");
}


var stallName = document.getElementById("stallName");
var stallDp = document.getElementById("sDesc");

function updateStall() {

    var category_val = "";
    for (i = 0; i < document.getElementsByName('category').length; i++) {
        if (document.getElementsByName('category')[i].checked) {
            category_val = document.getElementsByName('category')[i].value;
        }
    }

    if (stallName.value == "" || stallDp.value == "") {
        alert("Fields must not be empty!")
    } else if (category_val == "") {
        alert("Please choose a category!")
    } else {
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref("Users/" + "Type of Account/" + "seller/" + userId + "/StallInfo").update({
            stallName: stallName.value,
            stallDescp: sDesc.value,
            stallCategory: category_val,
        });
        var database = firebase.database();
        var reff = database.ref('StallImages/' + userId);
        reff.once('value').then(function(snapshot) {
            var link = snapshot.val().Link;

            if (link == "-") {
                alert("Please select an image for the stall!")
            } else {
                firebase.database().ref("Stalls/" + category_val + "/" + userId + "/StallInfo").set({
                    stallName: stallName.value,
                    stallDescp: sDesc.value,
                    stallCategory: category_val,
                    stallID: userId,
                    stallImage: link
                });

                firebase.database().ref("Users/" + "Type of Account/" + "seller/" + userId + "/StallInfo").update({
                    stallImg: link
                });

                var checkRt = database.ref("Users/" + "Type of Account/" + "seller/" + userId + "/StallInfo");
                checkRt.once('value').then(function(snapshot) {
                    var rtCheck = snapshot.val().rating;

                    if (rtCheck == "") {
                        firebase.database().ref("Stalls/" + category_val + "/" + userId + "/Rating").set({
                            Overall: 5
                        });
                        firebase.database().ref("Users/" + "Type of Account/" + "seller/" + userId + "/StallInfo").update({
                            rating: "-"
                        });

                    } else {
                        alert("rating will remain the same!")
                    }
                });

                alert("Stall Info Updated! ")
                Show();
            }
        });


    }
}

var SellerHP = document.getElementById("sHP");

function updateSellerPhone() {

    var userId = firebase.auth().currentUser.uid;

    if (SellerHP.value.length > 11 || SellerHP.value.length < 10) {
        alert("Phone number format incorrect!")
    } else if (SellerHP.value == "") {
        alert("Field must not be empty!")
    } else {
        firebase.database().ref("Users/" + "Type of Account/" + "seller/" + userId + "/Contact Details").set({
            phoneNum: SellerHP.value
        });

        var database = firebase.database();
        var reff = database.ref('Users/' + 'Type of Account/' + 'seller/' + userId + '/StallInfo');
        reff.once('value').then(function(snapshot) {
            var stallC = snapshot.val().stallCategory;

            firebase.database().ref("Stalls/" + stallC + "/" + userId + "/Contact Details").set({
                phoneNum: SellerHP.value
            });
        });
        alert("Phone Number Updated!")
        Show();
    }
}

var SNUm = document.getElementById("SNumber");
var SStreet = document.getElementById("Street");
var SZipcode = document.getElementById("Zipcode");
var SCity = document.getElementById("City");
var SState = document.getElementById("State");

function updateS_Add() {
    var userId = firebase.auth().currentUser.uid;
    if (SZipcode.value.length != 5) {
        alert("Zipcode must be of length of 5!")
    } else if (SNUm.value == "" || SStreet.value == "" || SZipcode.value == "" || SCity.value == "" || SState.value == "") {
        alert("Fields must not be empty!")
    } else {
        firebase.database().ref("Users/" + "Type of Account/" + "seller/" + userId + "/Address").set({
            num: SNUm.value,
            street: SStreet.value,
            zipcode: SZipcode.value,
            city: SCity.value,
            state: SState.value
        });

        var database = firebase.database();
        var reff = database.ref('Users/' + 'Type of Account/' + 'seller/' + userId + '/StallInfo');
        reff.once('value').then(function(snapshot) {
            var stallC = snapshot.val().stallCategory;

            firebase.database().ref("Stalls/" + stallC + "/" + userId + "/Address").set({
                num: SNUm.value,
                street: SStreet.value,
                zipcode: SZipcode.value,
                city: SCity.value,
                state: SState.value
            });
        });
        alert("Address Updated!")
        Show();
    }

}

document.getElementById("ChooseIMG").onclick = function(e) {
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
        files = e.target.files;
        document.getElementById('uploadLoad').innerHTML = '';
        reader = new FileReader();
        reader.onload = function() {
            document.getElementById("s_IMG").src = reader.result;

        }

        reader.readAsDataURL(files[0]);
        uploadimage();
    }
    input.click();

}

function uploadimage() {
    //ImgName = document.getElementById('namebox').value;
    let userId = firebase.auth().currentUser.uid;
    var uploadTask = firebase.storage().ref('StallImages/' + userId).put(files[0]); // + '/' + ImgName

    uploadTask.on('state_changed', function(snapshot) {
            //var progress = (snapshot.bytesTranferred / snapshot.totalBytes) * 100;
            document.getElementById('uploadLoad').innerHTML = 'Uploading... Please wait...';
        },

        function(error) {
            alert('error in saving the image');
        },


        function() {
            uploadTask.snapshot.ref.getDownloadURL().then(function(DownloadURL) {
                    ImgUrl = DownloadURL;

                    var database = firebase.database();
                    var reff = database.ref('Users/' + 'Type of Account/' + 'seller/' + userId + '/StallInfo');
                    reff.once('value').then(function(snapshot) {
                        var stallC = snapshot.val().stallCategory;

                        firebase.database().ref('StallImages/' + userId).set({
                            Link: ImgUrl
                        });
                        document.getElementById('uploadLoad').innerHTML = 'Uploaded.';
                        alert('Image added succesfully! Please update Stall Info to save changes~');

                    });
                }

            );
        })
}


function Show() {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            let userId = firebase.auth().currentUser.uid;
            console.log(userId)

            //show profile
            // var userId = firebase.auth().currentUser.uid;
            var database = firebase.database();
            var userRef = database.ref('Users/' + 'Type of Account/' + 'seller/' + userId);
            var userRef1 = database.ref('Users/' + 'Type of Account/' + 'seller/' + userId + "/StallInfo");
            var userRef2 = database.ref('Users/' + 'Type of Account/' + 'seller/' + userId + "/Contact Details");
            var userRef3 = database.ref('Users/' + 'Type of Account/' + 'seller/' + userId + "/Address");
            var userRef4 = database.ref('StallImages/' + userId);


            userRef.once('value').then(function(snapshot) {
                var name = snapshot.val().name;
                var email = snapshot.val().emailacc;
                var StallCat = snapshot.val().category_val;

                document.getElementById("sellerName").innerHTML = name;
                document.getElementById("email").innerHTML = email;

                console.log(snapshot.val());
            });

            userRef1.once('value').then(function(snapshot) {
                var stallname = snapshot.val().stallName;
                var stallD = snapshot.val().stallDescp;
                var stallC = snapshot.val().stallCategory;

                document.getElementById("stall").innerHTML = stallname;
                document.getElementById("stallDescp").innerHTML = stallD;
                document.getElementById("stallCat").innerHTML = stallC;

                console.log(snapshot.val());
            });

            userRef2.once('value').then(function(snapshot) {
                var phone = snapshot.val().phoneNum;

                document.getElementById("HP").innerHTML = phone;

                console.log(snapshot.val());
            });

            userRef3.once('value').then(function(snapshot) {
                var num = snapshot.val().num;
                var street = snapshot.val().street;
                var zipcode = snapshot.val().zipcode;
                var city = snapshot.val().city;
                var state = snapshot.val().state;

                document.getElementById("stallAdd").innerHTML = num + ", " + street + ", " + zipcode + " " +
                    city + ", " + state + ".";

                console.log(snapshot.val());
            });

            userRef4.once('value').then(function(snapshot) {
                var stallImg = snapshot.val().Link;

                document.getElementById("Imagefield").src = stallImg;

                console.log(snapshot.val());
            });
        } //end if user exist
    });

}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        let userId = firebase.auth().currentUser.uid;
        console.log(userId)

        //show profile
        // var userId = firebase.auth().currentUser.uid;
        var database = firebase.database();
        var userRef = database.ref('Users/' + 'Type of Account/' + 'seller/' + userId);
        var userRef1 = database.ref('Users/' + 'Type of Account/' + 'seller/' + userId + "/StallInfo");
        var userRef2 = database.ref('Users/' + 'Type of Account/' + 'seller/' + userId + "/Contact Details");
        var userRef3 = database.ref('Users/' + 'Type of Account/' + 'seller/' + userId + "/Address");
        var userRef4 = database.ref('StallImages/' + userId);


        userRef.once('value').then(function(snapshot) {
            var name = snapshot.val().name;
            var email = snapshot.val().emailacc;
            var StallCat = snapshot.val().category_val;

            document.getElementById("sellerName").innerHTML = name;
            document.getElementById("email").innerHTML = email;

            console.log(snapshot.val());
        });

        userRef1.once('value').then(function(snapshot) {
            var stallname = snapshot.val().stallName;
            var stallD = snapshot.val().stallDescp;
            var stallC = snapshot.val().stallCategory;

            document.getElementById("stall").innerHTML = stallname;
            document.getElementById("stallDescp").innerHTML = stallD;
            document.getElementById("stallCat").innerHTML = stallC;

            console.log(snapshot.val());
        });

        userRef2.once('value').then(function(snapshot) {
            var phone = snapshot.val().phoneNum;

            document.getElementById("HP").innerHTML = phone;

            console.log(snapshot.val());
        });

        userRef3.once('value').then(function(snapshot) {
            var num = snapshot.val().num;
            var street = snapshot.val().street;
            var zipcode = snapshot.val().zipcode;
            var city = snapshot.val().city;
            var state = snapshot.val().state;

            document.getElementById("stallAdd").innerHTML = num + ", " + street + ", " + zipcode + " " +
                city + ", " + state + ".";

            console.log(snapshot.val());
        });

        userRef4.once('value').then(function(snapshot) {
            var stallImg = snapshot.val().Link;

            document.getElementById("Imagefield").src = stallImg;

            console.log(snapshot.val());
        });


        //SHOW PRODUCTS

        var RCref = database.ref('Productinfo/' + userId);
        RCref.on('value', gotPData, errData);


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
            console.log('Error! No Products');
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


        //show rating and comment
        //var sellerID = localStorage.getItem("Seller");
        //Show overall Rating
        var RCref = database.ref('RatingComment/' + userId);
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
            var Overallrt = parseFloat(total / Rates.length).toFixed(2);
            document.getElementById("sOvrRating").innerHTML = Overallrt + "/5.00";

            //Show Overall Star Rating
            var b = parseInt(Overallrt);
            var unchecked = 5 - Overallrt;
            var starrating = '<i class="fa fa-star"></i>';
            var star = '<i class="fa fa-star"></i>';
            var emptystar = '<i class="fa fa-star-o"></i>';
            for (var i = 1; i < b; i++) {
                starrating += star;
            }

            if (unchecked > 0) {
                if ((unchecked % 1) != 0) {
                    starrating += '<i class="fa fa-star-half-o"></i>';
                } else if (unchecked >= 1) {
                    starrating += emptystar;
                }
                for (var i = 1; i < unchecked; i++) {
                    starrating += emptystar;
                }
            }
            document.getElementById("SSRT").innerHTML = starrating;
        }

        function errData(err) {
            console.log('Error!No');
            console.log(err);
        }

        function errRData(err) {
            console.log('Error!');
            console.log(err);
        }

        //show all comments
        var sellerRef = database.ref('RatingComment/' + userId);
        sellerRef.on('value', gotData, errData);

        function gotData(data) {
            var SRnC = data.val();
            var SRCkeys = Object.keys(SRnC);

            for (var i = 0; i < SRCkeys.length; i++) {
                var sc = SRCkeys[i];
                var Sratings = SRnC[sc].rating;
                var Scomments = SRnC[sc].comment;

                displaySRC(Sratings, Scomments);
            }
        }

        function displaySRC(SRCrating, SRCcomment) {
            var SRCrow = document.createElement('div');
            SRCrow.classList.add('Owns');

            var SReview = document.getElementsByClassName('ShowAll')[0];

            var SRCrowContents = `
              <div class="Owns">
                  <span class="RatingTT">${SRCrating}</span> 
                  <span class="divider"> ---> </span> 
                  <span class="CommentTT">${SRCcomment}</span>
              </div>
              `
            SRCrow.innerHTML = SRCrowContents;
            SReview.append(SRCrow);
        }




    } //end if user exist
});


var nameV, rollV, secV, genV;

function Ready(){
    nameV = document.getElementById('namebox').value;
    rollV = document.getElementById('rollbox').value;
    secV = "Seller";
    genV = document.getElementById('genbox').value;
}

//------------Insert Process-----------//
document.getElementById('insert').onclick = function(){
    Ready();
    if(rollV=="")
    {
        alert("Please enter your Visa/Mastercard!")
    }
    else if(nameV=="")
    {
        alert("Please enter your Name!")
    }
    else if(genV=="")
    {
        alert("Please enter your Gender!")
    }
    else if(rollV!=""&&nameV!=""&&genV!="")
    {
        firebase.database().ref('client/'+rollV).set({
            NameOfStudent: nameV,
            CardNo: rollV,
            Section: secV,
            Gender: genV
        });
        alert("Visa/Mastercard with CardNo:"+rollV +" added successfully!")
    }
    
}

//--------------Selection Process----------//
document.getElementById("select").onclick = function(){
    Ready();
    firebase.database().ref('client/'+rollV).on('value',function(snapshot)
    {
      if(rollV=="")
      {
        alert("Please enter your Visa/Mastercard!")
      }
      else 
      {
        document.getElementById('namebox').value= snapshot.val().NameOfStudent;
        document.getElementById('genbox').value= snapshot.val().Gender;
      }  
    });
}

//------------Update Process-----------//
document.getElementById('update').onclick = function(){
    Ready();
    firebase.database().ref('client/'+rollV).on('value',function(snapshot)
    {
      var exCard = snapshot.val().CardNo;
      var exName = snapshot.val().NameOfStudent;
      var exG = snapshot.val().Gender;

      if(rollV!=exCard)
      {
      alert("Cannot be changed! Please insert anothers!")
      }  
      else if(nameV!=exName)
      {
        firebase.database().ref('client/'+rollV).update({
        NameOfStudent: nameV
      });
      alert("Name updated successfully!")
      }  
      else if(genV!=exG)
      {
        firebase.database().ref('client/'+rollV).update({
        Gender: genV
      });
      alert("Gender updated successfully!")
      }  
    });
}

//------------Remove Process-----------//
document.getElementById('delete').onclick = function(){
    Ready();
    var useruid = firebase.auth().currentUser.uid;
    firebase.database().ref('client/'+rollV).remove()
    alert("Visa/Mastercard removed successfully!")
    }    


firebase.auth().onAuthStateChanged(function(user) {
if (user) {
    let userId = firebase.auth().currentUser.uid;
    console.log(userId)
    
var database = firebase.database();
var SellerP = database.ref('Users/' + 'Type of Account/' + 'seller/' + userId);
SellerP.once('value').then(function(snapshot)
{
    var role = snapshot.val().accType ;
    if(role=="seller")
    {
      document.getElementById('section').innerHTML= "Seller";
    }
   
});
}
});