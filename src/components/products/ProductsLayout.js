import Layout from '../Layout';
import ParentCategoriesBlock from "../category/category-block/ParentCategoriesBlock";
import HeroCarousel from "../home/hero-carousel";
import ContactWhatsApp from '../ContactWhatsApp';
import InstagramEmbed from '../InstagramEmbed.html';
import Products from '../products';
import Pagination from '../blog/pagination';

export default function ProductsLayout(props) {

	const {
		data,
		products,
		productsPageCount,
		productCategories,
		categoryName,
		path
	} = props || {};

	return (
		<Layout data={data}>
			{/*Hero Carousel*/}
			{/* <HeroCarousel heroCarousel={heroCarousel} /> */}
			{/*Products*/}
			<div className="products 
							mx-auto 
							my-10 
							xl:px-0 
							flex flex-wrap flex-row-reverse
							md:flex-nowrap							
							gap-8"
			>
				<section
					id="content"
					className="flex-grow z-10 bg-white"
				>
					<h2 className="products-main-title mb-5 text-xl">
						<ContactWhatsApp />
					</h2>
					{ categoryName ? <h3 className="text-2xl mb-5 uppercase">{ categoryName }</h3> : '' }
					<Products 
						products={products}
					/>
					<Pagination
						pagesCount={productsPageCount}
						postName={path || "produtos"}
					/>
				</section>
				<aside
					id="siderbar"
					title="Barra Lateral"
					className="w-full 
								md:w-1/3 
								lg:w-1/3 
								xl:w-1/3"
				>
					<ContactWhatsApp />
					<h2 className="pt-8 px-2">
						Categorias
					</h2>
					<ParentCategoriesBlock 
						productCategories={productCategories} 
					/>
					<div
						className="w-full" 
						dangerouslySetInnerHTML={ {__html: InstagramEmbed} } 
					/>
				</aside>
			</div>

		</Layout>
	)
};
