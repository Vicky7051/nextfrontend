"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/Service/Redux/Store";
import ContextProvider from '@/Service/Context/contextProvider'
import NavbarTop from "../Components/Navbar/NavbarTop";
import LeftNavbar from "../Components/Navbar/LeftNavbar";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const inter = Inter({ subsets: ["latin"] });

const hideNav = ["/auth/login"]


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()


  return (
      <html lang="en">
        <ContextProvider>
          <Provider store={store}>
            <body className={inter.className} id="root">
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              />
              <div className="flex h-[100vh] w-[100%] overflow-hidden">
                {!hideNav.includes(pathname) && <div className="w-[350px]">
                  <LeftNavbar />
                </div>}
                <div className="w-full">
                  {!hideNav.includes(pathname) && <NavbarTop />}
                  <div className="p-3">
                    {children}
                  </div>
                </div>
              </div>
            </body>
          </Provider>
        </ContextProvider>
      </html>
  );
}
