const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

//add search Enter Button functionality
document
    .getElementById("search")
    .addEventListener("keypress", function (event) {
        if (event.key == "Enter") {
            document.getElementById("search-btn").click();
        }
    });

//function to get search string and pass getImages
searchBtn.addEventListener("click", function () {
    document.querySelector(".main").style.display = "none";
    clearInterval(timer);
    const search = document.getElementById("search");
    getImages(search.value);
    sliders.length = 0;
});

//Function getImages
const getImages = (query) => {
    toggleSpinner();
    fetch(
        `https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&pretty=true`
    )
        .then((response) => response.json())
        .then((data) => {
            if (data.hits.length !== 0) {
                fetch(
                    `https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&pretty=true`
                )
                    .then((response) => response.json())
                    .then((data) => showImages(data.hits))
                    .catch((err) => console.log(err));
            } else {
                location.reload();
                alert("No image found, please search again");
            }
        });
};

//show spinner
const toggleSpinner = () => {
    const spinner = document.getElementById("loading-spinner");
    spinner.classList.toggle("d-none");
    const songs = gallery;
    songs.classList.toggle("d-none");
};

// Function show images
const showImages = (images) => {
    imagesArea.style.display = "block";
    gallery.innerHTML = "";
    // show gallery title
    galleryHeader.style.display = "flex";
    images.forEach((image) => {
        let div = document.createElement("div");
        div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-3";
        div.innerHTML = ` <img class="img-fluid img-thumbnail " onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
        gallery.appendChild(div);
    });
    toggleSpinner();
};

//Function selectItem
let slideIndex = 0;
const selectItem = (event, img) => {
    let element = event.target;

    if (!event.target.classList.contains("added")) {
        element.classList.add("added");
    } else {
        element.classList.remove("added");
    }

    let item = sliders.indexOf(img);

    if (item === -1) {
        sliders.push(img);
    } else if (item !== -1) {
        sliders.pop(img);
    }
};

//add image slider button Enter Button functionality
document
    .getElementById("duration")
    .addEventListener("keypress", function (event) {
        if (event.key == "Enter") {
            document.getElementById("create-slider").click();
        }
    });

function slider1() {
    let duration = document.getElementById("duration").value;
    if (duration < 0) {
        alert("Duration cannot be negative");
        return;
    } else if (duration == "") {
        duration = 1000;
        createSlider(duration);
    } else {
        createSlider(duration);
    }
};

//Function CreateSlider
var timer;
const createSlider = (duration) => {
    toggleSpinner();
    // check slider image length
    if (sliders.length < 2) {
        alert("Select at least 2 image.");
        return;
    }
    // crate slider previous next area
    sliderContainer.innerHTML = "";
    const prevNext = document.createElement("div");
    prevNext.className =
        "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
                        <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
                        <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>`;
    sliderContainer.appendChild(prevNext);
    document.querySelector(".main").style.display = "block";
    // hide image aria
    imagesArea.style.display = "none";

    sliders.forEach((slide) => {
        let item = document.createElement("div");
        item.className = "slider-item";
        item.innerHTML = `<img class="w-100"
                        src="${slide}"
                        alt="">`;
        sliderContainer.appendChild(item);
    });
    changeSlide(0);
    timer = setInterval(function () {
        slideIndex++;
        changeSlide(slideIndex);
    }, duration);
    toggleSpinner();
};

// change slider index
const changeItem = (index) => {
    changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
    const items = document.querySelectorAll(".slider-item");
    if (index < 0) {
        slideIndex = items.length - 1;
        index = slideIndex;
    }

    if (index >= items.length) {
        index = 0;
        slideIndex = 0;
    }

    items.forEach((item) => {
        item.style.display = "none";
    });

    items[index].style.display = "block";
};
