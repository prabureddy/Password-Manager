chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id) return;
  if (request.REQUEST_TYPE === "REQUEST_FAVICON") {
    const [{ favIconUrl, id: tabId }] = await chrome.tabs.query({
      active: true,
    });
    sendResponse(true);
    chrome.tabs.sendMessage(tabId, {
      REQUEST_TYPE: "GET_FAVICON",
      DATA: {
        favIconUrl,
      },
    });
  }
});
