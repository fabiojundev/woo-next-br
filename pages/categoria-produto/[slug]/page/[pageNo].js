import { useRouter } from 'next/router';
import {
	getPageOffset,
	totalPagesCount,
	PER_PAGE_FIRST,
	PER_PAGE_REST
} from '../../../../src/utils/pagination';
import client from '../../../../src/components/ApolloClient';
import PRODUCTS_AND_CATEGORIES_QUERY from '../../../../src/queries/product-and-categories';
import { 
    PRODUCT_BY_CATEGORY_SLUG, 
    PRODUCT_CATEGORIES_SLUGS, 
} from "../../../../src/queries/product-by-category";

import { isEmpty } from "lodash";
import ProductsLayout from '../../../../src/components/products/ProductsLayout';

const Page = (props) => {
	const router = useRouter();

	// Redirecting to /blog if we are on page 1
	const pageNo = router?.query?.pageNo ?? 1;

	return (
		<ProductsLayout
			{...props}
			path={`categoria-produto/${router.query.slug}`}
		/>
	);
};

export default Page;

export async function getStaticProps({ params }) {

	let { pageNo, slug } = params || {};

	const offset = getPageOffset( pageNo );
	pageNo = pageNo ? pageNo : 1;
	const { data, errors } = await client.query({
		query: PRODUCTS_AND_CATEGORIES_QUERY,
		variables: {
            slug: [slug],
			perPage: '1' === pageNo ? PER_PAGE_FIRST : PER_PAGE_REST,
			offset,
		},
	});

	return {
		props: {
			data: data || {},
			productCategories: data?.productCategories?.nodes
				? data.productCategories.nodes
				: [],
			products: data?.products?.nodes || [],
			productsPageCount: totalPagesCount(data?.products?.pageInfo?.offsetPagination?.total ?? 0),
			heroCarousel: data?.heroCarousel?.nodes[0]?.children?.nodes
				? data.heroCarousel.nodes[0].children.nodes
				: [],
		},
		revalidate: 1
	}

};

export async function getStaticPaths() {
    const { data } = await client.query({
        query: PRODUCT_CATEGORIES_SLUGS
    })

    let pathsData = [];

    data?.productCategories?.nodes && data?.productCategories?.nodes.map((productCategory) => {
        if (!isEmpty(productCategory?.slug)) {
            const totalProductsCount = productCategory?.productsCount?.pageInfo?.offsetPagination?.total ?? 0;
            const pagesCount = Math.ceil((totalProductsCount - PER_PAGE_FIRST) / PER_PAGE_REST + 1);

            const paths = new Array(pagesCount).fill('').map((_, index) => ({
                params: {
                    slug: productCategory?.slug,
                    pageNo: (index + 1).toString(),
                },
            }));
            pathsData = [...pathsData, ...paths];
        }
    })

    // console.log(pathsData);
    return {
        paths: pathsData,
        fallback: true
    }
}
