import Layout from "../../src/components/Layout";
import client from "../../src/components/ApolloClient";
// import Product from "../../src/components/Product";
import { PER_PAGE_FIRST, totalPagesCount } from '../../src/utils/pagination';
import Products from "../../src/components/products";
import {PRODUCT_BY_CATEGORY_SLUG, PRODUCT_CATEGORIES_SLUGS} from "../../src/queries/product-by-category";
import ParentCategoriesBlock from "../../src/components/category/category-block/ParentCategoriesBlock";
import {isEmpty} from "lodash";
import {useRouter} from "next/router";
import ContactWhatsApp from '../../src/components/ContactWhatsApp';
import InstagramEmbed from '../../src/components/InstagramEmbed.html';


export default function CategorySingle( props ) {

    const router = useRouter()

    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
        return <div>Carregando...</div>
    }

    const { 
			categoryName, 
			products,
			productsPageCount,
			productCategories 
	} = props;

    return (
        <Layout>
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
					{ categoryName ? <h3 className="text-2xl mb-5 uppercase">{ categoryName }</h3> : '' }
					<Products
						products={products}
						productsPageCount={productsPageCount}
					/>
				</section>
				<aside
					id="siderbar"
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
    );
};

export async function getStaticProps(context) {

    const {params: { slug }} = context

    const {data} = await client.query(({
        query: PRODUCT_BY_CATEGORY_SLUG,
        variables: { slug }
    }));

    return {
        props: {
            categoryName: data?.productCategory?.name ?? '',
            products: data?.productCategory?.products?.nodes ?? [],
			productsPageCount: totalPagesCount(data?.productCategory?.products?.pageInfo?.pagesCount ?? 0),
            productCategories: data?.productCategories?.nodes
				? data.productCategories.nodes
				: [],
        },
        revalidate: 1
    }

}

export async function getStaticPaths () {
    const { data } = await client.query({
        query: PRODUCT_CATEGORIES_SLUGS
    })

    const pathsData = []

    data?.productCategories?.nodes && data?.productCategories?.nodes.map((productCategory) => {
        if (!isEmpty(productCategory?.slug)) {
            pathsData.push({ params: { slug: productCategory?.slug } })
        }
    })

    return {
        paths: pathsData,
        fallback: true
    }
}
