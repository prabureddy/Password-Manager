const getManager = async () => {
  const urlSearch = new URLSearchParams(location.search);
  const manager = await (await fetch(urlSearch.get("url"))).text();
  return manager;
};

(async () => {
  const urlSearch = new URLSearchParams(location.search);
  const iframe = document.getElementById("content");
  iframe.src = urlSearch.get("url");
})();
