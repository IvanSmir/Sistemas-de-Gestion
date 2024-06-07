'use client'
import React, { useState, useEffect, ChangeEvent } from "react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthProvider";
import { AmountType } from "./MoneyType";
import { getConfigAmount } from "@/utils/configBasic.http";

interface AmountType {
  id?: string;
  name: string;
  value: number;
}

export const ConfigBasic: React.FC = () => {
  const auth = useAuth();
  const [amounts,setAmounts]=useState<AmountType[]>([]);
  const [selectedAmount, setSelectedAmount] = useState<AmountType | null>(null);
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [newAmountType, setNewAmountType] = useState<AmountType| null>(null);
  
  useEffect(() => {
    const fetchAmounts = async () => {
        try {
            const { user } = auth;
            const token = user?.token || '';
            const data = await getConfigAmount(token);
            setAmounts(data);
        } catch (error) {
            console.error('Error al obtener tipos de montos:', error);
        }
    };
    fetchAmounts();
}, [auth]);

useEffect(() => {
  const updateTable = async () => {
    try {
      const { user } = auth;
      const token = user?.token || '';
      const data = await getConfigAmount(token);
      setAmounts(data);
    } catch (error) {
      console.error('Error al obtener tipos de montos:', error);
    }
  };
  updateTable();
}, [auth, isAddOpen, isEditOpen]); 

const handleAddAmountType = () => {
  setNewAmountType({ name: '', value:0 });
  onAddOpen();
};

const handleSaveAmountType = (amountType: AmountType) => {
  if (amountType.id) {
      setAmounts(amounts.map(a => (a.id === amountType.id ? amountType : a)));
      setSelectedAmount(null);
      onEditClose();
  } else {
      setAmounts([...amounts, amountType]);
      setNewAmountType(null);
      onAddClose();
  }
};

const handleEditAmountType = (amount: AmountType) => {
  setSelectedAmount(amount);
  onEditOpen();
};

const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  if (selectedAmount) {
      setSelectedAmount({
          ...selectedAmount,
          [e.target.name]: e.target.value,
      });
  }
};

  return (
    <Box backgroundColor={'white'} width={1000} borderRadius="2xl" padding="8px" margin="auto" mt={50}>
      <Flex justifyContent="space-between" mb={6} >
        <Button onClick={handleAddAmountType} rounded={23} mr={5} fontSize={13} py={3} px={5} bgColor='gray.700' _hover={{ bgColor: "gray.800" }} gap={2} color='white'>
          <AddIcon />Agregar concepto
        </Button>
      </Flex>
      <TableContainer>
        <Table variant="simple" fontSize="14px">
          <Thead>
            <Tr>
              <Th>Nombre</Th>
              <Th>Valor</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {amounts.map((amountType, index) => (
              <Tr key={index}>
                <Td>{amountType.name}</Td>
                <Td>{amountType.value}</Td>
                <Td>
                  <EditIcon
                    mr={2}
                    cursor="pointer"
                    onClick={() => handleEditAmountType(amountType)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {newAmountType&&(
        <AmountType
          isOpen={isAddOpen}
          onClose={onAddClose}
          onChange={handleChange}
          onSave={handleSaveAmountType}
          initialData={newAmountType}
        />
      )}

      {selectedAmount &&(
        <AmountType
          isOpen={isEditOpen}
          onClose={onEditClose}
          onChange={handleChange}
          onSave={handleSaveAmountType}
          initialData={selectedAmount}
        />
      )}
    </Box>
  );
};

