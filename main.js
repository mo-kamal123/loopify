const Base_URL = "https://tarmeezacademy.com/api/v1";
let user = JSON.parse(localStorage.getItem("user"))
let body = document.getElementsByClassName("post")[0]
let loggedIn = false  
const form = document.getElementById("form");
const form1 = document.getElementById("form1");
const form3 = document.getElementById("form3");
// Add an event listener for the submit event
form.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevents the form from refreshing the page
  });
  form1.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevents the form from refreshing the page
  });
form3.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevents the form from refreshing the page
  });

  // login process 
const login = () => {
  const user = document.getElementById("username").value
  const password = document.getElementById("password").value
  let params = {
    "username" : user ,
    "password" : password
    
  }
  // console.log(user);
  // console.log(password);
  const url = `${Base_URL}/login`
  axios.post(url,params)
    .then((Response)=>{
        // console.log(Response)
        localStorage.setItem("token", Response.data.token)
        localStorage.setItem("user",JSON.stringify(Response.data.user))
        localStorage.setItem("loggenIn", true)
        localStorage.setItem("profile", Response.data.user.profile_image)
        showlogBtn()
        location.reload()
}).catch((err) => {
  document.getElementById("logError").innerHTML = err.response.data.message
})}
//  login()

const register = () => {
  const url = `${Base_URL}/register`
  const user = document.getElementById("regUsername").value
  const email = document.getElementById("regEmail").value
  const password = document.getElementById("regPassword").value
  const image = document.getElementById("image").files[0]
  const name = document.getElementById("name").value
  const headers = {
    "Content-Type": "multipart/form-data"
  }
  const formdata = new FormData()
  formdata.append("username",user)
  formdata.append("email",email)
  formdata.append("password",password)
  formdata.append("name",name)
  formdata.append("image",image)
  axios.post(url, formdata, {headers: headers}).then((res) => {
    let token = res.data.token
    let user = res.data.user
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("loggenIn", true)
    localStorage.setItem("profile", res.data.user.profile_image)
    // console.log(res);
    location.reload()
  }).catch((err) => {
    // console.log(err);
    document.getElementById("rigError").innerHTML = err.response.data.message
  });
}

const logout = () => {
  localStorage.clear()
  location.reload()
}

let profilePic = () => localStorage.getItem("profile") ?  profile.src = localStorage.getItem("profile") : null
profilePic()

const closeModal = (id) => {
  const modal = document.getElementById(id);
  modal.close();

  const dropdown = document.getElementById("yourDropdownId");
  if (dropdown) {
    dropdown.classList.add("hidden"); // Hide dropdown if it's open
  }
}

const showlogBtn = () => {
  const userPic = document.getElementById("userPic")
  const dropdown = document.getElementById("yourDropdownId");
  const createpost = document.getElementById("createPost")
  // console.log(createpost);
  if(localStorage.getItem("loggenIn")){
      userPic.classList.remove("none")
      dropdown.classList.add("none")
      createpost.classList.remove("none")
      profilePic()
    } else {
        userPic.classList.add("none")
        dropdown.classList.remove("none")
        createpost.classList.add("none")
      }
}
showlogBtn()


let currentPage = 1;
let isFetching = false;
let hasMorePosts = true; // Flag to check if more posts are available
body.innerHTML = "";

