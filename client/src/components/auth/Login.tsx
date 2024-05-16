'use client'
import React, { useState } from 'react'
import { Text, FormControl, Input, FormLabel, Select, Button, Stepper, Box, Switch, InputGroup, InputRightElement } from '@chakra-ui/react'
import { useForm } from "react-hook-form";
export const Login = () => {
    const [show, setShow] = useState(false)

    const handleClick = () => setShow(!show)
    const { register, handleSubmit } = useForm()
    return (
        <Box boxShadow='base' p='6' rounded='md' bg='white'>
            <form className='w-80' onSubmit={handleSubmit(data => { console.log((data)) })} >
                <FormControl className='flex  justify-center flex-col gap-3'>
                    <Text fontSize='xl' as='b'>Iniciar sesion</Text>
                    <Text fontSize='sm'>Inicia sesion con tu correo y contraseña</Text>
                    <div>
                        <FormLabel htmlFor='email'>Correo electrónico:
                            <Input
                                type="email"
                                id='email'
                                placeholder="example@gmail.com"
                                {...register('email', { required: true })}
                            />

                        </FormLabel>

                    </div>
                    <div>
                        <FormLabel htmlFor='password'>
                            Contraseña:
                            <InputGroup size='md'>
                                <Input
                                    id='password'
                                    pr='4.5rem'
                                    type={show ? 'text' : 'password'}
                                    placeholder='Enter password'
                                    {...register('password', { required: true })}
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
                    <Button bg='#AA546D' color='white' size='md' type='submit'>Iniciar</Button>


                </FormControl>

            </form>

        </Box>




    )
}
