import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;
    type StyleCollector = {
      collectStyles: (node: JSX.Element) => JSX.Element;
      getStyleElement: () => JSX.Element;
      seal: () => void;
    };

    let sheet: StyleCollector | null = null;
    try {
      // Keep runtime stable when module resolution differs between nested workspace roots.
      const runtimeRequire = eval("require") as (id: string) => { ServerStyleSheet?: new () => StyleCollector };
      const styledComponents = runtimeRequire("styled-components");
      if (styledComponents.ServerStyleSheet) {
        sheet = new styledComponents.ServerStyleSheet();
      }
    } catch {
      sheet = null;
    }

    try {
      if (sheet) {
        ctx.renderPage = () =>
          originalRenderPage({
            enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
          });
      }

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: sheet ? [initialProps.styles, sheet.getStyleElement()] : initialProps.styles,
      };
    } finally {
      if (sheet) {
        sheet.seal();
      }
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
