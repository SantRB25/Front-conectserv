"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRegisterStore } from "@/store/register-store";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export function GoogleRegisterButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setFormData, setStep } = useRegisterStore();
  const router = useRouter();


  useEffect(() => {
    // Obtener el token de la URL
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    if (accessToken) {
      fetchUserData(accessToken);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      const verifyResponse = await api.verification.verifyGoogleId(data.sub);

      if (verifyResponse.success) {
        // El usuario ya existe, redirigir a login
        router.push("/login?message=user-exists");
        return;
      }

      setFormData({
        names: data.given_name || "",
        lastNames: data.family_name || "",
        email: data.email || "",
        google_id: data.sub,
        registrationType: "google",
      });

      // Avanzar al paso 3 (datos personales)
      setStep(3);
    } catch (error) {
      console.error("Error al obtener datos de Google", error);
    }
  };

  const handleGoogleClick = () => {

    setFormData({ registrationType: "google" });
    
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/register`;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile&prompt=select_account`;

    window.location.href = googleAuthUrl;
  };

  return (
    <>
      {/* Botón personalizado */}
      <Button
        variant="outline"
        className="w-full h-12"
        onClick={handleGoogleClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
        ) : (
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
        )}
        Continuar con Google
      </Button>

      {/* Div para el botón de Google (opcional) */}
      <div id="google-button" className="hidden"></div>

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </>
  );
}
