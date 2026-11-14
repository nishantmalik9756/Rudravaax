
document.addEventListener("DOMContentLoaded", () => {

    const audio = document.getElementById("audioPlayer");

    const singlesContainer = document.getElementById("singlesContainer");
    const epsContainer = document.getElementById("epsContainer");
    const albumsContainer = document.getElementById("albumsContainer");

    const albumSection = document.getElementById("albumSection");
    const albumDetails = document.getElementById("albumDetails");
    const albumTracks = document.getElementById("albumTracks");
    const closeAlbum = document.getElementById("closeAlbum");

    const searchInput = document.getElementById("songSearch");
    const searchResultsSection = document.getElementById("searchResultsSection");
    const searchResults = document.getElementById("searchResults");

    const currentCover = document.getElementById("currentCover");
    const currentTitle = document.getElementById("currentTitle");
    const currentArtist = document.getElementById("currentArtist");

    const playPauseBtn = document.getElementById("playPauseBtn");
    const previousBtn = document.getElementById("previousBtn");
    const nextBtn = document.getElementById("nextBtn");
    const shuffleBtn = document.getElementById("shuffleBtn");
    const repeatBtn = document.getElementById("repeatBtn");

    const currentTime = document.getElementById("currentTime");
    const duration = document.getElementById("duration");
    const progressBar = document.getElementById("progressBar");
    const volumeBar = document.getElementById("volumeBar");

    let playlist = [];
    let currentIndex = 0;
    let isShuffle = false;
    let isRepeat = false;
    let isPlaying = false;

    // MAIN PAGE SECTIONS
    const mainSections = [
        singlesContainer?.closest("section"),
        epsContainer?.closest("section"),
        albumsContainer?.closest("section"),
        searchResultsSection
    ].filter(Boolean);

    const header = document.querySelector(".player-header");

    // --------------------------------
    // SHOW MAIN LIBRARY
    // --------------------------------

    function showLibrary() {
        albumSection.hidden = true;

        mainSections.forEach(section => {
            section.hidden = false;
        });

        if (header) header.hidden = false;
    }

    // --------------------------------
    // OPEN SEPARATE EP / ALBUM PAGE
    // --------------------------------

    function openAlbum(item) {

        mainSections.forEach(section => {
            section.hidden = true;
        });

        if (header) header.hidden = true;

        albumSection.hidden = false;

        albumDetails.innerHTML = `
            <div class="album-info">
                <img src="${item.cover || "images/logo.jpeg"}" alt="${item.title}">
                <div>
                    <h2>${item.title}</h2>
                    <p>${item.artist || "Rudravaax"}</p>
                    <span>${item.type}</span>
                </div>
            </div>
        `;

        albumTracks.innerHTML = "";

        (item.tracks || []).forEach((track, index) => {

            const trackCard = document.createElement("div");
            trackCard.className = "track-card";

            trackCard.innerHTML = `
                <img src="${track.cover || item.cover || "images/logo.jpeg"}"
                     alt="${track.title}">

                <div class="track-info">
                    <h4>${track.title}</h4>
                    <p>${track.artist || item.artist || "Rudravaax"}</p>
                </div>

                <button class="track-play-btn" type="button">
                    ▶
                </button>
            `;

            trackCard.querySelector("button").addEventListener("click", () => {

                playlist = item.tracks.map(song => ({
                    ...song,
                    artist: song.artist || item.artist || "Rudravaax",
                    cover: song.cover || item.cover || "images/logo.jpeg"
                }));

                playSong(index);
            });

            trackCard.addEventListener("dblclick", () => {

                playlist = item.tracks.map(song => ({
                    ...song,
                    artist: song.artist || item.artist || "Rudravaax",
                    cover: song.cover || item.cover || "images/logo.jpeg"
                }));

                playSong(index);
            });

            albumTracks.appendChild(trackCard);

        });

        window.scrollTo(0, 0);
    }

    // --------------------------------
    // BACK BUTTON
    // --------------------------------

    closeAlbum.addEventListener("click", () => {
        showLibrary();
        window.scrollTo(0, 0);
    });

    // --------------------------------
    // CREATE MUSIC CARD
    // --------------------------------

    function createCard(item) {

        const card = document.createElement("div");
        card.className = "music-card";

        card.innerHTML = `
            <img src="${item.cover || "images/logo.jpeg"}"
                 alt="${item.title}">

            <div class="music-card-info">
                <h3>${item.title}</h3>
                <p>${item.artist || "Rudravaax"}</p>
                <span>${item.type}</span>
            </div>
        `;

        card.addEventListener("click", () => {

            if (item.type === "Single") {

                playlist = [{
                    ...item,
                    artist: item.artist || "Rudravaax"
                }];

                playSong(0);

            } else {

                openAlbum(item);

            }

        });

        return card;
    }

    // --------------------------------
    // DISPLAY MUSIC LIBRARY
    // --------------------------------

    function displayLibrary() {

        singlesContainer.innerHTML = "";
        epsContainer.innerHTML = "";
        albumsContainer.innerHTML = "";

        musicLibrary.forEach(item => {

            const card = createCard(item);

            if (item.type === "Single") {
                singlesContainer.appendChild(card);
            }

            else if (item.type === "EP") {
                epsContainer.appendChild(card);
            }

            else if (item.type === "Album") {
                albumsContainer.appendChild(card);
            }

        });

    }

    // --------------------------------
    // PLAY SONG
    // --------------------------------

    function playSong(index) {

        if (!playlist.length) return;

        currentIndex = index;

        const song = playlist[currentIndex];

        audio.src = song.audio;

        currentTitle.textContent = song.title;
        currentArtist.textContent = song.artist || "Rudravaax";
        currentCover.src = song.cover || "images/logo.jpeg";

        audio.play().then(() => {
            isPlaying = true;
            updatePlayButton();
        }).catch(error => {
            console.error("Audio playback error:", error);
            isPlaying = false;
            updatePlayButton();
        });

    }

    // --------------------------------
    // PLAY / PAUSE
    // --------------------------------

    function togglePlay() {

        if (!audio.src) {
            if (playlist.length) {
                playSong(currentIndex);
            }
            return;
        }

        if (audio.paused) {

            audio.play().then(() => {
                isPlaying = true;
                updatePlayButton();
            }).catch(console.error);

        } else {

            audio.pause();
            isPlaying = false;
            updatePlayButton();

        }

    }

    function updatePlayButton() {
        playPauseBtn.textContent = isPlaying ? "❚❚" : "▶";
    }

    playPauseBtn.addEventListener("click", togglePlay);

    audio.addEventListener("play", () => {
        isPlaying = true;
        updatePlayButton();
    });

    audio.addEventListener("pause", () => {
        isPlaying = false;
        updatePlayButton();
    });

    // --------------------------------
    // NEXT SONG
    // --------------------------------

    function nextSong() {

        if (!playlist.length) return;

        if (isShuffle && playlist.length > 1) {

            let randomIndex;

            do {
                randomIndex = Math.floor(Math.random() * playlist.length);
            } while (randomIndex === currentIndex);

            playSong(randomIndex);

        } else if (currentIndex < playlist.length - 1) {

            playSong(currentIndex + 1);

        } else if (isRepeat) {

            playSong(0);

        } else {

            audio.pause();
            audio.currentTime = 0;
            isPlaying = false;
            updatePlayButton();

        }

    }

    nextBtn.addEventListener("click", nextSong);

    // --------------------------------
    // PREVIOUS SONG
    // --------------------------------

    function previousSong() {

        if (!playlist.length) return;

        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }

        if (currentIndex > 0) {
            playSong(currentIndex - 1);
        } else if (isRepeat) {
            playSong(playlist.length - 1);
        } else {
            audio.currentTime = 0;
        }

    }

    previousBtn.addEventListener("click", previousSong);

    // --------------------------------
    // SHUFFLE
    // --------------------------------

    shuffleBtn.addEventListener("click", () => {

        isShuffle = !isShuffle;

        shuffleBtn.classList.toggle("active", isShuffle);

    });

    // --------------------------------
    // REPEAT
    // --------------------------------

    repeatBtn.addEventListener("click", () => {

        isRepeat = !isRepeat;

        repeatBtn.classList.toggle("active", isRepeat);

    });

    // --------------------------------
    // SONG ENDED
    // --------------------------------

    audio.addEventListener("ended", () => {

        if (isRepeat && playlist.length === 1) {
            playSong(0);
        } else {
            nextSong();
        }

    });

    // --------------------------------
    // FORMAT TIME
    // --------------------------------

    function formatTime(seconds) {

        if (!Number.isFinite(seconds)) return "0:00";

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;

    }

    // --------------------------------
    // AUDIO DURATION
    // --------------------------------

    audio.addEventListener("loadedmetadata", () => {
        duration.textContent = formatTime(audio.duration);
    });

    // --------------------------------
    // PROGRESS BAR
    // --------------------------------

    audio.addEventListener("timeupdate", () => {

        currentTime.textContent = formatTime(audio.currentTime);

        if (audio.duration) {
            progressBar.value = (audio.currentTime / audio.duration) * 100;
        }

    });

    progressBar.addEventListener("input", () => {

        if (audio.duration) {
            audio.currentTime = (progressBar.value / 100) * audio.duration;
        }

    });

    // --------------------------------
    // VOLUME
    // --------------------------------

    volumeBar.addEventListener("input", () => {
        audio.volume = volumeBar.value / 5;
    });

    audio.volume = volumeBar.value / 2;
    

    // --------------------------------
    // SEARCH
    // --------------------------------

    searchInput.addEventListener("input", () => {

        const query = searchInput.value.toLowerCase().trim();

        searchResults.innerHTML = "";

        if (!query) {

            searchResultsSection.hidden = true;

            if (albumSection.hidden === false) {
                return;
            }

            mainSections.forEach(section => {
                section.hidden = false;
            });

            return;
        }

        showLibrary();

        mainSections.forEach(section => {
            section.hidden = true;
        });

        searchResultsSection.hidden = false;

        const results = musicLibrary.filter(item => {

            const titleMatch = item.title.toLowerCase().includes(query);
            const artistMatch = (item.artist || "").toLowerCase().includes(query);

            const trackMatch = (item.tracks || []).some(track =>
                track.title.toLowerCase().includes(query)
            );

            return titleMatch || artistMatch || trackMatch;

        });

        if (!results.length) {

            searchResults.innerHTML = "<p>No songs found.</p>";
            return;

        }

        results.forEach(item => {
            searchResults.appendChild(createCard(item));
        });

    });

    // --------------------------------
    // INITIALIZE
    // --------------------------------

    displayLibrary();

});
