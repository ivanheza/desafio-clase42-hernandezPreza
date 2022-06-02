import express from "express"
import {
   addProduct,
   borrarProducto,
   editByID,
   getByID,
   getProducts,
   randomNumbers,
   testProductos,
} from "../controller/controller-productos.js"
const router = express.Router()

router.get("/productos-test", testProductos)

////--------

router.get("/randoms", randomNumbers)

///GET ALL
router.get("/productos", getProducts)

///GET BY ID
router.get("/productos/:id", getByID)

/////>>>PRUEBAS INSTANCIAS //ADMIN

//POST
router.post("/productos", addProduct)

///PUT Edit Product
router.put("/productos/:id", editByID)

///DELETE
router.delete("/productos/:id", borrarProducto)

export default router
