const scenarios = [
  {
    id: 1,
    title: "Escenario 1: Alerta de BBVA México",
    image: "images/phising_bbva.jpg",
    text: "Recibes un correo supuestamente de BBVA México informándote que se detectó un acceso sospechoso a tu cuenta desde otro dispositivo. El mensaje indica que debes verificar tu identidad de inmediato haciendo clic en el siguiente enlace: http://bbva-seguridad-login.com para evitar el bloqueo permanente de tu cuenta.",
    isPhishing: true,
    vector: "Suplantación bancaria / URL falsa",
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
    title: "Escenario 2: Mensaje de DHL",
    image: "images/phishing-dhl.jpg",
    text: "Recibes un SMS indicando que un paquete a tu nombre no pudo ser entregado debido a un problema con la dirección. El mensaje solicita que pagues una tarifa de $35 MXN para reprogramar la entrega mediante un enlace incluido.",
    isPhishing: true,
    vector: "Smishing / Pago fraudulento",
    desc: `<b>Razón:</b> Es un fraude por mensaje SMS.<br><br>
           <b>Es Phishing porque:</b>
           <ul>
             <li>Solicita pago inesperado.</li>
             <li>Las paqueterías no cobran por SMS.</li>
             <li>No incluye datos específicos del envío.</li>
           </ul>`
  },
  {
    id: 3,
    title: "Escenario 3: Correo Universitario",
    image: "images/upslp.jpg",
    text: "Recibes un correo institucional desde una dirección oficial de tu universidad (.edu.mx) indicando que, por motivos de seguridad, debes actualizar tu contraseña. El mensaje incluye un enlace que te dirige al portal oficial de la institución.",
    isPhishing: false,
    vector: "Comunicación institucional legítima",
    desc: `<b>Razón:</b> Es una comunicación válida.<br><br>
           <b>Es real porque:</b>
           <ul>
             <li>Proviene de dominio institucional confiable.</li>
             <li>No solicita datos fuera del portal oficial.</li>
             <li>Es un proceso normal de seguridad.</li>
           </ul>`
  },
  {
    id: 4,
    title: "Escenario 4: SAT devolución",
    image: "images/SAT.png",
    text: "Recibes un correo supuestamente del SAT informándote que tienes un saldo a favor. Para obtener tu devolución, debes descargar un archivo adjunto en formato .zip que contiene los documentos necesarios.",
    isPhishing: true,
    vector: "Malware / Ingeniería fiscal",
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
    image: "images/phishing-netflix.jpg",
    text: "Recibes un correo de Netflix indicando que hubo un problema con tu método de pago y que tu cuenta será suspendida en breve. El mensaje te pide actualizar tu información de pago mediante un enlace para evitar la cancelación.",
    isPhishing: true,
    vector: "Phishing de suscripción",
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
    title: "Escenario 6: Código de WhatsApp",
    image: "images/whatsapp.png",
    text: "Recibes un mensaje de WhatsApp de un contacto desconocido solicitando que le compartas el código de verificación que te llegó por SMS, argumentando que fue enviado por error y que lo necesita urgentemente.",
    isPhishing: true,
    vector: "Secuestro de cuenta",
    desc: `<b>Razón:</b> Intento de acceso no autorizado a la cuenta.<br><br>
           <b>Es Phishing porque:</b>
           <ul>
             <li>Nunca se deben compartir códigos.</li>
             <li>Busca tomar control de la cuenta.</li>
             <li>Mensaje engañoso y urgente.</li>
           </ul>`
  },
  {
    id: 7,
    title: "Escenario 7: Pedido de Amazon",
    image: "images/amazon.jpg",
    text: "Recibes un correo de Amazon confirmando un pedido reciente que realizaste. El mensaje incluye el número de orden, detalles del producto y un enlace al sitio oficial para rastrear el envío.",
    isPhishing: false,
    vector: "Notificación legítima",
    desc: `<b>Razón:</b> Es un correo auténtico.<br><br>
           <b>Es real porque:</b>
           <ul>
             <li>Incluye información específica del pedido.</li>
             <li>No solicita datos sensibles.</li>
             <li>Proviene de dominio oficial.</li>
           </ul>`
  },
  {
    id: 8,
    title: "Escenario 8: Adeudo CFE",
    image: "images/cfe.jpg",
    text: "Recibes un mensaje informando que tienes un adeudo pendiente con la CFE y que, si no realizas el pago inmediatamente mediante el enlace proporcionado, tu servicio eléctrico será suspendido.",
    isPhishing: true,
    vector: "Amenaza / Pago fraudulento",
    desc: `<b>Razón:</b> Mensaje fraudulento para forzar pago.<br><br>
           <b>Es Phishing porque:</b>
           <ul>
             <li>Usa amenaza inmediata.</li>
             <li>Solicita pago urgente.</li>
             <li>Incluye enlace no verificado.</li>
           </ul>`
  },
  {
    id: 9,
    title: "Escenario 9: Seguridad Facebook",
    image: "images/facebook.png",
    text: "Recibes un correo de Facebook notificando que tu cuenta inició sesión desde un dispositivo no reconocido. El mensaje incluye un enlace para revisar la actividad reciente y asegurar tu cuenta.",
    isPhishing: false,
    vector: "Alerta de seguridad legítima",
    desc: `<b>Razón:</b> Es una notificación válida.<br><br>
           <b>Es real porque:</b>
           <ul>
             <li>No solicita contraseña directamente.</li>
             <li>Redirige al sitio oficial.</li>
             <li>Es comportamiento normal de seguridad.</li>
           </ul>`
  },
  {
    id: 10,
    title: "Escenario 10: Premio Telcel",
    image: "images/telcel.jpg",
    text: "Recibes un SMS indicando que has sido seleccionado como ganador de un iPhone en una promoción de Telcel. El mensaje incluye un enlace para reclamar el premio de inmediato.",
    isPhishing: true,
    vector: "Fraude de premio",
    desc: `<b>Razón:</b> Es una estafa común.<br><br>
           <b>Es Phishing porque:</b>
           <ul>
             <li>Ofrece premios irreales.</li>
             <li>Es un mensaje masivo.</li>
             <li>Incluye enlace sospechoso.</li>
           </ul>`
  }
];