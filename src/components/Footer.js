import { Instagram, WhatsApp, Email } from "./icons";
import MenuPrincipal from "./Menu";
import Image from "./image";
import Link from 'next/link';

const Footer = () => (
	<>
		<div className="footer p-6 bg-gray-900 text-sm text-white">
			<div className="container mx-auto opacity-75 flex flex-wrap ">
				<div className="m-2 p-4">
					<h4>ENTRE EM CONTATO</h4>
					<div className="social-links mt-8 mb-2">
						<div>
							<a
								className="flex my-2 items-center hover:text-gray-600"
								href="https://api.whatsapp.com/send?phone=5511948024005"
							>
								<WhatsApp className="mr-2" />
								(11) 94802-4005
							</a>
						</div>
						<div>
							<a
								className="flex my-2 items-center hover:text-gray-600"
								href="https://www.instagram.com/nirvanagrowshopbr/"
							>
								<Instagram className="mr-2" />
								@camadecultivo
							</a>
						</div>
						<div>
							<a
								className="flex my-2 items-center hover:text-gray-600"
								href="mailto:atendimento@nirvanagrowshop.com.br"
							>
								<Email className="mr-2" />
								atendimento@camadecultivo.com.br
							</a>
						</div>
					</div>
				</div>
				<div className="m-2 p-4">
					<h4>VASOS PARA CULTIVO</h4>
					<MenuPrincipal
						className="text-white mt-8"
						linkClassName="block"
					/>
				</div>
				<div className="m-2 p-4">
					<h4 className="mb-8">AVISOS IMPORTANTES</h4>
					<div className="my-2" >
						<Link href="/envio-e-prazo-de-entrega">
							<a> Envio e Prazo de Entrega </a>
						</Link>
					</div>
					<div className="my-2" >
						<Link href="/garantia-e-politica-de-reembolso">
							<a> Garantia e Política de Reembolso </a>
						</Link>
					</div>
					<div className="my-2" >
						<Link href="/politica-de-privacidade">
							<a> Política de Privacidade </a>
						</Link>
					</div>
					<div className="my-2" >
						<Link href="/sobre-nos">
							<a> Sobre Nós </a>
						</Link>
					</div>
				</div>
				<div className="m-2 p-4">
					<h4 className="mb-8">SITE SEGURO</h4>
					<Image

						sourceUrl="/google-safe-browsing.png"
						width="239"
						height="162"
					/>
				</div>
			</div>
		</div>
		<div className="p-6 border border-gray-800 bg-gray-900 text-gray-700 text-sm">
			© 2018-2022 camadecultivo.com.br
		</div>
	</>
);

export default Footer;
