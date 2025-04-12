"use client"
import { Button } from "@/components/ui/button"
import { useRegisterStore } from "@/store/register-store"
import { GoogleRegisterButton } from "../google-register-button"

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
          onClick={() => setStep(3)}
        >
          <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
            <path
              d="m.76 21.24 1.412-5.12A10.324 10.324 0 0 1 .76 10.93C.76 5.35 5.35.76 10.964.76 16.58.76 21.24 5.35 21.24 10.93c0 5.578-4.661 10.31-10.276 10.31-1.765 0-3.46-.565-4.978-1.413L.76 21.24Z"
              fill="#EDEDED"
            ></path>
            <path
              d="m6.268 17.991.318.177c1.307.812 2.825 1.306 4.414 1.306 4.626 0 8.474-3.848 8.474-8.545 0-4.696-3.848-8.404-8.51-8.404-4.66 0-8.439 3.743-8.439 8.404 0 1.624.46 3.213 1.307 4.555l.212.318-.812 2.966 3.036-.777Z"
              fill="#25D366"
            ></path>
            <path
              d="m8.245 6.198-.671-.036a.802.802 0 0 0-.565.212c-.318.283-.848.812-.989 1.519-.247 1.059.141 2.33 1.06 3.601.918 1.271 2.683 3.32 5.79 4.202.989.283 1.766.106 2.402-.282.494-.318.812-.812.918-1.342l.105-.494a.355.355 0 0 0-.176-.389l-2.225-1.024a.337.337 0 0 0-.423.106l-.883 1.13a.275.275 0 0 1-.283.07c-.6-.211-2.613-1.059-3.707-3.177-.036-.106-.036-.212.035-.283l.848-.953c.07-.106.105-.247.07-.353L8.527 6.41a.308.308 0 0 0-.282-.212Z"
              fill="#FEFEFE"
            ></path>
          </svg>{" "}
          <span className="text-white font-medium ml-3">Continuar con Whatsapp</span>
        </button>

        <Button variant="outline" onClick={() => setStep(1)}>
          Atrás
        </Button>
      </div>
    </>
  )
}

