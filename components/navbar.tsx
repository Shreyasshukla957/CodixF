import { BiLoaderCircle } from "react-icons/bi";
import { Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import ThemeToggle from "../components/theme-toggle";
import { logoutUser } from "@/features/authSlice";

const Navbar = () => {
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div
      className="w-full fixed top-0 left-0 z-50 flex justify-center py-5
      backdrop-blur-md bg-sun-bg/60 dark:bg-moon-bg/80"
    >
      <div className="w-full max-w-5xl mx-auto px-8 flex items-center gap-4 ">
        <span
          className="bg-white/60 backdrop-blur-sm border border-sun-border text-sun-accent
            dark:bg-moon-bg/20 dark:backdrop-blur-sm dark:border dark:border-dashed dark:border-moon-zincy
            size-19 flex items-center justify-center dark:text-moon-lzincy dark:font-mono
            rounded-full text-sm cursor-pointer shrink-0"
        >
          C{" "}
          <BiLoaderCircle
            className="text-sun-accent dark:text-moon-lzincy hover:animate-spin"
            size={16}
          />
          DIX
        </span>

        <span
          className="flex items-center justify-around flex-1 rounded-md px-8 py-2.5 gap-4 h-17
         "
        >
          <div className="flex items-center gap-4">
            <button
              className="px-6 py-2.5 rounded-md font-semibold text-sm
               bg-sun-accent/10 border border-sun-accent text-sun-accent
               dark:bg-white/10 dark:backdrop-blur-md dark:border dark:border-white/20 dark:text-white
               hover:bg-sun-accent/20 dark:hover:bg-white/20 transition-colors"
            >
              Problems
            </button>
          </div>

          {/* yha par codix logo tha navbar k andar */}

          <div className="flex items-center gap-6 shrink-0">
            <div className="p-px bg-linear-to-l from-sun-bg-secondary to-sun-bg dark:from-moon-bg-secondary dark:to-moon-bg rounded-full">
              <div className="flex items-center bg-white dark:bg-white rounded-full px-3 py-1.5 gap-2 w-48 border border-sun-border dark:border-moon-border">
                <Search
                  size={14}
                  className="text-sun-accent dark:text-moon-bg-secondary shrink-0"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-sm text-sun-text-primary dark:text-moon-text-primary placeholder-sun-text-muted dark:placeholder-moon-toggle outline-none w-full"
                />
              </div>
            </div>

            <div className="p-px bg-linear-to-l from-sun-bg-secondary to-sun-bg dark:from-moon-bg-secondary dark:to-moon-bg rounded-full">
              <ThemeToggle />
            </div>

            <div className="p-px bg-linear-to-l from-sun-bg-secondary to-sun-bg dark:from-moon-bg-secondary dark:to-moon-bg rounded-md">
              <div className="flex items-center justify-center bg-white dark:bg-white border border-sun-border dark:border-moon-border rounded-md h-9 w-15 font-bold">
                <span className="text-sm text-sun-text-primary dark:text-moon-text-primary font-manrope">
                  {user?.user.firstName}
                </span>
              </div>
            </div>
          </div>
        </span>

        <span
          className="bg-white/60 backdrop-blur-sm border border-sun-border text-sun-accent
            dark:bg-moon-bg/20 dark:backdrop-blur-sm dark:border dark:border-dashed dark:border-moon-zincy
            size-17 flex items-center justify-center dark:text-moon-lzincy dark:font-mono
            rounded-full text-sm cursor-pointer shrink-0"
          onClick={() => dispatch(logoutUser())}
        >
          Logout
        </span>
      </div>
    </div>
  );
};

export default Navbar;

//         {/* <div className="flex items-center gap-1.5 shrink-0 flex-1">
//   <span className="bg-linear-to-r from-sun-border-focus to-sun-accent bg-clip-text text-transparent
//     dark:text-moon-lzincy dark:bg-none font-bold text-md font-geist z-10 flex items-center">
//     C{" "}
//     <BiLoaderCircle className="text-sun-accent dark:text-moon-lzincy hover:animate-spin" size={16} />
//     DIX
//   </span>
// </div> */}
