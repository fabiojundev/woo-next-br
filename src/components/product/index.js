import Link from 'next/link';
import AddToCartButton from '../cart/AddToCartButton';
import Price from "../single-product/price";
import Image from "../image";

const Product = (props) => {
	const {
		product,
		showBuyButton
	} = props;

	return (
		// @TODO Need to handle Group products differently.
		undefined !== product && 'GroupProduct' !== product.__typename ? (
			<div
				className="product mb-5 border border-solid rounded"
				title="Produto"
			>
				<Link href={`/produto/${product?.slug}`} >
					<a>
						<Image
							className="object-cover bg-gray-100"
							width="308"
							height="308"
							loading="lazy"
							sourceUrl={product?.image?.sourceUrl ?? ''}
							showDefault={true}
							alt={product?.image?.altText ?? product.slug}
						/>
					</a>
				</Link>
				<div className="product-info p-2">
					<Link href={`/produto/${product?.slug}`} >
						<a>
							<h3 className="product-title mt-3 font-medium">
								{product.name ? product.name : ''}
							</h3>
							<Price
								salesPrice={product?.price}
								regularPrice={product?.regularPrice}
							/>
						</a>
					</Link>
					{showBuyButton
						? product?.visibleProducts?.nodes?.find(node => node.slug === 'outofstock')
							? <div>Produto Esgotado</div>
							: <AddToCartButton
								product={product}
							/>
						: ''}
				</div>

			</div>
		) : (
			''
		)
	);
};

export default Product;
