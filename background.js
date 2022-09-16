let contextMenuItem = {
  id: "saveArticle",
  title: "Save Article",
  contexts: ["all"],
};

chrome.contextMenus.create(contextMenuItem);

let getArticleDetails = (linkData, tab) => {
  let msg = {
    type: "saveArticle",
    link: linkData,
    tabD: tab,
  };
  chrome.tabs.sendMessage(tab.id, msg, () => {
    console.log("Message Sent");
  });
  //console.log(tab);
};

chrome.contextMenus.onClicked.addListener(function (linkData, tab) {
  getArticleDetails(linkData, tab);
  articleLink = linkData.linkUrl || tab.url;
  //console.log("Article Link:", articleLink);
});

chrome.runtime.onMessage.addListener(function (
  articleJson,
  sender,
  sendResponse
) {
  storeArticleDetails(articleJson);
});

function storeArticleDetails(articleJson) {
  /**
   * response object "articleJson" structure
   * {
   * websiteName: 'www.bookfusion.com',
   * hostIconLink: 'https://www.bookfusion.com/favicon.svg',
   * articleObj: {
   * articleLink : "https://www.bookfusion.com/books/898900-travel-charts",
   * articleName : "Travel Charts"
   *              }
   * }
   */
  let key = uuidv4();
  chrome.storage.local.set({ [key]: articleJson }, () => {
    console.log("Saved");
  });
  //debubStorage();
}

function debubStorage() {
  chrome.storage.local.get(null, (articles) => {
    console.log(articles);
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
