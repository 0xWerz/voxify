chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "playAudio") {
        console.log("Playing audio:", request.audioUrl);

        const audio = new Audio(request.audioUrl);
        audio.play();
    }
});

document.addEventListener("mouseup", (event) => {
    if (event.button === 2) {
        chrome.runtime.sendMessage(
            { action: "getSelectedText" },
            (response) => {
                if (response) {
                    console.log("Selected text:", response);
                }
            }
        );
    }
});
