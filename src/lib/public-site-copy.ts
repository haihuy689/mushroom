import type { SiteLocale } from "@/lib/i18n";

export type PublicSiteCopy = {
  metadata: {
    articleNotFoundTitle: string;
    blogDescription: string;
    blogTitle: string;
    rootDescription: string;
    rootTitle: string;
    shopDescription: string;
    shopTitle: string;
  };
  blog: {
    articleSidebarCta: string;
    articleSidebarLabel: string;
    articleSidebarText: string;
    heroEyebrow: string;
    heroLead: string;
    heroTitle: string;
    relatedProductsLabel: string;
  };
  brandPillars: Array<{ description: string; title: string }>;
  footerCopy: string;
  footerMeta: string[];
  home: {
    bannerAction?: string;
    bannerLead?: string;
    bannerTitle?: string;
    benefits?: Array<{ label: string; tone: "green" | "pi" }>;
    brandCardDescription: string;
    brandCardLabel: string;
    brandCardTitle: string;
    featuredViewAll?: string;
    heroEyebrow: string;
    heroLead: string;
    heroTitle: string;
    journalLabel: string;
    journalTitle: string;
    overviewLabel: string;
    pillarsLabel: string;
    pillarsTitle: string;
    primaryAction: string;
    secondaryAction: string;
    steps?: Array<{ description: string; title: string }>;
    storefrontLabel: string;
    storefrontTitle: string;
    stats: Array<{ label: string; value: string }>;
  };
  piCheckout: PiCheckoutCopy;
};

export type PiCheckoutCopy = {
  approvalFailed: string;
  authFailed: string;
  authRequired: string;
  authSuccessPrefix: string;
  cancelled: string;
  completionFailed: string;
  connectBusy: string;
  missingServerKey: string;
  paymentError: string;
  sdkNotReady: string;
  sdkUnavailable: string;
};

