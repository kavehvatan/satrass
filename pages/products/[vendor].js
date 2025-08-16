// pages/products/[vendor].js

// یک هلسپر ساده تا مسیر لوگو را از روی slug بسازد
const logoOf = (slug) => `/products/avatars/${slug}.png`;

const vendorExtras = {
  dell: {
    display: "Dell EMC",
    heroNote:
      "استوریج و سرورهای Dell EMC برای بارکاری سازمانی با تمرکز بر کارایی، سادگی مدیریت و دسترس‌پذیری.",
    logo: logoOf("dell"),
  },
  hpe: {
    display: "HPE",
    heroNote: "راهکارهای HPE برای دیتاسنترهای مقیاس‌پذیر و منعطف.",
    logo: logoOf("hpe"),
  },
  cisco: {
    display: "Cisco",
    heroNote: "شبکه و سوییچ/روترهای سازمانی سیسکو.",
    logo: logoOf("cisco"),
  },
  lenovo: {
    display: "Lenovo",
    heroNote: "زیرساخت‌های پایدار و اقتصادی لنوو برای سازمان‌ها.",
    logo: logoOf("lenovo"),
  },
  juniper: {
    display: "Juniper",
    heroNote: "شبکه‌های پرکارایی با محصول‌های Juniper.",
    logo: logoOf("juniper"),
  },
  oracle: {
    display: "Oracle",
    heroNote: "سرورها و راهکارهای اوراکل.",
    logo: logoOf("oracle"),
  },
  fujitsu: {
    display: "Fujitsu",
    heroNote: "زیرساخت‌های سازمانی فوجیتسو.",
    logo: logoOf("fujitsu"),
  },
  quantum: {
    display: "Quantum",
    heroNote: "بکاپ/آرشیو و ذخیره‌سازی کوانتوم.",
    logo: logoOf("quantum"),
  },
};