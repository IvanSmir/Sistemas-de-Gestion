import React, { useCallback, useEffect, useState } from 'react';
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

const ReportPDF = ({ reportData, selectedReport = '', ipsArray = [], salaryArray = [], familyArray = [], totalArray = [], incomeArray = [], expenseArray = [] }) => {
    const renderTableContent = () => {
        const { employees, totals } = reportData || {};

        const [array , setArray] = useState([])
        const isIps = selectedReport.includes("Ips")
        const isIncome = selectedReport.includes("Salario")
        const isFamily = selectedReport.includes("Bonificacion")
        const isTotal = selectedReport.includes("Total")

        useEffect(() => {
            if (isTotal) {
                let arr_temp = []
                salaryArray.forEach(t => {
                    arr_temp = [...arr_temp, {
                        name: t.name,
                        cin: t.cin,
                        salary: 0,
                        income: 0,
                        expense: 0,
                        ips: 0,
                        bonification: 0
                    }]
                })
                totalArray.forEach(item => {
                    for (let i: number = 0; i < arr_temp.length; i++) {
                        if (arr_temp[i].cin === item.cin) {
                            console.log(item)
                            if (item.isIps) {
                                arr_temp[i].ips += item.amount
                            } else if (item.isBonification) {
                                arr_temp[i].bonification += item.amount
                            } else if (!item.isBonification && item.isIncome && item.description.includes("Salario")) {
                                arr_temp[i].salary += item.amount
                            } else if (!item.isBonification && item.isIncome && !item.description.includes("Salario")) {
                                arr_temp[i].income += item.amount
                            } else if (!item.isBonification && !item.isIncome && !item.isIps) {
                                arr_temp[i].expense += item.amount
                            }
                            break
                        }
                    }
                })
                setArray(arr_temp)
            }
        }, [totalArray])

        const getTotal = useCallback(() => {
            if (isIps) return array.length>0? array.map(d => (d.ips)).reduce((a, b) => a + b) : 0
            if (isIncome) return array.length>0? array.map(d => (d.salary)).reduce((a, b) => a + b) : 0
            if (isFamily) return array.length>0? array.map(d => (d.bonification)).reduce((a, b) => a + b) : 0
            if (isTotal) return array.length>0? array.map(d => (d.salary + d.income + d.bonification - d.expense)).reduce((a, b) => a + b) : 0
        }, [isIps, isIncome, isFamily, isTotal, array])

        return (
            <>
                <View style={styles.tableRowInfor}>
                    <Text style={styles.tableColHeaderInfor}>Nombre y Apellido</Text>
                    <Text style={styles.tableColHeaderInfor}>CI</Text>
                    {(isIncome || isTotal) && <Text style={styles.tableColHeaderInfor}>Salario </Text>}
                    {(isIncome || isTotal) && <Text style={styles.tableColHeaderInfor}>Otros Ingreso </Text>}
                    {(isIncome || isTotal) && <Text style={styles.tableColHeaderInfor}>Otros descuentos</Text>}
                    {(isIps || isTotal) && <Text style={styles.tableColHeaderInfor}>IPS</Text>}
                    {(isFamily || isTotal) && <Text style={styles.tableColHeaderInfor}>Bonif. Familiar</Text>}
                </View>
                {
                    array.map((d, index) => (<View style={[styles.tableRowInfor, styles.totalRowInfor]} key={index}>
                        <Text style={styles.tableColInfor1}>{d.name}</Text>
                        <Text style={styles.tableColInfor}>{d.cin}</Text>
                        {(isIncome || isTotal) && <Text style={styles.tableColInfor}>{d.salary - d.ips - d.expense}</Text>}
                        {(isIncome || isTotal) && <Text style={styles.tableColInfor}>{d.income}</Text>}
                        {(isIncome || isTotal) && <Text style={styles.tableColInfor}>{d.expense}</Text>}
                        {(isIps || isTotal) && <Text style={styles.tableColInfor}>{d.ips}</Text>}
                        {(isFamily || isTotal) && <Text style={styles.tableColInfor}>{d.bonification}</Text>}

                    </View>))
                }
                <View style={[styles.tableRowInfor, styles.totalRowInfor]}>
                    <Text style={styles.tableColInfor}>Total:</Text>
                    <Text style={styles.tableColInfor}></Text>
                    {(isIncome || isTotal) && <Text style={styles.tableColInfor}>{array.length>0? array.map(d => (d.salary - d.ips - d.expense)).reduce((a, b) => a + b) : 0}</Text>}
                    {(isIncome || isTotal) && <Text style={styles.tableColInfor}>{array.length>0? array.map(d => (d.income)).reduce((a, b) => a + b) : 0}</Text>}
                    {(isIncome || isTotal) && <Text style={styles.tableColInfor}>{array.length>0? array.map(d => (d.expense)).reduce((a, b) => a + b) : 0}</Text>}
                    {(isIps || isTotal) && <Text style={styles.tableColInfor}>{array.length>0? array.map(d => (d.ips)).reduce((a, b) => a + b) : 0}</Text>}
                    {(isFamily || isTotal) && <Text style={styles.tableColInfor}>{array.length>0? array.map(d => (d.bonification)).reduce((a, b) => a + b) : 0}</Text>}
                </View>
                <View style={styles.totalRowInfor2}>
                    <Text>Total General: {getTotal()} Gs.</Text>
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

