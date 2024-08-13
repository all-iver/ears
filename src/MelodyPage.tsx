import { useEffect, useState, useContext } from "react";
import { autorun, reaction } from "mobx";
import NoteCard from "./NoteCard";
import { Scale } from "tonal";
import "./App.css";
import { SettingsContext } from "./SettingsProvider";
import { observer } from "mobx-react-lite";
import { playNotes, playCadence } from "./Utils";

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

function reveal({ setRevealed }) {
  setRevealed(true);
}

const MelodyPage = observer(({ instrument, detectedNote, detectedDegree }) => {
  const settings = useContext(SettingsContext);

  const [revealed, setRevealed] = useState(false);
  const [degrees, setDegrees] = useState(
    getRandomDegreeList({ length: settings.melodyLength }),
  );

  const nextMelody = () => {
    const newDegrees = getRandomDegreeList({
      length: settings.melodyLength,
      range: settings.range,
    });
    setDegrees(newDegrees);
    setRevealed(false);
  };

  // eslint-disable-next-line
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 32) {
      if (revealed) {
        nextMelody();
      } else {
        reveal({ setRevealed });
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(
    () =>
      autorun(() => {
        playNotes({
          degrees,
          scaleName: settings.scaleName,
          instrument,
        });
      }),
    [degrees],
  );

  useEffect(() => {
    return reaction(
      () => {
        return {
          settings: settings.melodyLength,
          range: settings.range,
        };
      },
      () => {
        nextMelody();
      },
    );
  }, []);

  const noteCards = degrees.map((degree, i) => (
    <NoteCard
      key={i}
      note={Scale.degrees(settings.scaleName)(degree)}
      interval={degree}
      tone={instrument}
      revealed={revealed}
      isHeard={
        Scale.degrees(settings.scaleNameWithoutOctave)(degree) === detectedNote
      }
    />
  ));

  return (
    <>
      <button
        className="small-button"
        onClick={() =>
          playCadence({
            instrument: instrument,
            scaleName: settings.scaleName,
          })
        }
      >
        Cadence
      </button>
      <button
        className="small-button"
        onClick={() =>
          playNotes({
            degrees,
            scaleName: settings.scaleName,
            instrument: instrument,
          })
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
});

export default MelodyPage;
