// DTO: Data Transfer Object (Objeto de transferencia de datos)
class UserDTO {
    constructor (user) {
        this.name = user.name;
        this.email = user.email;
    }
};

export default UserDTO;