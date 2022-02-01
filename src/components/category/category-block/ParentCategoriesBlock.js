import ProductCategoryBlock from "./ParentCategoryBlock";

const ParentCategoriesBlock = ( props ) => {

	const { productCategories } = props || {};

	return (
		<ul 
			className="product-categories"
		>
			{ productCategories?.length ? (
				productCategories.map( ( productCategory, index ) => 
					<ProductCategoryBlock 
						key={ productCategory?.id ?? index }  
						category={ productCategory }
					/> 
				)
			) : null }
		</ul>
	)

};

export default ParentCategoriesBlock;
