import Link from 'next/link'
import React from 'react'
import { NavItem } from './NavItem'
import { Button, ButtonGroup } from '@chakra-ui/react'

export const NavBar = () => {
  return (
    <div className="hidden border-r bg-[#AA546D] lg:block bg-[#AA546D]">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-5">
          <Link
            className="flex items-center gap-2 font-semibold"
            href="/"
          >
            <span className="">Ferreteria</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <NavItem href="/generales/cargos  ">
              Datos Generales
            </NavItem>
            <NavItem href="/funcionarios">
              Funcionarios
            </NavItem>
            <NavItem href="/asistencias">
              Asistencias
            </NavItem>

          </nav>
        </div>
      </div>
    </div>
  )
}
