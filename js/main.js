const body = document.body;
const header = document.querySelector("#header");

/**   Setting Menu Toggler **/

const settingMenuBox = document.querySelector(".header .row .navSetting ");
const settingsMenuIcon = document.querySelector("#settingsMenuIcon");

settingsMenuIcon.onclick = function (event) {
  event.stopPropagation();
  settingMenuBox.classList.toggle("active");
};
body.onclick = function () {
  if (settingMenuBox.classList.contains("active")) {
    settingMenuBox.classList.remove("active");
  }
};
/**   End: Setting Menu Toggler **/

/**  Theme Change toggler  **/

const themeChangeBtn = document.querySelector(".themeBtn");
themeChangeBtn.onclick = function (event) {
  event.preventDefault();
  event.stopPropagation();
  this.classList.toggle("active");
  body.classList.toggle("darkTheme");
  let modeTitle =
    this.parentElement.previousElementSibling.querySelector(".title");

  if (localStorage.getItem("theme") === "light") {
    localStorage.setItem("theme", "dark");
    modeTitle.innerHTML = "Light Mode";
  } else if (localStorage.getItem("theme") === "dark") {
    localStorage.setItem("theme", "light");
    modeTitle.innerHTML = "Dark Mode";
  }
};

if (localStorage.getItem("theme") === "light") {
  body.classList.remove("darkTheme");
  themeChangeBtn.classList.remove("active");
} else if (localStorage.getItem("theme") === "dark") {
  body.classList.add("darkTheme");
  themeChangeBtn.classList.add("active");
} else {
  localStorage.setItem("theme", "light");
}

/**  End: Theme Change toggler  **/















// Right sidebar All userfatch data


function fetchAndDisplayUsers() {
    fetch('https://dummyjson.com/users')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json(); // Convert to JSON
        })
        .then(function(data) {
            var usersContainer = document.getElementById('usersContainer'); // Container to display users

            // Clear any existing content
            usersContainer.innerHTML = '';

            // Display each user in the container
            data.users.forEach(function(user) {
                var userElement = document.createElement('div'); // Create a new div for each user
                userElement.className = 'user'; // Add class for styling

                userElement.innerHTML = `
                    <div class="user-details">
                        <img src="${user.image}" alt="${user.firstName} ${user.lastName}" />
                        <div class="user-info">
                            <h5>${user.firstName} ${user.lastName}</h5>
                            <p>Username: ${user.username}</p>
                            <p>Email: ${user.email}</p>
                        </div>
                    </div>
                `;

                // Append the user div to the container
                usersContainer.appendChild(userElement);
            });
        })
        .catch(function(error) {
            console.error('Error fetching users:', error);
        });
}

// Fetch and display users when the page loads
window.onload = fetchAndDisplayUsers; // Use onload to trigger fetching when the page loads






// End of Right sidebar User data








// Users search fatch api


function searchUsers(query) {
    return fetch(`https://dummyjson.com/users/search?q=${query}`)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json(); // Convert to JSON
        })
        .then(function(data) {
            return data; // Return the parsed data
        })
        .catch(function(error) {
            console.error('Error searching users:', error);
            return null; // Return null if there's an error
        });
}

function handleSearch() {
    var searchTerm = document.getElementById('searchInput').value.trim();
    var usersContainer = document.getElementById('usersContainer');

    // Clear previous results
    usersContainer.innerHTML = '';

    if (searchTerm === '') {
        usersContainer.innerHTML = 'Please enter a search term.'; // Basic validation
        return;
    }

    searchUsers(searchTerm)
        .then(function(data) {
            if (data && data.users.length > 0) {
                // Display the found users
                data.users.forEach(function(user) {
                    var userElement = document.createElement('div');
                    userElement.className = 'user'; // Add a class for styling
                    userElement.innerHTML = `
                        <div class="user-details">
                            <img src="${user.image}" alt="${user.firstName} ${user.lastName}" />
                            <div class="user-info">
                                <h2>${user.firstName} ${user.lastName}</h2>
                                <p>Username: ${user.username}</p>
                                <p>Email: ${user.email}</p>
                            </div>
                        </div>
                    `;

                    usersContainer.appendChild(userElement); // Append the user element to the container
                });
            } else {
                usersContainer.innerHTML = 'No users found.'; // Display if no results
            }
        })
        .catch(function(error) {
            console.error('Error handling search:', error);
        });
}

// Add an event listener to the search button
document.getElementById('searchButton').addEventListener('click', handleSearch);


// End of user search api////




