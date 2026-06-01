"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

import {
  YANDEX_METRIKA_ENABLED,
  YANDEX_METRIKA_ID,
  YANDEX_METRIKA_INIT_OPTIONS,
} from "@/src/shared/lib/analytics/yandex-metrika/constants";

import "@/src/shared/lib/analytics/yandex-metrika/yandex-metrika.types";

const YandexMetrikaHitTracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);
  const previousUrl = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!YANDEX_METRIKA_ENABLED || typeof window.ym !== "function") {
      return;
    }

    const url = window.location.href;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousUrl.current = url;
      return;
    }

    window.ym(YANDEX_METRIKA_ID, "hit", url, {
      referer: previousUrl.current,
    });
    previousUrl.current = url;
  }, [pathname, searchParams]);

  return null;
};

export const YandexMetrika = () => {
  if (!YANDEX_METRIKA_ENABLED) {
    return null;
  }

  const { ssr, webvisor, clickmap, ecommerce, accurateTrackBounce, trackLinks } =
    YANDEX_METRIKA_INIT_OPTIONS;

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}', 'ym');

    window.dataLayer = window.dataLayer || [];
    ym(${YANDEX_METRIKA_ID}, 'init', {ssr:${ssr}, webvisor:${webvisor}, clickmap:${clickmap}, ecommerce:"${ecommerce}", referrer: document.referrer, url: location.href, accurateTrackBounce:${accurateTrackBounce}, trackLinks:${trackLinks}});`}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
      <Suspense fallback={null}>
        <YandexMetrikaHitTracker />
      </Suspense>
    </>
  );
};
