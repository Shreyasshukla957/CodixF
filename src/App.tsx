import { Routes, Route } from "react-router";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { Homepage } from "./pages/Homepage";
import { PublicRoute, ProtectedRoute } from "./components/protectedRoute";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { fetchUser } from "@/features/authSlice";
import AdminRoute from "./pages/admin/Adminroute";
import CreateProblemPage from "./pages/admin/create-problem";
import MEditor from "./components/codeEditor";

function App() {
  // const {isAuthenticated} = useSelector((state:any)=>state.auth)
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
  console.log("hii");

  // const user = useSelector((state:any)=> state.auth.user);
  // console.log(user);
  // const role = user.role;

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Homepage></Homepage>}></Route>
        <Route path="/problem/:id" element={<MEditor/>}></Route>
       
      </Route>

      <Route element={<AdminRoute />}>
        {" "}
        <Route path="/admin" element={<CreateProblemPage />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
