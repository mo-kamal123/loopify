const Base_URL = "https://tarmeezacademy.com/api/v1";
let user = JSON.parse(localStorage.getItem("user"))
const changeUi = () => {
    axios.get(`${Base_URL}/users/${user.id}`).then((res) => {
        console.log(res);
        let postCount = res.data.data.posts_count
        let commentsCount = res.data.data.comments_count
        document.getElementById("totalPosts").innerHTML = postCount
        document.getElementById("totalCom").innerHTML = commentsCount
    }).catch((err) => {
        console.log(err);
    });
    console.log(user);
    let content = `
    <div class="flex justify-between w-[80%]">
    <div class="stats shadow">
        <div class="stat flex flex-col items-center justify-center">
            <div class="stat-title">Total Posts</div>
            <div id="totalPosts" class="stat-value">0</div>
        </div>
    </div>
    <div class="avatar flex flex-col items-center">
        <div class="ring-primary ring-offset-base-100 w-36 rounded-full ring ring-offset-2">
          <img src="${user.profile_image}" />
        </div>
            <h1 class="text-2xl font-semibold mt-5">${user.username}</h1>
            <h1 class="text-xl font-light">${user.email}</h1>
    </div>
    <div class="stats shadow">
        <div class="stat flex flex-col items-center justify-center">
            <div class="stat-title">Total Comments</div>
            <div id="totalCom" class="stat-value">0</div>
        </div>
    </div>
</div>
    `
    document.getElementById("userInfo").innerHTML = content
}
if(user) {
    changeUi()
}else {
    location.replace("index.html")
}

const getUserPosts = (id) => {

    axios.get(`${Base_URL}/users/${id}/posts`).then((res) => {
        const posts = res.data.data
        let content = `<div class=" text-red-500 text-2xl font-semibold text-center mt-20">You Don't Have Posts Yet</div>`
        if(posts) {
            content = ""
            posts.forEach((post) => {
                content += `
                  <div class="card lg:card-side bg-base-100 shadow-xl m-auto my-10 w-[90%] md:w-[80] border-[1px] border-gray-500 overflow-hidden">

                    <figure class="lg:w-[70%]">
                      <img src="${post.image}" alt="Album" />
                    </figure>
                    <div class="details card-body py-2 px-2 md:px-[32px] flex flex-col justify-between">
                      <div class="flex gap-3 justify-between items-center">
                        <div class="flex gap-2">
                          <div class="avatar">
                            <div class="w-8 rounded-full">
                              <img src="${post.author.profile_image}" />
                            </div>
                          </div>
                          <h2 class="card-title text-sm">${post.author.username}</h2>
                        </div>
                        <div class="dropdown dropdown-end">
                          <div tabindex="0" role="button" class="btn btn-sm m-3">...</div>
                          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li>
                            <a><!-- Open the modal using ID.showModal() method -->
                          <button class="edit btn" onclick="openEdit('my_modal_${post.id}')">Edit</button>
                          <dialog id="my_modal_${post.id}" class="modal">
                          <div class="modal-box">
                          <h3 class="text-lg font-bold">Edit Your Post!</h3>
                          <p class="py-4">your Post body : ${ post.body}</p>
                          <label>New Body : </label>
                          <input id="newBodya${post.id}" type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs mx-1" />
                          <button type="submit" class="btn btn-active btn-primary" onclick="editPost(${post.id},'newBodya${post.id}')">Edit</button>
                          </div>
                          <form method="dialog" class="modal-backdrop">
                              <button>close</button>
                          </form>
                          </dialog></a>
                            </li>
                            <li>
                            <a><!-- Open the modal using ID.showModal() method -->
                            <button class="delete btn" onclick="openDelete('delmy_modal_${post.id}')">Delete</button>
                            <dialog id="delmy_modal_${post.id}" class="modal">
                            <div class="modal-box">
                                <h3 class="text-lg font-bold">Delete!</h3>
                                <p class="py-4">Are You Sure You Need To Delete This Post</p>
                                <button class="btn btn-error btn-sm" onclick="deletePost(${post.id})">delete</button>
                                <button class="btn btn-active btn-neutral btn-sm" onclick="closeModal('my_modal_2')">cancel</button>
                            </div>
                            <form method="dialog" class="modal-backdrop">
                                <button>close</button>
                            </form>
                            </dialog></a>
                            </li>
                          </ul>
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
                          <button onclick="usercomment(${post.id})" id="comicon" class="btn btn-sm"><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="80" height="80" viewBox="0,0,256,256">
                        <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M25,4.0625c-12.58594,0 -22.9375,8.86328 -22.9375,19.9375c0,6.42578 3.5625,12.09375 8.9375,15.71875c-0.00781,0.21484 0,0.54688 -0.28125,1.59375c-0.34766,1.29297 -1.03516,3.125 -2.46875,5.15625l-1.03125,1.4375l1.78125,0.03125c6.17578,0.02734 9.75391,-4.03125 10.3125,-4.6875c1.82422,0.40625 3.72266,0.6875 5.6875,0.6875c12.58203,0 22.9375,-8.86328 22.9375,-19.9375c0,-11.07422 -10.35547,-19.9375 -22.9375,-19.9375zM25,5.9375c11.71484,0 21.0625,8.15234 21.0625,18.0625c0,9.91016 -9.34766,18.0625 -21.0625,18.0625c-2.00391,0 -3.94922,-0.24219 -5.78125,-0.6875l-0.5625,-0.125l-0.375,0.46875c0,0 -2.89062,3.25781 -7.5,4.03125c0.83203,-1.49219 1.46484,-2.87891 1.75,-3.9375c0.39844,-1.48047 0.40625,-2.5 0.40625,-2.5v-0.5l-0.4375,-0.28125c-5.22656,-3.3125 -8.5625,-8.58984 -8.5625,-14.53125c0,-9.91016 9.34375,-18.0625 21.0625,-18.0625z"></path></g></g>
                        </svg> ${post.comments_count}</button>
                          <p>${post.created_at}</p>
                        </div>
                        <div class="flex gap-2">
                          <input id="comment-${post.id}" class="w-full px-2 py-1 rounded-lg border-[2px] border-gray-400 outline-none hover:border-gray-200 focus:border-gray-200 transition-all" type="text" placeholder="Add Comment" />
                          <button class='btn  bg-teal-800 flex items-center justify-center' onclick="useraddComment(${post.id})">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                          </svg></button>
                        </div>
                      </div>
                    </div>
                  </div>`;
                  console.log(post.id);
                });
            }
            document.getElementById("userPosts").innerHTML = content 
        console.log(posts);
    }).catch((err) => {
        console.log(err);
    });
}
getUserPosts(user.id)

