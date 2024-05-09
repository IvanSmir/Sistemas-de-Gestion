
import React from 'react'
import {  Button, IconButton, Input,Heading,  InputGroup, Box, InputLeftElement } from '@chakra-ui/react'
import { DeleteIcon, EditIcon, SearchIcon} from '@chakra-ui/icons'
import {Table, Thead,Tbody,Tfoot, Tr,Th,Td,TableContainer,} from '@chakra-ui/react'
import { Tag,TagLabel,TagLeftIcon,TagRightIcon} from '@chakra-ui/react'
import { text } from 'stream/consumers'

 export const Sueldo = () => {

    const sueldo = [
        {
            _id: 1,
            
            concepto: "Sueldo",
            monto: "2500000",
            ips: "55555",
            neto:"23333333",

        }
    ]

    return(
        <>
        <div>
           <Button m={5} p={2} fontSize={12} borderRadius='full'colorScheme='cyan'>Prestamo</Button>
           <Button m={5}  fontSize={12} borderRadius='full'colorScheme='cyan'>Sueldo</Button>
           <Button m={5}  fontSize={12} borderRadius='full'colorScheme='cyan'>Aguinaldo</Button>
            <Input placeholder='Select Date and Time' width={200}  size='md' type='datetime-local' />
           <Heading className='flex flex-col p-3' >Sueldo</Heading>
        </div>
          
        <InputGroup textAlign="right">
            <InputLeftElement pointerEvents='none'>
            <SearchIcon color='gray' />
            </InputLeftElement>
            <IconButton aria-label='Search database' icon={<SearchIcon />} />   
            <Input type='search'   width={200} placeholder='buscar' />
        </InputGroup>
         <div>
          <Tag as='b'color='pink'  size='lg' m={5} colorScheme='white' borderRadius='full'> 
          <TagLabel>Nombre</TagLabel>
          </Tag>
        </div>
        <TableContainer >
        
        <Table variant='simple' >
            <Thead>
                <Tr>
                    
                    <Th className='px-4 py-2'>Concepto</Th>
                    <Th className='px-4 py-2'>Monto</Th>
                    <Th className='px-4 py-2'>Ips</Th>
                    <Th className='px-4 py-2'>Neto</Th>
                    <Th className='px-4 py-2'>Acciones</Th>
                </Tr>
            </Thead>
            <Tbody>
                {
                    sueldo.map(sueldo => (
                        <Tr key={sueldo._id}>
                        
                            <Td className='border px-4 py-2'>{sueldo.concepto}</Td>
                            <Td className='border px-4 py-2'>{sueldo.monto}</Td>
                            <Td className='border px-4 py-2'>{sueldo.ips}</Td>
                            <Td className='border px-4 py-2'>{sueldo.neto}</Td>
                            <Td className='border px-4 py-2'> 
                            <IconButton aria-label='Editar'colorScheme='teal' m={1} icon={<EditIcon />} /> 
                            <IconButton aria-label='borrar'colorScheme='red' m={1} icon={<DeleteIcon />} />   
                          
                            
                             </Td>
                        </Tr>)
                    )
                }
            </Tbody>
            <Tfoot>
            
            </Tfoot>
        </Table>
        </TableContainer>
        <Box>
        <Input type='tel' placeholder='Phone number' />
        </Box>
        </>


);    
};


