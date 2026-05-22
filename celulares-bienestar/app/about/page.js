import Link from "next/link";

export default function AboutPage() {
  return (
    <main style={{ 
      padding: "3rem 2rem", 
      fontFamily: "sans-serif", 
      maxWidth: "600px", 
      margin: "0 auto",
      color: "#333" 
    }}>
      <h1>ℹ️ Acerca de Celulares Bienestar</h1>
      
      <p style={{ lineHeight: "1.6", fontSize: "1.1rem", margin: "20px 0" }}>
        "Inserte descripción"
      </p>

      <hr style={{ margin: "2rem 0", borderColor: "#eee" }} />

      {/* Botón para regresar al Home */}
      <Link href="/" style={{
        color: "#0070f3",
        textDecoration: "none",
        fontWeight: "bold"
      }}>
        ← Volver al Inicio
      </Link>
    </main>
  );
}