import React, { use, useEffect, useState } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
    ModalBody, ModalCloseButton, Button, Select, Box
} from '@chakra-ui/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF';
import { Income } from '../incomes/income';
import { PeriodData } from '@/types/periodType';

interface ReportmodalProps {
    isOpen: boolean;
    onClose: () => void;
    reportData: PeriodData;
}

const ReportModal = ({ isOpen, onClose, reportData }: ReportmodalProps) => {
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState('resumenTotal');

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedReport(event.target.value);
    };

    useEffect(() => {
        if (reportData) {
            setSelectedReport('resumenTotal');
            setLoading(false);
        }
    }, [reportData, loading]);

    if (loading) return <p>Cargando...</p>;

    const renderReportContent = () => {
        console.log(reportData)
        switch (selectedReport) {
            case 'resumenIps':
                return (reportData.totalIps) || "Resumen de IPS no disponible, o es 0.";
            case 'resumenBonificacion':
                return reportData.totalBonification || "Resumen de bonificación  es 0.";
            case 'resumenSalario':
                return "Datos de salarios";
            case 'resumenTotal':
                return (reportData.totalSalary + reportData.totalIncome + reportData.totalBonification - reportData.totalExpense) || 'Resumen total no disponible, o es 0';
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

                        {/* <pre>Total: {renderReportContent().toLocaleString('es-PY') + (selectedReport == 'resumenSalario' ? '' : 'Gs.')}</pre> */}

                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="gray" mr={3} onClick={onClose}>
                        Cerrar
                    </Button>
                    <PDFDownloadLink
                        document={<ReportPDF reportData={reportData} selectedReport={selectedReport} />}
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
