import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
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
    const auth = getAuth(app);
    const database = getDatabase(app);

    //log out
    const out = document.getElementById('out');
    out.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                window.location.href = 'index.html';
            })
            .catch((error) => {
                console.error("Error signing out: ", error);
            });
    });

    // code 
    function addTaskToDatabase(userUid, title) {
        const userTasksRef = ref(database, `users/${userUid}/tasks`);
        const newTaskRef = push(userTasksRef);
    
        const taskData = {
            title: title,
        };
    
        set(newTaskRef, taskData)
            .then(() => {
                console.log("Task added successfully to Firebase Realtime Database");
            })
            .catch((error) => {
                console.error("Error adding task to Firebase Realtime Database: ", error);
            });
    }
    const addList = document.querySelector('.addList');
    function renderTasks(tasks) {
        addList.innerHTML = '';
    
        for (const taskId in tasks) {
            const task = tasks[taskId];
            const taskHtml = `
                <section class="list">
                    <section class="info">
                        <section class="checkBox">
                        </section>
                        <p>${task.title}</p>
                    </section>
                    <section class="delAndedit">
                        <section class="editList">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </section>
                        <section class="delList">
                            <i class="fa-solid fa-trash-can"></i>
                        </section>
                    </section>
                </section>
            `;
            addList.innerHTML += taskHtml;
        }
    }

const addButton = document.querySelector('.addTodo button');
addButton.addEventListener('click', function (event) {
    event.preventDefault();
    const addTaskInput = document.getElementById('addTask');
    const title = addTaskInput.value;
    if (title.trim() !== '') {
        const user = auth.currentUser;
        if (user) {
            const userUid = user.uid;
            addTaskToDatabase(userUid, title);
            addTaskInput.value = '';
        } else {
            console.error("User not authenticated");
        }
    }
});
onAuthStateChanged(auth, (user) => {
    if (user) {
        const userUid = user.uid;
        const userTasksRef = ref(database, `users/${userUid}/tasks`);
        onValue(userTasksRef, (snapshot) => {
            const tasks = snapshot.val();
            if (tasks) {
                renderTasks(tasks);
            }
        });
    } else {
        console.log("User is not signed in.");
    }
});

const deleteAllButton = document.querySelector('.delButton button');
deleteAllButton.addEventListener('click', function () {
    const user = auth.currentUser;
    if (user) {
        const userUid = user.uid;
        const userTasksRef = ref(database, `users/${userUid}/tasks`);
        set(userTasksRef, null)
            .then(() => {
                console.log("All tasks deleted successfully.");
                addList.innerHTML = '';
            })
            .catch((error) => {
                console.error("Error deleting tasks: ", error);
            });
    } else {
        console.error("User not authenticated");
    }
});