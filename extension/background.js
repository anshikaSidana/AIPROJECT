chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "checkFakeReview",
      title: "Check if review is fake",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "checkFakeReview" && info.selectionText) {
      const reviewText = info.selectionText;
  
      // Send to content.js of active tab
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: sendReviewToContent,
        args: [reviewText]
      });
    }
  });
  
  function sendReviewToContent(reviewText) {
    window.dispatchEvent(
      new CustomEvent("checkFakeReviewSelection", { detail: reviewText })
    );
  }
  