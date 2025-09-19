import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";
import Router from "./router/Router.jsx";
import { SseProvider } from "@components/SseProvider/index.jsx";

function App() {
  return (
    <>
    <SseProvider>
      <ToastContainer />
      <RouterProvider router={Router} />
    </SseProvider>
    </>
  );
}

export default App;