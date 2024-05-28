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
import { getFamilyMembers, deleteFamilyMember, updateFamilyMember, getFamilyMember } from '@/utils/family.http';
import Relative from "@/types/relative";
import { useAuth } from "../context/AuthProvider";
import { useParams } from "next/navigation";
import { Form } from "./add/Form";
import { on } from "events";

interface Person {
    ciRuc: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    birthDate: string;
}

interface FamilyMember extends Relative {
    id: string;
    familyType: {
        name: string;
    };
    person: Person;
}

interface FamilyMembersResponse {
    data: FamilyMember[];
    currentPage: number;
    limit: number;
    totalPages: number;
    totalCount: number;
}

export const List: React.FC = () => {
    const { id } = useParams();
    const [familiares, setFamiliares] = useState<FamilyMember[]>([]);
    const [filters, setFilters] = useState<{ ciRuc: string; ageRange: string }>({
        ciRuc: '',
        ageRange: '',
    });
    const [filteredFamiliares, setFilteredFamiliares] = useState<FamilyMember[]>([]);
    const [selectedFamiliar, setSelectedFamiliar] = useState<FamilyMember | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

    const auth = useAuth();

    useEffect(() => {
        const fetchFamiliares = async () => {
            try {
                const familiaresData: FamilyMembersResponse = await getFamilyMembers(id as string);
                console.log('Familiares recibidos:', familiaresData);
                setFamiliares(familiaresData.data);
                setFilteredFamiliares(familiaresData.data);
            } catch (error) {
                console.error('Error al obtener los familiares:', error);
            }
        };

        fetchFamiliares();
    }, [id]);

    useEffect(() => {
        const filtered = familiares.filter((familiar) => {
            const now = new Date();
            const birthDate = new Date(familiar.person.birthDate);
            const age = now.getFullYear() - birthDate.getFullYear();

            if (filters.ciRuc && !familiar.person.ciRuc.includes(filters.ciRuc)) {
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
        setFilters({ ...filters, ciRuc: e.target.value });
    };

    const handleAgeRangeFilter = (e: ChangeEvent<HTMLSelectElement>) => {
        setFilters({ ...filters, ageRange: e.target.value });
    };

    const handleRowClick = async (familiar: FamilyMember) => {
        try {
            const fetchedFamiliar = await getFamilyMember(familiar.id);
            setSelectedFamiliar(fetchedFamiliar);
            onOpen();
        } catch (error) {
            console.error('Error al obtener los detalles del familiar:', error);
        }
    };

    const handleEditClick = (familiar: FamilyMember, event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedFamiliar(familiar);
        onEditOpen();
    };

    const handleDeleteClick = async (id: string, event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            const { user } = auth;
            const token = user?.token || ''; // Obteniendo el token desde el contexto de autenticación
            console.log("Token usado para eliminar:", token); // Verificar token
            await deleteFamilyMember(id, token);
            setFamiliares(familiares.filter(familiar => familiar.id !== id));
        } catch (error) {
            console.error('Error al eliminar el familiar:', error);
            alert('No tienes autorización para realizar esta acción.');
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (selectedFamiliar) {
            const { name, value } = e.target;
            setSelectedFamiliar({ ...selectedFamiliar, person: { ...selectedFamiliar.person, [name]: value } });
        }
    };

    const handleSave = async () => {
        if (selectedFamiliar) {
            try {
                const { user } = auth;
                const token = user?.token || '';
                const updatedData = {
                    familyType: selectedFamiliar.familyType.name,
                    ...selectedFamiliar.person,
                };
                await updateFamilyMember(selectedFamiliar.id, updatedData, token);
                setFamiliares(familiares.map(familiar =>
                    familiar.id === selectedFamiliar.id ? { ...selectedFamiliar, person: updatedData } : familiar
                ));
                onEditClose();
            } catch (error) {
                console.error('Error al guardar los cambios:', error);
                alert('No tienes autorización para realizar esta acción.');
            }
        }
    };




    return (
        <Box backgroundColor={'white'} width={900} height={426} borderRadius="2xl" padding="8px" margin="auto" >
            <Flex justifyContent="space-between" mb={6} >
                <Flex gap={2}>
                    <Input
                        placeholder="Número de cédula/RUC"
                        value={filters.ciRuc}
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

                <Form
                    isOpen={isOpen}
                    onClose={onClose}
                />
                <Button onClick={onOpen} rounded={23} mr={5} fontSize={13} py={3} px={5} bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} gap={2} color='white'>
                    <AddIcon />Agregar Familiar
                </Button>
            </Flex>
            <TableContainer>
                <Table variant="simple" fontSize="14px">
                    <Thead>
                        <Tr>
                            <Th>Número de cédula/RUC</Th>
                            <Th>Nombre</Th>
                            <Th>Fecha de nacimiento</Th>
                            <Th>Parentesco</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredFamiliares.map((familiar, index) => (
                            <Tr key={index} style={{ cursor: 'pointer' }}>
                                <Td onClick={() => handleRowClick(familiar)}>{familiar.person.ciRuc}</Td>
                                <Td>{familiar.person.name}</Td>
                                <Td>{new Date(familiar.person.birthDate).toLocaleDateString()}</Td>
                                <Td>{familiar.familyType.name}</Td>
                                <Td>
                                    <EditIcon
                                        mr={2}
                                        cursor="pointer"
                                        onClick={(event) => handleEditClick(familiar, event)}
                                    />
                                    <DeleteIcon
                                        cursor="pointer"
                                        onClick={(event) => handleDeleteClick(familiar.id, event)}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            {selectedFamiliar && (
                <ModalDetalles isOpen={isOpen} onClose={onClose} relative={selectedFamiliar} />
            )}
            {selectedFamiliar && (
                <EditFamiliar
                    isOpen={isEditOpen}
                    onClose={onEditClose}
                    relative={selectedFamiliar}
                    onChange={handleChange}
                    onSave={handleSave}
                    familiarId={selectedFamiliar.id}
                />
            )}
        </Box>
    );
};








