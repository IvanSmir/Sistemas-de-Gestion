import { TableContainer, Table, Tbody, Td, Th, Thead, Tr, IconButton } from '@chakra-ui/react';
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";


import React from 'react'

// Definimos los tipos para las props
type TablePersonProps = {
    data: { ciRuc: string;[key: string]: any }[]; // Cada dato tiene un ID y valores dinámicos
    columnMapping: { [header: string]: string }; // Mapeo de headers a claves de datos
}

export const TablePerson: React.FC<TablePersonProps> = ({ data, columnMapping }) => {
    // Obtener los encabezados desde las claves de columnMapping
    const headers = Object.keys(columnMapping);

    return (
        <>
            <TableContainer >
                <Table variant="simple" borderRadius="lg" borderColor="gray.200" borderWidth="1px" borderStyle="solid" fontSize="14px">
                    <Thead>
                        <Tr>
                            {headers.map((header, index) => <Th key={index} textAlign="center" verticalAlign="middle">{header}</Th>)}
                            <Th textAlign="center" verticalAlign="middle">Acciones</Th>

                        </Tr>

                    </Thead>
                    <Tbody>
                        {data.map((datum) => (
                            <Tr key={datum.ciRuc}>
                                {headers.map((header) => (
                                    <Td key={`${datum.ciRuc}-${header}`} textAlign="center" verticalAlign="middle">
                                        {datum[columnMapping[header]]}
                                    </Td>

                                ))}

                                <Td textAlign="center" verticalAlign="middle">
                                    <IconButton
                                        aria-label="Edit"
                                        icon={<FaEdit />
                                        }
                                        size="sm"
                                        mr={2}
                                    />
                                    <IconButton
                                        aria-label="Delete"
                                        icon={<MdDeleteForever />
                                        }
                                        size="sm"
                                        colorScheme="red"
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    )
}
