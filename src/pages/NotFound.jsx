import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-5 text-center">
      <div className="absolute w-64 h-64 bg-purple-900/20 rounded-full blur-3xl"></div>

      <h1 className="relative text-9xl font-bold text-white opacity-20">404</h1>

      <div className="relative -mt-16">
        <h2 className="text-3xl md:text-4xl font-serif text-[#d4af37] mb-4">
          Página no encontrada
        </h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          Parece que la sección que buscas no está disponible o ha sido movida a
          otra parte.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-8 py-3 bg-[#d4af37] text-black font-bold rounded-full hover:bg-[#b8962e] transition-colors duration-300"
          >
            Volver al Inicio
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 border border-gray-600 text-gray-300 font-bold rounded-full hover:bg-gray-800 transition-all duration-300"
          >
            Regresar
          </button>
        </div>
      </div>
      <div className="mt-12 opacity-30">
        <div className="h-px w-20 bg-[#d4af37] mx-auto"></div>
      </div>
    </div>
  );
};

export default NotFound;
