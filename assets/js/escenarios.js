const scenarios = [
	{
		id: 1,
		title: "Escenario 1: Alerta de BBVA México",
		image: "images/bbva.jpg",
		text: "Recibes un correo supuestamente de BBVA México informándote que se detectó un acceso sospechoso a tu cuenta desde otro dispositivo. El mensaje indica que debes verificar tu identidad de inmediato haciendo clic en el siguiente enlace: http://bbva-seguridad-login.com para evitar el bloqueo permanente de tu cuenta.",
		isPhishing: true,
		vector: "Link falso de banco",
		desc: `<b>Razón:</b> Es un intento de phishing bancario.<br><br>
			<b>Es Phishing porque:</b>
			<ul>
				<li>El dominio no es oficial.</li>
				<li>Usa urgencia para presionar.</li>
				<li>Redirige a un sitio fraudulento.</li>
			</ul>`
	},
	{
		id: 2,
		title: "Escenario 2: SMS de DHL - Aduanas",
		image: "images/dhl.jpg",
		text: "Recibes un SMS supuestamente de DHL indicando que tu paquete está retenido en aduanas y que debes pagar un cargo para liberarlo. El mensaje incluye un enlace para realizar el pago.",
		isPhishing: true,
		vector: "SMS con pago falso",
		desc: `<b>Razón:</b> Es un fraude por mensaje SMS.<br><br>
			<b>Es Phishing porque:</b>
			<ul>
				<li>Solicita un pago inesperado para liberar el paquete.</li>
				<li>Incluye un enlace sospechoso para realizar el pago.</li>
				<li>No proporciona información verificable del envío.</li>
			</ul>`
	},
	{
		id: 3,
		title: "Escenario 3: Confirmación de Entrega en Blackboard",
		image: "images/upslp.jpg",
		text: "Recibes un correo en tu cuenta institucional con una notificación de Blackboard sobre una actividad reciente registrada en la plataforma.",
		isPhishing: false,
		vector: "Mensaje real",
		desc: `<b>Razón:</b> Es una notificación legítima de Blackboard.<br><br>
			<b>Es real porque:</b>
			<ul>
				<li>Proviene de un dominio institucional confiable.</li>
				<li>No solicita información personal adicional.</li>
				<li>Es un proceso normal de seguimiento de entregas en Blackboard.</li>
			</ul>`
	},
	{
		id: 4,
		title: "Escenario 4: SAT devolución",
		image: "images/sat.jpg",
		text: "Recibes un correo supuestamente del SAT informándote que tienes un saldo a favor. Para obtener tu devolución, debes descargar un archivo adjunto en formato .zip que contiene los documentos necesarios.",
		isPhishing: true,
		vector: "Archivo con virus",
		desc: `<b>Razón:</b> Intento de distribución de malware.<br><br>
			<b>Es Phishing porque:</b>
			<ul>
				<li>Incluye archivo comprimido sospechoso.</li>
				<li>El SAT no envía archivos descargables.</li>
				<li>Promete dinero para engañar.</li>
			</ul>`
	},
	{
		id: 5,
		title: "Escenario 5: Netflix suspendido",
		image: "images/netflix.jpg",
		text: "Recibes un correo de Netflix indicando que hubo un problema con tu método de pago y que tu cuenta será suspendida en breve. El mensaje te pide actualizar tu información de pago mediante un enlace para evitar la cancelación.",
		isPhishing: true,
		vector: "Link para robar datos",
		desc: `<b>Razón:</b> Busca robar credenciales y datos bancarios.<br><br>
			<b>Es Phishing porque:</b>
			<ul>
				<li>Genera urgencia artificial.</li>
				<li>Solicita datos sensibles.</li>
				<li>El enlace puede ser falso.</li>
			</ul>`
	},
	{
		id: 6,
		title: "Escenario 6: SMS de RappiCréditos",
		image: "images/rappi.jpg",
		text: "Recibes un SMS indicando que has ganado 45 RappiCréditos e incluye un enlace para reclamarlos. El mensaje genera urgencia para que accedas rápidamente al beneficio.",
		isPhishing: true,
		vector: "Premio falso",
		desc: `<b>Razón:</b> Mensaje fraudulento que busca engañar al usuario.<br><br>
			<b>Es Phishing porque:</b>
			<ul>
				<li>Incluye un enlace sospechoso para reclamar el beneficio.</li>
				<li>Genera urgencia para que actúes sin verificar.</li>
				<li>Podría dirigir a una página falsa para robar tus datos.</li>
			</ul>`
	},
	{
		id: 7,
		title: "Escenario 7: Confirmación de pedido de Kindle en Amazon",
		image: "images/amazon.jpg",
		text: "Recibes un correo de Amazon confirmando la compra de un libro digital para Kindle. El mensaje incluye el título del libro, la fecha de entrega y un enlace para ver los detalles de tu pedido en tu cuenta de Amazon.",
		isPhishing: false,
		vector: "Compra real",
		desc: `<b>Razón:</b> Este correo es legítimo y proviene de 'amazon.com.mx'<br><br>
			<b>Es real porque:</b>
			<ul>
				<li>El enlace dirige al sitio oficial de Amazon con tu cuenta.</li>
				<li>Solo proporciona información sobre un pedido realizado, sin solicitar contraseñas.</li>
				<li>No genera urgencia ni intenta asustarte para actuar rápidamente.</li>
			</ul>`
	},
	{
		id: 8,
		title: "Escenario 8: Estado de Cuenta CFE",
		image: "images/cfe.jpg",
		text: "Recibes un correo supuestamente de la CFE con tu estado de cuenta adjunto en formato Word y PDF. El mensaje te invita a revisar los archivos para verificar un adeudo pendiente.",
		isPhishing: true,
		vector: "Archivo sospechoso",
		desc: `<b>Razón:</b> Posible intento de infección o robo de información.<br><br>
			<b>Es Phishing porque:</b>
			<ul>
				<li>Incluye archivos adjuntos sospechosos (Word/PDF).</li>
				<li>Los archivos pueden contener malware o macros maliciosas.</li>
				<li>Busca que el usuario descargue y abra documentos inseguros.</li>
			</ul>`
	},
	{
		id: 9,
		title: "Escenario 9: Código de Recuperación de Facebook",
		image: "images/facebook.jpg",
		text: "Recibes un correo de Facebook con un código de recuperación para acceder a tu cuenta.",
		isPhishing: false,
		vector: "Código real",
		desc: `<b>Razón:</b> Es un mensaje auténtico del sistema de seguridad.<br><br>
			<b>Es real porque:</b>
			<ul>
				<li>Solo proporciona un código de verificación.</li>
				<li>No solicita contraseña ni datos personales.</li>
				<li>Es parte del proceso normal de recuperación de cuenta.</li>
			</ul>`
	},
	{
		id: 10,
		title: "Escenario 10: SMS de canje de puntos Banamex",
		image: "images/banamex.jpg",
		text: "Recibes un SMS supuestamente de Banamex indicando que tienes 9966 puntos disponibles para canjear. El mensaje incluye un enlace para realizar el canje y menciona que los puntos caducan el 31 de diciembre.",
		isPhishing: true,
		vector: "SMS con enlace falso",
		desc: `<b>Razón:</b> Es un intento de fraude mediante SMS.<br><br>
			<b>Es Phishing porque:</b>
			<ul>
				<li>Incluye un enlace externo para realizar el canje fuera de los canales oficiales.</li>
				<li>Utiliza un sentido de urgencia al indicar una fecha de caducidad.</li>
				<li>Los mensajes de este tipo suelen redirigir a sitios falsos que imitan al banco.</li>
			</ul>`
	}
];
