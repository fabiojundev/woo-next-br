import Link from 'next/link';
import AddToCartButton from '../components/cart/AddToCartButton';
import Price from "./single-product/price";
import Image from "../image";
import { DEFAULT_PRODUCT_HOME_IMG_URL } from "../constants/urls";

const Product = (props) => {
	const { product } = props;

	return (
		// @TODO Need to handle Group products differently.
		undefined !== product && 'GroupProduct' !== product.__typename ? (
			<div className="product mb-5">


				<Link href={`/produto/${product?.slug}`} >
					<a>
						<Image
							className="object-cover bg-gray-100"
							width="308"
							height="308"
							loading="lazy"
							sourceUrl={product?.image?.sourceUrl ?? ''}
							defaultImgUrl={DEFAULT_PRODUCT_HOME_IMG_URL}
							altText={product?.image?.altText ?? product?.slug}
						/>
					</a>
				</Link>
				<div className="product-info">
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
					{product?.visibleProducts?.nodes?.find(node => node.slug === 'outofstock')
						? <div>Produto Esgotado</div>
						: <AddToCartButton
							product={product}
						/>
					}
				</div>

			</div>
		) : (
			''
		)
	);
};

export default Product;
