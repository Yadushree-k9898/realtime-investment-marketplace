import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/redux/slices/authSlice";
import { Mail, Lock, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!email || !password) return;
      try {
        await dispatch(loginUser({ email, password })).unwrap();
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, email, password]
  );

  const loginButtonContent = useMemo(
    () =>
      loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          Sign in
          <ChevronRight className="ml-2 h-4 w-4" />
        </>
      ),
    [loading]
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card border rounded-3xl shadow-md">
        <div className="text-center space-y-1">
          <div className="text-3xl font-bold">Welcome Back</div>
          <p className="text-muted-foreground text-sm">
            Enter your credentials to access your dashboard
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center"
          >
            {loginButtonContent}
          </Button>
        </form>

        <div className="text-center text-sm pt-2">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-emerald-600 hover:underline"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
