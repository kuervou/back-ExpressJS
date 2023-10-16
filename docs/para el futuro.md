
# EN LO QUE QUEDÉ:
Revisar si con blob se banca el tamaño de la imagen base64.
Ver como hacer que tenga uno o varios item inventario asociado. 
Revisar mayusculas y minusculas en campos de modelos y migrations
CRUD ItemMenu - Item - Orden
Mostrarle la foto a gpt as ver que endpoints se le ocurren
"
Actúa como un experto en desarrollo de software con expressJS.

Realiza una implementación paso a paso para lograr un CRUD de itemMenu. EL modelo de item menu es el siguiente:
"
// src/models/itemMenu.js

'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class ItemMenu extends Model {
        static associate(models) {
            ItemMenu.belongsTo(models.Grupo, {
                foreignKey: 'grupoId',
                as: 'grupo',
            })
            ItemMenu.belongsToMany(models.ItemInventario, {
                through: 'ItemMenuInventario',
                foreignKey: 'itemMenuId',
            })

            ItemMenu.hasMany(models.Item, {
                foreignKey: 'itemMenuId',
                as: 'items',
            })
        }
    }

    ItemMenu.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            Nombre: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Descripcion: DataTypes.STRING,
            Precio: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            Imagen: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            Activo: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            grupoId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Grupos',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'ItemMenu',
            tableName: 'ItemsMenu',
            timestamps: true,
        }
    )

    return ItemMenu
}

"
A continuación te comparto la implementación de otra entidad de mi sistemas para que entiendas como estoy trabajando:
"
// src/models/categoria.js
'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class Categoria extends Model {
        static associate(models) {
            Categoria.hasMany(models.ItemInventario, {
                foreignKey: 'categoriaId',
            })
        }
    }
    Categoria.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nombre: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Categoria',
            tableName: 'Categorias',
        }
    )
    return Categoria
}

"
"
const { Categoria } = require('../models')
const { Op } = require('sequelize')

const categoriaRepository = {
    create: async (nombre) => {
        const nuevaCategoria = await Categoria.create({
            nombre,
        })
        return nuevaCategoria
    },
    findAll: async (options = {}) => {
        const { page = 1, limit = 10, nombre } = options

        const offset = (page - 1) * limit

        const whereConditions = {}
        if (nombre) {
            whereConditions.nombre = {
                [Op.like]: `%${nombre}%`, // Búsqueda insensible a mayúsculas/minúsculas
            }
        }

        const result = await Categoria.findAndCountAll({
            where: whereConditions,
            offset,
            limit,
            order: [['nombre', 'ASC']],
        })

        return {
            total: result.count,
            items: result.rows,
        }
    },

    update: async (id, nombre) => {
        return await Categoria.update({ nombre }, { where: { id: id } })
    },

    getCategoriaById: async (id) => {
        return await Categoria.findByPk(id)
    },

    deleteCategoria: async (id) => {
        return await Categoria.destroy({
            where: { id: id },
        })
    },

    findByNombre: async (nombre) => {
        return await Categoria.findOne({
            where: { nombre: nombre.toLowerCase() },
        })
    },
}

module.exports = categoriaRepository

"
"
const categoriaRepository = require('../repositories/categoriaRepository')
const { HttpError, HttpCode } = require('../error-handling/http_error')

//Función auxiliar para chequear unicidad del nombre
const checkNombreUnique = async (nombre, excludeId = null) => {
    const formattedNombre = nombre.toLowerCase()
    const existingCategoria =
        await categoriaRepository.findByNombre(formattedNombre)
    if (
        existingCategoria &&
        (!excludeId || existingCategoria.id !== excludeId)
    ) {
        throw new HttpError(
            HttpCode.CONFLICT,
            'Ya existe una categoría con ese nombre'
        )
    }
}

const categoriaService = {
    crearCategoria: async (nombre) => {
        await checkNombreUnique(nombre)
        return await categoriaRepository.create(nombre)
    },
    getCategorias: async function (options = {}) {
        return await categoriaRepository.findAll(options)
    },

    getCategoriaById: async (id) => {
        return await categoriaRepository.getCategoriaById(id)
    },

    updateCategoria: async (id, nombre) => {
        if (nombre) {
            await checkNombreUnique(nombre, id)
        }
        return await categoriaRepository.update(id, nombre)
    },

    deleteCategoria: async (id) => {
        return await categoriaRepository.deleteCategoria(id)
    },
}

module.exports = categoriaService

"
"
const categoriaService = require('../services/categoriaService')
const asyncHandler = require('express-async-handler')
const { HttpError, HttpCode } = require('../error-handling/http_error')

