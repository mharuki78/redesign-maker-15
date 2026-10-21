import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { withBasePath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "배곧인터내셔널 로고 안내",
  description: "배곧인터내셔널의 회사 로고와 업무 도구 적용 기준",
};

export default function LogoGuidelinesPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/" className="text-sm underline underline-offset-4">마법사로 돌아가기</Link>
      <h1 className="mt-8 text-2xl font-bold">배곧인터내셔널 로고</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        회사에서 제공한 원형 심볼과 한글·영문 회사명을 사용합니다.
        원본의 선, 글자, 비율과 검정·흰색을 유지합니다.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-12 rounded-xl bg-white p-8">
        <Image
          src={withBasePath("/brand/baegot-lockup-2026.svg")}
          alt="배곧인터내셔널 · Baegot International"
          width={365} height={474} unoptimized
          className="h-auto w-44 max-w-full"
        />
        <div>
          <BrandMark className="size-16" />
          <p className="mt-4 text-sm">작업 화면과 브라우저 아이콘에는 원형 심볼을 사용합니다.</p>
        </div>
      </div>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        어두운 배경에서는 흰색 바탕을 두고 표시합니다. 로고를 늘이거나 회전하지 않고
        주변 요소와 충분한 간격을 둡니다.
      </p>
    </main>
  );
}
