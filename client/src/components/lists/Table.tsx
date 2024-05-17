import { TableContainer, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react'
import Pagination from './Pagination'

// Definimos los tipos para las props
type DataTableProps = {
    data: { id: string;[key: string]: any }[]; // Cada dato tiene un ID y valores dinámicos
    columnMapping: { [header: string]: string }; // Mapeo de headers a claves de datos
}

export const DataTable: React.FC<DataTableProps> = ({ data, columnMapping }) => {
    // Obtener los encabezados desde las claves de columnMapping
    const headers = Object.keys(columnMapping);
    console.log(data);
    return (
        <>
            <TableContainer >
                <Table variant="simple" borderRadius="lg" borderColor="gray.200" borderWidth="1px" borderStyle="solid" fontSize="14px">
                    <Thead>
                        <Tr>
                            {headers.map((header, index) => <Th key={index} textAlign="center" verticalAlign="middle">{header}</Th>)}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map((datum) => (
                            <Tr key={datum.id}>
                                {headers.map((header) => (
                                    <Td key={`${datum.id}-${header}`} textAlign="center" verticalAlign="middle">
                                        {datum[columnMapping[header]]}
                                    </Td>

                                ))}
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            <Pagination />
        </>
    )
}
