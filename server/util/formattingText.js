
// export const decodeHtmlEntities = (text) => {
//   if (!text) return text;
//   return text
//     .replace(/&#x20;/g, ' ')
//     .replace(/&aacute;/g, 'á')
//     .replace(/&eacute;/g, 'é')
//     .replace(/&iacute;/g, 'í')
//     .replace(/&oacute;/g, 'ó')
//     .replace(/&uacute;/g, 'ú')
//     .replace(/&ntilde;/g, 'ñ')
//     .replace(/&quot;/g, '"')
//     .replace(/&#x0d;/g, '')
//     .replace(/&#x0a;/g, '')
//     .replace(/&#40;/g, '(')
//     .replace(/&#41;/g, ')');
// };


export const decodeHtmlEntities = (str) => {
    if (!str) return str;
    return str.replace(/&#x20;/g, ' ')
              .replace(/&iacute;/g, 'í')
              .replace(/&eacute;/g, 'é')
              .replace(/&oacute;/g, 'ó')
              .replace(/&aacute;/g, 'á')
              .replace(/&uacute;/g, 'ú')
              .replace(/&ntilde;/g, 'ñ')
              .replace(/&uuml;/g, 'ü')
              .replace(/&#40;/g, '(')
              .replace(/&#41;/g, ')')
              .replace(/&quot;/g, '"')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&apos;/g, "'");
  }
