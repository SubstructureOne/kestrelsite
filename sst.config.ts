import { SSTConfig } from "sst";
import { NextjsSite, App, Queue } from "sst/constructs";

const config: SSTConfig = {
  config(_input) {
    return {
      name: "kestrelsite",
      region: "us-east-1",
    };
  },
  stacks(app: App) {
    app.stack(function Site({stack}) {
      const queue = new Queue(
          stack,
          "billingQueue",
          {consumer: "src/functions/billingQueueConsumer.handler"}
      );
      const site = new NextjsSite(stack, "site", {bind: [queue]});

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
};

export default config
