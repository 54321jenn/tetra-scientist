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
  return (
    <div className="app-container">
      <div className="demo-grid">
        <div style={{ gridColumn: '1 / -1' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left', width: '80px' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left', width: '200px' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left', width: '250px' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left', width: '120px' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', width: '150px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{row.id}</td>
                  <td style={{ padding: '12px' }}>{row.name}</td>
                  <td style={{ padding: '12px' }}>{row.email}</td>
                  <td style={{ padding: '12px' }}>{row.status}</td>
                  <td style={{ padding: '12px' }}>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DataTablePage;

