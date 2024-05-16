import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function clearDatabase() {
  await prisma.familyMembers.deleteMany();
  await prisma.familyTypes.deleteMany();
  await prisma.employeeDetails.deleteMany();
  await prisma.income.deleteMany();
  await prisma.incomeTypes.deleteMany();
  await prisma.expenses.deleteMany();
  await prisma.expenseTypes.deleteMany();
  await prisma.employees.deleteMany();
  await prisma.person.deleteMany();
  await prisma.positions.deleteMany();
  await prisma.users.deleteMany();
}

async function main() {
  // Borrar todos los datos existentes
  await clearDatabase();

  // Crear usuarios
  const users = [];
  for (let i = 0; i < 5; i++) {
    const user = await prisma.users.create({
      data: {
        fullName: faker.person.fullName(),
        userName: faker.internet.userName(),
        password: faker.internet.password(),
        roles: ['USER'],
      },
    });
    users.push(user);
  }

  // Crear posiciones
  const positions = [];
  for (let i = 0; i < 10; i++) { // Crear más posiciones para asignar
    const position = await prisma.positions.create({
      data: {
        name: faker.person.jobTitle(),
        description: faker.lorem.sentence(),
        userId: users[i % users.length].id,
      },
    });
    positions.push(position);
  }

  // Crear tipos de familia (únicos)
  const familyTypesData = ['Father', 'Mother', 'Son', 'Daughter', 'Cousin'];
  const familyTypes = [];
  for (const familyTypeName of familyTypesData) {
    const familyType = await prisma.familyTypes.create({
      data: {
        name: familyTypeName,
        userId: users[0].id, // Asignar al primer usuario
      },
    });
    familyTypes.push(familyType);
  }

  // Crear tipos de ingresos (únicos)
  const incomeTypeNames = new Set<string>();
  while (incomeTypeNames.size < 5) {
    incomeTypeNames.add(faker.commerce.department());
  }
  const incomeTypes = [];
  for (const name of incomeTypeNames) {
    const incomeType = await prisma.incomeTypes.create({
      data: {
        name,
        deductible: faker.datatype.boolean(),
        userId: users[incomeTypes.length % users.length].id,
      },
    });
    incomeTypes.push(incomeType);
  }

  // Crear tipos de gastos (únicos)
  const expenseTypeNames = new Set<string>();
  while (expenseTypeNames.size < 5) {
    expenseTypeNames.add(faker.commerce.department());
  }
  const expenseTypes = [];
  for (const name of expenseTypeNames) {
    const expenseType = await prisma.expenseTypes.create({
      data: {
        name,
        userId: users[expenseTypes.length % users.length].id,
      },
    });
    expenseTypes.push(expenseType);
  }

  // Crear personas
  const persons = [];
  for (let i = 0; i < 50; i++) { // Crear más personas para empleados y familiares
    const person = await prisma.person.create({
      data: {
        name: faker.person.fullName(),
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        ciRuc: faker.string.uuid(),
        birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
        gender: faker.person.sexType(),
        userId: users[i % users.length].id,
      },
    });
    persons.push(person);
  }

  // Crear empleados
  const employees = [];
  for (let i = 0; i < 10; i++) { // Crear más empleados
    const person = persons[i];
    const employee = await prisma.employees.create({
      data: {
        personId: person.id,
        enterDate: faker.date.past(),
        userId: person.userId,
      },
    });
    employees.push(employee);
  }

  // Crear EmployeeDetails (dos por empleado)
  for (const employee of employees) {
    for (let i = 0; i < 2; i++) {
      const position = positions[Math.floor(Math.random() * positions.length)];
      await prisma.employeeDetails.create({
        data: {
          employeeId: employee.id,
          positionId: position.id,
          startDate: faker.date.past(),
          endDate: faker.date.future(),
          userId: employee.userId,
          isActive: faker.datatype.boolean(),
        },
      });
    }
  }

  // Crear miembros de familia (dos por empleado)
  const assignedFamilyMembers = new Set<string>(); // Global set to track assigned person IDs
  for (const employee of employees) {
    for (let i = 0; i < 2; i++) {
      const familyType = familyTypes[Math.floor(Math.random() * familyTypes.length)];
      let person;
      do {
        person = persons[10 + Math.floor(Math.random() * (persons.length - 10))];
      } while (assignedFamilyMembers.has(person.id));
      assignedFamilyMembers.add(person.id);
      await prisma.familyMembers.create({
        data: {
          employeeId: employee.id,
          familyTypeId: familyType.id,
          personId: person.id,
          userId: employee.userId,
        },
      });
    }
  }

  // Crear ingresos (dos por empleado)
  for (const employee of employees) {
    for (let i = 0; i < 2; i++) {
      const incomeType = incomeTypes[Math.floor(Math.random() * incomeTypes.length)];
      await prisma.income.create({
        data: {
          employeeId: employee.id,
          incomeTypeId: incomeType.id,
          amount: parseFloat(faker.finance.amount()),
          date: faker.date.past(),
          active: faker.datatype.boolean(),
          userId: employee.userId,
        },
      });
    }
  }

  // Crear gastos (dos por empleado)
  for (const employee of employees) {
    for (let i = 0; i < 2; i++) {
      const expenseType = expenseTypes[Math.floor(Math.random() * expenseTypes.length)];
      await prisma.expenses.create({
        data: {
          employeeId: employee.id,
          expenseTypeId: expenseType.id,
          amount: parseFloat(faker.finance.amount()),
          date: faker.date.past(),
          active: faker.datatype.boolean(),
          userId: employee.userId,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
