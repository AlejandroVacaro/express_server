class UserDTO {
    constructor (user) {
        console.log('UserDTO');
        this.name = user.name;
        this.email = user.email;
    }
};

export default UserDTO;