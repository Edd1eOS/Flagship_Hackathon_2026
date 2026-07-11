import { createShadowRootUi } from "wxt/utils/content-script-ui/shadow-root";
import ReactDOM from "react-dom/client";

import { ShoppingScout } from "../src/companion/shopping-scout";
import {
  detectProduct,
  findPurchaseActions,
} from "../src/detection/product-detection";
import "../src/companion/shopping-scout.css";

export default defineContentScript({
  matches: ["http://localhost/*", "http://127.0.0.1/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "lemonade-browser-scout-baseline",
      position: "overlay",
      anchor: "body",
      onMount(container) {
        const app = document.createElement("div");
        container.append(app);

        const root = ReactDOM.createRoot(app);
        const detection = detectProduct(document, location.href);
        const purchaseActions = findPurchaseActions(document);
        root.render(
          <ShoppingScout
            detection={detection}
            purchaseActions={purchaseActions}
          />,
        );
        return root;
      },
      onRemove(root) {
        root?.unmount();
      },
    });

    ui.mount();
  },
});
