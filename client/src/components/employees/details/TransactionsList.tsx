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
    useDisclosure
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { getEmployeeExpenseDetails, getEmployeeIncomeDetails } from "@/utils/detail.http";
import { useAuth } from "@/components/context/AuthProvider";
import { useParams } from "next/navigation";
import { IncomeExpenseForm } from "./addIncomeExpense";
import { getExpenseTypes, getIncomeTypes } from "@/utils/finance.http";

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

export const FinanceDetailsList: React.FC = () => {
    const [incomes, setIncomes] = useState<IncomeDetails[]>([]);
    const [expenses, setExpenses] = useState<ExpenseDetails[]>([]);
    const [expensesType, setExpensesType] = useState<ExpenseType[]>([]);
    const [incomesType, setIncomesType] = useState<IncomeType[]>([]);
    const [isIncomeorExpense, setIsIncomeorExpense] = useState('');
    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
    const [types, setTypes] = useState<IncomeType[] | ExpenseType[]>([]);

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
            const response = await getEmployeeExpenseDetails(id as string, token);
            setExpenses(response);
        } catch (error) {
            console.log(error);
        }
        try {
            const responseIncomeTypes = await getIncomeTypes(token);
            const responseExpenseTypes = await getExpenseTypes(token);
            setIncomesType(responseIncomeTypes);
            setExpensesType(responseExpenseTypes);
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

    const handleAddExpenseClick = () => {
        setIsIncomeorExpense('expense');
        setTypes(expensesType);
        onAddOpen();
    };



    return (
        <Box backgroundColor={'white'} borderRadius="2xl" padding="8px" >

            {/* Tabla de Ingresos */}
            <TableContainer mb={10}>
                <Flex justifyContent="end" mb={6}>
                    <Button onClick={handleAddIncomeClick} rounded={23} fontSize={13} py={3} px={5} bgColor='gray.700' _hover={{ bgColor: "#gray.800" }} color='white' disabled={!isIncomeorExpense}>
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
                                    <EditIcon mr={2} cursor="pointer" />
                                    <DeleteIcon cursor="pointer" />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            {/* Tabla de Egresos */}
            <TableContainer>
                <Flex justifyContent="end" mb={6}>
                    <Button onClick={handleAddExpenseClick} rounded={23} fontSize={13} py={3} px={5} bgColor='gray.700' _hover={{ bgColor: "#gray.800" }} color='white' disabled={!isIncomeorExpense}>
                        <AddIcon />Agregar egreso
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
                                    <EditIcon mr={2} cursor="pointer" />
                                    <DeleteIcon cursor="pointer" />
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
        </Box>
    );
};
