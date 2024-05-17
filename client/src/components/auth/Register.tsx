'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Text, FormControl, Input, FormLabel, Box, InputGroup, InputRightElement, FormErrorMessage, Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '@/validations/userSchema';
import { register as signup } from '@/utils/auth.http';
import Link from 'next/link';

type Inputs = {
    fullName: string;
    userName: string;
    password: string;
    confirmPassword: string;
}

export const Register = () => {
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleClick = () => setShow(!show);
    const handleConfirmClick = () => setShowConfirm(!showConfirm);
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({ resolver: zodResolver(userSchema) });
    const onSubmit = async (data: Inputs) => {
        try {
            setError(null);
            await signup({
                user: {
                    ...data
                }
            }
            );
            router.push('/auth/login'); // Redirige a la página de inicio de sesión
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Box boxShadow='base' p='6' rounded='md' bg='white'>
            <form className='w-80 flex justify-center flex-col gap-3' onSubmit={handleSubmit(onSubmit)}>
                <Text fontSize='x-large' as='b'>Registrarse</Text>
                <Text fontSize='small'>Registrate con tu nombre de usuario y una contraseña segura</Text>
                {error && <Text color='red.500'>{error}</Text>}
                <FormControl isInvalid={!!errors.fullName}>
                    <FormLabel htmlFor='fullName'>Nombre:</FormLabel>
                    <Input type="text"
                        id='fullName'
                        placeholder="Juan Manuel"
                        {...register('fullName')}
                    />
                    {errors.fullName && <FormErrorMessage>{errors.fullName.message}</FormErrorMessage>}
                </FormControl>

                <FormControl isInvalid={!!errors.userName}>
                    <FormLabel htmlFor='userName'>Nombre de usuario:</FormLabel>
                    <Input type="text"
                        id='userName'
                        placeholder="juanmanueh199"
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

                <FormControl isInvalid={!!errors.confirmPassword}>
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
                <div className='flex justify-end '>
                    <Text className='mr-2' as='p'>Ya tienes una cuenta?</Text>
                    <Link href='/auth/login' ><Text as='u'> Iniciar Sesión</Text></Link>
                </div>
            </form>
        </Box>
    );
};
