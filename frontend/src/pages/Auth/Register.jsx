import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, role } = formData;
    if (!name || !email || !password || !role) return;
    dispatch(registerUser(formData));
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
    if (isError) {
      console.error(message);
    }
  }, [user, isError, message, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div className="flex justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  value="founder"
                  checked={formData.role === "founder"}
                  onChange={handleChange}
                />
                <span>Founder</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  value="investor"
                  checked={formData.role === "investor"}
                  onChange={handleChange}
                />
                <span>Investor</span>
              </label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              ) : (
                "Register"
              )}
            </Button>
          </form>

          {isError && (
            <p className="text-red-500 text-sm mt-3 text-center">{message}</p>
          )}

          <p className="text-sm text-muted-foreground text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
