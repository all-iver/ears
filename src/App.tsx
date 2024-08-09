import * as Tone from "tone";
import SampleLibrary from "./Tonejs-Instruments";
import { useEffect, useState, useRef } from "react";
import NoteCard from "./NoteCard";
import { Scale } from "tonal";
import "./App.css";

import startPitchDetect from "./pitchdetect";

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

function getRandomDegreeList({
  length,
  range,
}: {
  length: number;
  range: string;
}) {
  let degrees = [1, 2, 3, 4, 5, 6, 7, 8];
  if (range === "1-4") {
    degrees = [1, 2, 3, 4];
  } else if (range === "3-6") {
    degrees = [3, 4, 5, 6];
  } else if (range === "5-8") {
    degrees = [5, 6, 7, 8];
  }
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

function App() {
  const [revealed, setRevealed] = useState(false);
  const initializedRef = useRef(false);
  const instrumentRef = useRef(null);
  const [tonic, setTonic] = useState("C4");
  const [scaleType, setScaleType] = useState("major");
  const [scaleName, setScaleName] = useState("E4 major");
  const [scaleNameWithoutOctave, setScaleNameWithoutOctave] =
    useState("E major");
  const [melodyLength, setMelodyLength] = useState(4);
  const [range, setRange] = useState("1-8");
  const [detectedNote, setDetectedNote] = useState(null);
  const [detectedDegree, setDetectedDegree] = useState(null);
  const [detune, setDetune] = useState(null);
  const [degrees, setDegrees] = useState(getRandomDegreeList({ length: 4 }));
  const [instrumentName, setInstrumentName] = useState("guitar-electric");
  const [loaded, setLoaded] = useState(false);
  const [inApp, setInApp] = useState(false);

  // eslint-disable-next-line
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!loaded) return;
    if (e.keyCode === 32) {
      if (revealed) {
        nextMelody();
      } else {
        reveal({ setRevealed });
      }
    }
  };

  const nextMelody = () => {
    const newDegrees = getRandomDegreeList({
      length: melodyLength,
      range: range,
    });
    setDegrees(newDegrees);
    setRevealed(false);
    // if (instrumentRef.current === null) return;
    // playNotes({ degrees: newDegrees, scaleName, tone: instrumentRef.current });
  };

  const heardNote = (note, detune) => {
    if (detune < -30 || detune > 30) {
      note = null;
      detune = null;
    }
    setDetectedNote(note);
    setDetune(detune);
  };

  useEffect(() => {
    const degree = Scale.degrees(scaleNameWithoutOctave);
    for (let i = 1; i <= 8; i++) {
      if (degree(i) === detectedNote) {
        const r = document.querySelector(":root");
        r.style.setProperty("--detune", `${detune}`);
        setDetectedDegree(i);
        return;
      }
    }
    setDetectedDegree(null);
  }, [detectedNote, detune, scaleNameWithoutOctave]);

  useEffect(() => {
    if (initializedRef.current || loaded) return;
    SampleLibrary.baseUrl = import.meta.env.BASE_URL + "/samples/";
    SampleLibrary.onload = () => {
      console.log("loaded");
      setLoaded(true);
    };
    instrumentRef.current = SampleLibrary.load({ instruments: instrumentName });
    startPitchDetect(heardNote);
    initializedRef.current = true;
  }, [loaded]); // eslint-disable-line

  useEffect(() => {
    if (!loaded || !initializedRef.current) return;
    setInApp(false);
    instrumentRef.current = null;
    initializedRef.current = false;
    setLoaded(false);
  }, [instrumentName]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    setScaleName(`${tonic} ${scaleType}`);
    setScaleNameWithoutOctave(tonic.replace(/\d/g, "") + ` ${scaleType}`);
  }, [tonic, scaleType]);

  useEffect(() => {
    if (!loaded) return;
    if (instrumentRef.current === null) return;
    playNotes({ degrees, scaleName, tone: instrumentRef.current });
  }, [scaleName, degrees]); // eslint-disable-line

  useEffect(() => {
    if (!loaded) return;
    nextMelody();
  }, [melodyLength, range]); // eslint-disable-line

  const noteCards = degrees.map((degree, i) => (
    <NoteCard
      key={i}
      note={Scale.degrees(scaleName)(degree)}
      interval={degree}
      tone={instrumentRef.current}
      revealed={revealed}
      isHeard={Scale.degrees(scaleNameWithoutOctave)(degree) === detectedNote}
    />
  ));

  const tonics = [
    "Ab3",
    "A3",
    "Bb3",
    "B3",
    "C3",
    "Db3",
    "D3",
    "Eb3",
    "E3",
    "F3",
    "Gb3",
    "G3",
    "Ab4",
    "A4",
    "Bb4",
    "B4",
    "C4",
    "Db4",
    "D4",
    "Eb4",
    "E4",
    "F4",
    "Gb4",
    "G4",
  ];

  const ranges = ["1-4", "3-6", "5-8", "1-8"];

  const scaleTypes = ["major", "minor"];

  const melodyLengths = [1, 2, 3, 4, 5, 6, 7, 8];

  if (!loaded) {
    return <h1>Loading...</h1>;
  }

  if (!inApp) {
    return (
      <button
        className="big-button"
        onClick={() => {
          nextMelody();
          setInApp(true);
        }}
      >
        Start
      </button>
    );
  }

  return (
    <>
      <h1>Ears</h1>
      <select
        value={instrumentName}
        onChange={(e) => setInstrumentName(e.target.value)}
      >
        {SampleLibrary.list.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>
      <div>
        <select value={tonic} onChange={(e) => setTonic(e.target.value)}>
          {tonics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={scaleType}
          onChange={(e) => setScaleType(e.target.value)}
        >
          {scaleTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div>
        Tones
        <select value={range} onChange={(e) => setRange(e.target.value)}>
          {ranges.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div>
        Melody Length
        <select
          value={melodyLength}
          onChange={(e) => setMelodyLength(parseInt(e.target.value))}
        >
          {melodyLengths.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <button
        className="small-button"
        onClick={() => playCadence({ tone: instrumentRef.current, scaleName })}
      >
        Cadence
      </button>
      <button
        className="small-button"
        onClick={() =>
          playNotes({ degrees, scaleName, tone: instrumentRef.current })
        }
      >
        Play Again
      </button>
      <div className="note-cards">{noteCards}</div>
      <button
        className="big-button"
        onClick={() => reveal({ setRevealed })}
        style={{ display: revealed ? "none" : "inline-flex" }}
      >
        Reveal
      </button>
      <button
        className="big-button"
        onClick={nextMelody}
        style={{ display: revealed ? "inline-flex" : "none" }}
      >
        Next
      </button>
    </>
  );
}

export default App;