const copy: Record<SiteLocale, PublicSiteCopy> = {
  en: {
    metadata: {
      articleNotFoundTitle: "Article not found | Mushroom.Pi",
      blogDescription:
        "Mushroom.Pi articles about mushrooms, cooking, wellness routines, and product knowledge.",
      blogTitle: "Blog | Mushroom.Pi",
      rootDescription:
        "Mushroom.Pi is a mushroom shop and blog where shoppers can discover products, save delivery details, and pay with Pi.",
      rootTitle: "Mushroom.Pi",
      shopDescription:
        "Shop mushroom products from Mushroom.Pi and place orders with Pi.",
      shopTitle: "Shop | Mushroom.Pi",
    },
    blog: {
      articleSidebarCta: "Explore the shop",
      articleSidebarLabel: "From knowledge to cart",
      articleSidebarText:
        "Read, compare, and choose the mushroom products that fit your routine.",
      heroEyebrow: "Mushroom journal",
      heroLead:
        "Simple articles about mushroom products, daily use, kitchen ideas, and practical wellness routines.",
      heroTitle: "Learn more before choosing what goes into your cart.",
      relatedProductsLabel: "Related products",
    },
    brandPillars: [
      {
        title: "Clear mushroom catalog",
        description:
          "Products are presented with price, stock, packaging, weight, and short descriptions that are easy to compare.",
      },
      {
        title: "Pi account checkout",
        description:
          "Shoppers can sign in with Pi, keep delivery details, and place orders from one cart.",
      },
      {
        title: "Useful mushroom reading",
        description:
          "The blog supports the shop with simple mushroom knowledge, product ideas, and everyday use cases.",
      },
    ],
    footerCopy:
      "Mushroom.Pi brings mushroom products, practical mushroom knowledge, saved addresses, order tracking, and Pi checkout into one clean storefront.",
    footerMeta: ["Mushroom products", "Pi checkout", "Blog and product guides"],
    home: {
      bannerAction: "Open in Pi Browser",
      bannerLead: "A smoother shopping flow for Pi community members.",
      bannerTitle: "Smooth experience in Pi Browser",
      benefits: [
        { label: "100% natural", tone: "green" },
        { label: "Fast delivery", tone: "green" },
        { label: "Pay with Pi", tone: "pi" },
        { label: "Food safety", tone: "green" },
      ],
      brandCardDescription:
        "A storefront built around mushroom products, practical education, and orders paid with Pi.",
      brandCardLabel: "Brand",
      brandCardTitle: "Mushroom.Pi",
      featuredViewAll: "View all",
      heroEyebrow: "Mushroom shop powered by Pi",
      heroLead:
        "Browse mushroom products, add them to your cart, save delivery details, and follow each order from checkout to delivery.",
      heroTitle:
        "Mushroom.Pi brings mushroom products and Pi checkout into one simple shop.",
      journalLabel: "From the blog",
      journalTitle: "Helpful mushroom reading for everyday choices.",
      overviewLabel: "Store overview",
      pillarsLabel: "Why shop here",
      pillarsTitle: "A clean storefront with room to learn before buying.",
      primaryAction: "Shop products",
      secondaryAction: "Read the blog",
      steps: [
        { title: "Choose products", description: "Add items to cart" },
        { title: "Pay with Pi", description: "Confirm and pay with Pi" },
        { title: "Confirm order", description: "We prepare and deliver" },
      ],
      storefrontLabel: "Featured products",
      storefrontTitle: "Start with a few mushroom essentials.",
      stats: [
        { value: "Shop", label: "mushroom products" },
        { value: "Pi", label: "account and checkout" },
        { value: "Blog", label: "guides and ideas" },
      ],
    },
    piCheckout: {
      approvalFailed:
        "We could not confirm this payment yet. Please try again.",
      authFailed: "Pi sign-in was not completed.",
      authRequired: "Please sign in with Pi before placing the order.",
      authSuccessPrefix: "Signed in as",
      cancelled: "Payment was cancelled.",
      completionFailed:
        "We could not finish saving this payment yet. Please contact support if the amount was deducted.",
      connectBusy: "Connecting...",
      missingServerKey:
        "Pi payment is temporarily unavailable. Please try again later.",
      paymentError: "Payment error",
      sdkNotReady:
        "Pi payment is not ready yet. Please open the site in Pi Browser and try again.",
      sdkUnavailable:
        "Pi payment is unavailable in this browser. Please open Mushroom.Pi in Pi Browser.",
    },
  },
  vi: {
    metadata: {
      articleNotFoundTitle: "Không tìm thấy bài viết | Mushroom.Pi",
      blogDescription:
        "Bài viết Mushroom.Pi về nấm, cách dùng, món ăn, thói quen chăm sóc sức khỏe và kiến thức sản phẩm.",
      blogTitle: "Blog | Mushroom.Pi",
      rootDescription:
        "Mushroom.Pi là cửa hàng nấm và blog giúp người mua xem sản phẩm, lưu địa chỉ nhận hàng, theo dõi đơn và thanh toán bằng Pi.",
      rootTitle: "Mushroom.Pi",
      shopDescription:
        "Mua các sản phẩm nấm từ Mushroom.Pi và đặt hàng bằng Pi.",
      shopTitle: "Cửa hàng | Mushroom.Pi",
    },
    blog: {
      articleSidebarCta: "Khám phá cửa hàng",
      articleSidebarLabel: "Từ kiến thức đến giỏ hàng",
      articleSidebarText:
        "Đọc, so sánh và chọn sản phẩm nấm phù hợp với thói quen của bạn.",
      heroEyebrow: "Blog về nấm",
      heroLead:
        "Những bài viết dễ hiểu về sản phẩm nấm, cách dùng hằng ngày, ý tưởng trong bếp và thói quen chăm sóc sức khỏe.",
      heroTitle: "Hiểu rõ hơn trước khi chọn sản phẩm cho giỏ hàng.",
      relatedProductsLabel: "Sản phẩm liên quan",
    },
    brandPillars: [
      {
        title: "Danh mục nấm rõ ràng",
        description:
          "Sản phẩm hiển thị giá, tồn kho, bao bì, khối lượng và mô tả ngắn để người mua dễ so sánh.",
      },
      {
        title: "Đặt hàng bằng tài khoản Pi",
        description:
          "Người mua có thể đăng nhập Pi, lưu địa chỉ nhận hàng và đặt cả giỏ trong một lần thanh toán.",
      },
      {
        title: "Kiến thức nấm dễ đọc",
        description:
          "Blog hỗ trợ cửa hàng bằng kiến thức về nấm, gợi ý sản phẩm và cách dùng hằng ngày.",
      },
    ],
    footerCopy:
      "Mushroom.Pi gom sản phẩm nấm, kiến thức thực tế về nấm, địa chỉ nhận hàng, theo dõi đơn và thanh toán bằng Pi vào một cửa hàng gọn gàng.",
    footerMeta: ["Sản phẩm nấm", "Thanh toán Pi", "Blog và hướng dẫn"],
    home: {
      brandCardDescription:
        "Một cửa hàng xoay quanh sản phẩm nấm, kiến thức dễ hiểu và đơn hàng thanh toán bằng Pi.",
      brandCardLabel: "Thương hiệu",
      brandCardTitle: "Mushroom.Pi",
      heroEyebrow: "Cửa hàng nấm thanh toán bằng Pi",
      heroLead:
        "Xem sản phẩm nấm, thêm vào giỏ hàng, lưu địa chỉ nhận hàng và theo dõi từng đơn từ lúc đặt đến lúc giao.",
      heroTitle:
        "Mushroom.Pi kết nối sản phẩm nấm và thanh toán Pi trong một cửa hàng đơn giản.",
      journalLabel: "Từ blog",
      journalTitle: "Đọc thêm về nấm để chọn sản phẩm dễ hơn.",
      overviewLabel: "Tổng quan cửa hàng",
      pillarsLabel: "Vì sao chọn Mushroom.Pi",
      pillarsTitle: "Một cửa hàng gọn gàng, có thêm kiến thức trước khi mua.",
      primaryAction: "Mua sản phẩm",
      secondaryAction: "Đọc blog",
      storefrontLabel: "Sản phẩm nổi bật",
      storefrontTitle: "Bắt đầu với vài sản phẩm nấm thiết yếu.",
      stats: [
        { value: "Shop", label: "sản phẩm nấm" },
        { value: "Pi", label: "đăng nhập và thanh toán" },
        { value: "Blog", label: "hướng dẫn và kiến thức" },
      ],
    },
    piCheckout: {
      approvalFailed:
        "Chưa xác nhận được khoản thanh toán. Bạn vui lòng thử lại.",
      authFailed: "Chưa hoàn tất đăng nhập Pi.",
      authRequired: "Vui lòng đăng nhập Pi trước khi đặt hàng.",
      authSuccessPrefix: "Đã đăng nhập dưới tên",
      cancelled: "Thanh toán đã bị hủy.",
      completionFailed:
        "Chưa lưu xong khoản thanh toán. Nếu Pi đã bị trừ, vui lòng liên hệ hỗ trợ.",
      connectBusy: "Đang kết nối...",
      missingServerKey:
        "Thanh toán Pi hiện tạm thời chưa khả dụng. Vui lòng thử lại sau.",
      paymentError: "Lỗi thanh toán",
      sdkNotReady:
        "Thanh toán Pi chưa sẵn sàng. Vui lòng mở website bằng Pi Browser và thử lại.",
      sdkUnavailable:
        "Trình duyệt này chưa hỗ trợ thanh toán Pi. Vui lòng mở Mushroom.Pi bằng Pi Browser.",
    },
  },
  es: {
    metadata: {
      articleNotFoundTitle: "Artículo no encontrado | Mushroom.Pi",
      blogDescription:
        "Artículos de Mushroom.Pi sobre hongos, cocina, rutinas de bienestar y conocimiento de producto.",
      blogTitle: "Blog | Mushroom.Pi",
      rootDescription:
        "Mushroom.Pi es una tienda y blog de hongos para descubrir productos, guardar direcciones y pagar con Pi.",
      rootTitle: "Mushroom.Pi",
      shopDescription:
        "Compra productos de hongos en Mushroom.Pi y haz pedidos con Pi.",
      shopTitle: "Tienda | Mushroom.Pi",
    },
    blog: {
      articleSidebarCta: "Explorar tienda",
      articleSidebarLabel: "Del conocimiento al carrito",
      articleSidebarText:
        "Lee, compara y elige productos de hongos para tu rutina.",
      heroEyebrow: "Diario de hongos",
      heroLead:
        "Artículos sencillos sobre productos, uso diario, cocina y bienestar.",
      heroTitle: "Aprende antes de elegir qué va al carrito.",
      relatedProductsLabel: "Productos relacionados",
    },
    brandPillars: [
      {
        title: "Catálogo claro",
        description:
          "Los productos muestran precio, stock, empaque, peso y descripciones cortas para comparar fácil.",
      },
      {
        title: "Checkout con cuenta Pi",
        description:
          "Los compradores pueden entrar con Pi, guardar direcciones y hacer pedidos desde un carrito.",
      },
      {
        title: "Lectura útil sobre hongos",
        description:
          "El blog apoya la tienda con conocimiento simple, ideas de producto y usos diarios.",
      },
    ],
    footerCopy:
      "Mushroom.Pi reúne productos de hongos, guías prácticas, direcciones guardadas, seguimiento de pedidos y pago con Pi.",
    footerMeta: ["Productos de hongos", "Pago con Pi", "Blog y guías"],
    home: {
      brandCardDescription:
        "Una tienda centrada en productos de hongos, educación práctica y pedidos pagados con Pi.",
      brandCardLabel: "Marca",
      brandCardTitle: "Mushroom.Pi",
      heroEyebrow: "Tienda de hongos con Pi",
      heroLead:
        "Explora productos, agrégalos al carrito, guarda tu dirección y sigue cada pedido.",
      heroTitle: "Mushroom.Pi une productos de hongos y pago con Pi.",
      journalLabel: "Desde el blog",
      journalTitle: "Lecturas útiles para elegir mejor.",
      overviewLabel: "Resumen de tienda",
      pillarsLabel: "Por qué comprar aquí",
      pillarsTitle: "Una tienda clara con espacio para aprender antes de comprar.",
      primaryAction: "Comprar productos",
      secondaryAction: "Leer blog",
      storefrontLabel: "Productos destacados",
      storefrontTitle: "Empieza con algunos esenciales de hongos.",
      stats: [
        { value: "Shop", label: "productos de hongos" },
        { value: "Pi", label: "cuenta y pago" },
        { value: "Blog", label: "guías e ideas" },
      ],
    },
    piCheckout: {
      approvalFailed: "No pudimos confirmar el pago. Intentalo otra vez.",
      authFailed: "No se completo el inicio de sesion con Pi.",
      authRequired: "Inicia sesion con Pi antes de hacer el pedido.",
      authSuccessPrefix: "Conectado como",
      cancelled: "El pago fue cancelado.",
      completionFailed:
        "No pudimos guardar el pago. Contacta soporte si el monto fue descontado.",
      connectBusy: "Conectando...",
      missingServerKey:
        "El pago con Pi no esta disponible ahora. Intentalo mas tarde.",
      paymentError: "Error de pago",
      sdkNotReady:
        "El pago con Pi aun no esta listo. Abre el sitio en Pi Browser e intentalo de nuevo.",
      sdkUnavailable:
        "El pago con Pi no esta disponible en este navegador. Abre Mushroom.Pi en Pi Browser.",
    },
  },
  fr: {
    metadata: {
      articleNotFoundTitle: "Article introuvable | Mushroom.Pi",
      blogDescription:
        "Articles Mushroom.Pi sur les champignons, la cuisine, les routines bien-être et les produits.",
      blogTitle: "Blog | Mushroom.Pi",
      rootDescription:
        "Mushroom.Pi est une boutique et un blog sur les champignons pour découvrir des produits, enregistrer une adresse et payer avec Pi.",
      rootTitle: "Mushroom.Pi",
      shopDescription:
        "Achetez des produits à base de champignons sur Mushroom.Pi et commandez avec Pi.",
      shopTitle: "Boutique | Mushroom.Pi",
    },
    blog: {
      articleSidebarCta: "Explorer la boutique",
      articleSidebarLabel: "Du savoir au panier",
      articleSidebarText:
        "Lisez, comparez et choisissez les produits adaptés à votre routine.",
      heroEyebrow: "Journal champignons",
      heroLead:
        "Des articles simples sur les produits, les usages quotidiens, la cuisine et le bien-être.",
      heroTitle: "Apprenez avant de choisir ce qui va dans le panier.",
      relatedProductsLabel: "Produits liés",
    },
    brandPillars: [
      {
        title: "Catalogue clair",
        description:
          "Les produits affichent prix, stock, emballage, poids et descriptions courtes pour comparer facilement.",
      },
      {
        title: "Commande avec compte Pi",
        description:
          "Les acheteurs peuvent se connecter avec Pi, enregistrer une adresse et commander depuis le panier.",
      },
      {
        title: "Lecture utile sur les champignons",
        description:
          "Le blog soutient la boutique avec des connaissances simples, des idées produit et des usages quotidiens.",
      },
    ],
    footerCopy:
      "Mushroom.Pi réunit produits de champignons, guides pratiques, adresses enregistrées, suivi de commandes et paiement avec Pi.",
    footerMeta: ["Produits champignons", "Paiement Pi", "Blog et guides"],
    home: {
      brandCardDescription:
        "Une boutique centrée sur les champignons, l'apprentissage pratique et les commandes payées avec Pi.",
      brandCardLabel: "Marque",
      brandCardTitle: "Mushroom.Pi",
      heroEyebrow: "Boutique de champignons avec Pi",
      heroLead:
        "Parcourez les produits, ajoutez-les au panier, enregistrez votre adresse et suivez chaque commande.",
      heroTitle: "Mushroom.Pi réunit produits de champignons et paiement Pi.",
      journalLabel: "Depuis le blog",
      journalTitle: "Des lectures utiles pour mieux choisir.",
      overviewLabel: "Aperçu boutique",
      pillarsLabel: "Pourquoi acheter ici",
      pillarsTitle: "Une boutique claire avec de quoi apprendre avant d'acheter.",
      primaryAction: "Acheter",
      secondaryAction: "Lire le blog",
      storefrontLabel: "Produits en avant",
      storefrontTitle: "Commencez par quelques essentiels.",
      stats: [
        { value: "Shop", label: "produits champignons" },
        { value: "Pi", label: "compte et paiement" },
        { value: "Blog", label: "guides et idées" },
      ],
    },
    piCheckout: {
      approvalFailed:
        "Nous n'avons pas pu confirmer le paiement. Veuillez reessayer.",
      authFailed: "La connexion Pi n'a pas ete terminee.",
      authRequired: "Connectez-vous avec Pi avant de commander.",
      authSuccessPrefix: "Connecte en tant que",
      cancelled: "Le paiement a ete annule.",
      completionFailed:
        "Nous n'avons pas pu enregistrer le paiement. Contactez le support si le montant a ete debite.",
      connectBusy: "Connexion...",
      missingServerKey:
        "Le paiement Pi est temporairement indisponible. Veuillez reessayer plus tard.",
      paymentError: "Erreur de paiement",
      sdkNotReady:
        "Le paiement Pi n'est pas encore pret. Ouvrez le site dans Pi Browser et reessayez.",
      sdkUnavailable:
        "Le paiement Pi n'est pas disponible dans ce navigateur. Ouvrez Mushroom.Pi dans Pi Browser.",
    },
  },
  zh: {
    metadata: {
      articleNotFoundTitle: "文章未找到 | Mushroom.Pi",
      blogDescription:
        "Mushroom.Pi 关于蘑菇、烹饪、日常健康习惯和产品知识的文章。",
      blogTitle: "博客 | Mushroom.Pi",
      rootDescription:
        "Mushroom.Pi 是蘑菇商品商店和博客，可浏览产品、保存收货地址并使用 Pi 支付。",
      rootTitle: "Mushroom.Pi",
      shopDescription: "在 Mushroom.Pi 购买蘑菇商品并使用 Pi 下单。",
      shopTitle: "商店 | Mushroom.Pi",
    },
    blog: {
      articleSidebarCta: "查看商店",
      articleSidebarLabel: "从知识到购物车",
      articleSidebarText: "阅读、比较，并选择适合你日常习惯的蘑菇产品。",
      heroEyebrow: "蘑菇日志",
      heroLead: "关于蘑菇产品、日常使用、厨房灵感和健康习惯的简单文章。",
      heroTitle: "先了解，再选择放入购物车的产品。",
      relatedProductsLabel: "相关产品",
    },
    brandPillars: [
      {
        title: "清晰的蘑菇目录",
        description: "商品展示价格、库存、包装、重量和简短说明，方便比较。",
      },
      {
        title: "使用 Pi 账号下单",
        description: "买家可以使用 Pi 登录，保存收货地址，并从购物车完成下单。",
      },
      {
        title: "实用的蘑菇文章",
        description: "博客用简单知识、产品想法和日常使用方式支持商店。",
      },
    ],
    footerCopy:
      "Mushroom.Pi 将蘑菇产品、实用知识、保存地址、订单追踪和 Pi 支付放进一个清爽的商店体验。",
    footerMeta: ["蘑菇产品", "Pi 支付", "博客与指南"],
    home: {
      brandCardDescription:
        "围绕蘑菇产品、实用知识和 Pi 支付订单打造的商店。",
      brandCardLabel: "品牌",
      brandCardTitle: "Mushroom.Pi",
      heroEyebrow: "支持 Pi 支付的蘑菇商店",
      heroLead: "浏览蘑菇产品，加入购物车，保存收货地址，并追踪每一笔订单。",
      heroTitle: "Mushroom.Pi 把蘑菇产品和 Pi 支付放在一个简单商店里。",
      journalLabel: "来自博客",
      journalTitle: "用简单文章帮助你更好选择。",
      overviewLabel: "商店概览",
      pillarsLabel: "为什么选择这里",
      pillarsTitle: "一个清爽的商店，也能在购买前学习更多。",
      primaryAction: "购买产品",
      secondaryAction: "阅读博客",
      storefrontLabel: "精选产品",
      storefrontTitle: "从几款蘑菇基础产品开始。",
      stats: [
        { value: "Shop", label: "蘑菇产品" },
        { value: "Pi", label: "账号与支付" },
        { value: "Blog", label: "指南和想法" },
      ],
    },
    piCheckout: {
      approvalFailed: "暂时无法确认付款，请重试。",
      authFailed: "Pi 登录未完成。",
      authRequired: "下单前请先使用 Pi 登录。",
      authSuccessPrefix: "已登录为",
      cancelled: "付款已取消。",
      completionFailed: "暂时无法保存付款记录。如已扣款，请联系支持。",
      connectBusy: "连接中...",
      missingServerKey: "Pi 支付暂时不可用，请稍后再试。",
      paymentError: "支付错误",
      sdkNotReady: "Pi 支付尚未准备好。请在 Pi Browser 中打开网站后重试。",
      sdkUnavailable:
        "当前浏览器不支持 Pi 支付。请在 Pi Browser 中打开 Mushroom.Pi。",
    },
  },
};

export function getPublicSiteCopy(locale: SiteLocale) {
  return copy[locale];
}
