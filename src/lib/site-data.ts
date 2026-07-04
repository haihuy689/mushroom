import type { SiteLocale } from "@/lib/i18n";
import type { BlogPost, Product } from "@/lib/pi-types";

export type NavigationLink = {
  href: string;
  label: string;
};

export type SiteCopy = {
  metadata: {
    rootTitle: string;
    rootDescription: string;
    shopTitle: string;
    shopDescription: string;
    blogTitle: string;
    blogDescription: string;
    piLabTitle: string;
    piLabDescription: string;
    articleNotFoundTitle: string;
  };
  brandTagline: string;
  navigation: NavigationLink[];
  headerAction: string;
  footerCopy: string;
  footerMeta: string[];
  footerGithub: string;
  footerLiveSite: string;
  home: {
    heroEyebrow: string;
    heroTitle: string;
    heroLead: string;
    primaryAction: string;
    secondaryAction: string;
    currentDirectionLabel: string;
    futureDomainLabel: string;
    futureDomainTitle: string;
    futureDomainDescription: string;
    storefrontLabel: string;
    storefrontTitle: string;
    commerceLabel: string;
    commerceTitle: string;
    commerceBody: string;
    pillarsLabel: string;
    pillarsTitle: string;
    journalLabel: string;
    journalTitle: string;
    stats: Array<{ value: string; label: string }>;
  };
  shop: {
    heroEyebrow: string;
    heroTitle: string;
    heroLead: string;
    infoCards: Array<{ title: string; description: string }>;
  };
  blog: {
    heroEyebrow: string;
    heroTitle: string;
    heroLead: string;
    articleSidebarLabel: string;
    articleSidebarText: string;
    articleSidebarCta: string;
    relatedProductsLabel: string;
  };
  piLab: {
    heroEyebrow: string;
    heroTitle: string;
    heroLead: string;
    repoStatusTitle: string;
    setupTitle: string;
    serverKeyConfigured: string;
    serverKeyPending: string;
    repoStatusBody: string;
    envTitle: string;
    envBody: string;
    nextTitle: string;
    nextPrimary: string;
    nextSecondary: string;
  };
  piPanel: {
    title: string;
    description: string;
    connectReady: string;
    connectBusy: string;
    hint: string;
    verifiedViewerLabel: string;
    grantedScopesLabel: string;
    unknownScopes: string;
    testAmountLabel: string;
    payAction: string;
    processing: string;
    recentFlowTitle: string;
    initialTimeline: string;
    sandboxEnabled: string;
    browserRuntime: string;
    serverConfigured: string;
    serverPending: string;
    sdkUnavailable: string;
    sdkNotReady: string;
    authRequired: string;
    missingServerKey: string;
    authSuccessPrefix: string;
    authFailed: string;
    incompleteFound: string;
    incompleteSent: string;
    incompleteFailed: string;
    approvalReady: string;
    approvalDone: string;
    approvalFailed: string;
    completionReady: string;
    completionDone: string;
    completionFailed: string;
    cancelled: string;
    cancelledTimeline: string;
    paymentError: string;
    completionSuccessSuffix: string;
  };
  brandPillars: Array<{ title: string; description: string }>;
  piSetupSteps: string[];
};

type ProductCatalogEntry = Omit<Product, "name" | "tagline" | "description" | "category" | "format" | "badge"> & {
  content: Record<
    SiteLocale,
    Pick<Product, "name" | "tagline" | "description" | "category" | "format" | "badge">
  >;
};

type BlogCatalogEntry = {
  slug: string;
  content: Record<SiteLocale, BlogPost>;
};

const hiddenPublicBlogSlugs = new Set([
  "how-to-explain-test-pi-checkout-to-customers",
  "what-to-prepare-before-mainnet",
]);

