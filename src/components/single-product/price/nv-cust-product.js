import { isEmpty } from "lodash";
import { useState, useEffect } from "react";

const NVCustPrice = ({product, setProduct}) => {

    useEffect(() => {
        // init();
        // calcPrice();
    });
    
    const fields = {
        nv_width: {
            id: 'nv_width',
            value: 40,
            label: 'Largura (cm)'
        },
        nv_length: {
            id: 'nv_length',
            value: 30,
            label: 'Comprimento (cm)'
        },
        nv_height: {
            id: 'nv_height',
            value: 40,
            label: 'Altura (cm)'
        },

    };
    const [price, setPrice] = useState(0);
    const [volume, setVolume] = useState(0);

    const getDims = () => {
        let property = 'nv_width';
        const width = parseFloat(product[property]) ? parseFloat(product[property]) : fields[property].value;
        property = 'nv_height';
        const height = parseFloat(product[property]) ? parseFloat(product[property]) : fields[property].value;
        property = 'nv_length';
        const length = parseFloat(product[property]) ? parseFloat(product[property]) : fields[property].value;

        return {
            nv_width: width,
            nv_height: height,
            nv_length: length,
        };
    };


    const onMinus = property => ev => {
        let val = product[property] ? product[property] : fields[property].value;
        val = parseInt( val );
        val--;
        if (val < 1) {
            val = 1;
        }

        setProduct({
            ...product,
            ...getDims(),
            [property]: val,
        });
        calcPrice();
    };

    const onPlus = property => ev => {
        let val = product[property] ? product[property] : fields[property].value;
        val = parseInt( val );
        if ( ! val ) {
            val = 0;
        }
        val++;

        setProduct({
            ...product,
            ...getDims(),
            [property]: val,
        });
        calcPrice();
    };

    const calcPrice = () => {
        const dims = getDims();
        const width = dims.nv_width;
        const height = dims.nv_height;
        const length = dims.nv_length;

        console.log(product);
        if (width && height && length) {
            const fabric = product.fabricM2Price * product.consumptionFactor * (
                (width + 2) * (length + 2) +
                ((height + 4) * (2 * width + 2 * length + 2))
            ) / 10000;
            const line = product.lineMPrice * (width * 2 + length * 2) * 2 / 100;
            const mo = fabric * product.moVar + product.mo;
            const total = fabric + product.pvc + line + mo;
            const newPrice = Math.max(total, product.minPrice);

            const formatter = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            });
            console.log( 'price', newPrice, price );
            setPrice(formatter.format(newPrice));
        }

        const number_formatter = new Intl.NumberFormat('pt-BR');
        const newVol = number_formatter.format((width * length * height) / 1000);
        setVolume(newVol);
    };

    return (
        <h6 className="product-price text-gray-800 font-semibold mr-3 mb-5">
            <div className="nv-price-wrap">
                <div className="nv-price text-green-600 font-bold text-lg">{price}</div>
                <div className="nv-volume ">Volume: {volume} litros</div>
                <br />
            </div>
            <div className="nv_cust_product flex flex-wrap">

                {Object.values(fields).map(field => (
                    <div className="text-left" key={field.id} >
                        <label
                            className="screen-reader-text"
                            htmlFor="nv_width"
                        >
                            {field.label}
                        </label>
                        <div
                            className="mr-5 my-5 w-32 flex border border-gray-200 border-solid "
                        >
                            <input
                                type="button"
                                value="-"
                                className="minus w-10 h-10"
                                onClick={onMinus(field.id)}
                            />
                            <input
                                type="text"
                                id={field.id}
                                className="w-10 h-10 appearance-none text-center"
                                step="1"
                                min="20"
                                max="100"
                                name={field.id}
                                value={product[field.id]}
                                title="Qtd"
                                size="4"
                                inputMode="numeric"
                                onChange={ e => {}}
                            />
                            <input
                                type="button"
                                value="+" className="plus w-10 h-10"
                                onClick={onPlus(field.id)}
                            />
                        </div>
                    </div>
                ))}

            </div>
        </h6>
    )
}

export default NVCustPrice;
