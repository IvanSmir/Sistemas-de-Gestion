import React, { useCallback } from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    
    pageInfor: {
        flexDirection: 'column',
        //backgroundColor: '#E4E4E4',
        padding: 20,
        paddingTop: 40,
        paddingBottom: 40,
    },
    headerInfor: {
        marginBottom: 20,
        textAlign: 'center'
    },
    titleInfor1: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
        color: '#e4b1bc',
        margin: 10,
    },
    subtitleInfor: {
        fontSize: 14,
        marginBottom: 3
    },
    separatorInfor: {
        marginVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e4b1bc',
    },
    sectionInfor: {
        margin: 10,
        //padding: 10,
       
    },
    tableInfor: {
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        //borderTopWidth: 1,
        //borderLeftWidth: 1,
    },
    tableRowInfor: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    tableColHeaderInfor: {
        width: "14%",
        borderStyle: "solid",
        borderWidth: 1,
        flex: 1,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        textAlign: 'center',
        padding: 5,
        fontWeight: 'bold',
        fontSize: 10, 
        backgroundColor: '#eff9f7',
    },
    tableColInfor: {
        width: "14%",
        borderStyle: "solid",
        borderWidth: 1,
        flex: 1,
       // borderLeftWidth: 1,
        borderTopWidth: 0,
        textAlign: 'right',
        padding: 5,
        fontSize: 10, 
    },
    tableColInfor1: {
        width: "14%",
        borderStyle: "solid",
        borderWidth: 1,
        flex: 1,
        borderLeftWidth: 1,
        borderTopWidth: 0,
        textAlign: 'left',
        padding: 5,
        fontSize: 10, 
    },
    totalRowInfor: {
        fontWeight: 'bold',
        fontSize: 10, 
       //backgroundColor: '#f8eaed', 
    },
    totalRowInfor2: {
        fontWeight: 'bold',
        fontSize: 14, 
        padding: 10,
        textAlign: 'right',
        margin: 10,
    },

});

const ReportPDF = ({ reportData, selectedReport = '', ipsArray = [], incomeArray = [], familyArray = [], totalArray=[]  }) => {
    const renderTableContent = () => {
        const { employees, totals } = reportData || {};

        const isIps = selectedReport.includes("Ips")
        const isIncome = selectedReport.includes("Salario")
        const isFamily = selectedReport.includes("Bonificacion")
        const isTotal = selectedReport.includes("Total")

        const getArray = useCallback(()=>{
            if( isIps ) return ipsArray
            if(isIncome) return incomeArray
            if(isFamily) return familyArray
            if(isTotal) return totalArray
        }, [isIps, isIncome, isFamily, isTotal, incomeArray, ipsArray, familyArray, totalArray])

        return (
            <>
                <View style={styles.tableRowInfor}>
                    <Text style={styles.tableColHeaderInfor}>Nombre y Apellido</Text>
                    <Text style={styles.tableColHeaderInfor}>CI</Text>
                    { (isIncome || isTotal) && <Text style={styles.tableColHeaderInfor}>Concepto</Text>}
                    { (isIncome || isTotal) && <Text style={styles.tableColHeaderInfor}>Salario </Text>}
                    { (isIps || isTotal) && <Text style={styles.tableColHeaderInfor}>IPS</Text>}
                    { (isFamily || isTotal) && <Text style={styles.tableColHeaderInfor}>Bonif. Familiar</Text>}
                </View>
                {
                    getArray()?.map((d, index)=>(<View style={[styles.tableRowInfor, styles.totalRowInfor]} key={index}>
                        <Text style={styles.tableColInfor1}>{d.name}</Text>
                        <Text style={styles.tableColInfor}>{d.cin}</Text>
                        {isTotal?
                            <>
                                { (isIncome || isTotal) && <Text style={styles.tableColInfor1}> {d.description} </Text>}
                                { (isIncome || isTotal) && <Text style={styles.tableColInfor}>{d.isIncome && !d.isBonification ? parseInt(d.amount) : '-'}</Text>}
                                { (isIps || isTotal) && <Text style={styles.tableColInfor}>{d.isIps ? parseInt(d.amount) : '-'}</Text>}
                                { (isFamily || isTotal) && <Text style={styles.tableColInfor}>{d.isBonification ? parseInt(d.amount ): '-'}</Text>}
                            </>
                            :
                            <>
                                { (isIncome || isTotal) && <Text style={styles.tableColInfor1}> {d.description} </Text>}
                                <Text style={styles.tableColInfor}>{parseInt(d.amount)}</Text>
                            </>
                        }
                    </View>))
                }
                <View style={[styles.tableRowInfor, styles.totalRowInfor]}>
                    <Text style={styles.tableColInfor}>Total:</Text>
                    <Text style={styles.tableColInfor}></Text>
                    { (isIncome || isTotal) && <Text style={styles.tableColInfor}> --- </Text>}
                    { (isIncome || isTotal) && <Text style={styles.tableColInfor}>{parseInt(incomeArray.map(d=>parseInt(d.amount)).reduce((a,b)=>a+b))}</Text>}
                    { (isIps || isTotal) && <Text style={styles.tableColInfor}>{parseInt(ipsArray.map(d=>parseInt(d.amount)).reduce((a,b)=>a+b))}</Text>}
                    { (isFamily || isTotal) && <Text style={styles.tableColInfor}>{parseInt(familyArray.map(d=>parseInt(d.amount)).reduce((a,b)=>a+b))}</Text>}
                </View>
                <View style={styles.totalRowInfor2}>
                    <Text>Total General: {parseInt(getArray().map(d=>parseInt(d.amount)).reduce((a,b)=>a+b))} Gs.</Text>
                </View>
            </>
        );
    };

    return (
        <Document>
            <Page size="A4" orientation="portrait" style={styles.pageInfor}>
                <View style={styles.headerInfor}>
                    <Text style={styles.titleInfor1}>La Ferretería</Text>
                    <View style={styles.separatorInfor} />
                    <Text style={styles.subtitleInfor}>Informe Mensual  
                        {selectedReport.includes("Ips") && " IPS"}
                        {selectedReport.includes("Salario") && " Salario"}
                        {selectedReport.includes("Bonificacion") && " Bonificación"}
                        {selectedReport.includes("Total") && " Resumen total"}
                    </Text>
                   
                </View>
                
                <View style={styles.sectionInfor}>
                    {renderTableContent()}
                </View>
            </Page>
        </Document>
    );
};

export default ReportPDF;

