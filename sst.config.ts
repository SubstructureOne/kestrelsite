import { SSTConfig } from "sst";
import { App } from "sst/constructs";
import { KestrelSite } from "./src/stacks/stacks";

const config: SSTConfig = {
    config(_input) {
        return {
            name: "kestrelsite",
            region: "us-east-1",
        };
    },
    stacks(app: App) {
        app.stack(KestrelSite);
    },
};

export default config;
