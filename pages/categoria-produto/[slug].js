import client from "../../src/components/ApolloClient";
import { PER_PAGE_FIRST, PER_PAGE_REST, totalPagesCount } from '../../src/utils/pagination';
import { 
    PRODUCT_BY_CATEGORY_SLUG, 
    PRODUCT_CATEGORIES_SLUGS, 
} from "../../src/queries/product-by-category";
import PRODUCTS_AND_CATEGORIES_QUERY from "../../src/queries/product-and-categories";

import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import ProductsLayout from "../../src/components/products/ProductsLayout";

export default function CategorySingle(props) {

    const router = useRouter()

    if (router.isFallback) {
        return <div>Carregando...</div>
    }

    return (
        <ProductsLayout
            {...props}
            path={`categoria-produto/${router.query.slug}`}
        />
    );
};

export async function getStaticProps({ params }) {

    let { slug, pageNo } = params || {};
    pageNo = pageNo ? pageNo : 1;

    const { data } = await client.query(({
        query: PRODUCTS_AND_CATEGORIES_QUERY,
        variables: {
            slug: [slug],
            perPage: PER_PAGE_FIRST,
            offset: (pageNo - 1) * PER_PAGE_FIRST,
        }
    }));

    return {
        props: {
            categoryName: data?.productCategories?.nodes?.[0]?.name ?? '',
            products: data?.products?.nodes ?? [],
            productsPageCount: totalPagesCount( data?.products?.pageInfo?.offsetPagination?.total ?? 0 ),
            productCategories: data?.productCategories?.nodes
                ? data.productCategories.nodes
                : [],
        },
        revalidate: 1
    }

}

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
