/**
 * Transformer for string case, e.g. kebab-case to camelCase.
 * @deprecated Will be extracted to a separate package.
 */
export class CaseTransformer {
  /**
   * Static method for applying Title Case for the word.
   */
  public static titleize(x: string): string {
    return x[0].toUpperCase().concat(x.slice(1).toLowerCase());
  }

  /**
   * Pointer interface for lifting a value into CaseTransformer.
   */
  public static of(x: string | string[]): CaseTransformer {
    return new CaseTransformer(x);
  }

  /**
   * @constructor
   */
  public constructor(private x: string | string[]) {}

  /**
   * Fluent interface for building sentence-like transformations.
   * E.g. new CaseTransformer('testMe').from.camel.to.snake; // test_me
   */
  public to: CaseTransformer = this;

  /**
   * Fluent interface for building sentence-like transformations.
   * E.g. new CaseTransformer('testMe').from.camel.to.snake; // test_me
   */
  public from: CaseTransformer = this;

  /**
   * Transformer for camelCase.
   * If x is `string[]`, returns camelCased string.
   * If x is `string`, returns new CaseTransformer with split camelCased string
   * for chaining.
   */
  public camel: CaseTransformer = Array.isArray(this.x)
    ? (this.x.map((w, i) => (i === 0 ? w[0].toLowerCase() + w.slice(1) : CaseTransformer.titleize(w))).join('') as any)
    : CaseTransformer.of(this.x.split(/(?=[A-Z])/).map((w) => w.toLowerCase()));

  /**
   * Transformer for dot.case.
   * If x is `string[]`, returns dot.cased string.
   * If x is `string`, returns new CaseTransformer with split dot.cased string
   * for chaining.
   */
  public dot: CaseTransformer = Array.isArray(this.x)
    ? (this.x.map((w) => w.toLowerCase()).join('.') as any)
    : CaseTransformer.of(this.x.split('.'));

  /**
   * Transformer for colon:case.
   * If x is `string[]`, returns colon:cased string.
   * If x is `string`, returns new CaseTransformer with split colon:cased
   * string for chaining.
   */
  public colon: CaseTransformer = Array.isArray(this.x)
    ? (this.x.map((w) => w.toLowerCase()).join(':') as any)
    : CaseTransformer.of(this.x.split(':'));

  /**
   * Transformer for kebab-case.
   * If x is `string[]`, returns kebab-cased string.
   * If x is `string`, returns new CaseTransformer with split kebab-cased
   * string for chaining.
   */
  public kebab: CaseTransformer = Array.isArray(this.x)
    ? (this.x.map((w) => w.toLowerCase()).join('-') as any)
    : CaseTransformer.of(this.x.split('-'));

  /**
   * Transformer for snake_case.
   * If x is `string[]`, returns snake_cased string.
   * If x is `string`, returns new CaseTransformer with split snake_cased
   * string for chaining.
   */
  public snake: CaseTransformer = Array.isArray(this.x)
    ? (this.x.map((w) => w.toLowerCase()).join('_') as any)
    : CaseTransformer.of(this.x.split('_'));

  /**
   * Transformer for PascalCase.
   * If x is `string[]`, returns PascalCased string.
   * If x is `string`, returns new CaseTransformer with split PascalCased
   * string for chaining.
   */
  public pascal: CaseTransformer = Array.isArray(this.x)
    ? (this.x.map((w) => CaseTransformer.titleize(w)).join('') as any)
    : CaseTransformer.of(this.x.split(/(?=[A-Z])/).map((w) => w.toLowerCase()));

  /**
   * Fold current internally stored value.
   */
  public fold(): string | string[] {
    return this.x;
  }

  public toString(): string {
    return typeof this.x === 'string' ? this.x : this.x.join('');
  }
}

/**
 * Transform object keys.
 * @deprecated Will be extracted to a separate package.
 */
export const transformKeys = (transformer: (x: string) => string, obj: Object, delegate: Object = {}) => {
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === 'object') {
      if (obj[k] instanceof Date) {
        delegate[transformer(k)] = obj[k];
      } else if (Array.isArray(obj[k])) {
        delegate[transformer(k)] = obj[k].map((x) =>
          typeof x === 'object' && !!x ? transformKeys(transformer, x, {}) : x
        );
      } else if (!obj[k]) {
        delegate[transformer(k)] = null;
      } else {
        delegate[transformer(k)] = transformKeys(transformer, obj[k], {});
      }
    } else {
      delegate[transformer(k)] = obj[k];
    }
  });

  return delegate;
};

/**
 * Pointer interface for lifting a value to CaseTransformer.
 * @deprecated Will be extracted to a separate package.
 */
export const transformCase = (x: string | string[]) => CaseTransformer.of(x);

/**
 * Transform array of strings to snake_case.
 * @deprecated Will be extracted to a separate package.
 */
export const toSnakeCase = (x: string[]) => CaseTransformer.of(x).to.snake;

/**
 * Transform array of strings to camelCase.
 * @deprecated Will be extracted to a separate package.
 */
export const toCamelCase = (x: string[]) => CaseTransformer.of(x).to.camel;

/**
 * Transform array of strings to kebab-case.
 * @deprecated Will be extracted to a separate package.
 */
export const toKebabCase = (x: string[]) => CaseTransformer.of(x).to.kebab;

/**
 * Transform array of strings to PascalCase.
 * @deprecated Will be extracted to a separate package.
 */
export const toPascalCase = (x: string[]) => CaseTransformer.of(x).to.pascal;

/**
 * Transform array of strings to dot.case.
 * @deprecated Will be extracted to a separate package.
 */
export const toDotCase = (x: string[]) => CaseTransformer.of(x).to.dot;

/**
 * Transform array of strings to colon:case.
 * @deprecated Will be extracted to a separate package.
 */
export const toColonCase = (x: string[]) => CaseTransformer.of(x).to.colon;

/**
 * Transform string from snake_case.
 * @deprecated Will be extracted to a separate package.
 */
export const fromSnakeCase = (x: string) => CaseTransformer.of(x).from.snake.fold();

/**
 * Transform string from camelCase.
 * @deprecated Will be extracted to a separate package.
 */
export const fromCamelCase = (x: string) => CaseTransformer.of(x).from.camel.fold();

/**
 * Transform string from kebab-case.
 * @deprecated Will be extracted to a separate package.
 */
export const fromKebabCase = (x: string) => CaseTransformer.of(x).from.kebab.fold();

/**
 * Transform string from PascalCase.
 * @deprecated Will be extracted to a separate package.
 */
export const fromPascalCase = (x: string) => CaseTransformer.of(x).from.pascal.fold();

/**
 * Transform string from dot.case.
 * @deprecated Will be extracted to a separate package.
 */
export const fromDotCase = (x: string) => CaseTransformer.of(x).from.dot.fold();

/**
 * Transform string from colon:case.
 * @deprecated Will be extracted to a separate package.
 */
export const fromColonCase = (x: string) => CaseTransformer.of(x).from.colon.fold();
