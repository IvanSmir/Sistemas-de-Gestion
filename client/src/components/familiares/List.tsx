'use client';
import React,{useState} from "react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import ReactPaginate from 'react-paginate';
import {
    Box,
    Flex,
    Heading,
    Button,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from "@chakra-ui/react";

interface Familiar {
    name: string;
    ci: string;
    birthday: string;
    relationship: string;
}

export const List: React.FC = () => {
    const familiares: Familiar[] = [
        {
            name: "Juan Pérez",
            ci: "12345678",
            birthday: "01/01/1990",
            relationship: "Padre",
        },
        {
            name: "María Gómez",
            ci: "87654321",
            birthday: "15/06/1992",
            relationship: "Madre",
        },
        {
            name: "Ana Pérez",
            ci: "45678912",
            birthday: "20/03/2015",
            relationship: "Hija",
        },
    ];
    return (
        <Box position="absolute" top={160} left={300} width={900} height={426}
        borderRadius="2xl" padding="8px">
            <TableContainer position="absolute" top={100}  width={850} height={330} padding="8px 3px" >
                <Table variant="simple" fontSize="14px">
                    <Thead>
                        <Tr>
                            <Th>Número de cédula</Th>
                            <Th>Nombre</Th>
                            <Th>Fecha de nacimiento</Th>
                            <Th>Parentesco</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {familiares.map((familiar, index) => (
                            <Tr key={index}>
                                <Td>{familiar.ci}</Td>
                                <Td>{familiar.name}</Td>
                                <Td>{familiar.birthday}</Td>
                                <Td>{familiar.relationship}</Td>
                                <Td>
                                    <EditIcon mr={2} cursor="pointer" />
                                    <DeleteIcon cursor="pointer" />
                                </Td> 
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};

