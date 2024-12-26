(() => {
  // Function to calculate luminance based on the RGB color
  function luminance(r, g, b) {
    const a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  // Get the background color of the body
  const bodyStyle = window.getComputedStyle(document.body);
  const bgColor = bodyStyle.backgroundColor;

  // Extract RGB values from the computed background color
  const rgb = bgColor.match(/^rgba?\((\d+), (\d+), (\d+)/);
  let isLight = false;

  if (rgb) {
    const r = parseInt(rgb[1], 10);
    const g = parseInt(rgb[2], 10);
    const b = parseInt(rgb[3], 10);

    // Calculate the luminance of the background color
    isLight = luminance(r, g, b) > 0.5; // If luminance is greater than 0.5, it's considered light
  }

  // Send the result to the background script
  chrome.runtime.sendMessage({
    colorScheme: isLight ? "light" : "dark",
    backgroundColor: bgColor,
  });
})();
