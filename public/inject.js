const validateField = (inputField) => {
  const placeholder = inputField.getAttribute("placeholder");
  if (!(placeholder && placeholder.toLowerCase().includes("search"))) {
    return true;
  }
  return false;
};

const configureFields = (managers) => {
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
  console.log(allInputFields);
};

chrome.runtime.onMessage.addListener(function (message, sender) {
  if (sender.id !== chrome.runtime.id) return;
  const { EVENT_TYPE } = message;
  if (EVENT_TYPE === "MANAGERS_FETCHED") {
    const { DATA } = message;
    const { managers } = DATA;
    configureFields(managers);
  }
});
