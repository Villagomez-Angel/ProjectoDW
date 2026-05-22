import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ 
      padding: "3rem 2rem", 
      fontFamily: "sans-serif", 
      maxWidth: "600px", 
      margin: "0 auto", 
      textAlign: "center",
      color: "#333" 
    }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}> Celulares Bienestar</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Bienvenido al sistema de gestión y ventas. Selecciona una opción para continuar:
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {/* Enlace al CRUD */}
        <Link href="/inventario" style={{
          padding: "1rem",
          background: "#0070f3",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "1.1rem",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}>
          Ir al Inventario (CRUD)
        </Link>

        {/* Enlace al About */}
        <Link href="/about" style={{
          padding: "1rem",
          background: "#f5f5f5",
          color: "#333",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "1.1rem",
          border: "1px solid #ccc"
        }}>
          ℹ️ Acerca de Nosotros
        </Link>
      </div>
    </main>
  );
}