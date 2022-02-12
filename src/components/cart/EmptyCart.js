import Link from 'next/link';

const EmptyCart = () => (
    <div className="container mx-auto my-32 px-4 xl:px-0">
        <h2 className="text-2xl mb-5">Carrinho vazio</h2>
        <Link href="/" passHref>
            <button className="px-5 py-3 rounded-sm">
                <span className="woo-next-cart-checkout-txt">Adicionar Produtos</span>
                <i className="fas fa-long-arrow-alt-right" />
            </button>
        </Link>
    </div>
);

export default EmptyCart;
