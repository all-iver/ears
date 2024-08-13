import { makeAutoObservable } from "mobx";

function createSettings() {
  return makeAutoObservable({
    tonic: "C4",
    scaleType: "major",
    melodyLength: 4,
    range: "1-8",
    instrumentName: "guitar-electric",
    delay: 1000,
    get scaleName() {
      return `${this.tonic} ${this.scaleType}`;
    },
    get scaleNameWithoutOctave() {
      return this.scaleName.replace(/\d/g, "");
    },
  });
}

export default createSettings;
