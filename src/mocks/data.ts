import type { CompanyRule, DeliveryLocation, Department, Meal, MealOption, Order, ReportData, User } from '../types';

const mealImages = [
  '/meals/bento-1.svg', '/meals/bento-2.svg', '/meals/bento-3.svg',
  '/meals/bento-4.svg', '/meals/bento-5.svg', '/meals/bento-6.svg',
];

const sharedOptions: MealOption[] = [
  { id: 'rice-normal', name: '正常飯', group: 'rice', price: 0 },
  { id: 'rice-less', name: '少飯', group: 'rice', price: 0 },
  { id: 'rice-extra', name: '加飯', group: 'rice', price: 10 },
  { id: 'no-spicy', name: '不辣', group: 'flavor', price: 0 },
  { id: 'no-cilantro', name: '不要香菜', group: 'flavor', price: 0 },
];

export const meals: Meal[] = [
  ['M01', '香煎雞腿便當', '香煎去骨雞腿搭配時蔬與溏心蛋', 120, 'main', true, 18],
  ['M02', '照燒雞胸便當', '低脂雞胸淋上自製日式照燒醬', 110, 'healthy', true, 12],
  ['M03', '檸檬鯖魚便當', '挪威鯖魚佐清爽檸檬胡椒', 135, 'healthy', true, 7],
  ['M04', '蒜香豚肉便當', '國產豬肉與蒜片大火快炒', 115, 'main', false, 15],
  ['M05', '胡麻時蔬餐盒', '七種當季蔬菜與濃郁胡麻醬', 105, 'vegetarian', false, 9],
  ['M06', '韓式泡菜燒肉', '微辣泡菜搭配嫩煎里肌肉', 125, 'main', true, 6],
  ['M07', '舒肥雞胸餐盒', '低溫熟成雞胸、高纖藜麥飯', 130, 'healthy', true, 14],
  ['M08', '日式咖哩牛肉', '慢燉牛肉與溫潤蔬果咖哩', 140, 'main', false, 0],
  ['M09', '野菇豆腐便當', '綜合野菇與板豆腐，純植物餐點', 110, 'vegetarian', false, 11],
  ['M10', '剝皮辣椒雞湯', '甘甜微辣的暖心個人湯品', 65, 'soup', true, 20],
  ['M11', '桂花烏龍茶', '無糖冷泡烏龍，淡雅桂花香', 45, 'drink', false, 28],
  ['M12', '黑糖豆乳布丁', '滑嫩豆乳與手炒黑糖蜜', 55, 'snack', false, 8],
].map(([id, name, description, price, category, isPopular, stock], index) => ({
  id: String(id), name: String(name), description: String(description), price: Number(price),
  category: category === 'main' || category === 'healthy' || category === 'vegetarian' || category === 'soup' || category === 'drink' ? category : 'snack',
  image: mealImages[index % mealImages.length], isPopular: Boolean(isPopular), isFavorite: index % 3 === 0,
  stock: Number(stock), ingredients: ['台灣米', '當季時蔬', index % 2 === 0 ? '溏心蛋' : '毛豆'],
  allergens: index % 3 === 0 ? ['蛋', '大豆'] : ['大豆'], calories: 420 + index * 23, options: sharedOptions,
}));

const orderItems = (offset: number) => [
  { id: `OI-${offset}-1`, mealId: meals[offset % meals.length].id, mealName: meals[offset % meals.length].name, image: meals[offset % meals.length].image, quantity: 1 + (offset % 2), options: ['少飯', '不辣'], unitPrice: meals[offset % meals.length].price, subtotal: meals[offset % meals.length].price * (1 + (offset % 2)) },
];

