export default function IconDocumentoFrontal(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0058A2"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Marco del DNI */}
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />

      {/* Foto tipo carnet */}
      <rect x="4.5" y="6" width="5" height="6" rx="0.5" fill="#0058A2" stroke="none" />

      {/* Líneas de texto simuladas */}
      <line x1="11" y1="7" x2="18.5" y2="7" />
      <line x1="11" y1="10" x2="18.5" y2="10" />
      <line x1="4.5" y1="14.5" x2="18.5" y2="14.5" />
    </svg>
  );
}
