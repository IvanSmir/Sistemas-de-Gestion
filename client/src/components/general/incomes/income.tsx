'use client'
import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { InputGroup, Switch, FormControl, FormLabel, Center, Input, Button, IconButton, Menu, MenuButton, MenuItem, MenuList, InputRightElement, Box, } from "@chakra-ui/react";
import { CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";

interface FormValues {
    name: string;
    description: string;

}

export const Income: React.FC = () => {

    const [formData, setFormData] = useState<FormValues>(
        {
            name: "",
            description: "",

        }
    );
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target;

        setFormData({ ...formData, [target.name]: target.value });
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormData(formData);
        try {


        } catch (error) {
            console.log(error);
        }
    };



    return (

        <form className="bg-[#F3F3F3] h-full relative" onSubmit={handleSubmit}>

            <div className="absolute h-auto min-h-[80vh] max-h-[80vh] rounded-md bg-white w-[50%] p-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div>
                    <InputGroup m={2}>
                        <InputRightElement mx={5} >
                            <IconButton variant='outline' aria-label='Cerrar' border='none' icon={<CloseIcon />}></IconButton>
                        </InputRightElement>
                    </InputGroup>
                    <div mr-8>
                        <h1 className='text-4xl' >Ingreso</h1>
                    </div>
                    <Box w={400} m={15}>

                        <label className="block  font-size={13} pt-5 font-medium text-gray-700" htmlFor="tipo">
                            Tipo de Ingreso:
                            <Menu  >
                                <MenuButton m={5} p={5} w={220} as={Button} rightIcon={<ChevronDownIcon />}>
                                    Tipo de Ingresos
                                </MenuButton>
                                <MenuList>
                                    <MenuItem>Horas Extras</MenuItem>
                                    <MenuItem>Comision</MenuItem>
                                    <MenuItem>xxxxxxxx</MenuItem>
                                    <MenuItem>aaaaaaa</MenuItem>
                                    <MenuItem>bbbbbbb</MenuItem>
                                </MenuList>
                            </Menu>
                        </label>

                        <label className="block font-size={14} pt-5  font-medium text-gray-700" htmlFor="monto">
                            Monto:*
                            <InputGroup>

                                <Input className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" size='sm'
                                    type='text'
                                    placeholder=''
                                    id="description"
                                    onChange={handleChange}
                                    name="description"
                                />
                            </InputGroup>

                        </label>
                        <FormControl display='flex' alignItems='center' mt={15} pt={5}>
                            <FormLabel htmlFor='deducible' mb='0'>
                                Deducible:
                            </FormLabel>
                            <Switch id='email-alerts' />
                        </FormControl>


                        <div  >
                            <Center>
                                <Button background='#EBEBEB' size='sm' _hovertext-white w={137} h={42} font-bold p={4} mt={5} rounded-full type="submit">
                                    Guardar
                                </Button>
                            </Center>

                        </div>
                    </Box>
                </div>
            </div>

        </form>


    );

};

export default Income