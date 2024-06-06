import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';


// Estilos para el PDF
const styles = StyleSheet.create({
    page: {
        position: 'relative',
        padding: 30,
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    heading: {
        fontSize: 12,
        marginBottom: 15,
        textAlign: 'center',
    },
    headingDate: {
        fontSize: 12,
        marginBottom: 15,
        textAlign: 'left',
    },

    companyName: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
        color: 'pink',
    },
    separator: {
        marginVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e4b1bc',
    },
    separator1: {
        marginVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    funcionarioDetails: {
        fontSize: 12,
        marginBottom: 20,
    },
    tableHeaderCell: {
        flexDirection: 'column',
    },
    tableContainer: {
        width: "100%",
        borderCollapse: "collapse",
    },
    tableRow: {
        flexDirection: "row",
        //borderBottom: "1px solid #e4b1bc",
    },
    tableColConcept: {
        width: "33.33%",
        paddingLeft: 15,
        borderStyle: "solid",
        textAlign: 'left',

    },
    tableColAmount: {
        width: "33.33%",
        paddingRight: 15,
        textAlign: 'right',
    },
    tableCell: {
        marginTop: 5,
        fontSize: 12,

    },
    tableCell1: {
        marginTop: 5,
        fontSize: 12,

    },
    reciboContainer: {
        marginTop: 5,
        fontSize: 12,
        marginBottom: 50,
        paddingBottom: 40,
    },
    signatureContainer: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingHorizontal: 5,
        marginBottom: 15,
        paddingBottom: 15,
    },
    signatureBlock: {
        width: '40%',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    signatureLine: {
        borderTopWidth: 1,
        borderTopColor: 'gray',
        marginTop: 25,
        width: '100%',
    },
    signatureLabel: {
       // display: 'flex',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 5,
       
    },
    signatureLabel1: {
        // display: 'flex',
         fontSize: 10,
         textAlign: 'center',
         marginTop: 5,
         paddingBottom: 25,
     },
    totalsContainer: {
        flexDirection: 'column',
        marginBottom: 10,
        paddingRight: 15,
        alignItems: 'flex-end',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 2,

    },
    totalLabel: {
        marginRight: 10,
    },
    totalValue: {
        minWidth: 40,
        textAlign: 'right',
    },
    watermark: {
        position: 'absolute',
        fontSize: 72,
        color: 'rgba(0, 0, 0, 0.1)',
        transform: 'rotate(-45deg)',
        left: '25%',
        top: '35%',
        zIndex: 0,
    }

});

interface Sueldo {
    _id: string;
    concepto: string;
    ingreso: string;
    egreso: string;
}


interface SueldoPDFProps {
    sueldo: Sueldo[];
    currentDate: Date;
}

const unidades = [' ', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
const especiales = ['once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
const decenas = ['diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const centenas = ['cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

const numberToWords = (num: number): string => {
    if (num < 10) return unidades[num];
    if (num >= 10 && num < 20) return especiales[num - 11];
    if (num >= 20 && num < 100) {
        let decena = Math.floor(num / 10);
        let unidad = num % 10;
        return unidad === 0 ? decenas[decena - 1] : `${decenas[decena - 1]} y ${unidades[unidad]}`;
    }
    if (num >= 100 && num < 1000) {
        let centena = Math.floor(num / 100);
        let resto = num % 100;
        return resto === 0 ? centenas[centena - 1] : `${centenas[centena - 1]} ${numberToWords(resto)}`;
    }
    if (num >= 1000 && num < 1000000) {
        let miles = Math.floor(num / 1000);
        let resto = num % 1000;
        return miles === 1 ? `mil ${numberToWords(resto)}` : `${numberToWords(miles)} mil ${numberToWords(resto)}`;
    }
    if (num >= 1000000 && num < 90000000) {
        let millones = Math.floor(num / 1000000);
        let resto = num % 1000000;
        return millones === 1 ? `un millón ${numberToWords(resto)}` : `${numberToWords(millones)} millones ${numberToWords(resto)}`;
    }
    return "Número fuera de rango";
};

const formatDate = (date: Date): string => {
    const months = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `Fecha: ${day} de ${month} de ${year}`;
};

const SueldoPDF: React.FC<SueldoPDFProps> = ({ sueldo, currentDate }) => {
    const totalIngresos = sueldo.map(s => Number(s.ingreso)).reduce((a, b) => a + b, 0);
    const totalEgresos = sueldo.map(s => Number(s.egreso)).reduce((a, b) => a + b, 0);
    const totalAPagar = totalIngresos - totalEgresos;
    const totalAPagarEnTexto = numberToWords(totalAPagar);


    const formattedDate = formatDate(currentDate);

    const renderPage = (isDuplicate: boolean) => (
        <>
            <Page size="A4" style={styles.page}>
                <Text style={styles.watermark}>{isDuplicate ? 'Duplicado' : 'Original'}</Text>

                <View>
                    <View style={styles.companyName}>
                        <Text>LA FERRETERIA</Text>
                    </View>
                    <Text style={styles.heading}>Recibo de Sueldo </Text>
                    <Text style={styles.headingDate}> {formattedDate}</Text>
                    <View style={styles.separator} />
                    <Text style={styles.funcionarioDetails}>Funcionario: JUAN PEREZ    CI: 4559688</Text>
                    <View style={styles.tableHeaderCell}>
                    </View>
                    <View style={styles.tableHeaderCell}>
                        <View style={styles.separator1} />
                        <View style={styles.tableRow}>
                            <View style={styles.tableColConcept}><Text style={styles.tableCell}>Concepto</Text></View>
                            <View style={styles.tableColAmount}><Text style={styles.tableCell1}>Ingreso</Text></View>
                            <View style={styles.tableColAmount}><Text style={styles.tableCell1}>Egreso</Text></View>
                        </View>
                        <View style={styles.separator1} />
                        {sueldo.map(item => (
                            <View style={styles.tableRow} key={item._id}>
                                <View style={styles.tableColConcept}><Text style={styles.tableCell}>{item.concepto}</Text></View>
                                <View style={styles.tableColAmount}><Text style={styles.tableCell1}>{item.ingreso}</Text></View>
                                <View style={styles.tableColAmount}><Text style={styles.tableCell1}>{item.egreso}</Text></View>
                            </View>
                        ))}
                    </View>
                </View><View style={styles.section}>
                    <View style={styles.separator1} />
                    <View style={styles.totalsContainer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>TOTAL INGRESOS:</Text>
                            <Text style={styles.totalValue}>{totalIngresos} Gs</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>TOTAL EGRESOS:</Text>
                            <Text style={styles.totalValue}>{totalEgresos} Gs</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>TOTAL A PAGAR:</Text>
                            <Text style={styles.totalValue}>{totalAPagar} Gs</Text>
                        </View>
                    </View>
                </View><View style={styles.reciboContainer}>
                    <Text>     Recibi de la empresa LA FERRETERIA un monto total de {totalAPagar} Gs, son {totalAPagarEnTexto}guaraníes.</Text>
                </View> 
                <View style={styles.signatureContainer}>
                    <View style={{ textAlign: 'center', width: '30%' }}>
                        <Text style={styles.signatureLine}></Text>
                        <Text style={styles.signatureLabel}>LIC.ANALIA FRETES</Text>
                        <Text style={styles.signatureLabel1}>JEFA RR HH</Text>
                    </View>
                    <View style={{ textAlign: 'center', width: '30%' }}>
                        <Text style={styles.signatureLine}></Text>
                        <Text style={styles.signatureLabel}>FUNCIONARIO</Text>
                    </View>
                </View>
            </Page>
        </>
    );
    return (
        <Document>
            {renderPage(false)}
            {renderPage(true)}
        </Document>
    )

}

export default SueldoPDF;