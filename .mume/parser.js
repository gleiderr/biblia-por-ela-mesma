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
      // Transforma <abbr/> em <details/>
      html = html.replace(
        /<abbr title="(.+?)">(.+?)<\/abbr>/g,
        (match, title, text) =>
          `<details><summary>${text}</summary><span>${title}</span></details>`
      );

      html = html.replace(/<p>/g, '');

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
