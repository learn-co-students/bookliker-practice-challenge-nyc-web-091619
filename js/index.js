const booksUrl = 'http://localhost:3000/books';
const usersUrl = 'http://localhost:3000/users';

let books = [];
let users = [];

document.addEventListener("DOMContentLoaded", function() {

    fetch(booksUrl).then(resp => resp.json()).then(json => {
        books = [...json];
        appendBooks(books);
    })
    fetch(usersUrl).then(resp => resp.json()).then(json => {
        users = [...json];
    })

    document.addEventListener('click', (event) => {
        event.preventDefault();
        buttonAction = 'like'
        if (event.target.dataset.action === 'show-book') {
            showBook(event.target.dataset.id);
        }
         else if (event.target.dataset.action === 'like') {
             toggleBookLikes(event.target.dataset.id)
            // likeBook(event.target.dataset.id);
            event.target.dataset.action = 'unlike';
            event.target.innerText = 'Un-Like';
        } else if (event.target.dataset.action === 'unlike') {
            toggleBookLikes(event.target.dataset.id);
            event.target.dataset.action = 'like';
            event.target.innerText = 'Like';
        }
    })

});

const appendBooks = (bookArray) => {
    
    const ul = document.querySelector('ul');

    bookArray.forEach(book => {
        let li = document.createElement('li');
        li.innerText = book.title;
        li.dataset.id = book.id;
        li.dataset.action = 'show-book';
        ul.appendChild(li);
    })
}

const showBook = (id) => {
    const showPanel = document.querySelector('#show-panel');
    let book = books.find(b => b.id == id);

    showPanel.innerHTML = `
    <h2>${book.title}</h2>
    <img src=${book.img_url}>
    <p>${book.description}</p>`;
    if (book.users.find(b => b.id == 1)) {
        showPanel.innerHTML += `<button data-id=${book.id} data-action='unlike'>Un-like</button>`;
    } else {
        showPanel.innerHTML += `<button data-id=${book.id} data-action='like'>Like</button>`;
    }
}

const toggleBookLikes = (id) => {
    let book = books.find(b => b.id == id);
    let bookUsers = book.users.find(u => u.id === 1)
    if (!bookUsers) {
        book.users.push({id: 1, username: 'pouros'})
        console.log('liked it');
    } else {
        // remove user from userLikes array
        book.users = book.users.filter(b => b.id != 1);
    }
    fetch(booksUrl + `/${book.id}`, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({ users: book.users })
    }).then(resp => resp.json()).then(json => console.log(json))
}

// const unLikeBook = (id) => {
//     let book = books.find(b => b.id == id);
//     let userLikes = [...book.users];

//     if (book.users.find(u => u.id === 1)) {
//         userLikes = userLikes.filter(u => u.id != 1);
//         console.log('unliked it');
        
//         fetch(booksUrl + `/${book.id}`, {
//             method: 'PATCH',
//             headers: {
//                 'content-type': 'application/json',
//                 'accept': 'application/json'
//             },
//             body: JSON.stringify({ users: userLikes })
//         }).then(resp => resp.json()).then(json => console.log(json))
//     }
// }