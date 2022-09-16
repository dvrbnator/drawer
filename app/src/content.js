let articleLinkDom = null;
let articleLink = null,
  articleName = null;
let hostName = null,
  hostIcon = null;

function setArticleName(message) {
  let tag = articleLinkDom.tagName;
  //console.log(document.location.hostname);
  //console.log(tag);
  if (message.link.selectionText) {
    articleName = message.link.selectionText;
  } else if (
    tag === "H1" ||
    tag === "H2" ||
    tag === "H3" ||
    tag === "H4" ||
    tag === "H5" ||
    tag === "H6" ||
    tag === "A" ||
    tag === "UL" ||
    tag === "OL" ||
    tag === "LI" ||
    tag === "FOOTER" ||
    tag === "HEADER"
  ) {
    articleName = articleLinkDom.innerText;
  } else if (tag === "IMAGE" || tag === "IMG") {
    articleName = articleLinkDom.alt ? articleLinkDom.alt : message.tabD.title;
  } else if (tag === "DIV" || tag === "P" || tag === "SPAN") {
    if (
      articleLinkDom.innerText.trim().length === 0 ||
      articleLinkDom.innerText.length >= 300
    ) {
      articleName = message.tabD.title;
    } else {
      articleName = articleLinkDom.innerText;
    }
  } else {
    articleName =
      message.link.linkUrl ||
      message.tabD.title ||
      message.link.pageUrl ||
      message.tabD.url;
  }
}

function setArticleLink(message) {
  articleLink =
    message.link.linkUrl ||
    message.link.pageUrl ||
    message.tabD.url ||
    document.location.href;
}

function setHostName(message) {
  hostName = document.location.hostname;
}

function setHostIcon(message) {
  hostIcon = message.tabD.favIconUrl;
}

function printDetails() {
  console.log(
    "Article Name: ",
    articleName,
    "\nArticle Link: ",
    articleLink,
    "\nHost Name: ",
    hostName,
    "\nHost Icon Link: ",
    hostIcon
  );
}

let receiver = (message, sender, sendResponse) => {
  console.log(message);
  let jsonObj = {};
  setArticleName(message);
  setArticleLink(message);
  setHostName();
  setHostIcon(message);
  //printDetails();
  jsonObj["websiteName"] = hostName;
  jsonObj["hostIconLink"] = hostIcon;
  let articleJson = {};
  articleJson["articleLink"] = articleLink;
  articleJson["articleName"] = articleName;
  let date = new Date().toString();
  articleJson["savedDate"] = date;
  jsonObj["articleObj"] = articleJson;
  console.log(jsonObj);
  chrome.runtime.sendMessage(jsonObj);
};
chrome.runtime.onMessage.addListener(receiver);
window.addEventListener("DOMContentLoaded", (event) => {
  init();
});

function init() {
  document.addEventListener(
    "mousedown",
    (event) => {
      articleLinkDom = event.target;
    },
    false
  );
}
