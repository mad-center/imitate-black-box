import { ref } from 'vue';
function useMusic() {
    const currentSong = ref({});
    const currentTime = ref(0);
    const playing = ref(false);
    function setCurrentSong(song) {
        currentSong.value = song;
    }
    function setCurrentTime(time) {
        currentTime.value = time;
    }
    function setPlayingState(playingState) {
        playing.value = playingState;
    }
    function startSong(rawSong) {
        const song = Object.assign({}, rawSong);
        setCurrentSong(song);
        setPlayingState(true);
    }
    function clearCurrentSong() {
        setCurrentSong({});
        setPlayingState(false);
        setCurrentTime(0);
    }
    return { currentSong, currentTime, playing, setCurrentTime, setPlayingState, startSong, clearCurrentSong };
}
export default useMusic;
