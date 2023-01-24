import { isPlainObject } from "./util.js"

export type Collection<T> = Array<T> | Record<any, T>

export const map = <X, Y>(
  cb: (x: X, k: any) => Y,
  children: Collection<X>
): Collection<Y> => {
  if (Array.isArray(children)) {
    return children.map((v, k) => cb(v, k))
  } else if (isPlainObject(children)) {
    const result: Record<any, ReturnType<typeof cb>> = {}
    for (const key in children) {
      result[key] = cb(children[key], key)
    }
    return result
  }
  return []
}

export const filter = <X>(
  cb: (x: X, k: any) => boolean,
  children: Collection<X>
): Collection<X> => {
  if (Array.isArray(children)) {
    return children.filter((v, k) => cb(v, k))
  } else if (isPlainObject(children)) {
    const result: typeof children = {}
    for (const key in children) {
      if (cb(children[key], key)) {
        result[key] = children[key]
      }
    }
    return result
  }
  return []
}

export const forEach = <X>(
  cb: (x: X, k: any) => void,
  children: Collection<X>
): void => {
  if (Array.isArray(children)) {
    children.forEach((v, k) => cb(v, k))
  } else if (isPlainObject(children)) {
    for (const key in children) {
      cb(children[key], key)
    }
  }
}

export const find = <X>(
  cb: (x: X, k: any) => boolean,
  children: Collection<X>
): X | undefined => {
  if (Array.isArray(children)) {
    return children.find((v, k) => cb(v, k))
  } else if (isPlainObject(children)) {
    for (const key in children) {
      const result = cb(children[key], key)
      if (result) return children[key]
    }
  }
}
