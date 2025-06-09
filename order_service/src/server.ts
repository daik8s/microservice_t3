import { ExpressApp } from "./express-app";
import { logger } from "./utils";
const PORT = process.env.APP_PORT || 9000;

export const StartServer = async () => {
  const app = await ExpressApp();
  app.listen(PORT, () => {
    logger.info(`App is listening to ${PORT}`);
  });

  process.on("uncaughtException", async (err) => {
    logger.info(err);
    process.exit(1);
  });
};

StartServer().then(() => {
  logger.info("server is up");
});
