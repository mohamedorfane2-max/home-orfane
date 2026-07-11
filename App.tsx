export interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  quantity: number;
  tableType: string;
  notes: string;
  status: 'جديد' | 'تم الاتصال' | 'مؤكد' | 'ملغي';
  createdAt: string;
}

export interface TableVariation {
  id: string;
  name: string;
  arabicName: string;
  price: number;
  originalPrice: number;
  description: string;
  arabicDescription: string;
  image: string;
  colors: { name: string; hex: string; arabicName: string }[];
  specs: { label: string; value: string }[];
}
export default function App() {
  return (
    <div className="App">
      <h1>مرحباً بك في متجر Home Decor</h1>
      {/* هنا يمكنك إضافة مكوناتك الأخرى لاحقاً */}
    </div>
  );
}
