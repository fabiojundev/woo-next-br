import { formatCurrency } from "../../functions";
import Image from 'next/image';

const CheckoutCartItem = ({ item }) => {

	return (
		<tr className="woo-next-cart-item" key={item.productId}>
			<td className="woo-next-cart-element w-16">
				<Image
					width="100%"
					height="100%"
					layout="responsive"
					objectFit='contain'
					src={item.image.sourceUrl}
					srcSet={item.image.srcSet}
					alt={item.image.title}
				/>
			</td>
			<td className="woo-next-cart-element text-sm">
				{item.name} x {item.qty}
			</td>
			<td className="woo-next-cart-element">
				{formatCurrency(item.totalPrice)}
			</td>
		</tr>
	)
};

export default CheckoutCartItem;
