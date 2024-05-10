'use client'
import { useState } from 'react';
import { FormFuncionario } from '@/components/funcionarios/Form';
import { FormCargo } from '@/components/generales/cargos/Form';
import { List } from '@/components/familiares/List';
import { StepperFunc } from '@/components/steppers/Stepper';
import { Button } from '@chakra-ui/react';

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };
  const handleBackStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <>
      <StepperFunc currentIndex={currentStep} />
      {currentStep === 0 && <FormFuncionario />}
      {currentStep === 1 && <FormCargo />}
      {currentStep === 2 && <List />}
      <div className=' w-[60%] bottom-32 flex gap-14 justify-end fixed'>
        {currentStep > 0 && (
          <Button onClick={handleBackStep}>Atras</Button>
        )}
        {currentStep < 3 && (
          <Button onClick={handleNextStep}>Siguiente</Button>
        )}
      </div>

    </>
  );
};

export default Index;
