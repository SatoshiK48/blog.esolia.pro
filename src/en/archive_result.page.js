export const layout = "layouts/archive_result.vto";
export const lang = "en";

export default function* ({ search, en, lang }) {
  // Generate a page for each tag
  for (const tag of search.values("tags", `lang=${lang}`)) {
    yield {
      url: `/en/archive/${tag}/`,
      title: `${en.i18n.search.by_tag}  “${tag}”`,
      type: "tag",
      search_query: `type=post lang=${lang} '${tag}'`,
      tag,
    };
  }

  // Generate a page for each author
  for (const author of search.values("author", `lang=${lang}`)) {
    yield {
      url: `/en/author/${author}/`,
      title: `${en.i18n.search.by_author} ${author}`,
      type: "author",
      search_query: `type=post lang=${lang} author='${author}'`,
      author,
    };
  }
}