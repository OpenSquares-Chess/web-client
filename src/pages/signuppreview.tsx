import Signup from "../features/game/auth/Signup";

export default function SignupPreview() {
  async function fakeSubmit() {
    console.log("Preview submit — no backend connected.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1c1c24]">
      <Signup onSubmit={fakeSubmit} busy={false} error={null} />
    </div>
  );
}
