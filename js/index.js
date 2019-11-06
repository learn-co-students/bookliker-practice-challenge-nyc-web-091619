const BASE_URL = "http://localhost:3000/"
const BOOKS_URL = "http://localhost:3000/books"
const USER_URL = "http://localhost:3000/users"

const listUl = document.getElementById("list")
const showDiv = document.getElementById("show-panel")
let usersLiked = []


document.addEventListener("DOMContentLoaded", function() {

    function fetchBooks(id = ''){
        fetch(`${BOOKS_URL}/${id}`)
        .then(resp => resp.json())
        .then(json => {
            if(id === ''){
                json.forEach(addBook)
            }else{
                showDiv.innerHTML = ''
                renderBook(json)

            }
        })
    }
    function addBook(book){
        const li = document.createElement("li")
        li.dataset.id = `${book.id}`
        li.innerText = `${book.title}`
        listUl.appendChild(li)
    }

    function renderBook(book){
        usersLiked = book.users
        const h1 = document.createElement("h1")
        h1.innerText = `${book.title}`
        const img = document.createElement("img")
        img.src = `${book.img_url}`
        const p = document.createElement("p")
        p.innerText = `${book.description}`
        const usersUl = document.createElement("ul")
        usersUl.dataset.type = "ul"

        showDiv.dataset.book_id = `${book.id}`

        book.users.forEach((user) => {
            const li = document.createElement("li")
            li.innerText = `${user.username}`
            li.dataset.user_id = `${user.id}`
            li.style.fontWeight = 'bold'

            usersUl.appendChild(li)
        })
        const button = document.createElement("button")
        button.innerText = "Read Book"

        showDiv.appendChild(h1)
        showDiv.appendChild(img)
        showDiv.appendChild(p)
        showDiv.appendChild(usersUl)
        showDiv.appendChild(button)
    }

    listUl.addEventListener("click", showHandler)

    function showHandler(e){
        const id = e.target.dataset.id
        fetchBooks(id)
    }

    showDiv.addEventListener("click", likeHandler)

    function likeHandler(e){
        e.stopPropagation()
        const bookId = e.target.parentNode.dataset.book_id
        if(e.target.innerText === "Read Book") updateLikes(bookId, e)
    }

    function updateLikes(bookId, e){
        let newUser = {id:1, username: "pouros"}
        if(!usersLiked.some(e => e.id === newUser.id)){
            usersLiked.push(newUser)
            patchBooks(bookId)
        }else {
            window.alert("You read this already!")
            usersLiked = usersLiked.filter((e) => e.id !== newUser.id)
            patchBooks(bookId)
        }

    }

    function patchBooks(id){
        fetch(`${BOOKS_URL}/${id}`,{
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify({ users: usersLiked})
        })
        .then(resp => resp.json())
        .then(json => {
            document.querySelector(`[data-type="ul"]`).innerText = ""
            json.users.forEach((user) => {
                let newLi = document.createElement("li")
                newLi.innerText = `${user.username}`
                newLi.dataset.user_id = `${user.id}`
                newLi.style.fontWeight = 'bold'
    
                document.querySelector(`[data-type="ul"]`).appendChild(newLi)
            })

        })
    }

    fetchBooks()
})

