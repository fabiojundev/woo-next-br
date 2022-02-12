import Layout from '../../src/components/Layout';
import { useRouter } from 'next/router';
import client from '../../src/components/ApolloClient';
import AddToCartButton from '../../src/components/cart/AddToCartButton';
import { PRODUCT_BY_SLUG_QUERY, PRODUCT_SLUGS } from '../../src/queries/product-by-slug';
import { isEmpty } from 'lodash';
import GalleryCarousel from "../../src/components/single-product/gallery-carousel";
import Price from "../../src/components/single-product/price";
import ShippingCosts from "../../src/components/single-product/ShippingCosts";

export default function Product(props) {
    const { product } = props;
    const router = useRouter()

    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
        return <div>Carregando...</div>
    }

    return (
        <Layout>
            {product ? (
                <div className="single-product">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="product-images">
                            <GalleryCarousel
                                gallery={[
                                    { 
                                        ...product?.image,
                                        mediaItemUrl: product?.image?.sourceUrl 
                                    },
                                    ...product?.galleryImages?.nodes
                                ]}
                            />
                        </div>
                        <div className="product-info">
                            <h1 className="products-main-title">
                                {product.name}
                            </h1>
                            <Price
                                salesPrice={product?.price}
                                regularPrice={product?.regularPrice}
                            />
                            <hr className='mb-2' />
                            <div
                                className="product-description mb-5"
                                dangerouslySetInnerHTML={{
                                    __html: product.shortDescription,
                                }}
                            />
                            {product?.visibleProducts?.nodes?.find(node => node.slug === 'outofstock')
                                ? <div>Produto Esgotado</div>
                                : <>
                                    <ShippingCosts
                                        productId={product?.productId}
                                    />
                                    <AddToCartButton
                                        product={product}
                                        showQuantity={true}
                                    />
                                </>
                            }
                        </div>
                    </div>
                    <div
                        className="mt-8"
                    >
                        <h2>Descrição</h2>
                        <hr className="mb-4" />
                        <div
                            className="columns-1 md:columns-2 gap-10"
                            dangerouslySetInnerHTML={{
                                __html: product.description,
                            }}
                        />
                    </div>
                </div>
            ) : (
                ''
            )}
        </Layout>
    );
};


export async function getStaticProps(context) {

    const { params: { slug } } = context

    const { data } = await client.query({
        query: PRODUCT_BY_SLUG_QUERY,
        variables: { slug }
    })

    return {
        props: {
            data,
            product: data?.product || {},
        },
        revalidate: 1
    };
}

export async function getStaticPaths() {
    const { data } = await client.query({
        query: PRODUCT_SLUGS
    })

    const pathsData = []

    data?.products?.nodes && data?.products?.nodes.map((product) => {
        if (!isEmpty(product?.slug)) {
            pathsData.push({ params: { slug: product?.slug } })
        }
    })

    return {
        paths: pathsData,
        fallback: true
    }
}
