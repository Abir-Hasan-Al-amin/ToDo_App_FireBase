import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const firebaseConfig = {
apiKey: "AIzaSyD73JOiilrOH2K7t4CiPls9BTL2WYGzKo0",
authDomain: "todoapp-9fc0e.firebaseapp.com",
projectId: "todoapp-9fc0e",
storageBucket: "todoapp-9fc0e.appspot.com",
messagingSenderId: "458538555399",
appId: "1:458538555399:web:02bdb3af4dbc54349372a2",
measurementId: "G-SMMHRJL42Q"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const resetForm = document.getElementById('resetForm'); 
resetForm.addEventListener('submit', (e) => { 
    e.preventDefault();
    const email = document.getElementById('emailReset').value;
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert('email Sent');
            location.href='index.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
});

