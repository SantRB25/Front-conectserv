"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useRegisterStore } from "@/store/register-store";
import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Info, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
//import { signIn } from "@/auth";
import { signIn } from "next-auth/react"
const phoneRegex = /^\+[1-9]\d{1,14}$/;

const formSchema = z.object({
  names: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  lastNames: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  age: z.string().min(2, {
    message: "La edad es requerida.",
  }),
  whatsapp: z.string().refine(
    (value) => {
      // Aceptar números locales como 0991... o internacionales como +519...
      return /^0\d{8,9}$/.test(value) || /^\+\d{10,15}$/.test(value);
    },
    {
      message:
        "Número inválido. Usa formato local (ej: 0991447585) o internacional (ej: +51993187237)",
    }
  ),
  isWhatsappVerified: z.boolean().optional(),
});
const normalizeParaguayPhoneNumber = (rawNumber: string): string => {
  if (rawNumber.startsWith("+")) {
    return rawNumber; // Ya viene con código de país
  }

  if (rawNumber.startsWith("0")) {
    // Local paraguayo, reemplazar 0 por +595
    return "+595" + rawNumber.substring(1);
  }

  // Si no tiene ni + ni 0, asumimos inválido (pero por si acaso)
  return rawNumber;
};
export function StepThree() {
  const router = useRouter();
  const { setStep, setFormData, formData, reset } = useRegisterStore();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const [verificationSuccess, setVerificationSuccess] = useState<string | null>(
    null
  );
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Para el reenvío de código
  const [canResend, setCanResend] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60); // 60 segundos (1 minuto)
  const [isResending, setIsResending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      names: formData.names || "",
      lastNames: formData.lastNames || "",
      age: formData.age || "",
      whatsapp: formData.whatsapp || "",
      isWhatsappVerified: formData.isWhatsappVerified || false,
    },
  });

  // Restaurar el estado verificado si ya estaba verificado anteriormente
  useEffect(() => {
    if (formData.isWhatsappVerified) {
      setIsVerified(true);
    }
  }, [formData.isWhatsappVerified]);

  // Temporizador para el reenvío de código
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showVerificationInput && !canResend && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showVerificationInput, canResend, resendCountdown]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isVerified) {
      setVerificationError(
        "Por favor, verifica tu número de WhatsApp antes de continuar."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const allFormData = {
        ...formData,
        ...values,
      };
      // 1. Registrar al usuario en la API
      const response = await api.professional.register(allFormData);

      if (!response.success) {
        throw new Error(response.message || "Error en el registro");
      }

      let credentials: Record<string, string> = {};
      console.log(allFormData);
      switch (allFormData.registrationType) {
        case "google":
          if (!allFormData.google_id) {
            throw new Error(
              "No se encontró el ID de Google para iniciar sesión"
            );
          }
          credentials = {
            type: "google",
            id: allFormData.google_id,
          };
          break;
        case "whatsapp":
          credentials = {
            type: "whatsapp",
            id: allFormData.whatsapp,
          };
          break;
      }

      // 3. Iniciar sesión con NextAuth
      const signInResult = await signIn("credentials", {
        ...credentials,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error || "Error al iniciar sesión");
      }
      router.push("/dashboard/informacion")
      //router.push("/register/success")
    } catch (error: any) {
      console.error("Error al finalizar el registro:", error);
      setVerificationError(
        error.message || "Error al finalizar el registro. Inténtalo nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const sendVerificationCode = async (isResend = false) => {
    if (isResend) setIsResending(true);
    else setIsVerifying(true);

    setVerificationError(null);
    setVerificationSuccess(null);
    setDebugInfo(null);

    const rawWhatsapp = form.getValues("whatsapp");
    const normalizedWhatsapp = normalizeParaguayPhoneNumber(rawWhatsapp);

    // Validación previa (por si acaso)
    if (!/^\+\d{10,15}$/.test(normalizedWhatsapp)) {
      form.setError("whatsapp", {
        type: "manual",
        message:
          "Número inválido luego de la conversión a formato internacional.",
      });
      setIsVerifying(false);
      setIsResending(false);
      return;
    }

    try {
      const response = await api.verification.sendCode(normalizedWhatsapp);

      if (response.success) {
        const message = isResend
          ? "Código reenviado a tu WhatsApp. Por favor, ingrésalo a continuación."
          : "Código enviado a tu WhatsApp. Por favor, ingrésalo a continuación.";

        setVerificationSuccess(message);
        setShowVerificationInput(true);
        setCanResend(false);
        setResendCountdown(60); // Reiniciar el contador a 60 segundos
      } else {
        setVerificationError(
          response.error || "Error al enviar el código. Inténtalo nuevamente."
        );
        // Mostrar información de depuración si está disponible
        if (response.details) {
          setDebugInfo(
            `Detalles del error: ${JSON.stringify(response.details)}`
          );
        }
      }
    } catch (error: any) {
      console.error("Error al enviar código de verificación:", error);
      setVerificationError(
        error.message ||
          "Error al conectar con el servidor. Inténtalo nuevamente."
      );
      setDebugInfo(`Error: ${error.message}`);
    } finally {
      setIsVerifying(false);
      setIsResending(false);
    }
  };

  const verifyCode = async () => {
    setVerificationError(null);
    setDebugInfo(null);

    if (!verificationCode || verificationCode.length !== 6) {
      setVerificationError(
        "Por favor, ingresa el código de 6 dígitos completo."
      );
      return;
    }

    setIsCheckingCode(true);
    const rawWhatsapp = form.getValues("whatsapp");
    const normalizedWhatsapp = normalizeParaguayPhoneNumber(rawWhatsapp);
    try {
      // Llamar a la API para verificar el código
      const response = await api.verification.checkCode(
        normalizedWhatsapp,
        verificationCode
      );

      if (response.success) {
        setIsVerified(true);
        setShowVerificationInput(false);
        form.setValue("isWhatsappVerified", true);
        setVerificationSuccess(
          "Número verificado correctamente. Ahora puedes finalizar tu registro."
        );
      } else {
        setVerificationError(
          response.error || "Código incorrecto. Inténtalo nuevamente."
        );
        // Mostrar información de depuración si está disponible
        if (response.error) {
          setDebugInfo(`Error: ${response.error}`);
        }
      }
    } catch (error: any) {
      console.error("Error al verificar código:", error);
      setVerificationError(
        error.message ||
          "Error al conectar con el servidor. Inténtalo nuevamente."
      );
      setDebugInfo(`Error: ${error.message}`);
    } finally {
      setIsCheckingCode(false);
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      sendVerificationCode(true);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="names"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Nombres" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastNames"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Apellidos" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="number" {...field} placeholder="Edad" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="whatsapp"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-3">
                <FormControl>
                  <Input
                    type="tel"
                    {...field}
                    disabled={isVerified}
                    placeholder="Número de WhatsApp"
                    className={`w-full ${
                      isVerified ? "bg-green-50 border-green-200" : ""
                    }`}
                  />
                </FormControl>
                {!isVerified ? (
                  <Button
                    type="button"
                    onClick={() => sendVerificationCode(false)}
                    disabled={isVerifying}
                    variant="outline"
                  >
                    {isVerifying ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                    ) : null}
                    Verificar
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-green-50 text-green-600 border-green-200"
                    disabled
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verificado
                  </Button>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {verificationError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{verificationError}</AlertDescription>
          </Alert>
        )}

        {verificationSuccess && (
          <Alert
            variant="default"
            className="py-2 bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{verificationSuccess}</AlertDescription>
          </Alert>
        )}

        {debugInfo && (
          <Alert
            variant="default"
            className="py-2 bg-blue-50 text-blue-700 border-blue-200"
          >
            <Info className="h-4 w-4" />
            <AlertDescription>
              <details>
                <summary className="cursor-pointer font-medium">
                  Información de depuración
                </summary>
                <pre className="mt-2 text-xs overflow-auto p-2 bg-blue-100 rounded">
                  {debugInfo}
                </pre>
              </details>
            </AlertDescription>
          </Alert>
        )}

        {showVerificationInput && !isVerified && (
          <div className="space-y-4 p-4 border rounded-md bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Ingresa el código de 6 dígitos que recibiste en tu WhatsApp:
            </p>
            <div className="flex gap-3">
              <Input
                type="text"
                maxLength={6}
                placeholder="Código de 6 dígitos"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="text-center font-mono text-lg"
              />
              <Button
                type="button"
                onClick={verifyCode}
                disabled={isCheckingCode}
              >
                {isCheckingCode ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                ) : null}
                Validar
              </Button>
            </div>

            <div className="flex items-center justify-between mt-2 text-sm">
              <span className="text-muted-foreground">
                ¿No recibiste el código?
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResendCode}
                disabled={!canResend || isResending}
                className="flex items-center"
              >
                {isResending ? (
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                ) : (
                  <RefreshCw className="h-3 w-3 mr-2" />
                )}
                {canResend
                  ? "Reenviar código"
                  : `Reenviar en ${resendCountdown}s`}
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-between gap-4">
          <Button type="button" variant="outline" onClick={() => setStep(2)}>
            Atrás
          </Button>
          <Button
            type="submit"
            disabled={!isVerified || isSubmitting}
            className={!isVerified ? "opacity-50 cursor-not-allowed" : ""}
          >
            {isSubmitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
            ) : null}
            Finalizar registro
          </Button>
        </div>
      </form>
    </Form>
  );
}
