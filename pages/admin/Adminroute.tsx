import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router";

const AdminRoute = () => {
  const { user, isAuthenticated ,isLoading } = useSelector((state: any) => state.auth);
console.log(user);
console.log(user?.user?.role);
console.log(isAuthenticated);


// isLoading ko naa likh kar meine sabse badi galti ki h , kyunki yeh hota agr toh fayda yeh tha user ka data abhi aaya nahi ki usse pehle aAdminRoute chal pada  aur usmein user.user.role ki value null k barabar ho jaati hai , kyunki meine jo sabse pehla fetchUser call kiya h woh har baar call hota h jab bhi refresh hota h browser kyunki jab browser refresh hota h toh woh pura react ka data destroy krdeta h phir se app.tsx mount krega aur useEffect chlega ab jaise humein pata h useEffect ek async call h toh time lega aur yhi dikkat hojata h usse pehle AdminRoute wala component chal jaata h aur data jo aana tha woh aata nahi aur /admin par hum jaa nahi paate saath mein redirect ho jaate h "/" home par toh agar yhi isLoading likh diya hota toh jab tak user ka data aata nahi isLoading true rehta toh pura render nahi hota aur jaise hi user ka data aata isLoading false ho jaata aur <Outlet/> return ho jaata aur /admin route par hum chale jaate 
 if (isLoading) {
    return <div>Loading...</div>  // ✅ fetchUser complete hone do
  }

  if (!user) {
    return <Navigate to="/login" />; // user hai hi nahi
  }

  if (user?.user?.role === "admin" && isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/" />;
};

export default AdminRoute;
