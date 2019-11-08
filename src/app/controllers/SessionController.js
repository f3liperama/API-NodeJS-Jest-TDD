const { User } = require('../models');

class SessionController {
    async store(req, res) {

        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!User) {
            return res.status(401).send({ message: 'User not found.' });
        }

        if (!(await user.checkPassword(password))) {
            return res.status(401).send({ message: 'Incorrect password.' });
        }

        return res.json({
            user,
            token: user.generateToken()
        });
    }
}

module.exports = new SessionController();