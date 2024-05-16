'use client'
import React, { useState, useEffect } from "react";
import { EditIcon, DeleteIcon, SmallAddIcon, AddIcon } from "@chakra-ui/icons";
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
    Circle,
    Button,
    Link,
    Spacer,
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

    const [filters, setFilters] = useState({
        ci: '',
        ageRange: '',
    });
    const [filteredFamiliares, setFilteredFamiliares] = useState<Familiar[]>(familiares);

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
    }, [filters]);

    const handleCiFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, ci: e.target.value });
    };

    const handleAgeRangeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters({ ...filters, ageRange: e.target.value });
    };
    
    return (
        <Box position="absolute">
            <Flex justifyContent="flex-start" mb={4}>
                <Box mr={4}>
                    <label htmlFor="ci">Número de cédula:</label>
                    <Input
                        id="ci"
                        type="text"
                        value={filters.ci}
                        onChange={handleCiFilter}
                        placeholder="Cédula"
                        size="sm"
                    />
                </Box>
                <Box>
                    <label htmlFor="ageRange">Rango de edad:</label>
                    <Select id="ageRange" value={filters.ageRange} onChange={handleAgeRangeFilter} size="sm">
                        <option value="">Todos</option>
                        <option value="menores18">Menores de 18</option>
                        <option value="mayores18">Mayores de 18</option>
                    </Select>
                </Box>
                <Spacer />
                <Box >
                    <Link href="/familiares/add">
                        <Button rounded={23} background='#AA546D' color='white'   ><AddIcon /> </Button>
                    </Link>
                </Box>
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
export default List;