'use client'
import { FormEmployee } from '@/components/employees/add/Form';
import { FormPosition } from '@/components/employees/positions/Position';
import { ModalRelative } from '@/components/employees/relatives/Relatives';
import { FormRelative } from '@/components/relatives/add/Form';
import { StepperFunc } from '@/components/steppers/StepperFunc';
import Employee from '@/types/employee';
import EmployeeData from '@/types/employeeData';
import PositionEmployee from '@/types/positionEmployee';
import Relative from '@/types/relative';
import { Button } from '@chakra-ui/react';
import { useState } from 'react';



const AddEmployeePage = () => {

    const [currentStep, setCurrentStep] = useState(0);
    const [employeeData, setEmployeeData] = useState<EmployeeData>({
        employee: {
            name: '',
            email: '',
            image: '',
            gender: '',
            address: '',
            ruc: '',
            joinDate: new Date(),
            birthdate: new Date(),
            phone: ''
        },
        position: {
            position: '',
            wageType: '',
            salary: 0
        },
        relatives: []
    });
    const handleNextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };
    const handleBackStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    const handleSave = async () => {
        try {
            const { employee, position, relatives } = employeeData;

            const employeeResponse = await fetch('/api/employee', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employee),
            });
            const savedEmployee = await employeeResponse.json();

            await fetch(`/api/employee/${savedEmployee.id}/position`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(position),
            });

            for (const relative of relatives) {
                await fetch(`/api/employee/${savedEmployee.id}/relative`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(relative),
                });
            }

            alert('Employee saved successfully!');
        } catch (error) {
            console.error('Error saving employee:', error);
            alert('Failed to save employee.');
        }
    };
    return (
        <>
            <div className='  flex flex-col w-full justify-center items-center'>
                <div className='w-[70vw]'>
                    <StepperFunc currentIndex={currentStep} />

                </div>
                <div className='mt-10  w-[60vw]'>
                    {currentStep === 0 && <FormEmployee />}
                    {currentStep === 1 && <FormPosition />}
                    {currentStep === 2 && <ModalRelative />}
                    <div className=' w-[55%] bottom-32 flex gap-14 justify-end fixed'>
                        {currentStep > 0 && (
                            <Button onClick={handleBackStep}>Atras</Button>
                        )}
                        {currentStep < 3 && (
                            <Button className='' onClick={handleNextStep}>Siguiente</Button>
                        )}
                    </div>
                </div>

            </div>


        </>
    );
};

export default AddEmployeePage;
