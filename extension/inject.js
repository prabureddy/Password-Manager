const validateField = (inputField) => {
  let searchFound = false;
  for (let attribute of inputField.attributes) {
    const attrib = String(attribute?.value);
    if (attrib && attrib?.toLowerCase().includes("search")) {
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
  iframe.src = chrome.runtime.getURL("./dialog.html");
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
  topParent.style["top"] = elementRect?.top + elementRect?.height + "px";
  topParent.style["left"] = elementRect?.left + "px";
  topParent.style["display"] = "block";
};

const blurElement = (inputFields, inputField, event) => {
  if (event.target !== inputField && !inputFields.includes(event.target)) {
    const topParent = document.getElementById("pass_manager_parent");
    topParent.style["display"] = "none";
  }
};

const addListenerToInputFields = (inputFields) => {
  console.log(inputFields);
  const topDiv = generateParent();
  const iFrame = generateIFrame();
  topDiv.appendChild(iFrame);
  document.body.appendChild(topDiv);
  inputFields.forEach((inputField) => {
    inputField.setAttribute("autocomplete", "off");
    inputField.addEventListener("focus", () => focusElement(inputField));
    window.onclick = (event) => blurElement(inputFields, inputField, event);
  });
};

const configureFields = () => {
  const forms = document.querySelectorAll("form");
  const allInputFields = [];
  forms.forEach((form) => {
    const formFields = form.querySelectorAll(
      "input[type=text]:not([hidden]), input[type=password]:not([hidden]), input[type=email]:not([hidden])"
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

configureFields();
