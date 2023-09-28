    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
    // Import Firebase Authentication and Realtime Database
    import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
    import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

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

    // set up register
    const form = document.getElementById(('signFrom'));
    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById("nameSign").value;
        const email = document.getElementById("userSign").value;
        const password = document.getElementById("passSign").value;
    
        if (validEmail(email) == false || validPass(password) == false) {
            alert('Invalid Email or Password < 6');
            return;
        }
        if (validField(name) == false || validField(email) == false || validField(password) == false) {
            alert('Input Null or 0');
            return;
        }
    
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                alert('User created');
                writeUserData(user.uid, name, email, password);
                document.getElementById("nameSign").value = "";
                document.getElementById("userSign").value = "";
                document.getElementById("passSign").value = "";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
    
                if (errorCode === 'auth/email-already-in-use') {
                    alert('Email address is already in use by another account. Please use a different email address.');
                } else {
                    alert('Error: ' + errorMessage);
                }
            });
    });
    function writeUserData(userId, name, email, password) {
        set(ref(database, 'users/' + userId), {
            username: name,
            email: email,
            password: password
        });
    }

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