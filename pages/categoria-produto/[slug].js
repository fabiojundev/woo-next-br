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
import ProductsLayout from "../../src/components/products/ProductsLayout";


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
		<ProductsLayout 
			{...props}
		/>
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