const getPosts = async (page) => {
  if (!hasMorePosts) return; // Stop fetching if no more posts
  isFetching = true; // Prevent multiple fetches

  try {
    const res = await axios.get(`${Base_URL}/posts?limit=10&page=${page}`);
    const posts = res.data.data;

    if (posts.length === 0) {
      hasMorePosts = false; // No more posts available
      return;
    }

    currentPage = page; // Update current page
    let content = "";

    posts.forEach((post) => {
      content += `
        <div class="card lg:card-side bg-base-100 shadow-xl m-auto my-10 w-[90%] md:w-[80] border-[1px] border-gray-500 overflow-hidden">
          <div class="px-2 md:px-7 flex justify-between items-center gap-5 my-5 md:hidden">
            <div class="flex gap-2">
              <div class="avatar">
                <div class="w-8 rounded-full">
                <img src="${post.author.profile_image}" />
                </div>
              </div>
              <h2 class="card-title text-sm">${post.author.username}</h2>
            </div>
          </div>
          <figure class="lg:w-[70%]">
            <img src="${post.image}" alt="Album" />
          </figure>
          <div class="details card-body py-2 px-2 md:px-[32px] flex flex-col justify-between">
            <div class="hidden md:flex gap-3 justify-between items-center">
            <div class="flex mt-4 gap-4 items-center justify-center">
                <div class="avatar">
                  <div class="w-8 rounded-full">
                    <img src="${post.author.profile_image}" />
                  </div>
                </div>
                <h2 class="card-title text-sm">${post.author.username}</h2>
              </div>
              
            </div>
            <div class="comments h-0 overflow-y-auto" id="${post.id}"></div>
            <div class="flex flex-col gap-2">
              <div class="mb-2">
                <p class="font-light">${post.title}</p>
                <p class="text-lg">${post.body}</p>
              </div>
              <div class="card-actions flex justify-start items-center">
                <button class="btn btn-sm btn-outline btn-error">like</button>
                <button onclick="comment(${post.id})" id="comicon" class="btn btn-sm"><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="80" height="80" viewBox="0,0,256,256">
              <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M25,4.0625c-12.58594,0 -22.9375,8.86328 -22.9375,19.9375c0,6.42578 3.5625,12.09375 8.9375,15.71875c-0.00781,0.21484 0,0.54688 -0.28125,1.59375c-0.34766,1.29297 -1.03516,3.125 -2.46875,5.15625l-1.03125,1.4375l1.78125,0.03125c6.17578,0.02734 9.75391,-4.03125 10.3125,-4.6875c1.82422,0.40625 3.72266,0.6875 5.6875,0.6875c12.58203,0 22.9375,-8.86328 22.9375,-19.9375c0,-11.07422 -10.35547,-19.9375 -22.9375,-19.9375zM25,5.9375c11.71484,0 21.0625,8.15234 21.0625,18.0625c0,9.91016 -9.34766,18.0625 -21.0625,18.0625c-2.00391,0 -3.94922,-0.24219 -5.78125,-0.6875l-0.5625,-0.125l-0.375,0.46875c0,0 -2.89062,3.25781 -7.5,4.03125c0.83203,-1.49219 1.46484,-2.87891 1.75,-3.9375c0.39844,-1.48047 0.40625,-2.5 0.40625,-2.5v-0.5l-0.4375,-0.28125c-5.22656,-3.3125 -8.5625,-8.58984 -8.5625,-14.53125c0,-9.91016 9.34375,-18.0625 21.0625,-18.0625z"></path></g></g>
              </svg> ${post.comments_count}</button>
                <p>${post.created_at}</p>
              </div>
              <div class="flex gap-2">
                <input id="comment-${post.id}" class="w-full px-2 py-1 rounded-lg border-[2px] border-gray-400 outline-none hover:border-gray-200 focus:border-gray-200 transition-all" type="text" placeholder="Add Comment" />
                <button class='btn  bg-teal-800 flex items-center justify-center' onclick="addComment(${post.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                </svg></button>
              </div>
            </div>
          </div>
        </div>`;
    });

    body.innerHTML += content; // Append new posts to the body
  } catch (err) {
    console.error("Error fetching posts:", err);
  } finally {
    isFetching = false; // Allow future fetches
  }
};

window.addEventListener("scroll", () => {
  const endOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100; // Added buffer
  if (endOfPage && !isFetching && hasMorePosts) {
    getPosts(currentPage + 1);
  }
});

// Initial fetch
getPosts(currentPage);

