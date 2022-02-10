# [WooCommerce Nextjs React Theme](https://woo-next-br-fabio-jun.vercel.app/) :rocket:
[![Project Status: Active.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)

## Description ⭐:
This is a theme designed to work with WooCommerce headless WordPress site.
Some of the technologies used:
* The theme was built using React lib and NextJS to generate the page on the server side.
* Uses GraphQL queries and mutations with Apollo client to retrieve information from the server, manage the cart and create the order. 
* Shipping cost information is present in the product page and is integrated with Correios-BR.

## Live Demo:

[Live Demo Site](https://woo-next-br-fabio-jun.vercel.app/)

## Demo Desktop :video_camera:

![](demos/home-demo.gif)

## Checkout Page Demo
![](demos/Checkout-page.gif)

## Payment Demo ( Paypal example )
![](demos/paypal-payment-demo.gif)

## Order Received Demo
![](demos/order-received-demo.gif)

## Stripe Checkout 
[Stripe Demo Video](https://youtu.be/i75_Vtx-CnA)
![](demos/stripe-demo.gif)

# Features:

* WooCommerce Store in React, containg the following pages: Products, Single Product, AddToCart, Cart and Checkout.
* SSR - Server Side Rendering using NextJs.
* SEO friendly, integrated with Add WPGraphQL SEO plugin.
* Paginated Blog Posts from the WordPress backend.
* Automatic Code Splitting
* Hot Reloading
* Prefetching
* Incremental Static (Re)generation ( Next.js 12 support )
* GraphQL with Apollo Client
* Tailwindcss
* Integrated with Mercado Pago CheckoutPro Gateway
* New brazilian gateways in the near future.

## Getting Started :rocket:

These instructions will get you a copy of the project up and running on your local machine for development purposes.

### Prerequisites :page_facing_up:

### Installing :wrench:

1. Clone this repo using terminal `git clone git@github.com:fabiojundev/woo-next-br.git`
2. `cd woo-next-br`
3. `yarn install`

## Add GraphQl support for WordPress

1. Download and activate the following plugins , in your WordPress plugin directory:

* [wp-graphql](https://wordpress.org/plugins/wp-graphql/) Exposes graphql for WordPress ( **Tested with v-1.6.12** of this plugin )
* [wp-graphql-woocommerce](https://github.com/wp-graphql/wp-graphql-woocommerce) Adds Woocommerce functionality to a WPGraphQL schema ( **Tested with v-0.10.7** of this plugin )
* [add-wpgraphql-seo](https://wordpress.org/plugins/add-wpgraphql-seo/) Extends WPGraphQL Schema to use with Yoast SEO ( **Tested with v-4.16.0** of this plugin )
* [wp-graphql-offset-pagination](https://github.com/valu-digital/wp-graphql-offset-pagination) Extends WPGraphQL Schema to accept pagination in blog posts ( **Tested with v-0.20.0** of this plugin )

* Make sure Woocommerce plugin is also installed in your WordPress site. You can also import default wooCommerce products that come with wooCommerce Plugin for development ( if you don't have any products in your WordPress install ) `WP Dashboard > Tools > Import > WooCommerce products(CSV)`: The WooCommerce default products csv file is available at `wp-content/plugins/woocommerce/sample-data/sample_products.csv`

## Configuration (.env file) :wrench:

1. (Required) Create a `.env` file taking reference from `.env-example` and update your WordPressSite URL.
- CMS public url: `NEXT_PUBLIC_WORDPRESS_URL=https://examplo.com.br`
- WooCommerce API KEY: `WC_CONSUMER_KEY=public_xxx`, `WC_CONSUMER_SECRET=secret_xxx`
- Mercado Pago API KEY: `NEXT_PUBLIC_MP_PUBLIC_TOKEN=public_xxx`, `MP_ACCESS_TOKEN=access_xxx`,
`NEXT_PUBLIC_MP_IPN_URL=https://cms.exemplo.com.br/wc-api/wc_woomercadopago_basic_gateway/`,
`NEXT_PUBLIC_MP_RETURN_URL=https://exemplo.com.br/pedido-recebido/`


## Branch details


The `main` has the GraphQL implementation and is the current development branch.

## Common Commands :computer:

* `yarn dev` Runs server in development mode
* `yarn build` Build production bundles. Use it to test if everything is ok for deploy.

## Important Note ⭐:
This is a fork from [imhran-sayed's project](https://github.com/imranhsayed/woo-next/), customized for brazilian market.

Este é um [fork do projeto do imhran-sayed](https://github.com/imranhsayed/woo-next/), personalizado para o mercado brazileiro.

## Code Contributors ✰

Thanks to all the people who contributed to the code of this project 🤝

<div>
    <img src="https://github.com/fabiojundev.png?size=30" alt="Fabio Jun">
    <img src="https://github.com/imranhsayed.png?size=30" alt="Imran Sayed">
    <img src="https://github.com/w3bdesign.png?size=30" alt="Daniel F">
    <img src="https://github.com/delunix.png?size=30" alt="Fandi Rahmawan">
    <img src="https://github.com/yudyananda.png?size=30" alt="yudyananda">
</div>


## Contributing :busts_in_silhouette:

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Author :bust_in_silhouette:

* **[Fabio Jun](https://wpplugins.dev/)**

## License :page_with_curl:

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
