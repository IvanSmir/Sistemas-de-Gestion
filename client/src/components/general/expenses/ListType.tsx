'use client';
import React, { useState, useEffect, ChangeEvent } from "react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { ExpenseType as ModalExpenseType } from "@/components/general/expenses/ExpenseType";
import { getExpenseTypes, deleteExpenseType, updateExpenseType } from '@/utils/finance.http';
import { useAuth } from '@/components/context/AuthProvider';
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
} from "@chakra-ui/react";
import ModalEliminar from "@/components/relatives/ModalEliminar";

interface ExpenseType {
    id?: string;
    name: string;
}

export const ListExpenseTypes: React.FC = () => {
    const toast = useToast();
    const [expenses, setExpenses] = useState<ExpenseType[]>([]);
    const [selectedExpense, setSelectedExpense] = useState<ExpenseType | null>(null);
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const [newExpenseType, setNewExpenseType] = useState<ExpenseType | null>(null);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const auth = useAuth();

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const { user } = auth;
                const token = user?.token || '';
                const data = await getExpenseTypes(token);
                setExpenses(data);
            } catch (error) {
                console.error('Error al obtener tipos de egresos:', error);
            }
        };

        fetchExpenses();
    }, [auth]);

    const handleAddExpenseType = () => {
        setNewExpenseType({ name: '' });
        onAddOpen();
    };

    const handleSaveExpenseType = (expenseType: ExpenseType) => {
        if (expenseType.id) {
            setExpenses(expenses.map(exp => (exp.id === expenseType.id ? expenseType : exp)));
            setSelectedExpense(null);
            onEditClose();

        } else {
            setExpenses([...expenses, expenseType]);
            setNewExpenseType(null);
            onAddClose();
        }    
    };
    

    const handleDeleteExpense = (expense: ExpenseType, event: React.MouseEvent) => {
        event.stopPropagation();
        setIdToDelete(expense.id || '');
        onDeleteOpen();
    };

    const confirmDeleteExpense = async () => {
        if (idToDelete) {
            const { user } = auth;
            const token = user?.token || '';

            try {
                await deleteExpenseType(idToDelete, token);
                setExpenses(expenses.filter(item => item.id !== idToDelete));
                setIdToDelete(null);
                toast({
                    title: 'Éxito',
                    description: 'El egreso ha sido eliminado correctamente.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            } catch (error) {
                console.error('Error al eliminar el egreso:', error);
                toast({
                    title: 'Error',
                    description: 'Ocurrió un error al eliminar el egreso.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
        onDeleteClose();
    };

    const handleEditExpenseType = (expense: ExpenseType) => {
        setSelectedExpense(expense);
        onEditOpen();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (selectedExpense) {
            setSelectedExpense({
                ...selectedExpense,
                [e.target.name]: e.target.value,
            });
        }
    };

    return (
        <Box backgroundColor={'white'} width={1000} borderRadius="2xl" padding="8px" margin="auto">
            <Flex justifyContent="space-between" mb={6}>
                <Flex gap={2}>
                    {/* Aquí puedes agregar un filtro por nombre si lo necesitas */}
                </Flex>
                <Button onClick={handleAddExpenseType}  color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }}>Agregar Tipo de Egreso</Button>
            </Flex>
            <TableContainer>
                <Table variant="simple" fontSize="14px">
                    <Thead>
                        <Tr>
                            <Th>Nombre</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {expenses.map((expense, index) => (
                            <Tr key={index}>
                                <Td>{expense.name}</Td>
                                <Td>
                                    <EditIcon mr={2} cursor="pointer" onClick={() => handleEditExpenseType(expense)} />
                                    <DeleteIcon cursor="pointer" onClick={(event) => handleDeleteExpense(expense, event)} />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            {newExpenseType && (
                <ModalExpenseType
                    isOpen={isAddOpen}
                    onClose={onAddClose}
                    onSave={handleSaveExpenseType}
                    onChange={handleChange}
                    initialData={newExpenseType}
                />
            )}
            {selectedExpense && (
                <ModalExpenseType
                    isOpen={isEditOpen}
                    onClose={onEditClose}
                    onSave={handleSaveExpenseType}
                    onChange={handleChange}
                    initialData={selectedExpense}
                />
            )}
            <ModalEliminar
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                onConfirm={confirmDeleteExpense}
            />
        </Box>
    );
};


