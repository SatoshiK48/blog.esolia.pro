import lumeCMS from "lume/cms/mod.ts";
import { Field } from "lume/cms/types.ts";

const cms = lumeCMS({
  site: {
    name: "eSolia Blog",
    description: "Edit the content of the eSolia blog site.",
    url: "https://blog.esolia.pro",
    body: `
    <p>This is the CMS for eSolia's bilingual blog site, with posts in Japanese and English.</p>
    `,
  },
});

// Enable basicauth
cms.auth({
  eSolia: "GoodStories!",
});

// Configure upload
cms.upload("uploads: Uploaded files", "src:uploads");

// Configure git
cms.git();

const url: Field = {
  name: "url",
  type: "text",
  description: "The public URL of the page. Leave empty to use the file path.",
  transform(value) {
    if (!value) {
      return;
    }

    if (!value.endsWith("/")) {
      value += "/";
    }
    if (!value.startsWith("/")) {
      value = "/" + value;
    }

    return value;
  },
};

cms.document(
  "settings: Global settings for the site",
  "src:_data.yml",
  [
    {
      name: "lang",
      type: "select",
      label: "Language",
      description: "コンテンツの言語を選択する<br>Select the language of the page content",
      attributes: {
        required: true,
      },
      options: [
        {
          label: "日本語",
          value: "ja"
        },
        {
          label: "English",
          value: "en"
        },
      ],
    },
    {
      name: "home",
      type: "object",
      fields: [
        {
          name: "welcome",
          type: "text",
          label: "Title",
          description: "Welcome message in the homepage",
        },
      ],
    },
    {
      name: "menu_links",
      type: "object-list",
      fields: [
        {
          name: "title",
          type: "text",
          label: "Title",
        },
        {
          name: "url",
          type: "text",
          label: "URL",
        },
      ],
    },
    {
      name: "extra_head",
      type: "code",
      description: "Extra content to include in the <head> tag",
    },
    {
      name: "metas",
      type: "object",
      description: "Meta tags configuration.",
      fields: [
        "site: text",
        "description: text",
        "title: text",
        "image: text",
        "twitter: text",
        "lang: text",
        "generator: checkbox",
      ],
    },
  ],
);

cms.collection({
  name: "posts",
  label: "ブログポスト Blog posts",
  description: "日本語と英語のブログポストを編集する<br>Edit blog posts in Japanese and English",
  store: "src:posts/*.md",
  documentName(data) {
    return `${new Date().toISOString().split("T")[0]}-${data.title}-${data.lang}.md`;
  },
  fields: [
    {
      name: "lang",
      type: "select",
      label: "言語 Language",
      description: "コンテンツの言語を選択する<br>Select the language of the page content",
      attributes: {
        required: true,
      },
      options: [
        {
          label: "日本語",
          value: "ja"
        },
        {
          label: "English",
          value: "en"
        },
      ],
    },
    {
      name: "id",
      type: "text",
      label: "固有ID Unique ID",
      description: "A unique string (e.g. 20250107a) that acts to group a set of translated content pages together",
      attributes: {
        required: true,
      },
    },
    {
      name: "url",
      type: "url",
      label: "URL",
      description: "The public URL of the page. Leave empty to use the file path",
    },
    {
      name: "date",
      type: "date",
      label: "日付 Date",
      description: "The date the page was posted",
      attributes: {
        required: true,
      },
    },
    {
      name: "last_modified",
      type: "current-datetime",
      label: "最終更新 Last Modified",
      description: "The date the page was last modified",
      attributes: {
        readonly: true
      }
    },
    {
      name: "title",
      type: "text",
      label: "ページ・タイトル Page Title",
      description: "Title in the language of the page, visible in browser tab and page header, and used in search engine results",
      attributes: {
        required: true,
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "ページ・ディスクリプション Page Description",
      description: "Description in the language of the page, visible in page source, and used in search engine results",
      attributes: {
        required: true,
      },
    },
    {
      name: "image",
      type: "file",
      label: "ページ画像 Page Image",
      description: "The image to feature for the page, visible in social media shares",
      uploads: "uploads",
      attributes: {
        accept: "image/*",
      },
    },
    {
      name: "author",
      type: "text",
      label: "コンテンツの著者 Author of the Content",
      description: "The author's full name as it should appear in the byline, in the language of the content",
      init(field, { data }) {
        field.options = data.site?.search.values("author");
      },
    },
    {
      name: "category",
      type: "select",
      label: "カテゴリー Category",
      description: "The page category (e.g. Stories, Tips, Tutorials), in the language of the page",
      init(field, { data }) {
        field.options = data.site?.search.values("category");
      },
    },
    {
      name: "tags",
      type: "list",
      label: "タグ Tags",
      description: "The page tags, in the language of the page",
      init(field, { data }) {
        field.options = data.site?.search.values("tags");
      },
    },
    {
      name: "comments",
      type: "object",
      fields: [
        {
          name: "src",
          label: "Link to Mastodon post",
          type: "url",
        },
        {
          name: "bluesky",
          label: "Link to Bluesky post",
          type: "url",
        },
      ],
    },
    {
      name: "draft",
      type: "checkbox",
      label: "ドラフト Draft",
      description: "If checked, the post will not be published.",
    },
    {
      name: "content",
      type: "markdown",
      label: "コンテンツ Content",
      description: "The main content of the page, in the language of the page, formatted in markdown and HTML",
    },
  ],
});

cms.collection(
  "pages: Additional pages, like about, contact, etc.",
  "src:pages/*.md",
  [
    {
      name: "layout",
      type: "hidden",
      value: "layouts/page.vto",
    },
    {
      name: "title",
      type: "text",
      label: "Title",
    },
    url,
    {
      name: "menu",
      type: "object",
      label: "Whether to include in the menu",
      fields: [
        {
          name: "visible",
          type: "checkbox",
          label: "Show in menu",
        },
        {
          name: "order",
          type: "number",
          label: "Order",
        },
      ],
    },
    {
      name: "extra_head",
      type: "code",
      description: "Extra content to include in the <head> tag",
    },
    {
      name: "content",
      type: "markdown",
      label: "Content",
    },
  ],
);

export default cms;
