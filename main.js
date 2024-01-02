const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let employees = [];

function loadData() {
  try {
    const data = fs.readFileSync('employees.json', 'utf8');
    employees = JSON.parse(data);
    console.log('Data berhasil dimuat.');
  } catch (err) {
    console.log('Tidak dapat memuat data. Membuat array kosong.');
  }
}

function saveData() {
  const data = JSON.stringify(employees, null, 2);
  fs.writeFileSync('employees.json', data);
  console.log('Data berhasil disimpan.');
}

function addEmployee() {
  rl.question('Nama Karyawan: ', (name) => {
    rl.question('Punya Istri (y/n): ', (hasWife) => {
      let employee = {
        name,
        hasWife: hasWife.toLowerCase() === 'y',
        hasChildren: false,
        numberOfChildren: 0
      };

      if (employee.hasWife) {
        rl.question('Punya Anak (y/n): ', (hasChildren) => {
          employee.hasChildren = hasChildren.toLowerCase() === 'y';

          if (employee.hasChildren) {
            rl.question('Masukkan jumlah anak: ', (numberOfChildren) => {
              employee.numberOfChildren = parseInt(numberOfChildren, 10);
              employees.push(employee);
              console.log('Karyawan berhasil ditambahkan!');
              saveData();
              showMenu();
            });
          } else {
            employees.push(employee);
            console.log('Karyawan berhasil ditambahkan!');
            saveData();
            showMenu();
          }
        });
      } else {
        employees.push(employee);
        console.log('Karyawan berhasil ditambahkan!');
        saveData();
        showMenu();
      }
    });
  });
}

function findEmployee() {
  rl.question('Masukkan nama karyawan: ', (name) => {
    const employee = employees.find(emp => emp.name === name);
    if (employee) {
      console.log('Karyawan ditemukan!');
      console.log(`Nama Karyawan: ${employee.name}`);
      console.log(`Keterangan: ${getEmployeeDescription(employee)}`);
    } else {
      console.log('Karyawan tidak ditemukan.');
    }
    showMenu();
  });
}

function deleteEmployee() {
  displayEmployeeList();
  rl.question('Pilih Karyawan yang akan dihapus [1-2]: ', (index) => {
    index = parseInt(index, 10) - 1;
    if (employees[index]) {
      employees.splice(index, 1);
      console.log('Karyawan berhasil dihapus!');
    } else {
      console.log('Karyawan tidak ditemukan.');
    }
    showMenu();
  });
}

function addDelivery() {
  displayEmployeeList();
  rl.question('Pilih Karyawan yang akan melakukan pengantaran [1-2]: ', (index) => {
    index = parseInt(index, 10) - 1;
    if (employees[index]) {
      rl.question('Masukkan tujuan pengantaran: ', (destination) => {
        rl.question('Apakah pengantaran berhasil (y/n): ', (success) => {
          let delivery = {
            employee: employees[index],
            destination,
            success: success.toLowerCase() === 'y'
          };
          employees[index].deliveries = employees[index].deliveries || [];
          employees[index].deliveries.push(delivery);
          console.log('Pengantaran berhasil ditambahkan!');
          showMenu();
        });
      });
    } else {
      console.log('Karyawan tidak ditemukan.');
      showMenu();
    }
  });
}

function findDelivery() {
  displayEmployeeList();
  rl.question('Pilih Karyawan yang akan dicari pengantarannya [1-2]: ', (index) => {
    index = parseInt(index, 10) - 1;
    if (employees[index] && employees[index].deliveries) {
      const deliveries = employees[index].deliveries;
      console.log('Pengantaran ditemukan!');
      console.log(`Nama Karyawan: ${employees[index].name}`);
      console.log(`Jumlah Pengantaran: ${deliveries.length}`);
      console.log(`Jumlah Pengantaran Berhasil: ${deliveries.filter(delivery => delivery.success).length}`);
    } else {
      console.log('Karyawan atau pengantaran tidak ditemukan.');
    }
    showMenu();
  });
}

function deleteDelivery() {
  displayEmployeeList();
  rl.question('Pilih Karyawan yang akan dihapus pengantarannya [1-2]: ', (index) => {
    index = parseInt(index, 10) - 1;
    if (employees[index] && employees[index].deliveries) {
      employees[index].deliveries = [];
      console.log('Pengantaran berhasil dihapus!');
    } else {
      console.log('Karyawan atau pengantaran tidak ditemukan.');
    }
    showMenu();
  });
}

function calculateSalary() {
  displayEmployeeList();
  rl.question('Pilih Karyawan yang akan dihitung gajinya [1-2]: ', (index) => {
    index = parseInt(index, 10) - 1;
    if (employees[index]) {
      const employee = employees[index];
      const basicSalary = 4000000;
      const allowance = employee.hasWife ? 1500000 : 0;
      const numberOfChildrenAllowance = employee.numberOfChildren * 500000;
      const deliveryBonus = employee.deliveries ? employee.deliveries.filter(delivery => delivery.success).length * 1000000 : 0;
      const totalSalary = basicSalary + allowance + numberOfChildrenAllowance + deliveryBonus;

      console.log(`Gaji ${employee.name} adalah Rp ${totalSalary}`);
      console.log(`Tunjangan ${employee.name} adalah Rp ${allowance}`);
      console.log(`Upah Pengantaran ${employee.name} adalah Rp ${deliveryBonus}`);
      console.log(`Bonus ${employee.name} adalah Rp ${numberOfChildrenAllowance}`);
      console.log(`Gaji ${employee.name} adalah Rp ${totalSalary}`);
    } else {
      console.log('Karyawan tidak ditemukan.');
    }
    showMenu();
  });
}

function displayEmployeeList() {
  console.log('Daftar Karyawan:');
  employees.forEach((employee, index) => {
    console.log(`${index + 1}. ${employee.name}`);
  });
}

function getEmployeeDescription(employee) {
  let description = 'Belum Menikah';

  if (employee.hasWife) {
    description = 'Sudah Menikah';
    if (employee.hasChildren) {
      description += ` dan memiliki ${employee.numberOfChildren} anak`;
    }
  }

  return description;
}

function showMenu() {
  console.log(`
Program Penggajian Karyawan
==========================
1. Tambah Karyawan
2. Cari Karyawan
3. Hapus Karyawan
4. Tambah Pengantaran
5. Cari Pengantaran
6. Hapus Pengantaran
7. Hitung Gaji
8. Keluar
`);

  rl.question('Pilih Menu [1-8]: ', (choice) => {
    switch (choice) {
      case '1':
        addEmployee();
        break;
      case '2':
        findEmployee();
        break;
      case '3':
        deleteEmployee();
        break;
      case '4':
        addDelivery();
        break;
      case '5':
        findDelivery();
        break;
      case '6':
        deleteDelivery();
        break;
      case '7':
        calculateSalary();
        break;
      case '8':
        saveData();
        rl.close();
        break;
      default:
        console.log('Pilihan tidak valid.');
        showMenu();
        break;
    }
  });
}

showMenu();