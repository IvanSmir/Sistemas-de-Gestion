'use client';
import React, { useState, useEffect, ChangeEvent } from "react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { IncomeType as ModalIncomeType } from "@/components/general/incomes/incomeType";
import { getIncomeTypes, deleteIncomeType } from '@/utils/finance.http';
import { useAuth } from '@/components/context/AuthProvider';
import ModalEliminar from "@/components/relatives/ModalEliminar";
import {
    Box,
    Flex,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    useDisclosure,
    useToast,
    Heading
} from "@chakra-ui/react";

interface IncomeType {
    id?: string;
    name: string,
    deductible: boolean
}

export const ListIncomeTypes: React.FC = () => {
    const toast = useToast();
    const [incomes, setIncomes] = useState<IncomeType[]>([]);
    const [selectedIncome, setSelectedIncome] = useState<IncomeType | null>(null);
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
    const [isModalOpen, setModalOpen] = useState(false);
    const [newIncomeType, setNewIncomeType] = useState<IncomeType | null>(null);
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const [idToDelete, setIdToDelete] = useState<string | null>(null);
    const auth = useAuth();

    useEffect(() => {
        const fetchIncomes = async () => {
            try {
                const { user } = auth;
                const token = user?.token || '';
                const data = await getIncomeTypes(token);
                setIncomes(data);
            } catch (error) {
                console.error('Error al obtener tipos de ingresos:', error);
            }
        };

        fetchIncomes();
    }, [auth, isAddOpen, isEditOpen]);

    const handleAddIncomeType = () => {
        setNewIncomeType({ name: '', deductible: false });
        onAddOpen();
    };

    const handleDeleteIncome = (income: IncomeType, event: React.MouseEvent) => {
        event.stopPropagation();
        setIdToDelete(income.id || '');
        onDeleteOpen();
    };

    const confirmDeleteIncome = async () => {
        if (idToDelete) {
            const { user } = auth;
            const token = user?.token || '';

            try {
                await deleteIncomeType(idToDelete, token);
                setIncomes(incomes.filter(item => item.id !== idToDelete));
                setIdToDelete(null);
                toast({
                    title: 'Éxito',
                    description: 'El ingreso ha sido eliminado correctamente.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            } catch (error) {
                console.error('Error al eliminar el ingreso:', error);
                toast({
                    title: 'Error',
                    description: 'Ocurrió un error al eliminar el ingreso.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
        onDeleteClose();
    };

    const handleSaveIncomeType = (incomeType: IncomeType) => {
        if (incomeType.id) {
            // Actualizar el tipo de ingreso existente en el estado
            setIncomes(prevIncomes =>
                prevIncomes.map(inc => (inc.id === incomeType.id ? incomeType : inc))
            );
            setSelectedIncome(null);
            onEditClose();
        } else {
            // Agregar el nuevo tipo de ingreso al estado
            setIncomes(prevIncomes => [...prevIncomes, incomeType]);
            setNewIncomeType(null);
            onAddClose();
        }
    };


    const handleEditIncomeType = (income: IncomeType) => {
        setSelectedIncome(income);
        onEditOpen();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const updatedValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        if (selectedIncome) {
            setSelectedIncome({
                ...selectedIncome,
                [name]: updatedValue,
            });
        }

        if (newIncomeType) {
            setNewIncomeType({
                ...newIncomeType,
                [name]: updatedValue,
            });
        }
    };



    return (
        <Flex width={"90%"} flexDirection={"column"}>
            <Heading color={"gray.600"} mt={4} marginLeft={5} width={"100%"}>Tipos de Ingresos</Heading>

            <Box backgroundColor={'white'} top={160} left={300} width={"100%"} height={426} borderRadius="2xl" padding="8px" mt={10} >
                <Flex justifyContent="space-between" mb={6}>
                    <Flex gap={2}>
                    </Flex>
                    <Button onClick={handleAddIncomeType} color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }}>Agregar Tipo de Ingreso</Button>
                </Flex>
                <TableContainer>
                    <Table variant="simple" fontSize="14px">
                        <Thead>
                            <Tr>
                                <Th>Nombre</Th>
                                <Th>Es deducible</Th>
                                <Th>Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {incomes.map((incomeType, index) => (
                                <Tr key={index}>
                                    <Td>{incomeType.name}</Td>
                                    <Td>{incomeType.deductible ? 'Si' : 'No'}</Td>
                                    <Td>
                                        <EditIcon mr={2} cursor="pointer" onClick={() => handleEditIncomeType(incomeType)} />
                                        <DeleteIcon cursor="pointer" onClick={(event) => handleDeleteIncome(incomeType, event)} />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>

                <ModalIncomeType
                    isOpen={isAddOpen}
                    onClose={onAddClose}
                    onChange={handleChange}
                    onSave={handleSaveIncomeType}
                    initialData={newIncomeType}
                />

                <ModalIncomeType
                    isOpen={isEditOpen}
                    onClose={onEditClose}
                    onChange={handleChange}
                    onSave={handleSaveIncomeType}
                    initialData={selectedIncome}
                />
                <ModalEliminar
                    isOpen={isDeleteOpen}
                    onClose={onDeleteClose}
                    onConfirm={confirmDeleteIncome}
                />
            </Box>
        </Flex>
    );
};