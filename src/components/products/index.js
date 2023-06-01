import { isEmpty, isArray } from 'lodash';
import Product from '../product';
import PropTypes from 'prop-types';

const Products = ({ 
	products, 
}) => {

	if (isEmpty(products) && !isArray(products)) {
		return null;
	}

	return (
		<>
			<div
				title="Produtos"
				className="grid grid-cols-1 
					sm:grid-cols-2 
					md:grid-cols-2 
					lg:grid-cols-3 
					xl:grid-cols-4
					justify-items-center
					gap-4 
					pl-2"
			>
				{products.length ? (
					products.map(product =>
						<Product
							key={product.id}
							product={product}
							showBuyButton={false}
						/>
					)
				) : ''}
			</div>
		</>
	);
};

Products.propTypes = {
	products: PropTypes.array
};

Products.defaultProps = {
	products: []
};

export default Products;
