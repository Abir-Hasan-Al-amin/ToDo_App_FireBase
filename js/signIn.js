    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
    import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
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
    const auth = getAuth(app);

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
    .then(() => {
    // Signed in 
    document.getElementById('userLogin').value="";
    document.getElementById('passLogin').value="";
    window.location.href = 'todo.html';
    // ...
    })
    .catch(() => {
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