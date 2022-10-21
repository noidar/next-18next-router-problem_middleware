import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    if (req.nextUrl.pathname.startsWith("/_next") || req.nextUrl.pathname.includes("/api/") || PUBLIC_FILE.test(req.nextUrl.pathname)) {
        // next-i18next de[language]/de[country] in one path /de, this happens only when language and country(page name) are the same.
        // this is a workaround for the issue
        if (pathname.startsWith("/_next/data/")) {
            const country = req.nextUrl.searchParams.get("country");
            const countryIsMissing = country === "de" && pathname.split("/").filter(element => element === country).length === 1;

            if (countryIsMissing) {
                const url = req.nextUrl.clone();
                const index = pathname.indexOf("/de/");
                const startingPath = pathname.slice(0, index);
                const endingPath = pathname.slice(index);

                url.pathname = `${startingPath}/de${endingPath}`;
                return NextResponse.rewrite(url);
            }

            return;
        }
    }
}
