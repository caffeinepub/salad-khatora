export function exportSalesCSV(salesData: any[]) {
  const headers = ['Invoice ID', 'Customer Name', 'Phone Number', 'Items', 'Total Price', 'Discount', 'Payment Mode', 'Date'];
  
  const rows = salesData.map(sale => [
    sale.id || '',
    sale.customerName || '',
    sale.phoneNumber || '',
    sale.items || '',
    sale.totalPrice || 0,
    sale.discount || 0,
    sale.paymentMode || '',
    sale.date ? new Date(sale.date).toLocaleDateString('en-IN') : '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  downloadCSV(csvContent, `sales-report-${new Date().toISOString().split('T')[0]}.csv`);
}

export function exportInventoryCSV(inventoryData: any[]) {
  const headers = ['Ingredient Name', 'Quantity', 'Unit Type', 'Cost Price Per Unit', 'Supplier Name', 'Low Stock Threshold', 'Total Value'];
  
  const rows = inventoryData.map(item => [
    item.name || '',
    item.quantity || 0,
    item.unitType || '',
    item.costPricePerUnit || 0,
    item.supplierName || '',
    item.lowStockThreshold || 0,
    (item.quantity * item.costPricePerUnit) || 0,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  downloadCSV(csvContent, `inventory-report-${new Date().toISOString().split('T')[0]}.csv`);
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