const openEdit = (id) => document.getElementById(id) ? document.getElementById(id).showModal() : console.log("not found")
const openDelete = (id) => document.getElementById(id) ? document.getElementById(id).showModal() : console.log("not found")


const usercomment =(id) => {
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


const useraddComment = (id) => {
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
      console.log(res);
      location.reload()
    }).catch((err) => {
      console.log(err);
    });
}

const logout = () => {
    localStorage.clear()
    location.replace("index.html")
}

const editPost = (id, body) => {
  const url =`${Base_URL}/posts/${id}`
  const token = localStorage.getItem("token")
  let newBody = document.getElementById(body).value
  const params = {
    "body" : newBody
  }
  console.log(body)
  console.log(params);
    axios.put(url,params,{
      headers : {
        "authorization": `Bearer ${token}` 
      }
    }).then((res) => {
        console.log(res);
        location.reload()
    }).catch((err) => {
        console.log(err);
    });

}

const deletePost = (id) => {
  const token = localStorage.getItem("token")
  let url = `${Base_URL}/posts/${id}`
  console.log(id);
  axios.delete(url, {
    headers : {
      "authorization": `Bearer ${token}` 
    }
  }).then((res) => {
    console.log(res);
    location.reload()
  }).catch((err) => {
    console.log(err);
  });
}

const closeModal = (id) => {
  const modal = document.getElementById(id);
  modal.close();

  const dropdown = document.getElementById("yourDropdownId");
  if (dropdown) {
    dropdown.classList.add("hidden"); // Hide dropdown if it's open
  }
}






















// <a><!-- Open the modal using ID.showModal() method -->
// <button class="btn" onclick="openEdit('my_modal_2')">Edit</button>
// <dialog id="my_modal_2" class="modal">
// <div class="modal-box">
//     <h3 class="text-lg font-bold">Edit!</h3>
//     <p class="py-4">Press ESC key or click outside to close</p>
// </div>
// <form method="dialog" class="modal-backdrop">
//     <button>close</button>
// </form>
// </dialog></a>
// </li>
// <li onclick="">
{/* <a><!-- Open the modal using ID.showModal() method -->
<button class="delete btn" onclick="openDelete('my_modal_1')">Delete</button>
<dialog id="my_modal_1" class="modal">
<div class="modal-box">
    <h3 class="text-lg font-bold">Delete!</h3>
    <p class="py-4">Press ESC key or click outside to close</p>
</div>
<form method="dialog" class="modal-backdrop">
    <button>close</button>
</form>
</dialog></a> */}