'use client'
import { FormEmployee } from '@/components/employees/add/Form';
import { FormPosition } from '@/components/employees/positions/Position';
import { ModalRelative } from '@/components/employees/relatives/Relatives';
import { FormRelative } from '@/components/relatives/add/Form';
import { StepperFunc } from '@/components/steppers/StepperFunc';
import { Button } from '@chakra-ui/react';
import { useState } from 'react';



const AddEmployeePage = () => {

    const [currentStep, setCurrentStep] = useState(0);

    const handleNextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };
    const handleBackStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
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
