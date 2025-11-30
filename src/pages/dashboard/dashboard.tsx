import { Conteiner } from "@/components/conteiner";
import { DashboardHeader } from "@/components/panelHeader";

export function Dashboard() {
  return (
    <>
      <DashboardHeader />
      <Conteiner>
        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
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
    </>
  );
}
