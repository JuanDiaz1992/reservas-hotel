import { motion } from "framer-motion";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Send,
  Instagram,
} from "lucide-react";
import { postProtectedFormData } from "../../api/post";
import { useAuth } from "../context/authContext";
import { use } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Información General",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const mapEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.438610127137!2d-75.7453238!3d4.865939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e387f70e4a9d1f3%3A0xfdba7186374b0adf!2sCatleya%20Royal%20Club!5e0!3m2!1ses!2sco!4v1765938839380!5m2!1ses!2sco";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("subject", formData.subject);
    data.append("message", formData.message);
    try {
      const response = await postProtectedFormData({
        endpoint: "/contact",
        body: data,
        token,
      });
      if (response.status === 200) {
        setSubmitted(true);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#111111] text-white">
      <Helmet>
        <title>Contacto y Reservas | Catleya Royal Club Pereira</title>
        <meta
          name="description"
          content="Póngase en contacto con Catleya Royal Club. Solicite información sobre reservas, eventos corporativos, bodas y experiencias gastronómicas en el Eje Cafetero."
        />
        <link rel="canonical" href="https://catleyaroyalclub.com/contacto" />

        <meta
          property="og:title"
          content="Contacte con el Concierge de Catleya Royal Club"
        />
        <meta
          property="og:description"
          content="Personalice su próxima estancia o evento en nuestro refugio de lujo en Pereira."
        />
        <meta
          property="og:url"
          content="https://catleyaroyalclub.com/contacto"
        />
      </Helmet>
      <section className="relative py-32 px-4 flex items-center justify-center text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#476d15]/5 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="relative z-10 space-y-6"
        >
          <span className="text-[#476d15] uppercase tracking-[0.4em] text-xs font-bold block">
            Contacto
          </span>
          <h1 className="text-5xl md:text-7xl font-serif leading-tight">
            Hablemos de su <br />
            <span className="italic text-gray-400">próxima experiencia.</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto font-light text-lg">
            Estamos aquí para personalizar cada detalle de su estadía o evento
            en el corazón del Eje Cafetero.
          </p>
        </motion.div>
      </section>

      <section className="py-24 px-4 bg-[#F9F9F7] text-[#1a1a1a]">
        <div className="container mx-auto max-w-[1200px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="lg:col-span-5 space-y-12"
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-serif text-[#2c4549]">
                  Canales Directos
                </h2>
                <p className="text-gray-500 font-light">
                  Nuestro equipo de concierge está disponible para asistirle de
                  manera inmediata.
                </p>
              </div>

              <div className="space-y-8">
                {/* Teléfono / WhatsApp */}
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full border border-[#476d15]/20 flex items-center justify-center text-[#476d15] group-hover:bg-[#476d15] group-hover:text-white transition-all duration-500">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-1">
                      Reservas & WhatsApp
                    </p>

                    <a href="tel:+573104888396" className="text-xl font-serif">
                      +57 (310) 488-8396
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full border border-[#476d15]/20 flex items-center justify-center text-[#476d15] group-hover:bg-[#476d15] group-hover:text-white transition-all duration-500">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-1">
                      Correo Electrónico
                    </p>
                    <a
                      href="mailto:reservas@catleyaroyal.club"
                      className="text-xl font-serif"
                    >
                      reservas@catleyaroyal.club
                    </a>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full border border-[#476d15]/20 flex items-center justify-center text-[#476d15] group-hover:bg-[#476d15] group-hover:text-white transition-all duration-500">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-1">
                      Ubicación
                    </p>
                    <p className="text-xl font-serif">
                      Vereda Pénjamo, Pereira
                    </p>
                    <p className="text-sm text-gray-500 italic">
                      Risaralda, Colombia
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-8 border-t border-gray-200 flex gap-6 items-center">
                <p className="text-xs uppercase tracking-widest font-bold text-gray-400">
                  Síganos:
                </p>
                <a
                  href="https://www.instagram.com/catleyaroyalclub/"
                  target="_blank"
                  className="text-[#2c4549] hover:text-[#476d15] transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://www.facebook.com/catleyaroyalclub/"
                  target="_blank"
                  className="text-[#2c4549] hover:text-[#476d15] transition-colors"
                >
                  <Facebook size={20} />
                </a>
              </div>
            </motion.div>

            {/* COLUMNA DERECHA: FORMULARIO */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="lg:col-span-7 bg-white p-8 md:p-12 shadow-xl shadow-gray-200/50 rounded-sm"
            >
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[#476d15] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif text-[#2c4549] mb-4">
                    ¡Mensaje Enviado!
                  </h3>
                  <p className="text-gray-600 font-light">
                    Gracias por contactarnos. Hemos recibido tu mensaje y te
                    responderemos lo antes posible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-bold text-gray-500">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ej. Juan Pérez"
                        className="w-full bg-[#F9F9F7] border-none p-4 focus:ring-1 focus:ring-[#476d15] outline-none transition-all font-light"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-bold text-gray-500">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="juan@ejemplo.com"
                        className="w-full bg-[#F9F9F7] border-none p-4 focus:ring-1 focus:ring-[#476d15] outline-none transition-all font-light"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-gray-500">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+57 300 000 0000"
                      className="w-full bg-[#F9F9F7] border-none p-4 focus:ring-1 focus:ring-[#476d15] outline-none transition-all font-light"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-gray-500">
                      Asunto
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full bg-[#F9F9F7] border-none p-4 focus:ring-1 focus:ring-[#476d15] outline-none transition-all font-light text-gray-500"
                    >
                      <option>Información General</option>
                      <option>Reservas de Habitaciones</option>
                      <option>Eventos y Bodas</option>
                      <option>Experiencias Gastronómicas</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-gray-500">
                      Mensaje
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="¿En qué podemos ayudarle?"
                      className="w-full bg-[#F9F9F7] border-none p-4 focus:ring-1 focus:ring-[#476d15] outline-none transition-all font-light resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2c4549] text-white py-4 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#476d15] transition-all duration-500 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Enviando..." : "Enviar Mensaje"}
                    <Send
                      size={14}
                      className={`transition-transform ${loading ? "animate-pulse" : "group-hover:translate-x-1 group-hover:-translate-y-1"}`}
                    />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#111111] relative">
        <div className="container mx-auto max-w-[1200px] text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="aspect-[21/9] bg-gray-900 rounded-sm relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 border border-white/5"
          >
            {/* Aquí iría el iFrame de Google Maps */}
            <div className="absolute inset-0 flex items-center justify-center">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "contrast(1.05) brightness(1)" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Finca La Waira"
              ></iframe>
            </div>
          </motion.div>

          <div className="mt-16 space-y-4">
            <h3 className="font-serif text-2xl">Catleya Royal Club</h3>
            <p className="text-gray-500 font-light tracking-[0.2em] text-xs uppercase">
              Un refugio de lujo sereno en el corazón de Colombia
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
