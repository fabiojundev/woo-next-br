import { formatCurrency } from "../../functions";
const CheckoutCartItem = ({ item }) => {

	return (
		<tr className="woo-next-cart-item" key={item.productId}>
			<td className="woo-next-cart-element">
				<img
					width="64"
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
