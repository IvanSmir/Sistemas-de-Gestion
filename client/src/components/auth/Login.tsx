'use client'
import { useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { Text, FormControl, Input, FormLabel, Select, Button, Stepper, Box, Switch, InputGroup, InputRightElement } from '@chakra-ui/react'

export const Login = () => {
    const [show, setShow] = useState(false)

    const handleClick = () => setShow(!show)
    return (
        <Box boxShadow='base' p='6' rounded='md' bg='white'>
            <form className='w-80' >
                <FormControl className='flex  justify-center flex-col gap-3'>
                    <Text fontSize='xl' as='b'>Iniciar sesion</Text>
                    <Text fontSize='sm'>Inicia sesion con tu usuario y contraseña</Text>
                    <div>
                        <FormLabel htmlFor='userName'>Usuario:
                            <Input
                                type="text"
                                id='userName'
                                name='userName'
                                placeholder="juanPerez"
                            />

                        </FormLabel>

                    </div>
                    <div>
                        <FormLabel htmlFor='password'>
                            Contraseña:
                            <InputGroup size='md'>
                                <Input
                                    id='password'
                                    name='password'
                                    pr='4.5rem'
                                    type={show ? 'text' : 'password'}
                                    placeholder='Enter password'

                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                                        {show ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormLabel>
                    </div>

                    <a href="#">Olvidaste tu contraseña?</a>
                    <Button bg='#AA546D' color='white' size='md'>Iniciar</Button>


                </FormControl>

            </form>

        </Box>




    )
}
