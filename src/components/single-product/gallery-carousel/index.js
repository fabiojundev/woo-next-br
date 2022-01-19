import { isEmpty, isArray } from 'lodash';
import { useState, useRef } from 'react';

const GalleryCarousel = ({ mainImageUrl, gallery }) => {

    if (isEmpty(gallery) || !isArray(gallery)) {
        return null;
    }

    const [slide, setSlide] = useState(0);

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
            <div className="banner-img1 relative w-full mb-4">
                {
                    gallery.map((item, index) => {
                        const hidden = (slide === index || 1 === gallery.length)
                            ? ''
                            : 'hidden';
                        return (
                            <div
                                key={index}
                                className={`${hidden} banner-img-container relative`}
                            >
                                <img
                                    src={item?.mediaItemUrl}
                                    loading="lazy"
                                    alt={item?.altText ? item?.altText : item?.title}
                                />
                            </div>
                        )
                    })
                }
                <div className="image-nav">
                    <button
                        className="slider-button left focus:outline-none"
                        onClick={prevSlide}
                    >
                        <svg
                            width="20px"
                            className="inline-block"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                    </button>
                    <button
                        className="slider-button right focus:outline-none"
                        onClick={nextSlide}
                    >
                        <svg
                            width="20px"
                            className="inline-block"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
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
                                    className={`${opacity} w-100px h-100px mr-2 cursor-pointer`}
                                    onClick={handleThumbClick(index)}
                                >
                                    <img
                                        src={item?.mediaItemUrl}
                                        loading="lazy"
                                        alt={item?.altText ? item?.altText : item?.title}
                                        className="h-100px"
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
