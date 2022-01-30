import Link from 'next/link';
import Image from "../../../image";
import {DEFAULT_CATEGORY_IMG_URL} from "../../../constants/urls";

const ParentCategoryBlock = ( props ) => {

	const { category } = props;

	return (
		<li className="product">
			<Link href={`/categoria-produto/${category?.slug}`}>
				<a>
					<div className="product-title-container p-2">
						<h3 className="product-title text-lg">
							{category?.name}
						</h3>
					</div>
				</a>
			</Link>
			<hr />
		</li>
	);
}

export default ParentCategoryBlock;
