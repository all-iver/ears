import { Scale } from "tonal";

async function playCadence({ instrument, scaleName }: { scaleName: string }) {
  const synth = instrument.toDestination();
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

async function playNotes({
  degrees,
  scaleName,
  instrument,
  delay = 500,
}: {
  degrees: number[];
  scaleName: string;
  delay: number;
}) {
  const synth = instrument.toDestination();
  for (let i = 0; i < degrees.length; i++) {
    const note = Scale.degrees(scaleName)(degrees[i]);
    synth.triggerAttackRelease(note, "4n");
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

export { playCadence, playNotes };
