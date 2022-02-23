
export const getProduct = (id, qty = 1) => ({
    id: id,
    qty: qty,
    productId: id,
    price: "R$10,00",
    totalPrice: `R$${10 * qty},00`,
    name: `Product ${id}`,
    description: `Product ${id} description`,
    type: "simple",
    onSale: false,
    slug: "product-" + id,
    averageRating: 5,
    reviewCount: 10,
    image: {
        id: "11",
        sourceUrl: "https://via.placeholder.com/150",
        altText: "Image alt for product " + id
    },
    galleryImages: {
        nodes: [
            {
                id: "111",
                sourceUrl: "https://via.placeholder.com/150",
                altText: "Gallery image alt for product " + id
            },
        ],
    },

});

export const product = getProduct("1");

export const productNode = {
    node: {
        id: "cHJvZHVjdDo0NzA=",
        productId: 470,
        name: "Nome do Produto",
        description: "Descrição",
        type: "SIMPLE",
        onSale: false,
        slug: "product-slug",
        averageRating: 0,
        reviewCount: 0,
        image: {
            id: "cG9zdDo0NjQ=",
            src: "https://via.placeholder.com/150",
            sourceUrl: "https://via.placeholder.com/150", 
            altText: "Alt text",
            title: "Nome do Produto title",
            srcSet: "",
        },
        galleryImages: {
            nodes: []
        },
    }
};
