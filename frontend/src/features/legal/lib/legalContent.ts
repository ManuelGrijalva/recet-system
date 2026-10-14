import type { LegalSection } from '../components/LegalPage';

export const LEGAL_UPDATED_AT = '14 de octubre de 2026';
export const LEGAL_CONTACT_EMAIL = 'mgrijalvat1@miumg.edu.gt';

export const PRIVACY_INTRO =
  'Recetario Jutiapa es un proyecto de graduación de la Universidad Mariano Gálvez de Guatemala, Campus Jutiapa, desarrollado por Manuel Ernesto Grijalva Tenas. Esta política explica qué datos recopila la plataforma, para qué los usa y cómo puedes pedir que se eliminen.';

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: 'Datos que recopilamos',
    paragraphs: [
      'Al iniciar sesión con Google recibimos tu nombre, tu correo electrónico y la dirección de tu foto de perfil. No recibimos ni guardamos tu contraseña de Google.',
      'De forma opcional puedes agregar un número de teléfono en tu perfil; es privado y no se muestra a otras personas.',
      'También guardamos el contenido que creas en la plataforma: recetas, fotografías de recetas, comentarios, reacciones y las recetas que guardas en tu recetario.',
    ],
  },
  {
    heading: 'Para qué usamos tus datos',
    paragraphs: [
      'Usamos tus datos únicamente para identificarte, mostrar tu nombre y foto junto a lo que publicas, permitir la moderación de recetas y mantener tu recetario personal.',
      'No vendemos, alquilamos ni compartimos tus datos con terceros con fines comerciales, y la plataforma no muestra publicidad.',
    ],
  },
  {
    heading: 'Cookies y almacenamiento en tu dispositivo',
    paragraphs: [
      'Usamos una cookie de sesión segura (HTTP-only) para mantenerte conectado durante un máximo de siete días. No usamos cookies de rastreo ni de publicidad.',
      'Para permitir la consulta sin conexión, tu navegador guarda una copia de las páginas y recetas públicas que ya visitaste. Nunca se guardan en esa copia los datos de tu sesión.',
    ],
  },
  {
    heading: 'Servicios de terceros',
    paragraphs: [
      'El inicio de sesión lo provee Google. La información se almacena en servidores de proveedores de infraestructura en la nube contratados para operar la plataforma, que no la usan para fines propios.',
    ],
  },
  {
    heading: 'Tus derechos',
    paragraphs: [
      'Puedes editar tu nombre y teléfono desde tu perfil y eliminar en cualquier momento las recetas que publicaste.',
      `Para solicitar la eliminación de tu cuenta y de todos tus datos, escribe a ${LEGAL_CONTACT_EMAIL}. Atenderemos la solicitud en un plazo máximo de 30 días.`,
    ],
  },
  {
    heading: 'Contacto',
    paragraphs: [`Para cualquier consulta sobre esta política escribe a ${LEGAL_CONTACT_EMAIL}.`],
  },
];

export const TERMS_INTRO =
  'Al usar Recetario Jutiapa aceptas estas condiciones. La plataforma es un proyecto académico sin fines de lucro dedicado al rescate de la cocina tradicional de Jutiapa.';

export const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: 'Uso de la plataforma',
    paragraphs: [
      'Puedes consultar y buscar recetas sin iniciar sesión. Para guardar, reaccionar, comentar o publicar necesitas una cuenta de Google.',
      'Publicar recetas está disponible para los usuarios con rol de colaborador, que otorga el administrador de contenido.',
    ],
  },
  {
    heading: 'Contenido que publicas',
    paragraphs: [
      'Eres responsable de las recetas, fotografías y comentarios que publicas, y declaras que tienes derecho a compartirlos.',
      'Toda receta publicada por un colaborador pasa por la revisión de un administrador antes de mostrarse a la comunidad, y puede ser devuelta con observaciones o retirada si es incorrecta o inapropiada.',
      'No está permitido publicar contenido ofensivo, engañoso, ajeno a la gastronomía tradicional o que infrinja derechos de terceros.',
    ],
  },
  {
    heading: 'Recetas de referencia',
    paragraphs: [
      'Parte del catálogo inicial proviene de fuentes documentales, que se citan en la ficha de cada receta. Las cuentas que figuran como autoras de ese catálogo son cuentas de demostración del proyecto.',
    ],
  },
  {
    heading: 'Limitación de responsabilidad',
    paragraphs: [
      'Las recetas se comparten con fines culturales y educativos. Revisa los ingredientes ante posibles alergias o restricciones de salud antes de prepararlas.',
      'La plataforma se ofrece tal como está, como parte de un proyecto académico, y puede tener interrupciones o cambios.',
    ],
  },
  {
    heading: 'Contacto',
    paragraphs: [`Para dudas sobre estas condiciones escribe a ${LEGAL_CONTACT_EMAIL}.`],
  },
];
