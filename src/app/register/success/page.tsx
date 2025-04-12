import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RegisterSuccessPage() {
  return (
    <div className="py-16">
      <div className="container max-w-2xl mx-auto px-4 text-center">
        <div className="space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold">¡Registro Completado!</h1>
          <p className="text-muted-foreground">
            Tu cuenta ha sido creada exitosamente. Nuestro equipo revisará tu información y te notificará cuando tu
            cuenta esté activada.
          </p>
          <div className="pt-4">
            <Link href="/">
              <Button>Volver al inicio</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

