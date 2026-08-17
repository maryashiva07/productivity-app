const API_URL = "/api";


// ================================
// LOGIN
// ================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;


        try {

            const response = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(data.message || "Login failed");

                return;
            }


            // Store JWT
            localStorage.setItem(
                "token",
                data.token
            );


            // Store user information
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            // Go to dashboard
            window.location.href = "index.html";


        } catch (error) {

            console.error(error);

            alert("Server error. Please try again.");

        }

    });

}



// ================================
// SIGNUP
// ================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async (e) => {

        e.preventDefault();


        const name =
            document.getElementById("name").value;

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;


        try {

            const response = await fetch(
                `${API_URL}/auth/signup`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Signup failed"
                );

                return;
            }


            alert(
                "Account created successfully!"
            );


            window.location.href =
                "login.html";


        } catch (error) {

            console.error(error);

            alert(
                "Server error. Please try again."
            );

        }

    });

}