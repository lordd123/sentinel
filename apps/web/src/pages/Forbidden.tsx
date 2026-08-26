import {
  ArrowLeft,
  ShieldX,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

export function Forbidden() {
  return (
    <main className="forbidden-page">
      <section className="forbidden-card">
        <div className="forbidden-icon">
          <ShieldX size={24} />
        </div>

        <span className="page-kicker">
          ACCESS DENIED
        </span>

        <h1>
          Você não tem permissão
        </h1>

        <p>
          Sua conta está autenticada,
          mas seu cargo não possui
          autorização para acessar este
          recurso.
        </p>

        <Link
          to="/dashboard"
          className="forbidden-back"
        >
          <ArrowLeft size={15} />
          Voltar ao Dashboard
        </Link>
      </section>
    </main>
  );
}