const statuses: Order['status'][] = ['pending', 'processing', 'completed', 'completed', 'cancelled'];
export const orders: Order[] = Array.from({ length: 10 }, (_, index) => {
  const items = orderItems(index);
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const status = statuses[index % statuses.length];
  return {
    id: `MF202607${String(2101 - index).padStart(4, '0')}`, orderedAt: `2026-07-${String(21 - index).padStart(2, '0')} 09:${String(12 + index).padStart(2, '0')}`,
    deliveryDate: `2026-07-${String(22 + (index % 5)).padStart(2, '0')}`, deliveryTime: index % 2 === 0 ? '12:00–12:30' : '11:30–12:00',
    customerName: index % 2 === 0 ? '王小明' : '林怡君', customerPhone: '0912-345-678', department: index % 2 === 0 ? '產品設計部' : '行銷部',
    deliveryLocation: index % 2 === 0 ? '總公司｜信義辦公室' : '內湖分部｜瑞光辦公室', paymentMethod: index % 3 === 0 ? 'company' : 'monthly',
    invoiceType: 'three-copy', taxId: '24536806', invoiceTitle: '澄境科技股份有限公司', note: index % 2 === 0 ? '餐點送達請通知櫃檯' : '', status, items,
    subtotal, shippingFee: subtotal >= 300 ? 0 : 30, discount: index % 3 === 0 ? 20 : 0, total: subtotal + (subtotal >= 300 ? 0 : 30) - (index % 3 === 0 ? 20 : 0),
    timeline: ['訂單已建立', '店家已確認', '餐點準備中', '配送中', '已完成'].map((label, timelineIndex) => ({ label, completed: status === 'completed' || (status === 'processing' && timelineIndex < 3) || timelineIndex === 0, time: timelineIndex < 2 ? `2026/07/${String(21 - index).padStart(2, '0')} 09:${12 + timelineIndex * 6}` : undefined })),
  };
});

export const departments: Department[] = [
  { id: 'D01', name: '產品設計部', manager: '陳品妤', memberCount: 18 },
  { id: 'D02', name: '行銷部', manager: '林怡君', memberCount: 12 },
  { id: 'D03', name: '工程部', manager: '張家豪', memberCount: 32 },
];

export const users: User[] = [
  { id: 'U01', name: '王小明', email: 'ming@mealflow.tw', phone: '0912-345-678', departmentId: 'D01', departmentName: '產品設計部', title: '產品經理', company: '澄境科技', role: 'admin', status: 'active' },
  { id: 'U02', name: '陳品妤', email: 'pinyu@mealflow.tw', phone: '0922-123-456', departmentId: 'D01', departmentName: '產品設計部', title: '設計主管', company: '澄境科技', role: 'member', status: 'active' },
  { id: 'U03', name: '林怡君', email: 'yijun@mealflow.tw', phone: '0933-789-012', departmentId: 'D02', departmentName: '行銷部', title: '行銷經理', company: '澄境科技', role: 'member', status: 'active' },
  { id: 'U04', name: '張家豪', email: 'hao@mealflow.tw', phone: '0955-246-810', departmentId: 'D03', departmentName: '工程部', title: '技術主管', company: '澄境科技', role: 'member', status: 'active' },
  { id: 'U05', name: '許雅婷', email: 'yating@mealflow.tw', phone: '0966-135-790', departmentId: 'D03', departmentName: '工程部', title: '前端工程師', company: '澄境科技', role: 'member', status: 'inactive' },
];

export const locations: DeliveryLocation[] = [
  { id: 'L01', name: '總公司｜信義辦公室', address: '台北市信義區信義路五段7號', floor: '18 樓', contact: '總機櫃檯', phone: '02-2720-8888', isActive: true },
  { id: 'L02', name: '內湖分部｜瑞光辦公室', address: '台北市內湖區瑞光路358巷30弄1號', floor: '6 樓', contact: '林小姐', phone: '02-2658-6600', isActive: true },
  { id: 'L03', name: '新店物流中心', address: '新北市新店區寶橋路235巷2號', floor: '1 樓', contact: '周先生', phone: '02-2910-2211', isActive: true },
];

export const companyRule: CompanyRule = { cutoffTime: '10:30', minimumOrder: 80, chargeShipping: true, freeShippingThreshold: 300, preorderDays: 7, allowCancellation: true, cancellationCutoff: '10:00' };
export const reportData: ReportData = {
  trend: Array.from({ length: 14 }, (_, index) => ({ date: `07/${String(index + 8).padStart(2, '0')}`, amount: 1800 + ((index * 739) % 2300), orders: 18 + ((index * 7) % 24) })),
  categories: [{ name: '主食便當', value: 42 }, { name: '健康餐盒', value: 28 }, { name: '素食便當', value: 15 }, { name: '其他', value: 15 }],
  departments: [{ name: '工程部', amount: 32800 }, { name: '產品設計部', amount: 24600 }, { name: '行銷部', amount: 18900 }],
  statuses: [{ name: '待確認', value: 12 }, { name: '處理中', value: 21 }, { name: '已完成', value: 62 }, { name: '已取消', value: 5 }],
};
