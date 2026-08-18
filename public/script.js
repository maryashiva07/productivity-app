const API_URL = "/api/todos";

// AUTHENTICATION

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}


// Common headers for authenticated requests

const authHeaders = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
};

// DOM ELEMENTS

const todoForm =
    document.getElementById("todoForm");

const todoList =
    document.getElementById("todoList");

const emptyMessage =
    document.getElementById("emptyMessage");

const totalCount =
    document.getElementById("totalCount");

const pendingCount =
    document.getElementById("pendingCount");

const completedCount =
    document.getElementById("completedCount");

// VARIABLES

let allTodos = [];


// LOAD TODOS

document.addEventListener(
    "DOMContentLoaded",
    getTodos
);


async function getTodos() {

    try {

        const response =
            await fetch(API_URL, {

                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }

            });


        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href = "login.html";

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Failed to fetch todos"
            );

        }


        allTodos =
            await response.json();


        displayTodos(allTodos);

        updateStats(allTodos);

    }
    catch (error) {

        console.error(error);

        todoList.innerHTML = `

            <div class="empty-message">

                <div class="empty-icon">
                    !
                </div>

                <h3>
                    Unable to load todos
                </h3>

                <p>
                    Make sure your backend server is running.
                </p>

            </div>

        `;

    }

}


// CREATE TODO

todoForm.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();


        const title =
            document.getElementById(
                "title"
            ).value.trim();


        const description =
            document.getElementById(
                "description"
            ).value.trim();


        const priority =
            document.getElementById(
                "priority"
            ).value;


        const status =
            document.getElementById(
                "status"
            ).value;


        try {

            const response =
                await fetch(API_URL, {

                    method: "POST",

                    // IMPORTANT:
                    // Send JWT token

                    headers: authHeaders,

                    body: JSON.stringify({

                        title,

                        description,

                        priority,

                        status

                    })

                });


            const data =
                await response.json();


            if (response.status === 401) {

                localStorage.removeItem("token");

                window.location.href =
                    "login.html";

                return;

            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to create Todo"
                );

            }


            alert(
                "Todo created successfully!"
            );


            todoForm.reset();


            // Reload todos

            getTodos();

        }
        catch (error) {

            console.error(error);

            alert(error.message);

        }

    }
);

// DISPLAY TODOS

function displayTodos(todos) {

    todoList.innerHTML = "";


    if (todos.length === 0) {

        emptyMessage.style.display =
            "block";

        return;

    }


    emptyMessage.style.display =
        "none";


    todos.forEach(todo => {

        const card =
            document.createElement("div");


        card.className =
            "todo-card";


        const priorityClass =
            getPriorityClass(
                todo.priority
            );


        const statusClass =
            getStatusClass(
                todo.status
            );


        card.innerHTML = `

            <div>

                <div class="todo-title">
                    ${escapeHTML(todo.title)}
                </div>

                <div class="todo-description">
                    ${escapeHTML(todo.description)}
                </div>

                <div class="todo-meta">

                    <span class="badge ${priorityClass}">
                        ${escapeHTML(todo.priority)}
                    </span>

                    <span class="badge ${statusClass}">
                        ${escapeHTML(todo.status)}
                    </span>

                </div>

            </div>


            <div class="todo-actions">

                <button
                    class="todo-btn edit-btn"
                    onclick="openEditModal(${todo.id})"
                >
                    Edit
                </button>


                <button
                    class="todo-btn delete-btn"
                    onclick="deleteTodo(${todo.id})"
                >
                    Delete
                </button>

            </div>

        `;


        todoList.appendChild(card);

    });

}


// DELETE TODO

async function deleteTodo(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this todo?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method: "DELETE",

                    // IMPORTANT:
                    // Send JWT token

                    headers: {
                        "Authorization": `Bearer ${token}`
                    }

                }
            );


        const data =
            await response.json();


        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href =
                "login.html";

            return;

        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to delete Todo"
            );

        }


        getTodos();

    }
    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// OPEN EDIT MODAL

async function openEditModal(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method: "GET",

                    headers: {
                        "Authorization": `Bearer ${token}`
                    }

                }
            );


        const todo =
            await response.json();


        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href =
                "login.html";

            return;

        }


        if (!response.ok) {

            throw new Error(
                todo.message ||
                "Todo not found"
            );

        }


        document.getElementById(
            "editId"
        ).value = todo.id;


        document.getElementById(
            "editTitle"
        ).value = todo.title;


        document.getElementById(
            "editDescription"
        ).value = todo.description;


        document.getElementById(
            "editPriority"
        ).value = todo.priority;


        document.getElementById(
            "editStatus"
        ).value = todo.status;


        document.getElementById(
            "editModal"
        ).classList.add("show");

    }
    catch (error) {

        console.error(error);

        alert(error.message);

    }

}


