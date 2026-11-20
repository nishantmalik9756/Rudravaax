
const musicLibrary = [

    // ==================================
    // SINGLES
    // ==================================

   
    {

        id: 1,
        title: "Apsara",
        artist: "Rudravaax",
        type: "Single",
        cover: "images/apsara.jpeg",
        audio: "music/Apsara_2.mp3",
        
    },

    {
    id: 2,
        title: "Nafrat",
        artist: "Rudravaax",
        type: "Single",
        cover: "images/coming.jpg",
        audio: "music/.mp3",
        
    },

    // ==================================
    // EPS
    // ==================================

    {
        id: 3,
        title: "Uske Liye",
        artist: "Archak, Rudravaax",
        type: "EP",
        cover: "images/uske-liye.jpeg",

        tracks: [
            {
                title: "You Know My Love",
                audio: "music/ykml.mp3",
                cover: "images/uske-liye.jpeg"
            },
            {
                title: "Minor Cheers",
                audio: "music/Minor-Cheers.mp3",
                cover: "images/uske-liye.jpeg"

            },

            {  
        title: "-Coming Soon-",
        artist: "Archak, Rudravaax",
        type: "Single",
        cover: "images/uske-liye.jpeg",
        audio: "music/.mp3",
         },

         {
          title: "-Coming Soon-",
        artist: "Archak, Rudravaax",
        type: "Single",
        cover: "images/uske-liye.jpeg",
        audio: "music/.mp3",
         },

         {
         title: "-Coming Soon-",
        artist: "Archak, Rudravaax",
        type: "Single",
        cover: "images/uske-liye.jpeg",
        audio: "music/.mp3",
         },
        ]
    },

    {
        id: 4,
        title: "For Once [COMING SOON]",
        artist: "Rudravaax, NA-SAMAJH",
        type: "EP",
        cover: "images/coming.jpg",

        tracks: [
            {
                title: "--",
                audio: "music/rolling-round.mp3",
                cover: "images/coming.jpg"
            },
            {
                title: "--",
                audio: "music/track-two.mp3",
                cover: "images/coming.jpg"
            }
        ]
    },


    // ==================================
    // ALBUMS
    // ==================================

    {
        id: 5,
        title: "Signature Chapter One",
        artist: "Rudravaax",
        type: "Album",
        cover: "images/signature.jpeg",
        releaseDate: "Today at 1 PM",

        tracks: [

            {
                title: "Raat Mein",
                artist: "Rudravaax, ANRX BEATS",
                audio: "music/clean Raat Mein.mp3",
                cover: "images/signature.jpeg"
            },

            {
                title: "Mohobbatein",
                audio: "music/Mohobbatein COMP.mp3",
                cover: "images/signature.jpeg"
            },

            {
                title: "God Flow",
                audio: "music/God Flow.mp3",
                cover: "images/signature.jpeg"
            },

            {
                title: "Crazy Boy",
                audio: "music/Crazy Boy.mp3",
                cover: "images/signature.jpeg"
            },

            {
                title: "Naaginn",
                audio: "music/Naginn.mp3",
                cover: "images/signature.jpeg"
            },

            {
                title: "Dynamite",
                audio: "music/Dyanamite.mp3",
                cover: "images/signature.jpeg"
            },

            {
                title: "C-O2",
                audio: "music/CO-2 (Insane Drippin').mp3",
                cover: "images/signature.jpeg"
            },

            {
                title: "Ishq Bawaal",
                audio: "music/Ishq Bawaal.mp3",
                cover: "images/signature.jpeg"
            },

            {
                title: "NGRRR",
                audio: "music/NGRRR.mp3",
                cover: "images/signature.jpeg"
            },

            {
                title: "Saari Rattiyaan",
                audio: "music/Saari Rattiyaan.mp3",
                cover: "images/signature.jpeg"
            }

        ]
    }

];


// ==========================================
// RUDRAVX ARTISTS
// AUTOMATIC ARTIST GENERATION
// ==========================================

const artistProfiles = {

    "Rudravaax": {
        name: "Rudravaax",
        image: "images/artists/rudravaax.jpeg",
        bio: "Singer, Rapper, Producer, Lyricist, Composer, and Audio Engineer"
    },

    "Archak": {
        name: "Archak",
        image: "images/artists/archak.jpeg",
        bio: "Rapper"
    },

    "ANRX BEATS": {
        name: "ANRX BEATS",
        image: "images/artists/anrxbeats.jpeg",
        bio: "Music Producer"
    },

    "NA-SAMAJH": {
        name: "NA-SAMAJH",
        image: "images/artists/nasamajh.jpeg",
        bio: "Singer, Rapper"
    }

};


// ==========================================
// GENERATE ARTIST SONG LIBRARY
// ==========================================

const artistLibrary = {};


// Add song to artist

function addSongToArtist(artistName, song) {

    if (!artistName || !artistName.trim()) return;

    const names = artistName
        .split(",")
        .map(name => name.trim())
        .filter(Boolean);

    names.forEach(name => {

        if (!artistLibrary[name]) {

            artistLibrary[name] = {
                name: name,
                image: artistProfiles[name]?.image || "images/logo.jpeg",
                bio: artistProfiles[name]?.bio || "Music Artist.",
                songs: []
            };

        }

        // Avoid duplicate entries
        const alreadyExists = artistLibrary[name].songs.some(
            item =>
                item.title === song.title &&
                item.audio === song.audio
        );

        if (!alreadyExists) {
            artistLibrary[name].songs.push(song);
        }

    });

}


// ==========================================
// COLLECT ALL SONGS
// ==========================================

musicLibrary.forEach(item => {

    // SINGLE
    if (item.type === "Single") {

        addSongToArtist(item.artist, {
            title: item.title,
            artist: item.artist,
            audio: item.audio,
            cover: item.cover,
            collection: item.title,
            type: "Single"
        });

    }


    // EP / ALBUM
    if (item.type === "EP" || item.type === "Album") {

        if (!item.tracks) return;

        item.tracks.forEach(track => {

            // Track artist takes priority.
            // Otherwise use collection artist.

            const trackArtist = track.artist || item.artist;

            addSongToArtist(trackArtist, {

                title: track.title,
                artist: trackArtist,

                audio: track.audio,

                cover: track.cover || item.cover,

                collection: item.title,

                type: item.type

            });

        });

    }

});


// ==========================================
// FINAL ARTIST ARRAY
// ==========================================

const rudraVXArtists = Object.values(artistLibrary);

