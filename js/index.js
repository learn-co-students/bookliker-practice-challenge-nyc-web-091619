
document.addEventListener("DOMContentLoaded", function() {
    const bookUrl = "http://localhost:3000/books"
    const titleUl = document.getElementById("list")
    const showPanel = document.getElementById("show-panel")

const fetchCall = function (){
    fetch(bookUrl)
    .then(function(response){return response.json()})
    .then(function(data){data.forEach(appendBook)})
}

fetchCall()

function appendBook(book){
    const titleLi = document.createElement("li")
    titleLi.innerText = book.title
    titleLi.dataset.id = book.id
    titleUl.appendChild(titleLi)


    titleLi.addEventListener("click", function(event){            
        hideBookInfo()
        showBookInfo(book)
    
    })// end of click handler



} // end of appendBook 

    function showBookInfo(book){
        const divCard = document.createElement("div")
        divCard.dataset.id = book.id
        const bookDescription = document.createElement("h4")
        const bookImg = document.createElement("img")
        const userUl = document.createElement("ul")
        const users = book.users
        const likeButton = document.createElement("button")
        const likeScore = document.createElement("p")
        likeButton.innerText = "~💋 Luv dis b00k!~"
        likeButton.dataset.id = "button-id"
        likeScore.innerHTML = "<span>0</span> Likes"

        function renderUsers(user){
            const userLi = document.createElement("li")
            userLi.innerText = user.username
            userUl.appendChild(userLi)
        }
        users.forEach(renderUsers)
        
        bookDescription.innerText = book.description
        bookImg.src = book.img_url
        
        divCard.appendChild(bookDescription)
        divCard.appendChild(bookImg)
        divCard.appendChild(userUl)
        divCard.appendChild(likeButton)
        divCard.appendChild(likeScore)
        
        showPanel.appendChild(divCard)
        
        //extra w0rk$$
        likeButton.addEventListener("click", function(event){
            let spanElement = event.target.parentNode.querySelector("p span")
            
            let score = parseInt(spanElement.innerText) + 1
            spanElement.innerText = score
            
            let myself = {id: 1, username: "pouros"}
            users.push(myself)
            userUl.innerHTML = ""
            users.forEach(renderUsers)
            
            
            fetch(`http://localhost:3000/books/${book.id}`, {
                method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(users) 
            })



        }) //end of likeButton
    
    
    }//end of ShowBookInfo


    function hideBookInfo(){
        showPanel.innerHTML = " "
    }//end of hidebookinfo



}); //end of DOMContentLoaded


