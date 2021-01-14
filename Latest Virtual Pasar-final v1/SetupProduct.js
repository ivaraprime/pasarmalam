// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyCrrd39UiNqYGrXESuIe9j-M7bSoQPEZS0",
    authDomain: "virtual-pasar.firebaseapp.com",
    databaseURL: "https://virtual-pasar-default-rtdb.firebaseio.com",
    projectId: "virtual-pasar",
    storageBucket: "virtual-pasar.appspot.com",
    messagingSenderId: "386082595981",
    appId: "1:386082595981:web:7773e4cffc18e4adef6ec4",
    measurementId: "G-L0DTRQWPPH"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();


//   //Reference Product info Collections
let productInfo = firebase.database().ref("Productinfo");

//Variables for images
var ImgName, ImgUrl;
var files = [];
var reader;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        let userId = firebase.auth().currentUser.uid;
        console.log(userId)
        
        //show profile
        // var userId = firebase.auth().currentUser.uid;
    var database = firebase.database();
    var CustP = database.ref('Users/' + 'Type of Account/' + 'seller/' + userId);
    CustP.once('value').then(function(snapshot)
    {
        var username = snapshot.val().name ;
          document.getElementById('username').innerHTML= username;
    });
    }   
    });


document.getElementById('select').onclick = function(e) {
    var input = document.createElement('input');
    input.type = 'file';
    document.getElementById('upProgress').innerHTML = '0%';

    input.onchange = e => {
        files = e.target.files;
        reader = new FileReader();
        reader.onload = function() {
            document.getElementById("myimg").src = reader.result;

        }

        reader.readAsDataURL(files[0]);
        uploadImg();//will upload the image if after user selected the image
    }
    input.click();

}

function uploadImg() {
    ImgName = document.getElementById('namebox').value;
    let userId = firebase.auth().currentUser.uid;
    var uploadTask = firebase.storage().ref('Images/' + userId + '/' + ImgName).put(files[0]);

    uploadTask.on('state_changed', function(snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            document.getElementById('upProgress').innerHTML = 'Upload ' + progress + ' %';
        },

        function(error) {
            alert('error in saving the image');
        },

        function() {
            uploadTask.snapshot.ref.getDownloadURL().then(function(DownloadURL) {
                ImgUrl = DownloadURL;
               // alert('Image added succesfully');
            });
        }

    );

}


//Listen for a submit
document.querySelector(".Product-form").addEventListener("submit", submitForm);



function submitForm(e) {
    e.preventDefault();

    //Get Input Values

    let userId = firebase.auth().currentUser.uid;
    let name = document.querySelector(".name").value;
    let price = document.querySelector(".price").value;
    let typeprice = getSelectValue();

    let pricedes = document.querySelector(".pdes").value;

    console.log(userId, name, price, typeprice, pricedes);

    saveProductInfo(userId, name, price, typeprice, pricedes, ImgUrl);

}

function getSelectValue() {
    var typeprice = document.getElementById("typ").value;
    return typeprice;
}

// Save Product info into firebase
function saveProductInfo(userId, name, price, typeprice, pricedes, Url) {
    let newProductInfo = productInfo.push().key;

    firebase.database().ref("Productinfo/"+ userId+ "/" + newProductInfo).set({
        Seller_id: userId,
        Product_name: name,
        Price: price,
        Type_price: typeprice,
        Price_desc: pricedes,
        productUrl:Url,
        pid:newProductInfo

    });
    alert('Product added succesfully');
    document.getElementById('namebox').value = '';
    document.getElementById('myimg').src = '';
    document.getElementById('pname').value = '';
    document.getElementById('pprice').value = '';
    document.getElementById('pdesc').value = '';
}
function logOut()
{
  firebase.auth().signOut();
  alert("You are logged out!");
  Redirect();
}
function Redirect() {
  window.location.assign("register_login.html");
}