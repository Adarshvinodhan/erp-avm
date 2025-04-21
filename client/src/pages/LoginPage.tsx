import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/forms/LoginForm";
import api from "../api.ts";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/AuthSlice.tsx";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await api.post("api/login", { username: username, password: password });
      localStorage.setItem("token", response.data.token);
      const userData = {
        user: response.data.user,
      };
      dispatch(setUser(userData), console.log("user stored successfully"));

      //Toast Notification
      toast.success("Login successful", {
        duration: 1500,
        style: {
          background: "white",
          color: "black",
        },
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      toast.error(error, { duration: 1500 });
      console.error("Login failed:", err);
      
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-4">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        {/* Pass props to LoginForm */}
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          error={error}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
