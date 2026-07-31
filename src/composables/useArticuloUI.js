

export function useArticuloUI() {


    const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Cód. Barras', key: 'codigo_barras' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Descripción', key: 'descripcion' },
  { title: 'Stock', key: 'stock' },
  { title: 'Precio Venta', key: 'precio_venta' },
  { title: 'Precio Costo', key: 'precio_costo' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]

return {
    headers
}

}