import parser from 'js-yaml'
const optionalByteOrderMark = '\\ufeff?'
const platform = typeof process !== 'undefined' ? process.platform : ''
const pattern = '^(' +
  optionalByteOrderMark +
  '(= yaml =|---)' +
  '$([\\s\\S]*?)' +
  '^(?:\\2|\\.\\.\\.)\\s*' +
  '$' +
  (platform === 'win32' ? '\\r?' : '') +
  '(?:\\n)?)'
// NOTE: If this pattern uses the 'g' flag the `regex` variable definition will
// need to be moved down into the functions that use it.
const regex = new RegExp(pattern, 'm')

export default function extractor (string:string, options?:any) {
  string = string || ''
  const defaultOptions = {}
  options = options instanceof Object ? { ...defaultOptions, ...options } : defaultOptions
  options.allowUnsafe = Boolean(options.allowUnsafe)
  const lines = string.split(/(\r?\n)/)
  if (lines[0] && /= yaml =|---/.test(lines[0])) {
    try {
      //console.log('string', string)
      return parse(string)
    } catch (err) {
      console.log(err)
      throw err
    }
  } else {
    return {
      attributes: {},
      body: string,
      bodyBegin: 1
    }
  }
}

function computeLocation(match:RegExpExecArray, body:string) {
  let line = 1
  let pos = body.indexOf('\n')
  const offset = match.index + match[0].length

  while (pos !== -1) {
    if (pos >= offset) {
      return line
    }
    line++
    pos = body.indexOf('\n', pos + 1)
  }

  return line
}

function parse(string:string) {
  const match = regex.exec(string)
  if (!match) {
    return {
      attributes: {},
      body: string,
      bodyBegin: 1
    }
  }

  const loader = parser.load
  const yaml = match[match.length - 1].replace(/^\s+|\s+$/g, '')
  const attributes = loader(yaml) || {}
  const body = string.replace(match[0], '')
  const line = computeLocation(match, string)

  return {
    attributes: attributes,
    body: body,
    bodyBegin: line,
    frontmatter: yaml
  }
}

export function test (string:string) {
  string = string || ''

  return regex.test(string)
}
