
import Link from 'next/link';
import Image from '../../image';
import { sanitize } from '../../utils/miscellaneous';

const Page = ({ page }) => {

	return (
		<div className="mb-8">
			<Link href={`/pagina/${page?.slug}/`}>
				<a>
					<figure className="overflow-hidden mb-4">
						<Image
							{...page?.featuredImage?.node}
							width="400"
							height="225"
							layout="fill"
							containerClassNames="w-96 sm:-w-600px md:w-400px h-56 sm:h-338px md:h-225px"
							title={page?.title ?? ''}
							alt={page?.featuredImage?.node?.altText ?? ''}
						/>
					</figure>
					<h2
						className="font-bold mb-3 text-lg hover:text-blue-500"
						dangerouslySetInnerHTML={{ __html: sanitize(page?.title ?? '') }}
					/>
				</a>
			</Link>
			<div dangerouslySetInnerHTML={{ __html: sanitize(page?.excerpt ?? '') }} />
		</div>
	);
};

export default Page;
