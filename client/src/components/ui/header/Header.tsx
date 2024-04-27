import Link from 'next/link'

export const Header = () => {
  return (
            <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 justify-between lg:justify-end">
              <Link
                className="flex items-center gap-2 font-semibold lg:hidden"
                href="/"
              >
                <span className="">Ferreteria</span>
              </Link>
            </header>
  )
}
