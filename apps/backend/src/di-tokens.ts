// Central DI tokens (using Symbol for uniqueness)

export const REPOSITORIES = {
  USER: Symbol("REPOSITORIES.USER"),
  MODULE: Symbol("REPOSITORIES.MODULE"),
} as const;

export const SERVICES = {
  AUTH: Symbol("SERVICES.AUTH"),
} as const;
