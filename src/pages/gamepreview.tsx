import Game from "../features/game/index.tsx";
import Header from "../components/Header.tsx";

export default function GamePreview() {
  const fakeUsername = "Sai";

  return (
    <div className="min-h-screen bg-[#1c1c24] text-[#cccccc]">
      <Header username={fakeUsername} />
      <main className="mx-auto max-w-6xl px-4 py-6 flex justify-center">
        <div className="mx-auto" style={{ width: "min(95vw, 1080px)" }}>
          <Game subject="preview-user-123" />
        </div>
      </main>
    </div>
  );
}