const copy: Record<SiteLocale, SiteCopy> = {
  en: {
    metadata: {
      rootTitle: "Mushroom.Pi",
      rootDescription:
        "Mushroom.Pi is a Pi-powered mushroom storefront and editorial site, shaped around Pi Testnet commerce.",
      shopTitle: "Shop | Mushroom.Pi",
      shopDescription:
        "Browse the Mushroom.Pi storefront and test the Pi-native checkout flow.",
      blogTitle: "Blog | Mushroom.Pi",
      blogDescription:
        "Editorial writing for Mushroom.Pi, covering mushrooms, brand thinking, and Pi-native commerce.",
      piLabTitle: "Pi Lab | Mushroom.Pi",
      piLabDescription:
        "Setup notes for Pi Browser, Pi Sandbox, and Test-Pi payment flow inside Mushroom.Pi.",
      articleNotFoundTitle: "Article not found | Mushroom.Pi",
    },
    brandTagline: "Pi-powered mushroom store and blog",
    navigation: [
      { href: "/shop", label: "Shop" },
      { href: "/blog", label: "Blog" },
      { href: "/pi-lab", label: "Pi Lab" },
    ],
    headerAction: "Open Storefront",
    footerCopy:
      "Mushroom.Pi is being shaped as a Pi-native mushroom storefront with testnet checkout, account sign-in, and a blog that gives the brand editorial depth around products, routines, and mushroom education.",
    footerMeta: [
      "Pi Testnet rollout",
      "Commerce-first architecture",
      "Editorial mushroom content",
    ],
    footerGithub: "GitHub",
    footerLiveSite: "Live Site",
    home: {
      heroEyebrow: "Pi-native mushroom commerce",
      heroTitle:
        "Mushroom.Pi is being built as a real store, not just a landing page.",
      heroLead:
        "The brand direction is now clear: a storefront-first mushroom site connected to Pi sign-in, Test-Pi payments, and an editorial layer that teaches, earns trust, and supports long-term growth.",
      primaryAction: "Enter the store",
      secondaryAction: "Read the journal",
      currentDirectionLabel: "Current direction",
      futureDomainLabel: "Future domain fit",
      futureDomainTitle: "Mushroom.Pi",
      futureDomainDescription:
        "The site identity, content voice, and commerce flow are being shaped to eventually live naturally under your Pi domain.",
      storefrontLabel: "Storefront preview",
      storefrontTitle: "Product architecture now drives the homepage.",
      commerceLabel: "Pi commerce panel",
      commerceTitle:
        "Sign in, verify the Pi user, and test the payment lifecycle.",
      commerceBody:
        "This is the functional heart of the next phase. The panel below is scaffolded around the official Pi flow: authenticate on the client, verify through the Platform API, then approve and complete payments from server routes.",
      pillarsLabel: "Brand pillars",
      pillarsTitle:
        "The business model is store-first, with content doing strategic support.",
      journalLabel: "From the journal",
      journalTitle:
        "Content keeps the shop from feeling generic.",
      stats: [
        { value: "80%", label: "storefront-first experience" },
        { value: "Test-Pi", label: "checkout mode for current rollout" },
        { value: "3 lanes", label: "shop, blog, and Pi commerce" },
      ],
    },
    shop: {
      heroEyebrow: "Storefront",
      heroTitle:
        "Mushroom.Pi is being designed to sell first and explain second.",
      heroLead:
        "This page is the clearest expression of the target business model: curated mushroom products, Pi-native onboarding, and a checkout path that can mature from Test-Pi to a full production flow later.",
      infoCards: [
        {
          title: "Test-Pi now",
          description:
            "Use Pi Testnet as the operating lane while the product logic and UX are refined.",
        },
        {
          title: "Catalog mix",
          description:
            "Functional wellness, culinary products, and bundle logic all fit naturally into this structure.",
        },
        {
          title: "Pi identity",
          description:
            "Login and payment are being treated as native business primitives, not bolt-on widgets.",
        },
      ],
    },
    blog: {
      heroEyebrow: "Editorial layer",
      heroTitle:
        "The blog gives Mushroom.Pi more trust, depth, and repeat reasons to visit.",
      heroLead:
        "The store may carry most of the business weight, but the journal is what stops the brand from feeling like a generic supplement shelf. It turns products, routines, and Pi-commerce decisions into a clear point of view.",
      articleSidebarLabel: "Editorial to commerce",
      articleSidebarText:
        "Mushroom.Pi treats content as a support system for the storefront, not as a disconnected side project.",
      articleSidebarCta: "Explore the shop",
      relatedProductsLabel: "Related products",
    },
    piLab: {
      heroEyebrow: "Pi lab",
      heroTitle:
        "This is the operating surface for Pi Browser, Pi Sandbox, and Test-Pi checkout.",
      heroLead:
        "The site now includes a frontend auth flow, server-side verification against `/me`, and payment approval/completion endpoints. The missing piece for live testing is the real Server API Key from the Pi Developer Portal.",
      repoStatusTitle: "Current repo status",
      setupTitle: "Setup checklist",
      serverKeyConfigured: "configured",
      serverKeyPending: "not configured yet",
      repoStatusBody:
        "Sandbox mode comes from `NEXT_PUBLIC_PI_SANDBOX`, while the real app network should be chosen in the Pi Developer Portal when you create the Mushroom.Pi project.",
      envTitle: "Environment variables",
      envBody:
        "If you want local desktop sandbox testing, set `NEXT_PUBLIC_PI_SANDBOX=true` in your local environment and run the app through the Pi Sandbox flow.",
      nextTitle: "Where to continue next",
      nextPrimary: "Test storefront flow",
      nextSecondary: "Review editorial layer",
    },
    piPanel: {
      title: "Pi Commerce Lab",
      description:
        "This panel is wired for Pi sign-in, user verification through `/me`, and Test-Pi payment approval/completion callbacks. It is the commerce bridge for Mushroom.Pi.",
      connectReady: "Sign in with Pi",
      connectBusy: "Connecting...",
      hint:
        "Pi login and payment dialogs are expected to work inside Pi Browser or Pi Sandbox. On a regular browser, the SDK may load but the native flow can still be unavailable.",
      verifiedViewerLabel: "Verified Pioneer",
      grantedScopesLabel: "Granted scopes",
      unknownScopes: "unknown",
      testAmountLabel: "Test-Pi amount",
      payAction: "Pay with Pi Testnet",
      processing: "Processing...",
      recentFlowTitle: "Recent flow events",
      initialTimeline:
        "Pi SDK panel loaded. Open this page in Pi Browser or Pi Sandbox to test native sign-in and checkout.",
      sandboxEnabled: "Sandbox enabled",
      browserRuntime: "Browser runtime",
      serverConfigured: "Server key configured",
      serverPending: "Server key pending",
      sdkUnavailable:
        "Pi SDK is not available in this browser session.",
      sdkNotReady:
        "Pi SDK is not available yet. Open the app in Pi Browser or wait for the script to finish loading.",
      authRequired:
        "Authenticate with your Pi account before starting a Test-Pi payment.",
      missingServerKey:
        "PI_API_KEY is not configured on the server yet, so payment approval cannot continue.",
      authSuccessPrefix: "Connected as",
      authFailed: "Pi authentication failed.",
      incompleteFound:
        "Incomplete payment found. Trying to reconcile it on the server.",
      incompleteSent:
        "The incomplete payment was handed off to the server.",
      incompleteFailed: "Failed to reconcile an incomplete payment.",
      approvalReady: "Payment is ready for server approval.",
      approvalDone: "Payment was approved by the backend.",
      approvalFailed: "Server-side approval failed.",
      completionReady:
        "Blockchain transaction received. Completing on the backend.",
      completionDone: "Payment was completed on the backend.",
      completionFailed: "Server-side completion failed.",
      cancelled: "Payment was cancelled before completion.",
      cancelledTimeline: "Payment was cancelled by the user or the SDK.",
      paymentError: "Payment error",
      completionSuccessSuffix:
        "reached the server-completion phase successfully. This is the core Pi payment flow you will later connect to real fulfillment.",
    },
    brandPillars: [
      {
        title: "Pi-native commerce",
        description:
          "Shoppers can sign in with Pi, browse your catalog, and move toward native Pi payments without leaving the Pi ecosystem.",
      },
      {
        title: "Mushroom expertise",
        description:
          "Editorial content gives the brand authority, while also creating organic reasons for people to return beyond one-off purchases.",
      },
      {
        title: "Merchant-ready structure",
        description:
          "The layout is intentionally weighted toward products, bundles, and conversion flows while preserving room for storytelling.",
      },
    ],
    piSetupSteps: [
      "Register Mushroom.Pi in the Pi Developer Portal from the Pi Browser.",
      "Select Pi Testnet first, because the network choice is fixed per app.",
      "Set the app URL to your hosted site and the development URL to your local server.",
      "Create or connect the app wallet, then copy the Server API Key into your environment variables.",
      "Open the site in Pi Browser or Pi Sandbox to test sign-in and payment flows safely.",
    ],
  },
  vi: {
    metadata: {
      rootTitle: "Mushroom.Pi",
      rootDescription:
        "Mushroom.Pi là website bán hàng và nội dung về nấm, định hướng tích hợp Pi Testnet commerce.",
      shopTitle: "Cửa hàng | Mushroom.Pi",
      shopDescription:
        "Khám phá cửa hàng Mushroom.Pi và thử luồng thanh toán Pi-native.",
      blogTitle: "Blog | Mushroom.Pi",
      blogDescription:
        "Nội dung về nấm, định vị thương hiệu và thương mại trong hệ Pi cho Mushroom.Pi.",
      piLabTitle: "Pi Lab | Mushroom.Pi",
      piLabDescription:
        "Ghi chú thiết lập cho Pi Browser, Pi Sandbox và thanh toán Test-Pi trong Mushroom.Pi.",
      articleNotFoundTitle: "Không tìm thấy bài viết | Mushroom.Pi",
    },
    brandTagline: "Cửa hàng và blog về nấm chạy cùng Pi",
    navigation: [
      { href: "/shop", label: "Cửa hàng" },
      { href: "/blog", label: "Blog" },
      { href: "/pi-lab", label: "Pi Lab" },
    ],
    headerAction: "Mở cửa hàng",
    footerCopy:
      "Mushroom.Pi đang được định hình thành một storefront về nấm theo hướng Pi-native, có checkout testnet, đăng nhập tài khoản và blog giúp thương hiệu có chiều sâu hơn quanh sản phẩm, thói quen sử dụng và kiến thức về nấm.",
    footerMeta: [
      "Triển khai Pi Testnet",
      "Kiến trúc ưu tiên bán hàng",
      "Nội dung chuyên sâu về nấm",
    ],
    footerGithub: "GitHub",
    footerLiveSite: "Website live",
    home: {
      heroEyebrow: "Thương mại nấm theo hướng Pi-native",
      heroTitle:
        "Mushroom.Pi đang được xây như một cửa hàng thật, không chỉ là landing page.",
      heroLead:
        "Hướng đi thương hiệu giờ đã rõ: một website về nấm ưu tiên storefront, kết nối đăng nhập Pi, thanh toán Test-Pi và lớp nội dung giúp dạy người dùng, tạo niềm tin và hỗ trợ tăng trưởng dài hạn.",
      primaryAction: "Vào cửa hàng",
      secondaryAction: "Đọc journal",
      currentDirectionLabel: "Định hướng hiện tại",
      futureDomainLabel: "Phù hợp với tên miền tương lai",
      futureDomainTitle: "Mushroom.Pi",
      futureDomainDescription:
        "Nhận diện, giọng điệu nội dung và flow thương mại đang được làm theo hướng để sau này sống tự nhiên dưới domain Pi của bạn.",
      storefrontLabel: "Xem trước storefront",
      storefrontTitle: "Kiến trúc sản phẩm giờ là thứ dẫn dắt homepage.",
      commerceLabel: "Bảng Pi commerce",
      commerceTitle:
        "Đăng nhập, xác minh người dùng Pi và thử luồng thanh toán.",
      commerceBody:
        "Đây là trái tim chức năng của giai đoạn tiếp theo. Panel bên dưới bám theo flow chính thức của Pi: authenticate ở client, verify qua Platform API, rồi approve và complete payment từ server routes.",
      pillarsLabel: "Trụ cột thương hiệu",
      pillarsTitle:
        "Mô hình kinh doanh ưu tiên store, còn content làm nhiệm vụ hỗ trợ chiến lược.",
      journalLabel: "Từ journal",
      journalTitle:
        "Content giúp cửa hàng không bị cảm giác quá chung chung.",
      stats: [
        { value: "80%", label: "trải nghiệm thiên về storefront" },
        { value: "Test-Pi", label: "chế độ checkout đang triển khai" },
        { value: "3 mảng", label: "shop, blog và Pi commerce" },
      ],
    },
    shop: {
      heroEyebrow: "Cửa hàng",
      heroTitle:
        "Mushroom.Pi đang được thiết kế theo hướng bán trước, giải thích sau.",
      heroLead:
        "Trang này thể hiện rõ nhất mô hình mục tiêu: sản phẩm nấm được tuyển chọn, onboarding theo Pi-native và flow checkout có thể trưởng thành từ Test-Pi lên production sau này.",
      infoCards: [
        {
          title: "Test-Pi trước",
          description:
            "Dùng Pi Testnet như làn vận hành ban đầu trong lúc logic sản phẩm và UX còn được tinh chỉnh.",
        },
        {
          title: "Cấu trúc catalog",
          description:
            "Wellness, nấm dùng trong ẩm thực và logic bundle đều có thể nằm tự nhiên trong cấu trúc này.",
        },
        {
          title: "Danh tính Pi",
          description:
            "Đăng nhập và thanh toán được xem là primitive kinh doanh gốc, không phải widget gắn thêm.",
        },
      ],
    },
    blog: {
      heroEyebrow: "Lớp nội dung",
      heroTitle:
        "Blog giúp Mushroom.Pi đáng tin hơn, có chiều sâu hơn và khiến người dùng có lý do quay lại.",
      heroLead:
        "Store có thể gánh phần lớn doanh thu, nhưng journal là thứ ngăn thương hiệu trở thành một kệ supplement vô danh. Nó biến sản phẩm, thói quen dùng nấm và quyết định Pi-commerce thành một góc nhìn rõ ràng.",
      articleSidebarLabel: "Từ editorial sang commerce",
      articleSidebarText:
        "Mushroom.Pi xem content như hệ hỗ trợ cho storefront, chứ không phải một nhánh tách rời.",
      articleSidebarCta: "Khám phá cửa hàng",
      relatedProductsLabel: "Sản phẩm liên quan",
    },
    piLab: {
      heroEyebrow: "Pi lab",
      heroTitle:
        "Đây là bề mặt vận hành cho Pi Browser, Pi Sandbox và checkout Test-Pi.",
      heroLead:
        "Website hiện đã có flow auth ở frontend, verify server-side với `/me`, và endpoint approve/completion cho payment. Mảnh còn thiếu để test thật là Server API Key từ Pi Developer Portal.",
      repoStatusTitle: "Trạng thái repo hiện tại",
      setupTitle: "Checklist thiết lập",
      serverKeyConfigured: "đã cấu hình",
      serverKeyPending: "chưa cấu hình",
      repoStatusBody:
        "Chế độ sandbox lấy từ `NEXT_PUBLIC_PI_SANDBOX`, còn network thật của app nên được chọn trong Pi Developer Portal khi bạn tạo project Mushroom.Pi.",
      envTitle: "Biến môi trường",
      envBody:
        "Nếu muốn test sandbox trên desktop local, hãy đặt `NEXT_PUBLIC_PI_SANDBOX=true` trong môi trường local và chạy app qua luồng Pi Sandbox.",
      nextTitle: "Bước tiếp theo",
      nextPrimary: "Test storefront",
      nextSecondary: "Xem lớp content",
    },
    piPanel: {
      title: "Pi Commerce Lab",
      description:
        "Panel này đã được nối cho đăng nhập Pi, xác minh người dùng qua `/me` và callback approve/completion cho Test-Pi. Đây là cây cầu commerce của Mushroom.Pi.",
      connectReady: "Đăng nhập bằng Pi",
      connectBusy: "Đang kết nối...",
      hint:
        "Hộp thoại login và payment của Pi được kỳ vọng hoạt động trong Pi Browser hoặc Pi Sandbox. Trên browser thông thường, SDK có thể load nhưng flow native vẫn có thể không khả dụng.",
      verifiedViewerLabel: "Pioneer đã xác minh",
      grantedScopesLabel: "Quyền đã cấp",
      unknownScopes: "không rõ",
      testAmountLabel: "Số Pi test",
      payAction: "Thanh toán bằng Pi Testnet",
      processing: "Đang xử lý...",
      recentFlowTitle: "Sự kiện flow gần đây",
      initialTimeline:
        "Pi SDK panel đã tải. Hãy mở trang này trong Pi Browser hoặc Pi Sandbox để test đăng nhập và checkout native.",
      sandboxEnabled: "Đã bật sandbox",
      browserRuntime: "Runtime trình duyệt",
      serverConfigured: "Server key đã cấu hình",
      serverPending: "Server key còn thiếu",
      sdkUnavailable: "Pi SDK chưa khả dụng trong phiên trình duyệt này.",
      sdkNotReady:
        "Pi SDK chưa sẵn sàng. Hãy mở app trong Pi Browser hoặc chờ script tải xong.",
      authRequired:
        "Hãy đăng nhập tài khoản Pi trước khi bắt đầu thanh toán Test-Pi.",
      missingServerKey:
        "PI_API_KEY chưa được cấu hình trên server, nên bước approve payment chưa thể tiếp tục.",
      authSuccessPrefix: "Đã kết nối dưới tên",
      authFailed: "Đăng nhập Pi thất bại.",
      incompleteFound:
        "Phát hiện payment chưa hoàn tất. Đang thử reconcile ở server.",
      incompleteSent:
        "Payment chưa hoàn tất đã được gửi sang server xử lý.",
      incompleteFailed: "Không thể xử lý payment chưa hoàn tất.",
      approvalReady: "Payment đã sẵn sàng cho server approval.",
      approvalDone: "Payment đã được backend approve.",
      approvalFailed: "Server-side approval thất bại.",
      completionReady:
        "Đã nhận transaction blockchain. Đang complete ở backend.",
      completionDone: "Payment đã được complete ở backend.",
      completionFailed: "Server-side completion thất bại.",
      cancelled: "Payment đã bị hủy trước khi hoàn tất.",
      cancelledTimeline: "Payment đã bị hủy bởi người dùng hoặc bởi SDK.",
      paymentError: "Lỗi payment",
      completionSuccessSuffix:
        "đã đi đến giai đoạn server-completion thành công. Đây là flow payment cốt lõi của Pi mà sau này bạn sẽ nối với fulfillment thật.",
    },
    brandPillars: [
      {
        title: "Commerce theo Pi-native",
        description:
          "Người mua có thể đăng nhập bằng Pi, duyệt catalog và tiến dần tới thanh toán Pi-native mà không rời khỏi hệ sinh thái Pi.",
      },
      {
        title: "Chuyên môn về nấm",
        description:
          "Lớp nội dung giúp thương hiệu có uy tín hơn, đồng thời tạo thêm lý do để người dùng quay lại ngoài một lần mua đơn lẻ.",
      },
      {
        title: "Cấu trúc sẵn cho merchant",
        description:
          "Layout được cân trọng tâm vào sản phẩm, bundle và flow chuyển đổi nhưng vẫn giữ đủ chỗ cho storytelling.",
      },
    ],
    piSetupSteps: [
      "Đăng ký Mushroom.Pi trong Pi Developer Portal từ Pi Browser.",
      "Chọn Pi Testnet trước, vì network của app sẽ bị cố định theo project.",
      "Đặt app URL cho site đang host và development URL cho server local của bạn.",
      "Tạo hoặc kết nối app wallet, sau đó chép Server API Key vào biến môi trường.",
      "Mở site bằng Pi Browser hoặc Pi Sandbox để test an toàn flow đăng nhập và thanh toán.",
    ],
  },
  es: {
    metadata: {
      rootTitle: "Mushroom.Pi",
      rootDescription:
        "Mushroom.Pi es una tienda y sitio editorial sobre hongos, orientado al comercio con Pi Testnet.",
      shopTitle: "Tienda | Mushroom.Pi",
      shopDescription:
        "Explora la tienda de Mushroom.Pi y prueba el flujo de pago nativo con Pi.",
      blogTitle: "Blog | Mushroom.Pi",
      blogDescription:
        "Textos editoriales sobre hongos, marca y comercio nativo en Pi para Mushroom.Pi.",
      piLabTitle: "Pi Lab | Mushroom.Pi",
      piLabDescription:
        "Notas de configuración para Pi Browser, Pi Sandbox y pagos Test-Pi dentro de Mushroom.Pi.",
      articleNotFoundTitle: "Artículo no encontrado | Mushroom.Pi",
    },
    brandTagline: "Tienda y blog de hongos impulsados por Pi",
    navigation: [
      { href: "/shop", label: "Tienda" },
      { href: "/blog", label: "Blog" },
      { href: "/pi-lab", label: "Pi Lab" },
    ],
    headerAction: "Abrir tienda",
    footerCopy:
      "Mushroom.Pi se está construyendo como una tienda de hongos nativa de Pi con checkout en testnet, acceso con cuenta Pi y un blog que aporta profundidad editorial a productos, rutinas y educación micológica.",
    footerMeta: [
      "Despliegue en Pi Testnet",
      "Arquitectura orientada a venta",
      "Contenido editorial sobre hongos",
    ],
    footerGithub: "GitHub",
    footerLiveSite: "Sitio en línea",
    home: {
      heroEyebrow: "Comercio de hongos nativo de Pi",
      heroTitle:
        "Mushroom.Pi se está construyendo como una tienda real, no solo como una landing.",
      heroLead:
        "La dirección de marca ya es clara: un sitio de hongos centrado en tienda, conectado al inicio de sesión con Pi, pagos Test-Pi y una capa editorial que enseña, genera confianza y sostiene el crecimiento a largo plazo.",
      primaryAction: "Entrar a la tienda",
      secondaryAction: "Leer el journal",
      currentDirectionLabel: "Dirección actual",
      futureDomainLabel: "Encaje con el dominio futuro",
      futureDomainTitle: "Mushroom.Pi",
      futureDomainDescription:
        "La identidad visual, la voz editorial y el flujo comercial se están moldeando para vivir de forma natural bajo tu dominio Pi.",
      storefrontLabel: "Vista previa de la tienda",
      storefrontTitle: "La arquitectura del producto ahora dirige la portada.",
      commerceLabel: "Panel de comercio Pi",
      commerceTitle:
        "Inicia sesión, verifica al usuario Pi y prueba el ciclo de pago.",
      commerceBody:
        "Este es el corazón funcional de la siguiente fase. El panel de abajo sigue el flujo oficial de Pi: autenticar en el cliente, verificar en la Platform API y luego aprobar y completar pagos desde rutas del servidor.",
      pillarsLabel: "Pilares de marca",
      pillarsTitle:
        "El modelo de negocio prioriza la tienda y usa el contenido como apoyo estratégico.",
      journalLabel: "Desde el journal",
      journalTitle:
        "El contenido evita que la tienda se sienta genérica.",
      stats: [
        { value: "80%", label: "experiencia centrada en tienda" },
        { value: "Test-Pi", label: "modo de checkout actual" },
        { value: "3 frentes", label: "tienda, blog y comercio Pi" },
      ],
    },
    shop: {
      heroEyebrow: "Tienda",
      heroTitle:
        "Mushroom.Pi se está diseñando para vender primero y explicar después.",
      heroLead:
        "Esta página expresa con claridad el modelo de negocio objetivo: productos de hongos curados, onboarding Pi-native y un checkout que puede evolucionar de Test-Pi a una operación completa.",
      infoCards: [
        {
          title: "Test-Pi primero",
          description:
            "Usa Pi Testnet como carril inicial mientras se afina la lógica de producto y la experiencia.",
        },
        {
          title: "Mezcla del catálogo",
          description:
            "Bienestar funcional, productos culinarios y lógica de bundles encajan de forma natural aquí.",
        },
        {
          title: "Identidad Pi",
          description:
            "El login y el pago se tratan como primitivas nativas del negocio, no como widgets añadidos.",
        },
      ],
    },
    blog: {
      heroEyebrow: "Capa editorial",
      heroTitle:
        "El blog hace que Mushroom.Pi inspire más confianza, profundidad y regreso.",
      heroLead:
        "La tienda puede cargar la mayor parte del negocio, pero el journal evita que la marca se sienta como una simple estantería de suplementos. Convierte productos, rutinas y decisiones de comercio Pi en una visión definida.",
      articleSidebarLabel: "De editorial a comercio",
      articleSidebarText:
        "Mushroom.Pi trata el contenido como un sistema de apoyo para la tienda, no como una rama separada.",
      articleSidebarCta: "Explorar la tienda",
      relatedProductsLabel: "Productos relacionados",
    },
    piLab: {
      heroEyebrow: "Pi lab",
      heroTitle:
        "Esta es la superficie operativa para Pi Browser, Pi Sandbox y checkout Test-Pi.",
      heroLead:
        "El sitio ya incluye autenticación frontend, verificación server-side con `/me` y endpoints de aprobación y finalización de pagos. La pieza que falta para probar en vivo es la Server API Key real del Pi Developer Portal.",
      repoStatusTitle: "Estado actual del repositorio",
      setupTitle: "Checklist de configuración",
      serverKeyConfigured: "configurada",
      serverKeyPending: "aún no configurada",
      repoStatusBody:
        "El modo sandbox viene de `NEXT_PUBLIC_PI_SANDBOX`, mientras que la red real debe elegirse en el Pi Developer Portal al crear el proyecto Mushroom.Pi.",
      envTitle: "Variables de entorno",
      envBody:
        "Si quieres probar sandbox local en escritorio, establece `NEXT_PUBLIC_PI_SANDBOX=true` en tu entorno local y ejecuta la app mediante el flujo de Pi Sandbox.",
      nextTitle: "Siguiente paso",
      nextPrimary: "Probar la tienda",
      nextSecondary: "Revisar la capa editorial",
    },
    piPanel: {
      title: "Pi Commerce Lab",
      description:
        "Este panel ya está cableado para login con Pi, verificación vía `/me` y callbacks de aprobación/finalización de Test-Pi. Es el puente comercial de Mushroom.Pi.",
      connectReady: "Entrar con Pi",
      connectBusy: "Conectando...",
      hint:
        "Los diálogos de login y pago de Pi están pensados para Pi Browser o Pi Sandbox. En un navegador normal, el SDK puede cargar pero el flujo nativo puede no estar disponible.",
      verifiedViewerLabel: "Pioneer verificado",
      grantedScopesLabel: "Permisos otorgados",
      unknownScopes: "desconocido",
      testAmountLabel: "Monto Test-Pi",
      payAction: "Pagar con Pi Testnet",
      processing: "Procesando...",
      recentFlowTitle: "Eventos recientes del flujo",
      initialTimeline:
        "El panel Pi SDK se ha cargado. Abre esta página en Pi Browser o Pi Sandbox para probar inicio de sesión y checkout nativos.",
      sandboxEnabled: "Sandbox activado",
      browserRuntime: "Runtime del navegador",
      serverConfigured: "Clave de servidor configurada",
      serverPending: "Clave de servidor pendiente",
      sdkUnavailable: "Pi SDK no está disponible en esta sesión del navegador.",
      sdkNotReady:
        "Pi SDK aún no está listo. Abre la app en Pi Browser o espera a que termine de cargar el script.",
      authRequired:
        "Autentícate con tu cuenta Pi antes de iniciar un pago Test-Pi.",
      missingServerKey:
        "PI_API_KEY aún no está configurada en el servidor, así que la aprobación del pago no puede continuar.",
      authSuccessPrefix: "Conectado como",
      authFailed: "La autenticación con Pi falló.",
      incompleteFound:
        "Se detectó un pago incompleto. Intentando reconciliarlo en el servidor.",
      incompleteSent:
        "El pago incompleto se envió al servidor para su tratamiento.",
      incompleteFailed: "No se pudo reconciliar el pago incompleto.",
      approvalReady: "El pago está listo para aprobación del servidor.",
      approvalDone: "El backend aprobó el pago.",
      approvalFailed: "Falló la aprobación del lado del servidor.",
      completionReady:
        "Se recibió la transacción en blockchain. Completando en el backend.",
      completionDone: "El pago se completó en el backend.",
      completionFailed: "Falló la finalización del lado del servidor.",
      cancelled: "El pago fue cancelado antes de completarse.",
      cancelledTimeline: "El pago fue cancelado por el usuario o por el SDK.",
      paymentError: "Error de pago",
      completionSuccessSuffix:
        "alcanzó correctamente la fase de server-completion. Este es el flujo base de pagos Pi que luego conectarás con la operación real.",
    },
    brandPillars: [
      {
        title: "Comercio nativo de Pi",
        description:
          "Los compradores pueden iniciar sesión con Pi, explorar el catálogo y avanzar hacia pagos nativos sin salir del ecosistema Pi.",
      },
      {
        title: "Autoridad sobre hongos",
        description:
          "La capa editorial aporta autoridad a la marca y crea razones para volver más allá de una compra aislada.",
      },
      {
        title: "Estructura lista para vender",
        description:
          "El layout da prioridad a productos, bundles y conversión, sin perder espacio para la narrativa de marca.",
      },
    ],
    piSetupSteps: [
      "Registra Mushroom.Pi en el Pi Developer Portal desde Pi Browser.",
      "Selecciona primero Pi Testnet, porque la red del proyecto queda fija.",
      "Configura la URL pública de la app y la URL de desarrollo para tu servidor local.",
      "Crea o conecta el wallet de la app y copia la Server API Key a tus variables de entorno.",
      "Abre el sitio en Pi Browser o Pi Sandbox para probar de forma segura login y pagos.",
    ],
  },
  fr: {
    metadata: {
      rootTitle: "Mushroom.Pi",
      rootDescription:
        "Mushroom.Pi est une boutique et un site éditorial sur les champignons, pensé autour du commerce Pi Testnet.",
      shopTitle: "Boutique | Mushroom.Pi",
      shopDescription:
        "Découvrez la boutique Mushroom.Pi et testez le flux de paiement natif Pi.",
      blogTitle: "Blog | Mushroom.Pi",
      blogDescription:
        "Des contenus éditoriaux sur les champignons, la marque et le commerce natif Pi pour Mushroom.Pi.",
      piLabTitle: "Pi Lab | Mushroom.Pi",
      piLabDescription:
        "Notes de configuration pour Pi Browser, Pi Sandbox et les paiements Test-Pi dans Mushroom.Pi.",
      articleNotFoundTitle: "Article introuvable | Mushroom.Pi",
    },
    brandTagline: "Boutique et blog sur les champignons propulsés par Pi",
    navigation: [
      { href: "/shop", label: "Boutique" },
      { href: "/blog", label: "Blog" },
      { href: "/pi-lab", label: "Pi Lab" },
    ],
    headerAction: "Ouvrir la boutique",
    footerCopy:
      "Mushroom.Pi est en train de devenir une boutique de champignons pensée pour Pi, avec checkout testnet, connexion par compte Pi et un blog qui donne de la profondeur éditoriale aux produits, aux routines et à l'éducation autour des champignons.",
    footerMeta: [
      "Déploiement Pi Testnet",
      "Architecture orientée vente",
      "Contenu éditorial sur les champignons",
    ],
    footerGithub: "GitHub",
    footerLiveSite: "Site en ligne",
    home: {
      heroEyebrow: "Commerce de champignons natif Pi",
      heroTitle:
        "Mushroom.Pi se construit comme une vraie boutique, pas comme une simple landing page.",
      heroLead:
        "La direction de marque est désormais claire : un site sur les champignons centré sur la boutique, relié à la connexion Pi, aux paiements Test-Pi et à une couche éditoriale qui éduque, rassure et soutient la croissance à long terme.",
      primaryAction: "Entrer dans la boutique",
      secondaryAction: "Lire le journal",
      currentDirectionLabel: "Direction actuelle",
      futureDomainLabel: "Adéquation avec le domaine futur",
      futureDomainTitle: "Mushroom.Pi",
      futureDomainDescription:
        "L'identité du site, la voix éditoriale et le flux commercial sont façonnés pour vivre naturellement sous votre domaine Pi.",
      storefrontLabel: "Aperçu de la boutique",
      storefrontTitle:
        "L'architecture produit pilote désormais la page d'accueil.",
      commerceLabel: "Panneau commerce Pi",
      commerceTitle:
        "Connectez-vous, vérifiez l'utilisateur Pi et testez le cycle de paiement.",
      commerceBody:
        "C'est le cœur fonctionnel de la prochaine phase. Le panneau ci-dessous suit le flux officiel de Pi : authentification côté client, vérification via la Platform API, puis approbation et finalisation des paiements côté serveur.",
      pillarsLabel: "Piliers de marque",
      pillarsTitle:
        "Le modèle d'affaires donne la priorité à la boutique, tandis que le contenu joue un rôle stratégique de soutien.",
      journalLabel: "Depuis le journal",
      journalTitle:
        "Le contenu évite que la boutique paraisse générique.",
      stats: [
        { value: "80%", label: "expérience orientée boutique" },
        { value: "Test-Pi", label: "mode de checkout actuel" },
        { value: "3 axes", label: "boutique, blog et commerce Pi" },
      ],
    },
    shop: {
      heroEyebrow: "Boutique",
      heroTitle:
        "Mushroom.Pi est conçu pour vendre d'abord et expliquer ensuite.",
      heroLead:
        "Cette page exprime le plus clairement le modèle visé : des produits de champignons sélectionnés, un onboarding natif Pi et un checkout capable d'évoluer de Test-Pi vers une vraie exploitation.",
      infoCards: [
        {
          title: "Test-Pi d'abord",
          description:
            "Utilisez Pi Testnet comme voie d'exploitation initiale pendant que la logique produit et l'UX se raffinent.",
        },
        {
          title: "Structure du catalogue",
          description:
            "Bien-être fonctionnel, produits culinaires et logique de bundle trouvent naturellement leur place ici.",
        },
        {
          title: "Identité Pi",
          description:
            "La connexion et le paiement sont traités comme des primitives métier natives, pas comme des widgets ajoutés.",
        },
      ],
    },
    blog: {
      heroEyebrow: "Couche éditoriale",
      heroTitle:
        "Le blog donne à Mushroom.Pi plus de confiance, plus de profondeur et plus de raisons de revenir.",
      heroLead:
        "La boutique peut porter l'essentiel du business, mais le journal évite à la marque de ressembler à une simple étagère de compléments. Il transforme les produits, les routines et les choix de commerce Pi en une vision claire.",
      articleSidebarLabel: "De l'éditorial au commerce",
      articleSidebarText:
        "Mushroom.Pi considère le contenu comme un système de soutien pour la boutique, et non comme une branche séparée.",
      articleSidebarCta: "Découvrir la boutique",
      relatedProductsLabel: "Produits liés",
    },
    piLab: {
      heroEyebrow: "Pi lab",
      heroTitle:
        "C'est la surface opérationnelle pour Pi Browser, Pi Sandbox et le checkout Test-Pi.",
      heroLead:
        "Le site inclut déjà un flux d'authentification frontend, une vérification server-side avec `/me`, ainsi que des endpoints d'approbation et de finalisation de paiement. La pièce manquante pour les tests réels reste la Server API Key du Pi Developer Portal.",
      repoStatusTitle: "État actuel du dépôt",
      setupTitle: "Checklist de configuration",
      serverKeyConfigured: "configurée",
      serverKeyPending: "pas encore configurée",
      repoStatusBody:
        "Le mode sandbox vient de `NEXT_PUBLIC_PI_SANDBOX`, tandis que le vrai réseau de l'app doit être choisi dans le Pi Developer Portal lors de la création du projet Mushroom.Pi.",
      envTitle: "Variables d'environnement",
      envBody:
        "Pour tester le sandbox en local sur desktop, définissez `NEXT_PUBLIC_PI_SANDBOX=true` dans votre environnement local et lancez l'app via le flux Pi Sandbox.",
      nextTitle: "Où continuer ensuite",
      nextPrimary: "Tester la boutique",
      nextSecondary: "Revoir la couche éditoriale",
    },
    piPanel: {
      title: "Pi Commerce Lab",
      description:
        "Ce panneau est câblé pour la connexion Pi, la vérification via `/me` et les callbacks d'approbation/finalisation Test-Pi. C'est le pont commercial de Mushroom.Pi.",
      connectReady: "Se connecter avec Pi",
      connectBusy: "Connexion...",
      hint:
        "Les boîtes de dialogue de connexion et de paiement Pi sont prévues pour Pi Browser ou Pi Sandbox. Sur un navigateur classique, le SDK peut charger mais le flux natif peut rester indisponible.",
      verifiedViewerLabel: "Pioneer vérifié",
      grantedScopesLabel: "Permissions accordées",
      unknownScopes: "inconnu",
      testAmountLabel: "Montant Test-Pi",
      payAction: "Payer avec Pi Testnet",
      processing: "Traitement...",
      recentFlowTitle: "Événements récents du flux",
      initialTimeline:
        "Le panneau Pi SDK est chargé. Ouvrez cette page dans Pi Browser ou Pi Sandbox pour tester la connexion et le checkout natifs.",
      sandboxEnabled: "Sandbox activé",
      browserRuntime: "Runtime navigateur",
      serverConfigured: "Clé serveur configurée",
      serverPending: "Clé serveur en attente",
      sdkUnavailable: "Le Pi SDK n'est pas disponible dans cette session navigateur.",
      sdkNotReady:
        "Le Pi SDK n'est pas encore prêt. Ouvrez l'app dans Pi Browser ou attendez la fin du chargement du script.",
      authRequired:
        "Connectez-vous avec votre compte Pi avant de lancer un paiement Test-Pi.",
      missingServerKey:
        "PI_API_KEY n'est pas encore configurée sur le serveur, donc l'approbation du paiement ne peut pas continuer.",
      authSuccessPrefix: "Connecté en tant que",
      authFailed: "L'authentification Pi a échoué.",
      incompleteFound:
        "Un paiement incomplet a été détecté. Tentative de réconciliation côté serveur.",
      incompleteSent:
        "Le paiement incomplet a été transmis au serveur.",
      incompleteFailed: "Impossible de réconcilier le paiement incomplet.",
      approvalReady: "Le paiement est prêt pour l'approbation serveur.",
      approvalDone: "Le backend a approuvé le paiement.",
      approvalFailed: "L'approbation côté serveur a échoué.",
      completionReady:
        "Transaction blockchain reçue. Finalisation côté backend.",
      completionDone: "Le paiement a été finalisé côté backend.",
      completionFailed: "La finalisation côté serveur a échoué.",
      cancelled: "Le paiement a été annulé avant sa finalisation.",
      cancelledTimeline: "Le paiement a été annulé par l'utilisateur ou par le SDK.",
      paymentError: "Erreur de paiement",
      completionSuccessSuffix:
        "a atteint avec succès la phase de server-completion. C'est le flux de paiement Pi de base que vous relierez ensuite à l'exploitation réelle.",
    },
    brandPillars: [
      {
        title: "Commerce natif Pi",
        description:
          "Les acheteurs peuvent se connecter avec Pi, parcourir le catalogue et progresser vers des paiements natifs sans quitter l'écosystème Pi.",
      },
      {
        title: "Autorité sur les champignons",
        description:
          "La couche éditoriale donne de l'autorité à la marque et crée d'autres raisons de revenir qu'un simple achat ponctuel.",
      },
      {
        title: "Structure prête à vendre",
        description:
          "La mise en page donne la priorité aux produits, bundles et flux de conversion, tout en laissant de la place au récit de marque.",
      },
    ],
    piSetupSteps: [
      "Enregistrez Mushroom.Pi dans le Pi Developer Portal depuis Pi Browser.",
      "Choisissez d'abord Pi Testnet, car le réseau du projet est ensuite figé.",
      "Définissez l'URL publique de l'app et l'URL de développement pour votre serveur local.",
      "Créez ou connectez le wallet de l'app puis copiez la Server API Key dans vos variables d'environnement.",
      "Ouvrez le site dans Pi Browser ou Pi Sandbox pour tester en sécurité la connexion et les paiements.",
    ],
  },
  zh: {
    metadata: {
      rootTitle: "Mushroom.Pi",
      rootDescription:
        "Mushroom.Pi 是一个以 Pi Testnet 商业流程为核心方向的蘑菇商店与内容网站。",
      shopTitle: "商店 | Mushroom.Pi",
      shopDescription:
        "浏览 Mushroom.Pi 商店，并测试 Pi 原生支付流程。",
      blogTitle: "博客 | Mushroom.Pi",
      blogDescription:
        "围绕蘑菇、品牌定位和 Pi 原生商业的 Mushroom.Pi 内容专栏。",
      piLabTitle: "Pi Lab | Mushroom.Pi",
      piLabDescription:
        "Mushroom.Pi 中关于 Pi Browser、Pi Sandbox 和 Test-Pi 支付的配置说明。",
      articleNotFoundTitle: "文章未找到 | Mushroom.Pi",
    },
    brandTagline: "由 Pi 驱动的蘑菇商店与博客",
    navigation: [
      { href: "/shop", label: "商店" },
      { href: "/blog", label: "博客" },
      { href: "/pi-lab", label: "Pi Lab" },
    ],
    headerAction: "进入商店",
    footerCopy:
      "Mushroom.Pi 正在被打造成一个 Pi 原生的蘑菇 storefront，包含 testnet checkout、Pi 账号登录，以及让品牌围绕产品、日常习惯和蘑菇知识更有深度的博客内容。",
    footerMeta: ["Pi Testnet 部署", "以销售为核心的架构", "蘑菇内容专栏"],
    footerGithub: "GitHub",
    footerLiveSite: "在线网站",
    home: {
      heroEyebrow: "Pi 原生蘑菇商业",
      heroTitle: "Mushroom.Pi 正在被构建成真正的商店，而不只是一个落地页。",
      heroLead:
        "品牌方向已经很明确：一个以 storefront 为核心的蘑菇网站，连接 Pi 登录、Test-Pi 支付，以及能教育用户、建立信任并支持长期增长的内容层。",
      primaryAction: "进入商店",
      secondaryAction: "阅读 journal",
      currentDirectionLabel: "当前方向",
      futureDomainLabel: "未来域名适配",
      futureDomainTitle: "Mushroom.Pi",
      futureDomainDescription:
        "网站识别、内容语气和商业流程正在被塑造，以便未来自然地落在你的 Pi 域名之下。",
      storefrontLabel: "商店预览",
      storefrontTitle: "产品结构现在已经开始主导首页。",
      commerceLabel: "Pi 商业面板",
      commerceTitle: "登录、验证 Pi 用户并测试支付生命周期。",
      commerceBody:
        "这是下一阶段的功能核心。下面的面板遵循 Pi 官方流程：前端认证，通过 Platform API 验证，然后在服务端路由里 approve 和 complete 支付。",
      pillarsLabel: "品牌支柱",
      pillarsTitle: "商业模型以商店优先，内容承担战略支持角色。",
      journalLabel: "来自 journal",
      journalTitle: "内容让商店不再显得普通和同质化。",
      stats: [
        { value: "80%", label: "以商店为核心的体验" },
        { value: "Test-Pi", label: "当前 checkout 模式" },
        { value: "3 条线", label: "商店、博客与 Pi commerce" },
      ],
    },
    shop: {
      heroEyebrow: "商店",
      heroTitle: "Mushroom.Pi 的设计方向是先卖，再解释。",
      heroLead:
        "这一页最清楚地呈现目标商业模型：精选蘑菇产品、Pi 原生 onboarding，以及未来可从 Test-Pi 演进到正式运营的 checkout 路径。",
      infoCards: [
        {
          title: "先用 Test-Pi",
          description:
            "在产品逻辑和 UX 继续打磨期间，把 Pi Testnet 作为当前的运行通道。",
        },
        {
          title: "目录结构",
          description:
            "功能性健康、食用蘑菇以及 bundle 逻辑都可以自然地放入这个结构中。",
        },
        {
          title: "Pi 身份",
          description:
            "登录与支付被当成业务原生能力，而不是后加的小组件。",
        },
      ],
    },
    blog: {
      heroEyebrow: "内容层",
      heroTitle: "博客让 Mushroom.Pi 更值得信任、更有深度，也更值得回访。",
      heroLead:
        "商店可以承担大部分业务，但 journal 才是避免品牌看起来像普通补剂货架的关键。它把产品、蘑菇习惯和 Pi 商业决策转化为明确的品牌观点。",
      articleSidebarLabel: "从内容到商业",
      articleSidebarText:
        "Mushroom.Pi 把内容看作 storefront 的支持系统，而不是一个分离的侧项目。",
      articleSidebarCta: "查看商店",
      relatedProductsLabel: "相关产品",
    },
    piLab: {
      heroEyebrow: "Pi lab",
      heroTitle:
        "这里是 Pi Browser、Pi Sandbox 和 Test-Pi checkout 的运行界面。",
      heroLead:
        "网站已经具备前端认证流程、通过 `/me` 的服务端验证，以及 payment approve/completion endpoints。想要真正进行在线测试，还差来自 Pi Developer Portal 的真实 Server API Key。",
      repoStatusTitle: "当前仓库状态",
      setupTitle: "配置清单",
      serverKeyConfigured: "已配置",
      serverKeyPending: "尚未配置",
      repoStatusBody:
        "sandbox 模式来自 `NEXT_PUBLIC_PI_SANDBOX`，而真正的 app network 需要在创建 Mushroom.Pi 项目时于 Pi Developer Portal 中选择。",
      envTitle: "环境变量",
      envBody:
        "如果你想在本地桌面测试 sandbox，请在本地环境中设置 `NEXT_PUBLIC_PI_SANDBOX=true`，并通过 Pi Sandbox 流程运行应用。",
      nextTitle: "下一步",
      nextPrimary: "测试 storefront",
      nextSecondary: "查看内容层",
    },
    piPanel: {
      title: "Pi Commerce Lab",
      description:
        "这个面板已经接入 Pi 登录、通过 `/me` 的用户验证，以及 Test-Pi 的 approve/completion 回调。它就是 Mushroom.Pi 的商业桥梁。",
      connectReady: "使用 Pi 登录",
      connectBusy: "连接中...",
      hint:
        "Pi 登录和支付弹窗应当在 Pi Browser 或 Pi Sandbox 中工作。在普通浏览器中，SDK 也许能加载，但原生流程仍可能不可用。",
      verifiedViewerLabel: "已验证 Pioneer",
      grantedScopesLabel: "已授予权限",
      unknownScopes: "未知",
      testAmountLabel: "Test-Pi 金额",
      payAction: "使用 Pi Testnet 支付",
      processing: "处理中...",
      recentFlowTitle: "最近流程事件",
      initialTimeline:
        "Pi SDK 面板已加载。请在 Pi Browser 或 Pi Sandbox 中打开此页面，以测试原生登录和 checkout。",
      sandboxEnabled: "已启用 Sandbox",
      browserRuntime: "浏览器运行时",
      serverConfigured: "服务端 key 已配置",
      serverPending: "服务端 key 待配置",
      sdkUnavailable: "当前浏览器会话中无法使用 Pi SDK。",
      sdkNotReady:
        "Pi SDK 还未就绪。请在 Pi Browser 中打开应用，或等待脚本加载完成。",
      authRequired: "开始 Test-Pi 支付前，请先登录你的 Pi 账号。",
      missingServerKey:
        "服务器尚未配置 PI_API_KEY，因此支付 approve 流程暂时无法继续。",
      authSuccessPrefix: "已连接为",
      authFailed: "Pi 身份验证失败。",
      incompleteFound: "检测到未完成支付，正在尝试在服务器端进行对账。",
      incompleteSent: "未完成支付已交给服务器处理。",
      incompleteFailed: "无法处理未完成支付。",
      approvalReady: "支付已准备好进入服务器 approval。",
      approvalDone: "支付已由后端批准。",
      approvalFailed: "服务器端 approval 失败。",
      completionReady: "已收到区块链交易，正在后端完成处理。",
      completionDone: "支付已在后端完成。",
      completionFailed: "服务器端 completion 失败。",
      cancelled: "支付在完成前已被取消。",
      cancelledTimeline: "支付被用户或 SDK 取消。",
      paymentError: "支付错误",
      completionSuccessSuffix:
        "已经成功走到 server-completion 阶段。这就是你之后连接真实履约流程时要依赖的核心 Pi 支付链路。",
    },
    brandPillars: [
      {
        title: "Pi 原生商业",
        description:
          "用户可以使用 Pi 登录、浏览目录，并逐步走向原生 Pi 支付，而无需离开 Pi 生态。",
      },
      {
        title: "蘑菇专业度",
        description:
          "内容层为品牌建立专业可信度，也给用户带来除了单次购买之外再次回访的理由。",
      },
      {
        title: "适合商家的结构",
        description:
          "布局优先考虑产品、bundle 和转化路径，同时保留足够空间承载品牌叙事。",
      },
    ],
    piSetupSteps: [
      "从 Pi Browser 中的 Pi Developer Portal 注册 Mushroom.Pi。",
      "先选择 Pi Testnet，因为项目的 network 一旦确定就不能随意更改。",
      "把线上 URL 设置为你的站点，把 development URL 设置为本地服务器地址。",
      "创建或连接 app wallet，然后把 Server API Key 复制到环境变量中。",
      "在 Pi Browser 或 Pi Sandbox 中打开网站，安全测试登录和支付流程。",
    ],
  },
};

