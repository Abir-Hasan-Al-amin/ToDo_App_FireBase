import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
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
                    <input type="text" value="${task.title}" readonly>
                </section>
                <section class="delAndedit">
                    <section class="editList">
                    <i class="fa-regular fa-pen-to-square edit-icon" data-task-id="${taskId}"></i>
                    <i class="fa-regular fa-floppy-disk save" data-task-id="${taskId}"></i>
                    </section>
                    <section class="delList">
                    <i class="fa-solid fa-trash-can" id="delete-${taskId}"></i>
                    </section>
                </section>
            </section>
            `;
            addList.innerHTML += taskHtml;
        }
    const editIcons = document.querySelectorAll('.edit-icon');
    const saveIcons = document.querySelectorAll('.fa-regular.fa-floppy-disk');
    const inputFields = document.querySelectorAll('.info input');

    editIcons.forEach((editIcon, index) => {
        editIcon.addEventListener('click', () => {
            editIcon.classList.toggle('save');
            saveIcons[index].classList.toggle('save');
            inputFields[index].removeAttribute('readonly');
            inputFields[index].style.border = '2px solid #393E46';
            inputFields[index].focus();
            inputFields[index].selectionStart = inputFields[index].value.length;
            inputFields[index].selectionEnd = inputFields[index].value.length;
            document.querySelectorAll('.editList')[index].style.backgroundColor = '#4AA96C';
        });
    });

    saveIcons.forEach((saveIcon, index) => {
        saveIcon.addEventListener('click', () => {
            editIcons[index].classList.toggle('save');
            saveIcon.classList.toggle('save');
    
            inputFields[index].setAttribute('readonly', 'readonly');
            inputFields[index].style.border = 'none';
            document.querySelectorAll('.editList')[index].style.backgroundColor = '#00ADB5';
    
            const updatedValue = inputFields[index].value;
            const taskId = saveIcon.getAttribute('data-task-id');
            const user = auth.currentUser;
            
            if (user) {
                const userUid = user.uid;
                if (updatedValue.trim() !== '') {
                    updateTask(userUid, taskId, updatedValue);
                } else {
                    inputFields[index].value = tasks[taskId].title;
                    console.log("Updated value is empty, not updating in Firebase.");
                }
            } else {
                console.error("User not authenticated");
            }
        });
    });
    
    
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

let tasks = {};
onAuthStateChanged(auth, (user) => {
    if (user) {
        const userUid = user.uid;
        const userTasksRef = ref(database, `users/${userUid}/tasks`);
        onValue(userTasksRef, (snapshot) => {
            tasks = snapshot.val() || {}; 
            renderTasks(tasks);
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
addList.addEventListener('click', function (event) {
    if (event.target.classList.contains('fa-trash-can')) {
        const taskId = event.target.id.replace('delete-', '');
        deleteTask(taskId, tasks);
    }
});

function deleteTask(taskId, tasks) {
    const user = auth.currentUser;
    if (user) {
        const userUid = user.uid;
        const taskRef = ref(database, `users/${userUid}/tasks/${taskId}`);
        
        set(taskRef, null)
            .then(() => {
                console.log("Task deleted successfully.");
                delete tasks[taskId];
                renderTasks(tasks);
            })
            .catch((error) => {
                console.error("Error deleting task: ", error);
            });
    } else {
        console.error("User not authenticated");
    }
}
function updateTask(userUid, taskId, updatedTitle) {
    const taskRef = ref(database, `users/${userUid}/tasks/${taskId}`);
    
    set(taskRef, {
        title: updatedTitle
    })
    .then(() => {
        console.log("Task updated successfully in Firebase");
    })
    .catch((error) => {
        console.error("Error updating task in Firebase: ", error);
    });
}
