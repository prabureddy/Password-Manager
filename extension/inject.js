const BASE_URL = "http://localhost:3000";
let favIconURL;
const allInputFields = [];

const getURL = () => {
  const HOST = location.hostname;
  const BASE_HOST = HOST.split(".").slice(-2).join(".");
  const url = new URL(`${BASE_URL}/generate`);
  const params = {
    site: BASE_HOST,
    favIconURL: encodeURIComponent(favIconURL),
  };
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
  return url.href;
};

const requestFavIcon = () => {
  return chrome.runtime.sendMessage({
    REQUEST_TYPE: "REQUEST_FAVICON",
  });
};

const validateField = (inputField) => {
  const names = ["search", "message"];
  let searchFound = false;
  for (let attribute of inputField.attributes) {
    const attrib = String(attribute?.value);
    if (attrib && names.some((name) => attrib?.toLowerCase().includes(name))) {
      searchFound = true;
      break;
    }
  }
  return !searchFound;
};

const generateParent = () => {
  const topDiv = document.createElement("div");
  topDiv.id = "pass_manager_parent";
  topDiv.style["position"] = "absolute";
  topDiv.style["z-index"] = "10000000000000";
  topDiv.style["opacity"] = "1";
  topDiv.style["width"] = "400px";
  topDiv.style["height"] = "200px";
  topDiv.style["visibility"] = "visible";
  topDiv.style["transform"] = "none";
  topDiv.style["clip-path"] = "none";
  topDiv.style["filter"] = "none";
  topDiv.style["mask"] = "none";
  topDiv.style["display"] = "none";
  return topDiv;
};

const generateIFrame = () => {
  const iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL(
    `/dialog.html?url=${encodeURIComponent(
      getURL()
    )}&origin=${encodeURIComponent(BASE_URL)}`
  );
  iframe.style["border"] = "none";
  iframe.style["position"] = "relative";
  iframe.style["inset"] = "0px";
  iframe.style["height"] = "100%";
  iframe.style["width"] = "100%";
  iframe.style["visibility"] = "visible";
  iframe.style["display"] = "block";
  iframe.style["z-index"] = "10000000000000";
  iframe.style["opacity"] = "1";
  iframe.style["transform"] = "none";
  iframe.style["clip-path"] = "none";
  iframe.style["filter"] = "none";
  iframe.style["mask"] = "none";
  return iframe;
};

const focusElement = (inputField) => {
  const topParent = document.getElementById("pass_manager_parent");
  const elementRect = inputField.getBoundingClientRect();
  topParent.style["top"] = elementRect?.top + elementRect?.height + 15 + "px";
  topParent.style["left"] = elementRect?.left + "px";
  topParent.style["display"] = "block";
};

const blurElement = (inputFields, inputField, event) => {
  if (event.target !== inputField && !inputFields.includes(event.target)) {
    const topParent = document.getElementById("pass_manager_parent");
    topParent.style["display"] = "none";
  }
};

const addSubmitListener = (inputField) => {
  inputField.addEventListener("click", (event) => {
    console.log("clicked");
  });
};

const addListenerToInputFields = (inputFields) => {
  const topDiv = generateParent();
  const iFrame = generateIFrame();
  topDiv.appendChild(iFrame);
  document.body.appendChild(topDiv);
  inputFields.forEach((inputField) => {
    if (inputField.type === "submit") {
      addSubmitListener(inputField);
      return;
    }
    inputField.setAttribute("autocomplete", "off");
    inputField.addEventListener("focus", () => focusElement(inputField));
    window.onclick = (event) => blurElement(inputFields, inputField, event);
  });
};

const configureFields = () => {
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    const formFields = form.querySelectorAll(
      "input[type=text]:not([hidden]), input[type=password]:not([hidden]), input[type=email]:not([hidden]), input[type=submit]:not([hidden])"
    );
    let fields = [];
    formFields.forEach((fieldDetails) => {
      if (validateField(fieldDetails)) {
        fields.push(fieldDetails);
      }
    });
    allInputFields.push(...fields);
  });
  if (allInputFields.length <= 0) return;
  addListenerToInputFields(allInputFields);
};

requestFavIcon();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (sender.id !== chrome.runtime.id) return;
  if (request.REQUEST_TYPE === "GET_FAVICON") {
    sendResponse(true);
    const { favIconUrl } = request?.data;
    favIconURL = favIconUrl;
    configureFields();
  }
});

window.addEventListener("message", (e) => {
  if (!(e.origin === BASE_URL || e.data?.TYPE)) return;
  if (e.data.TYPE === "MANAGER_CLICK") {
    const { username, password } = e.data?.data?.manager;
    allInputFields.forEach((inputField) => {
      if (inputField.type === "text" || inputField.type === "email") {
        inputField.value = username;
      } else if (inputField.type === "password") {
        inputField.value = password;
      }
    });
  }
});
