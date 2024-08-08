import "./NoteCard.css";

function NoteCard({
  note,
  interval,
  tone,
  revealed,
}: {
  note: string;
  interval: number;
  revealed: boolean;
}) {
  const label = revealed ? interval : "?";
  return (
    <button
      className="note-card"
      onClick={() => tone.toDestination().triggerAttackRelease(note, "4n")}
    >
      {label}
    </button>
  );
}

export default NoteCard;
