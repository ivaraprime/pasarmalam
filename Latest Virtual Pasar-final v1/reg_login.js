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


function register()
{
    var username =document.getElementById("User");
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    var cust = document.getElementById("CustAcc");
    var seller = document.getElementById("SellerAcc");
    var radio_check_val = "";
    for (i = 0; i < document.getElementsByName('accType').length; i++) {
        if (document.getElementsByName('accType')[i].checked) 
        {
            radio_check_val = document.getElementsByName('accType')[i].value;        
        }        
    }

    function ValidateEmail(email)
    {
    var mailformat = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
    if(email.value.match(mailformat))
    {
    return true;
    }
    else
    {
    alert("You have entered an invalid email address!");
    return false;
    }
    }

    if(password.value == "" && username.value=="")
    {
        alert("Fields cannot be empty!");
    }
    else if(username.value == "")
    {
        alert("Username cannot be empty!");
    }
    else if(password.value == "")
    {
        alert("Password cannot be empty!");
    }
    else if(email.value == "")
    {
        alert("Email cannot be empty!");
    }
    else if (password.value.length < 6)
    {
        alert("Password cannot be less than 6!");
    }
    else if (radio_check_val === "")
    {
        alert("Please select an account type!");
    }   
    else if(username.value!=""&& password.value.length >= 6 && ValidateEmail(email)==true)
    {
        const promise = auth.createUserWithEmailAndPassword(email.value,password.value);
        promise.catch(e => alert(e.message));
        
        var user = firebase.auth().currentUser;

        var emailDB, uid;

        if (user != null) 
        {
            emailDB = user.email;
            uid = user.uid; 
        }

        firebase.database().ref("Users/" + "Type of Account/" + radio_check_val+ "/" + uid).set(
        {
            name: username.value,
            emailacc:emailDB,
            password:password.value,
            accType:radio_check_val,
        });
        
        if(radio_check_val=="seller")
        {
            firebase.database().ref("Users/" + "Type of Account/" + radio_check_val+ "/" + uid + "/StallInfo").set(
                {
                    stallName:"-",
                    stallDescp:"-",
                    stallCategory:"-",
                    stallImg:"-",
                    rating:""
                });

            firebase.database().ref("StallImages/" + uid).set(
                {
                   Link:"-"
                });   
        }
        
        firebase.database().ref("Users/" + "Type of Account/" + radio_check_val+ "/" + uid + "/Contact Details").set(
        {
            phoneNum:"-"
        });
        firebase.database().ref("Users/" + "Type of Account/" + radio_check_val+ "/" + uid + "/Address").set(
        {
            num:"-",
            street:"-",
            city:"-",
            state:"-",
            zipcode:"-"
        });
        alert("Account Registered!");

        if(radio_check_val=="cust")
        {
            window.location.replace("mainpage.html");
        }
        else if(radio_check_val=="seller")
        {
            window.location.replace("sellerProfile.html");
            getUID(this.id);
        }
        
    }

    
    
}

function signin()
{
    var Email = document.getElementById("Email");
    var Password = document.getElementById("Password");
    

    const promise = auth.signInWithEmailAndPassword(Email.value,Password.value); 
    var user = firebase.auth().currentUser;

    var uid,type,type1;

    if (user != null) 
    {
        uid = user.uid; 
    }

    
    if(Email.value == "")
    {
        alert("Email cannot be empty!");
    }
    else if (Password.value == "")
    {
        alert("Password cannot be empty!");
    }
    else if (Email.value != "" && Password.value != "" )    
    {
        firebase.auth().onAuthStateChanged(function(user)
        {
            if(user)
            {
               
                var userId = firebase.auth().currentUser.uid;

                var database = firebase.database();
                var userRef = database.ref('Users/' + 'Type of Account/' + 'seller/' + userId);
                var userRef2 = database.ref('Users/' + 'Type of Account/' + 'cust/' + userId);

                userRef.once('value').then(function (snapshot) {
                var acc_type = snapshot.val().accType ;
                if(acc_type=="seller")
                {
                    alert("Log In Successful! Hello "+ Email.value )
                    getUID(this.id);
                    window.location.replace("sellerProfile.html");
                }
                });

                userRef2.once('value').then(function (snapshot) {
                var acc_type = snapshot.val().accType ;
                if(acc_type=="cust")
                {
                    alert("Log In Successful! Hello "+ Email.value )
                    window.location.replace("mainpage.html");
                }
                });
           }
            else
            {
                promise.catch(e => alert(e.message));
            }
        });
    } 
}


var LoginForm = document.getElementById("LoginForm");
var SignupForm = document.getElementById("SignupForm");
var Indicator = document.getElementById("Indicator");

function signup()
{
    SignupForm.style.transform = "translateX(0px)";
    LoginForm.style.transform = "translateX(0px)";
    Indicator.style.transform = "translateX(285px)";
}

function login()
{
    SignupForm.style.transform = "translateX(470px)";
    LoginForm.style.transform = "translateX(470px)";
    Indicator.style.transform = "translateX(85px)";
}

function getUID(sellerID)
{
    localStorage.setItem("SellerLALA",sellerID);
}