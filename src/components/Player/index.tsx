import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider';

import { usePlayer } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/functions';

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    const {
        episodes,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        hasNext,
        hasPrevious,
        tooglePlay,
        toogleLoop,
        toogleShuffle,
        setIsPlayingState,
        playNext,
        playPrevious,
        clearPlayerState
    } = usePlayer();

    const episode = episodes[currentEpisodeIndex];

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if (hasNext) {
            playNext();
        } else {
            clearPlayerState();
        }
    }

    return (
        <div className={styles.container}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit='cover'
                    />

                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>

                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider}></div>
                        )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio
                        src={episode.url}
                        autoPlay
                        loop={isLooping}
                        ref={audioRef}
                        onPlay={() => setIsPlayingState(true)}
                        onPause={() => setIsPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}
                        onEnded={handleEpisodeEnded}
                    />
                )}

                <div className={styles.buttons}>
                    <button
                        type='button'
                        disabled={!episode || episodes.length === 1}
                        onClick={toogleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type='button' onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>
                    <button type='button'
                        className={styles.playButton} disabled={!episode}
                        onClick={tooglePlay}>
                        {isPlaying ?
                            <img src="/pause.svg" alt="Tocar" /> :
                            <img src="/play.svg" alt="Tocar" />
                        }

                    </button>
                    <button type='button' onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>
                    <button
                        type='button'
                        disabled={!episode}
                        onClick={toogleLoop}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    );
}