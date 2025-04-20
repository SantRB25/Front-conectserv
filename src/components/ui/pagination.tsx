import { PaginationLink } from "@/lib/apiAdmin"

const getPageFromUrl = (url: string): number | null => {
  const match = url.match(/page=(\d+)/)
  return match ? parseInt(match[1], 10) : null
}
interface PaginationProps {
  links: PaginationLink[]
  onPageChange: (page: number) => void
}

export default function Pagination({ links, onPageChange }: PaginationProps) {
  return (
    <nav className="flex items-center gap-1">
      {links.map((link, index) => {
        const page = link.url ? getPageFromUrl(link.url) : null

        return (
          <button
            key={index}
            className={`px-3 py-1 rounded ${
              link.active ? 'bg-primary text-white' : 'bg-muted'
            }`}
            onClick={() => page && onPageChange(page)}
            disabled={!page}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        )
      })}
    </nav>
  )
}