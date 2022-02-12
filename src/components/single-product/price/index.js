import { isEmpty } from "lodash";
import { getFloatVal } from "../../../../src/functions.js";

const Price = ({
    regularPrice = 0,
    salesPrice,
    showPercent = false
}) => {

    if (isEmpty(salesPrice)) {
        return null;
    }

    /**
     * Get discount percent.
     *
     * @param {String} regularPrice
     * @param {String} salesPrice
     */
    const discountPercent = (regularPrice, salesPrice) => {
        if (isEmpty(regularPrice) || isEmpty(salesPrice)) {
            return null;
        }

        const formattedRegularPrice = getFloatVal(regularPrice);
        const formattedSalesPrice = getFloatVal(salesPrice);

        let discountPercent = (formattedRegularPrice - formattedSalesPrice) / formattedRegularPrice * 100;
        const numberFormatter = new Intl.NumberFormat(
            'pt-BR', 
            { maximumFractionDigits: 1 }
        );
        discountPercent = numberFormatter.format(discountPercent);

        return {
            discountPercent: formattedSalesPrice !== formattedRegularPrice 
                ? `(${discountPercent}% de desconto)` 
                : null,
            strikeThroughClass: formattedSalesPrice < formattedRegularPrice 
                ? 'product-regular-price mr-2 line-through text-sm text-gray-600 font-normal' 
                : '',
        }
    }

    const productMeta = discountPercent(regularPrice, salesPrice);

    return (
        <h6 className="product-price text-gray-800 mr-3 mb-5">

            {/* Discounted price */}
            {(regularPrice != salesPrice)
                && (
                    <span
                        className={productMeta?.strikeThroughClass}
                    >
                        {regularPrice}
                    </span>
                )
            }
            {/* Regular price */}
            <span className="product-price mr-2 text-green-default text-lg">
                {salesPrice}
            </span>

            {/* Discount percent */}
            {showPercent
                && (
                    <span
                        className="product-discount text-green-600 font-bold text-sm"
                    >
                        {productMeta?.discountPercent}
                    </span>
                )
            }
        </h6>
    )
}

export default Price
