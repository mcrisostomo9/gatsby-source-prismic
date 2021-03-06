import {
  buildFixedGatsbyImage,
  buildFluidGatsbyImage,
} from '../src/gatsbyImage'

import { GatsbyFixedImageProps, GatsbyFluidImageProps } from '../src/types'

const URL_SRC = 'https://images.prismic.io/reponame/imagehash.jpg'
const URL_SRC_WITH_RECT =
  'https://images.prismic.io/reponame/imagehash.jpg?rect=0,0,3600,1800'
const URL_HEIGHT = 1000
const URL_WIDTH = 2000

const safeParseInt = (x: string | null) => (x === null ? x : Number.parseInt(x))

const safeParseFloat = (x: string | null) =>
  x === null ? x : Number.parseFloat(x)

const extractURLData = (url: string) => {
  const instance = new URL(url)
  const params = instance.searchParams

  return {
    urlOrigin: instance.origin,
    urlPathname: instance.pathname,
    width: safeParseInt(params.get('w')),
    height: safeParseInt(params.get('h')),
    dpr: safeParseFloat(params.get('dpr')),
    rect: params.get('rect'),
    fit: params.get('fit'),
    quality: safeParseInt(params.get('q')),
    blur: safeParseInt(params.get('blur')),
    auto: params.get('auto'),
  }
}

const extractSrcSetURLData = (srcSet: string) => {
  const urls = srcSet.split(/,\s+/).map(x => x.split(' '))

  return urls.map(([url, descriptor]) => ({
    descriptor,
    url: extractURLData(url),
  }))
}

const extractImageData = ({
  aspectRatio,
  base64,
  src,
  srcSet,
}: GatsbyFixedImageProps | GatsbyFluidImageProps) => ({
  aspectRatio,
  base64: base64 ? extractURLData(base64) : undefined,
  src: extractURLData(src),
  srcSet: extractSrcSetURLData(srcSet),
})

describe('buildFixedGatsbyImage', () => {
  test('jpg without params', () => {
    const result = buildFixedGatsbyImage(URL_SRC, URL_WIDTH, URL_HEIGHT)
    expect(extractImageData(result)).toMatchSnapshot()
    expect(result.srcSetWebp).toEqual(result.srcSet)
    expect(result.srcWebp).toEqual(result.src)
  })

  test('jpg with rect without params', () => {
    const result = buildFixedGatsbyImage(
      URL_SRC_WITH_RECT,
      URL_WIDTH,
      URL_HEIGHT,
    )
    expect(extractImageData(result)).toMatchSnapshot()
    expect(result.srcSetWebp).toEqual(result.srcSet)
    expect(result.srcWebp).toEqual(result.src)
  })

  test('jpg with width (600)', () => {
    const result = buildFixedGatsbyImage(URL_SRC, URL_WIDTH, URL_HEIGHT, {
      width: 600,
    })
    expect(extractImageData(result)).toMatchSnapshot()
    expect(result.srcSetWebp).toEqual(result.srcSet)
    expect(result.srcWebp).toEqual(result.src)
  })

  test('jpg with height (400)', () => {
    const result = buildFixedGatsbyImage(URL_SRC, URL_WIDTH, URL_HEIGHT, {
      height: 400,
    })
    expect(extractImageData(result)).toMatchSnapshot()
    expect(result.srcSetWebp).toEqual(result.srcSet)
    expect(result.srcWebp).toEqual(result.src)
  })

  test('jpg with width (600) and height (400)', () => {
    const result = buildFixedGatsbyImage(URL_SRC, URL_WIDTH, URL_HEIGHT, {
      width: 600,
      height: 400,
    })
    expect(extractImageData(result)).toMatchSnapshot()
    expect(result.srcSetWebp).toEqual(result.srcSet)
    expect(result.srcWebp).toEqual(result.src)
  })
})

describe('buildFluidGatsbyImage', () => {
  test('jpg without params', () => {
    const result = buildFluidGatsbyImage(URL_SRC, URL_WIDTH, URL_HEIGHT)
    expect(extractImageData(result)).toMatchSnapshot()
    expect(result.srcSetWebp).toEqual(result.srcSet)
    expect(result.srcWebp).toEqual(result.src)
  })

  test('jpg with rect without params', () => {
    const result = buildFluidGatsbyImage(
      URL_SRC_WITH_RECT,
      URL_WIDTH,
      URL_HEIGHT,
    )
    expect(extractImageData(result)).toMatchSnapshot()
    expect(result.srcSetWebp).toEqual(result.srcSet)
    expect(result.srcWebp).toEqual(result.src)
  })

  test('jpg with max width (1000)', () => {
    const result = buildFluidGatsbyImage(URL_SRC, URL_WIDTH, URL_HEIGHT, {
      maxWidth: 1000,
    })
    expect(extractImageData(result)).toMatchSnapshot()
    expect(result.srcSetWebp).toEqual(result.srcSet)
    expect(result.srcWebp).toEqual(result.src)
  })

  test('jpg with max height (600)', () => {
    const result = buildFluidGatsbyImage(URL_SRC, URL_WIDTH, URL_HEIGHT, {
      maxHeight: 600,
    })
    expect(extractImageData(result)).toMatchSnapshot()
    expect(result.srcSetWebp).toEqual(result.srcSet)
    expect(result.srcWebp).toEqual(result.src)
  })

  test('jpg with max width (1000) and max height (600)', () => {
    const result = buildFluidGatsbyImage(URL_SRC, URL_WIDTH, URL_HEIGHT, {
      maxWidth: 1000,
      maxHeight: 600,
    })
    expect(extractImageData(result)).toMatchSnapshot()
    expect(result.srcSetWebp).toEqual(result.srcSet)
    expect(result.srcWebp).toEqual(result.src)
  })

  test('jpg with srcSetBreakpoints', () => {
    const result = buildFluidGatsbyImage(URL_SRC, URL_WIDTH, URL_HEIGHT, {
      srcSetBreakpoints: [400],
    })
    expect(extractImageData(result)).toMatchSnapshot()
    expect(result.srcSetWebp).toEqual(result.srcSet)
    expect(result.srcWebp).toEqual(result.src)
  })
})
