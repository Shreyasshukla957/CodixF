import { useForm } from "react-hook-form";
// import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BiLoaderCircle } from "react-icons/bi";

const signupSchema = z.object({
  firstname: z.string().min(3, "Name should contain atleast 3 characters"),
  emailId: z.email("Invalid email"),
  password: z
    .string()
    .min(8, "Weak Password").max(20)
    .regex(/[A-Z]/, "Atleast one UpperCase Character")
    .regex(/[0-9]/, "Atleast one Number")
    .regex(/[^a-zA-Z0-9]/, "Atleast one Special Character"),
});

interface SignupForm {
  emailId: string;
  firstname: string;
  password: string;
}

export const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  return (
    <div className="flex flex-col items-center justify-center bg-neutral-900 min-h-screen selection:text-gray-200">
      <form
        onSubmit={handleSubmit((data) => console.log(data))}
        className="flex flex-col gap-4 bg-white border border-gray-200 rounded-2xl p-10 w-80 h-auto font-manrope shadow-sm"
      >
        <div className="flex items-center text-gray-900 text-xl font-bold">
          CODIX 
          <span className="ml-1"><BiLoaderCircle/></span>
        </div>

        <input
          {...register("firstname")}
          placeholder="Enter your Name"
          className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 transition-colors w-full"
          type="text"
        />
        {errors.firstname && (
          <p className="mt-0.5 flex items-start gap-1.5 text-xs text-red-400 font-medium leading-5">
            <span className="mt-px inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500/10 text-[10px] text-red-300">
              !
            </span>
            <span>{errors.firstname.message}</span>
          </p>
        )}

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

        <input
          {...register("password")}
          placeholder="Enter your Password"
          className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 transition-colors w-full"
          type="password"
        />
        {errors.password && (
          <p className="mt-0.5 flex items-start gap-1.5 text-xs text-red-400 font-medium leading-5">
            <span className="mt-px inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500/10 text-[10px] text-red-300">
              !
            </span>
            <span>{errors.password.message}</span>
          </p>
        )}

        <button
          type="submit"
          className="bg-neutral-900 rounded-lg px-4 py-2.5 text-sm text-white font-semibold w-full mt-2 hover:bg-gray-700 transition-colors"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

// {
// const [name , setname] = useState("")
/* <input name="firstname" value={name} onChange={((event)=> setname(event.target.value))}/>
                     and 
          <input {...register("firstname")} />

          yeh dono same h bas rhf internally wahi kaam kr rha h.
          imput par useRef laga hua h taaki input par jo bhi ho rha h useRef se woh data milta rhe aur uska live changes register k andar onChange dekhe jaa rha h.
 */
// }

// [^a-zA-Z0-9] iska matlab h ki yeh character ko chhod kar koi aur character chahiye jisse hum Special Character kehte h indirectly special character include hona chahiye password mein.
// useForm<Loginform>({resolver:zodResolver(signupSchema)}) iska matlab zod se banaya hua Schema ko connect krdiya useForm se matlab ab useForm data jo accpet krega user se usse compare krega signupSchema ke diye hue rule se uske baad hi store krayega warna error throw krdega.
// errors = {
//   firstname: {
//     message: "Name should contain atleast 3 characters",
//   },
//   emailId: {
//     message: "Invalid email",
//   },
//   password: {
//     message: "Weak Password",
//   },
// }; iss format mein errors k pass sabka error pahuchega
