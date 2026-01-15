import * as XLSX from 'xlsx';
import { Order, Product } from '@/types';

export const exportOrdersToExcel = (orders: Order[]) => {
  const data = orders.map((order) => ({
    'رقم الطلب': order.id.slice(-6),
    'اسم العميل': order.customerName,
    'رقم الهاتف': order.customerPhone,
    'العنوان': order.customerAddress,
    'الحالة': getStatusLabel(order.status),
    'المنتجات': order.items.map(item => `${item.product.nameAr || item.product.name} (${item.quantity})`).join(', '),
    'الكميات': order.items.reduce((sum, item) => sum + item.quantity, 0),
    'المجموع': order.total.toFixed(2) + ' دج',
    'تاريخ الطلب': new Date(order.createdAt).toLocaleDateString('ar-DZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));

  const ws = XLSX.utils.json_to_sheet(data, { header: Object.keys(data[0] || {}) });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'الطلبات');

  // Auto-size columns
  const colWidths = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.max(key.length, ...data.map((row) => String(row[key as keyof typeof row]).length)) + 2,
  }));
  ws['!cols'] = colWidths;

  XLSX.writeFile(wb, `orders_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportStatsToExcel = (
  orders: Order[],
  topProducts: { name: string; quantity: number; revenue: number }[],
  salesByDay: { date: string; sales: number; orders: number }[]
) => {
  const wb = XLSX.utils.book_new();

  // Orders Summary Sheet
  const ordersSummary = orders.map((order) => ({
    'رقم الطلب': order.id.slice(-6),
    'العميل': order.customerName,
    'الهاتف': order.customerPhone,
    'الحالة': getStatusLabel(order.status),
    'المجموع': order.total,
    'التاريخ': new Date(order.createdAt).toLocaleDateString('ar-DZ'),
  }));

  if (ordersSummary.length > 0) {
    const ws1 = XLSX.utils.json_to_sheet(ordersSummary);
    XLSX.utils.book_append_sheet(wb, ws1, 'ملخص الطلبات');
  }

  // Top Products Sheet
  const productsData = topProducts.map((p) => ({
    'المنتج': p.name,
    'الكمية المباعة': p.quantity,
    'الإيرادات': p.revenue.toFixed(2) + ' دج',
  }));

  if (productsData.length > 0) {
    const ws2 = XLSX.utils.json_to_sheet(productsData);
    XLSX.utils.book_append_sheet(wb, ws2, 'المنتجات الأكثر مبيعاً');
  }

  // Daily Sales Sheet
  const salesData = salesByDay.map((day) => ({
    'اليوم': day.date,
    'عدد الطلبات': day.orders,
    'المبيعات': day.sales.toFixed(2) + ' دج',
  }));

  if (salesData.length > 0) {
    const ws3 = XLSX.utils.json_to_sheet(salesData);
    XLSX.utils.book_append_sheet(wb, ws3, 'المبيعات اليومية');
  }

  // Stats Summary Sheet
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const uniqueCustomers = new Set(orders.map((o) => o.customerPhone)).size;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const deliveryRate = orders.length > 0 ? (deliveredOrders / orders.length) * 100 : 0;

  const statsData = [
    { 'الإحصائية': 'إجمالي الإيرادات', 'القيمة': totalRevenue.toFixed(2) + ' دج' },
    { 'الإحصائية': 'إجمالي الطلبات', 'القيمة': orders.length.toString() },
    { 'الإحصائية': 'متوسط قيمة الطلب', 'القيمة': avgOrderValue.toFixed(2) + ' دج' },
    { 'الإحصائية': 'عدد العملاء', 'القيمة': uniqueCustomers.toString() },
    { 'الإحصائية': 'نسبة التوصيل', 'القيمة': deliveryRate.toFixed(0) + '%' },
  ];

  const ws4 = XLSX.utils.json_to_sheet(statsData);
  XLSX.utils.book_append_sheet(wb, ws4, 'ملخص الإحصائيات');

  XLSX.writeFile(wb, `statistics_${new Date().toISOString().split('T')[0]}.xlsx`);
};

const getStatusLabel = (status: Order['status']) => {
  const labels: Record<Order['status'], string> = {
    pending: 'قيد الانتظار',
    confirmed: 'تم التأكيد',
    shipped: 'جاري الشحن',
    delivered: 'تم التوصيل',
  };
  return labels[status];
};
