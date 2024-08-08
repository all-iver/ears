import * as Tone from "tone";
import SampleLibrary from "./Tonejs-Instruments";
import { useEffect, useState, useRef } from "react";
import NoteCard from "./NoteCard";
import { Scale } from "tonal";
import "./App.css";

async function playCadence({ tone, scaleName }: { scaleName: string }) {
  const synth = tone.toDestination();
  let degrees = [1, 3, 5];
  synth.triggerAttackRelease(
    degrees.map((d) => Scale.degrees(scaleName)(d)),
    "4n",
  );
  await new Promise((resolve) => setTimeout(resolve, 500));
  degrees = [4, 6, 1];
  synth.triggerAttackRelease(
    degrees.map((d) => Scale.degrees(scaleName)(d)),
    "4n",
  );
  await new Promise((resolve) => setTimeout(resolve, 500));
  degrees = [5, 7, 2];
  synth.triggerAttackRelease(
    degrees.map((d) => Scale.degrees(scaleName)(d)),
    "4n",
  );
  await new Promise((resolve) => setTimeout(resolve, 500));
  degrees = [1, 3, 5];
  synth.triggerAttackRelease(
    degrees.map((d) => Scale.degrees(scaleName)(d)),
    "4n",
  );
}

function getRandomDegreeList({ length }: { length: number }) {
  const degrees = [1, 2, 3, 4, 5, 6, 7, 8];
  const randomDegrees = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * degrees.length);
    randomDegrees.push(degrees[randomIndex]);
  }
  return randomDegrees;
}

async function playNotes({
  degrees,
  scaleName,
  tone,
}: {
  degrees: number[];
  scaleName: string;
}) {
  const synth = tone.toDestination();
  for (let i = 0; i < degrees.length; i++) {
    const note = Scale.degrees(scaleName)(degrees[i]);
    synth.triggerAttackRelease(note, "4n");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

function reveal({ setRevealed }) {
  setRevealed(true);
}

function next({ setDegrees, setRevealed, scaleName, tone }) {
  const newDegrees = getRandomDegreeList({ length: 4 });
  setDegrees(newDegrees);
  setRevealed(false);
  playNotes({ degrees: newDegrees, scaleName, tone: tone });
}

function App() {
  const [revealed, _setRevealed] = useState(false);
  const revealedRef = useRef(revealed);
  const setRevealed = (value: boolean) => {
    revealedRef.current = value;
    _setRevealed(value);
  };
  const initializedRef = useRef(false);
  const guitar = useRef(null);
  const scaleName = "E4 major";
  const [degrees, setDegrees] = useState(getRandomDegreeList({ length: 4 }));

  useEffect(() => {
    if (initializedRef.current) return;
    SampleLibrary.baseUrl = import.meta.env.BASE_URL + "/samples/";
    guitar.current = SampleLibrary.load({ instruments: "guitar-electric" });
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.keyCode === 32) {
        if (revealedRef.current) {
          next({ setDegrees, setRevealed, scaleName, tone: guitar.current });
        } else {
          reveal({ setRevealed });
        }
      }
    });
    initializedRef.current = true;
  }, []);

  const noteCards = degrees.map((degree, i) => (
    <NoteCard
      key={i}
      note={Scale.degrees(scaleName)(degree)}
      interval={degree}
      tone={guitar.current}
      revealed={revealed}
    />
  ));

  return (
    <>
      <h1>Ears</h1>
      <button
        className="small-button"
        onClick={() => playCadence({ tone: guitar.current, scaleName })}
      >
        Cadence
      </button>
      <button
        className="small-button"
        onClick={() => playNotes({ degrees, scaleName, tone: guitar.current })}
      >
        Play Again
      </button>
      <div>{noteCards}</div>
      <button
        className="big-button"
        onClick={() => reveal({ setRevealed })}
        style={{ display: revealed ? "none" : "inline-flex" }}
      >
        Reveal
      </button>
      <button
        className="big-button"
        onClick={() =>
          next({ setDegrees, setRevealed, scaleName, tone: guitar.current })
        }
        style={{ display: revealed ? "inline-flex" : "none" }}
      >
        Next
      </button>
    </>
  );
}

export default App;
