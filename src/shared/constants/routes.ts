export type RoutePath =
  | "/"
  | "/history"
  | "/identification"
  | "/slaveMain"
  | "/slaveHistory"

export const ROUTES_PATH: Record<string, RoutePath> = {
  MAIN: "/",
  HISTORY: "/history",
  IDENTIFICATION: "/identification",
  SLAVEMAIN: "/slaveMain",
  SLAVEHISTORY: "/slaveHistory",
}
