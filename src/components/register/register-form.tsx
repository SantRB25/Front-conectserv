"use client"

import { useEffect } from "react"
import { useRegisterStore } from "@/store/register-store"
import { StepOne } from "./steps/step-one"
import { StepTwo } from "./steps/step-two"
import { StepThree } from "./steps/step-three"
import { StepFour } from "./steps/step-four"

interface RegisterFormProps {
  initialStep?: number
  googleUserData?: {
    names: string
    lastNames: string
    email: string
    google_id: string
    picture?: string
  }
}

export function RegisterForm({ initialStep = 1, googleUserData }: RegisterFormProps) {
  const { step, setStep, setFormData, formData } = useRegisterStore()
  const registrationType = formData.registrationType

  // Inicializar con datos de Google si están disponibles
  useEffect(() => {
    if (googleUserData) {
      setFormData({
        ...googleUserData,
        registrationType: "google",
      })
      setStep(initialStep)
    }
  }, [googleUserData, setFormData, setStep, initialStep])

  // Determinar el número total de pasos según el tipo de registro
  const totalSteps = registrationType === "google" ? 3 : 4

  return (
    <>
      <div>
        <h1 className="text-3xl font-semibold">Únete</h1>
        <h1 className="text-3xl font-semibold my-3">Crea tu cuenta ConectServ</h1>
        <p className="my-3">
          y sé parte de la comunidad que conecta profesionales con clientes. Encuentra expertos en carpintería,
          albañilería, plomería y más, o si eres un profesional, ofrece tus servicios y haz crecer tu negocio.
        </p>
      </div>

      {step === 1 && <StepOne />}
      {step === 2 && <StepTwo />}
      {step === 3 && <StepThree />}
      {step === 4 && <StepFour />}

      <div className="flex justify-between pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Paso {step === 1 ? 1 : step - 1} de {totalSteps}
        </p>
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                (step === 1 && i === 0) || (step > 1 && i === step - 2) ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  )
}

