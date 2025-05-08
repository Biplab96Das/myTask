chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: "index.html", // Change this to the path of your AngularJS page
    active: true
  });
});
