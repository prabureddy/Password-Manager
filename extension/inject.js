const validateField = (inputField) => {
  let searchFound = false;
  for (let i = 0; i < inputField.attributes.length; i++) {
    const attrib = String(inputField.attributes[i]?.value);
    if (attrib && attrib?.toLowerCase().includes("search")) {
      searchFound = true;
      break;
    }
  }
  return !searchFound;
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

const addListenerToInputFields = (inputFields) => {
  console.log(inputFields);
  const topDiv = document.createElement("div");
  topDiv.id = "pass_manager_parent";
  topDiv.style["position"] = "absolute";
  topDiv.style["z-index"] = "10000000000000";
  topDiv.style["width"] = "330px";
  topDiv.style["height"] = "318.25px";
  topDiv.style["opacity"] = "1";
  topDiv.style["visibility"] = "visible";
  topDiv.style["transform"] = "none";
  topDiv.style["clip-path"] = "none";
  topDiv.style["filter"] = "none";
  topDiv.style["mask"] = "none";
  topDiv.style["display"] = "none";
  const iFrame = generateIFrame();
  topDiv.appendChild(iFrame);
  document.body.appendChild(topDiv);
  inputFields.forEach((inputField) => {
    inputField.setAttribute("autocomplete", "off");
    inputField.addEventListener("focus", async () => {
      console.log("focused ", inputField);
      const topParent = document.getElementById("pass_manager_parent");
      const elementRect = inputField.getBoundingClientRect();
      topParent.style["top"] = elementRect?.top + elementRect?.height + "px";
      topParent.style["left"] = elementRect?.left + "px";
      topParent.style["display"] = "block";
    });
    window.onclick = function (event) {
      if (event.target !== inputField) {
        const topParent = document.getElementById("pass_manager_parent");
        topParent.style["display"] = "none";
      }
    };
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