const productCatalog: ProductCatalogEntry[] = [
  {
    id: "lions-mane-focus-tonic",
    slug: "lions-mane-focus-tonic",
    pricePi: 0.75,
    accent: "linear-gradient(135deg, #f1c857, #915228)",
    imageUrl: "/images/mushroom-pi/product-lions-mane.webp",
    content: {
      en: {
        name: "Lion's Mane Focus Tonic",
        tagline: "Daily clarity blend for deep work and calm momentum.",
        description:
          "A hero product positioned for builders, writers, and Pi-native workers who want a functional mushroom ritual.",
        category: "Functional wellness",
        format: "30 sachets",
        badge: "Top seller",
      },
      vi: {
        name: "Lion's Mane Focus Tonic",
        tagline: "Công thức dùng hằng ngày cho sự tập trung và nhịp làm việc ổn định.",
        description:
          "Sản phẩm chủ lực dành cho builder, người viết và người làm việc trong hệ Pi muốn có một ritual nấm chức năng rõ ràng.",
        category: "Wellness chức năng",
        format: "30 gói",
        badge: "Bán chạy",
      },
      es: {
        name: "Lion's Mane Focus Tonic",
        tagline: "Mezcla diaria para claridad mental y trabajo profundo.",
        description:
          "Producto héroe para builders, escritores y usuarios nativos de Pi que buscan un ritual funcional con hongos.",
        category: "Bienestar funcional",
        format: "30 sobres",
        badge: "Más vendido",
      },
      fr: {
        name: "Lion's Mane Focus Tonic",
        tagline: "Mélange quotidien pour la clarté mentale et l'élan calme.",
        description:
          "Produit héros pour builders, auteurs et travailleurs natifs Pi qui veulent un rituel fonctionnel autour des champignons.",
        category: "Bien-être fonctionnel",
        format: "30 sachets",
        badge: "Meilleure vente",
      },
      zh: {
        name: "Lion's Mane Focus Tonic",
        tagline: "适合深度工作与稳定节奏的日常专注配方。",
        description:
          "面向 builder、写作者和 Pi 原生工作者的主力产品，强调可持续的功能性蘑菇仪式感。",
        category: "功能性健康",
        format: "30 袋",
        badge: "热销款",
      },
    },
  },
  {
    id: "reishi-night-drops",
    slug: "reishi-night-drops",
    pricePi: 0.58,
    accent: "linear-gradient(135deg, #6d3b2a, #c38d58)",
    imageUrl: "/images/mushroom-pi/product-reishi.webp",
    content: {
      en: {
        name: "Reishi Night Drops",
        tagline: "Evening reset formula with a slow, earthy profile.",
        description:
          "Designed as a calmer second product line for bundles, subscriptions, and bedtime routines.",
        category: "Wind-down support",
        format: "50 ml tincture",
        badge: "Bundle pick",
      },
      vi: {
        name: "Reishi Night Drops",
        tagline: "Công thức dùng buổi tối với cảm giác chậm, ấm và dịu hơn.",
        description:
          "Dòng sản phẩm thứ hai theo hướng thư giãn hơn, phù hợp cho bundle, subscription và routine trước khi ngủ.",
        category: "Hỗ trợ thư giãn",
        format: "Tincture 50 ml",
        badge: "Hợp với bundle",
      },
      es: {
        name: "Reishi Night Drops",
        tagline: "Fórmula nocturna con un perfil lento y terroso.",
        description:
          "Diseñada como una segunda línea más calmada para bundles, suscripciones y rutinas de noche.",
        category: "Apoyo para desconectar",
        format: "Tintura 50 ml",
        badge: "Ideal en bundle",
      },
      fr: {
        name: "Reishi Night Drops",
        tagline: "Formule du soir avec un profil lent et terreux.",
        description:
          "Pensée comme une seconde ligne plus apaisante pour bundles, abonnements et routines du coucher.",
        category: "Soutien détente",
        format: "Teinture 50 ml",
        badge: "Parfait en bundle",
      },
      zh: {
        name: "Reishi Night Drops",
        tagline: "更适合夜间放松的慢节奏、土质感配方。",
        description:
          "作为更平静的第二产品线，适合 bundle、订阅和睡前使用习惯。",
        category: "放松支持",
        format: "50 ml 酊剂",
        badge: "组合推荐",
      },
    },
  },
  {
    id: "cordyceps-trail-pack",
    slug: "cordyceps-trail-pack",
    pricePi: 0.49,
    accent: "linear-gradient(135deg, #cc7b33, #4a6d48)",
    imageUrl: "/images/mushroom-pi/product-cordyceps.webp",
    content: {
      en: {
        name: "Cordyceps Trail Pack",
        tagline: "Portable boost mix for movement days and lighter stamina.",
        description:
          "A more active, grab-and-go offer that makes the storefront feel broader than a single wellness SKU.",
        category: "Active energy",
        format: "12 stick packs",
        badge: "Starter friendly",
      },
      vi: {
        name: "Cordyceps Trail Pack",
        tagline: "Gói tăng lực tiện mang theo cho ngày vận động và sức bền nhẹ.",
        description:
          "Một offer năng động hơn, dễ mang theo và giúp storefront có cảm giác rộng hơn một sản phẩm wellness đơn lẻ.",
        category: "Năng lượng vận động",
        format: "12 stick pack",
        badge: "Dễ bắt đầu",
      },
      es: {
        name: "Cordyceps Trail Pack",
        tagline: "Mezcla portátil para días de movimiento y energía ligera.",
        description:
          "Una oferta más activa y lista para llevar que amplía la sensación de catálogo más allá de un solo SKU wellness.",
        category: "Energía activa",
        format: "12 sticks",
        badge: "Ideal para empezar",
      },
      fr: {
        name: "Cordyceps Trail Pack",
        tagline: "Mélange portable pour les journées actives et l'endurance légère.",
        description:
          "Une offre plus dynamique, facile à emporter, qui élargit la perception du catalogue au-delà d'un seul SKU bien-être.",
        category: "Énergie active",
        format: "12 sticks",
        badge: "Facile pour débuter",
      },
      zh: {
        name: "Cordyceps Trail Pack",
        tagline: "适合外出与运动日的便携轻能量配方。",
        description:
          "这是更偏活动场景、拿了就走的产品，让 storefront 看起来不只是一种 wellness 单品。",
        category: "活力能量",
        format: "12 条装",
        badge: "入门友好",
      },
    },
  },
  {
    id: "shiitake-kitchen-box",
    slug: "shiitake-kitchen-box",
    pricePi: 0.67,
    accent: "linear-gradient(135deg, #ad6d3f, #d9b37a)",
    imageUrl: "/images/mushroom-pi/product-shiitake.webp",
    content: {
      en: {
        name: "Shiitake Kitchen Box",
        tagline: "A culinary set for cooks who want flavor, texture, and story.",
        description:
          "This anchors the edible side of the catalog and broadens the brand beyond supplements alone.",
        category: "Culinary mushrooms",
        format: "Recipe box",
        badge: "Seasonal edit",
      },
      vi: {
        name: "Shiitake Kitchen Box",
        tagline: "Set ẩm thực cho người nấu ăn muốn có vị, chất và câu chuyện.",
        description:
          "Sản phẩm này neo phần nấm ăn được trong catalog và giúp thương hiệu mở rộng vượt khỏi nhóm supplement.",
        category: "Nấm ẩm thực",
        format: "Hộp công thức",
        badge: "Theo mùa",
      },
      es: {
        name: "Shiitake Kitchen Box",
        tagline: "Set culinario para quienes buscan sabor, textura y relato.",
        description:
          "Ancla la parte comestible del catálogo y amplía la marca más allá de los suplementos.",
        category: "Hongos culinarios",
        format: "Caja receta",
        badge: "Selección de temporada",
      },
      fr: {
        name: "Shiitake Kitchen Box",
        tagline: "Coffret culinaire pour ceux qui veulent saveur, texture et histoire.",
        description:
          "Ancre la dimension comestible du catalogue et élargit la marque au-delà des seuls compléments.",
        category: "Champignons culinaires",
        format: "Box recette",
        badge: "Édition saisonnière",
      },
      zh: {
        name: "Shiitake Kitchen Box",
        tagline: "为注重风味、口感与故事感的厨房用户准备的料理套装。",
        description:
          "它锚定了目录中“可食用蘑菇”的一面，让品牌不只停留在 supplement。",
        category: "料理蘑菇",
        format: "食谱礼盒",
        badge: "季节限定",
      },
    },
  },
];

