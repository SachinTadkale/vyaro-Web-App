import { useNavigate } from "react-router-dom";

export default function EntryPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-8">
        <div>
          <h1 className="text-6xl font-bold text-foreground mb-4">FarmZy</h1>
          <p className="text-lg text-muted-foreground mb-2">
            Simple farm supply management
          </p>
          <p className="text-sm text-muted-foreground">
            Connect with farmers and manage orders efficiently
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <button
            onClick={() => navigate("/login")}
            className="w-full px-6 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-full px-6 py-4 border border-border text-foreground font-bold rounded-lg hover:bg-muted transition"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
