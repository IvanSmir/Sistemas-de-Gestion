'use client'

import { useAuth } from '@/components/context/AuthProvider';
import { FormEmployee } from '@/components/employees/add/Form';
import { FormPosition } from '@/components/employees/positions/Position';
import { ModalRelative } from '@/components/employees/relatives/Relatives';
import { StepperFunc } from '@/components/steppers/StepperFunc';
import Employee from '@/types/employee';
import EmployeeData from '@/types/employeeData';
import PositionEmployee from '@/types/positionEmployee';
import Relative from '@/types/relative';
import { completeEmployee } from '@/utils/employee.http';
import { dataEmployeeSchema } from '@/validations/dataEmployeeSchema';
import { employeeSchema } from '@/validations/employeeSchema';
import { positionSchema } from '@/validations/positionSchema';
import { relativeSchema } from '@/validations/relativeSchema';
import { Button, Toast, useToast } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const AddEmployeePage = () => {
    const auth = useAuth();
    const router = useRouter();
    const toast = useToast();
    const [currentStep, setCurrentStep] = useState(0);
    const [employee, setEmployee] = useState<Employee>({
        name: '',
        email: '',
        image: '',
        gender: '',
        address: '',
        ciRuc: '',
        enterDate: new Date(),
        birthDate: new Date(),
        phone: ''
    });
    const [positionEmployee, setPositionEmployee] = useState<PositionEmployee>({
        positionId: '',
        salaryType: '',
        amount: 0
    });
    const [relatives, setRelatives] = useState<Relative[]>([]);
    const [isPerson, setIsPerson] = useState(false);
    const [employeeCiRuc, setEmployeeCiRuc] = useState('');


    const { register, handleSubmit, formState: { errors }, trigger, setValue } = useForm<Employee>({
        resolver: zodResolver(employeeSchema)
    });

    const { register: registerPosition, handleSubmit: handleSubmitPosition, formState: { errors: errorsPosition }, trigger: triggerPosition, setValue: setValuePosition } = useForm<PositionEmployee>({
        resolver: zodResolver(positionSchema)
    });

    const { register: registerRelative, handleSubmit: handleSubmitRelative, formState: { errors: errorsRelative }, trigger: triggerRelative, setValue: setValueRelative } = useForm<Relative>({
        resolver: zodResolver(relativeSchema)
    });

    const handleNextStep = async () => {


        if (currentStep === 0) {
            const valid = await trigger();
            if (valid) {
                handleSubmit((data) => setEmployee(data))();
                setCurrentStep((prevStep) => prevStep + 1);
            }
            if (!valid) {
                console.log('Errores en el formulario de empleado:', errors);
                return;
            }
        } else if (currentStep === 1) {
            console.log('currentStep', currentStep);
            const valid = await triggerPosition();
            console.log('valid', valid);
            if (valid) {
                handleSubmitPosition((data) => setPositionEmployee(data))();
                console.log('positionEmployee', positionEmployee);
                setCurrentStep((prevStep) => prevStep + 1);
            }
            if (!valid) {
                console.log('Errores en el formulario de empleado:', errorsPosition);
                return;
            }
        } else if (currentStep === 2) {
            const valid = await triggerRelative();
            if (valid) {

                setCurrentStep((prevStep) => prevStep + 1);
            }
            if (!valid) {
                console.log('Errores en el formulario de empleado:', errorsRelative);
                return;
            }
        }
        console.log('currentStep', currentStep);
        console.log('employee', employee);
        console.log('positionEmployee', positionEmployee);
    };

    const handleBackStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    const handleSave = async () => {
        toast.closeAll();

        const employeeData = {
            employee,
            isNew: !isPerson,
            role: positionEmployee,
            familyMembers: relatives,
        };
        console.log('employeeData', employeeData);

        try {
            const { user } = auth;
            const token = user?.token || '';
            toast({
                title: 'Guardando empleado',
                description: 'Por favor espere...',
                status: 'loading',
                duration: null,
                isClosable: true,
            });

            const promise = await completeEmployee(employeeData, token);
            toast.closeAll();

            toast({
                title: 'Empleado guardado',
                description: 'Empleado guardado con éxito',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            router.push('/employees ');
        } catch (error: any) {
            toast.closeAll();
            console.error('Error saving employee:', error);
            toast({
                title: 'Error',
                description: error?.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });

            console.error('Error saving employee:', error);
        }
    };

    return (
        <div className='flex flex-col w-full justify-center items-center bg-white'>
            <div className='w-[70vw]'>
                <StepperFunc currentIndex={currentStep} />
            </div>
            <div className='mt-10 w-[60vw]'>
                {currentStep === 0 && (
                    <FormEmployee
                        register={register}
                        errors={errors}
                        setIsPerson={setIsPerson}
                        setValue={setValue}
                        setEmployeeCiRuc={setEmployeeCiRuc}
                    />
                )}
                {currentStep === 1 && (
                    <FormPosition
                        register={registerPosition}
                        errors={errorsPosition}
                        setValue={setValuePosition}
                    />
                )}
                {currentStep === 2 && (
                    <ModalRelative
                        relative={relatives}
                        setRelative={setRelatives}
                        register={registerRelative}
                        handleSubmit={handleSubmitRelative}
                        errors={errorsRelative}
                        setValue={setValueRelative}
                        employeeCiRuc={employeeCiRuc}
                    />
                )}
                <div className='w-[55%] bottom-32 flex gap-14 justify-end fixed'>
                    {currentStep > 0 && (
                        <Button onClick={handleBackStep}>Atrás</Button>
                    )}
                    {currentStep < 3 && (
                        <Button onClick={handleNextStep}>Siguiente</Button>
                    )}
                    {currentStep === 3 && (
                        <Button onClick={handleSave}>Guardar</Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddEmployeePage;
