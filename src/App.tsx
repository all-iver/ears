import SampleLibrary from "./Tonejs-Instruments";
import { useEffect, useState, useRef } from "react";
import { autorun, reaction } from "mobx";
import { Scale } from "tonal";
import "./App.css";
import createSettings from "./Settings";
import { SettingsProvider } from "./SettingsProvider";
import SettingsPanel from "./SettingsPanel";
import { observer } from "mobx-react-lite";

import startPitchDetect from "./pitchdetect";
import MelodyPage from "./MelodyPage";
import AutoPage from "./AutoPage";

const settings = createSettings();

const enum Page {
  Melody = "melody",
  Auto = "auto",
}

const App = observer(() => {
  const initializedRef = useRef(false);
  const instrumentRef = useRef(null);
  const [detectedNote, setDetectedNote] = useState(null);
  const [detectedDegree, setDetectedDegree] = useState(null);
  const [detune, setDetune] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [inApp, setInApp] = useState(false);
  const [page, setPage] = useState(Page.Melody);

  const heardNote = (note, detune) => {
    if (detune < -30 || detune > 30) {
      note = null;
      detune = null;
    }
    setDetectedNote(note);
    setDetune(detune);
  };

  useEffect(
    () =>
      autorun(() => {
        const degree = Scale.degrees(settings.scaleNameWithoutOctave);
        for (let i = 1; i <= 8; i++) {
          if (degree(i) === detectedNote) {
            const r = document.querySelector(":root");
            r.style.setProperty("--detune", `${detune}`);
            setDetectedDegree(i);
            return;
          }
        }
        setDetectedDegree(null);
      }),
    [detectedNote, detune],
  );

  useEffect(
    () =>
      autorun(() => {
        if (initializedRef.current || loaded) return;
        SampleLibrary.baseUrl = import.meta.env.BASE_URL + "/samples/";
        SampleLibrary.onload = () => {
          console.log("loaded");
          setLoaded(true);
        };
        instrumentRef.current = SampleLibrary.load({
          instruments: settings.instrumentName,
        });
        startPitchDetect(heardNote);
        initializedRef.current = true;
      }),
    [loaded],
  );

  reaction(
    () => settings.instrumentName,
    () => {
      if (!loaded || !initializedRef.current) return;
      setInApp(false);
      instrumentRef.current = null;
      initializedRef.current = false;
      setLoaded(false);
    },
  );

  if (!loaded) {
    return <h1>Loading...</h1>;
  }

  if (!inApp) {
    return (
      <button
        className="big-button"
        onClick={() => {
          setInApp(true);
        }}
      >
        Start
      </button>
    );
  }

  const pageComponent =
    page === Page.Melody ? (
      <MelodyPage
        instrument={instrumentRef.current}
        detectedNote={detectedNote}
        detectedDegree={detectedDegree}
      />
    ) : (
      <AutoPage
        instrument={instrumentRef.current}
        detectedNote={detectedNote}
        detectedDegree={detectedDegree}
      />
    );

  return (
    <>
      <h1>Ears</h1>
      <SettingsProvider settings={settings}>
        <div className="page-buttons">
          <button
            className={page === Page.Melody ? "selected" : ""}
            onClick={() => setPage(Page.Melody)}
          >
            Melody
          </button>
          <button
            className={page === Page.Auto ? "selected" : ""}
            onClick={() => setPage(Page.Auto)}
          >
            Auto
          </button>
        </div>
        <SettingsPanel
          showMelodyLength={page === Page.Melody}
          showDelay={page === Page.Auto}
        />
        {pageComponent}
      </SettingsProvider>
    </>
  );
});

export default App;