const loading = (isLoading) => {
  let loader = document.getElementById("postloading");
  let btn = document.getElementById("createBtn");

  if (isLoading) {
    btn.disabled = true; // Disable button
    loader.innerHTML = `
      <div class="flex items-center w-full justify-center">
        <span>Loading</span>
        <span class="loading loading-infinity loading-lg"></span>
      </div>`;
  } else {
    btn.disabled = false; // Enable button
    loader.innerHTML = ""; // Clear loader
  }
};

const createPost = () => {
  let body = document.getElementById("postBody").value;
  let title = document.getElementById("postTitle").value;
  let img = document.getElementById("postImg").files[0];
  const formData = new FormData();
  formData.append("body", body);
  formData.append("title", title);
  formData.append("image", img);
  
  let token = localStorage.getItem("token");
  const url = `${Base_URL}/posts`;

  // Show loader before the request starts
  loading(true);

  axios.post(url, formData, {
    headers: {
      "authorization": `Bearer ${token}`
    }
  })
  .then((res) => {
    // console.log(res);
    showAlert("Post created successfully!", "success");
    location.reload();
  })
  .catch((err) => {
    showAlert(`${err.response?.data?.message || "An error occurred"}`, "error");
    // console.error(err);
  })
  .finally(() => {
    // Hide loader after the request is complete
    loading(false);
  });
};

const comment =(id) => {
  // alert("hii" + id)
  axios.get(`${Base_URL}/posts/${id}`).then((res) => {
    console.log(res);
    let post = res.data.data
    let postComments = ""
    commentConatiner = document.getElementById(post.id)
    let comments = res.data.data.comments
    // commentConatiner.style.height = '100px'
    if (comments.length > 0 || commentConatiner != "") {
      comments.forEach((comment) => {
        postComments += `
          <div class="flex gap-2 my-2 p-2">
            <div class="avatar">
              <div class="w-6 h-6 md:w-10 md:h-10 rounded-full">
                <img src="${comment.author.profile_image}" />
              </div>
            </div>
            <div class="bg-gray-400/50 rounded-lg p-1 md:px-3 md:py-2 min-w-40 text-black">
              <h2 class="card-title text-sm">${comment.author.username}</h2>
              <p class="ml-2">${comment.body}</p>
            </div>
          </div>
        `
        commentConatiner.classList.add("md:h-56")
        commentConatiner.classList.add("h-20")  
        commentConatiner.innerHTML = postComments
      })
    } else {
      commentConatiner.innerHTML = "<p class='text-red-400'>There Is not comments to show now</p>"
      
    }
    removeEventListener("click",comment)
    console.log(comments);
    console.log(post);
  }).catch((err) => {
    console.log(err);
  });
}


const addComment = (id) => {
  const body = document.getElementById(`comment-${id}`).value
  let token = localStorage.getItem("token")
  const params = {
      "body": body
  }

  const url = `${Base_URL}/posts/${id}/comments`
  console.log(token)
  console.log(body)
  axios.post(url, params, {
    headers :  {
      "authorization": `Bearer ${token}`
    }
  }).then((res) => {
    // console.log(res);
    location.reload()
  }).catch((err) => {
    console.log(err);
  });
}

const showAlert = (message , status) => {
  let alertContainer = document.getElementById("alert")
  let alert = `
  <div role="alert" class="alert alert-${status}">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-6 w-6 shrink-0 stroke-current"
    fill="none"
    viewBox="0 0 24 24">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>${message}</span>
  </div>
`
alertContainer.innerHTML = alert
setTimeout(() => {
  document.getElementById("alert").classList.add("disapear")
}, 3000)
setTimeout(() => {
  alertContainer.innerHTML= ""
  document.getElementById("alert").classList.remove("disapear")

}, 4000)
}

if(user) {
  showAlert(`Hi ${user.name}, Hope you Ok 🤨 `, "success")
}
