import { DATA } from "./test-data.js";
const form = document.getElementsByTagName("form")[0];
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const results = document.getElementById("searchResults");
const result = document.getElementsByClassName("result");
const loading = document.getElementById("loading");
const prevCount = document.getElementById("prevCount");
const currentCount = document.getElementById("currentCount");
const nextCount = document.getElementById("nextCount");
const footerQuery = document.getElementById("footerQuery");
const searchOnGoogle = document.getElementsByTagName("a")[0];
const preview = document.getElementById("preview");
const previewImage = document.getElementById("previewImage");
const previewTitle = document.getElementById("previewTitle");
const previewSubTitle = document.getElementById("previewSubTitle");
const visit = document.getElementById("visit");
const close = document.getElementById("close");

var start = 1;
var previewLink;

searchButton.onclick = () => {
  getRequest();
};

form.onsubmit = (e) => {
  e.preventDefault();
};

searchInput.addEventListener("input", () => {
  footerQuery.innerHTML = searchInput.value;
});

const checkCount = () => {
  nextCount.style.display = "flex";

  if (start < 2) {
    prevCount.style.display = "none";
    currentCount.style.display = "none";
  } else {
    currentCount.style.display = "flex ";
    prevCount.style.display = "flex";
  }
};

prevCount.onclick = () => {
  start -= 10;
  getRequest();
};

nextCount.onclick = () => {
  start += 10;
  getRequest();
};

const createResults = (resultArray = DATA) => {
  checkCount();
  currentCount.innerHTML = Math.ceil(start / 10);
  results.replaceChildren("");
  searchOnGoogle.href = `https://www.google.com/search?q=${searchInput.value.replace(
    " ",
    "+"
  )}`;

  resultArray.items.forEach((result) => {
    const divElement = document.createElement("div");
    const divElementLeft = document.createElement("div");
    const divElementRight = document.createElement("div");
    const image = document.createElement("img");
    const title = document.createElement("p");
    const subTitle = document.createElement("p");

    divElement.className = "result";
    divElementLeft.className = "left";
    divElementRight.className = "right";
    image.className = "resultImage";
    divElementLeft.style.backgroundImage = result.pagemap?.cse_thumbnail
      ? `url(${result.pagemap.cse_thumbnail[0].src})`
      : `url("../assets/Thumbnail.svg")`;
    title.className = "resultTitle";
    subTitle.className = "resultSubTitle";

    const titleText = document.createTextNode(result.title);
    const subTitleText = document.createTextNode(result.displayLink);

    title.appendChild(titleText);
    subTitle.appendChild(subTitleText);
    divElementLeft.appendChild(image);
    divElementRight.appendChild(title);
    divElementRight.appendChild(subTitle);

    divElement.appendChild(divElementLeft);
    divElement.appendChild(divElementRight);
    divElement.onclick = () => {
      preview.style.display = "flex";
      previewImage.style.backgroundImage = result.pagemap?.cse_thumbnail
        ? `url(${result.pagemap.cse_thumbnail[0].src})`
        : `url("../assets/Thumbnail.svg")`;
      previewTitle.innerHTML = result.title;
      previewSubTitle.innerHTML = result.displayLink;
      previewLink = result.link;
    };

    results.appendChild(divElement);
  });
};

visit.onclick = () => {
  window.open(previewLink, "_blank");
};

close.onclick = () => {
  preview.style.display = "none";
};

const getRequest = () => {
  loading.style.display = "flex";
  fetch(
    `https://www.googleapis.com/customsearch/v1?key=AIzaSyAUZj-XAoED-XrL8XK_6l-ENGYpObyx4WQ&cx=d2bd418b43cae4637&q=${searchInput.value}+youtube+music+video+only?start=${start}`
  )
    .then((data) => data.json())
    .then((data) => {
      createResults(data);
      loading.style.display = "none";
    })
    .catch((err) => {
      console.log(err);
      loading.style.display = "none";
    });
};
