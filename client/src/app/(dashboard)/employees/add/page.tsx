'use client'

import { FormEmployee } from '@/components/employees/add/Form';
import { FormPosition } from '@/components/employees/positions/Position';
import { ModalRelative } from '@/components/employees/relatives/Relatives';
import { StepperFunc } from '@/components/steppers/StepperFunc';
import Employee from '@/types/employee';
import EmployeeData from '@/types/employeeData';
import PositionEmployee from '@/types/positionEmployee';
import Relative from '@/types/relative';
import { dataEmployeeSchema } from '@/validations/dataEmployeeSchema';
import { employeeSchema } from '@/validations/employeeSchema';
import { positionSchema } from '@/validations/positionSchema';
import { relativeSchema } from '@/validations/relativeSchema';
import { Button } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const AddEmployeePage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [employee, setEmployee] = useState<Employee>({
        name: '',
        email: '',
        image: '',
        gender: '',
        address: '',
        ciRuc: '',
        joinDate: new Date(),
        birthDate: new Date(),
        phone: ''
    });
    const [positionEmployee, setPositionEmployee] = useState<PositionEmployee>({
        position: '',
        wageType: '',
        salary: 0
    });
    const [relatives, setRelatives] = useState<Relative[]>([]);

    const { register, handleSubmit, formState: { errors }, trigger } = useForm<Employee>({
        resolver: zodResolver(employeeSchema)
    });

    const { register: registerPosition, handleSubmit: handleSubmitPosition, formState: { errors: errorsPosition }, trigger: triggerPosition } = useForm<PositionEmployee>({
        resolver: zodResolver(positionSchema)
    });

    const { register: registerRelative, handleSubmit: handleSubmitRelative, formState: { errors: errorsRelative }, trigger: triggerRelative } = useForm<Relative>({
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
            const valid = await triggerPosition();
            if (valid) {
                handleSubmitPosition((data) => setPositionEmployee(data))();
                setCurrentStep((prevStep) => prevStep + 1);
            }
        } else if (currentStep === 2) {
            const valid = await triggerRelative();
            if (valid) {

                setCurrentStep((prevStep) => prevStep + 1);
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
        const employeeData = {
            employee,
            role: positionEmployee,
            familyMembers: relatives
        };
        console.log('employeeData', employeeData);

        try {
            const employeeResponse = await fetch('http:localhost:3000/api/employee/full', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData),
            });
            alert('Employee saved successfully!');
        } catch (error) {
            console.error('Error saving employee:', error);
            alert('Failed to save employee.');
        }
    };

    return (
        <div className='flex flex-col w-full justify-center items-center'>
            <div className='w-[70vw]'>
                <StepperFunc currentIndex={currentStep} />
            </div>
            <div className='mt-10 w-[60vw]'>
                {currentStep === 0 && (
                    <FormEmployee
                        register={register}
                        errors={errors}
                    />
                )}
                {currentStep === 1 && (
                    <FormPosition
                        register={registerPosition}
                        errors={errorsPosition}
                    />
                )}
                {currentStep === 2 && (
                    <ModalRelative
                        relative={relatives}
                        setRelative={setRelatives}
                        register={registerRelative}
                        handleSubmit={handleSubmitRelative}
                        errors={errorsRelative}
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
