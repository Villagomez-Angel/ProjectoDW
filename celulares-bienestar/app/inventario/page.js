"use client"; 
import { useState } from "react";

export default function Home() {
  // Estado del inventario de celulares
  const [celulares, setCelulares] = useState([
    { id: 1, modelo: "Samsung Galaxy S24", marca: "Samsung", precio: 999 },
    { id: 2, modelo: "iPhone 15 Pro", marca: "Apple", precio: 1199 },
  ]);

  // Estados para el formulario
  const [modelo, setModelo] = useState("");
  const [marca, setMarca] = useState("");
  const [precio, setPrecio] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  // --- LOGICA DEL CRUD ---
  const guardarCelular = (e) => {
    e.preventDefault();
    if (!modelo || !marca || !precio) return alert("Llena todos los campos");

    if (editandoId) {
      setCelulares(celulares.map(cel => 
        cel.id === editandoId ? { ...cel, modelo, marca, precio: Number(precio) } : cel
      ));
      setEditandoId(null);
    } else {
      const nuevo = { id: Date.now(), modelo, marca, precio: Number(precio) };
      setCelulares([...celulares, nuevo]);
    }
    setModelo(""); setMarca(""); setPrecio("");
  };

  const prepararEdicion = (celular) => {
    setEditandoId(celular.id);
    setMarca(celular.marca);
    setModelo(celular.modelo);
    setPrecio(celular.precio);
  };

  const eliminarCelular = (id) => {
    if (confirm("¿Seguro que quieres eliminar este celular?")) {
      setCelulares(celulares.filter(cel => cel.id !== id));
    }
  };

  // --- FUNCIÓN PARA COMPRAR E IMPRIMIR EL RECIBO ---
  const comprarYImprimir = (celular) => {
    // 1. Obtener la fecha y hora actual formateada
    const fechaActual = new Date().toLocaleString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    // Generar un número de ticket aleatorio
    const nroTicket = Math.floor(Math.random() * 900000 + 100000);

    // 2. Crear una ventana temporal para la impresión
    const ventanaImpresion = window.open("", "_blank", "width=400,height=600");

    // 3. Inyectar HTML y CSS con estilo de ticket de tienda
    ventanaImpresion.document.write(`
      <html>
        <head>
          <title>Recibo de Compra #${nroTicket}</title>
          <style>
            body { 
              font-family: 'Courier New', Courier, monospace; 
              padding: 10px; 
              color: #000;
              background-color: #fff;
            }
            .ticket { 
              max-width: 280px; 
              margin: 0 auto; 
              border: 1px dashed #000; 
              padding: 15px; 
            }
            .centro { text-align: center; }
            .linea { border-top: 1px dashed #000; margin: 12px 0; }
            .total { font-size: 1.2em; font-weight: bold; }
            @media print {
              body { padding: 0; }
              .ticket { border: none; }
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <h2 class="centro">CELULARES BIENESTAR</h2>
            <p class="centro">¡Gracias por tu preferencia!</p>
            <div class="linea"></div>
            <p><strong>Fecha:</strong><br>${fechaActual}</p>
            <p><strong>Ticket:</strong> #CB-${nroTicket}</p>
            <div class="linea"></div>
            <p><strong>Prod:</strong> ${celular.marca} ${celular.modelo}</p>
            <p><strong>Cant:</strong> 1</p>
            <p><strong>Precio:</strong> $${celular.precio}.00</p>
            <div class="linea"></div>
            <p class="total">TOTAL: $${celular.precio}.00</p>
            <div class="linea"></div>
            <p class="centro" style="font-size: 0.85em;">Conserve este ticket para hacer válida su garantía de Bienestar.</p>
          </div>
          <script>
            // Ejecutar la impresión automáticamente al cargar la ventana
            window.onload = function() {
              window.print();
              // Cerrar la pestaña/ventana automáticamente después de imprimir o cancelar
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    
    ventanaImpresion.document.close();
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "650px", margin: "0 auto", color: "#333" }}>
      <h1>Celulares Bienestar</h1>

      {/* FORMULARIO */}
      <form onSubmit={guardarCelular} style={{ marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "10px", background: "#f9f9f9", padding: "1.5rem", borderRadius: "8px" }}>
        <h3>{editandoId ? "📝 Editar Celular" : "➕ Agregar Nuevo Celular"}</h3>
        <input style={{padding: "8px"}} type="text" placeholder="Marca (ej. Apple)" value={marca} onChange={(e) => setMarca(e.target.value)} />
        <input style={{padding: "8px"}} type="text" placeholder="Modelo (ej. iPhone 15)" value={modelo} onChange={(e) => setModelo(e.target.value)} />
        <input style={{padding: "8px"}} type="number" placeholder="Precio ($)" value={precio} onChange={(e) => setPrecio(e.target.value)} />
        <button type="submit" style={{ padding: "10px", background: editandoId ? "#cca300" : "#0070f3", color: "white", border: "none", cursor: "pointer", borderRadius: "4px", fontWeight: "bold" }}>
          {editandoId ? "Actualizar Cambios" : "Guardar en Inventario"}
        </button>
        {editandoId && <button type="button" onClick={() => { setEditandoId(null); setModelo(""); setMarca(""); setPrecio(""); }} style={{padding: "5px", background: "#ccc", border: "none", cursor: "pointer"}}>Cancelar Edición</button>}
      </form>

      <hr />

      {/* LISTA DE ELEMENTOS */}
      <h3> Inventario Disponible</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {celulares.map((cel) => (
          <li key={cel.id} style={{ padding: "1rem", border: "1px solid #ddd", marginBottom: "10px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff" }}>
            <div>
              <strong style={{ fontSize: "1.1em" }}>{cel.marca} {cel.modelo}</strong> 
              <span style={{ color: "#0070f3", marginLeft: "10px", fontWeight: "bold" }}>${cel.precio}</span>
            </div>
            <div style={{ display: "flex", gap: "5px" }}>
              {/* NUEVO BOTÓN DE COMPRA */}
              <button onClick={() => comprarYImprimir(cel)} style={{ background: "#2e7d32", color: "white", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: "4px" }}>
                 Comprar
              </button>
              <button onClick={() => prepararEdicion(cel)} style={{ background: "#f57c00", color: "white", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: "4px" }}>
                 Editar
              </button>
              <button onClick={() => eliminarCelular(cel.id)} style={{ background: "#d32f2f", color: "white", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: "4px" }}>
                 Borrar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}