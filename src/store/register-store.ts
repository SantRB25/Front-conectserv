import { create } from "zustand"
import { persist } from "zustand/middleware"

interface RegisterState {
  step: number
  formData: {
    service?: string
    zone?: string
    lat?: number
    lng?: number
    names?: string | null
    lastNames?: string
    age?: string
    whatsapp?: string
    password?: string
    frontId?: File
    backId?: File
    selfie?: File
    otp?: string
    isWhatsappVerified?: boolean
    google_id?: string
    facebook_id?: string
    email?: string | null
    registrationType?: "google" | "facebook" | "email"
  }
  setStep: (step: number) => void
  setFormData: (data: Partial<RegisterState["formData"]>) => void
  reset: () => void
}

export const useRegisterStore = create<RegisterState>()(
  persist(
    (set) => ({
      step: 1,
      formData: {},
      setStep: (step) => set({ step }),
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      reset: () => set({ step: 1, formData: {} }),
    }),
    {
      name: "register-storage",
    },
  ),
)

