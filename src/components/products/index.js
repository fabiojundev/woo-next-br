import { isEmpty, isArray } from 'lodash';
import Product from '../product';
import PropTypes from 'prop-types';
import Pagination from '../blog/pagination';


const Products = ({ products, productsPageCount }) => {

	if (isEmpty(products) && !isArray(products)) {
		return null;
	}

	return (
		<>
			<div
				className="grid grid-cols-1 
					sm:grid-cols-2 
					md:grid-cols-2 
					lg:grid-cols-3 
					xl:grid-cols-4
					justify-items-center
					gap-4"
			>
				{products.length ? (
					products.map(product =>
						<Product
							key={product.id}
							product={product}
						/>
					)
				) : ''}
			</div>
			<Pagination
				pagesCount={productsPageCount}
				postName="produtos"
			/>
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
