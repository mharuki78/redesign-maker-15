import Image from "next/image";
import { cn, withBasePath } from "@/lib/utils";

type Props = { className?: string; mono?: boolean };

export function BrandMark({ className }: Props) {
  return (
    <Image
      src={withBasePath("/brand/baegot-mark-2026.svg")}
      alt="배곧인터내셔널"
      width={354}
      height={354}
      unoptimized
      className={cn("size-9 shrink-0 bg-white object-contain", className)}
    />
  );
}
