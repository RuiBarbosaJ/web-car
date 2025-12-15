import { Conteiner } from "@/components/conteiner";
import { DashboardHeader } from "@/components/panelHeader";
import { FiTrash, FiUpload } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
  FormLabel,
} from "@/components/ui/form";
import { useContext, useState, type ChangeEvent } from "react";
import { AuthContext } from "../../context/AuthContext";
import { v4 as uuidV4 } from "uuid";
import { db, storage } from "../../services/firebaseConnection";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

const schema = z.object({
  name: z.string().nonempty("O campo nome é obrigatório"),
  model: z.string().nonempty("O modelo é obrigatório"),
  year: z.string().nonempty("O ano do carro é obrigatório"),
  hm: z.string().nonempty("O km do carro é obrigatório"),
  price: z.string().nonempty("O preço é obrigatório"),
  city: z.string().nonempty("A cidade é obrigatória"),
  whatsapp: z
    .string()
    .min(1, "O telefone é obrigatório")
    .refine((value) => /^(\d{10,11})$/.test(value), {
      message: "Número de telefone inválido.",
    }),
  description: z.string().nonempty("A descrição é obrigatória"),
});

type FormData = z.infer<typeof schema>;

interface ImageItemProps {
  uid: string | null;
  name: string | null;
  previewUrl: string | null;
  url: string | null;
}

export function CadastrarCar() {
  const { user } = useContext(AuthContext);
  const [carImages, setCarImages] = useState<ImageItemProps[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const handleCadastrarCar = async (data: FormData) => {
    const carListImages = carImages.map((car) => ({
      uid: car.uid,
      name: car.name,
      url: car.url,
    }));

    await addDoc(collection(db, "cars"), {
      name: data.name,
      model: data.model,
      whatsapp: data.whatsapp,
      city: data.city,
      year: data.year,
      hm: data.hm,
      price: data.price,
      description: data.description,
      images: carListImages,
      createdAt: new Date(),
      owner: user?.name,
      uid: user?.uid,
    })
      .then(() => {
        form.reset();
        console.log("Cadastrado com sucesso!");
      })
      .catch((error) => {
        console.log(error);
        console.log("ERRO AO CADASTRAR NO BANCO");
      });

    form.reset();
    setCarImages([]);
  };

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !e.target.files[0]) return;

    const image = e.target.files[0];

    if (image.type !== "image/jpeg" && image.type !== "image/png") {
      alert("Envie uma imagem JPEG ou PNG!");
      return;
    }

    await handleUpload(image);
  }

  async function handleUpload(image: File) {
    if (!user?.uid) return;

    const uidImage = uuidV4();
    const uploadRef = ref(storage, `images/${user.uid}/${uidImage}`);

    const snapshot = await uploadBytes(uploadRef, image);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    const imageItem: ImageItemProps = {
      uid: user.uid,
      name: uidImage,
      previewUrl: URL.createObjectURL(image),
      url: downloadUrl,
    };

    setCarImages((prev) => [...prev, imageItem]);
  }

  async function handleDeleteImage(item: ImageItemProps) {
    if (!item.uid || !item.name) return;

    const imageRef = ref(storage, `images/${item.uid}/${item.name}`);

    try {
      await deleteObject(imageRef);
      setCarImages((prev) => prev.filter((img) => img.url !== item.url));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Conteiner>
      <DashboardHeader />

      {/* Upload de imagem */}
      <div className="w-full bg-white p-4 rounded-lg mt-4">
        <label className="block text-sm font-medium mb-3">
          Foto do veículo (opcional)
        </label>

        <button className="relative border-2 border-dashed w-full sm:w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-400 hover:border-gray-600 h-32 transition-colors">
          <div className="flex flex-col items-center gap-2">
            <FiUpload size={28} color="#666" />
            <span className="text-xs text-gray-600">
              Clique para fazer upload
            </span>
          </div>

          <input
            className="opacity-0 cursor-pointer absolute w-full h-full"
            type="file"
            accept="image/*"
            onChange={handleFile}
          />
        </button>

        {carImages.map((item) => (
          <div
            key={item.name}
            className="w-full h-32 flex items-center justify-center relative mt-3"
          >
            <button
              onClick={() => handleDeleteImage(item)}
              className="absolute top-2 right-2 bg-black/60 rounded-full p-1"
            >
              <FiTrash size={20} color="white" />
            </button>

            <img
              src={item.previewUrl ?? ""}
              alt="Foto do carro"
              className="rounded-lg w-full h-32 object-cover"
            />
          </div>
        ))}
      </div>

      {/* Formulário */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCadastrarCar)}
          className="w-full bg-white p-4 rounded-lg mt-4 flex flex-col gap-5"
        >
          {/* Nome e Modelo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do carro</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Jaguar F-PACE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: F-PACE 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Ano e KM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ano</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KM rodados</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Preço e Cidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor em R$</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* WhatsApp */}
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Descrição */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <textarea
                    rows={4}
                    className="w-full border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Cadastrar anúncio
          </button>
        </form>
      </Form>
    </Conteiner>
  );
}