// UPDATE TODO

document.getElementById(
    "editForm"
).addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();


        const id =
            document.getElementById(
                "editId"
            ).value;


        const title =
            document.getElementById(
                "editTitle"
            ).value.trim();


        const description =
            document.getElementById(
                "editDescription"
            ).value.trim();


        const priority =
            document.getElementById(
                "editPriority"
            ).value;


        const status =
            document.getElementById(
                "editStatus"
            ).value;


        try {

            const response =
                await fetch(
                    `${API_URL}/${id}`,
                    {

                        method: "PUT",

                        // IMPORTANT:
                        // Send JWT token

                        headers: authHeaders,

                        body:
                            JSON.stringify({

                                title,

                                description,

                                priority,

                                status

                            })

                    }
                );


            const data =
                await response.json();


            if (response.status === 401) {

                localStorage.removeItem("token");

                window.location.href =
                    "login.html";

                return;

            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update Todo"
                );

            }


            closeEditModal();


            getTodos();

        }
        catch (error) {

            console.error(error);

            alert(error.message);

        }

    }
);


// CLOSE MODAL

function closeEditModal() {

    document.getElementById(
        "editModal"
    ).classList.remove("show");

}


// FILTER

async function applyFilters() {

    const status =
        document.getElementById(
            "filterStatus"
        ).value;


    const priority =
        document.getElementById(
            "filterPriority"
        ).value;


    try {

        let url =
            API_URL;


        const params =
            new URLSearchParams();


        if (status) {

            params.append(
                "status",
                status
            );

        }


        if (priority) {

            params.append(
                "priority",
                priority
            );

        }


        if (params.toString()) {

            url +=
                "?" +
                params.toString();

        }


        const response =
            await fetch(url, {

                method: "GET",

                // IMPORTANT:
                // Send JWT token

                headers: {
                    "Authorization": `Bearer ${token}`
                }

            });


        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href =
                "login.html";

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Failed to filter todos"
            );

        }


        const todos =
            await response.json();


        displayTodos(todos);

    }
    catch (error) {

        console.error(error);

    }

}


// SEARCH

function searchTodos() {

    const search =
        document.getElementById(
            "searchInput"
        ).value
            .toLowerCase()
            .trim();


    const filtered =
        allTodos.filter(todo =>

            todo.title
                .toLowerCase()
                .includes(search)

            ||

            todo.description
                .toLowerCase()
                .includes(search)

        );


    displayTodos(filtered);

}


// CLEAR FILTERS

function clearFilters() {

    document.getElementById(
        "filterStatus"
    ).value = "";


    document.getElementById(
        "filterPriority"
    ).value = "";


    document.getElementById(
        "searchInput"
    ).value = "";


    displayTodos(allTodos);

}


// STATISTICS

function updateStats(todos) {

    totalCount.innerText =
        todos.length;


    pendingCount.innerText =
        todos.filter(
            todo =>
                todo.status === "Pending"
        ).length;


    completedCount.innerText =
        todos.filter(
            todo =>
                todo.status === "Completed"
        ).length;

}


// PRIORITY CLASS

function getPriorityClass(priority) {

    if (priority === "High") {

        return "priority-high";

    }


    if (priority === "Medium") {

        return "priority-medium";

    }


    return "priority-low";

}

// STATUS CLASS

function getStatusClass(status) {

    if (status === "Completed") {

        return "status-completed";

    }


    if (status === "In Progress") {

        return "status-progress";

    }


    return "status-pending";

}

// SECURITY

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value ?? "";


    return div.innerHTML;

}

// DARK / LIGHT MODE

const themeToggle =
    document.getElementById(
        "themeToggle"
    );


const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "dark") {

    document.body.classList.add(
        "dark-mode"
    );

    themeToggle.textContent =
        "☀️";

}


themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );


        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            themeToggle.textContent =
                "☀️";


            localStorage.setItem(
                "theme",
                "dark"
            );

        }
        else {

            themeToggle.textContent =
                "🌙";


            localStorage.setItem(
                "theme",
                "light"
            );

        }

    }
);


// LOGOUT

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("token");

    window.location.href = "login.html";

});
