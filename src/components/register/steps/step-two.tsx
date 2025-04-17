"use client"
import { Button } from "@/components/ui/button"
import { useRegisterStore } from "@/store/register-store"
import { GoogleRegisterButton } from "../google-register-button"
import GoogleIcon from "@/components/ui/google-icon";
export function StepTwo() {
  const { setStep, setFormData } = useRegisterStore()

  return (
    <>
      <div className="space-y-6">
        <GoogleRegisterButton />

        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-300 flex-grow"></div>
          <span className="px-3 text-sm text-gray-500 bg-white">O</span>
          <div className="border-t border-gray-300 flex-grow"></div>
        </div>

        <button
          className="my-5 flex items-center justify-center w-full px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-[#25D366] hover:bg-opacity-90 hover:pointer text-white focus:outline-none focus:ring-2 focus:ring-gray-300 "
          onClick={() => {
            setFormData({ registrationType: "whatsapp" });
            setStep(3);
          }}
        >
          <GoogleIcon/>{" "}
          <span className="text-white font-medium ml-3">Continuar con Whatsapp</span>
        </button>

        <Button variant="outline" onClick={() => setStep(1)}>
          Atrás
        </Button>
      </div>
    </>
  )
}

