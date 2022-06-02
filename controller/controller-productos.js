import {generarProductos} from "../mocks/mockP.js"
import logger from "../helpers/winston.js"
import {generarNumeros} from "../helpers/process-child.js"
import config from "../config/config.js"
import ProductosMongoDao from "../services/productosMongo.js"
import ProductosDAOFile from "../services/productosFileDao.js"
import productoDTO from "../DTO/productoDTO.js"

let persistencia

switch (config.persistencia) {
   case "MONGO":
      persistencia = new ProductosMongoDao()
      break
   case "FS":
      persistencia = new ProductosDAOFile()
      break
   default:
      break
}

//////////////////////////////// CONTROLLER SERVER ////////////////////////////////
export const getProducts = async (req, res) => {
   try {
      const data = await persistencia.readData()
      //console.log(data)
      res.json(data)
   } catch (error) {
      logger.error(`${error} -  "Ocurrio un error al cargar los productos"`)
   }
}
export const addProduct = async (req, res) => {
   try {
      const data = req.body
      const newProd = productoDTO(data)
      // console.log(newProd)
      const producto = await persistencia.guardarNuevo(newProd)
      //console.log(producto)
      if (!producto.success && producto.success) {
         res.json(producto)
      }
      res.json(producto)
   } catch (error) {
      logger.error(`${error} -  "Ocurrio un error al guardar el producto nuevo."`)
   }
}

export const getByID = async (req, res) => {
   try {
      const {id} = req.params
      //console.log(id)
      //const result = await db.readID(id)
      const result = await persistencia.readID(id)
      res.status(200).json(result)
   } catch (error) {
      logger.error(`${error} -  "Ocurrio un error al buscar el producto...."`)
   }
}
export const editByID = async (req, res) => {
   const id = req.params.id
   //console.log(id)

   const editado = await persistencia.editByID(id, req.body)

   res.status(200).json({
      successMessage: "El producto se editó con éxito",
      producto: editado,
   })
}

export const borrarProducto = async (req, res) => {
   try {
      console.log(req.params)
      const {id} = req.params
      await persistencia.borrar(id)
      res.json({msg: "El producto fue borrado!..."})
   } catch (err) {
      // 👇️ This runs
      logger.error(`${error} -  "Ocurrio un error al borrar  el producto."`)
   }
}
////////////////////////////////WEB Sockets CONTROLLER////////////////////////////////

export const productosSockets = async (socket, sockets) => {
   try {
      ///Carga productos para cada socket
      const data = await persistencia.readData()

      socket.emit("loadProducts", data)
   } catch (error) {
      logger.error(`${error} -  "Ocurrio un error al cargar los productos"`)
   }
   //nuevo porducto
   socket.on("newProduct", async (product) => {
      //console.log(product)
      try {
         const newProd = await productoDTO(product)
         // console.log(newProd)
         await persistencia.guardarNuevo(newProd)

         sockets.emit("newProduct", newProd)
      } catch (error) {
         logger.error(`${error} -  "Ocurrio un error al cargar los productos"`)
      }
   })
   //Socket para borrar producto
   socket.on("deleteProduct", async (id) => {
      try {
         ///holas
         //console.log(id)
         await persistencia.borrar(id)
         /// se cargan los productos para los sockets
         sockets.emit("loadProducts", await persistencia.readData())
      } catch (error) {
         logger.error(error)
      }
   })
   //se define socket para escoger un solo producto, esto con la finalidad de poder hacer uso del boton borrar
   socket.on("getProduct", async (id) => {
      const listaProductos = await persistencia.readData()
      const product = listaProductos.find((p) => p.id == id)
      //console.log(product)
      socket.emit("selectedProduct", product)
   })
}

////////////////// OTROS /////////////////////////////////

export const testProductos = async (req, res) => {
   try {
      const {url, method} = req
      logger.info(`Metodo: ${method} - Ruta: ${url}`)
      ///---- se genera los Mocks
      const productosNuevos = generarProductos(5)
      //console.log(productosNuevos)
      const data = await persistencia.insertManyData(productosNuevos)

      res.redirect("/home")
   } catch (error) {
      console.log(error)
      logger.error(`${error} -  "Ocurrio un error al insertar los Mocks"`)
   }
}

export const randomNumbers = async (req, res) => {
   const {url, method} = req
   logger.info(`Metodo: ${method} - Ruta: ${url}`)
   ///---- se genera los Mocks

   //
   let cant = req.query.cant
   //const forked = fork("process-child.js")
   if (!cant) {
      const numeros = generarNumeros(1000000)
      const duplicated = numeros.reduce((acc, value) => {
         return {...acc, [value]: (acc[value] || 0) + 1}
      }, {})
      console.log("first")
      res.send(duplicated)
   } else {
      console.log(cant, "cantidad")
      const numeros = generarNumeros(cant)
      const duplicated = numeros.reduce((acc, value) => {
         return {...acc, [value]: (acc[value] || 0) + 1}
      }, {})
      res.send(duplicated)
   }
}
