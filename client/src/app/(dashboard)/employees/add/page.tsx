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
        ruc: '',
        joinDate: new Date(),
        birthdate: new Date(),
        phone: ''
    });
    const [positionEmployee, setPositionEmployee] = useState<PositionEmployee>({
        position: '',
        wageType: '',
        salary: 0
    });
    const [relatives, setRelatives] = useState<Relative[]>([]);

    const { register, handleSubmit, formState: { errors }, trigger } = useForm({
        resolver: zodResolver(employeeSchema)
    });

    const { register: registerPosition, handleSubmit: handleSubmitPosition, formState: { errors: errorsPosition }, trigger: triggerPosition } = useForm({
        resolver: zodResolver(positionSchema)
    });

    const { register: registerRelative, handleSubmit: handleSubmitRelative, formState: { errors: errorsRelative }, trigger: triggerRelative } = useForm({
        resolver: zodResolver(relativeSchema)
    });

    const handleNextStep = async () => {
        let valid;
        if (currentStep === 0) valid = await trigger();
        if (currentStep === 1) valid = await triggerPosition();
        if (currentStep === 2) valid = await triggerRelative();

        if (valid) {
            setCurrentStep((prevStep) => prevStep + 1);
        }
    };

    const handleBackStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    const handleSave = async () => {
        const employeeData: EmployeeData = {
            employee,
            position: positionEmployee,
            relatives
        };

        try {
            const employeeResponse = await fetch('/api/employee', {
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
                        employee={employee}
                        setEmployee={setEmployee}
                        register={register}
                        handleSubmit={handleSubmit((data) => setEmployee(data))}
                        errors={errors}
                    />
                )}
                {/* {currentStep === 1 && (
                    <FormPosition
                        position={positionEmployee}
                        setPosition={setPositionEmployee}
                        register={registerPosition}
                        handleSubmit={handleSubmitPosition((data) => setPositionEmployee(data))}
                        errors={errorsPosition}
                    />
                )}
                {currentStep === 2 && (
                    <ModalRelative
                        relative={relatives}
                        setRelative={setRelatives}
                        register={registerRelative}
                        handleSubmit={handleSubmitRelative((data) => setRelatives(data))}
                        errors={errorsRelative}
                    />
                )} */}
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
