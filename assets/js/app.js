
let cl = console.log;

const movieModalshowbtn = document.getElementById('movieModalshowbtn')
const backDrop = document.getElementById('backDrop')
const movieModal = document.getElementById('movieModal')
const closeModalbtn = [...document.querySelectorAll('.closeModal')]
const MovieForm = document.getElementById('MovieForm')
const MovieNamecontrol = document.getElementById('MovieName')
const MovieImgcontrol = document.getElementById('MovieImg')
const MovieDescriptioncontrol = document.getElementById('MovieDescription')
const movieRatingcontrol = document.getElementById('movieRating')
const addmoviebtn = document.getElementById('addmoviebtn')
const updatemoviebtn = document.getElementById('updatemoviebtn')

let moviesArr;
if (localStorage.getItem('moviesArr')) {
    moviesArr = JSON.parse(localStorage.getItem('moviesArr'))
}else{
    moviesArr = [];
}

function snackbar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })
}

function setrating(rating) {
    if (rating >= 4) {
        return 'badge-success'
    } else if (rating >= 3 && rating < 4) {
        return 'badge-warning'
    } else {
        return 'badge-danger'
    }
}

function CreateMovieCards(arr) {
    let result = '';
    arr.forEach((ele) => {
        result += ` <div class="col-md-3 col-sm-6 mb-4 ">
            <div class="card moviecard h-100" id="${ele.movieId}">
                <div class="card-header">
                    <div class="row">
                        <div class="col-10">
                            <h4>${ele.movieName}</h4>
                        </div>
                        <div class="col-2">
                            <h4>
                                <span class="badge ${setrating(ele.movieRating)}">${ele.movieRating}</span>
                            </h4>
                        </div>
                    </div>
                </div>
                <div class="card-body p-0">
                    <figure>
                        <img src="${ele.movieImg}" alt="${ele.movieName}" title="${ele.movieName}" >
                        <figcaption>
                            <h5>${ele.movieName}</h5>
                            <p>${ele.movieDesciption}</p>

                        </figcaption>
                    </figure>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button  onclick="onEdit(this)" class="btn btn-sm  net-sec-btn">Edit</button>
                    <button onclick="onRemove(this)" class="btn btn-sm net-pri-btn ">Remove</button>
                </div>
            </div>
        </div>`
    })
    const moviecontainer = document.getElementById('moviecontainer')
    moviecontainer.innerHTML = result;
}
CreateMovieCards(moviesArr)



// function onmoviemodalshow(){
//     backDrop.classList.add('active')
//     movieModal.classList.add('active')

// }
// function onmoviemodalhide(){
//     backDrop.classList.remove('active')
//     movieModal.classList.remove('active')

// }
function onmoviemodaltoggle() {
    MovieForm.reset()
    backDrop.classList.toggle('active')
    movieModal.classList.toggle('active')



}

function onmoviesubmit(eve) {
    eve.preventDefault()
    let movie_obj = {
        movieName: MovieNamecontrol.value,
        movieImg: MovieImgcontrol.value,
        movieDesciption: MovieDescriptioncontrol.value,
        movieRating: movieRatingcontrol.value,
        movieId: Date.now().toString()
    }
    MovieForm.reset()
    moviesArr.unshift(movie_obj)
    localStorage.setItem('moviesArr', JSON.stringify(moviesArr))

    let col = document.createElement('div')
    col.className = 'col-md-3 col-sm-6 mb-4'
    col.innerHTML = ` <div class="card moviecard h-100" id="${movie_obj.movieId}">
                <div class="card-header">
                    <div class="row">
                        <div class="col-10">
                            <h4>${movie_obj.movieName}</h4>
                        </div>
                        <div class="col-2">
                            <h4>
                                <span class="badge ${setrating(movie_obj.movieRating)}">${movie_obj.movieRating}</span>
                            </h4>
                        </div>
                    </div>
                </div>
                <div class="card-body p-0">
                    <figure>
                        <img src="${movie_obj.movieImg}" alt="${movie_obj.movieName}" title="${movie_obj.movieName}">
                        <figcaption>
                            <h5>${movie_obj.movieName}</h5>
                            <p>${movie_obj.movieDesciption}</p>

                        </figcaption>
                    </figure>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button   onclick="onEdit(this)" class="btn btn-sm  net-sec-btn">Edit</button>
                    <button  onclick="onRemove(this)" class="btn btn-sm net-pri-btn ">Remove</button>
                </div>
            </div>`

    let moviecontainer = document.getElementById('moviecontainer')
    moviecontainer.prepend(col)
    onmoviemodaltoggle()
    snackbar(`The Movie ${movie_obj.movieName} is added successfully!!`)
}



