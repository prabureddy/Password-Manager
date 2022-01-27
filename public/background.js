const BASE_URL = "https://password-manager-one.vercel.app";

const fetchData = async (tabURL, tabId) => {
  const HOST = new URL(tabURL).hostname;
  const BASE_HOST = HOST.split(".").slice(-2).join(".");
  const url = new URL(`${BASE_URL}/api/manager`);
  const params = {
    site: BASE_HOST,
  };
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
  const managers = await (await fetch(url)).json();
  chrome.tabs.sendMessage(tabId, {
    EVENT_TYPE: "MANAGERS_FETCHED",
    DATA: {
      managers,
    },
  });
};

const getTabDetails = (tabId) => {
  chrome.tabs.get(tabId, async (tab) => {
    if (!(tab.active && tab.url)) return;
    fetchData(tab.url, tab.id);
  });
};

chrome.tabs.onActivated.addListener((tab) => {
  getTabDetails(tab.tabId);
});

chrome.tabs.onUpdated.addListener((tab) => {
  getTabDetails(tab);
});
