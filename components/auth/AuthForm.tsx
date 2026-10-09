"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import LoginExperience from "@/components/auth/LoginExperience";
import { createClient } from "@/lib/supabase/client";
import { createProfile } from "@/lib/profile";
import { getSafeNext } from "@/lib/auth-routing";

type AuthMode = "login" | "register";

interface AuthFormProps {
  mode: AuthMode;
  next: string;
  verified?: boolean;
}

export default function AuthForm({ mode, next, verified = false }: AuthFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const isRegister = mode === "register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (isRegister && (!firstName.trim() || !lastName.trim())) {
      setError("First name and last name are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    const result = isRegister
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
            },
          },
        })
      : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setError(
        isRegister && result.error.message.toLowerCase().includes("already")
          ? "An account with this email already exists."
          : isRegister
            ? result.error.message
            : "Invalid email or password.",
      );
      setIsLoading(false);
      return;
    }

    if (isRegister && result.data.user && result.data.session) {
      const { error: profileError } = await createProfile(
        supabase,
        result.data.user.id,
        firstName.trim(),
        lastName.trim(),
      );
      if (profileError) {
        console.error("Profile creation failed after registration", {
          userId: result.data.user.id,
          message: profileError.message,
          code: profileError.code,
          details: profileError.details,
          hint: profileError.hint,
        });
        setError(
          "Your account was created, but your profile could not be saved.",
        );
        setIsLoading(false);
        return;
      }
    }

    if (isRegister) {
      if (result.data.session) {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.error("Unable to clear the signup session", {
            code: signOutError.code,
          });
        }
      }

      const verifyParams = new URLSearchParams({
        email,
        next: getSafeNext(next),
      });
      router.replace(`/verify-email?${verifyParams.toString()}`);
      return;
    }

    router.replace(getSafeNext(next));
    router.refresh();
  }

  // Carry a non-default destination over between the two auth routes.
  const safeNext = getSafeNext(next);
  const nextQuery = safeNext === getSafeNext(null) ? "" : `?${new URLSearchParams({ next: safeNext })}`;

  return (
    <LoginExperience
      mode={mode}
      firstName={firstName} lastName={lastName} confirmPassword={confirmPassword}
      onFirstNameChange={setFirstName} onLastNameChange={setLastName} onConfirmPasswordChange={setConfirmPassword}
      loginHref={`/login${nextQuery}`} registerHref={`/register${nextQuery}`}
      email={email} password={password} error={error} message={message}
      isLoading={isLoading} showPassword={showPassword} verified={verified}
      onEmailChange={setEmail} onPasswordChange={setPassword}
      onTogglePassword={() => setShowPassword((visible) => !visible)}
      onSubmit={handleSubmit}
    />
  );
}
