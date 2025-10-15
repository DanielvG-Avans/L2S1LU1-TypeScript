// Central DI tokens (using Symbol for uniqueness)

export const REPOSITORIES = {
  USER: Symbol("REPOSITORIES.USER"),
  MODULE: Symbol("REPOSITORIES.MODULE"),
} as const;

export const SERVICES = {
  AUTH: Symbol("SERVICES.AUTH"),
  USER: Symbol("SERVICES.USER"),
  MODULE: Symbol("SERVICES.MODULE"),
} as const;
