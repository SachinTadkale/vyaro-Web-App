import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/login";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-2">FarmZy</h1>
          <p className="text-base text-muted-foreground">{isLogin ? "Welcome Back" : "Create Account"}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
          {isLogin ? (
            <LoginForm switchToRegister={() => navigate("/register")} />
          ) : (
            <RegisterForm switchToLogin={() => navigate("/login")} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

