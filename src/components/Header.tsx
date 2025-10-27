import Avatar from "./Avatar";

type Props = { username: string };

export default function Header({ username }: Props) {
  return (
    <header className="w-full sticky top-0 bg-[#1c1c24]/90 backdrop-blur-sm border-b border-[#2c2c34]">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-end gap-3 text-[#cccccc]">
        <span className="text-sm opacity-80">Playing as:</span>
        <span className="text-base font-medium">{username}</span>
        <Avatar name={username} size={38} />
      </div>
    </header>
  );
}
