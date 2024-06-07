
'use client';
import React, { useState, useEffect, useCallback } from "react";
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
    Heading,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { getEmployeeExpenseDetails, getEmployeeIncomeDetails, } from "@/utils/detail.http";
import { useAuth } from "@/components/context/AuthProvider";
import { useParams } from "next/navigation";
import { IncomeExpenseForm } from "../employees/details/addIncomeExpense";
import { getExpenseTypes, deleteExpense, } from "@/utils/finance.http";
import ModalEliminar from "@/components/relatives/ModalEliminar";
import { EditIncomeExpenseForm } from "@/components/transaction/EditIncomeExpense";
import { useToast } from '@chakra-ui/react';

interface IncomeType {
    name: string;
    id: string;
}

interface ExpenseType {
    name: string;
    id: string;
}

interface IncomeDetails {
    id: string;
    incomeType: IncomeType;
    amount: number;
    date: string;
}

interface ExpenseDetails {
    id: string;
    expenseType: ExpenseType;
    amount: number;
    date: string;
}

export const ExpenseList: React.FC = () => {
    const [expenses, setExpenses] = useState<ExpenseDetails[]>([]);
    const [expensesType, setExpensesType] = useState<ExpenseType[]>([]);
    const [isIncomeorExpense, setIsIncomeorExpense] = useState('');
    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const [types, setTypes] = useState<IncomeType[] | ExpenseType[]>([]);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);
    const [editDetails, setEditDetails] = useState<any>(null);
    const toast = useToast();
    const auth = useAuth();
    const { id } = useParams();

    const fetchFinanceDetails = useCallback(async () => {
        const { user } = auth;
        const token = user?.token || '';
        try {
            const response = await getEmployeeExpenseDetails(id as string, token);
            setExpenses(response);
        } catch (error) {
            console.log(error);
        }
        try {
            const responseExpenseTypes = await getExpenseTypes(token);
            setExpensesType(responseExpenseTypes);
        } catch (error) {
            console.log(error);
        }
    }, [id, auth]);


    useEffect(() => {
        fetchFinanceDetails();
    }, [fetchFinanceDetails]);

    const handleAddExpenseClick = () => {
        setIsIncomeorExpense('expense');
        setTypes(expensesType);
        onAddOpen();
    };

    const handleDeleteExpense = (expense: ExpenseDetails, event: React.MouseEvent) => {
        event.stopPropagation();
        setIdToDelete(expense.id);
        onDeleteOpen();
    };

    const confirmDeleteExpense = async () => {
        if (idToDelete) {
            const { user } = auth;
            const token = user?.token || '';

            try {
                await deleteExpense(idToDelete, token);
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

    const handleEditExpense = (expense: ExpenseDetails) => {
        setEditDetails(expense);
        setIsIncomeorExpense('expense');
        setTypes(expensesType);
        onEditOpen();
    };


    return (
        <Flex width={"90%"} flexDirection={"column"}>
            <Heading color={"gray.600"} mt={4} marginLeft={5} width={"100%"}>Egresos del Funcionario</Heading>

            <Box backgroundColor={'white'} top={160} left={300} width={"100%"} height={426} borderRadius="2xl" padding="8px" mt={10} >

                {/* Tabla de Egresos */}
                <TableContainer>
                    <Flex justifyContent="end" mb={5}>
                        <Button onClick={handleAddExpenseClick} padding={5} color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }}>
                            <AddIcon />Agregar Egreso
                        </Button>
                    </Flex>
                    <Table variant="simple" fontSize="14px">
                        <Thead>
                            <Tr>
                                <Th>Tipo de Egreso</Th>
                                <Th>Monto</Th>
                                <Th>Fecha</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {expenses?.map((expense, index) => (
                                <Tr key={index}>
                                    <Td>{expense.expenseType.name}</Td>
                                    <Td>{expense.amount}</Td>
                                    <Td>{new Date(expense.date).toLocaleDateString()}</Td>
                                    <Td>
                                        <EditIcon mr={2} cursor="pointer" onClick={() => handleEditExpense(expense)} />
                                        <DeleteIcon cursor="pointer" onClick={(e) => handleDeleteExpense(expense, e)} />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>

                <IncomeExpenseForm
                    fetchData={fetchFinanceDetails}
                    isOpen={isAddOpen}
                    onClose={onAddClose}
                    isIncomeorExpense={isIncomeorExpense}
                    types={types}
                />
                <ModalEliminar
                    isOpen={isDeleteOpen}
                    onClose={onDeleteClose}
                    onConfirm={confirmDeleteExpense}
                />
                <EditIncomeExpenseForm
                    isOpen={isEditOpen}
                    onClose={onEditClose}
                    isIncomeorExpense={isIncomeorExpense}
                    types={types}
                    details={editDetails}
                    itemId={editDetails ? editDetails.id : null}
                    fetchData={fetchFinanceDetails}
                />


            </Box>
        </Flex>
    );
};