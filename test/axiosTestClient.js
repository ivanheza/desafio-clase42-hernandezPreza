import axios from "axios"

console.log("Prueba Cliente Axios")

let PRODUCT_ID = "6296db714740890f67bcf319"

let Producto = {
   name: "Nike Air",
   price: 6000,
   image: "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/e92a85ee-7b5a-4c84-8e98-fcdee92eab72/calzado-air-force-1-react-wNTVZJ.png",
}

export const getProducts = async () => {
   try {
      const response = await axios.get("http://localhost:9000/api/productos")
      console.log(response.data)
   } catch (error) {
      console.log(error.message)
   }
}
export const getProduct = async (id) => {
   try {
      const response = await axios.get(`http://localhost:9000/api/productos/${id}`)
      console.log(response.data)
   } catch (error) {
      console.log(error.message)
   }
}
export const postNewProduct = async () => {
   try {
      const response = await axios.post("http://localhost:9000/api/productos", Producto)
      let data = response.data

      console.log(data)
   } catch (error) {
      console.log(error.message)
   }
}

export const editProduct = async (id) => {
   try {
      //Cambiar para probar name y price
      Producto.name = "Nike Air React"
      Producto.price = 4500
      const response = await axios.put(
         `http://localhost:9000/api/productos/${id}`,
         Producto
      )
      let data = response.data

      console.log(data)
   } catch (error) {
      console.log(error.message)
   }
}
export const deleteProduct = async (id) => {
   try {
      const response = await axios.delete(`http://localhost:9000/api/productos/${id}`)
      let data = response.data

      console.log(data)
   } catch (error) {
      console.log(error.message)
   }
}

//-----------Obtener todos los productos
//getProducts()

//-----------Obtener un producto por su ID (pasamos el ID)
//getProduct(PRODUCT_ID)

//-----------Agregar un producto nuevo
//postNewProduct()

//-----------Editar un producto por su ID
//editProduct(PRODUCT_ID)

//-----------Borrar un producto por su ID
//deleteProduct("629452bb7a45d58ee4e0c1e0")
