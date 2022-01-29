const BASE_URL = "http://localhost:3000";

const getManager = async () => {
  const HOST = location.hostname;
  const BASE_HOST = HOST.split(".").slice(-2).join(".");
  const url = new URL(`${BASE_URL}/generate`);
  const params = {
    site: BASE_HOST,
  };
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
  const manager = await (await fetch(url)).text();
  return manager;
};

(async () => {
  const managers = await getManager();
  const content = document.getElementById("content");
  content.style["margin"] = "14px 4px 4px 4px";
  content.style["background-color"] = "#ffffff";
  content.innerHTML = managers;
})();
