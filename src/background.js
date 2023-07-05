chrome.runtime.onInstalled.addListener(async () => {
    try {
        const response = await fetch(
            chrome.runtime.getURL("src/static/voices.json")
        );
        const data = await response.json();
        const speakers = data.speakers;

        chrome.contextMenus.create({
            id: "voxify",
            title: "Convert to Speech",
            contexts: ["selection"],
        });

        for (const speaker of speakers) {
            chrome.contextMenus.create({
                id: speaker.id,
                parentId: "voxify",
                title: speaker.name,
                contexts: ["selection"],
            });
        }
    } catch (error) {
        console.error("Error loading voices:", error);
    }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.parentMenuItemId === "voxify") {
        try {
            const voiceId = info.menuItemId;
            const selectedText = info.selectionText;
            await convertTextToSpeech(selectedText, tab.id, voiceId);
        } catch (error) {
            console.error("Error converting text to speech:", error);
        }
    }
});

async function convertTextToSpeech(text, tabId, voiceId) {
    try {
        const response = await fetch("https://app.coqui.ai/api/v2/samples", {
            method: "POST",
            headers: {
                Authorization: "Bearer <API_KEY>",
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                name: "my test sample",
                voice_id: voiceId,
                text: text,
            }),
        });

        const data = await response.json();
        const audioUrl = data.audio_url;

        chrome.tabs.sendMessage(tabId, { action: "playAudio", audioUrl });
    } catch (error) {
        console.error("Error converting text to speech:", error);
    }
}
