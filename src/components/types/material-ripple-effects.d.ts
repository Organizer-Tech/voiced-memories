declare module 'material-ripple-effects' {
  interface Ripple {
    create(element: HTMLElement, mode?: 'light' | 'dark'): void;
  }

  interface RippleStatic {
    new (): Ripple;
  }

  export const Ripple: RippleStatic;

  export default Ripple;
}
