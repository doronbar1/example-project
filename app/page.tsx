import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between p-24">
      <div className=" h-4 w-full">
        Thank you for giving the opportunity to interview at Joyous. To start
        please visit this link.
      </div>
      <Link href="/joyous" key="joyous" className="mt-10 bg-violet-200">
        Joyous page
      </Link>
    </div>
  );
}
