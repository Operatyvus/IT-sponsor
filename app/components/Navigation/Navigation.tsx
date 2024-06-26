"use client";
import Link from "next/link";
import Logo from "@/public/assets/logo_icon.svg";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import userDefault from '@/public/assets/defaultUser.jpg';


export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [image, setImage] = useState('');
  const [user, setUser] = useState(null);
  const { data: session } = useSession();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeDropdowns = (event: MouseEvent) => {
    if (event.target !== document.getElementById("user-menu-button")) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", closeDropdowns);
    return () => {
      window.removeEventListener("mousedown", closeDropdowns);
    };
  }, []);

  useEffect(() => {
    if (session?.user?.id && !isNaN(Number(session.user.id))) {
      fetch(`/api/profile/${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.images && data.images.image && data.images.image.data) {
            const logoData = data.images.image.data;
            const base64String = Buffer.from(logoData).toString('base64');
            const logoUrl = `data:image/jpeg;base64,${base64String}`;
            setImage(logoUrl);
          } else {
            console.error("No image data found");
            setImage(userDefault.src);
          }
          setUser(data);
        })
        .catch(console.error);
    }
  }, [session?.user?.id]);

  return (
    <nav className="bg-gray-800 fixed top-0 w-full z-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* <!-- Mobile menu button--> */}
            <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              {/* <!--
                Icon when menu is closed.

                Menu open: "hidden", Menu closed: "block"
              --> */}
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              {/* <!--
                Icon when menu is open.

                Menu open: "block", Menu closed: "hidden"
              --> */}
              <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <Link href="/">
              <div className="flex flex-shrink-0 items-center cursor-pointer">
                <Image src={Logo} alt="Logo" className="h-8 w-auto" />
                <span className="ml-2 text-white text-2xl font-bold">IT Rėmėjas</span>
              </div>
            </Link>
            {/* <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" aria-current="page">Dashboard</a>
                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Team</a>
                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Projects</a>
                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Calendar</a>
              </div>
            </div> */}
          </div>

          {session?.user ? (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="relative ml-3 text-white font-semibold">{session?.user?.first_name}</div>
              {/* <!-- Profile dropdown --> */}
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded={isMenuOpen}
                    aria-haspopup="true"
                    onClick={toggleMenu}
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    <img className="h-8 w-8 rounded-full" src={image} alt=""></img>
                  </button>
                </div>

                {/* <!--
                Dropdown menu, show/hide based on menu state.

                Entering: "transition ease-out duration-100"
                  From: "transform opacity-0 scale-95"
                  To: "transform opacity-100 scale-100"
                Leaving: "transition ease-in duration-75"
                  From: "transform opacity-100 scale-100"
                  To: "transform opacity-0 scale-95"
              --> */}
                <div
                  className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${isMenuOpen ? "transition ease-out duration-100 transform opacity-100 scale-100" : "transition ease-in duration-75 transform opacity-0 scale-95"
                    }`} // Add this className attribute
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  {/* <!-- Active: "bg-gray-100", Not Active: "" --> */}
                  <a href={`/profile/${session.user.id}`} className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-0">Mano profilis</a>
                  <a href={`/profile/${session.user.id}/edit`} className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-1">Nustatymai</a>
                  <a onClick={() => signOut({
                    redirect: true,
                    callbackUrl: `${window.location.origin}/sign-in`
                  })} href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-2">Atsijungti</a>
                </div>
              </div>
            </div>
          ) : (
            <Link className='flex justify-center rounded-lg text-black bg-[#40C173] px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' href='/sign-in'>
              Prisijungti
            </Link>
          )}


        </div>
      </div>

      {/* <!-- Mobile menu, show/hide based on menu state. --> */}
      {/* <div className="sm:hidden" id="mobile-menu">
        <div className="space-y-1 px-2 pb-3 pt-2">
          <a href="#" className="bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium" aria-current="page">Dashboard</a>
          <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Team</a>
          <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Projects</a>
          <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Calendar</a>
        </div>
      </div> */}
    </nav>
  );
}
