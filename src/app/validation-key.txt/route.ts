const validationKey =
  "8563f1295ddeda7cd9c368b66ca849860bcf294be3ed32d8a7fcd827128e3fadf0bd9788c81f66558c23fc362a260a6aaec0e3bb996a09edc645e4abd54d706b";

export function GET() {
  return new Response(validationKey, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
