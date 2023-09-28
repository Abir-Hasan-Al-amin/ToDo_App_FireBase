    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
    // Import Firebase Authentication and Realtime Database
    import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
    import { getDatabase} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
    apiKey: "AIzaSyD73JOiilrOH2K7t4CiPls9BTL2WYGzKo0",
    authDomain: "todoapp-9fc0e.firebaseapp.com",
    projectId: "todoapp-9fc0e",
    storageBucket: "todoapp-9fc0e.appspot.com",
    messagingSenderId: "458538555399",
    appId: "1:458538555399:web:02bdb3af4dbc54349372a2",
    measurementId: "G-SMMHRJL42Q"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth = getAuth(app);
    const database = getDatabase(app);

// Sign in
const loginFrom = document.getElementById('loginFrom');
loginFrom.addEventListener('submit',e=>{
    e.preventDefault();
    const userLogin=document.getElementById('userLogin').value;
    const passLogin=document.getElementById('passLogin').value;
    if (validEmail(userLogin) == false || validPass(passLogin) == false) {
        alert('Invalid Email or Password < 6');
        return;
    }
    if (validField(userLogin) == false || validField(passLogin) == false) {
        alert('Input Null or 0');
        return;
    }
    signInWithEmailAndPassword(auth, userLogin, passLogin)
    .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    alert('Signed in');
    // ...
    })
    .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert('no account or incorrect email/password');
    });
})

function validEmail(email) {
    let check=/^[^@]+@\w+(\.\w+)+\w$/;
    if(check.test(email)==true){
        return true;
    }else{
        return false;
    }
}
function validPass(password) {
    if(password<6){
        return false;
    }else{
        return true;
    }
}
function validField(field) {
    if(field == null){
        return false;
    }
    if(field.length <= 0){
        return false;
    }else{
        return true;
    }
}