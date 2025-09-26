type Props = {
  color: "white" | "black";
  onSelect: (piece: "q" | "r" | "b" | "n") => void;
  onCancel: () => void;
};

const ICONS = {
  white: { q: "♕", r: "♖", b: "♗", n: "♘" },
  black: { q: "♛", r: "♜", b: "♝", n: "♞" },
};

export default function PromotionPicker({ color, onSelect, onCancel }: Props) {
  const I = ICONS[color];
  return (
    <div className="promo-backdrop" onClick={onCancel}>
      <div className="promo-card" onClick={(e) => e.stopPropagation()}>
        <div className="promo-title">Promote pawn to…</div>
        <div className="promo-row">
          {(["q","r","b","n"] as const).map(p => (
            <button key={p} className="btn promo-btn" onClick={() => onSelect(p)}>
              <span className="promo-piece">{I[p]}</span>
              <span className="promo-label">
                {p === "q" ? "Queen" : p === "r" ? "Rook" : p === "b" ? "Bishop" : "Knight"}
              </span>
            </button>
          ))}
        </div>
        <button className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
