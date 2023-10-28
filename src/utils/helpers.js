import {faker} from '@faker-js/faker';

//Desestructuración de Faker para obtener los métodos que necesitamos
const {database, commerce, string, image} = faker;

// Configuración de Faker para que genere productos random
export const generateRandomProducts = () => {
    return {
        id: database.mongodbObjectId(),
        title: commerce.productName(),
        description: commerce.productDescription(),
        price: parseFloat(commerce.price()),
        code: string.alphanumeric(7),
        stock: parseInt(string.numeric(3)),
        category: 'Comestibles',
        thumbnails: image.url(),
        status: true
    };
};




