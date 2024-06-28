'use client'
import React, { useState, useEffect } from 'react';
import { Button, Menu, MenuButton, MenuList, MenuItem, Tr } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import * as XLSX from 'xlsx';
import { getEmployees } from '@/utils/employee.http';
import { getEmployeeDetails } from '@/utils/detail.http';
import { useAuth } from '@/components/context/AuthProvider';

interface Employee {
  id: string;
  person: {
    name: string;
    ciRuc: string;
  };
}

const fetchAllEmployees = async (token: string) => {
  let allData: any[] = [];
  let page = 1;
  let hasMoreData = true;

  while (hasMoreData) {
    const result = await getEmployees(page);
    console.log('Fetched employees:', result.data);

    const employeesWithDetails = await Promise.all(result.data.map(async (employee: Employee) => {
      const positionDetails = await getEmployeeDetails(employee.id, token);
      console.log('Cargos del funcionario:', positionDetails);

      const positions = positionDetails.map((detail: any) => detail.position?.name).filter((name: string) => name).join(', ');
      const employeeName = employee.person.name;
      const employeeCiRuc = employee.person.ciRuc;

      const formatDate = (date: string) => {
        const d = new Date(date);
        return !isNaN(d.getTime()) ? `${('0' + d.getDate()).slice(-2)}-${('0' + (d.getMonth() + 1)).slice(-2)}-${d.getFullYear()}` : 'N/A';// Formatea la solo dia-mes-año
      };

      const isActive = positionDetails.some((detail: any) => {//si al menos tiene un cargo activo
        const endDate = detail.endDate ? new Date(detail.endDate) : null;
        return !endDate || endDate > new Date();
      });

      return {
        Funcionario: employeeName,
        Cedula: employeeCiRuc,
        Cargo: positions || 'N/A',
        FechaInicio: formatDate(positionDetails[0]?.startDate || 'N/A'),
        FechaFin: formatDate(positionDetails[0]?.endDate || 'N/A'),
        isActive
      };
    }));

    allData = [...allData, ...employeesWithDetails];
    console.log('Datos obtenidos:', allData);

    if (result.data.length === 0) {
      hasMoreData = false;
    } else {
      page++;
    }
  }

  return allData;
};


export const DownloadExcel: React.FC = () => {
  const auth = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { user } = auth;
      const token = user?.token || '';
      const allData = await fetchAllEmployees(token);
      setEmployees(allData);
    };

    fetchData();
  }, [auth]);

  const downloadExcel = (data: any[], fileName: string) => {

    if (data.length === 0) {// en el caso de lo haber bajas de funcionarios
      data = [{ Funcionario: 'No hay bajas', Cedula: '', Cargo: '', FechaInicio: '', FechaFin: '' }];
    }

    const cleanedData = data.map(({ isActive, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(cleanedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, fileName);
  };

  const handleDownload = (isActive: boolean | null) => {
    let dataToDownload = employees;
    if (isActive === null) {
      dataToDownload = employees;
    } else if (isActive === true) {
      dataToDownload = employees.filter(employee => employee.isActive === true);
    } else if (isActive === false) {
      dataToDownload = employees.filter(employee => employee.isActive === false);
    }
    console.log(dataToDownload)
    const fileName = isActive === null ? "todos_los_empleados.xlsx" : isActive ? "empleados_activos.xlsx" : "empleados_no_activos.xlsx";
    downloadExcel(dataToDownload, fileName);
  };

  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          rounded={23}
          fontSize={13}
          py={3}
          px={5}
          rightIcon={<ChevronDownIcon />}
          gap={2}
        >
          Descargar Reporte
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => handleDownload(true)}>
            Funcionarios Activos
          </MenuItem>
          <MenuItem onClick={() => handleDownload(false)}>
            Bajas de Funcionarios
          </MenuItem>
          <MenuItem onClick={() => handleDownload(null)}>
            Todos los Funcionarios
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

