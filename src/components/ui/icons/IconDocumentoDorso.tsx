export default function IconDocumentoDorso(props: React.SVGProps<SVGSVGElement>) {
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
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
      <line x1="4" y1="8" x2="20" y2="8" />
      <line x1="4" y1="12" x2="16" y2="12" />
      <rect x="4" y="16" width="16" height="2" fill="#0058A2" stroke="none" />
    </svg>
  );
}
