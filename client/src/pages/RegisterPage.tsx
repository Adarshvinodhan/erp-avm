import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GalleryVerticalEnd } from "lucide-react";
import api from "../api.ts";
import { RegisterForm } from "@/components/forms/RegisterForm";
import {toast} from 'sonner'
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/AuthSlice.tsx";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await api.post("http://localhost:3000/register", {
        email,
        username,
        password,
      });
      console.log("Registration successful:", response.data);
      localStorage.setItem("token", response.data.token);
      const userData = {
        user: response.data.user,
      };
      dispatch(setUser(userData), console.log(`user stored successfully${userData.user.username}`));
      toast.success("Account Created successful",{
        duration:1500,
        style: {
          background: "white", 
          color: "black",
          border: "1px solid black"
        },
      });
      setTimeout(() => {
        navigate("/");
      },2000);
      
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.message || "Registration failed");
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
        <RegisterForm
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          error={error}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
