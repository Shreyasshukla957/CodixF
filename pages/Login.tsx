import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BiLoaderCircle } from "react-icons/bi";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface Loginform {
  emailId: string;
  password: string;
}

export const Login = () => {
  const [passwordOn, setpasswordOn] = useState<boolean>(false);

  const LoginSchema = z.object({
    emailId: z.email("Invalid Email"),
    password: z
      .string()
      .min(8, "Invalid Password")
      .max(20)
      .regex(/[A-Z]/, "Invalid Password")
      .regex(/[0-9]/, "Invalid Password")
      .regex(/[^a-zA-Z0-9]/, "Invalid Password"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Loginform>({ resolver: zodResolver(LoginSchema) });

  return (
    <div className="flex flex-col items-center justify-center bg-neutral-900 min-h-screen selection:text-gray-200">
      <form
        onSubmit={handleSubmit((data) => console.log(data))}
        className="flex flex-col gap-4 bg-white border border-gray-200 rounded-2xl p-10 w-80 h-auto font-manrope shadow-sm"
      >
        <div className="flex items-center text-gray-900 text-xl font-bold">
          CODIX
          <span className="ml-1">
            <BiLoaderCircle />
          </span>
        </div>

        <input
          {...register("emailId")}
          placeholder="Enter your emailId"
          className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 transition-colors w-full"
          type="email"
        />
        {errors.emailId && (
          <p className="mt-0.5 flex items-start gap-1.5 text-xs text-red-400 font-medium leading-5">
            <span className="mt-px inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500/10 text-[10px] text-red-300">
              !
            </span>
            <span>{errors.emailId.message}</span>
          </p>
        )}

        <div className="relative w-full">
          <input
            {...register("password")}
            placeholder="Enter your Password"
            className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 transition-colors w-full pr-10"
            type={passwordOn ? "text" : "password"}
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => setpasswordOn(!passwordOn)}
          >
            {passwordOn ? <EyeOff size={16} /> : <Eye size={16} />}
          </span>
        </div>

        <button
          type="submit"
          className="bg-neutral-900 rounded-lg px-4 py-2.5 text-sm text-white font-semibold w-full mt-2 hover:bg-gray-700 transition-colors"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};
