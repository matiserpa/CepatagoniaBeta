// data.js
window.CEP = {
  meta: {
    fecha: "10 y 11 de Octubre 2026",
    ciudad: "San Martín de los Andes",
    modalidad: "Presencial"
  },

  // Textos editoriales (PDF)
  copy: {
    tagline: "Ciencia. Innovación. Naturaleza.",
    manifesto: [
      "La nueva estética ya no se limita a corregir signos visibles.",
      "Regenera, estimula, optimiza y gestiona.",
      "Un encuentro diseñado para quienes buscan posicionarse en la vanguardia de la estética regenerativa.",
      "Ciencia. Innovación. Naturaleza."
    ].join(" "),
    vision:
      "Convertirnos en el epicentro patagónico de la estética celular avanzada, donde la regeneración tisular, la biotecnología y la inteligencia aplicada redefinen los límites de la práctica profesional. Impulsar una nueva era en la estética, basada en evidencia científica, personalización terapéutica y tecnología no invasiva, posicionando al Congreso como un espacio de referencia internacional en innovación regenerativa.",
    objetivos: [
      "Integrar la estética celular avanzada al ejercicio profesional cotidiano.",
      "Actualizar conocimientos en regeneración tisular, bioestimulación y biotecnología aplicada.",
      "Elevar el nivel científico de la práctica cosmiátrica y dermatocosmiátrica.",
      "Incorporar herramientas de gestión y marketing estratégico para fortalecer la rentabilidad del gabinete.",
      "Fomentar el networking profesional y las alianzas con la industria."
    ]
  },

  // Mantengo tus diferenciales y sumo los del PDF
  diferenciales: [
    {
      title: "Tecnología aplicada",
      desc: "Equipamiento, parámetros, indicaciones y contraindicaciones. Menos promesa, más criterio."
    },
    {
      title: "Protocolos actuales",
      desc: "Herramientas prácticas para aplicar desde el día 1: seguridad, técnica y resultados."
    },
    {
      title: "Comunidad profesional",
      desc: "Networking real entre profesionales. Un espacio para crecer, compartir y actualizarse."
    },

    // PDF (diferenciales estratégicos)
    {
      title: "🔬 Ciencia de vanguardia",
      desc: "Enfoque centrado en la regeneración celular y la biología cutánea profunda."
    },
    {
      title: "🧬 Inteligencia celular aplicada",
      desc: "Exploración de medicina regenerativa, bioestimulación y tecnologías innovadoras."
    },
    {
      title: "⚡ Tecnologías no invasivas",
      desc: "Combinaciones terapéuticas actuales que maximizan resultados con seguridad."
    },
    {
      title: "📈 Visión empresarial",
      desc: "Integración de marketing, ventas y gerenciamiento de SPA como parte del crecimiento profesional."
    },
    {
      title: "🌿 Experiencia Patagonia",
      desc: "Un entorno natural que potencia el aprendizaje, el networking y la proyección estratégica."
    }
  ],

  // Programa oficial (PDF)
  ejes: [
    {
      eje: "EJE 1",
      titulo: "REGENERACIÓN CELULAR & WELLAGING",
      speakers: [
        {
          nombre: "Adriana Sardot",
          credenciales:
            "Cosmetóloga y dermocosmiatra con más de 30 años de trayectoria. Diplomada en Cosmiatría Avanzada y formación continua en congresos nacionales e internacionales. Referente en actualización científica y profesionalización estética.",
          disertacion:
            "Estética Personalizada & Wellaging - El rol de las células madre y los telómeros en la longevidad cutánea.",
          bullets: [
            "Bases biológicas del wellaging",
            "Senescencia celular y longevidad funcional",
            "Impacto de los telómeros en el envejecimiento cutáneo",
            "Células madre como herramienta regenerativa",
            "Protocolos personalizados basados en biología celular"
          ]
        }
      ]
    },

    {
      eje: "EJE 2",
      titulo: "TERAPIAS MANUALES AVANZADAS & MODELADO CORPORAL",
      speakers: [
        {
          nombre: "Ana Paula Travattoni",
          credenciales:
            "APM (UAI) | Especialista en cosmiatría y dermatocosmiatría | Drenaje linfático Método Renata França | Peeling y fibrosis postoperatoria. Directora Académica AnaPau Estética.",
          disertacion: "Drenaje Linfático, Maderoterapia y Lipodrenaje Integrado",
          bullets: [
            "Técnica correcta de drenaje linfático corporal",
            "Beneficios clínicos y optimización post procedimientos",
            "Maderoterapia en celulitis, fibrosis y lipedema",
            "Precauciones y criterios profesionales",
            "Integración del Método AnaPau en protocolos combinados",
            "Lipodrenaje modelador y reducción de contornos"
          ]
        }
      ]
    },

    {
      eje: "EJE 3",
      titulo: "BIOTECNOLOGÍA & SKIN QUALITY",
      speakers: [
        {
          nombre: "Dra. Carolina Laxague",
          credenciales:
            "Médica (UBA). Especialista en Dermatología. Formación en Medicina Estética (AMA) y perfeccionamiento hospitalario en Ramos Mejía y Hospital Houssay.",
          disertacion:
            "Inside Out Glow - Nutracéuticos como potenciadores de la calidad cutánea.",
          bullets: [
            "Concepto de Skin Quality 360°",
            "Suplementación estratégica",
            "Sinergia con procedimientos estéticos",
            "Optimización de resultados clínicos",
            "Evidencia y seguridad"
          ]
        }
      ]
    },

    {
      eje: "EJE 4",
      titulo: "INNOVACIÓN EN EXOSOMAS & MICROBIOTA CUTÁNEA",
      bullets: ["Microbiota y regeneración", "Desarrollo biotecnológico", "Innovación en formulación"],
      speakers: [
        {
          nombre: "Laboratorio UDERM — Pablo González",
          credenciales: "Docente y CEO de U-DERM",
          disertacion: "La revolución del mercado con Exosomas Exodermal",
          bullets: ["Aplicación clínica real", "Bioestimulación avanzada", "Impacto en la práctica profesional"]
        },
        {
          nombre: "Ing. Sandra Molinzavez",
          credenciales: "CEO Laboratorio SEM",
          disertacion: "Lanzamiento Exclusivo 2026 — Máscara con Exosomas + Pre y Probióticos",
          bullets: []
        }
      ]
    },

    {
      eje: "EJE 5",
      titulo: "ESTÉTICA REPARADORA & ESTIMULACIÓN FOLICULAR",
      speakers: [
        {
          nombre: "Laura Varela",
          credenciales:
            "Dermatocosmiatra Hospitalaria – Especialista en Estética Integral y Cosmiatría Avanzada. Instructora Internacional | Speaker | Fundadora de Dalí Global International Training.",
          disertacion: "Recuperación Regenerativa sin Tintas",
          bullets: [
            "Tratamiento innovador de estrías y cicatrices atróficas",
            "Estimulación dérmica controlada",
            "Recuperación rápida de volumen en cejas y barba",
            "Técnica avanzada de activación folicular",
            "Alternativas regenerativas sin pigmentación"
          ]
        }
      ]
    },

    {
      eje: "EJE 6",
      titulo: "GESTIÓN, MARKETING & RENTABILIDAD DEL GABINETE",
      speakers: [
        {
          nombre: "Eduardo Finci",
          credenciales:
            "Presidente de la Asociación Americana de Spa. Presidente de la American Wellness Association. Embajador Emérito del World Wellness Weekend para Latinoamérica.",
          disertacion: "Ventas Aplicadas al Gabinete",
          bullets: ["Estrategias éticas y efectivas", "Experiencia del paciente", "Conversión y fidelización"],
          // NUEVO: múltiples bloques extra (EJE 6)
          extras: [
            {
              title: "Marketing Aplicado al Profesional Estético",
              bullets: ["Posicionamiento estratégico", "Comunicación de valor", "Autoridad en el mercado"]
            },
            {
              title: "Post Congreso Exclusivo — Gerenciamiento Estratégico de SPA",
              bullets: ["Organización operativa", "Rentabilidad", "Escalabilidad del negocio"]
            }
          ]
        }
      ]
    }
  ],

  // Dirigido a (PDF). Si preferís mantener tus bullets anteriores, los combino, pero sin duplicar.
  dirigidoA: [
    "Cosmiatras",
    "Dermatocosmiatras",
    "Médicos estéticos",
    "Profesionales en estética corporal",
    "Directores de SPA",
    "Estudiantes avanzados",

    // los tuyos (por si querés conservar el wording más amplio)
    "Cosmiatras y cosmetólogos/as",
    "Dermatólogos/as y médicos/as estéticos",
    "Profesionales de estética avanzada",
    "Clínicas, centros y equipos de trabajo del sector"
  ]
};
