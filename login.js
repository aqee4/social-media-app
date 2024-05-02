class LoginForm {
  constructor() {
    this.form = document.getElementById("loginForm");
    this.nameInput = document.getElementById("name");
    this.passwordInput = document.getElementById("password");

    this.form.addEventListener("submit", this.onSubmit.bind(this));
    this.nameInput.addEventListener("input", this.validateName.bind(this));
    this.passwordInput.addEventListener("input", this.validatePassword.bind(this));
  }

  async onSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const name = this.nameInput.value;
    const password = this.passwordInput.value;

    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: name,
          password: password,
          expiresInMins: 30 // optional, defaults to 60
        })
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate');
      }

      const data = await response.json();
      const token = data.token;
      const usercomdata = await this.fetchUserData(); // Fetch user data from API
      
      // Get the logged-in user's username
      const loggedInUsername = name;

      // Find the logged-in user's data
      const loggedInUser = usercomdata.find(user => user.username === loggedInUsername);

      if (loggedInUser) {
        const imageURL = loggedInUser.image; // Image URL of the logged-in user

        // Store user data in local storage
        localStorage.setItem('username', name);
        localStorage.setItem('password', password);
        localStorage.setItem('imageURL', imageURL);
        localStorage.setItem('token', token);
        localStorage.setItem('usercomdata', JSON.stringify(usercomdata));

        // Store logged-in user's firstname and image using setItem
        localStorage.setItem(name, JSON.stringify({
          firstname: loggedInUser.firstname,
          UserLoginimage: imageURL
        }));

        // Log token stored in local storage
        console.log('Token stored:', token);
        console.log('Complete user data:', usercomdata);

        alert('Login successful');
        window.location.href = "./views/main.html";
        // Here you can redirect or perform any other action after successful login

      } else {
        console.error('Logged-in user not found');
        alert('Invalid username or password');
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Invalid username or password');
      // Handle error - e.g., show error message to user
    }
  }

  async fetchUserData() {
    try {
      const response = await fetch('https://dummyjson.com/users');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await response.json();
      console.log(userData);
      const users = userData.users;
      console.log(users, "User Data");
      
      // Storing each user's data in localStorage
      users.forEach(user => {
        localStorage.setItem(user.username, JSON.stringify({
          firstname: user.firstname,
          UserLoginimage: user.image
        }));
      });

   
  
      return users;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }
  

  validateName() {
    const name = this.nameInput.value.trim();
    const isValidName = /^[a-zA-Z0-9]*$/.test(name);

    if (!isValidName) {
      this.nameInput.classList.add("is-invalid");
      this.nameInput.setCustomValidity("Username can only contain alphabets and numbers.");
    } else {
      this.nameInput.classList.remove("is-invalid");
      this.nameInput.setCustomValidity("");
    }
  }

  validatePassword() {
    const password = this.passwordInput.value.trim();
    const isValidPassword = /^[a-zA-Z0-9]*$/.test(password);

    if (!isValidPassword) {
      this.passwordInput.classList.add("is-invalid");
      this.passwordInput.setCustomValidity("Password can only contain alphabets and numbers.");
    } else {
      this.passwordInput.classList.remove("is-invalid");
      this.passwordInput.setCustomValidity("");
    }
  }

  resetData() {
    if (confirm("Are you sure to logout?")) {
      localStorage.clear();
      window.location.href = "../index.html";
    }
  }
}

// Usage
const loginForm = new LoginForm();
