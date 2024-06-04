export const ROUTES_PATH = {
  MAIN: "/",
  HISTORY: "/history",
  SLAVEMAIN: "/slaveMain",
  SLAVEHISTORY: "/slaveHistory",
  IDENTIFICATION: "/identification",
} as const

export type RoutePath = (typeof ROUTES_PATH)[keyof typeof ROUTES_PATH]
