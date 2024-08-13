import { useEffect, useState, useContext } from "react";
import { autorun, reaction, runInAction, action } from "mobx";
import NoteCard from "./NoteCard";
import { Scale } from "tonal";
import "./App.css";
import { SettingsContext } from "./SettingsProvider";
import { observer, useLocalObservable } from "mobx-react-lite";
import { playNotes, playCadence } from "./Utils";

function getRandomDegree({
  range,
  avoidDegree,
}: {
  range: string;
  avoidDegree?: number;
}) {
  let degrees = [1, 2, 3, 4, 5, 6, 7, 8];
  if (range === "1-4") {
    degrees = [1, 2, 3, 4];
  } else if (range === "3-6") {
    degrees = [3, 4, 5, 6];
  } else if (range === "5-8") {
    degrees = [5, 6, 7, 8];
  }
  if (avoidDegree) degrees = degrees.filter((degree) => degree !== avoidDegree);
  return degrees[Math.floor(Math.random() * degrees.length)];
}

const AutoPage = observer(({ instrument, detectedNote, detectedDegree }) => {
  const settings = useContext(SettingsContext);

  const state = useLocalObservable(() => ({
    timer: null,
    playingDegree: null,
    isPlaying: false,
  }));

  useEffect(() => {
    const dispose = reaction(
      () => ({
        scale: settings.scaleName,
        range: settings.range,
        isPlaying: state.isPlaying,
        delay: settings.delay,
      }),
      () => {
        console.log(`clearing timer ${state.timer}`);
        clearInterval(state.timer);
        runInAction(() => {
          state.timer = null;
        });
        if (state.isPlaying) {
          const playRandomNote = () => {
            const degree = getRandomDegree({
              range: settings.range,
              avoidDegree: state.playingDegree,
            });
            runInAction(() => {
              state.playingDegree = degree;
            });
            playNotes({
              degrees: [degree],
              scaleName: settings.scaleName,
              instrument,
              delay: 0,
            });
          };
          runInAction(() => {
            state.timer = setInterval(playRandomNote, settings.delay);
            console.log(`setting timer ${state.timer}`);
          });
        }
      },
    );
    return () => {
      dispose();
      console.log(`clearing 2 timer ${state.timer}`);
      clearInterval(state.timer);
      runInAction(() => {
        state.timer = null;
      });
    };
  }, []);

  return (
    <>
      <button
        className="small-button"
        onClick={action(() => {
          state.isPlaying = !state.isPlaying;
        })}
      >
        {state.isPlaying ? "Stop" : "Start"}
      </button>
    </>
  );
});

export default AutoPage;
