import { Conteiner } from "@/components/conteiner";
import { DashboardHeader } from "@/components/panelHeader";
import { FiTrash2 } from "react-icons/fi";

import { db } from "@/services/firebaseConnection";
import {
  collection,
  getDocs,
  where,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

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

export function Dashboard() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function loadCars() {
      if (!user?.uid) {
        return;
      }

      const carRef = collection(db, "cars");
      const queryRef = query(carRef, where("uid", "==", user.uid));

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
  }, [user]);

  async function handleDeleteCar(id: string) {
    const docRef = doc(db, "cars", id);
    await deleteDoc(docRef);
    setCars(cars.filter((car) => car.id !== id));
  }

  return (
    <>
      <Conteiner>
        <DashboardHeader />
        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {cars.map((car) => (
            <section
              key={car.id}
              className="bg-white w-full rounded-lg p-3 relative"
            >
              <button
                onClick={() => handleDeleteCar(car.id)}
                className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow-2xl"
              >
                <FiTrash2 size={25} color="black" />
              </button>

              <img
                className="w-full rounded-lg mb-1.5 max-h-72 hover:scale-105 transition-all"
                src={car.images[0]?.url || "/placeholder.png"}
                alt={car.name}
              />

              <strong className="font-bold mt-1 mb-2">{car.name}</strong>

              <div className="flex flex-col">
                <p className="mb-6 text-zinc-700">
                  {car.year} — {car.km} km
                </p>
                <strong className="font-medium text-xl">R$ {car.price}</strong>
              </div>

              <div className="w-full h-px bg-slate-200 my-2"></div>

              <p className="text-zinc-700">{car.city}</p>
            </section>
          ))}
        </main>
      </Conteiner>
    </>
  );
}
