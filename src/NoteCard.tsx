import "./NoteCard.css";

function NoteCard({
  note,
  interval,
  tone,
  revealed,
  isHeard,
}: {
  note: string;
  interval: number;
  revealed: boolean;
  isHeard: boolean;
}) {
  const label = revealed ? interval : "?";
  let className = "note-card";
  if (isHeard) className += " note-card-heard";
  return (
    <button
      className={className}
      onClick={() => tone.toDestination().triggerAttackRelease(note, "4n")}
    >
      {label}
    </button>
  );
}

export default NoteCard;
