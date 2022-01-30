import {WhatsApp } from "./icons";

const ContactWhatsApp = ({
	text,
	...props
}) => (
	<>
		<div>
			<a
				className="flex my-2 items-center"
				href="https://api.whatsapp.com/send?phone=5511948024005"
				{...props}
			>
				<WhatsApp className="mr-2" />
				{ text || <span>WhatsApp: <strong>(11) 94802-4005</strong></span>}
			</a>
		</div>
	</>
);

export default ContactWhatsApp;
