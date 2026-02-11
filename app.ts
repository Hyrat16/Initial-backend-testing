import express, { Request, Response, NextFunction } from "express";
import { routes } from "./core/routes";
import { RequestBadlyFormatted } from "./core/errors/errorBadRequest";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());
app.use(routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error: any = new RequestBadlyFormatted("Rota não encontrada");
  error.statusCode = 404;
  next(error);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Erro global:", error);

  const statusCode = error.statusCode || error.status || 500;

  res.status(statusCode).json({
    message: error.message || "Erro no servidor",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
