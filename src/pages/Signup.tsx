import { useForm } from "react-hook-form";
// import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BiLoaderCircle } from "react-icons/bi";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { RegisterUser } from "@/features/authSlice";
import { Link } from "react-router";
import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";

const signupSchema = z.object({
  firstName: z.string().min(3, "Atleast 3 characters"),
  lastName: z.string().min(3, "Atleast 3 characters"),
  emailId: z.email("Invalid email"),
  password: z
    .string()
    .min(8, "Weak Password")
    .max(20)
    .regex(/[A-Z]/, "Atleast one UpperCase Character")
    .regex(/[0-9]/, "Atleast one Number")
    .regex(/[^a-zA-Z0-9]/, "Atleast one Special Character"),
});

interface SignupForm {
  emailId: string;
  firstName: string;
  lastName: string;
  password: string;
}

export const Signup = () => {
  const [showpass, setshowpass] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) ,  });

  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = (data: object) => {
    dispatch(RegisterUser(data));
  };



return (
    <div className="flex flex-col items-center justify-center bg-radial-[circle] from-moon-bg-secondary to-moon-bg min-h-screen selection:text-moon-accent">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 bg-moon-surface border border-moon-border rounded-2xl p-10 w-97 min-h-100 font-manrope shadow-sm"
      >
        <div className="flex items-center text-moon-text-primary text-xl font-bold ml-0.5">
          CODIX
          <span className="ml-1 hover:animate-spin transition-all">
            <BiLoaderCircle />
          </span>
        </div>

        <div className="flex gap-2">
          <div className="flex flex-col">
            <input
              {...register("firstName")}
              placeholder="FirstName"
              className="bg-moon-surface border border-moon-border rounded-lg px-4 py-2.5 mr-2 text-sm text-moon-text-primary placeholder-moon-text-muted outline-none focus:border-moon-border-focus transition-colors w-full"
              type="text"
            />
            {errors.firstName && (
              <p className="mt-0.5 flex items-start gap-1.5 text-xs text-moon-error font-medium leading-5">
                <span className="mt-px inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500/10 text-[10px] text-moon-error">!</span>
                <span>{errors.firstName.message}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <input
              {...register("lastName")}
              placeholder="LastName"
              className="bg-moon-surface border border-moon-border rounded-lg px-4 py-2.5 text-sm text-moon-text-primary placeholder-moon-text-muted outline-none focus:border-moon-border-focus transition-colors w-full"
              type="text"
            />
            {errors.lastName && (
              <p className="mt-0.5 flex items-start gap-1.5 text-xs text-moon-error font-medium leading-5">
                <span className="mt-px inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500/10 text-[10px] text-moon-error">!</span>
                <span>{errors.lastName.message}</span>
              </p>
            )}
          </div>
        </div>

        <input
          {...register("emailId")}
          placeholder="Enter your emailId"
          className="bg-moon-surface border border-moon-border rounded-lg px-4 py-2.5 text-sm text-moon-text-primary placeholder-moon-text-muted outline-none focus:border-moon-border-focus transition-colors w-full"
          type="email"
        />
        {errors.emailId && (
          <p className="-mt-2 flex items-start gap-1.5 text-xs text-moon-error font-medium leading-5">
            <span className="mt-px inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500/10 text-[10px] text-moon-error">!</span>
            <span>{errors.emailId.message}</span>
          </p>
        )}

        <div className="relative w-full">
          <input
            {...register("password")}
            placeholder="Enter your Password"
            className="bg-moon-surface border border-moon-border rounded-lg px-4 py-2.5 text-sm text-moon-text-primary placeholder-moon-text-muted outline-none focus:border-moon-border-focus transition-colors w-full"
            type={showpass ? "text" : "password"}
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-moon-text-muted cursor-pointer"
            onClick={() => setshowpass(!showpass)}
          >
            {showpass ? <EyeOff size={16} /> : <Eye size={16} />}
          </span>
        </div>
        {errors.password && (
          <p className="-mt-2 flex items-start gap-1.5 text-xs text-moon-error font-medium leading-5">
            <span className="mt-px inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500/10 text-[10px] text-moon-error">!</span>
            <span>{errors.password.message}</span>
          </p>
        )}

        <button
          type="submit"
          className="bg-moon-btn rounded-lg px-4 py-2.5 text-sm text-moon-surface font-semibold w-full mt-5 hover:bg-moon-btn-hover transition-colors hover:cursor-pointer"
        >
          Sign Up
        </button>

        <span className="text-[13px] font-geist flex justify-center-safe -mt-3 text-moon-text-secondary">
          Already have an account ?{" "}
          <Link to={"/login"} className="text-moon-accent underline ml-0.5">
            Sign In
          </Link>
        </span>
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
