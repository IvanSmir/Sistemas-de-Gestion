'use client'

import { IncomeType } from "@/components/general/incomes/incomeType";
import { Button, useDisclosure } from "@chakra-ui/react";


const ListPositionsPage = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    return (

        <>
            <IncomeType isOpen={isOpen} onClose={onClose} />
            <Button onClick={onOpen}>Agregar Tipo de Ingreso</Button>
        </>
    );
};

export default ListPositionsPage;
