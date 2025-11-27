import logo from "../assets/logo.svg";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Conteiner } from "@/components/conteiner";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { auth } from "@/services/firebaseConnection";
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect } from "react";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export function Register() {
  const navigate = useNavigate();
  const { handleInfoUser } = useContext(AuthContext);

  // Zod define as regras do formulário
  const schema = z.object({
    nome: z.string().min(3).nonempty("O campo nome é obrigatório"),
    email: z
      .string()
      .email("Insira um email válido")
      .nonempty("O campo email é obrigatório"),
    password: z
      .string()
      .nonempty("O campo senha é obrigatório")
      .min(4, "A senha deve ter no mínimo 4 caracteres"),
  });

  type FormData = z.infer<typeof schema>;

  // React Hook Form conecta o schema ao formulário
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
    }

    handleLogout();
  }, []);

  async function handleCadastro(data: FormData) {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (userCredencial) => {
        await updateProfile(userCredencial.user, {
          displayName: data.nome,
        });

        handleInfoUser({
          name: data.nome,
          email: data.email,
          uid: userCredencial.user.uid,
        });

        console.log("Cadastrado com sucesso!");
        navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        console.log("ERRO AO CADASTRAR ESTE USUARIO");
        console.log(error);
      });
  }

  return (
    <Conteiner>
      <div className="flex w-full items-center justify-center min-h-screen">
        <main className="flex flex-col justify-center max-sm:w-full sm:min-w-md xl:min-w-xl mx-auto p-4 gap-7">
          <Link to={"/"} className="h-auto w-full">
            <img
              className="h-auto max-w-[250px] mx-auto w-full"
              src={logo}
              alt="logo web carros"
            />
          </Link>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCadastro)} // form.handleSubmit (Gerencia validação e envio) - useForm
              className=" bg-white rounded-xl p-4"
            >
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="name"
                          placeholder="Digite seu nome completo..."
                          className="w-full border rounded-lg p-1.5 h-12 outline-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control} // Necessário para integrar com o shadcn (useForm)
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Digite o email..."
                          className="w-full border rounded-lg p-1.5 h-12 outline-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Digite a senha..."
                          className="w-full border rounded-lg p-1.5 h-12 outline-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Cadastrar</Button>
              </div>
            </form>
          </Form>
          <p className="font-extralight text-center">
            Já possui uma conta?{" "}
            <Link to={"/login"}>
              <span className="font-light">Faça login</span>
            </Link>
          </p>
        </main>
      </div>
    </Conteiner>
  );
}
