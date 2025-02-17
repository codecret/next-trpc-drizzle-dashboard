"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function SearchEmployee() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (searchTerm: string) => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set("query", searchTerm);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div>
      <Input
        type="search"
        placeholder="Search..."
        className="md:w-[100px] lg:w-[300px]"
        defaultValue={searchParams.get("query")?.toString()}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
    </div>
  );
}
