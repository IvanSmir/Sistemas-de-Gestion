'use client'
import React, { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Text, FormControl, Input, FormLabel, Box, InputGroup, InputRightElement, FormErrorMessage, Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/validations/loginSchema';
import { loginHttp } from '@/utils/auth.http';
import Link from 'next/link';
import { useAuth } from '../context/AuthProvider';

type LoginInputs = {
    userName: string;
    password: string;
};

export const Login = () => {
    const router = useRouter();
    const { login } = useAuth();
    const [show, setShow] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClick = () => setShow(!show);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>({ resolver: zodResolver(loginSchema) });

    const onSubmit = async (data: LoginInputs) => {
        try {
            setError(null);
            const userData = await loginHttp({
                user: {
                    userName: data.userName,
                    password: data.password,
                }
            });
            login(userData);
            console.log(userData);
            router.push('/'); 
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Box boxShadow='base' p='6' rounded='md' bg='white'>
            <form className='w-80 flex justify-center flex-col gap-3' onSubmit={handleSubmit(onSubmit)}>
                <Text fontSize='x-large' as='b'>Iniciar sesión</Text>
                <Text fontSize='small'>Inicia sesión con tu nombre de usuario y contraseña</Text>
                {error && <Text color='red.500'>{error}</Text>}

                <FormControl isInvalid={!!errors.userName}>
                    <FormLabel htmlFor='userName'>Nombre de usuario:</FormLabel>
                    <Input type="text"
                        id='userName'
                        placeholder="juanPerez"
                        {...register('userName')}
                    />
                    {errors.userName && <FormErrorMessage>{errors.userName.message}</FormErrorMessage>}
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
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

                <div className='flex justify-end'>
                    <Text className='mr-2' as='p'>No tienes una cuenta? </Text>
                    <Link href='/auth/register' ><Text as='u'>Registrarse</Text></Link>
                </div>
                <Button bg='#AA546D' color='white' type='submit' size='md'>Iniciar</Button>
            </form>
        </Box>
    );
};
