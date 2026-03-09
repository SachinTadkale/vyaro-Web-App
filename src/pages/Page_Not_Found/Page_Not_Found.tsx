import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import './Page_Not_Found.css';
const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="container flex flex-col justify-center items-center gap-4">  
    <span className="text-5xl text-white">404 Page Not Found</span>
        <Button variant={"outline"} onClick={()=>navigate("/")}>Go Home</Button>
    </div>
  );
};

export default PageNotFound;  