let windowOrigin;

const getManager = async () => {
  const urlSearch = new URLSearchParams(location.search);
  const manager = await (await fetch(urlSearch.get("url"))).text();
  return manager;
};

(async () => {
  const urlSearch = new URLSearchParams(location.search);
  const iframe = document.getElementById("content");
  iframe.src = urlSearch.get("url");
  windowOrigin = urlSearch.get("origin");
})();

window.addEventListener("message", (e) => {
  if (!(e.origin === windowOrigin || e.data?.TYPE)) return;
  if (e.data.TYPE === "MANAGER_CLICK") {
    window.parent.postMessage(e.data, "*");
  }
});
