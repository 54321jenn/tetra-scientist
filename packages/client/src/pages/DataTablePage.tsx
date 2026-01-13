import CustomTable, { TableColumn } from '../components/CustomTable';
import './DataTablePage.css';

interface SampleData {
  id: number;
  name: string;
  email: string;
  status: string;
  date: string;
}

// Sample data for the table
const sampleData: SampleData[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'Active', date: '2024-01-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', status: 'Active', date: '2024-01-16' },
  { id: 3, name: 'Carol Williams', email: 'carol@example.com', status: 'Inactive', date: '2024-01-17' },
  { id: 4, name: 'David Brown', email: 'david@example.com', status: 'Active', date: '2024-01-18' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', status: 'Pending', date: '2024-01-19' },
];

function DataTablePage() {
  // Define table columns
  const columns: TableColumn<SampleData>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status', width: '120px' },
    { key: 'date', header: 'Date', width: '150px' },
  ];

  return (
    <div className="data-table-page">
      <div className="data-table-content">
        <CustomTable
          data={sampleData}
          columns={columns}
        />
      </div>
    </div>
  );
}

export default DataTablePage;

