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
import { getEmployeeDetails } from '@/utils/detail.http';
import { useParams } from "next/navigation";
import { useAuth } from "@/components/context/AuthProvider";

interface Position {
    name: string;
}

interface EmployeeDetails {
    id: string;
    position: Position;
    startDate: string;
    endDate: string;
    salaryType: string;
    salary: number;
}

export const EmployeeDetailsList: React.FC = () => {
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails[]>([]);
    const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState<EmployeeDetails | null>(null);
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
    const { id } = useParams();
    const auth = useAuth();


    const fetchEmployeesDetails = useCallback(async () => {
        try {
            const { user } = auth;
            const token = user?.token || '';
            const data: EmployeeDetails[] = await getEmployeeDetails(id as string, token) as EmployeeDetails[];
            setEmployeeDetails(data);
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    }, [id, auth]);

    useEffect(() => {
        fetchEmployeesDetails();
    }, [fetchEmployeesDetails]);

    const handleEditClick = (employee: EmployeeDetails, event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedEmployeeDetails(employee);
        onEditOpen();
    };

    const handleDeleteClick = (id: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setEmployeeDetails(employeeDetails.filter(employeeDetail => employeeDetail.id !== id));
    };

    return (
        <Box backgroundColor={'white'} borderRadius="2xl" padding="8px" >
            <Flex justifyContent="end" mb={6} >
                <Button onClick={onAddOpen} rounded={23} mr={5} fontSize={13} py={3} px={5} bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} gap={2} color='white'>
                    <AddIcon />Agregar Cargo
                </Button>
            </Flex>
            <TableContainer>
                <Table variant="simple" fontSize="14px">
                    <Thead>
                        <Tr>
                            <Th>Posición</Th>
                            <Th>Fecha de Inicio</Th>
                            <Th>Fecha de Fin</Th>
                            <Th>Tipo de Salario</Th>
                            <Th>Salario</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {employeeDetails.map((employeeDetail, index) => (
                            <Tr key={index}>
                                <Td>{employeeDetail.position.name}</Td>
                                <Td>{new Date(employeeDetail.startDate).toLocaleDateString()}</Td>
                                <Td>{new Date(employeeDetail.endDate).toLocaleDateString()}</Td>
                                <Td>{employeeDetail.salaryType === 'minimum' ? 'Mínimo' : 'Base'}</Td>
                                <Td>{employeeDetail.salary}</Td>
                                <Td>
                                    <EditIcon
                                        mr={2}
                                        cursor="pointer"
                                        onClick={(event) => handleEditClick(employeeDetail, event)}
                                    />
                                    <DeleteIcon
                                        cursor="pointer"
                                        onClick={(event) => handleDeleteClick(employeeDetail.id, event)}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};
