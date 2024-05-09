'use client'
import React, { useEffect, useState } from "react";
import {
    TableContainer,
    Table,
    TableCaption,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
} from "@chakra-ui/react";

interface Familiar {
    name: string;
    birthday: string;
    relationship: string;
}

export const List: React.FC = () => {
    const [formData, setFormData] = useState<Familiar>({
        name: "",
        birthday: "",
        relationship: "",
    });

    useEffect(() => {

    }, []);

    return (

        <TableContainer>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Nombre</Th>
                        <Th>Fecha de cumpleaños</Th>
                        <Th>Parentesco</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>{formData.name}</Td>
                        <Td>{formData.birthday}</Td>
                        <Td>{formData.relationship}</Td>
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    );
};