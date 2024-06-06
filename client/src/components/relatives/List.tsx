import React, { useState, useEffect, ChangeEvent, useCallback } from "react";
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
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import { ModalDetalles } from "./ModalDetalles";
import { EditForm } from "./Edit";
import { getFamilyMembers, deleteFamilyMember, updateFamilyMember, getFamilyMember } from '@/utils/family.http';
import Relative from "@/types/relative";
import { useAuth } from "../context/AuthProvider";
import { useParams } from "next/navigation";
import { Form } from "./add/Form";
import { on } from "events";
import ModalEliminar from "./ModalEliminar";

interface Person {
    ciRuc: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    birthDate: string;
    gender: string;
}

interface FamilyMember extends Relative {
    id: string;
    familyType: {
        name: string;
        id: string;
    }
    person: Person;
}



interface FamilyMembersResponse {
    data: FamilyMember[];
    currentPage: number;
    limit: number;
    totalPages: number;
    totalCount: number;
}

interface ListProps {
    employeeCiRuc: string;
};

export const List: React.FC<ListProps> = ({ employeeCiRuc }) => {
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
    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
    const [isModalOpen, setModalOpen] = useState(false);

    const toast = useToast();

    const auth = useAuth();

    const fetchFamiliares = useCallback(async () => {
        try {
            const familiaresData: FamilyMembersResponse = await getFamilyMembers(id as string);
            console.log('Familiares recibidos:', familiaresData);
            setFamiliares(familiaresData.data);
            setFilteredFamiliares(familiaresData.data);
        } catch (error) {
            console.error('Error al obtener los familiares:', error);
        }
    }, [id]);

    useEffect(() => {
        fetchFamiliares();
    }, [id, fetchFamiliares]);

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

    const handleDeleteClick = (familiar: FamilyMember, event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedFamiliar(familiar); 
        setModalOpen(true); // Abre el modal de eliminación
    };
    
    const confirmDelete = async (id: string) => {
        try {
            const { user } = auth;
            const token = user?.token || ''; // Obteniendo el token desde el contexto de autenticación
            console.log("Token usado para eliminar:", token); // Verificar token
            await deleteFamilyMember(id, token);
            setFamiliares(familiares.filter(familiar => familiar.id !== id));
            setModalOpen(false);
            toast({
                title: "Familiar eliminado",
                description: "El familiar ha sido eliminado correctamente.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error al eliminar el familiar:', error);
            alert('No tienes autorización para realizar esta acción.');
        }
    };
    


    /*
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
*/



    return (
        <Box backgroundColor={'white'} borderRadius="2xl" padding="8px" >
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
                    isOpen={isAddOpen}
                    onClose={onAddClose}
                    relatives={familiares}
                    employeeCiRuc={employeeCiRuc}
                    fetchDataFamily={fetchFamiliares}

                />
                <Button onClick={onAddOpen} rounded={23} mr={5} fontSize={13} py={3} px={5} bgColor='gray.700' _hover={{ bgColor: "gray.800" }} gap={2} color='white'>
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
                            <Tr key={index} >
                                <Td style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => handleRowClick(familiar)}>{familiar.person.ciRuc}</Td>
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
                                        onClick={(event) => handleDeleteClick(familiar, event)}
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
                <EditForm
                    isOpen={isEditOpen}
                    onClose={onEditClose}
                    familyMember={selectedFamiliar}
                    fetchDataFamily={fetchFamiliares}
                />
            )}
            <ModalEliminar
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={() => confirmDelete(selectedFamiliar?.id || '')}
            />
        </Box>
    );
};