function fetchAndDisplayPosts() {
    // Fetch posts data
    fetch('https://dummyjson.com/posts')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            return response.json(); // Convert the response to JSON
        })
        .then(postsData => {
            const postsContainer = document.querySelector('.postPublished'); // Select the container for posts

            // Loop through the posts
            postsData.posts.forEach(post => {
                const postId = post.id; // Get the postId for the current post

                // Fetch user data for the current post
                fetch(`https://dummyjson.com/users/${post.userId}`)
                    .then(userResponse => {
                        if (!userResponse.ok) {
                            throw new Error('Failed to fetch user data');
                        }
                        return userResponse.json(); // Convert the response to JSON
                    })
                    .then(userData => {
                        // Fetch comments for the current post
                        fetch(`https://dummyjson.com/posts/${postId}/comments`)
                            .then(commentsResponse => {
                                if (!commentsResponse.ok) {
                                    throw new Error('Failed to fetch comments');
                                }
                                return commentsResponse.json(); // Convert the response to JSON
                            })
                            .then(commentsData => {
                                // Create post element
                                const postElement = document.createElement('div');
                                postElement.className = 'postPublished';

                                // Construct post HTML
                                postElement.innerHTML = `
                                    <header class="top">
                                        <div class="user">
                                            <img src="${userData.image ? userData.image : './images/profile-pic.png'}" alt="profile-pic" class="avatar" />
                                            <div class="info">
                                                <a href="./#profile" class="name">${userData.username}</a>
                                                <p class="time">${post.title}</p>
                                            </div>
                                        </div>
                                        <div class="actions">
                                            <i class="fas fa-ellipsis-v icon"></i>
                                        </div>
                                    </header>
                                    <div class="content">
                                        <p class="text">${post.body}</p>
                                        <img src="${post.image ? post.image : '../images/feed-image-1.png'}" alt="news" class="img" />
                                    </div>
                                    <div class="comments">
                                        <h3>Comments</h3>
                                        <ul id="comment-list-${postId}">
                                            ${commentsData.comments.map(comment => `
                                                <li id="comment-${comment.id}">
                                                    <span class="comment-text">${comment.body}</span>
                                                    <span class="comment-icons">
                                                        <i class="fas fa-edit edit-icon" onclick="editComment(${comment.id}, '${comment.body}', ${postId})"></i>
                                                        <i class="fas fa-trash delete-icon" onclick="deleteComment(${comment.id}, ${postId})"></i>
                                                    </span>
                                                </li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                       




                                        
                                    <div class="bottom">
                                        <div class="others">
                                            <article class="box">${commentsData.comments.length} comments</article>
                                            <article class="box"><input type="text" id="comment-input-${postId}"class="comment-input" placeholder="Add comment" onkeypress="handleCommentKeyPress(event, ${postId})"></input></article>
                                        </div>
                                    </div>

                                    
                                `;
                                // Append post element to container
                                postsContainer.appendChild(postElement);
                            })
                            .catch(error => {
                                console.error('Error fetching comments:', error);
                            });
                    })
                    .catch(error => {
                        console.error('Error fetching user data:', error);
                    });
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
}

fetchAndDisplayPosts(); // Call the function to fetch and display the posts

function deleteComment(commentId, postId) {
    // Show alert message
    alert(`Deleting comment ${commentId}.`);

    // Fetch the comment data and delete it
    fetch(`https://dummyjson.com/comments/${commentId}`, {
        method: 'DELETE', // Use DELETE method for deleting the comment
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete comment');
        }
        return response.json();
    })
    .then(deletedComment => {
        console.log('Deleted comment:', deletedComment); // Log the deleted comment data
        // You can optionally update the UI to remove the deleted comment element
        const commentElement = document.getElementById(`comment-${commentId}`);
        if (commentElement) {
            commentElement.remove();
        }
    })
    .catch(error => {
        console.error('Error deleting comment:', error);
    });
}

function editComment(commentId, currentText, postId) {
    // Show alert message
    alert(`Editing comment ${commentId}.`);

    const newCommentText = prompt('Enter the new comment:', currentText);

    if (newCommentText === null || newCommentText.trim() === '') {
        return;
    }

    // Fetch the comment data and update it
    fetch(`https://dummyjson.com/comments/${commentId}`, {
        method: 'PUT', // Use PUT method for updating the comment
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            body: newCommentText // Use the new comment text
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to edit comment');
        }
        return response.json();
    })
    .then(updatedComment => {
        console.log('Updated comment:', updatedComment); // Log the updated comment data
        // Update the UI to reflect the changes, you can call a function to display the updated comment
        const commentElement = document.getElementById(`comment-${commentId}`);
        if (commentElement) {
            const commentTextElement = commentElement.querySelector('.comment-text');
            if (commentTextElement) {
                commentTextElement.textContent = updatedComment.body;
            }
        }
    })
    .catch(error => {
        console.error('Error editing comment:', error);
    });
}

// Function to handle key press event on comment input field
function handleCommentKeyPress(event, postId) {
    if (event.key === 'Enter') {
        const commentInput = document.getElementById(`comment-input-${postId}`);
        const commentText = commentInput.value.trim();

        if (commentText === '') {
            alert('Please enter a comment.');
            return;
        }

        addComment(postId, commentText);
    }
}

// Function to add a new comment
function addComment(postId, commentText) {
    fetch('https://dummyjson.com/comments/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            body: commentText,
            postId: postId,
            userId: 5, // You can replace 5 with the actual user ID
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add comment');
        }
        return response.json();
    })
    .then(newComment => {
        console.log('New comment added:', newComment);
        // You can optionally update the UI to display the new comment
        const commentsList = document.querySelector(`#comment-list-${postId}`);
        if (commentsList) {
            const newCommentElement = document.createElement('li');
            newCommentElement.id = `comment-${newComment.id}`;
            newCommentElement.innerHTML = `
                <span class="comment-text">${newComment.body}</span>
                <span class="comment-icons">
                    <i class="fas fa-edit edit-icon" onclick="editComment(${newComment.id}, '${newComment.body}', ${postId})"></i>
                    <i class="fas fa-trash delete-icon" onclick="deleteComment(${newComment.id}, ${postId})"></i>
                </span>
            `;
            commentsList.appendChild(newCommentElement);
            alert('New comment added successfully');
        }
    })
    .catch(error => {
        console.error('Error adding comment:', error);
    });
}



function lsClear(){
    alert('Are you sure to logout')
    localStorage.clear();
    window.location.href = "../index.html";}
window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      fetchAndDisplayPosts(); // Call the function
    }})

