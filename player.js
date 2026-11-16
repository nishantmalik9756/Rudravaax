
document.addEventListener("DOMContentLoaded", () => {

    // ==================================
    // AUDIO ELEMENTS
    // ==================================

    const audio = document.getElementById("audioPlayer");

    const singlesContainer = document.getElementById("singlesContainer");
    const epsContainer = document.getElementById("epsContainer");
    const albumsContainer = document.getElementById("albumsContainer");

    const artistsContainer = document.getElementById("artistsContainer");

    const albumSection = document.getElementById("albumSection");
    const albumDetails = document.getElementById("albumDetails");
    const albumTracks = document.getElementById("albumTracks");
    const closeAlbum = document.getElementById("closeAlbum");

    const artistSection = document.getElementById("artistSection");
    const artistDetails = document.getElementById("artistDetails");
    const artistTracks = document.getElementById("artistTracks");
    const closeArtist = document.getElementById("closeArtist");

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


    // ==================================
    // PLAYER VARIABLES
    // ==================================

    let playlist = [];
    let currentIndex = 0;
    let isShuffle = false;
    let isRepeat = false;
    let isPlaying = false;


    // ==================================
    // VERIFIED BADGE
    // ==================================

   function verifiedName(name) {

    const verifiedArtists = ["rudravaax", "archak"];

    const isVerified = verifiedArtists.includes(
        name?.trim().toLowerCase()
    );

    if (!isVerified) {
        return name;
    }

    return `
        ${name}
        <span class="verified-badge"
              title="Verified Artist"
              aria-label="Verified Artist">✓</span>
    `;
}


    // ==================================
    // MAIN PAGE SECTIONS
    // ==================================

    const mainSections = [
        singlesContainer?.closest("section"),
        epsContainer?.closest("section"),
        albumsContainer?.closest("section"),
        artistsContainer?.closest("section"),
        searchResultsSection
    ].filter(Boolean);

    const header = document.querySelector(".player-header");


    // ==================================
    // SHOW MAIN LIBRARY
    // ==================================

    function showLibrary() {

        albumSection.hidden = true;

        if (artistSection) {
            artistSection.hidden = true;
        }

        mainSections.forEach(section => {
            section.hidden = false;
        });

        if (header) {
            header.hidden = false;
        }

    }


    // ==================================
    // HIDE MAIN LIBRARY
    // ==================================

    function hideLibrary() {

        mainSections.forEach(section => {
            section.hidden = true;
        });

        if (header) {
            header.hidden = true;
        }

    }


    // ==================================
    // OPEN ALBUM / EP
    // ==================================

    function openAlbum(item) {

        hideLibrary();

        if (artistSection) {
            artistSection.hidden = true;
        }

        albumSection.hidden = false;

        albumDetails.innerHTML = `

            <div class="album-info">

                <img
                    src="${item.cover || "images/logo.jpeg"}"
                    alt="${item.title}"
                >

                <div>

                    <h2>${item.title}</h2>

                    <p>${item.artist || "Rudravaax"}</p>

                    <span>${item.type}</span>

                </div>

            </div>

        `;

        albumTracks.innerHTML = "";

        const tracks = item.tracks || [];

        tracks.forEach((track, index) => {

            const trackCard = document.createElement("div");

            trackCard.className = "track-card";

            trackCard.innerHTML = `

                <img
                    src="${track.cover || item.cover || "images/logo.jpeg"}"
                    alt="${track.title}"
                >

                <div class="track-info">

                    <h4>${track.title}</h4>

                    <p>${track.artist || item.artist || "Rudravaax"}</p>

                </div>

                <button class="track-play-btn" type="button">
                    ▶
                </button>

            `;

            function playAlbumTrack() {

                playlist = tracks.map(song => ({
                    ...song,
                    artist: song.artist || item.artist || "Rudravaax",
                    cover: song.cover || item.cover || "images/logo.jpeg"
                }));

                playSong(index);

            }

            trackCard.querySelector("button")
                .addEventListener("click", playAlbumTrack);

            trackCard.addEventListener("dblclick", playAlbumTrack);

            albumTracks.appendChild(trackCard);

        });

        window.scrollTo(0, 0);

    }


    // ==================================
    // CLOSE ALBUM
    // ==================================

    closeAlbum.addEventListener("click", () => {

        showLibrary();

        window.scrollTo(0, 0);

    });


    // ==================================
    // ARTIST PROFILE
    // ==================================

    function openArtist(artist) {

        hideLibrary();

        albumSection.hidden = true;
        artistSection.hidden = false;

        artistDetails.innerHTML = `

            <div class="album-info artist-info">

                <img
                    src="${artist.image || "images/logo.jpeg"}"
                    alt="${artist.name}"
                >

                <div>

                    <h2>${verifiedName(artist.name)}</h2>

                    <p>${artist.bio || "Music Artist"}</p>

                    <span>
                        ${artist.songs.length} Songs
                    </span>

                </div>

            </div>

        `;

        artistTracks.innerHTML = "";

        if (!artist.songs.length) {

            artistTracks.innerHTML = `
                <p>No songs available yet.</p>
            `;

            return;

        }

        artist.songs.forEach((song, index) => {

            const trackCard = document.createElement("div");

            trackCard.className = "track-card";

            trackCard.innerHTML = `

                <img
                    src="${song.cover || "images/logo.jpeg"}"
                    alt="${song.title}"
                >

                <div class="track-info">

                    <h4>${song.title}</h4>

                    <p>${song.artist || artist.name}</p>

                    <small>
                        ${song.collection || song.type || "Single"}
                    </small>

                </div>

                <button class="track-play-btn" type="button">
                    ▶
                </button>

            `;

            function playArtistTrack() {

                playlist = artist.songs.map(item => ({
                    ...item
                }));

                playSong(index);

            }

            trackCard.querySelector("button")
                .addEventListener("click", playArtistTrack);

            trackCard.addEventListener("dblclick", playArtistTrack);

            artistTracks.appendChild(trackCard);

        });

        window.scrollTo(0, 0);

    }


    // ==================================
    // CLOSE ARTIST PROFILE
    // ==================================

    closeArtist?.addEventListener("click", () => {

        showLibrary();

        window.scrollTo(0, 0);

    });


    // ==================================
    // CREATE ARTIST CARD
    // ==================================

    function createArtistCard(artist) {

        const card = document.createElement("div");

        card.className = "music-card artist-card";

        card.innerHTML = `

            <img
                src="${artist.image || "images/logo.jpeg"}"
                alt="${artist.name}"
                loading="lazy"
            >

            <div class="music-card-info">

                <h3>${verifiedName(artist.name)}</h3>

                <p>Artist</p>

                <span>
                    ${artist.songs.length} Songs
                </span>

            </div>

        `;

        card.addEventListener("click", () => {

            openArtist(artist);

        });

        return card;

    }


    // ==================================
    // DISPLAY ARTISTS
    // ==================================

    function displayArtists() {

        if (!artistsContainer) return;

        artistsContainer.innerHTML = "";

        if (typeof rudraVXArtists === "undefined") {

            artistsContainer.innerHTML = `
                <p>Artist library not available.</p>
            `;

            return;

        }

        rudraVXArtists.forEach(artist => {

            artistsContainer.appendChild(
                createArtistCard(artist)
            );

        });

    }


    // ==================================
    // CREATE MUSIC CARD
    // ==================================

    function createCard(item) {

        const card = document.createElement("div");

        card.className = "music-card";

        card.innerHTML = `

            <img
                src="${item.cover || "images/logo.jpeg"}"
                alt="${item.title}"
                loading="lazy"
            >

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


    // ==================================
    // DISPLAY MUSIC LIBRARY
    // ==================================

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

        displayArtists();

    }


    // ==================================
    // PLAY SONG
    // ==================================

    function playSong(index) {

        if (!playlist.length) return;

        currentIndex = index;

        const song = playlist[currentIndex];

        audio.src = song.audio;

        currentTitle.textContent = song.title;

        currentArtist.textContent =
            song.artist || "Rudravaax";

        currentCover.src =
            song.cover || "images/logo.jpeg";

        audio.play().then(() => {

            isPlaying = true;
            updatePlayButton();

        }).catch(error => {

            console.error("Audio playback error:", error);

            isPlaying = false;
            updatePlayButton();

        });

    }


    // ==================================
    // PLAY / PAUSE
    // ==================================

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

        playPauseBtn.textContent =
            isPlaying ? "❚❚" : "▶";

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


    // ==================================
    // NEXT SONG
    // ==================================

    function nextSong() {

        if (!playlist.length) return;

        if (isShuffle && playlist.length > 1) {

            let randomIndex;

            do {

                randomIndex = Math.floor(
                    Math.random() * playlist.length
                );

            } while (randomIndex === currentIndex);

            playSong(randomIndex);

        }

        else if (currentIndex < playlist.length - 1) {

            playSong(currentIndex + 1);

        }

        else if (isRepeat) {

            playSong(0);

        }

        else {

            audio.pause();
            audio.currentTime = 0;

            isPlaying = false;

            updatePlayButton();

        }

    }


    nextBtn.addEventListener("click", nextSong);


    // ==================================
    // PREVIOUS SONG
    // ==================================

    function previousSong() {

        if (!playlist.length) return;

        if (audio.currentTime > 3) {

            audio.currentTime = 0;

            return;

        }

        if (currentIndex > 0) {

            playSong(currentIndex - 1);

        }

        else if (isRepeat) {

            playSong(playlist.length - 1);

        }

        else {

            audio.currentTime = 0;

        }

    }


    previousBtn.addEventListener("click", previousSong);


    // ==================================
    // SHUFFLE
    // ==================================

    shuffleBtn.addEventListener("click", () => {

        isShuffle = !isShuffle;

        shuffleBtn.classList.toggle("active", isShuffle);

    });


    // ==================================
    // REPEAT
    // ==================================

    repeatBtn.addEventListener("click", () => {

        isRepeat = !isRepeat;

        repeatBtn.classList.toggle("active", isRepeat);

    });


    // ==================================
    // SONG ENDED
    // ==================================

    audio.addEventListener("ended", () => {

        if (isRepeat && playlist.length === 1) {

            playSong(0);

        } else {

            nextSong();

        }

    });


    // ==================================
    // FORMAT TIME
    // ==================================

    function formatTime(seconds) {

        if (!Number.isFinite(seconds)) return "0:00";

        const minutes = Math.floor(seconds / 60);

        const remainingSeconds = Math.floor(seconds % 60);

        return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;

    }


    // ==================================
    // AUDIO DURATION
    // ==================================

    audio.addEventListener("loadedmetadata", () => {

        duration.textContent = formatTime(audio.duration);

    });


    // ==================================
    // PROGRESS BAR
    // ==================================

    audio.addEventListener("timeupdate", () => {

        currentTime.textContent =
            formatTime(audio.currentTime);

        if (audio.duration) {

            progressBar.value =
                (audio.currentTime / audio.duration) * 100;

        }

    });


    progressBar.addEventListener("input", () => {

        if (audio.duration) {

            audio.currentTime =
                (progressBar.value / 100) * audio.duration;

        }

    });


    // ==================================
    // VOLUME
    // ==================================

    volumeBar.addEventListener("input", () => {

        audio.volume = Number(volumeBar.value);

    });

    audio.volume = Number(volumeBar.value);


    // ==================================
    // SEARCH
    // ==================================

    searchInput.addEventListener("input", () => {

        const query = searchInput.value.toLowerCase().trim();

        searchResults.innerHTML = "";

        if (!query) {

            searchResultsSection.hidden = true;

            if (!albumSection.hidden || (artistSection && !artistSection.hidden)) {
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

            const titleMatch =
                item.title.toLowerCase().includes(query);

            const artistMatch =
                (item.artist || "").toLowerCase().includes(query);

            const trackMatch = (item.tracks || []).some(track =>

                track.title.toLowerCase().includes(query) ||
                (track.artist || "").toLowerCase().includes(query)

            );

            return titleMatch || artistMatch || trackMatch;

        });


        // SEARCH ARTISTS

        const matchingArtists =
            typeof rudraVXArtists !== "undefined"
                ? rudraVXArtists.filter(artist =>
                    artist.name.toLowerCase().includes(query)
                )
                : [];


        matchingArtists.forEach(artist => {

            searchResults.appendChild(
                createArtistCard(artist)
            );

        });


        results.forEach(item => {

            searchResults.appendChild(
                createCard(item)
            );

        });


        if (!results.length && !matchingArtists.length) {

            searchResults.innerHTML =
                "<p>No songs or artists found.</p>";

        }

    });


    // ==================================
    // INITIALIZE
    // ==================================

    displayLibrary();

});


// ==========================================
// ECOSYSTEM POPUP
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const popup = document.getElementById("ecosystemPopup");

    const closeBtn = document.getElementById("closePopup");

    const gotItBtn = document.getElementById("gotItBtn");

    if (!popup) return;

    setTimeout(() => {

        popup.classList.add("show");

    }, 500);


    function closeEcosystemPopup() {

        popup.classList.remove("show");

    }


    closeBtn?.addEventListener("click", closeEcosystemPopup);

    gotItBtn?.addEventListener("click", closeEcosystemPopup);


    popup.addEventListener("click", event => {

        if (event.target === popup) {

            closeEcosystemPopup();

        }

    });

});
