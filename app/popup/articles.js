let websiteName = document.location.search.split("=")[1];

let drawerHome = document.querySelector("#drawer-home");
let articleListContainer = document.querySelector(".article-list-container");
let deleteAllWebsites = document.querySelector("#nav-delete");

drawerHome.addEventListener("click", () => {
  window.location = "./popup.html";
});

deleteAllWebsites.addEventListener("click", () => {
  let confirmDelete = confirm("All the articles will be deleted");
  if (confirmDelete) {
    chrome.storage.local.get(null, (articles) => {
      for (let [key, value] of Object.entries(articles)) {
        if (value.websiteName === websiteName) {
          chrome.storage.local.remove(key, () => {
            console.log("deleted all articles");
          });
        }
      }
      window.location = "./popup.html";
    });
  }
});

document.querySelector(".websiteName").textContent = websiteName;

function sliceName(name) {
  return name.length > 69 ? name.slice(0, 65) + "..." : name;
}

function sliceDate(dateStr) {
  let fullDate = new Date(dateStr);
  let date = fullDate.toLocaleDateString("en-GB");
  let time = fullDate.toLocaleTimeString();
  return date + " " + time;
}

function openArticle(e) {
  let link = e.target.attributes.id.value;
  window.open(link, "_blank");
}

function deleteArticle(e) {
  let name = e.target.attributes.id.value;
  chrome.storage.local.get(null, (articles) => {
    for (let [key, value] of Object.entries(articles)) {
      if (value.articleObj["articleName"] === name) {
        chrome.storage.local.remove(key, () => {
          console.log("removed");
        });
        break;
      }
    }
    start();
  });
}

function start() {
  chrome.storage.local.get(null, (articles) => {
    var articleList = [];
    for (let [key, value] of Object.entries(articles)) {
      //console.log(value.articleObj["articleName"]);
      if (value.websiteName === websiteName) {
        let helperObj = {};
        helperObj["name"] = value.articleObj["articleName"];
        helperObj["link"] = value.articleObj["articleLink"];
        helperObj["savedDate"] = value.articleObj["savedDate"];
        articleList.push(helperObj);
      }
    }
    //console.log(articleList);
    articleList.sort(function (a, b) {
      return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime();
    });
    //console.log(articleList);
    renderArticleList(articleList);
  });
}

function renderArticleList(articleList) {
  articleListContainer.innerHTML = ``;
  for (let value of articleList) {
    articleListContainer.innerHTML += `<div class="article-card">
        <div class="article-details">
          <div class="article-name">
          ${sliceName(value.name)}
          </div>
          <div class="saved-day">Saved Date: ${sliceDate(value.savedDate)}</div>
        </div>
        <div class="buttons-holder" id="buttons-holder">
          <div class="buttons button-open" id="${value.link}">Open</div>
          <div class="buttons button-delete" id="${value.name}">Delete</div>
        </div>
      </div>`;
  }
  let btnOpen = document.querySelectorAll(".button-open");
  btnOpen.forEach((open) => {
    open.addEventListener("click", openArticle);
  });

  let btnDelete = document.querySelectorAll(".button-delete");
  btnDelete.forEach((deletes) => {
    deletes.addEventListener("click", deleteArticle);
  });
}

//uuidv4() fucntion copied from https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

window.onload = start();
