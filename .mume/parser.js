module.exports = {
  onWillParseMarkdown: function (markdown) {
    return new Promise((resolve, reject) => {
      markdown = markdown.replace(/\*\[(.*?)\]\((.*?)\)/g, (_, text, title) => {
        return `<abbr title="${title}">${text}</abbr>`;
      });

      const defAbbrInit = '\\*\\[(.*?)]:';
      const defAbbrVazio = defAbbrInit + '\\s*?\\n';
      const lines = '(?:>.*?\\s*?\\n)+';
      const defAbbrMultiLines = defAbbrVazio + `(${lines})`;
      const regex = new RegExp(defAbbrMultiLines, 'g');

      /**
       * *[Definição Longa|definição longa]:
       * > Esta é uma definição longa.
       * > Ela contém esta linha adicional.
       *
       * ----->
       *
       * *[Definição Longa|definição longa]: Definição longa
       * > Esta é uma definição longa.
       * > Ela contém esta linha adicional.
       */
      markdown = markdown.replace(regex, (match, term, lines) => {
        const title = term.split('|')[0];
        const header = `###### ${title}`;
        const abbr = `*[${term}]: ${title}`;
        return `${abbr}\n\n${header}\n\n${lines}`;
      });

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
      html = html.replace(
        /<h6([\s\S]*?)><abbr[\s\S]*?>([\s\S]*?)<\/abbr><\/h6>([\s\S]*?<blockquote>[\s\S]*?<\/blockquote>)/g,
        (match, h6attr, header, rest) => {
          rest = rest.replace(
            new RegExp(`<abbr title="${header}">([\\s\\S]*?)</abbr>`),
            (match, text) => text
          );

          return `<h6${h6attr}>${header}</h6>${rest}`;
        }
      );

      // Substitui title de <abbr/> pela definição longa
      const abbr = '<abbr title="(.*?)">(.*?)</abbr>';
      html = html.replace(
        new RegExp(abbr, 'g'),
        (abbrMatch, abbrTitle, abbrContent) => {
          const definição = `<h6.*?id="(.*?)".*?>.*?(${abbrTitle}).*?</h6>[\\s\\S]*?<blockquote>([\\s\\S]*?)</blockquote>`;
          const foundDefinição = new RegExp(definição, 'g').exec(html);
          if (!foundDefinição) return abbrMatch;

          let [match, id, header, blockquote] = foundDefinição;

          blockquote = `<a href="#${id}">${header}</a><br>` + blockquote;

          blockquote = blockquote.replace(/"/g, '&quot;'); //remove aspas duplas
          blockquote = blockquote.replace(/\r?\n/g, ''); //remove novas linhas

          //blockquote = blockquote.replace(/</g, '&lt;').replace(/>/g, '&gt;');

          return `<abbr title="${blockquote}">${abbrContent}</abbr>`;
        }
      );

      // Transforma <abbr/> em <details/>
      html = html.replace(
        /<abbr title="(.+?)">(.+?)<\/abbr>/g,
        (match, title, text) =>
          `<details><summary>${text}</summary><span>${title.replace(
            /&quot;/g,
            '"'
          )}</span></details>`
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
