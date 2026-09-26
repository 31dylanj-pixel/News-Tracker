/* =========================================
   NEWS TRACKER
   Version 1.0
========================================= */


/* =========================================
   DEMO NEWS
========================================= */

const demoNews = {

    "Minecraft": [
        {
            label: "Major Update",
            title: "New Minecraft development information released",
            summary:
                "This is demo information for News Tracker. The future AI system will automatically find and summarize real news about this topic.",
            source: "Demo Source",
            time: "Today"
        },
        {
            label: "Development",
            title: "New snapshot information becomes available",
            summary:
                "News Tracker will eventually detect new developments, remove duplicates, and generate concise summaries automatically.",
            source: "Demo Source",
            time: "Earlier today"
        }
    ],

    "Space": [
        {
            label: "Science",
            title: "New space research information detected",
            summary:
                "This is placeholder content. The real tracker will search configured sources and send relevant information through the AI analyzer.",
            source: "Demo Source",
            time: "Today"
        }
    ],

    "Chess": [
        {
            label: "Chess",
            title: "New chess information detected",
            summary:
                "This demo card represents the type of information that News Tracker will eventually collect automatically.",
            source: "Demo Source",
            time: "Today"
        }
    ]

};


/* =========================================
   STATE
========================================= */

let trackers =
    JSON.parse(localStorage.getItem("newsTrackerTopics")) || [
        "Minecraft",
        "Space"
    ];

let selectedTopic =
    localStorage.getItem("newsTrackerSelected") || trackers[0] || null;

let currentTheme =
    localStorage.getItem("newsTrackerTheme") || "blue";


/* =========================================
   ELEMENTS
========================================= */

const topicInput =
    document.getElementById("topicInput");

const addTopicButton =
    document.getElementById("addTopicButton");

const trackerList =
    document.getElementById("trackerList");

const trackerCount =
    document.getElementById("trackerCount");

const newsList =
    document.getElementById("newsList");

const selectedTopicLabel =
    document.getElementById("selectedTopicLabel");

const refreshButton =
    document.getElementById("refreshButton");

const currentDate =
    document.getElementById("currentDate");

const currentTime =
    document.getElementById("currentTime");

const settingsButton =
    document.getElementById("settingsButton");

const settingsOverlay =
    document.getElementById("settingsOverlay");

const closeSettings =
    document.getElementById("closeSettings");

const clearDataButton =
    document.getElementById("clearDataButton");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* =========================================
   CLOCK
========================================= */

function updateClock() {

    const now = new Date();

    currentDate.textContent =
        now.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });

    currentTime.textContent =
        now.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit"
        });
}

updateClock();

setInterval(updateClock, 1000);


/* =========================================
   SAVE STATE
========================================= */

function saveState() {

    localStorage.setItem(
        "newsTrackerTopics",
        JSON.stringify(trackers)
    );

    if (selectedTopic) {

        localStorage.setItem(
            "newsTrackerSelected",
            selectedTopic
        );

    } else {

        localStorage.removeItem(
            "newsTrackerSelected"
        );
    }
}


/* =========================================
   RENDER TRACKERS
========================================= */

function renderTrackers() {

    trackerList.innerHTML = "";

    trackerCount.textContent =
        `${trackers.length} ${
            trackers.length === 1
                ? "topic"
                : "topics"
        }`;

    if (trackers.length === 0) {

        trackerList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">＋</div>
                <h3>No trackers yet</h3>
                <p>
                    Add a topic above to start tracking it.
                </p>
            </div>
        `;

        renderNews();

        return;
    }


    trackers.forEach(topic => {

        const card =
            document.createElement("div");

        card.className =
            "tracker-card" +
            (topic === selectedTopic
                ? " selected"
                : "");

        card.innerHTML = `
            <div class="tracker-top">

                <div class="tracker-name">

                    <span class="status-dot"></span>

                    <span>
                        ${escapeHTML(topic)}
                    </span>

                </div>

                <button
                    class="delete-topic"
                    aria-label="Delete ${escapeHTML(topic)}"
                >
                    ×
                </button>

            </div>

            <div class="tracker-meta">
                Tracking topic • Demo mode
            </div>
        `;


        card.addEventListener("click", event => {

            if (
                event.target.classList.contains(
                    "delete-topic"
                )
            ) {
                return;
            }

            selectedTopic = topic;

            saveState();

            renderTrackers();
            renderNews();

        });


        card
            .querySelector(".delete-topic")
            .addEventListener("click", event => {

                event.stopPropagation();

                deleteTracker(topic);

            });


        trackerList.appendChild(card);

    });

}


/* =========================================
   RENDER NEWS
========================================= */

function renderNews() {

    newsList.innerHTML = "";

    if (!selectedTopic) {

        selectedTopicLabel.textContent =
            "Select a tracker";

        newsList.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">📰</div>

                <h3>No tracker selected</h3>

                <p>
                    Add a topic above and select it
                    to view tracked information.
                </p>

            </div>
        `;

        return;
    }


    selectedTopicLabel.textContent =
        selectedTopic;


    const articles =
        demoNews[selectedTopic] || [
            {
                label: "Demo",
                title:
                    `Waiting for news about ${selectedTopic}`,
                summary:
                    "This topic has been added successfully. The AI news system will eventually search for real information and display it here.",
                source:
                    "News Tracker",
                time:
                    "Just now"
            }
        ];


    articles.forEach(article => {

        const card =
            document.createElement("article");

        card.className =
            "news-card";

        card.innerHTML = `
            <span class="news-label">
                ${escapeHTML(article.label)}
            </span>

            <h3>
                ${escapeHTML(article.title)}
            </h3>

            <p class="news-summary">
                ${escapeHTML(article.summary)}
            </p>

            <div class="news-footer">

                <span>
                    ${escapeHTML(article.source)}
                </span>

                <span>•</span>

                <span>
                    ${escapeHTML(article.time)}
                </span>

            </div>
        `;

        newsList.appendChild(card);

    });

}


