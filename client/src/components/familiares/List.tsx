'use client';
import React, { useState, useEffect, ChangeEvent } from "react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
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
import { ModalDetalles } from "./ModalDetalles";
import { EditFamiliar } from "./Edit";

interface Familiar {
    id: number;
    name: string;
    last_name: string;
    address: string;
    telephone: string;
    email: string;
    ci: string;
    birthday: string;
    relationship: string;
}

export const List: React.FC = () => {
    const initialFamiliares: Familiar[] = [
        {
            id: 1,
            name: "Juan",
            last_name: "Perez",
            address: "Calle 21",
            telephone: "0987564345",
            email: "sdfrd@gmail.com",
            ci: "12345678",
            birthday: "1960-04-06",
            relationship: "Padre",
        },
        {
            id: 2,
            name: "María ",
            last_name: "Gómez",
            address: "Calle 21",
            telephone: "0987564345",
            email: "wed@gmail.com",
            ci: "87654321",
            birthday: "1960-06-12",
            relationship: "Madre",
        },
        {
            id: 3,
            name: "Ana",
            last_name: "Perez",
            address: "Calle 21",
            telephone: "0987564345",
            email: "qwe@gmail.com",
            ci: "45678912",
            birthday: "2002-06-12",
            relationship: "Hija",
        },
        {
            id: 4,
            name: "Analia",
            last_name: "Perez",
            address: "Calle 1",
            telephone: "098x64345",
            email: "gsd@gmail.com",
            ci: "45678912",
            birthday: "2010-06-12",
            relationship: "Hija",
        },
    ];

    const [familiares, setFamiliares] = useState<Familiar[]>(initialFamiliares);
    const [filters, setFilters] = useState<{ ci: string; ageRange: string }>({
        ci: '',
        ageRange: '',
    });
    const [filteredFamiliares, setFilteredFamiliares] = useState<Familiar[]>(initialFamiliares);

    useEffect(() => {
        const filtered = familiares.filter((familiar) => {
            const now = new Date();
            const birthDate = new Date(familiar.birthday);
            const age = now.getFullYear() - birthDate.getFullYear();

            if (filters.ci && !familiar.ci.includes(filters.ci)) {
                return false;
            }

            if (filters.ageRange === 'menores18' && age >= 18) {
                return false;
            }

            if (filters.ageRange === 'mayores18' && age < 18) {
                return false;
            }

            return true;
        });
        setFilteredFamiliares(filtered);
    }, [filters, familiares]);

    const handleCiFilter = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, ci: e.target.value });
    };

    const handleAgeRangeFilter = (e: ChangeEvent<HTMLSelectElement>) => {
        setFilters({ ...filters, ageRange: e.target.value });
    };

    const [selectedFamiliar, setSelectedFamiliar] = useState<Familiar | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

    const handleEditClick = (familiar: Familiar, event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedFamiliar(familiar);
        onEditOpen();
    };

    const handleDeleteClick = (id: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setFamiliares(familiares.filter(familiar => familiar.id !== id));
    };

    const handleRowClick = (familiar: Familiar) => {
        setSelectedFamiliar(familiar);
        onOpen();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (selectedFamiliar) {
            const { name, value } = e.target;
            setSelectedFamiliar({ ...selectedFamiliar, [name]: value });
        }
    };

    const handleSave = () => {
        if (selectedFamiliar) {
            setFamiliares(familiares.map(familiar =>
                familiar.id === selectedFamiliar.id ? selectedFamiliar : familiar
            ));
            onEditClose();
        }
    };

    return (
        <Box position="absolute" top={160} left={300} width={900} height={426} borderRadius="2xl" padding="8px" margin="auto">
            <Flex justifyContent="space-between" mb={6}>
                <Flex gap={2}>
                    <Input
                        placeholder="Número de cédula"
                        value={filters.ci}
                        onChange={handleCiFilter}
                        rounded={15}
                        background='white'
                        color='gray.600'
                        _hover={{ bg: "gray.100" }}
                    />
                    <Select
                        onChange={handleAgeRangeFilter}
                        value={filters.ageRange}
                        rounded={15}
                        background='white'
                        color='gray.600'
                        _hover={{ bg: "gray.100" }}
                    >
                        <option value="">Todos</option>
                        <option value="menores18">Menores de Edad</option>
                        <option value="mayores18">Mayores de Edad</option>
                    </Select>
                </Flex>
                <Button rounded={23} mr={5} fontSize={13} py={3} px={5} bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} gap={2} color='white'>
                    <AddIcon />Agregar Familiar
                </Button>
            </Flex>
            <TableContainer>
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
                        {filteredFamiliares.map((familiar, index) => (
                            <Tr key={index} onClick={() => handleRowClick(familiar)} style={{ cursor: 'pointer' }}>
                                <Td>{familiar.ci}</Td>
                                <Td>{familiar.name}</Td>
                                <Td>{familiar.birthday}</Td>
                                <Td>{familiar.relationship}</Td>
                                <Td>
                                    <EditIcon mr={2} cursor="pointer" onClick={(event) => handleEditClick(familiar, event)} />
                                    <DeleteIcon cursor="pointer" onClick={(event) => handleDeleteClick(familiar.id, event)} />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <ModalDetalles isOpen={isOpen} onClose={onClose} familiar={selectedFamiliar} />
            <EditFamiliar isOpen={isEditOpen} onClose={onEditClose} familiar={selectedFamiliar} onChange={handleChange} onSave={handleSave} />
        </Box>
    );
};
