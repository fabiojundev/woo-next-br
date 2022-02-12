import { Instagram, WhatsApp, Email } from "./icons";
import MenuPrincipal from "./Menu";
import Image from "./image";
import Link from 'next/link';
import ContactWhatsApp from "./ContactWhatsApp";

const Footer = () => (
	<>
		<div className="footer p-6 bg-gray-900 text-sm text-white">
			<div className="mx-auto opacity-75 flex flex-wrap justify-self-auto md:justify-evenly">
				<div className="m-2 p-4">
					<h4>ENTRE EM CONTATO</h4>
					<div className="social-links mt-8 mb-2">
						<ContactWhatsApp
							text="(11) 94802-4005"
							className="flex my-2 items-center text-white"
						/>
						<div>
							<a
								className="flex my-2 items-center text-white"
								href="https://www.instagram.com/camadecultivo/"
							>
								<Instagram className="mr-2" />
								@camadecultivo
							</a>
						</div>
						<div>
							<a
								className="flex my-2 items-center text-white"
								href="mailto:atendimento@camadecultivo.com.br"
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
						className="mt-8"
						linkClassName="text-white block"
					/>
				</div>
				<div className="m-2 p-4">
					<h4 className="mb-8">AVISOS IMPORTANTES</h4>
					<div className="my-2" >
						<Link href="/envio-e-prazo-de-entrega">
							<a className="text-white">
								Envio e Prazo de Entrega
							</a>
						</Link>
					</div>
					<div className="my-2" >
						<Link href="/garantia-e-politica-de-reembolso">
							<a className="text-white">
								Garantia e Política de Reembolso
							</a>
						</Link>
					</div>
					<div className="my-2" >
						<Link href="/politica-de-privacidade">
							<a className="text-white">
								Política de Privacidade
							</a>
						</Link>
					</div>
					<div className="my-2" >
						<Link href="/sobre-nos">
							<a className="text-white">
								Sobre Nós
							</a>
						</Link>
					</div>
				</div>
				<div className="m-2 p-4">
					<h4 className="mb-8">SITE SEGURO</h4>
					<Image
						alt="Site Seguro"
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
