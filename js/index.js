let BOOKS_URL = "http://localhost:3000/books"
let USERS_URL = "http://localhost:3000/users"

let THIS_USER = {
    id: 1,
    username: "pouros"
}
document.addEventListener("DOMContentLoaded", function() {

    let listPanel = document.getElementById("list-panel")
    let list = document.getElementById("list")
    let showPanel = document.getElementById("show-panel")

    let books = []


    // =========== FUNCTIONS =================

    function appendUser(user){
        let list = showPanel.getElementsByTagName("ul")[0]
        let li = document.createElement("li")
        li.innerText = user.username
        list.appendChild(li)
    }

    function removeUser(user){
        let list = showPanel.getElementsByTagName("ul")[0]
        let lis = Array.from(list.getElementsByTagName("li"))
        console.log(lis)
        let li = lis.find(li => li.innerText === user.username)
        list.removeChild(li)
    
    }

    function likeClickHandler(e){

        let id = e.target.dataset.id
        let index = books.findIndex(book => book.id === parseInt(id))
        let book = books[index]

        let newLiker = THIS_USER
        let oldLikers = book.users
        let userIndex = oldLikers.findIndex(user => user.id === newLiker.id)
        let newLikers 
        let obj = {}
        //If this user had liked the book before
        // remove the user from the likes list
        if(userIndex !== -1){
           
            e.target.innerText = "Like!"
            oldLikers.splice(userIndex, 1)
            obj.users = oldLikers
        
        }else{
            e.target.innerText = "Un-Like!"
            newLikers = [...oldLikers, newLiker]

            obj.users = newLikers
        }

        console.log("New Users Object: ", obj)

        fetch(`${BOOKS_URL}/${id}`, {
            method: "PATCH",
            headers:{
                "content-type": "application/json",
                accept: "applicaiton/json"
            },
            body: JSON.stringify(obj)
        }).then(resp => resp.json())
            .then(data => {

                // update DOM
                if(userIndex !== -1){
                    removeUser(newLiker)
                }else{
                    appendUser(newLiker)
                }

                //update books Array
                books[index].users = data.users

            })

        

    }

    function hideClickHandler(e){
        showPanel.innerHTML = ""
    }

    function clickBookHandler(e){

        showPanel.innerHTML = ""

        let id = e.target.dataset.id
        let index = books.findIndex(book => book.id === parseInt(id))
        let book = books[index]


        let card = document.createElement("div")

        let cover = document.createElement("img")
        cover.src = book.img_url

        let title = document.createElement("h2")
        title.innerText = book.title

        let desc = document.createElement("p")
        desc.innerText = book.description
        
        let likeButton = document.createElement("button")
        if(book.users.find(user => user.id === THIS_USER.id) !== undefined ){
            
            likeButton.innerText = "Un-Like"
        }else{
            likeButton.innerText = "Like!"
        }
        
        likeButton.dataset.id = book.id
        likeButton.addEventListener("click", likeClickHandler)

        let users = document.createElement("ul")
        let userHeader = document.createElement("h3")
        userHeader.innerText = "Users who like this book:"
        
        
        let hideButton = document.createElement("button")
        hideButton.innerText = "Hide"
        hideButton.addEventListener("click", hideClickHandler)

        card.appendChild(cover)
        card.appendChild(title)
        card.appendChild(desc)
        card.appendChild(likeButton)
        card.appendChild(userHeader)
        card.appendChild(users)
        card.appendChild(hideButton)
        showPanel.appendChild(card)
        
        //now add the users
        book.users.forEach(appendUser)
        
    }

    function appendBook(book){
        let li = document.createElement("li")
        li.innerText = book.title
        li.dataset.id = book.id
        li.addEventListener("click", clickBookHandler)

        list.appendChild(li)
    }

    function fetchBooks(){
        fetch(BOOKS_URL)
            .then(resp => resp.json())
            .then(data => {
                books = data
                books.forEach(appendBook)
            })
    }

    // ========== EXECUTION  =================

    fetchBooks()
    

}); // END DOM LISTENER

