type Props = {
  coord: string;
  color: "dark" | "light";
  piece?: string;
  highlighted?: boolean;
  target?: boolean;
  last?: boolean;
  draggable?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
};

export default function Square({
  color, piece, highlighted, target, last, draggable,
  onClick, onDragStart, onDragEnd, onDragOver, onDrop,
}: Props) {
  const cls = ["square", color];
  if (highlighted) cls.push("highlight");
  if (target) cls.push("moveTarget");
  if (last) cls.push("lastMove");
  return (
    <div className={cls.join(" ")} onClick={onClick} onDragOver={onDragOver} onDrop={onDrop}>
      {piece && (
        <span
          className={`piece ${draggable ? "draggable" : ""}`}
          draggable={!!draggable}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          {piece}
        </span>
      )}
    </div>
  );
}
