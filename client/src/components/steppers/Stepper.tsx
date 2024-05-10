'use client'
import { usePathname } from 'next/navigation'

import {
    Box,
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

const steps = [
    { title: 'Funcionario', description: 'Datos Personales' },
    { title: 'Cargo', description: 'Puesto de trabajo' },
    { title: 'Familiar', description: 'Parentescos' },
]
const getPathIndex = (path: string): number => {
    switch (path) {
        case '/funcionarios/add':
            return 0;
        case '/generales/cargos/add':
            return 1;
        case '/familiares':
            return 2;
        default:
            return 0;
    }
}
export const StepperFunc = ({ currentIndex }: { currentIndex: number }) => {

    const { activeStep, setActiveStep } = useSteps({
        index: currentIndex,
        count: steps.length,
    })
    useEffect(() => {
        setActiveStep(currentIndex)
    }, [currentIndex, setActiveStep])

    console.log(currentIndex)


    return (
        <Stepper index={activeStep}>
            {steps.map((step, index) => (
                <Step key={index}>
                    <StepIndicator>
                        <StepStatus
                            complete={<StepIcon />}
                            incomplete={<StepNumber />}
                            active={<StepNumber />}
                        />
                    </StepIndicator>

                    <Box flexShrink='0'>
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription>{step.description}</StepDescription>
                    </Box>

                    <StepSeparator />
                </Step>
            ))}
        </Stepper>
    )
}

