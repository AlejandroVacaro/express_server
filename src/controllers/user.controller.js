import UserDTO from "../dao/models/user.dto.js";

router.get('/current', (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.json(userDTO);
});
