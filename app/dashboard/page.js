"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import  Userinfo  from "../../components/Userinfo";
export default function Dashboard() {


  return (
    <div>
      <Userinfo/>
    </div>
  );
}
