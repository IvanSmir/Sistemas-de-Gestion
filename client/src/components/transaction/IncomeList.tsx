
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
import { getIncomeTypes, deleteIncome, } from "@/utils/finance.http";
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

export const IncomeList: React.FC = () => {
    const [incomes, setIncomes] = useState<IncomeDetails[]>([]);
    const [incomesType, setIncomesType] = useState<IncomeType[]>([]);
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
            const response = await getEmployeeIncomeDetails(id as string, token);
            setIncomes(response);
        } catch (error) {
            console.log(error);
        }

        try {
            const responseIncomeTypes = await getIncomeTypes(token);
            setIncomesType(responseIncomeTypes);
        } catch (error) {
            console.log(error);
        }
    }, [id, auth]);


    useEffect(() => {
        fetchFinanceDetails();
    }, [fetchFinanceDetails]);

    const handleAddIncomeClick = () => {
        setIsIncomeorExpense('income');
        setTypes(incomesType);
        onAddOpen();
    };

    const handleDeleteIncome = (income: IncomeDetails, event: React.MouseEvent) => {
        event.stopPropagation();
        setIdToDelete(income.id);
        onDeleteOpen();
    };

    const confirmDeleteIncome = async () => {
        if (idToDelete) {
            const { user } = auth;
            const token = user?.token || '';

            try {
                await deleteIncome(idToDelete, token);
                setIncomes(incomes.filter(item => item.id !== idToDelete));
                setIdToDelete(null);
                // Mostrar toast de éxito
                toast({
                    title: 'Éxito',
                    description: 'El ingreso ha sido eliminado correctamente.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            } catch (error) {
                console.error('Error al eliminar el ingreso:', error);
                // Mostrar toast de error
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

    const handleEditIncome = (income: IncomeDetails) => {
        setEditDetails(income);
        setIsIncomeorExpense('income');
        setTypes(incomesType);
        onEditOpen();
    };


    return (
        <Flex width={"90%"} flexDirection={"column"}>
            <Heading color={"gray.600"} mt={4} marginLeft={5} width={"100%"}>Ingresos del Funcionario</Heading>

            <Box backgroundColor={'white'} top={160} left={300} width={"100%"} height={426} borderRadius="2xl" padding="8px" mt={10} >
                {/* Tabla de Ingresos */}
                <TableContainer mb={10}>
                    <Flex justifyContent="end" mb={5} mt={5}>
                        <Button onClick={handleAddIncomeClick} padding={5} color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }}>
                            <AddIcon />Agregar Ingreso
                        </Button>
                    </Flex>
                    <Table variant="simple" fontSize="14px">
                        <Thead>
                            <Tr>
                                <Th>Tipo de Ingreso</Th>
                                <Th>Monto</Th>
                                <Th>Fecha</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {incomes?.map((income, index) => (
                                <Tr key={index}>
                                    <Td>{income.incomeType.name}</Td>
                                    <Td>{income.amount}</Td>
                                    <Td>{new Date(income.date).toLocaleDateString()}</Td>
                                    <Td>
                                        <EditIcon mr={2} cursor="pointer" onClick={() => handleEditIncome(income)} />
                                        <DeleteIcon cursor="pointer" onClick={(e) => handleDeleteIncome(income, e)} />
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
                    onConfirm={confirmDeleteIncome}
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