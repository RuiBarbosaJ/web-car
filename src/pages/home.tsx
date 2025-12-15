import { Conteiner } from "../components/conteiner";
import { db } from "@/services/firebaseConnection";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface CarImageProps {
  name?: string;
  uid?: string;
  url?: string;
}

interface CarProps {
  id: string;
  uid: string;
  name: string;
  model: string;
  city: string;
  year: string;
  km: string;
  price: string;
  images: CarImageProps[];
}

/**
 * Gera uma imagem aleatória e consistente por carro
 */
function gerarImagemAleatoria(car: CarProps) {
  const seed = encodeURIComponent(
    `${car.name}-${car.model}-${car.year}-${car.id}`
  );

  return `https://picsum.photos/seed/${seed}/600/400`;
}

export function Home() {
  const [cars, setCars] = useState<CarProps[]>([]);

  useEffect(() => {
    async function loadCars() {
      const carRef = collection(db, "cars");
      const queryRef = query(carRef, orderBy("createdAt"));

      const snapshot = await getDocs(queryRef);

      const listCars: CarProps[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        uid: doc.data().uid,
        name: doc.data().name,
        model: doc.data().model,
        year: doc.data().year,
        km: doc.data().km,
        city: doc.data().city,
        price: doc.data().price,
        images: doc.data().images ?? [],
      }));

      setCars(listCars);
    }

    loadCars();
  }, []);

  async function handleBuscar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function handleImageLoad(id: string) {
    return (
      <div>
        <h1 className="font-extralight">CARREGANDO... {id}</h1>
      </div>
    );
  }

  return (
    <Conteiner>
      <section className="flex max-w-4xl mx-auto h-auto overflow-auto mt-10 mb-9">
        <form
          onSubmit={handleBuscar}
          className="flex w-full items-center gap-2 bg-white p-3 rounded"
        >
          <input
            type="text"
            placeholder="Digite o nome do carro..."
            className="w-full border rounded-lg p-2 h-12 outline-none"
          />
          <button
            type="submit"
            className="bg-red-600 text-white rounded-lg px-6 h-12"
          >
            Buscar
          </button>
        </form>
      </section>

      <h1 className="text-center text-2xl font-bold mb-6">
        Carros novos e usados em todo o Brasil
      </h1>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <Link key={car.id} to={`/car/${car.id}`}>
            <section key={car.id} className="bg-white w-full rounded-lg p-3">
              <img
                className="w-full rounded-lg mb-2 max-h-72 object-cover hover:scale-105 transition-all"
                src={car.images?.[0]?.url ?? gerarImagemAleatoria(car)}
                alt={car.name}
                onLoad={() => handleImageLoad(car.id)}
              />
              <strong className="font-bold block mb-1">
                {car.name} | {car.model}
              </strong>

              <p className="text-zinc-700 mb-4">
                {car.year} | {car.km} km
              </p>
              <strong className="font-medium text-xl">R$ {car.price}</strong>
              <div className="w-full h-px bg-slate-200 my-3"></div>
              <p className="text-zinc-700">{car.city}</p>
            </section>
          </Link>
        ))}
      </main>
    </Conteiner>
  );
}
