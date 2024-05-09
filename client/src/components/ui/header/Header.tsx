import Link from 'next/link'

export const Header = () => {
  return (
    <header className="flex h-14 lg:h-[60px] text-white items-center gap-4 border-b bg-[#AA546D] px-6 bg-[#AA546D] justify-between lg:justify-end">
      <Link
        className="flex items-center gap-2 font-semibold lg:hidden"
        href="/"
      >
        <span className="">Ferreteria</span>
      </Link>
    </header>
  )
}
