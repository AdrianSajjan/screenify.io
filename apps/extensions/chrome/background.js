chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: injectElementFromHTML,
  });
});

async function injectElementFromHTML() {
  const id = "screenify-app";
  const response = await fetch(chrome.runtime.getURL("build/index.html"));
  const htmlText = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, "text/html");
  const container = doc.getElementById(id);
  const exists = document.getElementById(id);

  const stylesheet = doc.getElementById("css");
  const script = doc.getElementById("js");

  if (exists || !container || !stylesheet || !script) return;

  const injectedNode = container.cloneNode(true);
  const injectedScript = document.createElement("script");
  const injectedStylesheet = document.createElement("link");

  injectedScript.src = chrome.runtime.getURL("build/assets/index-UU1_7n9Z.js");
  injectedScript.type = "text/javascript";
  injectedScript.onload = () => console.log("Injected script executed.");
  document.head.appendChild(injectedScript);

  injectedStylesheet.href = chrome.runtime.getURL(
    "build/assets/index-BjOT7Qen.css",
  );
  injectedStylesheet.rel = "stylesheet";
  document.head.appendChild(injectedStylesheet);

  injectedNode.style.position = "fixed";
  injectedNode.style.top = "0";
  injectedNode.style.left = "0";
  injectedNode.style.width = "100%";
  injectedNode.style.height = "100%";
  injectedNode.style.zIndex = "9999";

  document.body.appendChild(injectedNode);
}
