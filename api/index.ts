import * as appModule from "../src/app";

const app = (appModule as any).default || (appModule as any).app || appModule;

export default function handler(req: any, res: any) {
  return app(req, res);
}