export default function IconFotoPerfil(props: React.SVGProps<SVGSVGElement>) {
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
       <circle cx="12" cy="8" r="4" />
       <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}
