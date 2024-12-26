chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: injectExtention,
  });
});

function injectExtention() {
  const id = "screenify-container";
  const exists = document.getElementById(id);

  if (!exists) {
    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("build/index.html");

    iframe.style.position = "fixed";
    iframe.style.height = "100%";
    iframe.style.width = "100%";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.zIndex = "9999999";

    iframe.style.borderWidth = "0 !important";
    iframe.style.outlineWidth = "0 !important";
    iframe.style.background = "transparent !important";
    iframe.style.backgroundColor = "transparent !important";

    iframe.id = id;
    document.body.appendChild(iframe);
  }
}
