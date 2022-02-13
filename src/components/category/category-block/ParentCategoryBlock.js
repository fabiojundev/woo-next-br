import Link from 'next/link';
import Image from "../../../image";
import {DEFAULT_CATEGORY_IMG_URL} from "../../../constants/urls";

const ParentCategoryBlock = ( props ) => {

	const { category } = props;

	return (
		<li 
			className="produc-category list-none ml-0"
			title="Categoria de Produto"
		>
			<Link href={`/categoria-produto/${category?.slug}`}>
				<a>
					<div className="p-2">
						<h3 className="text-base">
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
