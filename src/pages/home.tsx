import { Conteiner } from "../components/conteiner";

export function Home() {
  function handleBuscar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <Conteiner>
      <section className="flex max-w-4xl mx-auto h-auto overflow-auto mt-10 xl:mt-15 mb-9 xl:mb-14">
        <form
          onSubmit={handleBuscar}
          className="flex w-full items-center justify-between h-20 bg-white p-3 border-0 rounded gap-2"
        >
          <div className="w-full">
            <input
              type="text"
              placeholder="Digie o nome do carro..."
              className="w-full border rounded-lg p-1.5 h-12 outline-0"
            />
          </div>
          <button
            type="submit"
            className="bg-red-600 text-white rounded-lg w-30 h-12 cursor-pointer"
          >
            Buscar
          </button>
        </form>
      </section>

      <h1 className="text-center font-heading text-2xl font-bold mb-4">
        Carros novos e usados em todo o Brasil
      </h1>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <section className="bg-white w-full rounded-lg p-3">
          <img
            className="w-full rounded-lg mb-1.5 max-h-72 hover:scale-105 transition-all"
            src=""
            alt="Carro"
          />
          <strong className="font-bold mt-1 mb-2">Jagua F-PACE</strong>

          <div className="flex flex-col">
            <p className="mb-6 text-zinc-700">2006/2025 -- 2000km</p>
            <strong className="font-medium text-xl">R$ 200.000</strong>
          </div>

          <div className="w-full h-px bg-slate-200 my-2"></div>

          <p className="text-zinc-700">São Paulo - SP</p>
        </section>
      </main>
    </Conteiner>
  );
}