function onRemove(ele) {
    let REMOVE_ID = ele.closest('.moviecard').id
    Swal.fire({
        title: `Are you sure? you want To remove the movie ${REMOVE_ID}`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#212529",
        cancelButtonColor: "#e50914",
        confirmButtonText: "Yes, Reomve it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let REMOVE_ID = ele.closest('.moviecard').id
            let getindex = moviesArr.findIndex((m) => {
                return m.movieId === REMOVE_ID
            })
            if (getindex > -1) {
                let movie = moviesArr.splice(getindex, 1)
                localStorage.setItem('moviesArr', JSON.stringify(moviesArr))
                ele.closest('.col-md-3').remove()
                snackbar(`the movie is ${movie[0].movieName} is removed successfullly!!!,success`)
            }
        }

    });
}

function onEdit(ele) {
    let EDIT_ID = ele.closest('.moviecard').id
    localStorage.setItem('EDIT_ID', EDIT_ID)
    let EDIT_OBJ = moviesArr.find((m) => {
        return m.movieId === EDIT_ID
    })
    onmoviemodaltoggle()
    addmoviebtn.classList.add('d-none')
    updatemoviebtn.classList.remove('d-none')

    MovieNamecontrol.value = EDIT_OBJ.movieName
    MovieImgcontrol.value = EDIT_OBJ.movieImg
    MovieDescriptioncontrol.value = EDIT_OBJ.movieDesciption
    movieRatingcontrol.value = EDIT_OBJ.movieRating


}

function onMovieUpdate(eve) {
    let UPDATED_ID = localStorage.getItem('EDIT_ID')
    localStorage.removeItem('EDIT_ID')
    let UPDATED_OBJ = {
        movieName: MovieNamecontrol.value,
        movieImg: MovieImgcontrol.value,
        movieDesciption: MovieDescriptioncontrol.value,
        movieRating: movieRatingcontrol.value,
        movieId: UPDATED_ID
    }

    let getindex = moviesArr.findIndex((m) => {
        return m.movieId === UPDATED_ID
    })
    moviesArr[getindex] = UPDATED_OBJ;
    localStorage.setItem('moviesArr', JSON.stringify(moviesArr))
    onmoviemodaltoggle()

    let card = [...document.getElementById(UPDATED_ID).children];
    card[0].innerHTML = `
         <div class="card-header">
                    <div class="row">
                        <div class="col-10">
                            <h4>${UPDATED_OBJ.movieName}</h4>
                        </div>
                        <div class="col-2">
                            <h4>
                                <span class="badge ${setrating(UPDATED_OBJ.movieRating)}">${UPDATED_OBJ.movieRating}</span>
                            </h4>
                        </div>
                    </div>
                </div>
    `
    card[1].innerHTML = `
    <div class="card-body p-0">
                    <figure>
                        <img src="${UPDATED_OBJ.movieImg}" alt="${UPDATED_OBJ.movieName}" title="${UPDATED_OBJ.movieName}">
                        <figcaption>
                            <h5>${UPDATED_OBJ.movieName}</h5>
                            <p>${UPDATED_OBJ.movieDesciption}</p>

                        </figcaption>
                    </figure>
                </div>
    `

    addmoviebtn.classList.remove('d-none')
    updatemoviebtn.classList.add('d-none')
}



movieModalshowbtn.addEventListener('click', onmoviemodaltoggle)

closeModalbtn.forEach((ele) => {
    ele.addEventListener('click', onmoviemodaltoggle)
})
MovieForm.addEventListener('submit', onmoviesubmit)
updatemoviebtn.addEventListener('click', onMovieUpdate)