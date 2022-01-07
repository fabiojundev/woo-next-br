import {Instagram, WhatsApp, Email} from "./icons";

const Footer = () => (
	<div className="footer bg-gray-800 p-6 text-white">
		<div className="container mx-auto">
			<div className="footer-text flex-none md:flex items-center justify-between">
				<p>© 2018-2022 camadecultivo.com.br</p>
				<p className="text-gray">Avisos Importantes</p>
				<span className="text-gray">Site Seguro</span>
			</div>
			<div className="social-links mt-8 mb-2 flex align-center">
				<a 
					className="flex my-2"
					href="https://api.whatsapp.com/send?phone=5511948024005"
				>
					<WhatsApp className="mr-2" />
					(11) 94802-4005
				</a>
			</div>
			<div>
				<a  
					className="flex my-2"
					href="https://www.instagram.com/nirvanagrowshopbr/"
				>
					<Instagram className="mr-2" />
					@camadecultivo
				</a>
			</div>
			<div>
				<a 
					className="flex my-2"
					href="mailto:atendimento@nirvanagrowshop.com.br"
				>
					<Email className="mr-2" /> 
					 atendimento@camadecultivo.com.br
				</a>
			</div>
		</div>
	</div>
);

export default Footer;
