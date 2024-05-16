'use client'
import React, { useState } from 'react'
import { Text, FormControl, Input, FormLabel, Box, InputGroup, InputRightElement, FormErrorMessage, Button } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema } from '@/validations/userSchema'

type Inputs = {
    name: string;
    userName: string;
    password: string;
    confirmPassword: string;
}

export const Register = () => {
    const [show, setShow] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const handleClick = () => setShow(!show)
    const handleConfirmClick = () => setShowConfirm(!showConfirm)
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({ resolver: zodResolver(userSchema) })

    return (
        <Box boxShadow='base' p='6' rounded='md' bg='white'>
            <form className='w-80 flex justify-center flex-col gap-3' onSubmit={handleSubmit(data => { console.log(data) })}>
                <Text fontSize='x-large' as='b'>Registrarse</Text>
                <Text fontSize='small'>Registrate con tu nombre de usuario y una contraseña segura</Text>
                <FormControl isInvalid={errors.name ? true : false}>
                    <FormLabel htmlFor='name'>Nombre:</FormLabel>
                    <Input type="text"
                        id='name'
                        placeholder="Juan Manuel"
                        {...register('name')}
                    />
                    {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
                </FormControl>

                <FormControl isInvalid={errors.userName ? true : false}>
                    <FormLabel htmlFor='userName'>Nombre de usuario:</FormLabel>
                    <Input type="text"
                        id='userName'
                        placeholder="juanmanueh199"
                        {...register('userName')}
                    />
                    {errors.userName && <FormErrorMessage>{errors.userName.message}</FormErrorMessage>}
                </FormControl>

                <FormControl isInvalid={errors.password ? true : false}>
                    <FormLabel htmlFor='password'>Contraseña:</FormLabel>
                    <InputGroup size='md'>
                        <Input
                            id='password'
                            pr='4.5rem'
                            type={show ? 'text' : 'password'}
                            placeholder='Enter password'
                            {...register('password')}
                        />
                        <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={handleClick}>
                                {show ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                    {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
                </FormControl>

                <FormControl isInvalid={errors.confirmPassword ? true : false}>
                    <FormLabel>Confirmar Contraseña:</FormLabel>
                    <InputGroup size='md'>
                        <Input
                            id='confirmPassword'
                            pr='4.5rem'
                            type={showConfirm ? 'text' : 'password'}
                            placeholder='Enter password'
                            {...register('confirmPassword')}
                        />
                        <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={handleConfirmClick}>
                                {showConfirm ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                    {errors.confirmPassword && <FormErrorMessage>{errors.confirmPassword.message}</FormErrorMessage>}
                </FormControl>

                <Button bg='#AA546D' color='white' type='submit' size='md'>Registrarse</Button>
                <a className='flex justify-end' href="#"><Text as='u'>Volver al inicio de sesion</Text></a>
            </form>
        </Box>
    )
}
