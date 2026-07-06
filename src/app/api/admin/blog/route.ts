import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import type { StorefrontBlogPostInput } from "@/lib/storefront-blog-types";
import {
  deleteStorefrontBlogPost,
  listAdminBlogPosts,
  saveStorefrontBlogPost,
  STOREFRONT_BLOG_POSTS_TAG,
} from "@/lib/storefront-blog";
import { getStorefrontAdminContext } from "@/lib/storefront-admin-server";

export const preferredRegion = "sin1";

function forbiddenResponse() {
  return NextResponse.json(
    {
      error: "Admin session is required to manage blog posts.",
    },
    { status: 403 },
  );
}

function refreshBlogPages(slug?: string) {
  revalidateTag(STOREFRONT_BLOG_POSTS_TAG, "max");
  revalidatePath("/blog");
  revalidatePath("/admin");

  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
}

export async function GET() {
  const { access } = await getStorefrontAdminContext();

  if (!access.canAccessAdmin) {
    return forbiddenResponse();
  }

  return NextResponse.json({
    items: access.canManageProducts ? await listAdminBlogPosts() : [],
  });
}

export async function POST(request: Request) {
  const { access } = await getStorefrontAdminContext();

  if (!access.canManageProducts) {
    return forbiddenResponse();
  }

  try {
    const body = (await request.json()) as StorefrontBlogPostInput;
    const item = await saveStorefrontBlogPost(body);

    refreshBlogPages(item.slug);

    return NextResponse.json({
      item,
      items: await listAdminBlogPosts(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to save blog post right now.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const { access } = await getStorefrontAdminContext();

  if (!access.canManageProducts) {
    return forbiddenResponse();
  }

  try {
    const body = (await request.json()) as { id?: string; slug?: string };

    if (!body.id) {
      return NextResponse.json(
        {
          error: "Blog post id is required.",
        },
        { status: 400 },
      );
    }

    await deleteStorefrontBlogPost(body.id);
    refreshBlogPages(body.slug);

    return NextResponse.json({
      items: await listAdminBlogPosts(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete blog post right now.",
      },
      { status: 500 },
    );
  }
}