const blogCatalog: BlogCatalogEntry[] = [
  {
    slug: "why-lions-mane-is-a-hero-product",
    content: {
      en: {
        slug: "why-lions-mane-is-a-hero-product",
        title: "Why Lion's Mane works as the hero product for Mushroom.Pi",
        excerpt:
          "A practical look at why focus-oriented mushrooms fit both e-commerce positioning and Pi-native utility branding.",
        category: "Brand strategy",
        publishedAt: "July 2026",
        readTime: "5 min read",
        coverNote: "Hero SKU strategy",
        body: [
          "Lion's Mane lives at the overlap of curiosity, utility, and repeat-purchase behavior. That makes it a strong anchor for a Pi-powered storefront because shoppers quickly understand what it is for and how it fits into a daily routine.",
          "For Mushroom.Pi, a hero SKU does more than drive revenue. It gives first-time Pi users a simpler entry point while they are still learning the checkout flow and deciding whether the brand feels trustworthy.",
          "From a content angle, Lion's Mane also gives the blog a clear spine: focus routines, maker workflows, dosage stories, and beginner education can all connect back to one product family.",
        ],
      },
      vi: {
        slug: "why-lions-mane-is-a-hero-product",
        title: "Vì sao Lion's Mane hợp để trở thành sản phẩm chủ lực của Mushroom.Pi",
        excerpt:
          "Một góc nhìn thực tế về việc nấm tập trung như Lion's Mane phù hợp cả cho định vị ecommerce lẫn utility theo hướng Pi-native.",
        category: "Chiến lược thương hiệu",
        publishedAt: "Tháng 7 năm 2026",
        readTime: "5 phút đọc",
        coverNote: "Chiến lược SKU chủ lực",
        body: [
          "Lion's Mane nằm đúng giao điểm giữa sự tò mò, tính hữu ích và hành vi mua lặp lại. Điều đó khiến nó trở thành một neo tốt cho storefront dùng Pi vì người mua hiểu khá nhanh sản phẩm này dùng để làm gì và nó gắn vào thói quen hằng ngày như thế nào.",
          "Với Mushroom.Pi, một hero SKU không chỉ giúp tạo doanh thu. Nó còn cho người dùng Pi lần đầu một điểm vào đơn giản hơn trong lúc họ vẫn đang làm quen với flow checkout và đánh giá xem thương hiệu có đáng tin hay không.",
          "Về mặt content, Lion's Mane cũng tạo một xương sống rõ cho blog: routine tập trung, workflow của người làm sáng tạo, câu chuyện liều dùng và nội dung cho người mới đều có thể quy về cùng một nhóm sản phẩm.",
        ],
      },
      es: {
        slug: "why-lions-mane-is-a-hero-product",
        title: "Por qué Lion's Mane funciona como producto héroe para Mushroom.Pi",
        excerpt:
          "Una mirada práctica a por qué los hongos orientados al enfoque encajan tanto con el posicionamiento e-commerce como con la utilidad Pi-native.",
        category: "Estrategia de marca",
        publishedAt: "Julio 2026",
        readTime: "5 min",
        coverNote: "Estrategia de SKU héroe",
        body: [
          "Lion's Mane se sitúa en el cruce entre curiosidad, utilidad y compra repetida. Eso lo convierte en un ancla sólida para una tienda impulsada por Pi, porque el comprador entiende rápido para qué sirve y cómo encaja en una rutina diaria.",
          "En Mushroom.Pi, un hero SKU hace más que vender. También ofrece a los usuarios Pi que llegan por primera vez un punto de entrada más simple mientras aún están aprendiendo el flujo de checkout y evaluando la confianza de la marca.",
          "Desde la perspectiva editorial, Lion's Mane también da una columna vertebral al blog: rutinas de enfoque, workflows de creadores, historias de dosificación y educación básica pueden girar alrededor de una sola familia de producto.",
        ],
      },
      fr: {
        slug: "why-lions-mane-is-a-hero-product",
        title: "Pourquoi Lion's Mane fonctionne comme produit héros pour Mushroom.Pi",
        excerpt:
          "Une lecture concrète de la façon dont un champignon orienté focus sert à la fois le positionnement e-commerce et l'utilité Pi-native.",
        category: "Stratégie de marque",
        publishedAt: "Juillet 2026",
        readTime: "5 min de lecture",
        coverNote: "Stratégie SKU héros",
        body: [
          "Lion's Mane se situe à l'intersection de la curiosité, de l'utilité et du réachat. Cela en fait une excellente ancre pour une boutique propulsée par Pi, car l'acheteur comprend vite à quoi sert le produit et comment il s'intègre à une routine quotidienne.",
          "Pour Mushroom.Pi, un hero SKU fait plus que générer du chiffre d'affaires. Il donne aussi aux premiers utilisateurs Pi un point d'entrée plus simple pendant qu'ils découvrent encore le flux de checkout et la crédibilité de la marque.",
          "Côté éditorial, Lion's Mane offre également une vraie colonne vertébrale au blog : routines de concentration, workflows de créateurs, histoires de dosage et contenus pour débutants peuvent tous s'y raccrocher.",
        ],
      },
      zh: {
        slug: "why-lions-mane-is-a-hero-product",
        title: "为什么 Lion's Mane 适合作为 Mushroom.Pi 的主力产品",
        excerpt:
          "从实用角度看，专注型蘑菇为什么同时适合电商定位与 Pi 原生 utility 品牌。",
        category: "品牌策略",
        publishedAt: "2026年7月",
        readTime: "5 分钟阅读",
        coverNote: "主力 SKU 策略",
        body: [
          "Lion's Mane 正好位于“新鲜感、实际用途、可重复购买”三者的交叉点。这让它非常适合作为 Pi 驱动 storefront 的锚点，因为用户很快就能理解它的用途，以及它如何融入日常习惯。",
          "对 Mushroom.Pi 来说，主力 SKU 的作用不只是带来收入。它还为第一次使用 Pi 的用户提供了更简单的入口，让他们在学习 checkout 流程、判断品牌可信度时压力更小。",
          "从内容层来看，Lion's Mane 也为博客提供了一条清晰主线：专注习惯、创作者工作流、剂量故事以及新手教育，都可以围绕这一产品家族展开。",
        ],
      },
    },
  },
  {
    slug: "how-to-explain-test-pi-checkout-to-customers",
    content: {
      en: {
        slug: "how-to-explain-test-pi-checkout-to-customers",
        title: "How to explain Test-Pi checkout without confusing shoppers",
        excerpt:
          "If your storefront launches on testnet first, the interface needs to teach trust and expectation at the same time.",
        category: "Pi commerce",
        publishedAt: "July 2026",
        readTime: "4 min read",
        coverNote: "Testnet UX",
        body: [
          "A testnet-first launch is normal in the Pi ecosystem, but the site must communicate that status with absolute clarity. Users should know whether they are making a trial payment, whether products are mock or real, and what happens after the transaction.",
          "The best pattern is to keep the payment button real, the backend verification real, and the surrounding copy unmistakable. Labels like Test-Pi, Sandbox, or Trial checkout should sit close to the action, not hide in documentation.",
          "That clarity helps Mushroom.Pi feel professional even before the production commerce layer is fully live. A visible test stage is more credible than an unfinished experience that tries to look final.",
        ],
      },
      vi: {
        slug: "how-to-explain-test-pi-checkout-to-customers",
        title: "Cách giải thích checkout Test-Pi cho khách mà không gây rối",
        excerpt:
          "Nếu storefront của bạn ra mắt bằng testnet trước, giao diện phải vừa dạy sự kỳ vọng vừa tạo niềm tin.",
        category: "Pi commerce",
        publishedAt: "Tháng 7 năm 2026",
        readTime: "4 phút đọc",
        coverNote: "UX cho testnet",
        body: [
          "Việc ra mắt bằng testnet trước là điều bình thường trong hệ Pi, nhưng website phải truyền đạt trạng thái này thật rõ. Người dùng cần biết họ đang làm thanh toán thử, sản phẩm là mock hay thật, và điều gì xảy ra sau giao dịch.",
          "Mẫu tốt nhất là giữ nút thanh toán là thật, bước verify ở backend là thật, và phần copy xung quanh thì không mập mờ. Những nhãn như Test-Pi, Sandbox hay Trial checkout phải nằm gần ngay hành động, không nên giấu trong tài liệu.",
          "Sự rõ ràng đó giúp Mushroom.Pi trông chuyên nghiệp ngay cả khi lớp commerce production vẫn chưa hoàn toàn live. Một giai đoạn test hiện diện rõ ràng luôn đáng tin hơn một trải nghiệm dở dang nhưng cố tỏ ra đã hoàn thiện.",
        ],
      },
      es: {
        slug: "how-to-explain-test-pi-checkout-to-customers",
        title: "Cómo explicar el checkout Test-Pi sin confundir al comprador",
        excerpt:
          "Si tu tienda sale primero en testnet, la interfaz debe enseñar confianza y expectativa al mismo tiempo.",
        category: "Comercio Pi",
        publishedAt: "Julio 2026",
        readTime: "4 min",
        coverNote: "UX para testnet",
        body: [
          "Lanzar primero sobre testnet es normal dentro del ecosistema Pi, pero el sitio debe comunicar ese estado con total claridad. El usuario necesita saber si el pago es de prueba, si el producto es real o simulado y qué ocurre después de la transacción.",
          "El mejor patrón es mantener real el botón de pago, real la verificación backend y completamente clara la redacción que lo rodea. Etiquetas como Test-Pi, Sandbox o checkout de prueba deben quedar muy cerca de la acción.",
          "Esa claridad ayuda a que Mushroom.Pi se vea profesional incluso antes de que la capa comercial definitiva esté en producción. Una fase de pruebas visible resulta más creíble que una experiencia inacabada que intenta parecer final.",
        ],
      },
      fr: {
        slug: "how-to-explain-test-pi-checkout-to-customers",
        title: "Comment expliquer le checkout Test-Pi sans créer de confusion",
        excerpt:
          "Si votre boutique se lance d'abord sur testnet, l'interface doit installer la confiance et cadrer les attentes en même temps.",
        category: "Commerce Pi",
        publishedAt: "Juillet 2026",
        readTime: "4 min de lecture",
        coverNote: "UX testnet",
        body: [
          "Un lancement d'abord sur testnet est normal dans l'écosystème Pi, mais le site doit l'exprimer avec une clarté absolue. L'utilisateur doit savoir s'il s'agit d'un paiement de test, si les produits sont réels ou simulés, et ce qu'il se passe après la transaction.",
          "Le meilleur schéma consiste à garder un bouton de paiement réel, une vérification backend réelle, et un texte parfaitement explicite autour de l'action. Des libellés comme Test-Pi, Sandbox ou checkout d'essai doivent être visibles près du bouton.",
          "Cette clarté aide Mushroom.Pi à paraître professionnel avant même que la couche commerciale finale ne soit totalement en ligne. Une phase de test assumée est plus crédible qu'une expérience inachevée qui cherche à paraître terminée.",
        ],
      },
      zh: {
        slug: "how-to-explain-test-pi-checkout-to-customers",
        title: "如何向用户解释 Test-Pi checkout 而不造成困惑",
        excerpt:
          "如果你的 storefront 先以 testnet 形式上线，界面就必须同时建立信任与预期。",
        category: "Pi 商业",
        publishedAt: "2026年7月",
        readTime: "4 分钟阅读",
        coverNote: "Testnet 体验设计",
        body: [
          "在 Pi 生态中先用 testnet 上线是很正常的，但网站必须把这一状态说明得非常清楚。用户需要知道自己是在进行测试支付、商品是模拟还是真实，以及交易之后会发生什么。",
          "最佳做法是：支付按钮是真实的、后端验证是真实的，而围绕它的文案则必须毫不含糊。像 Test-Pi、Sandbox 或 Trial checkout 这样的标签应该放在用户操作附近，而不是藏在说明文档里。",
          "这种清晰度会让 Mushroom.Pi 即使在正式商业层还未完全上线时也显得专业。明确展示测试阶段，往往比一个尚未完成却装作成熟的体验更可信。",
        ],
      },
    },
  },
  {
    slug: "building-a-mushroom-brand-with-editorial-depth",
    content: {
      en: {
        slug: "building-a-mushroom-brand-with-editorial-depth",
        title: "Building a mushroom brand with editorial depth, not just product cards",
        excerpt:
          "Why the blog matters even if the storefront will eventually do most of the business work.",
        category: "Content",
        publishedAt: "July 2026",
        readTime: "6 min read",
        coverNote: "Editorial moat",
        body: [
          "An 80 percent storefront can still earn trust through writing. The blog is where Mushroom.Pi can slow down, teach, and turn transactions into a broader brand relationship.",
          "Articles about sourcing, routines, preparation, kitchen use, and common misconceptions all help the store feel less generic. They also create more reasons for visitors to return when they are not yet ready to buy.",
          "In practice, that means the site should not separate store and content too aggressively. Product detail and editorial narrative should keep reinforcing each other throughout the experience.",
        ],
      },
      vi: {
        slug: "building-a-mushroom-brand-with-editorial-depth",
        title: "Xây thương hiệu về nấm bằng chiều sâu nội dung, không chỉ bằng product card",
        excerpt:
          "Vì sao blog vẫn quan trọng ngay cả khi storefront sau này sẽ gánh phần lớn công việc kinh doanh.",
        category: "Nội dung",
        publishedAt: "Tháng 7 năm 2026",
        readTime: "6 phút đọc",
        coverNote: "Hào lũy editorial",
        body: [
          "Một website mà 80 phần trăm thiên về storefront vẫn có thể tạo niềm tin bằng chữ viết. Blog là nơi Mushroom.Pi có thể đi chậm hơn, giảng giải nhiều hơn và biến giao dịch thành một quan hệ thương hiệu rộng hơn.",
          "Các bài về nguồn nguyên liệu, thói quen dùng nấm, cách chuẩn bị, cách dùng trong bếp và những hiểu lầm phổ biến đều giúp cửa hàng bớt cảm giác đại trà. Chúng cũng tạo lý do để khách quay lại khi họ chưa sẵn sàng mua ngay.",
          "Trong thực tế, điều đó có nghĩa là website không nên tách quá mạnh giữa store và content. Chi tiết sản phẩm và narrative editorial nên liên tục đỡ lẫn nhau trong suốt trải nghiệm.",
        ],
      },
      es: {
        slug: "building-a-mushroom-brand-with-editorial-depth",
        title: "Construir una marca de hongos con profundidad editorial, no solo con tarjetas de producto",
        excerpt:
          "Por qué el blog importa incluso si la tienda acabará haciendo la mayor parte del trabajo comercial.",
        category: "Contenido",
        publishedAt: "Julio 2026",
        readTime: "6 min",
        coverNote: "Foso editorial",
        body: [
          "Un sitio con 80 por ciento de foco en tienda todavía puede ganarse la confianza a través de la escritura. El blog es donde Mushroom.Pi puede bajar el ritmo, enseñar más y convertir transacciones en una relación de marca más amplia.",
          "Textos sobre origen, rutinas, preparación, uso en cocina y errores comunes ayudan a que la tienda se sienta menos genérica. También generan razones adicionales para volver cuando el visitante aún no está listo para comprar.",
          "En la práctica, eso significa que el sitio no debe separar tienda y contenido de forma demasiado agresiva. El detalle de producto y la narrativa editorial deben reforzarse mutuamente durante toda la experiencia.",
        ],
      },
      fr: {
        slug: "building-a-mushroom-brand-with-editorial-depth",
        title: "Construire une marque de champignons avec une vraie profondeur éditoriale",
        excerpt:
          "Pourquoi le blog compte même si la boutique fera à terme l'essentiel du travail commercial.",
        category: "Contenu",
        publishedAt: "Juillet 2026",
        readTime: "6 min de lecture",
        coverNote: "Avantage éditorial",
        body: [
          "Un site à 80 pour cent orienté boutique peut quand même gagner la confiance par l'écriture. Le blog est l'endroit où Mushroom.Pi peut ralentir, expliquer davantage et transformer les transactions en relation de marque plus large.",
          "Des articles sur l'origine, les routines, la préparation, les usages en cuisine et les idées reçues rendent la boutique moins générique. Ils donnent aussi davantage de raisons de revenir quand l'achat n'est pas encore décidé.",
          "En pratique, cela veut dire que le site ne doit pas séparer trop fortement la boutique du contenu. Le détail produit et le récit éditorial doivent se renforcer mutuellement tout au long de l'expérience.",
        ],
      },
      zh: {
        slug: "building-a-mushroom-brand-with-editorial-depth",
        title: "用内容深度打造蘑菇品牌，而不只是堆产品卡片",
        excerpt:
          "即使未来主要业务靠 storefront 驱动，博客依然为什么重要。",
        category: "内容",
        publishedAt: "2026年7月",
        readTime: "6 分钟阅读",
        coverNote: "内容护城河",
        body: [
          "一个 80% 以商店为核心的网站，依然可以通过写作建立信任。博客是 Mushroom.Pi 放慢节奏、讲清价值，并把交易关系升级为品牌关系的地方。",
          "关于来源、使用习惯、准备方式、厨房场景和常见误解的文章，都能让商店不再显得像一个普通货架。它们也会在用户暂时不打算购买时，提供回访的理由。",
          "在实践中，这意味着网站不应该把商店与内容分得太开。产品细节与编辑叙事应该在整个体验里不断互相强化。",
        ],
      },
    },
  },
  {
    slug: "what-to-prepare-before-mainnet",
    content: {
      en: {
        slug: "what-to-prepare-before-mainnet",
        title: "What to prepare before moving Mushroom.Pi beyond testnet",
        excerpt:
          "A checklist for the day your Pi experience stops being a prototype and starts acting like a real business surface.",
        category: "Operations",
        publishedAt: "July 2026",
        readTime: "7 min read",
        coverNote: "Launch readiness",
        body: [
          "Before you expand beyond test flows, the site needs clean product data, a reliable order record, and a backend history for every Pi payment state. Approval and completion events should never be treated as optional details.",
          "Operationally, you also need clearer refund, support, and fulfillment logic. Even in a Pi-native environment, user confidence still depends on familiar commerce basics.",
          "From the brand side, the domain, logo system, and content voice should already feel settled. When real traffic grows, Mushroom.Pi should present as a deliberate brand surface rather than a technical experiment.",
        ],
      },
      vi: {
        slug: "what-to-prepare-before-mainnet",
        title: "Cần chuẩn bị gì trước khi đưa Mushroom.Pi vượt khỏi testnet",
        excerpt:
          "Một checklist cho ngày trải nghiệm Pi của bạn ngừng là prototype và bắt đầu hành xử như một bề mặt kinh doanh thật.",
        category: "Vận hành",
        publishedAt: "Tháng 7 năm 2026",
        readTime: "7 phút đọc",
        coverNote: "Sẵn sàng ra mắt",
        body: [
          "Trước khi vượt ra ngoài flow test, website cần dữ liệu sản phẩm sạch, hồ sơ đơn hàng đáng tin và lịch sử backend cho từng trạng thái payment của Pi. Approval và completion không bao giờ nên bị xem như chi tiết phụ.",
          "Về vận hành, bạn cũng cần logic hoàn tiền, hỗ trợ và fulfillment rõ ràng hơn. Ngay cả trong môi trường Pi-native, niềm tin của người dùng vẫn phụ thuộc vào những nền tảng thương mại rất quen thuộc.",
          "Ở góc độ thương hiệu, domain, hệ logo và giọng điệu nội dung nên đủ ổn định từ trước. Khi lưu lượng thật tăng lên, Mushroom.Pi cần xuất hiện như một bề mặt thương hiệu có chủ đích chứ không phải một thử nghiệm kỹ thuật.",
        ],
      },
      es: {
        slug: "what-to-prepare-before-mainnet",
        title: "Qué preparar antes de llevar Mushroom.Pi más allá del testnet",
        excerpt:
          "Una lista de control para el día en que tu experiencia Pi deje de ser prototipo y empiece a comportarse como una superficie de negocio real.",
        category: "Operaciones",
        publishedAt: "Julio 2026",
        readTime: "7 min",
        coverNote: "Preparación de lanzamiento",
        body: [
          "Antes de salir de los flujos de prueba, el sitio necesita datos de producto limpios, un registro de pedidos fiable y un historial backend para cada estado de pago Pi. Los eventos de aprobación y finalización nunca deben tratarse como detalles opcionales.",
          "A nivel operativo, también hacen falta políticas más claras de reembolso, soporte y fulfillment. Incluso en un entorno Pi-native, la confianza del usuario sigue dependiendo de fundamentos comerciales muy conocidos.",
          "Desde la marca, el dominio, el sistema de logotipo y la voz editorial deberían sentirse ya consolidados. Cuando crezca el tráfico real, Mushroom.Pi debe presentarse como una marca intencional y no como un experimento técnico.",
        ],
      },
      fr: {
        slug: "what-to-prepare-before-mainnet",
        title: "Que préparer avant de faire évoluer Mushroom.Pi au-delà du testnet",
        excerpt:
          "Une checklist pour le jour où votre expérience Pi cesse d'être un prototype et commence à fonctionner comme une vraie surface business.",
        category: "Opérations",
        publishedAt: "Juillet 2026",
        readTime: "7 min de lecture",
        coverNote: "Préparation au lancement",
        body: [
          "Avant de dépasser les flux de test, le site a besoin de données produit propres, d'un historique de commandes fiable et d'un suivi backend pour chaque état de paiement Pi. Les événements d'approbation et de finalisation ne doivent jamais être vus comme facultatifs.",
          "Sur le plan opérationnel, il faut aussi une logique plus claire pour les remboursements, le support et le fulfillment. Même dans un environnement Pi-native, la confiance reste liée aux bases classiques du commerce.",
          "Côté marque, le domaine, le système de logo et la voix éditoriale devraient déjà être stabilisés. Quand le trafic réel augmentera, Mushroom.Pi devra se présenter comme une surface de marque assumée, et non comme une expérience technique.",
        ],
      },
      zh: {
        slug: "what-to-prepare-before-mainnet",
        title: "在让 Mushroom.Pi 走出 testnet 之前，需要准备什么",
        excerpt:
          "当你的 Pi 体验不再只是原型，而开始像真实商业表面那样运作时，一份必须完成的清单。",
        category: "运营",
        publishedAt: "2026年7月",
        readTime: "7 分钟阅读",
        coverNote: "上线准备",
        body: [
          "在超出测试流程之前，网站需要干净的产品数据、可靠的订单记录，以及针对每一种 Pi 支付状态的后端追踪。approve 与 complete 事件绝不能被当成可有可无的细节。",
          "在运营层面，你还需要更清晰的退款、支持与履约逻辑。即使在 Pi 原生环境中，用户信任依然建立在熟悉的商业基本功之上。",
          "从品牌角度看，域名、logo 体系和内容语气也应该足够稳定。当真实流量开始增长时，Mushroom.Pi 需要呈现为一个有明确意图的品牌表面，而不是一次技术实验。",
        ],
      },
    },
  },
];

export function getSiteCopy(locale: SiteLocale) {
  return copy[locale];
}

export function getNavigationLinks(locale: SiteLocale) {
  return copy[locale].navigation.filter((link) => link.href !== "/pi-lab");
}

export function getProducts(locale: SiteLocale): Product[] {
  return productCatalog.map((entry) => ({
    id: entry.id,
    slug: entry.slug,
    pricePi: entry.pricePi,
    accent: entry.accent,
    ...entry.content[locale],
  }));
}

export function getBlogPosts(locale: SiteLocale): BlogPost[] {
  return blogCatalog
    .filter((entry) => !hiddenPublicBlogSlugs.has(entry.slug))
    .map((entry) => entry.content[locale]);
}

export function getBlogPostBySlug(slug: string, locale: SiteLocale) {
  if (hiddenPublicBlogSlugs.has(slug)) {
    return undefined;
  }

  return blogCatalog.find((entry) => entry.slug === slug)?.content[locale];
}
