import React, { useEffect, useState } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
    ModalBody, ModalCloseButton, Button, Select, Box
} from '@chakra-ui/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF';
import { Income } from '../incomes/income';

const ReportModal = ({ isOpen, onClose, reportData }) => {

    const [selectedReport, setSelectedReport] = useState('resumenTotal');
    const [ips, setIps] = useState(0)
    const [family, setFamily] = useState(0)
    const [income, setIncome] = useState(0)
    const [total, setTotal] = useState(0)
    const [ipsArray, setIpsArray] = useState([])
    const [familyArray, setFamilyArray] = useState([])
    const [incomeArray, setIncomeArray] = useState([])
    const [expenseArray, setExpenseArray] = useState([])
    const [totalArray, setTotalArray] = useState([])
    const [salaryArray, setSalaryArray] = useState([])

    const handleSelectChange = (event) => {
        setSelectedReport(event.target.value);
    };

    useEffect(() => {
        if (reportData.length > 0) {
            let ipsArray_ = [], familyArray_ = [], incomeArray_ = [], totalArray_ = [], salaryArray_ = [], expenseArray_=[];
            let ips_: number = 0, family_: number = 0, income_: number = 0, total_: number = 0, salary_: number = 0;
            reportData.forEach(d => {
                salary_ = 0;
                d.items.forEach(i => {
                    console.log(i)
                    totalArray_ = [...totalArray_, { name: d.name, cin: d.cin, ...i }]
                    if (i.isBonification) {
                        console.log("bonificacion")
                        familyArray_ = [...familyArray_, { name: d.name, cin: d.cin, ...i }]
                        family_ += Number(i.amount)
                        total_ += Number(i.amount)
                    } else {
                        if (i.isIncome) {
                            console.log("income")
                            if (i.description.includes("Salario")) {
                                salary_ += Number(i.amount)
                                total_ += Number(i.amount)
                            } else {
                                incomeArray_ = [...incomeArray_, { name: d.name, cin: d.cin, ...i }]
                                income_ += Number(i.amount)
                                total_ += Number(i.amount)
                            }
                        } else {
                            if (i.isIps) {
                                console.log("ips")
                                ipsArray_ = [...ipsArray_, { name: d.name, cin: d.cin, ...i }]
                                ips_ += Number(i.amount)
                                salary_ -= Number(i.amount)
                            }else{
                                expenseArray_ = [...expenseArray_, { name: d.name, cin: d.cin, ...i }]
                                salary_ -= Number(i.amount)
                                total_ -= Number(i.amount)
                            }
                        }
                    }

                });
                salaryArray_ = [...salaryArray_, {
                    name: d.name, cin: d.cin,
                    amount: salary_,
                    description: "Salario",
                    isBonification: false,
                    isIncome: true,
                    isIps: false,
                }]
            });
            console.log("incomes", incomeArray_)
            console.log("salarios", salaryArray_)
            setIps(ips_)
            setFamily(family_)
            setIncome(income_ + salary_)
            setTotal(total_)
            setIpsArray(ipsArray_)
            setFamilyArray(familyArray_)
            setExpenseArray(expenseArray_)
            setSalaryArray(salaryArray_)
            setIncomeArray(incomeArray_)
            setTotalArray(totalArray_)
        }
    }, [reportData])

    const renderReportContent = () => {
        console.log(ips, family, income, total)
        switch (selectedReport) {
            case 'resumenIps':
                return parseInt(ips) || "Resumen de IPS no disponible, o es 0.";
            case 'resumenBonificacion':
                return parseInt(family) || "Resumen de bonificación  es 0.";
            case 'resumenSalario':
                return parseInt(income) || "Resumen de salario no disponible, o es 0.";
            case 'resumenTotal':
                return parseInt(total) || 'REsumen total no disponible, o es 0';
            default:
                return JSON.stringify(reportData, null, 2) || "Cargando datos del informe...";
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Informe Mensual</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Select value={selectedReport} onChange={handleSelectChange} mb={4} borderColor="#e4b1bc" _focus={{ borderColor: "#e4b1bc" }} >
                        <option value='resumenIps'>Resumen de IPS</option>
                        <option value='resumenBonificacion'>Resumen de Bonificación</option>
                        <option value='resumenSalario'>Resumen de Salario</option>
                        <option value='resumenTotal'>Resumen Total</option>
                    </Select>
                    <Box>
                   
                       {/* <pre>Total: {renderReportContent()} Gs.</pre> */}
                    
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="gray" mr={3} onClick={onClose}>
                        Cerrar
                    </Button>
                    <PDFDownloadLink
                        document={<ReportPDF reportData={reportData} selectedReport={selectedReport} ipsArray={ipsArray} totalArray={totalArray} familyArray={familyArray} salaryArray={salaryArray} incomeArray={incomeArray} expenseArray={expenseArray} />}
                        fileName="informe_mensual.pdf"
                    >
                        {({ loading }) => (loading ? 'Cargando documento...' : 'Descargar PDF')}
                    </PDFDownloadLink>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ReportModal;
