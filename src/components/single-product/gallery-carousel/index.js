import { isEmpty, isArray } from 'lodash';
import { useState, useRef } from 'react';
import Image from 'next/image';

const GalleryCarousel = ({ gallery }) => {

    const [slide, setSlide] = useState(0);

    if (isEmpty(gallery) || !isArray(gallery)) {
        return null;
    }

    const handleThumbClick = index => (ev) => {
        setSlide(index);
    };

    const nextSlide = () => {
        let current = slide + 1;
        if (current >= gallery?.length) {
            current = 0;
        }
        setSlide(current);
    };

    const prevSlide = () => {
        let current = slide - 1;
        if (current < 0) {
            current = gallery?.length - 1;
        }
        setSlide(current);
    };

    return (
        <div className="md:mr-4">
            <div
                className="banner-img1 relative w-full mb-4"
            >
                {
                    gallery.map((item, index) => {
                        const hidden = (slide === index || 1 === gallery.length)
                            ? ''
                            : 'hidden';
                        return (
                            <div
                                key={index}
                                className={`banner-img-container relative`}
                            >
                                <span className={hidden}>
                                    <Image
                                        className={`prod-img ${hidden}`}
                                        title={`Imagem do Produto - ${item.title}`}
                                        src={item?.mediaItemUrl}
                                        loading="lazy"
                                        width="100%"
                                        height="100%"
                                        layout="responsive"
                                        objectFit='contain'
                                        alt={item?.altText ? item?.altText : item?.title}
                                    />
                                </span>
                            </div>
                        )
                    })
                }
                <div className="image-nav">
                    <button
                        title="Anterior"
                        className="slider-button left focus:outline-none"
                        onClick={prevSlide}
                    >
                        {"<"}
                    </button>
                    <button
                        title="Próximo"
                        className="slider-button right focus:outline-none"
                        onClick={nextSlide}
                    >
                        {">"}
                    </button>
                </div>
            </div>
            <div className="gallery-thumbs relative w-full">
                <ol className="flex flex-wrap">
                    {
                        gallery.map((item, index) => {
                            const opacity = (slide === index || 1 === gallery.length)
                                ? ''
                                : 'opacity-75';
                            return (
                                <li
                                    key={index}
                                    className={`${opacity} w-16 h-16 mr-2 ml-0 cursor-pointer list-none`}
                                    onClick={handleThumbClick(index)}
                                >
                                    <Image
                                        src={item?.mediaItemUrl}
                                        loading="lazy"
                                        alt={item?.altText ? item?.altText : item?.title}
                                        className="h-16"
                                        width="100%"
                                        height="100%"
                                        layout="responsive"
                                        objectFit='contain'
                                    />
                                </li>
                            )
                        })
                    }
                </ol>
            </div>

        </div>
    )
}

export default GalleryCarousel
