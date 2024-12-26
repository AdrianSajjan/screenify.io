chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: initialize,
  });
});

function initialize() {
  const exists = document.getElementById("screenity-container");
  if (exists) return;
  const iframe = document.createElement("iframe");
  iframe.id = "screenity-container";
  iframe.src = chrome.runtime.getURL("build/index.html");
  iframe.style.position = "fixed";
  iframe.style.height = "100%";
  iframe.style.width = "100%";
  iframe.style.top = "0";
  iframe.style.left = "0";
  iframe.style.zIndex = "9999999";
  document.body.appendChild(iframe);
}
