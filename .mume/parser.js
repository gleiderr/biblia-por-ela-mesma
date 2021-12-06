module.exports = {
  onWillParseMarkdown: function (markdown) {
    return new Promise((resolve, reject) => {
      /**
       * *[No princípio|no princípio]: Texto de exemplo
       */
      markdown = markdown.replace(/\*\[(.*?)\]: (.*)/g, (match, term, text) => {
        return term
          .split('|')
          .map((t) => `*[${t}]: ` + text + '')
          .join('\n\n');
      });
      return resolve(markdown);
    });
  },
  onDidParseMarkdown: function (html, { cheerio }) {
    return new Promise((resolve, reject) => {
      /*html = html.replace(/<abbr title="(.*?)">(.*?)<\/abbr>/g, (match, title, content) => `${content} (${title})`);*/
      return resolve(html);
    });
  },
  onWillTransformMarkdown: function (markdown) {
    return new Promise((resolve, reject) => {
      return resolve(markdown);
    });
  },
  onDidTransformMarkdown: function (markdown) {
    return new Promise((resolve, reject) => {
      return resolve(markdown);
    });
  },
};
