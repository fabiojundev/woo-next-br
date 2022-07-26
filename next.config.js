const path = require("path");
const allowedImageWordPressDomain = new URL(process.env.NEXT_PUBLIC_WORDPRESS_URL).hostname

module.exports = {
    trailingSlash: true,
    async rewrites() {
        return [
            {
                source: '/loja/',
                destination: '/',
            },
            {
                source: '/envio-e-prazo-de-entrega/',
                destination: '/pagina/envio-e-prazo-de-entrega/',
            },
            {
                source: '/politica-de-privacidade/',
                destination: '/pagina/politica-de-privacidade/',
            },
            {
                source: '/garantia-e-politica-de-reembolso/',
                destination: '/pagina/garantia-e-politica-de-reembolso/',
            },
            {
                source: '/sobre-nos/',
                destination: '/pagina/sobre-nos/',
            },
        ]
    },
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.html/,
            use: [
                options.defaultLoaders.babel,
                {
                    loader: 'html-loader',
                },
            ],
        })

        return config;
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
    },
    /**
     * We specify which domains are allowed to be optimized.
     * This is needed to ensure that external urls can't be abused.
     * @see https://nextjs.org/docs/basic-features/image-optimization#domains
     */
    images: {
        domains: [allowedImageWordPressDomain, 'via.placeholder.com'],
    },
};
