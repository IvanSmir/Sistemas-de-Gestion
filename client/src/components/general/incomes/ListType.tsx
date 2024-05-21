'use client';
import React, { useState, useEffect, ChangeEvent } from "react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { IncomeType } from "@/components/general/incomes/incomeType";
import {
    Box,
    Flex,
    Input,
    Select,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    useDisclosure
} from "@chakra-ui/react";

interface IncomeType {
    name: string,
    description: string
    deductible: boolean
}

const inicialIncomeTypes: IncomeType[] = [
    {
        name: "Administrador",
        description: "Administrador de la aplicación",
        deductible: true,
    },
    {
        name: "Empleado",
        description: "Empleado de la aplicación",
        deductible: true,
    },
    {
        name: "Supervisor",
        description: "Supervisor de la aplicación",
        deductible: true,
    },
];
export const ListIncomeTypes: React.FC = () => {

    const [incomeType, setIncomeType] = useState<IncomeType[]>(inicialIncomeTypes);

    const [filters, setFilters] = useState<{ name: string }>({
        name: '',
    });
    const [filteredIncomes, setFilteredIncomes] = useState<IncomeType[]>([]);


    useEffect(() => {

        const filtered = inicialIncomeTypes.filter((incomeType) => {
            if (filters.name && !incomeType.name.includes(filters.name)) {
                return false;
            }
            return true;
        });
        setFilteredIncomes(filtered);
    }, [filters]);

    const handleNameFilter = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, name: e.target.value });
    };
    const [selectedIncomeType, setSelectedIncomeType] = useState<IncomeType | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    /*
        const handleEditClick = (position: IncomeType, event: React.MouseEvent) => {
            event.stopPropagation();
            setSelectedPosition(position);
            onEditOpen();
        };
    */


    const handleRowClick = (incomeType: IncomeType) => {
        setSelectedIncomeType(incomeType);
        onOpen();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (selectedIncomeType) {
            const { name, value } = e.target;
            setSelectedIncomeType({ ...selectedIncomeType, [name]: value });

        }
    };
    const handleAddIncomeType = () => {

    }

    const handleSave = () => {
        /*
        if (selectedPosition) {
            setinicialIncomeTypes(inicialIncomeTypes.map(position =>
                position.id === selectedPosition.id ? selectedPosition : position
            ));
            onEditClose();
        }
        */
    };

    return (
        <Box backgroundColor={'white'} top={160} left={300} width={900} height={426} borderRadius="2xl" padding="8px" margin="auto" >
            <Flex justifyContent="space-between" mb={6} >
                <Flex gap={2}>
                    <Input
                        placeholder="Nombre"
                        value={filters.name}
                        onChange={handleNameFilter}
                        rounded={15}
                        background='white'
                        color='gray.600'
                        _hover={{ bg: "gray.100" }}
                    />
                </Flex>
                <IncomeType isOpen={isOpen} onClose={onClose} />
                <Button onClick={onOpen}>Agregar Tipo de Ingreso</Button>

            </Flex>
            <TableContainer>
                <Table variant="simple" fontSize="14px">
                    <Thead>
                        <Tr>
                            <Th>Nombre</Th>
                            <Th>Descripcion</Th>
                            <Th>Es deducible</Th>

                        </Tr>
                    </Thead>
                    <Tbody>

                        {filteredIncomes.map((incomeType, index) => (
                            <Tr key={index} onClick={() => handleRowClick(incomeType)} style={{ cursor: 'pointer' }}>
                                <Td>{incomeType.name}</Td>
                                <Td>{incomeType.description}</Td>
                                <Td>{incomeType.deductible ? 'Si' : 'No'}</Td>

                                <Td>
                                    <EditIcon mr={2} cursor="pointer"/* onClick={(event) => handleEditClick(incomeType, event)}*/ />
                                    <DeleteIcon cursor="pointer" /* onClick={(event) => handleDeleteClick(incomeType.id, event)} */ />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>

    );
};