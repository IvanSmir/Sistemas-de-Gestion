'use client'
import { Income } from '@/components/general/incomes/Income';
import { Button, useDisclosure } from '@chakra-ui/react';
import React from 'react'

const IncomePage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Income isOpen={isOpen} onClose={onClose} />
            <Button onClick={onOpen}>Agregar Ingreso</Button>
        </>
    )
}
export default IncomePage;