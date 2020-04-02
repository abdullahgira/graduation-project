class UserService {
    
    constructor(User, SchemaValidation, GPError) {
        this.User = User;
        this.SchemaValidation = SchemaValidation;
        this.GPError = GPError;
    }

    async register(userDTO) {
        await this.SchemaValidation.validateNewUser(userDTO);
        const user = new this.User({
            ...userDTO,
            password: ''
        });

        user.password = await user.hashPassword(userDTO.password);
        await user.save();
        return user;
    }

    async login(userDTO) {
        await this.SchemaValidation.validateUserLogin(userDTO);
        
        const user = await this.User.findOne({ email: userDTO.email });
        if (!user) throw new this.GPError.InvalidCredentials();

        const isValidPassword = await user.validatePassword(userDTO.password, user.password);
        if (!isValidPassword) throw new this.GPError.InvalidCredentials();

        if (userDTO.role !== user.role) throw new this.GPError.InvalidCredentials();

        return user;
    }

}

module.exports = UserService;