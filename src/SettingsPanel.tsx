import * as Tone from "tone";
import SampleLibrary from "./Tonejs-Instruments";
import { useEffect, useState, useRef, useContext } from "react";
import { action, autorun, reaction } from "mobx";
import { Scale } from "tonal";
import "./App.css";
import { SettingsContext } from "./SettingsProvider";
import { observer } from "mobx-react-lite";

const SettingsPanel = observer(({ showMelodyLength, showDelay }) => {
  const settings = useContext(SettingsContext);

  const tonics = [
    "C3",
    "Db3",
    "D3",
    "Eb3",
    "E3",
    "F3",
    "Gb3",
    "G3",
    "Ab3",
    "A3",
    "Bb3",
    "B3",
    "C4",
    "Db4",
    "D4",
    "Eb4",
    "E4",
    "F4",
    "Gb4",
    "G4",
    "Ab4",
    "A4",
    "Bb4",
    "B4",
  ];

  const ranges = ["1-4", "3-6", "5-8", "1-8"];

  const scaleTypes = ["major", "minor"];

  const melodyLengths = [1, 2, 3, 4, 5, 6, 7, 8];

  const delays = [5000, 2500, 1000, 750, 500];

  return (
    <>
      <select
        value={settings.instrumentName}
        onChange={action((e) => (settings.instrumentName = e.target.value))}
      >
        {SampleLibrary.list.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>
      <div>
        <select
          value={settings.tonic}
          onChange={action((e) => (settings.tonic = e.target.value))}
        >
          {tonics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={settings.scaleType}
          onChange={action((e) => (settings.scaleType = e.target.value))}
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
        <select
          value={settings.range}
          onChange={action((e) => (settings.range = e.target.value))}
        >
          {ranges.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: showMelodyLength ? "block" : "none" }}>
        Melody Length
        <select
          value={settings.melodyLength}
          onChange={action(
            (e) => (settings.melodyLength = parseInt(e.target.value)),
          )}
        >
          {melodyLengths.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: showDelay ? "block" : "none" }}>
        Delay
        <select
          value={settings.delay}
          onChange={action((e) => (settings.delay = parseInt(e.target.value)))}
        >
          {delays.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
    </>
  );
});

export default SettingsPanel;
