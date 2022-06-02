import supertest from "supertest"
import chai from "chai"

const url = `http://localhost:9000/api/productos`

import server from "../server.js"

const expect = chai.expect

let PRODUCT_ID = "6296db714740890f67bcf319"
let Producto = {
   name: "Nike AirForce 1 Red",
   price: 4800,
}

let PRODUCT_ID_EDIT = "6296f0ffa53afd1199fefe92"
const urledit = `/api/productos/${PRODUCT_ID_EDIT}`

let PRODUCT_ID_DELETE = "6296f0ffa53afd1199fefe90"
const urldelete = `/api/productos/${PRODUCT_ID_DELETE}`

describe("Test apiRestFull ", () => {
   describe("test GET", () => {
      it("debería retornar la lista de productos", (done) => {
         supertest(server).get("/api/productos/").expect(200, done())
      })
   })

   describe("test POST", () => {
      it("Debe incorporar un producto.", (done) => {
         Producto.image =
            "https://cdn-images.farfetch-contents.com/14/95/28/28/14952828_24667229_1000.jpg"
         supertest(server)
            .post("/api/productos/")
            .send(Producto)
            .expect(200, (req, res) => {
               console.log(res.body)
               done()
            })
      })
   })

   describe("test update/PUT", () => {
      it("debe modificar los datos del producto (segun el id).", (done) => {
         Producto.name = "NIKE Sneakers New "
         Producto.price = 3700
         supertest(server)
            .put(urledit)
            .send(Producto)
            .expect(200, (req, res) => {
               console.log(res.body)
               done()
            })
      })
   })

   describe("test borrar /DELETE", () => {
      it("debe eliminar un producto (segun el id).", (done) => {
         supertest(server)
            .delete(urldelete)
            .expect(200, (req, res) => {
               console.log(res.body)
               done()
            })
      })
   })
})
