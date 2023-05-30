import { SSTConfig } from "sst";
import { NextjsSite, App } from "sst/constructs";

const config: SSTConfig = {
  config(_input) {
    return {
      name: "kestrelsite",
      region: "us-east-1",
    };
  },
  stacks(app: App) {
    app.stack(function Site({stack}) {
      const site = new NextjsSite(stack, "site");

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
};

export default config
