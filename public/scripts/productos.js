let cartId;

const contenedorProductos = document.getElementById("productos");

document.addEventListener("DOMContentLoaded", () => {
    getData();
    getUser();
})


const getUser = async () => {
    try {
        const res = await fetch ("/idUsuario");
        const data = await res.json();
        getCart(data);
    } catch (e) {
        throw new Error(`Error ${e}`)
    };
};


const getCart = async (user) => {
    try {
        const res = await fetch (`api/carrito/idCarrito/${user}`);
        const data = await res.json();
        if (data._id === null) {
            createCart(user);
        } else {
            cartId = data._id;
        }
    }  catch (e) {
        throw new Error(`Error ${e}`)
    }
};


export const createCart = async () => {
    try {
        await fetch(`/api/carrito`, { method: "POST" });
        location.reload();
    } catch (e) {
        throw new Error(`Error ${e}`)
    }
};


const getData = async () => {
    try {
        const res = await fetch("/api/productos");
        const data = await res.json();
        showProducts(data);
    } catch (e) {
        throw new Error(`Error: ${e}`)
    }
};


export const showProducts = async (data) => {
    data.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML += `
            <img id="image${product._id}" src=${product.thumbnail}>
            <h5 class="name">${product.name}</h5>
            <p class="description">${product.description}</p>
            <p class="price">Precio: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <button class="boton-add" id="boton${product._id}">Agregar al carrito</button>
            `
        contenedorProductos.appendChild(div);
        const boton = document.getElementById(`boton${product._id}`)
        boton.addEventListener("click", () => {
            addProduct(product);
        });
    });
};


const addProduct = async (product) => {
    try {
        const producto = {
            timestamp:product.timestamp,
            id_prod: product._id,
            name: product.name,
            description: product.description,
            thumbnail: product.thumbnail,
            price: product.price,
            quantity: 1,
            stock: product.stock,
            category: product.category,
        }
        const url = `api/carrito/${cartId}/productos`;
        await fetch (url, {
            method: "POST",
            body: JSON.stringify(producto),
            headers: {
                "Content-Type": "application/json",
            }
        })
    } catch (e) {
        throw new Error(`Error: ${e}`)
    }
}