const categoriaController = {
    crearCategoria: asyncHandler(async (req, res) => {
        const { nombre } = req.body
        const nombreNormalizado = nombre.toLowerCase() //normalizamos el nombre
        await categoriaService.crearCategoria(nombreNormalizado)
        res.status(HttpCode.CREATED).json({ message: 'Categoria creada' })
    }),

    getCategorias: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const filterName = req.query.nombre || ''

        const categorias = await categoriaService.getCategorias({
            page,
            limit,
            nombre: filterName,
        })
        res.json(categorias)
    }),

    getCategoriaById: asyncHandler(async (req, res) => {
        const id = req.params.id

        const categoria = await categoriaService.getCategoriaById(id)

        if (!categoria) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Categoria no encontrada')
        }

        res.status(HttpCode.OK).json(categoria)
    }),

    updateCategoria: asyncHandler(async (req, res) => {
        const id = req.params.id
        let { nombre } = req.body
        nombre = nombre ? nombre.toLowerCase() : undefined //normalizamos el nombre
        const categoriaActualizada = await categoriaService.updateCategoria(
            id,
            nombre
        )

        if (categoriaActualizada[0] === 0) {
            // Si la cantidad de registros actualizados es 0
            throw new HttpError(HttpCode.NOT_FOUND, 'Categoria no encontrada')
        }

        res.status(HttpCode.OK).json({ message: 'Categoria actualizada' })
    }),

    deleteCategoria: asyncHandler(async (req, res) => {
        const id = req.params.id

        const resultado = await categoriaService.deleteCategoria(id)

        if (resultado === 0) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Categoria no encontrada')
        }

        res.status(HttpCode.OK).json({ message: 'Categoria eliminada' })
    }),
}

module.exports = categoriaController

"
"
const express = require('express')
const router = express.Router()
const categoriaController = require('../controllers/categoriaController')
const validate = require('../middleware/validate')
const {
    querySchema,
    categoriaSchema,
} = require('./validations/categoriaValidation')
const auth = require('../middleware/auth')
const { ROLES } = require('../routes/roles/roles')

router.post(
    '/categorias',
    [auth([ROLES.ADMIN]), validate(categoriaSchema)],
    categoriaController.crearCategoria
)
router.get(
    '/categorias',
    auth([ROLES.ADMIN]),
    validate(querySchema, 'query'),
    categoriaController.getCategorias
)
router.get(
    '/categorias/:id',
    auth([ROLES.ADMIN]),
    categoriaController.getCategoriaById
)
router.put(
    '/categorias/:id',
    [auth([ROLES.ADMIN]), validate(categoriaSchema)],
    categoriaController.updateCategoria
)
router.delete(
    '/categorias/:id',
    auth([ROLES.ADMIN]),
    categoriaController.deleteCategoria
)

module.exports = router

"
Utiliza las mejores practicas, patrones y tecnicas de software."


### OJO CON EL CAMPO ACTIVO: verificar el borrado logico (no dejar loguear a un usuario con el campo activo en false, y ver de implementar metodos para el borrado logico)




### LO QUE LE DIJE A GUZMAN:
- errores manejo y servicio nuevo
- url entorno
- fetchs

---
---

# Tareas
 
## Pendientes

- Documentar con comentarios.

- **Test automatizados**: Realizar casos más completos. se puedesn hacer test con diferentes tokens y diferentes roles

- Implementar manejo de error `404`.

- En `usuario routes`, cambiar por una regex de contraseña más segura.

- Usa helmet para proteger tu aplicación de algunas vulnerabilidades web conocidas.

- Usa express-rate-limit para limitar las solicitudes repetidas a la API y proteger contra ataques de fuerza bruta.

- Ver porque no anda el undo migrations
---

## Hecho

- Autenticación ✅
- Revisar las migraciones: corrección de la tabla con 'M' mayúsculas ✅
- Crear una especie de modularización para websocket ✅
- Mover la lógica que interactúa con la base de datos a una capa de "servicios" o "repositorios" ✅
- Enviar una respuesta con un código de estado HTTP que indique un error del lado del servidor (por ejemplo, 500) ✅
- **Validadores**: Utilizar bibliotecas como validator o joi para validar las entradas del usuario. Nunca confiar en los datos del cliente ✅
- Sanitización ✅
- Dockerización ✅
- Ejecutar con `node --watch`. ✅
- Utilizar scripts del `package.json`. ✅
- ¿Añadimos imágenes? ✅
- Ojo con los try-catch en mesaService. Hay que hacer como en el caso de los users que los errores se atrapan en el controller.  ✅
- **Migrar a Sequelize**: Usar Sequelize en lugar de SQL puro en los servicios. ✅
- DOCUMENTAR UN POCO LAS MIGRATIONS Y SUS COMANDOS ✅