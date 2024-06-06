'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "@chakra-ui/react";

interface ConfigBasicProps {
  name: string;
  value: number;
}

export const ConfigBasic: React.FC = () => {
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const [configs, setConfigs] = useState<ConfigBasicProps[]>([]);
  
  // Fetch data from API
  useEffect(() => {
    axios.get("/api/config")
      .then((response) => {
        setConfigs(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  // Handle Edit Click - Placeholder function
  const handleEditClick = (config: ConfigBasicProps, event: React.MouseEvent) => {
    // Implement your edit functionality here
  };

  return (
    <Box backgroundColor={'white'} borderRadius="2xl" padding="8px" >
      <Flex justifyContent="space-between" mb={6} >
        <Button onClick={onAddOpen} rounded={23} mr={5} fontSize={13} py={3} px={5} bgColor='gray.700' _hover={{ bgColor: "gray.800" }} gap={2} color='white'>
          <AddIcon />Agregar tipo
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
            {configs.map((config, index) => (
              <Tr key={index}>
                <Td>{config.name}</Td>
                <Td>{config.value}</Td>
                <Td>
                  <EditIcon
                    mr={2}
                    cursor="pointer"
                    onClick={(event) => handleEditClick(config, event)}
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

export default ConfigBasic;