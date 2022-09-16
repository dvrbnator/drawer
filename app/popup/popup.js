let websiteCardContainer = document.querySelector(".website-card-container");
let deleteAllWebsites = document.querySelector("#nav-delete");
let drawerHome = document.querySelector("#drawer-home");

drawerHome.addEventListener("click", () => {
  window.location = "./popup.html";
});
deleteAllWebsites.addEventListener("click", () => {
  let confirmDelete = confirm(
    "All the Website Articles will be deleted permanently!!"
  );
  if (confirmDelete) {
    chrome.storage.local.clear();
    start();
  }
});

function openArticlePage(e) {
  let webName = e.target.attributes.id.value;
  window.location = "./articles.html?website=" + webName;
}

function deleteArticlesWebsite(e) {
  let webName = e.target.attributes.id.value;
  chrome.storage.local.get(null, (articles) => {
    for (let [key, value] of Object.entries(articles)) {
      if (value.websiteName === webName) {
        chrome.storage.local.remove(key, () => {
          console.log("removed");
        });
      }
    }
    start();
  });
}

function start() {
  chrome.storage.local.get(null, (articles) => {
    //console.log(articles);
    var websites = {};
    if (Object.keys(articles).length === 0) {
      //console.log("Empty");
      renderWebsiteCards(websites);
    } else {
      for (let [key, value] of Object.entries(articles)) {
        if (websites.hasOwnProperty(value.websiteName)) {
          helper = websites[value.websiteName];
          helper["articleCount"] += 1;
          websites[value.websiteName] = helper;
        } else {
          websites[value.websiteName] = {};
          helper = websites[value.websiteName];
          helper["websiteName"] = value.websiteName;
          helper["websiteIcon"] = value.hostIconLink;
          helper["articleCount"] = 1;
          websites[value.websiteName] = helper;
        }
      }
      //console.log(websites);
      renderWebsiteCards(websites);
    }
  });
}

function renderWebsiteCards(websites) {
  if (Object.keys(websites).length !== 0) {
    websiteCardContainer.innerHTML = ``;
    for (let [key, value] of Object.entries(websites)) {
      //console.log(value.websiteName);

      websiteCardContainer.innerHTML += `
    <div class="website-card ${value.websiteName}" id="website-card">
    <div class="logo" id="logo">
      <img src="${value.websiteIcon}" alt="${value.websiteName} icon" width="90px" height="90px" style="background-color:black"/>
    </div>
    <div class="website-card-info" id="website-card-info">
      <span class="website-name" id="website-name">${value.websiteName}</span>
      <div>Saved Articles: ${value.articleCount}</div>
    </div>
    <div class="buttons-holder" id="buttons-holder">
      <div class="buttons button-open" id="${value.websiteName}">Open</div>
      <div class="buttons button-delete" id="${value.websiteName}">Delete</div>
    </div>
    </div>`;
    }

    let btnOpen = document.querySelectorAll(".button-open");
    btnOpen.forEach((open) => {
      open.addEventListener("click", openArticlePage);
    });

    let btnDelete = document.querySelectorAll(".button-delete");
    btnDelete.forEach((deletes) => {
      deletes.addEventListener("click", deleteArticlesWebsite);
    });
  } else {
    websiteCardContainer.innerHTML = ``;
    websiteCardContainer.innerHTML += `<div class="website-card" id="no-websitecard">
    <div class="website-card-info" id="website-card-info" style="display: flex; width: 100%; flex-direction: row; align-items: center;">
      <span class="website-name" id="website-name"
        >It seems like you haven't saved any articles yet🤔</span
      >
    </div>
  </div>`;
  }
}

window.onload = start();
