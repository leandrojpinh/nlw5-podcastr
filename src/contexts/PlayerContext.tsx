import { createContext, useState, ReactNode, useContext } from 'react';

interface Episode {
    title: string,
    members: string,
    thumbnail: string,
    duration: number,
    url: string
}

interface PlayerContextData {
    episodes: Episode[],
    currentEpisodeIndex: number,
    isPlaying: boolean,
    isLooping: boolean,
    isShuffling: boolean,
    hasPrevious: boolean,
    hasNext: boolean,
    play: (episode: Episode) => void,
    tooglePlay: () => void,
    toogleLoop: () => void,
    toogleShuffle: () => void,
    setIsPlayingState: (state: boolean) => void,
    playList: (list: Episode[], index: number) => void,
    playNext: () => void,
    playPrevious: () => void,
    clearPlayerState: () => void
}

interface PlayerContextProviderProps {
    children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodes, setEpisodes] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffing] = useState(false);

    function play(episode: Episode) {
        setEpisodes([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Episode[], index: number) {
        setEpisodes(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function tooglePlay() {
        setIsPlaying(!isPlaying);
    }

    function toogleLoop() {
        setIsLooping(!isLooping);
    }

    function toogleShuffle() {
        setIsShuffing(!isShuffling);
    }

    function setIsPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    function clearPlayerState() {
        setEpisodes([]);
        setCurrentEpisodeIndex(0);
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodes.length;

    function playNext() {
        if (isShuffling) {
            const randomEpisodeIndex = Math.floor(Math.random() * episodes.length);
            
            setCurrentEpisodeIndex(randomEpisodeIndex);
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }

    function playPrevious() {
        if (currentEpisodeIndex > 0) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    return (
        <PlayerContext.Provider
            value={{
                currentEpisodeIndex,
                episodes,
                isPlaying,
                isLooping,
                isShuffling,
                hasPrevious,
                hasNext,
                play,
                tooglePlay,
                toogleLoop,
                toogleShuffle,
                setIsPlayingState,
                playList,
                playNext,
                playPrevious,
                clearPlayerState
            }}>
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}