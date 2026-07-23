import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartPanel } from '../../components/cart/CartPanel';
import { Button, Card, PageHeader } from '../../components/common/ui';

export const CartPage = () => { const navigate = useNavigate(); return <div className="mx-auto max-w-3xl space-y-5"><PageHeader title="購物車" description="確認餐點數量與客製需求後，再前往結帳。" actions={<Button variant="secondary" onClick={() => navigate('/menu')}><ArrowLeft size={16}/>繼續選購</Button>}/><Card className="min-h-[520px] p-5 sm:p-7"><CartPanel/></Card></div>; };
