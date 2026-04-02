import AppRoutes from "./app/routes/AppRoutes";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      <AppRoutes />
    </>
  );
}

export default App;