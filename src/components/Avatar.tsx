type Props = { name: string; size?: number };

export default function Avatar({ name, size = 40 }: Props) {
  const letter = (name?.trim()?.[0] || "?").toUpperCase();
  return (
    <div
      className="grid place-items-center rounded-full bg-[#964d22] border-2 border-[#eedc97] text-white font-semibold shadow-md"
      style={{
        height: size,
        width: size,
        fontSize: Math.floor(size * 0.45),
      }}
    >
      {letter}
    </div>
  );
}
