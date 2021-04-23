import { createContext } from 'react';

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
    play: (episode: Episode) => void,
    tooglePlay: () => void,
    setIsPlayingState: (state: boolean) => void
}

export const PlayerContext = createContext({} as PlayerContextData);