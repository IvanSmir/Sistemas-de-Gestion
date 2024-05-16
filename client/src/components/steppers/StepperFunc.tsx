'use client'
import { useEffect } from 'react'

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

const steps = [
    { title: 'Funcionario', description: 'Datos Personales' },
    { title: 'Cargo', description: 'Puesto de trabajo' },
    { title: 'Familiar', description: 'Parentescos' },
]

export const StepperFunc = ({ currentIndex }: { currentIndex: number }) => {
    const { activeStep, setActiveStep } = useSteps({
        index: currentIndex,
        count: steps.length,
    })
    useEffect(() => {
        setActiveStep(currentIndex)
    }, [currentIndex, setActiveStep])

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

