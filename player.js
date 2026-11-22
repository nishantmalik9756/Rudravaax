document.addEventListener("DOMContentLoaded", () => {
    // Elements
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

    // Stop if the core player markup is missing.
    if (!audio || !playPauseBtn) {
        console.error("Player elements were not found on this page.");
        return;
    }

    // Playback state
    let playlist = [];
    let currentIndex = 0;
    let isShuffle = true;
    let isRepeat = false;
    let isPlaying = false;
    let autoPlayLibrary = true;

    // Ignore blank audio paths and obvious placeholder tracks.
    function isPlayable(song) {
        if (!song?.audio || !song?.title) return false;

        const path = song.audio.trim();
        const title = song.title.trim();

        return (
            path !== "" &&
            !/\/\.mp3$/i.test(path) &&
            !/\\\.mp3$/i.test(path) &&
            !/coming\s*soon/i.test(title) &&
            !/^[-–—]+$/.test(title)
        );
    }

    function normalizeSong(song, defaults = {}) {
        return {
            ...song,
            artist: song.artist || defaults.artist || "Rudravaax",
            cover: song.cover || defaults.cover || "images/logo.jpeg",
            collection: song.collection || defaults.collection || song.title,
            type: song.type || defaults.type || "Single"
        };
    }

    function getLibrarySongs() {
        if (typeof musicLibrary === "undefined") return [];

        return musicLibrary.flatMap(item => {
            if (item.type === "Single") {
                return isPlayable(item)
                    ? [normalizeSong(item, {
                        artist: item.artist || "Rudravaax",
                        cover: item.cover,
                        collection: item.title,
                        type: "Single"
                    })]
                    : [];
            }

            if (item.type === "EP" || item.type === "Album") {
                return (item.tracks || [])
                    .filter(isPlayable)
                    .map(track => normalizeSong(track, {
                        artist: item.artist || "Rudravaax",
                        cover: item.cover,
                        collection: item.title,
                        type: item.type
                    }));
            }

            return [];
        });
    }

    function shuffleSongs(songs) {
        const result = [...songs];

        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }

        return result;
    }

    function startLibraryMix(firstSongs = []) {
        const allSongs = getLibrarySongs();
        const first = firstSongs.filter(isPlayable).map(song => normalizeSong(song));
        const firstAudioPaths = new Set(first.map(song => song.audio));

        const randomRemainder = shuffleSongs(
            allSongs.filter(song => !firstAudioPaths.has(song.audio))
        );

        playlist = [...first, ...randomRemainder];
        currentIndex = 0;
        autoPlayLibrary = true;

        if (playlist.length) {
            playSong(0);
        } else {
            console.warn("No playable songs were found in the music library.");
        }
    }

    function formatTime(seconds) {
        if (!Number.isFinite(seconds)) return "0:00";

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
    }

    function updatePlayButton() {
        playPauseBtn.textContent = isPlaying ? "❚❚" : "▶";
        playPauseBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
    }

    function playSong(index) {
        if (!playlist.length) return;

        currentIndex = Math.max(0, Math.min(index, playlist.length - 1));
        const song = playlist[currentIndex];

        if (!isPlayable(song)) {
            nextSong();
            return;
        }

        audio.src = song.audio;
        audio.load();

        if (currentTitle) currentTitle.textContent = song.title;
        if (currentArtist) currentArtist.textContent = song.artist || "Rudravaax";
        if (currentCover) currentCover.src = song.cover || "images/logo.jpeg";
        if (currentTime) currentTime.textContent = "0:00";
        if (duration) duration.textContent = "0:00";
        if (progressBar) progressBar.value = 0;

        audio.play()
            .then(() => {
                isPlaying = true;
                updatePlayButton();
            })
            .catch(error => {
                console.error("Audio playback error:", error);
                isPlaying = false;
                updatePlayButton();
            });
    }

    function playWholeAlbum(item, startAtAudio = null) {
        const albumSongs = (item.tracks || [])
            .filter(isPlayable)
            .map(track => normalizeSong(track, {
                artist: item.artist || "Rudravaax",
                cover: item.cover,
                collection: item.title,
                type: item.type
            }));

        if (!albumSongs.length) {
            console.warn(`No playable tracks found for "${item.title}".`);
            return;
        }

        if (!startAtAudio) {
            startLibraryMix(albumSongs);
            return;
        }

        const clickedIndex = albumSongs.findIndex(song => song.audio === startAtAudio);
        const selectedAlbumTracks = clickedIndex >= 0
            ? albumSongs.slice(clickedIndex)
            : albumSongs;

        startLibraryMix(selectedAlbumTracks);
    }

    // Artist verification badge
    function verifiedName(name) {
        const verifiedArtists = ["rudravaax", "archak", "na-samajh", "anrx-beats"];
        const isVerified = verifiedArtists.includes(
            name?.trim().toLowerCase()
        );

        if (!isVerified) return name || "";

        return `
            ${name}
            <span class="verified-badge"
                  title="Verified Artist"
                  aria-label="Verified Artist">✓</span>
        `;
    }

    // Main page sections
    const mainSections = [
        singlesContainer?.closest("section"),
        epsContainer?.closest("section"),
        albumsContainer?.closest("section"),
        artistsContainer?.closest("section"),
        searchResultsSection
    ].filter(Boolean);

    const header = document.querySelector(".player-header");

    function showLibrary() {
        if (albumSection) albumSection.hidden = true;
        if (artistSection) artistSection.hidden = true;

        mainSections.forEach(section => {
            section.hidden = false;
        });

        if (header) header.hidden = false;
    }

    function hideLibrary() {
        mainSections.forEach(section => {
            section.hidden = true;
        });

        if (header) header.hidden = true;
    }

    // Album and EP detail page
    function openAlbum(item) {
        if (!albumSection || !albumDetails || !albumTracks) return;

        hideLibrary();
        if (artistSection) artistSection.hidden = true;
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
                    <button id="playAlbumBtn" type="button">
                        ▶ Play ${item.type}
                    </button>
                </div>
            </div>
        `;

        document.getElementById("playAlbumBtn")
            ?.addEventListener("click", () => playWholeAlbum(item));

        albumTracks.innerHTML = "";

        (item.tracks || []).forEach(track => {
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
                <button class="track-play-btn" type="button" aria-label="Play ${track.title}">
                    ▶
                </button>
            `;

            const playThisTrack = () => {
                if (!isPlayable(track)) return;

                playWholeAlbum(item, track.audio);
            };

            trackCard.querySelector("button")
                .addEventListener("click", playThisTrack);

            trackCard.addEventListener("dblclick", playThisTrack);
            albumTracks.appendChild(trackCard);
        });

        window.scrollTo(0, 0);
    }

    closeAlbum?.addEventListener("click", () => {
        showLibrary();
        window.scrollTo(0, 0);
    });

    // Artist profile
    function openArtist(artist) {
        if (!artistSection || !artistDetails || !artistTracks) return;

        hideLibrary();
        if (albumSection) albumSection.hidden = true;
        artistSection.hidden = false;

        artistDetails.innerHTML = `
            <div class="album-info artist-info">
                <img src="${artist.image || "images/logo.jpeg"}" alt="${artist.name}">
                <div>
                    <h2>${verifiedName(artist.name)}</h2>
                    <p>${artist.bio || "Music Artist"}</p>
                    <span>${artist.songs.length} Songs</span>
                </div>
            </div>
        `;

        artistTracks.innerHTML = "";

        if (!artist.songs.length) {
            artistTracks.innerHTML = "<p>No songs available yet.</p>";
            window.scrollTo(0, 0);
            return;
        }

        artist.songs.forEach((song, index) => {
            const trackCard = document.createElement("div");
            trackCard.className = "track-card";

            trackCard.innerHTML = `
                <img src="${song.cover || "images/logo.jpeg"}" alt="${song.title}">
                <div class="track-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist || artist.name}</p>
                    <small>${song.collection || song.type || "Single"}</small>
                </div>
                <button class="track-play-btn" type="button" aria-label="Play ${song.title}">
                    ▶
                </button>
            `;

            const playArtistSong = () => {
                if (!isPlayable(song)) return;

                const artistSongs = artist.songs
                    .filter(isPlayable)
                    .map(item => normalizeSong(item));

                const selected = artistSongs.find(
                    item => item.audio === song.audio
                );

                startLibraryMix(selected ? [selected] : []);
            };

            trackCard.querySelector("button")
                .addEventListener("click", playArtistSong);

            trackCard.addEventListener("dblclick", playArtistSong);
            artistTracks.appendChild(trackCard);
        });

        window.scrollTo(0, 0);
    }

    closeArtist?.addEventListener("click", () => {
        showLibrary();
        window.scrollTo(0, 0);
    });

    // Artist cards
    function createArtistCard(artist) {
        const card = document.createElement("div");
        card.className = "music-card artist-card";

        card.innerHTML = `
            <img src="${artist.image || "images/logo.jpeg"}"
                 alt="${artist.name}"
                 loading="lazy">
            <div class="music-card-info">
                <h3>${verifiedName(artist.name)}</h3>
                <p>Artist</p>
                <span>${artist.songs.length} Songs</span>
            </div>
        `;

        card.addEventListener("click", () => openArtist(artist));
        return card;
    }

    function displayArtists() {
        if (!artistsContainer) return;

        artistsContainer.innerHTML = "";

        if (typeof rudraVXArtists === "undefined") {
            artistsContainer.innerHTML = "<p>Artist library not available.</p>";
            return;
        }

        rudraVXArtists.forEach(artist => {
            artistsContainer.appendChild(createArtistCard(artist));
        });
    }

    // Music cards
    function createCard(item) {
        const card = document.createElement("div");
        card.className = "music-card";

        card.innerHTML = `
            <img src="${item.cover || "images/logo.jpeg"}"
                 alt="${item.title}"
                 loading="lazy">
            <div class="music-card-info">
                <h3>${item.title}</h3>
                <p>${item.artist || "Rudravaax"}</p>
                <span>${item.type}</span>
            </div>
        `;

        card.addEventListener("click", () => {
            if (item.type === "Single") {
                const song = normalizeSong(item, {
                    artist: item.artist || "Rudravaax",
                    cover: item.cover,
                    collection: item.title,
                    type: "Single"
                });

                startLibraryMix([song]);
            } else {
                openAlbum(item);
            }
        });

        return card;
    }

    function displayLibrary() {
        if (!singlesContainer || !epsContainer || !albumsContainer) return;

        singlesContainer.innerHTML = "";
        epsContainer.innerHTML = "";
        albumsContainer.innerHTML = "";

        if (typeof musicLibrary === "undefined") {
            console.error("musicLibrary was not found. Check that songs.js loads before player.js.");
            return;
        }

        musicLibrary.forEach(item => {
            const card = createCard(item);

            if (item.type === "Single") {
                singlesContainer.appendChild(card);
            } else if (item.type === "EP") {
                epsContainer.appendChild(card);
            } else if (item.type === "Album") {
                albumsContainer.appendChild(card);
            }
        });

        displayArtists();
    }

    // Start random library playback when Play is pressed before a queue exists.
    function togglePlay() {
        if (!playlist.length || !audio.src) {
            startLibraryMix();
            return;
        }

        if (audio.paused) {
            audio.play()
                .then(() => {
                    isPlaying = true;
                    updatePlayButton();
                })
                .catch(console.error);
        } else {
            audio.pause();
            isPlaying = false;
            updatePlayButton();
        }
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

    // Next song
    function nextSong() {
        if (!playlist.length) {
            startLibraryMix();
            return;
        }

        if (currentIndex < playlist.length - 1) {
            playSong(currentIndex + 1);
            return;
        }

        if (autoPlayLibrary) {
            const allSongs = getLibrarySongs();
            const currentSong = playlist[currentIndex];

            const choices = allSongs.filter(
                song => song.audio !== currentSong?.audio
            );

            if (!choices.length) {
                playSong(0);
                return;
            }

            const randomSong = choices[
                Math.floor(Math.random() * choices.length)
            ];

            playlist = [randomSong];
            currentIndex = 0;
            playSong(0);
            return;
        }

        if (isRepeat) {
            playSong(0);
            return;
        }

        audio.pause();
        audio.currentTime = 0;
        isPlaying = false;
        updatePlayButton();
    }

    nextBtn?.addEventListener("click", nextSong);

    // Previous song
    function previousSong() {
        if (!playlist.length) return;

        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }

        if (currentIndex > 0) {
            playSong(currentIndex - 1);
        } else {
            audio.currentTime = 0;
        }
    }

    previousBtn?.addEventListener("click", previousSong);

    // Shuffle toggle. Library playback continues to randomize after the queue.
    shuffleBtn?.addEventListener("click", () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle("active", isShuffle);
    });

    // Repeat toggle
    repeatBtn?.addEventListener("click", () => {
        isRepeat = !isRepeat;
        repeatBtn.classList.toggle("active", isRepeat);
    });

    // Automatically continue when a song ends.
    audio.addEventListener("ended", () => {
        if (isRepeat && playlist.length === 1 && !autoPlayLibrary) {
            playSong(0);
        } else {
            nextSong();
        }
    });

    // Skip tracks that fail to load.
    audio.addEventListener("error", () => {
        if (!playlist.length) return;

        console.warn("Could not load this track; skipping to another song.");
        nextSong();
    });

    // Duration and progress
    audio.addEventListener("loadedmetadata", () => {
        if (duration) duration.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
        if (currentTime) currentTime.textContent = formatTime(audio.currentTime);

        if (progressBar && audio.duration) {
            progressBar.value = (audio.currentTime / audio.duration) * 100;
        }
    });

    progressBar?.addEventListener("input", () => {
        if (audio.duration) {
            audio.currentTime = (Number(progressBar.value) / 100) * audio.duration;
        }
    });

    // Volume
    if (volumeBar) {
        audio.volume = Number(volumeBar.value);

        volumeBar.addEventListener("input", () => {
            audio.volume = Number(volumeBar.value);
        });
    }

    // Search
    searchInput?.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();

        if (!searchResults || !searchResultsSection) return;
        searchResults.innerHTML = "";

        if (!query) {
            searchResultsSection.hidden = true;

            if (albumSection && !albumSection.hidden) return;
            if (artistSection && !artistSection.hidden) return;

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
                (track.title || "").toLowerCase().includes(query) ||
                (track.artist || "").toLowerCase().includes(query)
            );

            return titleMatch || artistMatch || trackMatch;
        });

        const matchingArtists =
            typeof rudraVXArtists !== "undefined"
                ? rudraVXArtists.filter(artist =>
                    artist.name.toLowerCase().includes(query)
                )
                : [];

        matchingArtists.forEach(artist => {
            searchResults.appendChild(createArtistCard(artist));
        });

        results.forEach(item => {
            searchResults.appendChild(createCard(item));
        });

        if (!results.length && !matchingArtists.length) {
            searchResults.innerHTML = "<p>No songs or artists found.</p>";
        }
    });

    // Initialize
    displayLibrary();

    // Ecosystem popup, if present on this page
    const popup = document.getElementById("ecosystemPopup");
    const closePopup = document.getElementById("closePopup");
    const gotItBtn = document.getElementById("gotItBtn");

    if (popup) {
        setTimeout(() => popup.classList.add("show"), 500);

        const closeEcosystemPopup = () => popup.classList.remove("show");

        closePopup?.addEventListener("click", closeEcosystemPopup);
        gotItBtn?.addEventListener("click", closeEcosystemPopup);

        popup.addEventListener("click", event => {
            if (event.target === popup) closeEcosystemPopup();
        });
    }
});