/* =========================================
   ADD TRACKER
========================================= */

function addTracker() {

    const topic =
        topicInput.value.trim();

    if (!topic) {

        showToast(
            "Enter a topic first."
        );

        return;
    }


    const existing =
        trackers.find(
            item =>
                item.toLowerCase() ===
                topic.toLowerCase()
        );


    if (existing) {

        selectedTopic = existing;

        saveState();

        renderTrackers();
        renderNews();

        topicInput.value = "";

        showToast(
            "That tracker already exists."
        );

        return;
    }


    trackers.push(topic);

    selectedTopic = topic;

    saveState();

    topicInput.value = "";

    renderTrackers();
    renderNews();

    showToast(
        `Tracking "${topic}"`
    );
}


addTopicButton.addEventListener(
    "click",
    addTracker
);


topicInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            addTracker();
        }

    }
);


/* =========================================
   DELETE TRACKER
========================================= */

function deleteTracker(topic) {

    trackers =
        trackers.filter(
            item => item !== topic
        );


    if (selectedTopic === topic) {

        selectedTopic =
            trackers[0] || null;

    }


    saveState();

    renderTrackers();
    renderNews();

    showToast(
        `"${topic}" removed`
    );
}


/* =========================================
   REFRESH
========================================= */

refreshButton.addEventListener(
    "click",
    () => {

        renderTrackers();
        renderNews();

        showToast(
            "Tracker refreshed."
        );

    }
);


/* =========================================
   SETTINGS
========================================= */

settingsButton.addEventListener(
    "click",
    () => {

        settingsOverlay.classList.add(
            "open"
        );

    }
);


closeSettings.addEventListener(
    "click",
    () => {

        settingsOverlay.classList.remove(
            "open"
        );

    }
);


settingsOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            settingsOverlay
        ) {

            settingsOverlay.classList.remove(
                "open"
            );

        }

    }
);


/* =========================================
   THEMES
========================================= */

function applyTheme(theme) {

    currentTheme = theme;

    document.body.classList.toggle(
        "sunset",
        theme === "sunset"
    );


    localStorage.setItem(
        "newsTrackerTheme",
        theme
    );


    document
        .querySelectorAll(".theme-option")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.theme === theme
            );

        });
}


document
    .querySelectorAll(".theme-option")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                applyTheme(
                    button.dataset.theme
                );

            }
        );

    });


applyTheme(currentTheme);


/* =========================================
   CLEAR DATA
========================================= */

clearDataButton.addEventListener(
    "click",
    () => {

        const confirmed =
            confirm(
                "Clear all saved trackers?"
            );

        if (!confirmed) {
            return;
        }


        trackers = [];

        selectedTopic = null;

        saveState();

        renderTrackers();
        renderNews();

        showToast(
            "Saved trackers cleared."
        );

    }
);


/* =========================================
   TOAST
========================================= */

let toastTimeout;

function showToast(message) {

    toastMessage.textContent =
        message;

    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2500);
}


/* =========================================
   SECURITY
========================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================
   SERVICE WORKER
========================================= */

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register("service-worker.js")
                .catch(error => {

                    console.error(
                        "Service worker registration failed:",
                        error
                    );

                });

        }
    );
}


/* =========================================
   INITIAL RENDER
========================================= */

renderTrackers();
renderNews();
