
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
    page: {
        padding: 30,
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
    },
    tableContainer: {
        width: "100%",
        borderCollapse: "collapse",
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "1px solid #e4b1bc",
    },
    tableCol: {
        width: "33.33%",
        padding: 5,
        borderStyle: "solid",
        
    },
    tableCell: {
        margin: "auto",
        marginTop: 5,
        fontSize: 10
    },
    tableHeaderCell: {
        margin: "auto",
        marginTop: 5,
        fontSize: 10,
    
    },
});

interface Adelanto {
    _id: number;
    concepto: string;
    ingreso: string;
    egreso: string;
}

interface AdelantoPDFProps {
    adelanto: Adelanto[];
}

const AdelantoPDF: React.FC<AdelantoPDFProps> = ({ adelanto }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.heading}>Adelantos</Text>
                <View style={styles.tableHeaderCell}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Concepto</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Ingreso</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Egreso</Text></View>
                    </View>
                    {adelanto.map(item => (
                        <View style={styles.tableRow} key={item._id}>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.concepto}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.ingreso}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.egreso}</Text></View>
                        </View>
                    ))}
                </View>
            </View>
        </Page>
    </Document>
);

export default AdelantoPDF;
